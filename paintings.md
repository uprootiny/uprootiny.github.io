---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% assign paintings = site.data.titles | sort: "year" | reverse %}
  {% for painting in paintings %}
    {% assign filepath = "/paintings/" | append: painting.filename %}
    {% assign encoded_filepath = filepath | uri_escape %}

    <div class="image-item">
      <img src="{{ site.baseurl }}{{ encoded_filepath | relative_url }}" alt="{{ painting.title }}">
      <div class="image-title-year">
        <div class="image-title">{{ painting.title }}</div>
        <div class="image-dimensions">{{ painting.dimensions | default: "200x220cm" }}</div>
        <div class="image-year">{{ painting.year }}</div>
      </div>
      <br/>
    </div>
  {% endfor %}
</div>
