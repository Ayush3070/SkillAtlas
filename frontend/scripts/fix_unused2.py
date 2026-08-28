#!/usr/bin/env python3
"""Re-run unused-import cleanup using actual tsc errors only on import lines."""
import re, subprocess, os, glob

os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
out = subprocess.run(
    ["npx", "tsc", "-p", "tsconfig.app.json", "--noEmit"],
    capture_output=True, text=True
)

# Parse errors
errors = []
for line in (out.stdout + out.stderr).splitlines():
    # Only fix TS6133 (unused), TS6196 (imported but unused in type-only), TS6192 (all in import unused), TS6198 (all destructured unused)
    m = re.match(r"^(.*?)\((\d+),(\d+)\): error (TS\d+): (.+)$", line)
    if m and m.group(4) in ("TS6133", "TS6196", "TS6192", "TS6198"):
        errors.append((m.group(1), int(m.group(2)), int(m.group(3)), m.group(4), m.group(5)))

# Group by file
by_file = {}
for f, r, c, code, msg in errors:
    by_file.setdefault(f, []).append((r, c, code, msg))

fixed = 0
for fpath, items in by_file.items():
    with open(fpath, "r") as fp:
        src = fp.read()
    lines = src.splitlines(keepends=True)

    # For TS6192 (whole import statement unused), we need to identify which import block.
    # Easiest: find the entire import statement starting at the error row by scanning back to the previous `;` or line start.
    # For TS6133/TS6196: remove a single named import.
    # For TS6198: this means a destructured assignment is unused; skip (needs manual review).

    # Process in reverse line order to keep line numbers stable
    items_sorted = sorted(items, key=lambda x: -x[0])

    for r, c, code, msg in items_sorted:
        if code == "TS6192":
            # Find the import statement starting from a line at or before r
            start = r - 1
            # Scan backwards to find the line beginning of the import
            end_line = None
            for i in range(start, -1, -1):
                if ";" in lines[i] or lines[i].rstrip().endswith(";"):
                    end_line = i
                    break
            if end_line is None:
                end_line = 0
            # The import statement could span multiple lines; for simplicity, only handle single-line imports
            # Reconstruct by collecting lines from end_line to start
            joined = "".join(lines[end_line:start + 1])
            # If this looks like an import statement, delete it
            if re.match(r"^\s*import\b", joined):
                del lines[end_line:start + 1]
                continue

        if code in ("TS6133", "TS6196"):
            # Find the named import on line r (1-indexed)
            if r - 1 >= len(lines): continue
            line = lines[r - 1]
            # If this is a `type { ... }` line, find `type` import
            # Determine start col of identifier
            # The error col is 1-indexed and points to the identifier
            # Find the name from the error message
            m = re.match(r"'([^']+)' is (declared|imported) but", msg)
            if not m: continue
            name = m.group(1)
            # Find name in line
            mm = re.search(r"\b" + re.escape(name) + r"\b", line)
            if not mm: continue
            start, end = mm.start(), mm.end()
            # Determine where in the import braces this is
            # Look for `{` before start
            before = line[:start]
            after = line[end:]
            # Trim leading ", "
            if before.rstrip().endswith(","):
                # keep the previous comma, just remove name + optional trailing
                pass
            elif before.rstrip().endswith("{"):
                pass
            else:
                # remove leading ", " if present
                idx = before.rfind(", ")
                if idx != -1 and line[idx:].count("{") >= line[idx:].count("}"):
                    before = before[:idx]
            # Trim trailing ", "
            if after.startswith(", "):
                after = after[2:]
            elif after.startswith(","):
                after = after[1:]
            line = before + after
            lines[r - 1] = line

    new_src = "".join(lines)
    # Final cleanup pass: clean up empty braces and dangling commas in any import line
    new_src = re.sub(r"import\s*\{\s*,?\s*\}\s*from\s*['\"][^'\"]+['\"]\s*;?", "", new_src)
    new_src = re.sub(r",\s*\}", " }", new_src)
    new_src = re.sub(r"\{\s*,", "{", new_src)
    if new_src != src:
        with open(fpath, "w") as fp:
            fp.write(new_src)
        fixed += 1
        print("fixed:", fpath)

print(f"Done. {fixed} file(s) updated.")
