import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('source', '_posts');
const map = new Map([
  ['Agent 工程', 'AI 与 Agent'],
  ['Agent 工作流', 'AI 与 Agent'],
  ['Agent 入门', 'AI 与 Agent'],
  ['Agent 实践', 'AI 与 Agent'],
  ['AI 安全', 'AI 与 Agent'],
  ['AI 工程', 'AI 与 Agent'],
  ['AI 入门', 'AI 与 Agent'],
  ['AI 实践', 'AI 与 Agent'],
  ['AI 随笔', 'AI 与 Agent'],
  ['Web 实践', 'Web 与前端'],
  ['web', 'Web 与前端'],
  ['js', 'Web 与前端'],
  ['vue基础', 'Web 与前端'],
  ['vue进阶', 'Web 与前端'],
  ['java基础', '后端与数据'],
  ['数据与后端', '后端与数据'],
  ['其他', '后端与数据'],
  ['工程习惯', '工程与工具'],
  ['开发工具', '工程与工具'],
  ['发布与运维', '发布与质量'],
  ['测试与协作', '发布与质量'],
  ['安全与维护', '安全与维护']
]);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full);
  }
};
walk(root);

let changed = 0;
for (const file of files) {
  const input = fs.readFileSync(file, 'utf8');
  const output = input.replace(/^(categories:\s*\[\s*["'])(.+?)(["']\s*\])$/m, (line, before, old, after) => {
    const next = map.get(old);
    if (!next) throw new Error(`Unmapped category ${old} in ${file}`);
    return `${before}${next}${after}`;
  });
  if (output !== input) {
    fs.writeFileSync(file, output, 'utf8');
    changed++;
  }
}
console.log(`Consolidated categories in ${changed} posts into ${new Set(map.values()).size} groups.`);
