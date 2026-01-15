---
layout: text
title: Job Board
permalink: /jobs/
---

<link rel="stylesheet" href="{{ '/assets/css/job-board.css' | relative_url }}">

# Art Jobs & Opportunities

*Live directory of job boards, open calls, and opportunities for visual artists.*

---

<div class="quick-links">
  <a href="https://www.e-flux.com/announcements/" target="_blank" class="quick-link">
    <span class="quick-link-icon">📢</span>
    <span class="quick-link-label">e-flux</span>
  </a>
  <a href="https://resartis.org/open-calls/" target="_blank" class="quick-link">
    <span class="quick-link-icon">🏠</span>
    <span class="quick-link-label">Res Artis</span>
  </a>
  <a href="https://www.transartists.org/en/transartists-calls" target="_blank" class="quick-link">
    <span class="quick-link-icon">🌍</span>
    <span class="quick-link-label">TransArtists</span>
  </a>
  <a href="https://www.mondriaanfonds.nl/en/apply-for-a-grant/" target="_blank" class="quick-link">
    <span class="quick-link-icon">💰</span>
    <span class="quick-link-label">Mondriaan Fund</span>
  </a>
</div>

---

<div class="job-board">
  <div id="job-filters"></div>
  <div id="job-stats"></div>
  <div id="job-sources"></div>
</div>

<script src="{{ '/assets/js/job-board.js' | relative_url }}"></script>
<script>
  // Initialize with data from Jekyll
  document.addEventListener('DOMContentLoaded', function() {
    const sources = [
      {% for source in site.data.job_sources.sources %}
      {
        name: "{{ source.name }}",
        url: "{{ source.url }}",
        categories: {{ source.categories | jsonify }},
        region: "{{ source.region }}",
        description: "{{ source.description }}",
        update_frequency: "{{ source.update_frequency }}"
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    window.JobBoard.init(sources);
  });
</script>

---

## How to Use This Page

1. **Filter by category** — Find residencies, teaching jobs, grants, etc.
2. **Filter by region** — Focus on Netherlands, Europe, or international
3. **Search** — Type keywords to find specific opportunities
4. **Visit** — Click through to the original source for current listings

---

## Tips for Job Hunting

**Check regularly** — Most sources update daily or weekly

**Set up alerts** — Many platforms offer email notifications

**Follow on social** — e-flux, TransArtists, and others post on Twitter/Instagram

**Network** — ICI The Hague, Res Artis conferences, and artist-run spaces often share opportunities informally

---

*This page aggregates sources — always verify deadlines and requirements on the original sites.*
