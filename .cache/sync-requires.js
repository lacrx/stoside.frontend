
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/home/thomas/repos/stoside/frontend/.cache/dev-404-page.js")),
  "component---src-pages-404-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/pages/404.tsx")),
  "component---src-pages-about-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/pages/about.tsx")),
  "component---src-pages-articles-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/pages/articles.tsx")),
  "component---src-pages-events-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/pages/events.tsx")),
  "component---src-pages-index-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/pages/index.tsx")),
  "component---src-pages-learn-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/pages/learn.tsx")),
  "component---src-templates-article-tsx": preferDefault(require("/home/thomas/repos/stoside/frontend/src/templates/article.tsx"))
}

