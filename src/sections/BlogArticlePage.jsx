import { ArrowLeft } from "@phosphor-icons/react";
import { blogArticles } from "../data/blogContent";

export default function BlogArticlePage({ slug }) {
  const article = blogArticles.find((item) => item.slug === slug) ?? blogArticles[0];

  return (
    <main className="blog-article-page">
      <article className="blog-article-shell">
        <a className="blog-article-back" href="#blog">
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          <span className="sr-only">Back to Blog</span>
        </a>

        <header className="blog-article-header">
          <p>{article.category}</p>
          <h1>{article.title}</h1>
          <time dateTime="2026-05-30">{article.date}</time>
        </header>

        <img className="blog-article-cover" src={article.cover} alt={`${article.title} article cover`} />

        <div className="blog-article-body">
          {article.body.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
