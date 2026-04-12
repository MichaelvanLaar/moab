import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

/**
 * Remark plugin that calculates reading time from the Markdown AST and
 * injects it into the Astro frontmatter as `readingTime`.
 *
 * Usage in .astro files:
 *   const { readingTime } = post.data.astro.frontmatter;
 */
export default function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
