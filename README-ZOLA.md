# Zola Gallery Branch

This branch contains a clean Zola implementation of the paintings gallery.

## Status
- ✅ **Build Speed**: 34ms (vs Jekyll's 45+ seconds)
- ✅ **Structure**: Clean Zola-only setup, no Jekyll conflicts
- ✅ **Content**: 43 paintings with dimensions data
- ✅ **Styling**: CSS properly structured
- ⚠️ **Deployment**: Requires GitHub Pages configuration change

## To Deploy
1. Go to GitHub repository Settings → Pages
2. Change deployment branch from `master` to `zola-clean`
3. Or enable branch protection rules for `zola-clean`

## Files
- `config.toml` - Zola configuration
- `content/_index.md` - Homepage content
- `templates/` - Zola templates (base.html, index.html)
- `static/paintings/` - All 43 JPG images
- `static/styles.css` - Gallery styling
- `paintings.json` - Painting metadata

## Performance
- **Jekyll**: ~52s total build time
- **Zola**: ~34ms build + ~15s total workflow time

**Speed improvement: ~1,500x faster build times**