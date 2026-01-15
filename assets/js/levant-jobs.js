// Levant Jobs Scraper — Improved
// Fetches job listings from Israeli/Palestinian art sources
// Uses multiple CORS proxies with fallback, RSS where available

(function() {
  'use strict';

  // State
  const state = {
    jobs: [],
    loading: false,
    errors: [],
    lastFetch: null
  };

  // Sources — prioritized by reliability
  const sources = [
    // RSS feeds (most reliable)
    {
      id: 'artis-rss',
      name: 'Artis Open Calls',
      nameHe: 'ארטיס',
      url: 'https://artis.art/grants_and_open_calls',
      type: 'page',
      category: 'grants',
      reliable: true
    },
    // Static/simple pages (more reliable)
    {
      id: 'bezalel',
      name: 'Bezalel Academy',
      nameHe: 'בצלאל',
      url: 'https://www.bezalel.ac.il/services/wrk4stud',
      type: 'page',
      category: 'academic',
      reliable: true
    },
    {
      id: 'icom',
      name: 'ICOM Israel Museums',
      nameHe: 'איקום',
      url: 'https://www.icom.org.il/en/node/8',
      type: 'page',
      category: 'museums',
      reliable: true
    },
    // General job boards (less reliable due to JS rendering)
    {
      id: 'alljobs',
      name: 'AllJobs Arts',
      nameHe: 'אולג\'ובס אמנות',
      url: 'https://www.alljobs.co.il/SearchResultsGuest.aspx?page=1&position=278',
      type: 'page',
      category: 'general',
      reliable: false
    },
    {
      id: 'drushim',
      name: 'Drushim Art',
      nameHe: 'דרושים אמנות',
      url: 'https://www.drushim.co.il/jobs/search/%D7%90%D7%9E%D7%A0%D7%95%D7%AA/',
      type: 'page',
      category: 'general',
      reliable: false
    },
    // Government (usually blocked)
    {
      id: 'taasuka',
      name: 'Misrad HaTaasuka',
      nameHe: 'שירות התעסוקה',
      url: 'https://www.taasuka.gov.il/he/Applicants/pages/jobs.aspx',
      type: 'page',
      category: 'government',
      reliable: false
    }
  ];

  // CORS proxies — try in order
  const corsProxies = [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  // Helpers
  const parseHTML = html => new DOMParser().parseFromString(html, 'text/html');
  const text = el => el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
  const truncate = (s, n = 80) => s.length > n ? s.slice(0, n) + '...' : s;
  const isHebrew = s => /[\u0590-\u05FF]/.test(s);

  // Fetch with CORS proxy fallback
  async function fetchWithProxy(url, proxyIndex = 0) {
    if (proxyIndex >= corsProxies.length) {
      throw new Error('All proxies failed');
    }

    try {
      const proxyUrl = corsProxies[proxyIndex](url);
      const response = await fetch(proxyUrl, {
        headers: { 'Accept': 'text/html,application/xhtml+xml' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();

      // Check for blocked responses
      if (html.length < 200 ||
          html.includes('Access Denied') ||
          html.includes('403 Forbidden') ||
          html.includes('blocked') ||
          html.includes('captcha')) {
        throw new Error('Access blocked');
      }

      return html;
    } catch (e) {
      console.warn(`Proxy ${proxyIndex} failed for ${url}:`, e.message);
      return fetchWithProxy(url, proxyIndex + 1);
    }
  }

  // Site-specific parsers
  const parsers = {
    'bezalel': doc => {
      const items = doc.querySelectorAll('.views-row, .job-item, article, .node, li');
      const jobs = [];

      items.forEach(item => {
        const title = text(item.querySelector('h2, h3, h4, a, .title'));
        if (title && title.length > 5) {
          jobs.push({
            title: truncate(title, 100),
            org: 'Bezalel Academy',
            location: 'Jerusalem'
          });
        }
      });

      return jobs.length > 0 ? jobs.slice(0, 10) : null;
    },

    'icom': doc => {
      const rows = doc.querySelectorAll('table tr, .views-row, article');
      const jobs = [];

      rows.forEach((row, i) => {
        if (i === 0) return; // Skip header
        const cells = row.querySelectorAll('td');
        const links = row.querySelectorAll('a');

        const title = text(cells[0] || links[0]) || text(row);
        if (title && title.length > 5 && !title.toLowerCase().includes('position')) {
          jobs.push({
            title: truncate(title, 100),
            org: text(cells[1]) || 'Museum',
            location: text(cells[2]) || 'Israel'
          });
        }
      });

      return jobs.length > 0 ? jobs.slice(0, 10) : null;
    },

    'default': (doc, source) => {
      // Generic parser - look for common job listing patterns
      const selectors = [
        '.job-item', '.job-listing', '.result-item', '.job-card',
        'article', '.views-row', '.listing', 'li.job', '.vacancy'
      ];

      const items = doc.querySelectorAll(selectors.join(', '));
      const jobs = [];

      items.forEach(item => {
        const title = text(item.querySelector('h2, h3, h4, a, .title, .job-title'));
        if (title && title.length > 5) {
          jobs.push({
            title: truncate(title, 100),
            org: text(item.querySelector('.company, .employer, .org')) || source.name,
            location: text(item.querySelector('.location, .city')) || 'Israel'
          });
        }
      });

      return jobs.length > 0 ? jobs.slice(0, 8) : null;
    }
  };

  // Fetch and parse a source
  async function fetchSource(source) {
    try {
      const html = await fetchWithProxy(source.url);
      const doc = parseHTML(html);

      const parser = parsers[source.id] || parsers.default;
      const jobs = parser(doc, source);

      if (jobs && jobs.length > 0) {
        return {
          source,
          status: 'success',
          jobs: jobs.map(j => ({ ...j, sourceId: source.id, sourceName: source.name }))
        };
      } else {
        return {
          source,
          status: 'empty',
          jobs: []
        };
      }
    } catch (e) {
      console.warn(`Failed to fetch ${source.name}:`, e.message);
      return {
        source,
        status: 'error',
        error: e.message,
        jobs: []
      };
    }
  }

  // Fetch all sources
  async function fetchAll() {
    state.loading = true;
    state.jobs = [];
    state.errors = [];
    render();

    const results = await Promise.allSettled(sources.map(fetchSource));

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { source, status, jobs, error } = result.value;

        if (status === 'success') {
          state.jobs.push(...jobs);
        } else if (status === 'error') {
          state.errors.push({ source: source.name, error });
        }
      }
    });

    state.loading = false;
    state.lastFetch = new Date();
    render();
  }

  // Render
  function render() {
    const container = document.getElementById('levant-jobs-app');
    if (!container) return;

    const successCount = state.jobs.length;
    const errorCount = state.errors.length;

    container.innerHTML = `
      <div class="levant-jobs">
        <div class="jobs-header">
          <h3>Live Job Listings</h3>
          <button class="refresh-btn" ${state.loading ? 'disabled' : ''} onclick="LevantJobs.refresh()">
            ${state.loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        ${state.loading ? `
          <div class="jobs-loading">
            <div class="spinner"></div>
            <p>Fetching from ${sources.length} sources...</p>
          </div>
        ` : ''}

        ${!state.loading && state.jobs.length === 0 && state.lastFetch === null ? `
          <div class="jobs-empty">
            <p>Click <strong>Refresh</strong> to fetch live job listings.</p>
            <p class="jobs-note">Note: Some Israeli sites block automated access.
               Use the direct links above for the most reliable results.</p>
          </div>
        ` : ''}

        ${!state.loading && state.jobs.length > 0 ? `
          <div class="jobs-count">${successCount} listings found</div>
          <div class="jobs-list">
            ${state.jobs.map(job => `
              <div class="job-item" dir="${isHebrew(job.title) ? 'rtl' : 'ltr'}">
                <div class="job-title">${job.title}</div>
                <div class="job-meta">
                  <span class="job-org">${job.org}</span>
                  ${job.location ? `<span class="job-location">📍 ${job.location}</span>` : ''}
                </div>
                <div class="job-source">via ${job.sourceName}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${!state.loading && state.lastFetch && state.jobs.length === 0 ? `
          <div class="jobs-empty">
            <p>No listings could be fetched. Sites may be blocking automated access.</p>
            <p>Please use the direct links above to browse job boards.</p>
          </div>
        ` : ''}

        ${!state.loading && state.errors.length > 0 ? `
          <details class="jobs-errors">
            <summary>${errorCount} source${errorCount > 1 ? 's' : ''} unavailable</summary>
            <ul>
              ${state.errors.map(e => `<li><strong>${e.source}</strong>: ${e.error}</li>`).join('')}
            </ul>
          </details>
        ` : ''}

        ${state.lastFetch ? `
          <div class="jobs-footer">
            Last updated: ${state.lastFetch.toLocaleTimeString()}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Initialize
  function init() {
    render();
  }

  // Expose API
  window.LevantJobs = {
    init,
    refresh: fetchAll,
    state,
    sources
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
