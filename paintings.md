---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% assign images = site.static_files | where: "path", "paintings/" | sort: "path" | reverse %}
  {% for image in images %}
    {% assign filename_parts = image.basename | split: " " %}
    {% assign year = filename_parts[0] %}
    {% assign title = filename_parts | slice: 1 | join: " " %}

    {% assign image_data = site.paintings_data | where: "filename", image.basename %}
    {% assign dimensions = image_data[0].dimensions | default: "220x120cm" %}

    <div class="image-item">
      <img src="{{ site.baseurl }}{{ image.path }}" alt="{{ title }}">
      <h2 class="image-title">{{ title }}</h2>
      <h2 class="image-year">{{ year }}</h2>
      <p class="image-dimensions">{{ dimensions }}</p>
      <br/>
    </div>
  {% endfor %}
</div>
