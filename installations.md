---
layout: text
title: Installation Views
permalink: /installations/
---
<div class="image-container">
  {% for file in site.static_files %}
    {% if file.path contains '/installation2025/' %}
      {% assign ext = file.extname | downcase %}
      {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' %}
        <div class="image-item">
          <img src="{{ file.path | relative_url }}" alt="{{ file.basename }}" loading="lazy" onload="this.classList.add('loaded')">
        </div>
      {% endif %}
    {% endif %}
  {% endfor %}
</div>
