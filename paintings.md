---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">

  {% assign meta = site.data.titles %}

  {%- comment -%}
    1. Gather every image file under /paintings/ of type .jpg/.jpeg/.png
  {%- endcomment -%}
  {% assign gallery = "" | split: "" %}
  {% for f in site.static_files %}
    {% assign path = f.relative_path %}
    {% if path contains '/paintings/' %}
      {% assign ext = f.extname | downcase %}
      {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' %}
        {% assign gallery = gallery | push: f %}
      {% endif %}
    {% endif %}
  {% endfor %}

  {%- comment -%}
    2. Sort however you like (here by path)
  {%- endcomment -%}
  {% assign gallery = gallery | sort: "relative_path" %}

  {%- comment -%}
    3. Render each file
  {%- endcomment -%}
  {% for art in gallery %}
    {% assign fn = art.relative_path | remove_first: 'paintings/' %}
    {% assign parts = fn | split: ' ' %}
    {% assign year = parts[0] | plus: 0 %}
    {% assign rest = parts | slice: 1, parts.size | join: ' ' %}
    {% assign title = rest | remove: art.extname %}

    {%- comment -%}
      Lookup dimensions in titles.yml by year+title
    {%- endcomment -%}
    {% assign dims = '200x220cm' %}
    {% for item in meta %}
      {% if item.year == year and item.title == title %}
        {% assign dims = item.dimensions %}
        {% break %}
      {% endif %}
    {% endfor %}

    <div class="image-item">
      {% assign esc = fn | uri_escape %}
      <img
        src="/paintings/{{ esc }}"
        alt="{{ title }}"
        loading="lazy"
      />
      <div class="image-title-year">
        <div class="image-title">{{ title }}</div>
        <div class="image-dimensions">{{ dims }}</div>
        <div class="image-year">{{ year }}</div>
      </div>
    </div>
  {% endfor %}

</div>
