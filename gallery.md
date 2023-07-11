{% assign sorted_paintings = site.static_files | where: "path", "/paintings/" | sort: "name" %}
