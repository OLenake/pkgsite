# Frontend

The _frontend_ presents user-facing web pages on pkg.go.dev.

For additional information on functionality of the frontend, see the
[design document](design.md).

## Development

The main program lives in `cmd/frontend`. The bulk of the code lives in
`internal/frontend`.

See [experiment.md](experiment.md) for instructions how to enable experiments.

### Running

You can run the frontend locally like so:

    go run ./cmd/frontend [-dev] [-direct_proxy]

- The `-dev` flag reloads templates on each page load.

The frontend can use one of three datasources:

- Postgres database
- Proxy service

The `Datasource` interface implementation is available at internal/datasource.go.

You can use the `-direct_proxy` flag to run the frontend with its datasource as
the proxy service. This allows you to run the frontend without setting up a
postgres database.

Alternatively, you can run pkg.go.dev with a local database. See instructions
on how to [set up](postgres.md) and
[populate](worker.md#populating-data-locally-using-the-worker)
your local database with packages of your choice.

You can then run the frontend with: `go run ./cmd/frontend`

If you add, change or remove any inline scripts in templates, run
`devtools/cmd/csphash` to update the hashes. Running `all.bash`
will do that as well.

### Local mode

You can also use run the frontend locally with an in-memory datasource
populated with modules loaded from your local filesystem.

    go run ./cmd/pkgsite [-local .]

This allows you to run the frontend without setting up a database and to view
documentation of local modules without requiring a proxy. `-local` accepts a
GOPATH-like string containing paths of modules to load into memory.

### Testing

In addition to tests inside internal/frontend and internal/testing/integration,
pages on pkg.go.dev may have accessibility tree and image snapshot tests. These
tests will create diffs for inspection on failure. Timeouts and diff thresholds
are configurable for image snapshots if adjustments are needed to prevent test
flakiness. See the
[API](https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api) for
jest image snapshots for more information.

To run the tests locally, start the pkgsite server and then run
`./devtools/npm.sh run test-e2e`

## Static Assets

A migration to TypeScript for pkg.go.dev is underway. See
[#43359](https://github.com/golang/go/issues/43359) for tracking info.

JavaScript assets for pkg.go.dev are built from TypeScript files in the
content/static/js directory. All new scripts and updates to existing
scripts should be written with TypeScript.

### Building

If you're modifying any TypeScript code, you must run
`devtools/npm.sh run build` for the changes to take effect. This script will
require Docker to be installed.

### Development

To watch the source files for changes and have them rebuilt automatically
you can run `devtools/npm.sh run develop`.

### Testing

You can test html and static asset changes by running `devtools/npm.sh test`.
This will run the TypeScript type checker, unit tests, and end-to-end tests.
For end-to-end tests to run you must be running the frontend server locally.

### Linting

Lint your changes by running `devtools/npm.sh run lint`. This will run stylelint
and eslint on CSS and TS files in content/static. You can autofix some errors by
running `devtools/npm.sh run lint -- --fix`.
