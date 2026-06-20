import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// Inline copy of the validation rules (kept in sync with app src/content/schema.ts).
function validate(week) {
  const errors = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week.week || '')) errors.push('bad week date');
  if (typeof week.title !== 'string') errors.push('missing title');
  if (!Array.isArray(week.lessons) || week.lessons.length === 0) errors.push('no lessons');
  for (const l of week.lessons || []) for (const q of l.questions || []) {
    const correct = (q.choices || []).filter(c => c.correct).length;
    if (correct !== 1) errors.push(`${l.id}/${q.id}: ${correct} correct`);
    if ((q.choices || []).length < 2 || (q.choices || []).length > 4) errors.push(`${l.id}/${q.id}: choice count`);
    for (const c of q.choices || []) {
      if (c.image && !existsSync(join('weeks', week.week, c.image))) errors.push(`missing image ${c.image}`);
    }
  }
  return errors;
}

// Cross-check the manifest points at weeks that actually exist.
const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
let bad = 0;
const present = new Set(readdirSync('weeks'));
for (const w of manifest.weeks) {
  if (!present.has(w)) { bad++; console.error(`✗ manifest lists ${w} but weeks/${w} is missing`); }
}
if (!manifest.weeks.includes(manifest.latestWeek)) { bad++; console.error(`✗ latestWeek ${manifest.latestWeek} not in weeks[]`); }

for (const dir of readdirSync('weeks')) {
  const week = JSON.parse(readFileSync(join('weeks', dir, 'content.json'), 'utf8'));
  if (week.week !== dir) { bad++; console.error(`✗ ${dir}: folder name != week field (${week.week})`); }
  const errs = validate(week);
  if (errs.length) { bad++; console.error(`✗ ${dir}:`, errs); } else console.log(`✓ ${dir}`);
}
process.exit(bad ? 1 : 0);
