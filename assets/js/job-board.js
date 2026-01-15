// Job Board - Functional, immutable-style JavaScript
// Inspired by ClojureScript patterns

(function() {
  'use strict';

  // State atom
  const state = {
    sources: [],
    filters: {
      category: null,
      region: null,
      search: ''
    }
  };

  // Pure functions
  const filterByCategory = (sources, category) =>
    category ? sources.filter(s => s.categories.includes(category)) : sources;

  const filterByRegion = (sources, region) =>
    region ? sources.filter(s => s.region === region) : sources;

  const filterBySearch = (sources, search) => {
    if (!search) return sources;
    const term = search.toLowerCase();
    return sources.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  };

  const applyFilters = (sources, filters) =>
    filterBySearch(
      filterByRegion(
        filterByCategory(sources, filters.category),
        filters.region
      ),
      filters.search
    );

  // Category/region metadata
  const categories = {
    residency: { label: 'Residencies', icon: '🏠' },
    teaching: { label: 'Teaching', icon: '🎓' },
    curatorial: { label: 'Curatorial', icon: '🖼️' },
    commission: { label: 'Commissions', icon: '🎨' },
    grant: { label: 'Grants', icon: '💰' },
    exhibition: { label: 'Exhibitions', icon: '🖼️' },
    competition: { label: 'Competitions', icon: '🏆' },
    museum: { label: 'Museum', icon: '🏛️' },
    research: { label: 'Research', icon: '🔬' }
  };

  const regions = {
    international: { label: 'International' },
    europe: { label: 'Europe' },
    netherlands: { label: 'Netherlands' },
    the_hague: { label: 'The Hague' },
    amsterdam: { label: 'Amsterdam' },
    groningen: { label: 'Groningen' },
    japan: { label: 'Japan' }
  };

  // Render functions
  const renderCategoryBadge = (cat) => {
    const meta = categories[cat] || { label: cat, icon: '📌' };
    return `<span class="badge badge-${cat}">${meta.icon} ${meta.label}</span>`;
  };

  const renderSource = (source) => `
    <div class="job-source" data-categories="${source.categories.join(',')}" data-region="${source.region}">
      <div class="source-header">
        <a href="${source.url}" target="_blank" rel="noopener" class="source-name">${source.name}</a>
        <span class="source-region">${regions[source.region]?.label || source.region}</span>
      </div>
      <p class="source-description">${source.description}</p>
      <div class="source-categories">
        ${source.categories.map(renderCategoryBadge).join('')}
      </div>
      <div class="source-meta">
        <span class="update-freq">Updates: ${source.update_frequency.replace('_', ' ')}</span>
        <a href="${source.url}" target="_blank" class="visit-btn">Visit →</a>
      </div>
    </div>
  `;

  const renderSourceList = (sources) => {
    const container = document.getElementById('job-sources');
    if (!container) return;

    if (sources.length === 0) {
      container.innerHTML = '<p class="no-results">No sources match your filters.</p>';
      return;
    }

    container.innerHTML = sources.map(renderSource).join('');
  };

  const renderFilters = () => {
    const container = document.getElementById('job-filters');
    if (!container) return;

    container.innerHTML = `
      <div class="filter-group">
        <label for="search-input">Search</label>
        <input type="text" id="search-input" placeholder="Search sources..." value="${state.filters.search}">
      </div>

      <div class="filter-group">
        <label for="category-select">Category</label>
        <select id="category-select">
          <option value="">All Categories</option>
          ${Object.entries(categories).map(([key, meta]) =>
            `<option value="${key}" ${state.filters.category === key ? 'selected' : ''}>${meta.icon} ${meta.label}</option>`
          ).join('')}
        </select>
      </div>

      <div class="filter-group">
        <label for="region-select">Region</label>
        <select id="region-select">
          <option value="">All Regions</option>
          ${Object.entries(regions).map(([key, meta]) =>
            `<option value="${key}" ${state.filters.region === key ? 'selected' : ''}>${meta.label}</option>`
          ).join('')}
        </select>
      </div>

      <button id="clear-filters" class="clear-btn">Clear Filters</button>
    `;

    // Attach event listeners
    document.getElementById('search-input').addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      render();
    });

    document.getElementById('category-select').addEventListener('change', (e) => {
      state.filters.category = e.target.value || null;
      render();
    });

    document.getElementById('region-select').addEventListener('change', (e) => {
      state.filters.region = e.target.value || null;
      render();
    });

    document.getElementById('clear-filters').addEventListener('click', () => {
      state.filters = { category: null, region: null, search: '' };
      render();
    });
  };

  const renderStats = (filtered, total) => {
    const container = document.getElementById('job-stats');
    if (!container) return;

    container.innerHTML = `
      <span class="stat-count">Showing ${filtered} of ${total} sources</span>
    `;
  };

  const render = () => {
    const filtered = applyFilters(state.sources, state.filters);
    renderFilters();
    renderSourceList(filtered);
    renderStats(filtered.length, state.sources.length);
  };

  // Initialize
  const init = (sources) => {
    state.sources = sources;
    render();
  };

  // Expose to global scope for Jekyll data injection
  window.JobBoard = { init };
})();
