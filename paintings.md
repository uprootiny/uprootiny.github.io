---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">

  {% assign meta = site.data.titles %}
  {% assign gallery = "" | split: "" %}

  {% for f in site.static_files %}
    {% if f.relative_path contains 'paintings/' %}
      {% assign ext = f.extname | downcase %}
      {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' %}
        {% assign gallery = gallery | push: f %}
      {% endif %}
    {% endif %}
  {% endfor %}

  {% assign gallery = gallery | sort: "relative_path" %}

  {% for art in gallery %}
    {% assign fn = art.relative_path | remove_first: "paintings/" %}
    {% assign parts = fn | split: " " %}
    {% assign year = parts[0] | plus: 0 %}
    {% assign title = parts | slice: 1, parts.size | join: " " | remove: art.extname %}

    {% assign dims = "200x220cm" %}
    {% for item in meta %}
      {% if item.year == year and item.title == title %}
        {% assign dims = item.dimensions %}
        {% break %}
      {% endif %}
    {% endfor %}

    <div class="image-item">
      {%- assign esc_fn = fn | uri_escape -%}
      <img
        src="{{ site.baseurl }}/paintings/{{ esc_fn }}"
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
