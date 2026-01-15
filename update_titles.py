import os
import re
import yaml
from pathlib import Path

# Paths (adjust if needed)
PAINTINGS_DIR = Path("./paintings")
TITLES_YML = Path("./_data/titles.yml")

# Load existing titles data for dimensions preservation
if TITLES_YML.exists():
    with open(TITLES_YML, "r", encoding="utf-8") as f:
        old_data = yaml.safe_load(f)
else:
    old_data = []

# Build a lookup from old data by filename for dimensions
dimensions_lookup = {}
for item in old_data or []:
    fname = item.get("filename")
    if fname and "dimensions" in item:
        dimensions_lookup[fname] = item["dimensions"]

# Scan paintings directory for image files
files = sorted(f for f in PAINTINGS_DIR.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"])

new_data = []
filename_re = re.compile(r"(\d{4})\s+(.*)\.(jpg|jpeg|png)$", re.I)

for f in files:
    m = filename_re.match(f.name)
    if not m:
        print(f"Skipping unparsable filename: {f.name}")
        continue
    year = int(m.group(1))
    title = m.group(2)
    filename = f.name

    dimensions = dimensions_lookup.get(filename)

    entry = {
        "filename": filename,
        "year": year,
        "title": title,
    }
    if dimensions:
        entry["dimensions"] = dimensions

    new_data.append(entry)

# Write back only if different (to avoid infinite commits)
def yaml_equal(a, b):
    return yaml.dump(a, sort_keys=True) == yaml.dump(b, sort_keys=True)

if not yaml_equal(old_data, new_data):
    print(f"Updating {TITLES_YML} with {len(new_data)} entries.")
    with open(TITLES_YML, "w", encoding="utf-8") as f:
        yaml.dump(new_data, f, allow_unicode=True, sort_keys=False)
else:
    print(f"No changes in {TITLES_YML}.")
