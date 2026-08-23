import { readFile, stat } from 'node:fs/promises';
import webpack from 'webpack';
import configFactory from '../fixtures/webpack.config.cjs';
const budgets = { 'button-only': 700_000, 'form-subset': 1_000_000, grid: 4_000_000 };
for (const [fixture, budget] of Object.entries(budgets)) {
  const config = configFactory({ fixture });
  await new Promise((resolve, reject) =>
    webpack(config, (error, stats) =>
      error || stats?.hasErrors()
        ? reject(error ?? new Error(stats?.toString('errors-only')))
        : resolve(),
    ),
  );
  const file = `fixtures/${fixture}/dist/bundle.js`;
  const size = (await stat(file)).size;
  if (size > budget) throw new Error(`${fixture} bundle ${size} exceeds ${budget}`);
  const content = await readFile(file, 'utf8');
  if (fixture === 'button-only' && /ag-grid|AgGridReact|LicenseManager/.test(content))
    throw new Error('button-only bundle contains AG Grid');
  console.log(`${fixture}: ${size} bytes (budget ${budget})`);
}
