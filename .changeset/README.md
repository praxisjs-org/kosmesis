# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## How to create a changeset

When you make changes to one or more packages, run:

```sh
pnpm changeset
```

This will prompt you to:
1. Select which packages were changed
2. Choose the bump type (patch / minor / major) for each
3. Write a summary of the changes

A `.md` file will be created in this directory. Commit it together with your changes.

## Release flow

On every push to `main`, the CI workflow will:
- **If there are pending changesets**: open (or update) a "Version Packages" pull request that bumps versions and updates `CHANGELOG.md` files
- **If the "Version Packages" PR was merged**: publish only the packages whose versions were bumped to npm