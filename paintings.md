---
layout: default
---

<h1>Paintings</h1>

{% assign sorted_paintings = site.static_files | where: "path", "/paintings/" %}
{% assign paintings = sorted_paintings | sort: "modified_time" | reverse %}

{% for painting in paintings %}
  {% if painting.extname == '.jpg' or painting.extname == '.jpeg' or painting.extname == '.png' or painting.extname == '.gif' %}
    {% assign name_parts = painting.name | split: ' ' %}
    {% assign year = name_parts[0] %}
    {% assign title = name_parts[1] %}
    {% for part in name_parts limit: 2 offset: 2 %}
      {% assign title = title | append: ' ' | append: part %}
    {% endfor %}

    <div class="image-container">
      <img src="{{ site.baseurl }}/paintings/{{ painting.name }}" alt="{{ title }}">
      <div class="image-title">{{ title }}</div>
    </div>

    <br> <!-- Add space between paintings -->
  {% endif %}
{% endfor %}
