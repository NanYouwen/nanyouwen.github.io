# 南有文的小破站：Hexo 源码骨架

这个目录是从已发布的静态站点反向建立的可维护源码，不会改动 `D:\Codex\nanyouwen.github.io`。它固定使用 Hexo 7.3.0 和 Fluid 1.9.8，并保留原站的站点名称、中文导航、横幅、搜索、站点地图、LeanCloud 计数配置和 URL 结构。

## 使用

```powershell
npm install
npm run serve
```

本地预览地址为 `http://localhost:4000`。构建静态站点：

```powershell
npm run check
```

构建结果会写入被 Git 忽略的 `public\`。发布前应把该目录与原 GitHub Pages 仓库的静态文件做一次审查，而不是直接把这个源码目录推到 Pages 分支。

## 写文章

文章放在 `source\_posts\`，并使用已发布站点一致的标题型链接。每篇文章的日期要保留秒，例如：

```yaml
---
title: 示例标题
date: 2026-01-08 14:32:17
categories:
  - AI 与 Agent
tags:
  - Agent
---
```

`npm run check` 会检查每篇文章都有完整的秒级日期，并验证相邻文章的发布时间间隔为 5 到 7 天。每篇文章如需稳定的修改时间，可以显式写入 `updated`；否则站点会使用文章日期，避免重建后历史文章显示成今天更新。

## 配置边界

- `_config.yml`：Hexo、URL、分页、Markdown、搜索和 sitemap 配置。
- `_config.fluid.yml`：仅覆盖 Fluid 默认主题的原站视觉设置。升级 Fluid 时尽量只调整此文件。
- `source\img\`：原站图片资源的保留副本；新文章可继续引用 `/img/...`。

历史文章的原始 Markdown 已不在公开仓库中，因此应单独迁回 `source\_posts\`；不要把生成的 `public\` 当作唯一源码。
