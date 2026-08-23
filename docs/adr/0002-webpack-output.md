# ADR 0002: Webpack 5 is authoritative

Status: accepted

Webpack 5 with `ts-loader` and `ForkTsCheckerWebpackPlugin` emits static ESM and CJS. Strict `tsc --emitDeclarationOnly` emits declarations. Vendor runtimes are peers and Webpack externals. CSS is the only declared package side effect.
