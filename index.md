---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% assign paintings_data = site.data.titles %}
  
  {% assign paintings = site.static_files %}
  
  {% assign filtered_paintings = "" | split: "" %}
  
  {% for file in paintings %}
    {% if file.path contains '/paintings/' and file.extname == '.jpg' %}
      {% assign filtered_paintings = filtered_paintings | push: file %}
    {% endif %}
  {% endfor %}
  
  {% assign sorted_paintings = filtered_paintings | sort: "path" %}
  
  {% for painting_file in sorted_paintings %}
    {% assign filename = painting_file.name %}
    
    {% assign parts = filename | split: ' ' %}
    {% assign year_str = parts[0] %}
    {% assign year = year_str | plus: 0 %}
    {% assign title_parts = parts | slice: 1, parts.size %}
    {% assign raw_title = title_parts | join: ' ' %}
    {% assign title = raw_title | remove: '.jpg' %}
    
    {% assign meta = nil %}
    {% for entry in paintings_data %}
      {% if entry.year == year and entry.title == title %}
        {% assign meta = entry %}
        {% break %}
      {% endif %}
    {% endfor %}
    
    {% if meta %}
      {% assign dimensions = meta.dimensions %}
    {% else %}
      {% assign dimensions = "unknown" %}
    {% endif %}
    
    <div class="image-item">
      <img src="{{ painting_file.path | relative_url }}" alt="{{ title }}" loading="lazy" />
      <div class="image-title-year">
        <div class="image-title">{{ title }}</div>
        <div class="image-dimensions">{{ dimensions }}</div>
        <div class="image-year">{{ year }}</div>
      </div>
    </div>
  {% endfor %}
</div>
