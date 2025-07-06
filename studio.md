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
    {% assign title = filename | replace: "SMALL", "" | replace: "fields of air ", "" | replace: " copy", "" | strip %}
    
    <div class="painting">
      <div class="painting-header">
        <div class="title">{{ title }}</div>
        <div class="year">2025</div>
        <div class="dimensions">studio documentation</div>
      </div>
      
      <img 
        src="{{ file.path | relative_url }}" 
        alt="{{ title }}" 
        loading="lazy"
      />
    </div>
  {% endfor %}
</div>