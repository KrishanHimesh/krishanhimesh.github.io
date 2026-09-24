import { useEffect } from 'react';

const SITE_NAME = 'Krishan Himesh';
const SITE_URL = 'https://krishanhimesh.github.io';

/**
 * Sets document.title and the meta-description/canonical/OG tags for the
 * current route. Google renders JS before indexing so this genuinely helps
 * distinguish pages in search results (and keeps browser tabs/bookmarks and
 * link-preview scrapers that DO run JS accurate); it isn't a substitute for
 * having distinct, crawlable URLs, which the BrowserRouter migration covers.
 */
export default function useDocumentMeta({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);

    const url = `${SITE_URL}${path}`;
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
  }, [title, description, path]);
}
