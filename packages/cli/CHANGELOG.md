# kosmesis

## 0.1.2

### Patch Changes

- f356e0e: Removed the unnecessary `baseUrl` assignment from `ensureTsconfigAlias`. This avoids the deprecated `baseUrl` compiler option, which is scheduled to stop working in TypeScript 7.0, while preserving the generated path alias configuration.

## 0.1.1

### Patch Changes

- ed03a9c: Install missing runtime dependencies automatically during `kosmesis init` and `kosmesis add`.
