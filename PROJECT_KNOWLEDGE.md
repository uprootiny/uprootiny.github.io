# Project Knowledge Base

This file encodes the accumulated knowledge about this gallery website project so it remains accessible across time and contributors.

## **Core Architecture Principles**

### **Content-First Design**
- **Paintings directory is sacred** - Contains actual artwork files, handle with respect
- **Titles below images** - Never above (`.painting-info` not `.painting-header`)
- **Reverse chronological order** - Newest first (2024→2018)
- **Metadata consistency** - `titles.yml` must match actual filenames

### **Navigation Philosophy**
- **Clean main navigation** - Core sections only: Paintings, Linocuts, About, CV, Social
- **Hidden functionality** - Studio, Terminal accessible but not in main nav
- **Progressive disclosure** - Essential first, advanced features discoverable

### **Technical Stack**
- **Jekyll + GitHub Pages** - Primary deployment (works reliably)
- **Automatic parsing** - `scripts/parse_images.py` handles new image uploads
- **Regression testing** - `tests/test_site_integrity.py` prevents breakage
- **CI/CD validation** - Every push tested before deployment

## **Historical Patterns & Solutions**

### **Recurring Issue: Title Placement**
**Pattern**: Titles keep getting moved above images
**Solution**: Always use `.painting-info` class below `<img>` tags
**Test**: `test_title_below_image_layout()` catches this
**Why it matters**: Visual hierarchy - image first, then context

### **Recurring Issue: Navigation Creep**
**Pattern**: New sections get added to main navigation
**Solution**: Main nav should have 4-5 items max, rest stay hidden
**Test**: `test_centered_awareness_basics()` monitors nav items
**Why it matters**: Cognitive load - simple navigation is usable navigation

### **Recurring Issue: Metadata Inconsistencies**
**Pattern**: Filenames don't match `titles.yml` entries
**Solution**: Auto-parsing system + regression tests catch mismatches
**Test**: `test_metadata_consistency()` validates all entries
**Why it matters**: Broken displays when data doesn't match files

### **Recurring Issue: Build/Deploy Problems**
**Pattern**: Workflows break, deprecated actions, permission issues
**Solution**: Separate test and deploy workflows, comprehensive validation
**Test**: Full regression suite before any deployment
**Why it matters**: Broken deploys mean broken website

## **Decision History**

### **Why Jekyll Over Other Static Site Generators**
- **Chosen**: Jekyll with GitHub Pages
- **Rejected**: Zola, Hugo, custom solutions
- **Reason**: Reliability, built-in GitHub integration, stable ecosystem
- **Trade-offs**: Less flexibility, but rock-solid deployment

### **Why Separate Test and Deploy Workflows**
- **Chosen**: Two workflows - one for testing, one for deployment
- **Rejected**: Single combined workflow
- **Reason**: Better error isolation, faster feedback
- **Trade-offs**: More complexity, but clearer failure modes

### **Why Titles Below Images**
- **Chosen**: Image first, then title/year/dimensions
- **Rejected**: Title above image
- **Reason**: Visual hierarchy - artwork is primary, metadata is secondary
- **Trade-offs**: Less traditional, but better focus on art

### **Why Hidden Studio Page**
- **Chosen**: Accessible at `/studio/` but not in main nav
- **Rejected**: In main navigation or completely removed
- **Reason**: Useful for process documentation but not core content
- **Trade-offs**: Discoverability vs. navigation simplicity

## **System Knowledge**

### **Image Processing Pipeline**
```
New image uploaded → Auto-parsed by scripts/parse_images.py → 
Metadata added to titles.yml → Jekyll processes → 
Regression tests validate → Deploy if all pass
```

### **Filename Conventions**
- **Paintings**: `YYYY Title.jpg` format expected
- **Linocuts**: Any format (no automatic year assignment)
- **Studio**: Process documentation (no automatic metadata)

