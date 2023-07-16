---
layout: text
title: linocuts
permalink: /linocuts/
---
<div class="image-container">
  {% for print in site.static_files %}
    {% if print.path contains "/prints/" %}
      <div class="image-item">
        <img src="{{ site.baseurl }}{{ print.path }}" alt="">
      </div>
    {% endif %}
  {% endfor %}
</div>
