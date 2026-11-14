/**
 * A legal text rendered from the message catalogue: the privacy notice and the
 * imprint. The copy lives in `messages/*.json` as sections of blocks, so a
 * clause can be added or reordered without touching a component.
 *
 * Block kinds (the same shape in every locale — the message checker compares
 * the catalogues by array index):
 *   "text"            a paragraph
 *   {h: "…"}          a sub-heading inside the section
 *   {list: ["…"]}     a bullet list
 *   {lines: ["…"]}    an address-style block, one line each
 *   {email: "…"}      a mailto link
 *   {url: "https://…"} an external link, opened in a new tab
 */

export type LegalBlock =
  | string
  | {h: string}
  | {list: string[]}
  | {lines: string[]}
  | {email: string}
  | {url: string};

export type LegalSection = {id: string; title: string; blocks: LegalBlock[]};

type Props = {
  title: string;
  lastUpdated?: string;
  intro?: string;
  sections: LegalSection[];
};

const LIST_STYLE = {paddingLeft: '1.25rem', margin: '0 0 1rem'} as const;

function Block({block}: {block: LegalBlock}) {
  if (typeof block === 'string') {
    return <p style={{margin: '0 0 1rem'}}>{block}</p>;
  }
  if ('h' in block) {
    return (
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: '#fff',
          margin: '1.5rem 0 0.5rem',
        }}
      >
        {block.h}
      </h3>
    );
  }
  if ('list' in block) {
    return (
      <ul style={LIST_STYLE}>
        {block.list.map((item, i) => (
          <li key={i} style={{marginBottom: '0.4rem'}}>{item}</li>
        ))}
      </ul>
    );
  }
  if ('lines' in block) {
    return (
      <p style={{margin: '0 0 1rem', color: '#fff'}}>
        {block.lines.map((line, i) => (
          <span key={i} style={{display: 'block'}}>{line}</span>
        ))}
      </p>
    );
  }
  if ('email' in block) {
    return (
      <p style={{margin: '0 0 1rem'}}>
        <a
          href={`mailto:${block.email}`}
          className="tap-link"
          style={{
            color: 'var(--red)',
            fontWeight: 700,
            fontSize: '1.05rem',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
          }}
        >
          {block.email}
        </a>
      </p>
    );
  }
  return (
    <p style={{margin: '0 0 1rem'}}>
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tap-link"
        style={{color: '#fff', textDecoration: 'underline', overflowWrap: 'anywhere'}}
      >
        {block.url}
      </a>
    </p>
  );
}

export default function LegalDoc({title, lastUpdated, intro, sections}: Props) {
  return (
    <article
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        fontFamily: 'var(--font-body)',
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem',
          fontWeight: 800,
          letterSpacing: '0.02em',
          marginBottom: '0.5rem',
          color: '#fff',
        }}
      >
        {title}
      </h1>
      {lastUpdated && (
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--steel)',
            letterSpacing: '0.04em',
            marginTop: 0,
            marginBottom: '2rem',
          }}
        >
          {lastUpdated}
        </p>
      )}

      {intro && <p style={{marginBottom: '2rem'}}>{intro}</p>}

      {sections.map(section => (
        <section key={section.id} id={section.id} style={{marginBottom: '2.5rem'}}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              marginBottom: '0.75rem',
              color: '#fff',
              borderLeft: '3px solid var(--red)',
              paddingLeft: '0.75rem',
            }}
          >
            {section.title}
          </h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
    </article>
  );
}
