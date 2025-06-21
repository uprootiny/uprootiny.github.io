+++
title = "Linocuts"
description = "Relief prints exploring texture and mark-making"
template = "page.html"
+++

<div class="image-container">
  <!-- Static file iteration would happen here in Zola -->
  <!-- For now, we'll create a simple gallery structure -->
</div>

<style>
.image-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px 0;
}

.image-item {
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.image-item:hover {
    transform: translateY(-5px);
}

.image-item img {
    width: 100%;
    height: auto;
    display: block;
}
</style>