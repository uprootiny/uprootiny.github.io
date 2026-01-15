---
layout: paintings
title: Studio Notes
permalink: /studio/
---

{% assign studio_files = site.static_files | where_exp: "file", "file.path contains '/installation2025/'" %}
{% assign sorted_files = studio_files | sort: "path" | reverse %}

<div class="gallery">
  {% for file in sorted_files %}
    {% assign filename = file.name | remove: file.extname %}
    {% assign clean_title = filename | replace: "SMALL", "" | replace: "fields of air ", "" | replace: " copy", "" | replace: "copySMALL", "" | strip %}
    {% if clean_title == "" or clean_title == "fields of air" %}
      {% assign clean_title = filename %}
    {% endif %}
    
    <div class="painting">
      <img 
        src="{{ file.path | relative_url }}" 
        alt="{{ clean_title }}" 
        loading="lazy"
      />
      
      <div class="painting-info">
        <div class="title">{{ clean_title }}</div>
        <div class="year">2025</div>
        <div class="dimensions">studio documentation</div>
      </div>
    </div>
  {% endfor %}
</div>