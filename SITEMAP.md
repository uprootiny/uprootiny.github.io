# Complete Sitemap & Project Status

## 📍 Current Live Site (Jekyll - Master Branch)
**URL**: https://uprootiny.github.io
**Status**: ✅ Active & Deployed
**Last Deploy**: June 22, 2025 (epicycles porch update)

### Core Pages
- **/** → **/paintings** (redirected) - Main gallery with 43 paintings, dimensions, 1.6ex text
- **/about** - Artist statement with painted background layout
- **/cv** - Curriculum Vitae with exhibitions (2014-2025), residencies, education
- **/linocuts** - Linocut prints gallery (8 prints)
- **/installations.html** - Installation views (11 images from installation2025/)
- **/porch.html** - ☸ Dharma wheel gateway with rotating epicycles

### Gateway Features
- **☸ Dharma Wheel** in navbar (rotates on hover, links to porch)
- **Footer Link** - "isn't there more to the website?" (all pages except gallery/painted-background - NEEDS FIX)
- **Epicycles Animation** - Multiple rotating wheels showing practice directions

### Navigation Structure
```
Paintings | Linocuts | About | CV | Instagram | Telegram | Installation Views | ☸
```

### Social Links
- **Instagram**: @cyrillrafael
- **Telegram**: +31686218199

---

## 🚀 Experimental Branch (Zola - zola-with-expansions)
**Status**: ⚠️ Built but not deployed (Zola workflows failing)
**Content**: Complete expanded universe of digital experiments

### Essential Explorations
- **/map** - Interactive 3D globe with exhibition/residency timeline
- **/store** - Complete storefront with 4 categories:
  - **/store/prints** - Print-on-demand collection
  - **/store/digital** - NFTs, downloads, VR experiences  
  - **/store/classes** - Masterclasses and workshops
  - **/store/commissions** - Custom artworks and installations
- **/essays** - Technical and philosophical essays
- **/serials** - Serial works and ongoing projects
- **/collaborations** - Open calls and partnerships

### Experimental Territories
- **/experiments** - Wild prototypes (generative art, biometric brushes, quantum canvas)
- **/playground** - Interactive color meditation tools
- **/oracle** - Mystical color divination system
- **/lab/debris** - Digital tchotchkes and beautiful failures
- **/lab/ai-studio** - Claude-in-a-Canvas AI painting partner
- **/lab/vr-studio** - Virtual reality painting environments
- **/lab/dream-journal** - Dream visualization engine

---

## 🔧 Technical Infrastructure

### Working Deployments
- **Jekyll (Master)**: ✅ Working - deploys via `.github/workflows/jekyll.yml`
- **Zola (zola-clean)**: ❌ Failing - builds but 0 pages generated
- **Zola (zola-with-expansions)**: ❌ Failing - conflicts with Jekyll files

### GitHub Actions Status
```
✅ Deploy Jekyll site to Pages (master) - SUCCESS
❌ Build and Deploy Zola (zola-*) - FAILING
❌ pages-build-deployment (zola branches) - FAILING
```

### Branch Overview
- **master** - Production Jekyll site with porch gateway
- **zola-clean** - Clean Zola setup (fails: 0 pages)
- **zola-with-expansions** - Full experimental universe (build conflicts)
- **current-stable** - Tagged backup of stable state

---

## 🎯 What We've Built

### 1. **Contemplative Gateway System**
- Original paintings site preserved with subtle expansion hints
- Dharma wheel navigation maintains artistic integrity
- Porch philosophy: "wheels within wheels" practice directions

### 2. **Complete Digital Ecosystem** (Ready but not deployed)
- **26 major features** across 2,961+ lines of content
- **Interactive tools**: Color playground, AI studio, VR environments
- **Commercial infrastructure**: Print-on-demand, classes, commissions
- **Community features**: Collaborations, open calls, residencies

### 3. **Experimental Prototypes**
- **Biometric painting tools** - Heart rate affects brush pressure
- **Dream visualization engine** - Transform dreams into paintings
- **Color oracle** - Mystical divination with cultural wisdom
- **Digital debris collection** - Beautiful failures and sentient electronics

### 4. **Visual Philosophy**
- **Epicycles upon epicycles** - Different practice evolution speeds
- **Time-color mapping** - Years mapped to spectral progression
- **Rhizomatic connections** - Network thinking applied to exhibitions

---

## 🚨 Issues Identified

### 1. **Missing Footer Links**
- ❌ gallery.html layout missing footer (FIXED)
- ❌ painted-background.html layout missing footer (FIXED)
- ✅ text.html and paintings.html have footer

### 2. **Zola Deployment Failures**
- **Root Cause**: Jekyll/Zola file conflicts in same repository
- **Solution**: Need separate repositories or branch-based deployment switching

### 3. **Branch Deployment Strategy**
- No simple way to switch between Jekyll/Zola deployment
- Need deployment branch selector mechanism

---

## 🎛️ Needed: Deployment Throwswitch

### Current State
- Only master (Jekyll) deploys successfully
- Zola branches build but don't deploy due to GitHub Pages restrictions
- No way to switch deployment targets

### Proposed Solution
Create branch-based deployment switcher:
1. **Environment variables** to control deployment target
2. **Manual workflow dispatch** with branch selection
3. **Separate Zola workflow** that conditionally activates

---

## 📊 Statistics
- **Total Files Created**: 50+ across all branches
- **Lines of Code**: 5,000+ (templates, content, configurations)
- **Experimental Features**: 15+ interactive prototypes
- **Practice Directions Explored**: 9 major trajectories
- **Animation Elements**: 12+ rotating/pulsing components
- **Color Wisdom Traditions**: 8+ cultural contexts

---

## 🎨 Next Steps Priority
1. **Fix remaining footer links** (gallery, painted-background layouts) ✅ DONE
2. **Create deployment branch switcher** 
3. **Resolve Zola deployment issues**
4. **Test all navigation flows**
5. **Document complete user journey**

*The porch gateway is live and spinning. The experimental universe awaits deployment.* ☸