import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const demoUrl = 'https://mahdiporkar.github.io/sh-core-ui/';
const repositoryUrl = 'https://github.com/mahdiporkar/sh-core-ui';

const styles: Record<string, CSSProperties> = {
  page: { maxInlineSize: 1180, margin: '0 auto', color: 'var(--sh-text)' },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: 'clamp(2rem, 7vw, 5rem)',
    borderRadius: 28,
    color: '#fff',
    background:
      'radial-gradient(circle at 85% 10%, #475467 0, transparent 32%), linear-gradient(135deg, #101828 0%, #1d2939 58%, #344054 100%)',
    boxShadow: '0 28px 80px rgb(16 24 40 / 22%)',
  },
  eyebrow: {
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: '#84caff',
    fontWeight: 700,
    fontSize: 13,
  },
  title: {
    maxInlineSize: 820,
    margin: '1rem 0',
    fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
    lineHeight: 0.96,
    letterSpacing: '-.055em',
  },
  lead: {
    maxInlineSize: 720,
    color: '#d0d5dd',
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    lineHeight: 1.7,
  },
  actions: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBlockStart: 30 },
  primary: {
    padding: '12px 20px',
    borderRadius: 10,
    color: '#101828',
    background: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
  },
  secondary: {
    padding: '12px 20px',
    border: '1px solid #667085',
    borderRadius: 10,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBlock: 32,
  },
  card: {
    padding: 22,
    border: '1px solid var(--sh-border)',
    borderRadius: 16,
    background: 'var(--sh-surface-raised)',
  },
  code: {
    padding: 22,
    overflow: 'auto',
    borderRadius: 16,
    color: '#d0d5dd',
    background: '#101828',
    lineHeight: 1.7,
  },
  security: {
    padding: 22,
    borderInlineStart: '4px solid var(--sh-warning)',
    borderRadius: 12,
    background: 'var(--sh-selected)',
  },
};

function Welcome() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.eyebrow}>Policy-Aware Enterprise UI Platform</div>
        <h1 style={styles.title}>Stable UI contracts. Replaceable vendors.</h1>
        <p style={styles.lead}>
          Build multilingual, data-heavy React products with organization-owned SH components,
          evaluated Manifest decisions, semantic tokens, and an enterprise grid—without leaking Ant
          Design or AG Grid contracts into application code.
        </p>
        <div style={styles.actions}>
          <a style={styles.primary} href="?path=/docs/components-shbutton--docs">
            Explore components
          </a>
          <a style={styles.secondary} href="?path=/story/foundations-design-tokens--semantic">
            View tokens
          </a>
          <a style={styles.secondary} href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub repository ↗
          </a>
        </div>
      </section>

      <section style={styles.grid} aria-label="Platform capabilities">
        {[
          ['SH* APIs', 'Semantic, vendor-neutral contracts implemented by isolated adapters.'],
          [
            'Manifest UX',
            'Consistent hide, disable, and read-only behavior from evaluated decisions.',
          ],
          ['Enterprise Grid', 'Generic SHGrid<T> with no AG Grid types in the stable public API.'],
          [
            'RTL + Themes',
            'English, Persian, Arabic, four themes, and runtime direction switching.',
          ],
        ].map(([title, description]) => (
          <article key={title} style={styles.card}>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <h2>Try the policy simulator</h2>
      <p>
        Use the Storybook toolbar to switch theme, density, locale, direction, and policy state.
        Then open any policy-aware component story.
      </p>
      <pre style={styles.code}>
        <code>{`<SHButton\n  variant="primary"\n  policy={{ resource: "your.resource", action: "your.action" }}\n>\n  Run action\n</SHButton>`}</code>
      </pre>

      <aside style={styles.security}>
        <strong>Security boundary:</strong> Manifest decisions improve UX; they never replace
        backend authorization or authorized data delivery.
      </aside>

      <p style={{ marginBlockStart: 28 }}>
        Canonical demo: <a href={demoUrl}>{demoUrl}</a>
      </p>
    </main>
  );
}

export default {
  title: 'Welcome/Overview',
  component: Welcome,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof Welcome>;
export const PlatformOverview: StoryObj<typeof Welcome> = {};
