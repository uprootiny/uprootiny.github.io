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
    
    {% comment %} Try to parse dimensions from filename first {% endcomment %}
    {% assign filename_dimensions = "" %}
    {% if filename contains "x" %}
      {% assign parts = filename | split: " " %}
      {% for part in parts %}
        {% if part contains "x" and part contains "cm" %}
          {% assign filename_dimensions = part %}
          {% break %}
        {% elsif part contains "x" %}
          {% assign nums = part | split: "x" %}
          {% if nums.size == 2 %}
            {% assign first_num = nums[0] | plus: 0 %}
            {% assign second_num = nums[1] | plus: 0 %}
            {% if first_num > 0 and second_num > 0 %}
              {% assign filename_dimensions = part | append: "cm" %}
              {% break %}
            {% endif %}
          {% endif %}
        {% endif %}
      {% endfor %}
    {% endif %}
    
    {% comment %} Determine final dimensions: filename > YAML > default {% endcomment %}
    {% if filename_dimensions != "" %}
      {% assign final_dimensions = filename_dimensions %}
    {% elsif painting.dimensions %}
      {% assign final_dimensions = painting.dimensions %}
    {% else %}
      {% assign final_dimensions = "200x220cm" %}
    {% endif %}

    <div class="image-item">
<img src="{{ site.baseurl }}{{ filepath | uri_escape | relative_url }}" alt="{{ painting.title }}">
      <div class="image-title-year">
        <div class="image-title">{{ painting.title }}</div>
        <div class="image-dimensions">{{ final_dimensions }}</div>
        <div class="image-year">{{ painting.year }}</div>
      </div>
      <br/>
    </div>
  {% endfor %}
</div>
