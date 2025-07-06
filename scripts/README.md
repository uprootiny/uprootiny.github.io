# Image Auto-Parsing System

This system automatically makes any uploaded image appear properly on the website.

## How It Works

### Smart Parsing by Directory

**Paintings** (`/paintings/`): Always get a year and metadata entry
- `2024 fields of air.jpg` → year: 2024, title: "fields of air", dimensions: 220x120cm
- `painting_2024_spring.jpg` → year: 2024, title: "painting spring", dimensions: 220x120cm  
- `untitled.jpg` → year: 2025 (current), title: "untitled", dimensions: 220x120cm

**Linocuts** (`/linocuts/`): No automatic years or sizes
- `1.jpg` → no year, title: "1", no automatic metadata
- `abstract print.jpg` → no year, title: "abstract print", no automatic metadata

**Studio docs** (`/installation2025/`): No automatic years or sizes
- `fields of air 17.jpg` → no year, title: "fields of air 17", no automatic metadata

### Auto-Processing
When you add any image to `/paintings/`:
1. **Smart parsing**: Extracts year and title using multiple strategies
2. **Metadata creation**: Adds entry to `_data/titles.yml` with sensible defaults
3. **Validation**: Ensures Jekyll site builds correctly
4. **Auto-commit**: Commits changes if everything works

### Supported Formats
- `.jpg`, `.jpeg`, `.png`

### Manual Execution
```bash
python3 scripts/parse_images.py
```

### GitHub Actions
Triggers automatically on changes to:
- `/paintings/` directory (main gallery)
- `/linocuts/` directory  
- `/installation2025/` directory (studio docs)

## The Goal

**Upload any image → Website works**

The system figures out what it can from the filename and provides sensible defaults for everything else. You can always manually edit `_data/titles.yml` later for:
- Custom dimensions
- Title corrections
- Metadata refinements

No broken builds, no strict naming requirements, just working uploads.