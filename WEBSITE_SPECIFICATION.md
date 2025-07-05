# Cyrill Rafael Vasilyev Gallery Portfolio Website Specification

## 🎯 **Vision Statement**

A contemplative digital gallery that showcases large-scale paintings while maintaining the essence of direct artistic encounter. The website should feel like a quiet studio visit—focused, unhurried, and allowing the work to speak for itself.

## 📋 **Core Requirements**

### **Primary Purpose**
- **Gallery First**: Paintings are the primary content and focus
- **Professional Presence**: CV, exhibitions, contact information
- **Contemplative Atmosphere**: Minimal distractions, thoughtful design
- **Direct Access**: Easy navigation to essential content

### **Essential Pages**
1. **Paintings Gallery** (`/` → `/paintings`)
   - 43+ paintings with high-quality images
   - Chronological order (newest first: 2024 → 2018)
   - Title, year, dimensions for each work
   - Centered images with consistent layout
   - Clean, minimal presentation

2. **About** (`/about`)
   - Artist statement with painted background
   - Philosophy and approach to art practice
   - Personal narrative and artistic journey

3. **CV** (`/cv`)
   - Chronological exhibition history (2014-2025)
   - Residencies and educational background
   - Awards and recognition
   - ANNASTATE collective involvement

4. **Linocuts** (`/linocuts`)
   - Relief print collection (8+ works)
   - Alternative medium showcase
   - Grid layout for browsing

5. **Installation Views** (`/installations`)
   - Documentation of site-specific works
   - Exhibition photography (11+ images)
   - Context and venue information

## 🎨 **Design Principles**

### **Aesthetic Values**
- **Contemplative Minimalism**: Space for reflection and focus
- **Material Honesty**: Digital design that doesn't compete with paintings
- **Typographic Clarity**: Readable, unobtrusive text (Menlo monospace)
- **Color Restraint**: Let the artwork provide the color
- **Generous Whitespace**: Breathing room around content

### **User Experience**
- **Immediate Access**: No splash screens or barriers to content
- **Mobile Responsive**: Works on all devices
- **Fast Loading**: Optimized images and minimal dependencies
- **Accessibility**: Screen reader friendly, good contrast
- **Intuitive Navigation**: Clear, consistent menu structure

## 🔧 **Technical Specifications**

### **Current Architecture**
- **Static Site Generator**: Jekyll (GitHub Pages compatible)
- **Repository**: cyrillrafael/cyrillrafael.github.io
- **Domain**: https://cyrillrafael.org
- **Deployment**: GitHub Actions + GitHub Pages
- **Image Storage**: Git LFS or direct repository storage

### **Required Features**
- **Responsive Images**: Automatic optimization and sizing
- **SEO Optimization**: Meta tags, structured data, sitemaps
- **Social Media Integration**: Instagram, Telegram links
- **Contact Forms**: Professional inquiry handling
- **Performance**: <3s load times, 90+ Lighthouse scores

## 🌐 **Navigation Structure**

```
Paintings | Linocuts | About | CV | Instagram | Telegram | Installation Views
```

### **Information Architecture**
- **Homepage** → Redirects to Paintings
- **Paintings** → Main gallery with all works
- **Linocuts** → Secondary medium collection  
- **About** → Artist statement and philosophy
- **CV** → Professional history and credentials
- **Installations** → Exhibition documentation
- **Social Links** → External platforms (Instagram, Telegram)

## 🗺️ **Experimental Territory (Hidden/Future)**

### **Advanced Features** (Accessible via `/porch.html`)

#### **Interactive Globe Map**
- **Pinpointed Locations**: Every exhibition and residency mapped
- **Color-Coded Timeline**: Years mapped to spectral progression
  - 2014-2016: Deep violet (Moscow period)
  - 2017-2019: Blue (Academy years)  
  - 2020-2022: Green (ANNASTATE establishment)
  - 2023-2025: Orange-Red (International expansion)
- **3D Visualization**: WebGL globe with smooth interaction
- **Location Details**: Venue info, artwork shown, context
- **Flow Lines**: Connections between related exhibitions

