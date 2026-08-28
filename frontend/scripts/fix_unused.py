#!/usr/bin/env python3
"""Auto-fix TS6133 unused-import errors from a tsc output."""
import re, subprocess, sys, os

ROOT = "src"
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")

# Collect errors
out = subprocess.run(
    ["npx", "tsc", "-p", "tsconfig.app.json", "--noEmit"],
    capture_output=True, text=True
)
errors = []
for line in (out.stdout + out.stderr).splitlines():
    m = re.match(r"^(.*?)\((\d+),(\d+)\): error TS6133: '([^']+)' is declared but its value is never read\.", line)
    if m:
        errors.append((m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)))

# Group by file
by_file = {}
for f, r, c, name in errors:
    by_file.setdefault(f, []).append((r, c, name))

# For each file, we have a list of (row, col, name) referring to identifiers in an import statement.
# We parse all imports in the file and remove the named imports that are unused.
# Since `col` is the position of the identifier within the source, we can do a targeted
# regex removal using the column hint: split the file into lines, find the identifier at
# that column, and delete it (plus optional comma) without affecting other identifiers.

fixed_files = 0
for fpath, items in by_file.items():
    with open(fpath, "r", encoding="utf-8") as fp:
        src = fp.read()
    lines = src.splitlines(keepends=True)
    # Sort by col desc so deletions don't affect earlier columns
    items_sorted = sorted(items, key=lambda x: -x[1])
    for r, c, name in items_sorted:
        if r - 1 >= len(lines): continue
        line = lines[r - 1]
        # find the identifier at column c (1-indexed)
        if c - 1 >= len(line): continue
        # determine start: scan left until comma or `{` or whitespace
        i = c - 1
        # identifier end is at c + len(name) - 1
        end = c - 1 + len(name)
        if line[c - 1:c - 1 + len(name)] != name:
            # try to find the name in the import region of this line
            m = re.search(r"\b" + re.escape(name) + r"\b", line)
            if not m: continue
            start = m.start()
            end = m.end()
        else:
            start = i
        # Look at neighbours: if preceded by `{` or `, ` or followed by `, ` or `}`
        before = line[:start]
        after = line[end:]
        # Remove the identifier and one of the surrounding delimiters
        # We choose to remove from the start of the identifier to include any leading ", "
        # and from end of the identifier to include any trailing ", "
        # Find last ', ' before start within import braces
        # Easier: locate the import braces and rebuild the import if it's a named import.
        # For now, do a local cut: trim commas+spaces adjacent.
        # 1) cut any trailing ", " immediately after the identifier
        if after.startswith(", "):
            after = after[2:]
        elif after.startswith(","):
            after = after[1:]
        # 2) cut any leading ", " before the identifier (so the previous item keeps its comma)
        if before.rstrip().endswith(","):
            # remove the trailing whitespace and a single leading ", " portion isn't needed;
            # leave the previous comma; but if the previous token had no comma we add one
            pass
        elif before.rstrip().endswith("{"):
            # first item in braces — just remove leading brace area
            pass
        # Find the nearest preceding delimiter to remove redundant ", "
        # If the text immediately before `start` is ", " then remove that
        if before.endswith(", "):
            before = before[:-2]
        # If text after used to have a comma, we already removed it.
        # If this was the last item, `after` may start with `}`. That's fine.
        line = before + after
        lines[r - 1] = line
    new_src = "".join(lines)
    # Clean up empty named imports: `import { , } from "...";` or `import { } from "...";`
    new_src = re.sub(r"import\s*\{\s*\}\s*from\s*['\"][^'\"]+['\"]\s*;?", "", new_src)
    new_src = re.sub(r"import\s*\{\s*,", "{", new_src)
    new_src = re.sub(r",\s*\}", " }", new_src)
    if new_src != src:
        with open(fpath, "w", encoding="utf-8") as fp:
            fp.write(new_src)
        fixed_files += 1
        print(f"fixed: {fpath}")

print(f"Done. {fixed_files} file(s) updated.")
