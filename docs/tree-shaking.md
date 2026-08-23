# Tree shaking and bundle budgets

Webpack production fixtures import the components subpath or grid subpath. The button-only fixture must contain no AG Grid marker. Current release-blocking budgets are 700 kB for button-only, 1 MB for the small form subset, and 4 MB for grid; measured sizes are printed by `npm run test:tree-shaking` and should trend downward.
