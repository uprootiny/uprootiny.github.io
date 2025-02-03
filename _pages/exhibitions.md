---
layout: default
title: Exhibitions
permalink: /exhibitions/
---

# Exhibitions Showcase

{% assign exhibitions = site.static_files | where_exp: "file", "file.path contains '/exhibition2025/'" %}

<div class="gallery">
{% for image in exhibitions %}
    <div class="image-item">
        <img src="{{ site.baseurl }}{{ image.path | relative_url }}" alt="Exhibition Image">
    </div>
{% endfor %}
</div>


