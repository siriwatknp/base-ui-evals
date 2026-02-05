#!/usr/bin/env bash
set -euo pipefail

EXPERIMENT="$1"
RESULTS_DIR="results/$EXPERIMENT"

if [ ! -d "$RESULTS_DIR" ]; then
  echo "Error: results directory '$RESULTS_DIR' not found" >&2
  exit 1
fi

if [ -n "${2:-}" ]; then
  RUN_DIR="$RESULTS_DIR/$2"
  if [ ! -d "$RUN_DIR" ]; then
    echo "Error: run directory '$RUN_DIR' not found" >&2
    exit 1
  fi
  TIMESTAMP="$2"
else
  TIMESTAMP=$(ls -1 "$RESULTS_DIR" | sort | tail -1)
  RUN_DIR="$RESULTS_DIR/$TIMESTAMP"
fi

echo ""
echo "Experiment: $EXPERIMENT | Run: $TIMESTAMP"
echo ""

# Collect base eval names (exclude -with-skill variants)
BASE_EVALS=()
for dir in "$RUN_DIR"/*/; do
  name=$(basename "$dir")
  if [[ "$name" != *-with-skill ]]; then
    BASE_EVALS+=("$name")
  fi
done

if [ ${#BASE_EVALS[@]} -eq 0 ]; then
  echo "No evals found in $RUN_DIR"
  exit 0
fi

# Read data into arrays
declare -a EVAL_NAMES NOSKILL_PASS NOSKILL_DUR SKILL_PASS SKILL_DUR DELTA_STR

for eval_name in "${BASE_EVALS[@]}"; do
  EVAL_NAMES+=("$eval_name")

  summary="$RUN_DIR/$eval_name/summary.json"
  if [ -f "$summary" ]; then
    NOSKILL_PASS+=($(jq -r '.passRate' "$summary"))
    NOSKILL_DUR+=($(jq -r '.meanDuration' "$summary"))
  else
    NOSKILL_PASS+=("—")
    NOSKILL_DUR+=("—")
  fi

  skill_summary="$RUN_DIR/${eval_name}-with-skill/summary.json"
  if [ -f "$skill_summary" ]; then
    SKILL_PASS+=($(jq -r '.passRate' "$skill_summary"))
    SKILL_DUR+=($(jq -r '.meanDuration' "$skill_summary"))
  else
    SKILL_PASS+=("—")
    SKILL_DUR+=("—")
  fi

  # Compute delta
  ns_dur="${NOSKILL_DUR[${#NOSKILL_DUR[@]}-1]}"
  sk_dur="${SKILL_DUR[${#SKILL_DUR[@]}-1]}"
  if [[ "$ns_dur" != "—" && "$sk_dur" != "—" ]]; then
    delta=$(echo "$sk_dur - $ns_dur" | bc)
    pct=$(echo "scale=0; ${delta#-} * 100 / $ns_dur" | bc)
    if (( $(echo "$delta < 0" | bc -l) )); then
      DELTA_STR+=("${delta}s (${pct}% faster)")
    elif (( $(echo "$delta > 0" | bc -l) )); then
      DELTA_STR+=("+${delta}s (${pct}% slower)")
    else
      DELTA_STR+=("0s")
    fi
  else
    DELTA_STR+=("—")
  fi
done

# Format duration with 1 decimal
fmt_dur() {
  if [ "$1" = "—" ]; then echo "—"; else printf "%.1fs" "$1"; fi
}

# Column widths
W_EVAL=4  # min "Eval"
W_PASS=9  # "Pass Rate"
W_DUR=10  # "Duration" (with padding)
W_DELTA=10

for i in "${!EVAL_NAMES[@]}"; do
  len=${#EVAL_NAMES[$i]}
  (( len > W_EVAL )) && W_EVAL=$len

  d=$(fmt_dur "${NOSKILL_DUR[$i]}")
  (( ${#d} > W_DUR )) && W_DUR=${#d}
  d=$(fmt_dur "${SKILL_DUR[$i]}")
  (( ${#d} > W_DUR )) && W_DUR=${#d}

  (( ${#DELTA_STR[$i]} > W_DELTA )) && W_DELTA=${#DELTA_STR[$i]}
done

# Add padding
(( W_EVAL+=2 ))
(( W_PASS+=2 ))
(( W_DUR+=2 ))
(( W_DELTA+=2 ))

# Helpers
repeat_char() { printf '%*s' "$2" '' | tr ' ' "$1"; }
hline() { repeat_char '─' "$1"; }
center() {
  local text="$1" width="$2"
  local tlen=${#text}
  local pad=$(( (width - tlen) / 2 ))
  local rpad=$(( width - tlen - pad ))
  printf '%*s%s%*s' "$pad" '' "$text" "$rpad" ''
}

W_NOSKILL=$(( W_PASS + 1 + W_DUR ))  # pass│dur
W_SKILL=$(( W_PASS + 1 + W_DUR ))

# Header row 1
printf '┌%s┬%s┬%s┬%s┐\n' \
  "$(hline $W_EVAL)" "$(hline $W_NOSKILL)" "$(hline $W_SKILL)" "$(hline $W_DELTA)"

printf '│%s│%s│%s│%s│\n' \
  "$(center "Eval" $W_EVAL)" \
  "$(center "No Skill" $W_NOSKILL)" \
  "$(center "With Skill" $W_SKILL)" \
  "$(center "Δ Duration" $W_DELTA)"

# Header row 2 (sub-column labels)
printf '│%s├%s┬%s┼%s┬%s┤%s│\n' \
  "$(repeat_char ' ' $W_EVAL)" \
  "$(hline $W_PASS)" "$(hline $W_DUR)" \
  "$(hline $W_PASS)" "$(hline $W_DUR)" \
  "$(repeat_char ' ' $W_DELTA)"

printf '│%s│%s│%s│%s│%s│%s│\n' \
  "$(repeat_char ' ' $W_EVAL)" \
  "$(center "Pass Rate" $W_PASS)" \
  "$(center "Duration" $W_DUR)" \
  "$(center "Pass Rate" $W_PASS)" \
  "$(center "Duration" $W_DUR)" \
  "$(repeat_char ' ' $W_DELTA)"

# Separator
printf '├%s┼%s┼%s┼%s┼%s┼%s┤\n' \
  "$(hline $W_EVAL)" "$(hline $W_PASS)" "$(hline $W_DUR)" \
  "$(hline $W_PASS)" "$(hline $W_DUR)" "$(hline $W_DELTA)"

# Data rows
for i in "${!EVAL_NAMES[@]}"; do
  ns_dur_fmt=$(fmt_dur "${NOSKILL_DUR[$i]}")
  sk_dur_fmt=$(fmt_dur "${SKILL_DUR[$i]}")

  printf '│%s│%s│%s│%s│%s│%s│\n' \
    "$(center "${EVAL_NAMES[$i]}" $W_EVAL)" \
    "$(center "${NOSKILL_PASS[$i]}" $W_PASS)" \
    "$(center "$ns_dur_fmt" $W_DUR)" \
    "$(center "${SKILL_PASS[$i]}" $W_PASS)" \
    "$(center "$sk_dur_fmt" $W_DUR)" \
    "$(center "${DELTA_STR[$i]}" $W_DELTA)"
done

# Bottom border
printf '└%s┴%s┴%s┴%s┴%s┴%s┘\n' \
  "$(hline $W_EVAL)" "$(hline $W_PASS)" "$(hline $W_DUR)" \
  "$(hline $W_PASS)" "$(hline $W_DUR)" "$(hline $W_DELTA)"

echo ""

# --- Transcript Summary ---

extract_steps() {
  local transcript="$1"
  jq -r '
    select(.type == "assistant") |
    .message.content[]? |
    select(.type == "tool_use") |
    .name as $tool |
    (
      if $tool == "Bash" then (.input.command // "" | split("\n")[0])
      elif $tool == "Read" then (.input.file_path // "" | split("/") | last)
      elif $tool == "Glob" then (.input.pattern // "")
      elif $tool == "Edit" then (.input.file_path // "" | split("/") | last)
      elif $tool == "Write" then (.input.file_path // "" | split("/") | last)
      elif $tool == "Skill" then (.input.skill // "")
      elif $tool == "Grep" then (.input.pattern // "")
      elif $tool == "WebSearch" then (.input.query // "")
      elif $tool == "WebFetch" then (.input.url // "")
      elif $tool == "Task" then (.input.description // "")
      else ""
      end
    ) as $arg |
    "\($tool) \($arg)"
  ' "$transcript" 2>/dev/null
}

word_wrap() {
  local text="$1" max_width="$2"
  local current="" word words
  read -ra words <<< "$text"
  for word in "${words[@]}"; do
    if [ -z "$current" ]; then
      current="$word"
    elif [ $((${#current} + 1 + ${#word})) -le "$max_width" ]; then
      current="$current $word"
    else
      echo "$current"
      current="$word"
    fi
  done
  [ -n "$current" ] && echo "$current"
}

T_COL=44
T_CONTENT=$((T_COL - 2))
T_PREFIX=4
T_TEXT=$((T_CONTENT - T_PREFIX))

build_cell_lines() {
  local step_num="$1" step_text="$2"
  local idx=0
  while IFS= read -r wline; do
    if [ $idx -eq 0 ]; then
      printf '%2d. %s\n' "$step_num" "$wline"
    else
      printf '    %s\n' "$wline"
    fi
    idx=$((idx + 1))
  done < <(word_wrap "$step_text" $T_TEXT)
}

for eval_name in "${BASE_EVALS[@]}"; do
  runs=()
  for run_dir in "$RUN_DIR/$eval_name"/run-*/; do
    [ -d "$run_dir" ] && runs+=("$(basename "$run_dir")")
  done
  [ ${#runs[@]} -eq 0 ] && continue

  for run in "${runs[@]}"; do
    ns_transcript="$RUN_DIR/$eval_name/$run/transcript.jsonl"
    sk_transcript="$RUN_DIR/${eval_name}-with-skill/$run/transcript.jsonl"

    ns_steps=()
    if [ -f "$ns_transcript" ]; then
      while IFS= read -r line; do ns_steps+=("$line"); done < <(extract_steps "$ns_transcript")
    fi

    sk_steps=()
    if [ -f "$sk_transcript" ]; then
      while IFS= read -r line; do sk_steps+=("$line"); done < <(extract_steps "$sk_transcript")
    fi

    [ ${#ns_steps[@]} -eq 0 ] && [ ${#sk_steps[@]} -eq 0 ] && continue

    max_rows=$(( ${#ns_steps[@]} > ${#sk_steps[@]} ? ${#ns_steps[@]} : ${#sk_steps[@]} ))

    echo "$eval_name ($run)"
    printf '┌%s┬%s┐\n' "$(hline $T_COL)" "$(hline $T_COL)"
    printf '│%s│%s│\n' "$(center "No Skill (${#ns_steps[@]} steps)" $T_COL)" "$(center "With Skill (${#sk_steps[@]} steps)" $T_COL)"
    printf '├%s┼%s┤\n' "$(hline $T_COL)" "$(hline $T_COL)"

    for (( i=0; i<max_rows; i++ )); do
      ns_lines=()
      if [ $i -lt ${#ns_steps[@]} ]; then
        while IFS= read -r wline; do ns_lines+=("$wline"); done < <(build_cell_lines $((i+1)) "${ns_steps[$i]}")
      fi

      sk_lines=()
      if [ $i -lt ${#sk_steps[@]} ]; then
        while IFS= read -r wline; do sk_lines+=("$wline"); done < <(build_cell_lines $((i+1)) "${sk_steps[$i]}")
      fi

      display_rows=$(( ${#ns_lines[@]} > ${#sk_lines[@]} ? ${#ns_lines[@]} : ${#sk_lines[@]} ))
      [ $display_rows -eq 0 ] && display_rows=1

      for (( j=0; j<display_rows; j++ )); do
        printf '│ %-*s│ %-*s│\n' $((T_COL-1)) "${ns_lines[$j]:-}" $((T_COL-1)) "${sk_lines[$j]:-}"
      done
    done

    printf '└%s┴%s┘\n' "$(hline $T_COL)" "$(hline $T_COL)"
    echo ""
  done
done
