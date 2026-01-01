// Levant Jobs Scraper
// Fetches and displays art/culture jobs from Israeli job boards
// Uses functional patterns inspired by ClojureScript

(function() {
  'use strict';

  // ============================================================================
  // State
  // ============================================================================

  const state = {
    jobs: [],
    loading: false,
    error: null,
    filter: { source: null, search: '' }
  };

  // ============================================================================
  // Sources Configuration
  // ============================================================================

  const sources = [
    {
      id: 'bezalel',
      name: 'Bezalel Academy',
      url: 'https://www.bezalel.ac.il/services/wrk4stud',
      description: 'Jobs for art students and graduates',
      region: 'Jerusalem',
      lang: 'he'
    },
    {
      id: 'icom',
      name: 'ICOM Israel Museums',
      url: 'https://www.icom.org.il/en/node/8',
      description: 'Museum jobs bulletin board',
      region: 'Nationwide',
      lang: 'en'
    },
    {
      id: 'drushim-art',
      name: 'Drushim - Art Jobs',
      url: 'https://www.drushim.co.il/jobs/search/%D7%90%D7%9E%D7%A0%D7%95%D7%AA/',
      description: 'General board, art category',
      region: 'Nationwide',
      lang: 'he'
    },
    {
      id: 'taasiya',
      name: 'Taasiya - Visual Arts',
      url: 'https://www.taasiya.co.il/jobs/?category=946&sub_category=951',
      description: 'Painting, sculpture, plastic arts',
      region: 'Nationwide',
      lang: 'he'
    },
    {
      id: 'muvtal',
      name: 'Muvtal - Arts & Culture',
      url: 'https://www.muvtal.co.il/jobs?filter_categories=25',
      description: 'Entertainment and culture',
      region: 'Nationwide',
      lang: 'he'
    },
    {
      id: 'artport-il',
      name: 'Artport Tel Aviv',
      url: 'https://www.artport.art/residency/?lang=en',
      description: 'Residency program',
      region: 'Tel Aviv',
      lang: 'en'
    }
  ];

  // ============================================================================
  // CORS Proxy
  // ============================================================================

  const corsProxy = (url) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  // ============================================================================
  // DOM Parsing Helpers
  // ============================================================================

  const parseHTML = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  };

  const extractText = (el) => el ? el.textContent.trim() : '';

  // ============================================================================
  // Site-Specific Parsers
  // ============================================================================

  const parsers = {
    'bezalel': (doc) => {
      // Bezalel uses Hebrew content, look for job items
      const items = doc.querySelectorAll('.views-row, .job-item, article');
      if (items.length === 0) {
        return [{
          title: 'Multiple positions available',
          organization: 'Bezalel Academy',
          location: 'Jerusalem',
          type: 'summary'
        }];
      }
      return Array.from(items).slice(0, 10).map(item => ({
        title: extractText(item.querySelector('h2, h3, .title, a')) || 'Position available',
        organization: 'Bezalel Academy',
        location: 'Jerusalem'
      }));
    },

    'icom': (doc) => {
      const rows = doc.querySelectorAll('table tr, .views-row, article');
      if (rows.length < 2) {
        return [{
          title: 'Museum jobs - visit site for listings',
          organization: 'ICOM Israel',
          type: 'summary'
        }];
      }
      return Array.from(rows).slice(1, 11).map(row => {
        const cells = row.querySelectorAll('td');
        const links = row.querySelectorAll('a');
        return {
          title: extractText(cells[0] || links[0]) || extractText(row),
          organization: extractText(cells[1]) || 'Museum',
          location: extractText(cells[2]) || 'Israel'
        };
      }).filter(j => j.title && j.title.length > 3);
    },

    'default': (doc, source) => {
      // Generic parser: try to find job-like elements
      const candidates = doc.querySelectorAll(
        '.job-item, .job-listing, article, .views-row, .listing, li'
      );
      if (candidates.length === 0) {
        return [{
          title: `Visit ${source.name} for current listings`,
          organization: source.name,
          type: 'link-only'
        }];
      }
      return Array.from(candidates).slice(0, 8).map(el => ({
        title: extractText(el.querySelector('h2, h3, h4, a, .title')) ||
               extractText(el).slice(0, 80),
        organization: source.name,
        location: source.region
      })).filter(j => j.title && j.title.length > 5);
    }
  };

  const parseJobs = (html, source) => {
    try {
      const doc = parseHTML(html);
      const parser = parsers[source.id] || parsers.default;
      return parser(doc, source);
    } catch (e) {
      console.error('Parse error:', e);
      return [{
        title: 'Error parsing - visit source directly',
        type: 'error'
      }];
    }
  };

  // ============================================================================
  // Fetching
  // ============================================================================

  const fetchSource = async (source) => {
    try {
      const response = await fetch(corsProxy(source.url));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const jobs = parseJobs(html, source);
      return jobs.map(j => ({
        ...j,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.url
      }));
    } catch (e) {
      console.error(`Failed to fetch ${source.name}:`, e);
      return [{
        title: `Could not fetch - visit directly`,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.url,
        type: 'error'
      }];
    }
  };

  const fetchAllSources = async () => {
    state.loading = true;
    state.jobs = [];
    state.error = null;
    render();

    const results = await Promise.all(sources.map(fetchSource));
    state.jobs = results.flat();
    state.loading = false;
    render();
  };

  // ============================================================================
  // Filtering
  // ============================================================================

  const filterJobs = (jobs, filter) => {
    return jobs.filter(job => {
      if (filter.source && job.sourceId !== filter.source) return false;
      if (filter.search) {
        const term = filter.search.toLowerCase();
        const searchable = `${job.title} ${job.organization} ${job.location}`.toLowerCase();
        if (!searchable.includes(term)) return false;
      }
      return true;
    });
  };

  // ============================================================================
  // Rendering
  // ============================================================================

  const renderSourceCards = () => {
    return sources.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="source-card">
        <div class="source-name">${s.name}</div>
        <div class="source-region">${s.region}</div>
        <div class="source-desc">${s.description}</div>
        <div class="source-lang">${s.lang === 'he' ? 'עברית' : 'English'}</div>
      </a>
    `).join('');
  };

  const renderFilters = () => `
    <div class="filters">
      <div class="filter-group">
        <label for="job-search">Search</label>
        <input type="text" id="job-search" placeholder="Search jobs..."
               value="${state.filter.search}">
      </div>
      <div class="filter-group">
        <label for="job-source">Source</label>
        <select id="job-source">
          <option value="">All sources</option>
          ${sources.map(s => `
            <option value="${s.id}" ${state.filter.source === s.id ? 'selected' : ''}>
              ${s.name}
            </option>
          `).join('')}
        </select>
      </div>
      <button id="refresh-jobs" class="refresh-btn">
        ${state.loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>
  `;

  const renderJobCard = (job) => `
    <div class="job-card ${job.type || 'job'}">
      <div class="job-title">${job.title}</div>
      ${job.organization ? `<div class="job-org">${job.organization}</div>` : ''}
      ${job.location ? `<div class="job-location">📍 ${job.location}</div>` : ''}
      <div class="job-source">
        <a href="${job.sourceUrl}" target="_blank">via ${job.sourceName} →</a>
      </div>
    </div>
  `;

  const renderJobList = () => {
    const filtered = filterJobs(state.jobs, state.filter);

    if (state.loading) {
      return '<div class="loading">Fetching jobs from sources...</div>';
    }

    if (state.error) {
      return `<div class="error">${state.error}</div>`;
    }

    if (filtered.length === 0) {
      return `
        <div class="empty">
          No jobs loaded. Click <strong>Refresh</strong> to fetch from sources.
        </div>
      `;
    }

    return `
      <div class="job-count">${filtered.length} listings</div>
      ${filtered.map(renderJobCard).join('')}
    `;
  };

  const render = () => {
    const container = document.getElementById('levant-jobs-app');
    if (!container) return;

    container.innerHTML = `
      <h2>Live Job Listings</h2>
      <p class="subtitle">Aggregated from Israeli art & culture job boards</p>

      <h3>Quick Links to Sources</h3>
      <div class="source-grid">
        ${renderSourceCards()}
      </div>

      <h3>Aggregated Listings</h3>
      ${renderFilters()}
      <div class="job-list">
        ${renderJobList()}
      </div>

      <p class="disclaimer">
        Data fetched via CORS proxy. For authoritative info, visit sources directly.
        Some sites may block automated access.
      </p>
    `;

    // Attach event listeners
    document.getElementById('job-search')?.addEventListener('input', (e) => {
      state.filter.search = e.target.value;
      render();
    });

    document.getElementById('job-source')?.addEventListener('change', (e) => {
      state.filter.source = e.target.value || null;
      render();
    });

    document.getElementById('refresh-jobs')?.addEventListener('click', () => {
      if (!state.loading) fetchAllSources();
    });
  };

  // ============================================================================
  // Init
  // ============================================================================

  const init = () => {
    render();
    // Don't auto-fetch to avoid hammering sources on page load
    // User clicks Refresh when ready
  };

  // Expose init
  window.LevantJobs = { init, fetchAllSources };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
