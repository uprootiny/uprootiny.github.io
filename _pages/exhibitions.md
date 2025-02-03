---
layout: default
title: Exhibitions
permalink: /exhibitions/
---

# Exhibitions Showcase

<div class="gallery">
  {% assign exhibitions = site.static_files | where_exp: "file", "file.path contains '/exhibition2025/'" %}
  
  {% for image in exhibitions %}
    <div class="image-item">
      <img src="{{ image.path | relative_url }}" alt="Exhibition Image">
    </div>
  {% endfor %}
</div>

