---
layout: paintings
title: Paintings
permalink: /paintings/
---

<div class="image-container">
  {% assign paintings = site.static_files | where_exp: "file", "file.path contains '/paintings/'" %}
  {% assign sorted_paintings = paintings | sort: "path" | reverse %}

  {% for painting in sorted_paintings %}
  
    {% assign name_parts = painting.name | split: " " %}
    {% assign year = name_parts[0] %}
    {% assign title_parts = name_parts | slice: 1, name_parts.size | join: " " | split: "." %}
    {% assign title = title_parts[0] %}

    {% assign image_data = site.paintings_data | where: "filename", painting.basename %}
    {% assign dimensions = image_data[0].dimensions | default: "220x120cm" %}



    <div class="image-item">
      <img src="{{ site.baseurl }}{{ painting.path | relative_url }}" alt="{{ title }}">
        <div class="image-title-year">

            <div class="image-title">{{ title }}</div>
           <div class="image-dimensions">{{ dimensions }}</div>

            <div class="image-year">{{ year }}</div>

        </div>
      <br/>
      
    </div>
  {% endfor %}
</div>

