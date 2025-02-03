---
layout: default
title: Exhibitions
permalink: /exhibitions/
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exhibitions | Cyrill Rafael Vasilyev</title>
    <style>
        body {
            font-family: Menlo, monospace;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #222;
        }
        h1 {
            text-align: center;
            font-size: 24px;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            justify-content: center;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .gallery img {
            width: 100%;
            height: auto;
            object-fit: cover;
            border-radius: 5px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <h1>Exhibitions Showcase</h1>
    <div class="gallery">
        {% assign exhibitions = site.static_files | where_exp: "file", "file.path contains '/exhibition2025/'" %}
        {% for image in exhibitions %}
            <img src="{{ site.baseurl }}{{ image.path | relative_url }}" alt="Exhibition Image">
        {% endfor %}
    </div>
</body>
</html>
