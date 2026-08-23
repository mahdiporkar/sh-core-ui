# Component authoring and vendor independence

Define semantic props in `src/components/types.ts`, implement policy presentation in the public component, and map to Ant Design only under `src/adapters/antd`. Do not export vendor props, events, refs, or escape hatches as stable types. Add ref behavior, loading/error/empty semantics, keyboard and WCAG 2.2 AA review, RTL tests, unit tests, and Storybook stories.

Prefer logical CSS properties. Use semantic tokens instead of hard-coded values. Document unavoidable accessibility limitations in the support matrix.
