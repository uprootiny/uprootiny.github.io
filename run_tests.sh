#!/bin/bash
# Quick test runner for local development

echo "🧪 Running pre-deploy tests locally..."

# Check if bundle is available
if ! command -v bundle &> /dev/null; then
    echo "❌ bundler not found. Please install Ruby and bundler first."
    exit 1
fi

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ python3 not found. Please install Python 3."
    exit 1
fi

# Install Python dependencies if needed
if ! python3 -c "import yaml" &> /dev/null; then
    echo "📦 Installing Python dependencies..."
    pip3 install pyyaml
fi

# Update image metadata
echo "🎨 Updating image metadata..."
python3 scripts/parse_images.py

# Install Ruby dependencies if needed
if [ ! -d "vendor/bundle" ]; then
    echo "📦 Installing Ruby dependencies..."
    bundle install
fi

# Build the site
echo "🔨 Building Jekyll site..."
bundle exec jekyll build --trace

# Run tests
echo "🧪 Running regression tests..."
python3 tests/test_site_integrity.py

echo "✅ Test run complete!"