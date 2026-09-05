import fs from 'node:fs';
import path from 'node:path';

const refreshDir = path.resolve('source', '_posts', 'refresh');
const minimumHan = 1800;
const maximumHan = 3000;
const expectedCount = 120;
const frontMatterPattern = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/;
const fieldPattern = (name) => new RegExp(`^${name}:\\s*["']?(.+?)["']?\\s*$`, 'm');

const files = fs.existsSync(refreshDir)
  ? fs.readdirSync(refreshDir, { recursive: true })
    .filter((file) => file.endsWith('.md') && /batch-(01|02|03)[\\/]/.test(file))
    .map((file) => path.join(refreshDir, file))
  : [];

if (files.length !== expectedCount) {
  throw new Error(`Expected ${expectedCount} refresh posts, found ${files.length}.`);
}

const posts = files.map((file) => {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(frontMatterPattern);
  if (!match) throw new Error(`${file} has invalid front matter.`);
  const frontMatter = match[1];
  const body = match[2];
  const date = (frontMatter.match(fieldPattern('date')) || [])[1]?.trim();
  const updated = (frontMatter.match(fieldPattern('updated')) || [])[1]?.trim();
  const title = (frontMatter.match(fieldPattern('title')) || [])[1]?.trim();
  const permalink = (frontMatter.match(fieldPattern('permalink')) || [])[1]?.trim();
  if (!date || !updated || !title || !permalink) {
    throw new Error(`${file} is missing title/date/updated/permalink.`);
  }
  if (date !== updated) throw new Error(`${file} has date != updated.`);
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
    throw new Error(`${file} must use YYYY-MM-DD HH:mm:ss.`);
  }
  const timestamp = Date.parse(`${date.replace(' ', 'T')}+08:00`);
  const han = (body.match(/[\u3400-\u9fff]/g) || []).length;
  if (han < minimumHan || han > maximumHan) {
    throw new Error(`${file} has ${han} Han characters; expected ${minimumHan}–${maximumHan}.`);
  }
  return { file, date, timestamp, title, permalink, han };
});

posts.sort((left, right) => left.timestamp - right.timestamp);
const seenPermalinks = new Set();
for (const post of posts) {
  if (seenPermalinks.has(post.permalink)) throw new Error(`Duplicate permalink: ${post.permalink}`);
  seenPermalinks.add(post.permalink);
  if (post.timestamp > Date.parse('2026-09-05T23:59:59+08:00')) {
    throw new Error(`Future refresh post date: ${post.file}`);
  }
}

for (let index = 1; index < posts.length; index += 1) {
  const previous = posts[index - 1];
  const current = posts[index];
  const previousDate = previous.date.slice(0, 10);
  const currentDate = current.date.slice(0, 10);
  const calendarGap = (Date.parse(`${currentDate}T00:00:00+08:00`) - Date.parse(`${previousDate}T00:00:00+08:00`)) / 86_400_000;
  if (calendarGap < 5 || calendarGap > 7) {
    throw new Error(`Calendar gap ${calendarGap} days: ${previous.file} -> ${current.file}.`);
  }
}

for (const post of posts.filter(({ date }) => date.startsWith('2026-'))) {
  const source = fs.readFileSync(post.file, 'utf8');
  if (!/(AI|Agent|ai|agent)/.test(source)) {
    throw new Error(`2026 post is missing AI/Agent focus: ${post.file}`);
  }
}

console.log(`Validated ${posts.length} refresh posts: 5–7 day calendar gaps, unique routes, ${minimumHan}–${maximumHan} Han characters each.`);
