# get-node-package-version

GitHub Action to retrieve the current version from a node package.json.
Places the retrieved version into a context variable for later reference.

## Usage

In a GitHub Workflow that runs after merging a Pull Request:

```yaml
name: Auto-tag on merged PR

on:
  pull_request:
    branches:
      - main
    types: [closed]

jobs:
  build:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Get version
        id: package_version
        uses: KageKirin/get-node-package-version@v0

      - name: Create tag
        run: |
          git tag -m "CI: create new tag" v${{ steps.test.package_version.version }}
          git push https://${{ github.token }}@github.com/OWNER/REPO
```

## Inputs

### `file`

This represents the path to the `package.json` to retrieve the version number from.
It defaults to `package.json`,
but you might need to adapt it if the file is named differently,
or lies in a subfolder.

### `regex`

This is the Regular Expression used to verify the version.
It defaults to an equivalent of `major.minor.patch` and requires all 3 integers to be present.

## Outputs

### `version`

This the `version` string as retrieved from the `package.json`.

## Errors

The action will fail if:

* it can't open the `file`
* it fails to retrieve the `version` element
* the `version` string does not match the provided `regex`
