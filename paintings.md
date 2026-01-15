---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="gallery">

  {%- assign meta = site.data.titles -%}
  {%- assign gallery = "" | split: "" -%}

  {%- comment -%}
    1) Grab every static file under /paintings/ with jpg/jpeg/png
  {%- endcomment -%}
  {% for f in site.static_files %}
    {% assign rel = f.path | remove_first: site.source %}
    {% if rel contains '/paintings/' %}
      {% assign ext = f.extname | downcase %}
      {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' %}
        {% assign gallery = gallery | push: f %}
      {% endif %}
    {% endif %}
  {% endfor %}

  {%- comment -%}
    2) Sort by year (newest first, like original)
  {%- endcomment -%}
  {% assign gallery = gallery | sort: "path" | reverse %}

  {%- comment -%}
    3) Render each image
  {%- endcomment -%}
  {% for art in gallery %}
    {%- assign fn = art.path | remove_first: '/paintings/' -%}
    {%- assign parts = fn | split: ' ' -%}
    {%- assign year = parts[0] | plus: 0 -%}
    {%- assign title = parts | slice: 1, parts.size | join: ' ' | remove: art.extname -%}

    {%- comment -%}
      Lookup optional dimensions
    {%- endcomment -%}
    {% assign dims = "220x120cm" %}
    {% for item in meta %}
      {% if item.year == year and item.title == title %}
        {% assign dims = item.dimensions %}
        {% break %}
      {% endif %}
    {% endfor %}

    <div class="painting">
      {%- assign esc = fn | uri_escape -%}
      <img
        src="{{ '/paintings/' | append: esc | relative_url }}"
        alt="{{ title }}"
        loading="lazy"
        onload="this.classList.add('loaded')"
      />
      
      <div class="painting-info">
        <span class="title">{{ title }}</span>
        <span class="year">{{ year }}</span>
        <span class="dimensions">{{ dims }}</span>
      </div>
    </div>
  {% endfor %}

</div>
