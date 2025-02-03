---
layout: default
title: Exhibitions
permalink: /installations/
---

# Exhibitions Showcase

<div class="gallery">
  {% assign installations = site.static_files | where_exp: "file", "file.path contains '/installation2025/'" %}
  
  {% for image in installations %}
    <div class="image-item">
      <img src="{{ image.path | relative_url }}" alt="Exhibition Image">
    </div>
  {% endfor %}
</div>

