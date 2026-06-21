import type { FC } from 'react';

/**
 * Renders a JSON-LD <script> in server-rendered HTML so crawlers and AI search
 * bots (which often don't execute client JS) can read structured data directly.
 *
 * Pass a single schema object or an array; arrays are emitted as a @graph-style
 * list of scripts.
 */
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export const JsonLd: FC<JsonLdProps> = ({ data }) => {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is author-controlled (never user input).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
