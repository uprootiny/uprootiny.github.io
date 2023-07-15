---
layout: gallery
title: Paintings
permalink: /paintings/
---

{% assign paintings_by_year = site.static_files | where: "path", "/paintings/" | group_by_exp: "painting", "painting.basename | split: ' ' | first" %}

{% include "navbar.html" %}

<div class="image-container">
  {% for year in paintings_by_year %}
    {% assign year_paintings = year.items | sort: "painting.basename" | reverse %}
    {% for painting in year_paintings %}
      <div class="image-item">
        <img src="{{ site.baseurl }}{{ painting.path }}" alt="">
        <!-- If you want to display the year below each image -->
        <p class="image-year">{{ year.name }}</p>
      </div>
    {% endfor %}
  {% endfor %}
</div>
