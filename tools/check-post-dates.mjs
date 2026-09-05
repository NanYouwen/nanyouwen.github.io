import fs from 'node:fs';
import path from 'node:path';

const postsDir = path.resolve('source', '_posts');
const files = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir, { recursive: true }).filter((file) => file.endsWith('.md'))
  : [];

const dates = [];
const datePattern = /^date:\s*(.+?)\s*$/m;

for (const file of files) {
  const fullPath = path.join(postsDir, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  const match = source.match(datePattern);

  if (!match) {
    throw new Error(`${fullPath} is missing a date front-matter field.`);
  }

  const text = match[1].replace(/^['"]|['"]$/g, '');
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) {
    throw new Error(`${fullPath} must use YYYY-MM-DD HH:mm:ss (got ${text}).`);
  }

  const timestamp = Date.parse(`${text.replace(' ', 'T')}+08:00`);
  if (Number.isNaN(timestamp)) {
    throw new Error(`${fullPath} has an invalid date: ${text}`);
  }

  dates.push({ file: fullPath, timestamp, text });
}

const refreshPosts = dates.filter(({ file }) => file.includes(`${path.sep}refresh${path.sep}`));
refreshPosts.sort((a, b) => a.timestamp - b.timestamp);

if (refreshPosts.length !== 120) {
  throw new Error(`Expected 120 refresh posts, found ${refreshPosts.length}.`);
}

for (let index = 1; index < refreshPosts.length; index += 1) {
  const gapDays = (refreshPosts[index].timestamp - refreshPosts[index - 1].timestamp) / 86_400_000;
  if (gapDays < 5 || gapDays > 7) {
    throw new Error(
      `The gap from ${refreshPosts[index - 1].file} (${refreshPosts[index - 1].text}) to ` +
      `${refreshPosts[index].file} (${refreshPosts[index].text}) is ${gapDays.toFixed(2)} days; expected 5–7.`
    );
  }
}

console.log(`Validated ${dates.length} total posts and ${refreshPosts.length} refresh post dates.`);
