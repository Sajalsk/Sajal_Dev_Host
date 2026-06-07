import { useState } from "react";
import { MdArrowOutward, MdClose } from "react-icons/md";
import { blogPosts, type BlogPost } from "../data/blog";
import "./styles/Blog.css";

const Blog = () => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <>
      <div className="blog-section section-container" id="blog">
        <div className="blog-container">
          <h2>
            Technical <span>write-ups</span>
          </h2>
          <p className="blog-intro">
            Deep dives on performance, architecture, and lessons from production
            work.
          </p>

          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.slug}>
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-tags">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button
                  className="blog-read-btn"
                  onClick={() => setActivePost(post)}
                  data-cursor="disable"
                  type="button"
                >
                  Read article <MdArrowOutward />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      {activePost && (
        <div
          className="blog-modal-overlay"
          onClick={() => setActivePost(null)}
          data-cursor="disable"
        >
          <div
            className="blog-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="blog-modal-close"
              onClick={() => setActivePost(null)}
              aria-label="Close"
              type="button"
            >
              <MdClose />
            </button>
            <div className="blog-modal-meta">
              <span>{activePost.date}</span>
              <span>{activePost.readTime}</span>
            </div>
            <h2>{activePost.title}</h2>
            <div className="blog-modal-tags">
              {activePost.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="blog-modal-body">
              {activePost.sections.map((section, i) => (
                <section key={i}>
                  {section.heading && <h4>{section.heading}</h4>}
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
