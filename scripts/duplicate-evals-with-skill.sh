#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EVALS_DIR="$ROOT_DIR/evals"
SKILLS_DIR="$ROOT_DIR/skills"

if [ ! -d "$SKILLS_DIR" ]; then
  echo "No skills/ directory found at $SKILLS_DIR"
  exit 1
fi

# Remove all existing -with-skill evals
for dir in "$EVALS_DIR"/*-with-skill; do
  [ -d "$dir" ] && rm -rf "$dir"
done

# Duplicate each eval (that doesn't end with -with-skill) and copy skills
for dir in "$EVALS_DIR"/*/; do
  name="$(basename "$dir")"

  # Skip -with-skill dirs (already removed, but guard against edge cases)
  [[ "$name" == *-with-skill ]] && continue

  target="$EVALS_DIR/${name}-with-skill"
  cp -r "$dir" "$target"
  mkdir -p "$target/.claude"
  cp -r "$SKILLS_DIR" "$target/.claude/skills"

  echo "Created ${name}-with-skill"
done
