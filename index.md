---
layout: paintings
title: Paintings
permalink: /
---

{% assign paintings_data = site.data.titles %}
{% assign static_files = site.static_files %}

{% assign filtered_files = "" | split: "" %}

{% for file in static_files %}
  {% if file.path contains '/paintings/' and file.extname == '.jpg' %}
    {% assign filtered_files = filtered_files | push: file %}
  {% endif %}
{% endfor %}

{% assign sorted_files = filtered_files | sort: "path" | reverse %}

<div class="gallery">
  {% for file in sorted_files %}
    {% assign filename = file.name %}
    {% assign parts = filename | split: ' ' %}
    {% assign year_str = parts[0] %}
    {% assign year = year_str | plus: 0 %}
    {% assign title = parts | slice: 1, parts.size | join: ' ' | remove: '.jpg' %}
    
    {% assign dims = "220x120cm" %}
    {% for entry in paintings_data %}
      {% if entry.year == year and entry.title == title %}
        {% assign dims = entry.dimensions %}
        {% break %}
      {% endif %}
    {% endfor %}
    
    <div class="painting">
      <img src="{{ file.path | relative_url }}" alt="{{ title }}" loading="lazy" onload="this.classList.add('loaded')" />
      
      <div class="painting-info">
        <div class="title">{{ title }}</div>
        <div class="year">{{ year }}</div>
        <div class="dimensions">{{ dims }}</div>
      </div>
    </div>
  {% endfor %}
</div>
