export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  sections: { heading?: string; body: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "pythag-dashboard-latency",
    title: "How We Cut Pythag Dashboard Latency by 40%",
    excerpt:
      "A four-month performance refactor on a real-time SaaS monitoring platform — from bundle bloat and render thrashing to sub-100ms dashboards.",
    date: "Sep 2025",
    readTime: "6 min read",
    tags: ["Next.js", "WebSockets", "Performance", "Highcharts"],
    sections: [
      {
        body:
          "Pythag is a cell-monitoring SaaS platform where operators stare at live dashboards all day. When latency crept above 200ms during peak traffic, engagement dropped and support tickets spiked. We had four months to fix it without breaking production.",
      },
      {
        heading: "The problem",
        body:
          "Three bottlenecks stood out: oversized client bundles from eager Highcharts imports, React re-renders on every WebSocket tick, and API payloads that sent full history instead of deltas. Peak hours pushed API failure rates up 60% above baseline.",
      },
      {
        heading: "What we changed",
        body:
          "We split the Next.js app with dynamic imports for chart modules, memoized dashboard tiles, and moved WebSocket updates into a lightweight store that batches ticks every 100ms. On the API side, we introduced delta payloads and connection pooling for PostgreSQL read replicas.",
      },
      {
        heading: "Results",
        body:
          "Dashboard latency dropped from ~180ms to under 100ms at p95. Frontend load time improved 40%, session engagement rose 25%, and API failures during peak traffic fell 60%. Uptime held at 99.9% through the rollout.",
      },
      {
        heading: "Takeaway",
        body:
          "Real-time UIs punish small inefficiencies. Measure p95 latency, batch high-frequency updates, and treat chart libraries as lazy-loaded islands — not global dependencies. The full case study with stack details is in the Work section.",
      },
    ],
  },
];
