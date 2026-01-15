# Pre-Deploy Regression Tests

Comprehensive test suite that validates site integrity before deployment.

## What Gets Tested

### 🔨 **Build Integrity**
- Jekyll builds without errors
- All required pages are generated
- No build timeouts or crashes

### 🎨 **Painting Gallery**
- All painting files appear on the paintings page
- Paintings display in reverse chronological order (newest first)
- Image paths point to existing files
- Metadata consistency between `titles.yml` and actual files

### 🏠 **Core Structure**
- Root page either redirects to `/paintings/` or mirrors it
- Navigation structure is present and complete
- Required pages exist: paintings, linocuts, studio, about, cv

### 📊 **Data Integrity**
- `titles.yml` entries match actual painting files
- No orphaned metadata or missing entries
- Year and title parsing works correctly

## Running Tests

### Local Development
```bash
# Quick test (builds site first)
./run_tests.sh

# Just run tests (assumes site already built)
python3 tests/test_site_integrity.py
```

### GitHub Actions
Tests run automatically on:
- Every push to master
- Pull requests
- Manual workflow dispatch

## Test Results

### ✅ **Pass Criteria**
All tests must pass for deployment to proceed:
- Site builds successfully
- All paintings appear and are properly ordered
- Core navigation works
- No broken links or missing images

### ❌ **Fail Conditions**
Deployment blocked if:
- Jekyll build fails
- Any paintings missing from gallery
- Wrong chronological order
- Broken image paths
- Missing navigation elements

### ⚠️ **Warnings**
Non-blocking issues that should be investigated:
- Metadata inconsistencies
- Missing optional pages
- Performance concerns

## Test Structure

```
tests/
├── test_site_integrity.py    # Main test suite
└── README.md                 # This file

Scripts:
├── run_tests.sh              # Local test runner
└── scripts/parse_images.py   # Image metadata updater
```

## Adding New Tests

To add a new test to the suite:

1. Add a method to `SiteIntegrityTests` class
2. Follow naming pattern: `test_feature_name(self) -> bool`
3. Use `self.log_failure()`, `self.log_warning()`, `self.log_success()`
4. Add the test to `run_all_tests()` method
5. Return `True` for pass, `False` for fail

Example:
```python
def test_new_feature(self) -> bool:
    """Test that new feature works correctly."""
    print("🆕 Testing new feature...")
    
    if self.check_something():
        self.log_success("New Feature", "Works correctly")
        return True
    else:
        self.log_failure("New Feature", "Something is broken")
        return False
```

## Integration with CI/CD

The test suite is integrated into the deployment pipeline:

1. **Image uploads** → Auto-parse metadata → Update `titles.yml`
2. **Code changes** → Run full test suite → Build site
3. **Tests pass** → Deploy to GitHub Pages
4. **Tests fail** → Block deployment, upload artifacts

This ensures that broken deployments never reach production and all core functionality remains stable.