---
layout: gallery
title: Gallery
permalink: /gallery/
---

<div class="gallery">
{% for image in site.static_files %}
    {% if image.path contains 'gallery' %}
        <a href="{{ site.baseurl }}{{ image.path }}" data-lightbox="gallery" data-title="{{ image.name }}">
            <img src="{{ site.baseurl }}{{ image.path }}" alt="{{ image.name }}" />
        </a>
    {% endif %}
{% endfor %}
</div>

