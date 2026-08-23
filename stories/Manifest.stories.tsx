import type { Meta, StoryObj } from '@storybook/react';
function ManifestGuide() {
  return (
    <article>
      <h1>Manifest-driven UI</h1>
      <p>
        The host fetches an evaluated Effective Manifest and injects it into SHCoreProvider. Toolbar
        controls simulate allowed, hidden, disabled, read-only, missing, and expired decisions.
      </p>
      <strong>
        The Manifest controls UX only. Backend services or the Go Proxy must re-authorize every
        protected operation and omit unauthorized fields and rows before serialization.
      </strong>
    </article>
  );
}
export default {
  title: 'Architecture/Manifest and security',
  component: ManifestGuide,
} satisfies Meta<typeof ManifestGuide>;
export const Guide: StoryObj<typeof ManifestGuide> = {};
