---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">

  {% assign meta = site.data.titles %}
  {% assign all_files = site.static_files %}

  {%- comment -%}
    1. Gather every static file under /paintings/ with a .jpg/.jpeg/.png (any case)
  {%- endcomment -%}
  {% assign gallery = "" | split: "" %}
  {% for f in all_files %}
    {% assign rel = f.relative_path %}
    {% assign ext = f.extname | downcase %}
    {% if rel startswith "paintings/" and ( ext == ".jpg" or ext == ".jpeg" or ext == ".png" ) %}
      {% assign gallery = gallery | push: f %}
    {% endif %}
  {% endfor %}

  {%- comment -%}
    2. Sort however you like. Here by filename alphabetically.
  {%- endcomment -%}
  {% assign gallery = gallery | sort: "relative_path" %}

  {%- comment -%}
    3. Render each file entry
  {%- endcomment -%}
  {% for art in gallery %}
    {% assign fn = art.relative_path | remove: "paintings/" %}
    {% assign parts = fn | split: " " %}
    {% assign year = parts[0] | plus: 0 %}
    {% assign rest = parts | slice: 1, parts.size | join: " " %}
    {% assign title = rest | remove: art.extname %}

    {%- comment -%}
      Lookup dimensions in your data file by exact year + title
    {%- endcomment -%}
    {% assign dims = "200x220cm" %}
    {% for item in meta %}
      {% if item.year == year and item.title == title %}
        {% assign dims = item.dimensions %}
        {% break %}
      {% endif %}
    {% endfor %}

    <div class="image-item">
      {% comment %} escape every special char in the filename {% endcomment %}
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