#### **Mindmaps & Concept Networks**
- **Practice Evolution**: Visual map of artistic development
- **Influence Networks**: Connections to other artists, movements
- **Technique Relationships**: How methods interconnect
- **Philosophical Threads**: Ideas flowing through different periods
- **Interactive Exploration**: Click to explore concept clusters

#### **Digital Ecosystem Components**
- **Color Oracle**: Cultural wisdom and pigment histories
- **AI Studio Partner**: Contemplative art-making assistant
- **Dream Visualization**: Transform dreams into paintable compositions
- **VR Painting Environments**: Impossible studio spaces
- **Biometric Art Tools**: Heart rate responsive brushes
- **Serial Work Tracking**: Documentation of ongoing series

## 🎪 **Websites That Stand Out & Harmonize**

### **Reference Examples**
- **Artist Portfolios**: Minimal, work-focused (Anselm Kiefer, Gerhard Richter)
- **Contemplative Design**: Meditation apps, spiritual websites
- **Interactive Maps**: Cultural institution timelines, artist journey maps
- **Mindmap Tools**: Obsidian, Roam Research, Kumu network visualization
- **Globe Visualizations**: Google Earth Studio, Three.js examples
- **Process Documentation**: Behind-scenes studio content

### **Unique Differentiators**
- **Philosophical Depth**: Contemplative practice integration
- **Technical Sophistication**: Hidden complexity behind simple interface
- **Cultural Integration**: Color wisdom from global traditions
- **Process Transparency**: Real studio documentation and methods
- **Community Building**: Open calls and collaboration opportunities
- **Educational Value**: Workshops, essays, technique guides

## 📝 **Content Strategy**

### **Regular Updates**
- **New Paintings**: Added as created with proper documentation
- **Exhibition Updates**: CV maintained with current shows
- **Process Documentation**: Studio visits, technique videos
- **Philosophical Reflections**: Essays on practice and contemplation

### **Seasonal Content**
- **Exhibition Reviews**: Documentation of completed shows
- **Studio Changes**: How workspace evolves over time
- **Travel Documentation**: Residencies and international work
- **Collaborative Projects**: ANNASTATE and other partnerships

## 🔮 **Future Vision**

### **Long-term Goals**
- **Digital Art History**: Comprehensive documentation of practice evolution
- **Educational Platform**: Workshops and masterclasses online
- **Community Hub**: Network of contemplative artists
- **Research Archive**: Essays, techniques, philosophical investigations
- **Commercial Integration**: Sales, commissions, print-on-demand
- **Global Reach**: Multi-language support, international accessibility

### **Technology Evolution**
- **AR Integration**: View paintings in your space
- **VR Galleries**: Immersive exhibition experiences  
- **AI Collaboration**: Intelligent studio assistant
- **Blockchain Integration**: NFTs and digital ownership
- **Biometric Interaction**: Responsive to viewer's state
- **Real-time Collaboration**: Live painting sessions

## 🚨 **Critical Success Factors**

### **Must Maintain**
- **Artistic Integrity**: Technology serves art, not vice versa
- **Contemplative Atmosphere**: Quiet, reflective user experience
- **Professional Credibility**: Serious artist presentation
- **Work Quality**: High-resolution, color-accurate images
- **Loading Performance**: Fast, reliable access to content

### **Must Avoid**
- **Feature Creep**: Overwhelming visitors with options
- **Technical Barriers**: Complex interfaces or requirements
- **Commercial Emphasis**: Art secondary to selling
- **Trendy Design**: Following web design fads
- **Social Media Dependency**: Platform-independent presence

## 📊 **Success Metrics**

### **Quantitative Measures**
- **Load Speed**: <3 seconds to first paint
- **Mobile Score**: 90+ Google PageSpeed
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO Performance**: First page Google results for artist name
- **Uptime**: 99.9% availability

### **Qualitative Indicators**
- **Visitor Feedback**: Positive responses to gallery experience
- **Professional Inquiries**: Curators, collectors, collaborators
- **Peer Recognition**: Other artists referencing or sharing
- **Educational Use**: Students and researchers citing work
- **Cultural Impact**: Influence on contemplative art discourse

---

*This specification balances the essential professional gallery needs with visionary experimental possibilities, ensuring the website grows organically while maintaining its contemplative core.*