### **CSS Architecture**
- **Main styles**: `styles.css` (single file, simple approach)
- **Layout classes**: `.painting`, `.painting-info`, `.gallery`
- **Navigation**: `.horizontal-list`, `.nav-item`
- **Responsive**: Mobile-first, simple breakpoints

### **Data Flow**
1. **Source files** → `paintings/`, `linocuts/`, `installation2025/`
2. **Metadata** → `_data/titles.yml`
3. **Templates** → `paintings.md`, `index.md`, `linocuts.md`
4. **Styling** → `styles.css`
5. **Navigation** → `_config.yml` nav_links
6. **Output** → Jekyll processes to `_site/`

## **Operational Procedures**

### **Adding New Paintings**
1. Upload to `paintings/` with `YYYY Title.jpg` format
2. Push to repository
3. Auto-parsing adds to `titles.yml`
4. Tests validate consistency
5. Deploy if all tests pass

### **Modifying Layout**
1. Check `CENTERED_AWARENESS_CHECKLIST.md` first
2. Update templates (`paintings.md`, `index.md`)
3. Update CSS in `styles.css`
4. Run local tests: `python3 tests/test_site_integrity.py`
5. Push only if all tests pass

### **Troubleshooting Deployments**
1. Check GitHub Actions workflow status
2. Review test failures in detail
3. Fix underlying issues (don't skip tests)
4. Re-run tests until all pass
5. Push fix and monitor deployment

### **Emergency Procedures**
1. **Site down**: Roll back to last known good commit
2. **Tests failing**: Fix issues, don't bypass tests
3. **Build broken**: Check Jekyll logs, fix syntax errors
4. **Performance issues**: Check image sizes, optimize

## **Quality Gates**

### **Pre-Commit Checklist**
- [ ] Titles below images (not above)
- [ ] Navigation doesn't include Studio
- [ ] All tests pass locally
- [ ] No temporary files committed
- [ ] Metadata consistent with filenames

### **Deployment Criteria**
- [ ] All regression tests pass
- [ ] Jekyll build succeeds
- [ ] No broken links or missing images
- [ ] Performance under 2 seconds
- [ ] Mobile responsive

### **Success Metrics**
- [ ] 43 paintings display correctly
- [ ] Reverse chronological order maintained
- [ ] All navigation links functional
- [ ] Metadata consistency 100%
- [ ] Build time under 2 minutes

## **Anti-Patterns to Avoid**

❌ **Titles above images** - Use `.painting-info` below images  
❌ **Multiple small commits** - Batch content changes  
❌ **Skipping tests** - Always run full test suite  
❌ **Main nav bloat** - Keep navigation simple  
❌ **Manual metadata** - Use auto-parsing system  
❌ **Ignoring warnings** - Address all test warnings  
❌ **Breaking changes without tests** - Test everything  

## **Future Considerations**

### **Planned Enhancements**
- Enhanced auto-parsing for edge cases
- Performance monitoring in CI/CD
- Automated accessibility testing
- More sophisticated metadata validation

### **Technology Evolution**
- Jekyll version upgrades (test thoroughly)
- GitHub Actions updates (monitor deprecations)
- Browser compatibility changes
- Mobile performance requirements

### **Scale Considerations**
- Current system handles ~50 paintings well
- At 100+ paintings, may need optimization
- Image optimization becomes more important
- Load time monitoring critical

## **Knowledge Maintenance**

### **This File Should Be Updated When**
- New recurring patterns emerge
- Architecture decisions are made
- Major issues are resolved
- System limitations are discovered

### **Review Schedule**
- **Monthly**: Check for new patterns in git history
- **Quarterly**: Update procedures based on experience
- **Annually**: Comprehensive architecture review
- **On major issues**: Immediate knowledge capture

---

*This knowledge base represents the accumulated wisdom of building and maintaining this gallery website. It should evolve as the project grows and new patterns emerge.*