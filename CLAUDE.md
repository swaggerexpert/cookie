# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install              # Install dependencies
npm run build            # Full build: compile grammar + ES modules + CommonJS + UMD browser bundles
npm run grammar:compile  # Compile ABNF grammar to JavaScript parser
npm run build:es         # Build ES modules only (to es/ directory)
npm run build:cjs        # Build CommonJS modules only (to cjs/ directory)
npm run build:umd:browser # Build UMD browser bundles only (to dist/ directory)
npm test                 # Run all tests with Mocha (against src/)
npm run test:artifacts   # Smoke test built artifacts (es/, cjs/, dist/), run after npm run build
npm run test:types       # Type check typings as CommonJS and ES module consumers, run after npm run build
npm run test:watch       # Run tests in watch mode
```

## Architecture

This library parses, validates and serializes [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265) cookies using an ABNF grammar and the apg-lite parser generator.

### Core Components

- **`src/grammar.bnf`** - ABNF grammar definition. Contains both strict (`cookie-string`, ...) and lenient (`lenient-cookie-string`, ...) rules. When modified, run `npm run grammar:compile` to regenerate `src/grammar.js`.

- **`src/grammar.js`** - Auto-generated parser from the ABNF grammar. Do not edit directly.

- **`src/cookie/parse/index.js`** - Main parser function (`parseCookie`). Accepts `strict`, `translator`, `stats` and `trace` options. Returns `{ result, tree, stats, trace }` plus deprecated lazily computed `ast` (ListTranslator) retained for backward compatibility.

- **`src/cookie/parse/translators/`** - Translator classes that extend apg-lite's `Ast`. Each translator registers callbacks for both strict and lenient rules and normalizes them to the same node types (`cookie-string`, `cookie-pair`, `cookie-name`, `cookie-value`):
  - `CSTTranslator` - Produces Concrete Syntax Tree with `{ type, text, start, length, children }` nodes
  - `ASTTranslator` - Default. Produces `{ type: 'CookieString', pairs: [{ type: 'CookiePair', name, value }] }` (extends CSTTranslator)
  - `ListTranslator` - Produces list of `[type, text]` tuples
  - `XMLTranslator` - Produces XML string representation (extends CSTTranslator)

- **`src/cookie/test/`** - Validation functions (`testCookie`, and internal cookie name/value tests).

- **`src/cookie/serialize/`** and **`src/set-cookie/serialize/`** - Serialization with pluggable encoders and validators.

- **`*.node.js` / `*.browser.js`** - Environment specific base64 encoders/decoders. Source code imports `*.node.js` variants; the `browser` field in package.json swaps them for es/ and cjs/ builds, and webpack's `NormalModuleReplacementPlugin` swaps them for UMD bundles.

- **`src/errors/`** - `CookieError` (base) and `CookieParseError`.

### Backward Compatibility

The public API must stay backward compatible. Notably `parseResult.ast.translate(parts)` and `parseResult.ast.toXml()` must keep producing the same output (see `test/cookie/parse/backward-compatibility.js`), and the build output must keep running on Node.js >= 12.20.0.

### Build Output

The library produces multiple module formats:
- `es/` - ES modules (`.mjs` files)
- `cjs/` - CommonJS modules (`.cjs` files), kept for backward compatibility; bundles its own copy of apg-lite (ES module only)
  at `cjs/apg-lite.cjs`, imports are rewritten by `module-resolver` in `babel.config.cjs`
- `dist/` - UMD browser bundles exposing the `SwaggerExpertCookie` global; `dist/package.json`
  (copied from `config/webpack/dist-package.json`) marks them CommonJS, so that Node.js >= 16 can `require` them
- `types/` - TypeScript declarations in `types/index.d.ts` (ESM). The build copies it to `types/index.d.cts` (generated, gitignored),
  which the `require` export condition points to, so that CommonJS consumers with `node16`/`nodenext` resolution get types.

Error classes define their `name` explicitly, as minifiers mangle class names.

`test/artifacts/` tests built artifacts as consumers use them: `smoke.cjs` loads the package by name (CommonJS,
ES module, UMD) and `types/` contains CommonJS and ES module consumers for `tsc`. CI runs the smoke test against
the packed tarball installed into a new project on every Node.js version from `engines` up.

Babel handles the transformation with custom plugins for import extension rewriting.

### Releasing

Releases are cut manually via the `Release` GitHub workflow using semantic-release, and published to npm using trusted publishing (OIDC) with provenance. Commit messages must follow Conventional Commits (enforced by commitlint via husky `commit-msg` hook).
