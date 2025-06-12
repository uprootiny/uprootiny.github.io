---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% assign paintings = site.data.titles | sort: "year" | reverse %}
  {% for painting in paintings %}
    {% assign filename = painting.year | append: " " | append: painting.title | append: ".jpg" %}
    {% assign filepath = "/paintings/" | append: filename %}

    <div class="image-item">
      <img src="{{ site.baseurl }}{{ filepath | relative_url }}" alt="{{ painting.title }}">
      <div class="image-title-year">
        <div class="image-title">{{ painting.title }}</div>
        <div class="image-dimensions">{{ painting.dimensions }}</div>
        <div class="image-year">{{ painting.year }}</div>
      </div>
      <br/>
    </div>
  {% endfor %}
</div>
