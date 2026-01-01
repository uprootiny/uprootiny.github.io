// Levant Jobs Scraper
// Fetches and displays art/culture jobs from Israeli job boards
// Uses functional patterns inspired by ClojureScript
//
// Sources:
// - Government: Misrad HaTaasuka (שירות התעסוקה)
// - Academic: Bezalel Academy
// - Museums: ICOM Israel
// - General boards: AllJobs, Drushim, JobMaster, Taasiya, Muvtal
// - Art-specific: Artport Tel Aviv

(function() {
  'use strict';

  // ============================================================================
  // State (immutable-style updates)
  // ============================================================================

  const state = {
    jobs: [],
    loading: false,
    error: null,
    filter: { source: null, search: '', category: null }
  };

  // ============================================================================
  // Sources Configuration
  // ============================================================================

  const sources = [
    // Government Employment Service
    {
      id: 'taasuka',
      name: 'שירות התעסוקה',
      nameEn: 'Misrad HaTaasuka',
      url: 'https://www.taasuka.gov.il/he/Applicants/pages/jobs.aspx',
      description: 'Official government employment service (13,000+ jobs)',
      region: 'Nationwide',
      lang: 'he',
      category: 'government'
    },
    // Academic
    {
      id: 'bezalel',
      name: 'בצלאל',
      nameEn: 'Bezalel Academy',
      url: 'https://www.bezalel.ac.il/services/wrk4stud',
      description: 'Jobs for art students and graduates',
      region: 'Jerusalem',
      lang: 'he',
      category: 'academic'
    },
    // Museums
    {
      id: 'icom',
      name: 'ICOM Israel',
      nameEn: 'ICOM Israel Museums',
      url: 'https://www.icom.org.il/en/node/8',
      description: 'Museum jobs bulletin board',
      region: 'Nationwide',
      lang: 'en',
      category: 'museums'
    },
    // General job boards - Art categories
    {
      id: 'alljobs',
      name: 'AllJobs - אמנות',
      nameEn: 'AllJobs - Arts',
      url: 'https://www.alljobs.co.il/SearchResultsGuest.aspx?page=1&position=278',
      description: 'Largest Israeli job board, arts category',
      region: 'Nationwide',
      lang: 'he',
      category: 'general'
    },
    {
      id: 'drushim-art',
      name: 'Drushim - אמנות',
      nameEn: 'Drushim - Art',
      url: 'https://www.drushim.co.il/jobs/search/%D7%90%D7%9E%D7%A0%D7%95%D7%AA/',
      description: 'General board, art category',
      region: 'Nationwide',
      lang: 'he',
      category: 'general'
    },
    {
      id: 'jobmaster',
      name: 'JobMaster - בידור ומדיה',
      nameEn: 'JobMaster - Entertainment & Media',
      url: 'https://www.jobmaster.co.il/jobs/?q=%D7%90%D7%95%D7%9E%D7%A0%D7%95%D7%AA+%D7%91%D7%99%D7%93%D7%95%D7%A8+%D7%95%D7%9E%D7%93%D7%99%D7%94',
      description: 'Entertainment, arts, and media jobs',
      region: 'Nationwide',
      lang: 'he',
      category: 'general'
    },
    {
      id: 'taasiya',
      name: 'Taasiya - אמנות פלסטית',
      nameEn: 'Taasiya - Visual Arts',
      url: 'https://www.taasiya.co.il/jobs/?category=946&sub_category=951',
      description: 'Painting, sculpture, plastic arts',
      region: 'Nationwide',
      lang: 'he',
      category: 'art-specific'
    },
    {
      id: 'muvtal',
      name: 'Muvtal - תרבות ואמנות',
      nameEn: 'Muvtal - Arts & Culture',
      url: 'https://www.muvtal.co.il/jobs?filter_categories=25',
      description: 'Entertainment and culture sector',
      region: 'Nationwide',
      lang: 'he',
      category: 'art-specific'
    },
    // Art-specific
    {
      id: 'artport-il',
      name: 'Artport Tel Aviv',
      nameEn: 'Artport Tel Aviv',
      url: 'https://www.artport.art/residency/?lang=en',
      description: 'Artist residency program',
      region: 'Tel Aviv',
      lang: 'en',
      category: 'residency'
    }
  ];

  const categories = {
    government: { label: 'Government', labelHe: 'ממשלתי', icon: '🏛️' },
    academic: { label: 'Academic', labelHe: 'אקדמי', icon: '🎓' },
    museums: { label: 'Museums', labelHe: 'מוזיאונים', icon: '🏛️' },
    general: { label: 'Job Boards', labelHe: 'לוחות דרושים', icon: '📋' },
    'art-specific': { label: 'Art-Specific', labelHe: 'אמנות', icon: '🎨' },
    residency: { label: 'Residencies', labelHe: 'רזידנסי', icon: '🏠' }
  };

  // ============================================================================
  // CORS Proxies (fallback chain)
  // ============================================================================

  const corsProxies = [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  let currentProxyIndex = 0;

  const corsProxy = (url) => corsProxies[currentProxyIndex](url);

  const tryNextProxy = () => {
    currentProxyIndex = (currentProxyIndex + 1) % corsProxies.length;
  };

  // ============================================================================
  // DOM Parsing Helpers
  // ============================================================================

  const parseHTML = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  };

  const extractText = (el) => el ? el.textContent.trim().replace(/\s+/g, ' ') : '';

  const truncate = (str, len = 100) =>
    str.length > len ? str.slice(0, len) + '...' : str;

  // ============================================================================
  // Site-Specific Parsers
  // ============================================================================

  const parsers = {
    'taasuka': (doc, source) => {
      // Government site may block - graceful fallback
      const jobs = doc.querySelectorAll('.job-item, .job-row, tr[data-job], .result-item');
      if (jobs.length === 0) {
        return [{
          title: 'לוח משרות שירות התעסוקה',
          titleEn: 'Government Job Board',
          organization: 'שירות התעסוקה הישראלי',
          location: 'ארצי',
          type: 'link-only',
          note: '13,000+ positions - visit directly'
        }];
      }
      return Array.from(jobs).slice(0, 15).map(job => ({
        title: extractText(job.querySelector('.job-title, .title, h3, a')) || 'משרה',
        organization: extractText(job.querySelector('.company, .employer')) || 'מעסיק',
        location: extractText(job.querySelector('.location, .city')) || 'ישראל'
      })).filter(j => j.title.length > 2);
    },

    'bezalel': (doc, source) => {
      const items = doc.querySelectorAll('.views-row, .job-item, article, .node');
      if (items.length === 0) {
        return [{
          title: 'משרות לסטודנטים ובוגרים',
          titleEn: 'Student & Graduate Jobs',
          organization: 'בצלאל אקדמיה לאמנות ועיצוב',
          location: 'ירושלים',
          type: 'summary'
        }];
      }
      return Array.from(items).slice(0, 10).map(item => ({
        title: extractText(item.querySelector('h2, h3, .title, a')) || 'משרה',
        organization: 'Bezalel Academy',
        location: 'Jerusalem'
      })).filter(j => j.title.length > 3);
    },

    'icom': (doc, source) => {
      const rows = doc.querySelectorAll('table tr, .views-row, article, .node');
      if (rows.length < 2) {
        return [{
          title: 'Museum Jobs Bulletin',
          organization: 'ICOM Israel',
          location: 'Nationwide',
          type: 'summary',
          note: 'Major museums: Israel Museum, Tel Aviv Museum, Yad Vashem'
        }];
      }
      return Array.from(rows).slice(1, 12).map(row => {
        const cells = row.querySelectorAll('td');
        const links = row.querySelectorAll('a');
        return {
          title: extractText(cells[0] || links[0]) || truncate(extractText(row), 60),
          organization: extractText(cells[1]) || 'Museum',
          location: extractText(cells[2]) || 'Israel'
        };
      }).filter(j => j.title && j.title.length > 3);
    },

    'alljobs': (doc, source) => {
      const jobs = doc.querySelectorAll('.job-item, .result-item, .job-listing, article');
      if (jobs.length === 0) {
        return [{
          title: 'משרות אמנות ועיצוב',
          titleEn: 'Art & Design Jobs',
          organization: 'AllJobs',
          type: 'link-only'
        }];
      }
      return Array.from(jobs).slice(0, 10).map(job => ({
        title: extractText(job.querySelector('.job-title, h2, h3, a')) || 'משרה',
        organization: extractText(job.querySelector('.company, .employer')) || 'מעסיק',
        location: extractText(job.querySelector('.location')) || 'ישראל'
      })).filter(j => j.title.length > 2);
    },

    'jobmaster': (doc, source) => {
      const jobs = doc.querySelectorAll('.job-item, .job-card, article, .listing');
      if (jobs.length === 0) {
        return [{
          title: 'משרות אומנות בידור ומדיה',
          titleEn: 'Entertainment & Media Jobs',
          organization: 'JobMaster',
          type: 'link-only'
        }];
      }
      return Array.from(jobs).slice(0, 10).map(job => ({
        title: extractText(job.querySelector('.job-title, h2, h3, a')) || 'משרה',
        organization: extractText(job.querySelector('.company')) || 'מעסיק',
        location: extractText(job.querySelector('.location')) || 'ישראל'
      })).filter(j => j.title.length > 2);
    },

    'default': (doc, source) => {
      const selectors = [
        '.job-item', '.job-listing', '.job-card', '.result-item',
        'article', '.views-row', '.listing', '.node', 'li.job'
      ];
      const candidates = doc.querySelectorAll(selectors.join(', '));

      if (candidates.length === 0) {
        return [{
          title: `Visit ${source.nameEn || source.name}`,
          organization: source.name,
          location: source.region,
          type: 'link-only'
        }];
      }

      return Array.from(candidates).slice(0, 8).map(el => ({
        title: extractText(el.querySelector('h2, h3, h4, a, .title')) ||
               truncate(extractText(el), 80),
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
      console.error(`Parse error for ${source.id}:`, e);
      return [{
        title: `Could not parse - visit directly`,
        organization: source.name,
        type: 'error'
      }];
    }
  };

  // ============================================================================
  // Fetching
  // ============================================================================

  const fetchSource = async (source) => {
    try {
      const response = await fetch(corsProxy(source.url), {
        headers: { 'Accept': 'text/html' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Check if we got actual content
      if (html.length < 100 || html.includes('Access Denied') || html.includes('403')) {
        throw new Error('Access blocked');
      }

      const jobs = parseJobs(html, source);
      return jobs.map(j => ({
        ...j,
        sourceId: source.id,
        sourceName: source.name,
        sourceNameEn: source.nameEn,
        sourceUrl: source.url,
        sourceCategory: source.category
      }));

    } catch (e) {
      console.warn(`Failed to fetch ${source.nameEn || source.name}:`, e.message);
      return [{
        title: source.lang === 'he' ? 'לחץ לצפייה באתר' : 'Visit site for listings',
        organization: source.name,
        location: source.region,
        sourceId: source.id,
        sourceName: source.name,
        sourceNameEn: source.nameEn,
        sourceUrl: source.url,
        sourceCategory: source.category,
        type: 'link-only'
      }];
    }
  };

  const fetchAllSources = async () => {
    state.loading = true;
    state.jobs = [];
    state.error = null;
    render();

    // Fetch in parallel with Promise.allSettled for resilience
    const results = await Promise.allSettled(sources.map(fetchSource));

    state.jobs = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .flat();

    state.loading = false;
    render();
  };

  // ============================================================================
  // Filtering
  // ============================================================================

  const filterJobs = (jobs, filter) => {
    return jobs.filter(job => {
      if (filter.source && job.sourceId !== filter.source) return false;
      if (filter.category && job.sourceCategory !== filter.category) return false;
      if (filter.search) {
        const term = filter.search.toLowerCase();
        const searchable = [
          job.title, job.titleEn, job.organization, job.location
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(term)) return false;
      }
      return true;
    });
  };

  // ============================================================================
  // Rendering
  // ============================================================================

  const renderSourceCards = () => {
    const byCategory = {};
    sources.forEach(s => {
      if (!byCategory[s.category]) byCategory[s.category] = [];
      byCategory[s.category].push(s);
    });

    return Object.entries(byCategory).map(([cat, srcs]) => {
      const catMeta = categories[cat] || { label: cat, icon: '📌' };
      return `
        <div class="source-category">
          <h4>${catMeta.icon} ${catMeta.label}</h4>
          <div class="source-cards">
            ${srcs.map(s => `
              <a href="${s.url}" target="_blank" rel="noopener" class="source-card">
                <div class="source-name">${s.name}</div>
                <div class="source-name-en">${s.nameEn}</div>
                <div class="source-desc">${s.description}</div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  };

  const renderFilters = () => `
    <div class="filters">
      <div class="filter-group">
        <label for="job-search">חיפוש / Search</label>
        <input type="text" id="job-search" placeholder="חפש משרות..."
               value="${state.filter.search}">
      </div>
      <div class="filter-group">
        <label for="job-category">קטגוריה / Category</label>
        <select id="job-category">
          <option value="">All Categories</option>
          ${Object.entries(categories).map(([key, meta]) => `
            <option value="${key}" ${state.filter.category === key ? 'selected' : ''}>
              ${meta.icon} ${meta.label}
            </option>
          `).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label for="job-source">מקור / Source</label>
        <select id="job-source">
          <option value="">All Sources</option>
          ${sources.map(s => `
            <option value="${s.id}" ${state.filter.source === s.id ? 'selected' : ''}>
              ${s.nameEn}
            </option>
          `).join('')}
        </select>
      </div>
      <button id="refresh-jobs" class="refresh-btn" ${state.loading ? 'disabled' : ''}>
        ${state.loading ? 'טוען...' : 'רענן / Refresh'}
      </button>
    </div>
  `;

  const renderJobCard = (job) => {
    const catMeta = categories[job.sourceCategory] || { icon: '📌' };
    return `
      <div class="job-card ${job.type || 'job'}" dir="${job.title && /[\u0590-\u05FF]/.test(job.title) ? 'rtl' : 'ltr'}">
        <div class="job-header">
          <span class="job-cat-icon">${catMeta.icon}</span>
          <span class="job-title">${job.title}</span>
        </div>
        ${job.titleEn ? `<div class="job-title-en">${job.titleEn}</div>` : ''}
        ${job.organization ? `<div class="job-org">${job.organization}</div>` : ''}
        ${job.location ? `<div class="job-location">📍 ${job.location}</div>` : ''}
        ${job.note ? `<div class="job-note">${job.note}</div>` : ''}
        <div class="job-source">
          <a href="${job.sourceUrl}" target="_blank" rel="noopener">
            ${job.sourceNameEn || job.sourceName} →
          </a>
        </div>
      </div>
    `;
  };

  const renderJobList = () => {
    const filtered = filterJobs(state.jobs, state.filter);

    if (state.loading) {
      return '<div class="loading">טוען משרות... / Fetching jobs...</div>';
    }

    if (filtered.length === 0 && state.jobs.length === 0) {
      return `
        <div class="empty">
          <p>לחץ <strong>רענן</strong> לטעינת משרות</p>
          <p>Click <strong>Refresh</strong> to fetch job listings</p>
        </div>
      `;
    }

    if (filtered.length === 0) {
      return '<div class="empty">No matching jobs found / לא נמצאו משרות</div>';
    }

    return `
      <div class="job-count">${filtered.length} listings / משרות</div>
      <div class="job-grid">
        ${filtered.map(renderJobCard).join('')}
      </div>
    `;
  };

  const render = () => {
    const container = document.getElementById('levant-jobs-app');
    if (!container) return;

    container.innerHTML = `
      <div class="levant-jobs-header">
        <h2>לוח משרות / Job Listings</h2>
        <p class="subtitle">Aggregated from Israeli art, culture & government job boards</p>
      </div>

      <h3>מקורות / Sources</h3>
      <div class="source-categories">
        ${renderSourceCards()}
      </div>

      <h3>משרות / Listings</h3>
      ${renderFilters()}
      <div class="job-list">
        ${renderJobList()}
      </div>

      <div class="disclaimer">
        <p>🔄 Data fetched via CORS proxy at usage time.</p>
        <p>Some sites may block automated access - visit sources directly for authoritative listings.</p>
        <p>נתונים נשלפים בזמן אמת. חלק מהאתרים עשויים לחסום גישה אוטומטית.</p>
      </div>
    `;

    // Event listeners
    document.getElementById('job-search')?.addEventListener('input', (e) => {
      state.filter.search = e.target.value;
      render();
    });

    document.getElementById('job-category')?.addEventListener('change', (e) => {
      state.filter.category = e.target.value || null;
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
  };

  // Expose to global scope
  window.LevantJobs = { init, fetchAllSources, state, sources };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
