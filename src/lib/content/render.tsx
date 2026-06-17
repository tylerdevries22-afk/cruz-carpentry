import { Fragment, type ReactNode } from "react";

/**
 * Render an editable copy string, preserving two lightweight markers so headings
 * stay editable as plain text without losing their styling:
 *   - "\n"        → a line break (<br/>)
 *   - *asterisks* → an italic emphasis span (<em className="italic">)
 * Pure (no hooks) so it works in both server and client components.
 */
export function renderCopy(value: string): ReactNode {
  return value.split("\n").map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {emphasize(line)}
    </Fragment>
  ));
}

function emphasize(line: string): ReactNode {
  const parts = line.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <em key={i} className="italic">
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
