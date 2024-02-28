# get-csproj-version-fork

GitHub Action to retrieve the current version from a dotnet .csproj project file.
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
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Get version
        id: package_version
        uses: MWin10/get-csproj-version-fork@latest
        with:
          file: src/a_project.csproj

      - name: Create tag
        run: |
          git tag -m "CI: create new tag" v${{ steps.package_version.outputs.version }}
          git push --follow-tags
```

## Inputs

### `file`

This represents the path to the `.csproj` to retrieve the version number from.

### `regex`

This is the Regular Expression used to verify the version.
It defaults to an equivalent of `major.minor.patch` and requires all 3 integers to be present.

### `xpath`

This is the XPath locator for the `Version` element.
It defaults to `//PropertyGroup/Version`.

## Outputs

### `version`

This the `version` string as retrieved from the `package.json`.

## Errors

The action will fail if:

* it can't open the `file`
* it fails to retrieve the `<Version>` element
  * note that a newly created project does not contain any `<Version>` tag.
* the `version` string does not match the provided `regex`
