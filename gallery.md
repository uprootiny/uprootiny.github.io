---
layout: default
title: Paintings
permalink: /paintings/
---
<head>
  <link rel="stylesheet" href="/assets/lightbox2/css/lightbox.min.css">
</head>
<!-- <h1>Gallery</h1> -->


<div class="gallery">
  {% for image in site.static_files %}
  
  {% if image.path contains '/paintings/' %}
  
  {% assign name_parts = image.name | split: ' ' %}
  {% assign year = name_parts[0] %}
  {% assign title = image.name | replace: year, "" | replace: '.jpg', "" | replace: '.png', "" %}
  
  <div class="painting" data-year="{{ year }}">
  
    <img src="{{ site.baseurl }}{{ image.path }}" alt="{{ title }}" />
        <h2>{{ title | capitalize }} {{ year }}</h2>
          <br/>


  </div>
  
  {% endif %}
  
  {% endfor %}
</div>