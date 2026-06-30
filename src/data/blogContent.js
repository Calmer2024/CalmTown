import articleCover from "../../docs/Interests/Blog/xiangtu-china.jpg";
import calmTownDocument from "../../个人网页CalmTown.md?raw";

function normalizeVisibleDashes(text) {
  return text.replace(/[\u2014\u2013]+/g, " - ");
}

function extractArticleBody(raw) {
  const marker = "正文：";
  const start = raw.indexOf(marker);
  if (start === -1) {
    return [];
  }

  return raw
    .slice(start + marker.length)
    .split(/\r?\n/)
    .map((line) => normalizeVisibleDashes(line.trim()))
    .filter(Boolean);
}

export const blogArticles = [
  {
    slug: "xiangtu-china",
    title: "乡土中国正在消失",
    date: "2026年5月30日",
    category: "Essay",
    cover: articleCover,
    excerpt: "对我而言，属于我的乡土中国现在好像只剩下了我的奶奶。",
    body: extractArticleBody(calmTownDocument),
  },
];
