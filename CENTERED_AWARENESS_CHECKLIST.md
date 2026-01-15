# Centered Awareness Checklist

This checklist represents the project's ability to check itself for readiness. Run this before any major changes.

## **Pre-Commit Checklist**

### 🎨 **Content & Layout**
- [ ] **Painting titles below images** (not above)
- [ ] **Reverse chronological order** (newest first: 2024→2018)
- [ ] **Proper image centering** and consistent margins
- [ ] **All paintings have metadata** (year, title, dimensions)
- [ ] **No duplicate entries** in titles.yml

### 🔗 **Navigation & Structure**
- [ ] **Root page redirects to paintings** or displays gallery
- [ ] **All nav links functional** (no broken links)
- [ ] **Social links current** (Instagram, Telegram)
- [ ] **Hidden pages accessible** (studio) but not in main nav
- [ ] **Mobile navigation works** on small screens

### 📊 **Data Consistency**
- [ ] **Filenames match metadata** (titles.yml consistency)
- [ ] **Years parsed correctly** from filenames
- [ ] **No missing image files** referenced in HTML
- [ ] **Dimensions properly displayed** (default: 220x120cm)
- [ ] **No typos in metadata** (artist names, titles)

### 🛠️ **Technical Health**
- [ ] **Jekyll builds successfully** (`bundle exec jekyll build`)
- [ ] **All tests pass** (`python3 tests/test_site_integrity.py`)
- [ ] **No deprecated actions** in workflows
- [ ] **Build completes under 2 minutes**
- [ ] **Page loads under 2 seconds**

### 🗂️ **File Organization**
- [ ] **No .DS_Store files** committed
- [ ] **Consistent naming convention** (YYYY Title.jpg)
- [ ] **Supported file formats** (.jpg, .jpeg, .png)
- [ ] **No temporary/test files** left behind
- [ ] **Image paths handle spaces** correctly

## **Pre-Deploy Validation**

### 🧪 **Regression Tests**
```bash
# Run full test suite
python3 tests/test_site_integrity.py

# Expected output: "🎉 ALL TESTS PASSED - SAFE TO DEPLOY"
```

### 🔍 **Image Parsing**
```bash
# Validate auto-parsing
python3 scripts/parse_images.py

# Check for warnings about missing entries
```

### 🚀 **Build Validation**
```bash
# Local build test
bundle exec jekyll build --trace

# Check _site directory is generated
ls -la _site/
```

## **Common Anti-Patterns to Avoid**

❌ **Title above image** - Titles should be below  
❌ **Multiple content commits** - Batch updates instead  
❌ **Pushing without tests** - Always run tests first  
❌ **Ignoring warnings** - Address metadata inconsistencies  
❌ **Broken nav links** - Test all navigation paths  
❌ **Missing dimensions** - All paintings need size data  
❌ **Wrong chronological order** - Newest should be first  
❌ **Hardcoded years** - Use dynamic date handling  

## **Critical Success Indicators**

✅ **All regression tests pass**  
✅ **Build completes successfully**  
✅ **All paintings display in correct order**  
✅ **No missing images or broken links**  
✅ **Metadata consistency maintained**  
✅ **Navigation structure complete**  
✅ **Page performance under 2 seconds**  
✅ **Mobile responsive design works**  

## **Emergency Procedures**

### 🚨 **If Tests Fail**
1. Check specific test failure in output
2. Fix underlying issue (don't skip tests)
3. Re-run tests until all pass
4. Only then proceed with deployment

### 🔄 **If Build Fails**
1. Check Jekyll build logs for errors
2. Verify all referenced files exist
3. Check for YAML syntax errors
4. Ensure all dependencies are installed

### 📱 **If Live Site Breaks**
1. Check GitHub Actions workflow status
2. Review recent commit changes
3. Roll back to last known good commit
4. Run full regression test suite

---

*This checklist evolves based on recurring issues found in git history. Update it as new patterns emerge.*