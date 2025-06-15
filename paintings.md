---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">

  {% assign meta_list = site.data.titles %}
  {% assign all_statics = site.static_files %}

  {%- comment -%}
    1. Collect only .jpg/.jpeg/.png under /paintings/
  {%- endcomment -%}
  {% assign gallery = "" | split: "" %}
  {% for file in all_statics %}
    {% if file.path contains '/paintings/' and ( file.extname == '.jpg' or file.extname == '.jpeg' or file.extname == '.png' ) %}
      {% assign gallery = gallery | push: file %}
    {% endif %}
  {% endfor %}

  {%- comment -%}
    2. Sort by path
  {%- endcomment -%}
  {% assign gallery = gallery | sort: "path" %}

  {%- comment -%}
    3. Render each actual file
  {%- endcomment -%}
  {% for art in gallery %}
    {% assign fn = art.name %}
    {% assign parts = fn | split: ' ' %}
    {% assign year = parts[0] | plus: 0 %}
    {% assign rest = parts | slice: 1, parts.size | join: ' ' %}
    {% assign title = rest | remove: art.extname %}

    {% assign dims = 'unknown' %}
    {% for item in meta_list %}
      {% if item.year == year and item.title == title %}
        {% assign dims = item.dimensions %}
        {% break %}
      {% endif %}
    {% endfor %}

    <div class="image-item">
      {% assign esc_fn = fn | uri_escape %}
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
