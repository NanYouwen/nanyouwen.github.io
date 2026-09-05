import fs from 'node:fs';
import path from 'node:path';

const legacyDir = path.resolve(process.env.LEGACY_SITE_DIR || 'D:/Codex/nanyouwen.github.io');
const outputDir = path.resolve('source', '_posts', 'legacy');
const ignoredDirectories = new Set([
  '.git', 'archives', 'categories', 'css', 'img', 'js', 'links', 'page', 'tags', 'xml'
]);

const decodeHtml = (value) => value
  .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const meta = (html, property) => {
  const match = html.match(new RegExp(`<meta\\s+property="${property}"\\s+content="([\\s\\S]*?)">`, 'i'));
  return match ? decodeHtml(match[1]) : '';
};

const toShanghaiTime = (iso) => {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) {
    throw new Error(`Cannot parse timestamp: ${iso}`);
  }
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).format(value);
};

const yaml = (value) => JSON.stringify(value);

if (!fs.existsSync(legacyDir)) throw new Error(`Legacy site directory does not exist: ${legacyDir}`);
fs.mkdirSync(outputDir, { recursive: true });

const posts = fs.readdirSync(legacyDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !ignoredDirectories.has(entry.name))
  .map((entry) => {
    const slug = entry.name;
    const pagePath = path.join(legacyDir, slug, 'index.html');
    if (!fs.existsSync(pagePath)) return null;
    const html = fs.readFileSync(pagePath, 'utf8');
    const title = meta(html, 'og:title') || slug;
    const published = meta(html, 'article:published_time');
    const updated = meta(html, 'article:modified_time') || published;
    const tags = meta(html, 'article:tag') || '技术笔记';
    const categoryMatch = html.match(/href="\/categories\/[^\"]+\/" class="category-chain-item">([\s\S]*?)<\/a>/);
    const category = categoryMatch ? decodeHtml(categoryMatch[1].trim()) : '其他';
    const bodyMatch = html.match(/<div class="markdown-body">([\s\S]*?)<\/div>\s*<\/article>/);
    if (!published || !bodyMatch) throw new Error(`Could not extract post metadata/content from ${pagePath}`);
    return { slug, title, date: toShanghaiTime(published), updated: toShanghaiTime(updated), tags, category, body: bodyMatch[1].trim() };
  })
  .filter(Boolean)
  .sort((left, right) => left.date.localeCompare(right.date));

for (const [index, post] of posts.entries()) {
  const fileName = `${String(index + 1).padStart(2, '0')}-${post.date.slice(0, 10)}-${post.slug}.md`;
  const frontMatter = [
    '---', `title: ${yaml(post.title)}`, `date: ${yaml(post.date)}`, `updated: ${yaml(post.updated)}`,
    `categories: [${yaml(post.category)}]`, `tags: [${yaml(post.tags)}]`, `permalink: ${yaml(`/${post.slug}/`)}`,
    '---', ''
  ].join('\n');
  fs.writeFileSync(path.join(outputDir, fileName), `${frontMatter}${post.body}\n`, 'utf8');
}

console.log(`Extracted ${posts.length} legacy posts into ${outputDir}.`);
