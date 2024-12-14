# Background Run & Test GitHub Action

[![GitHub stars](https://img.shields.io/github/stars/MohamedRaslan/background_run_and_test)](https://github.com/MohamedRaslan/background_run_and_test/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/MohamedRaslan/background_run_and_test)](https://github.com/MohamedRaslan/background_run_and_test/network)
[![GitHub issues](https://img.shields.io/github/issues/MohamedRaslan/background_run_and_test)](https://github.com/MohamedRaslan/background_run_and_test/issues)
[![GitHub Release Date](https://img.shields.io/github/release-date/mohamedraslan/background_run_and_test)](https://github.com/MohamedRaslan/background_run_and_test/releases)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mohamedraslan/background_run_and_test)](https://github.com/MohamedRaslan/background_run_and_test)
[![Lint Codebase](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/linter.yml/badge.svg)](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/linter.yml)
[![Dependabot Updates](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/dependabot/dependabot-updates)
[![Continuous Integration](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/ci.yml/badge.svg)](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/ci.yml)
[![Check Transpiled JavaScript](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/check-dist.yml/badge.svg)](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/MohamedRaslan/background_run_and_test/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A GitHub Action that allows you to execute testing commands (e.g., `npm test`)
while concurrently running background tasks (like starting a server). With
support for conditional waiting on resources, it simplifies workflows with
background jobs/works and integrate with the
**[wait-on](https://www.npmjs.com/package/wait-on)** library for waiting on
resources.

> :information_source: **Notice**
>
> The code was derived from the
> [cypress-io/github-action](https://github.com/cypress-io/github-action), but
> with a few additions and enhancements for more general usage.

---

## :star: Features

- **Background Tasks:** Run a server or other background processes with `start`
  commands.
- **Cross-Platform Support:** Tailored commands for Windows (`start-windows`,
  `command-windows`).
- **Resource Wait:** Wait for URLs, ports, files, or sockets to become available
  before testing.
- **Conditional Logic:** Use `wait-if`, `start-if`, and `command-if` for
  advanced flow control.
- **Custom Working Directory:** Set a specific `working-directory` for running
  commands in a defined path.
- **Multi-Command Support:** Run multiple `start` or `command` entries at once.

## :clipboard: Table of Options

| **Option**          | **Description**                                   |
| ------------------- | ------------------------------------------------- |
| `start`             | Background command (Linux/Mac).                   |
| `start-windows`     | Background command (Windows).                     |
| `command`           | Main testing command (Linux/Mac).                 |
| `command-windows`   | Main testing command (Windows).                   |
| `wait-on`           | Resources to wait for (URLs, files, ports, etc.). |
| `wait-on-timeout`   | Timeout in seconds for `wait-on` (default: 60).   |
| `working-directory` | Directory to execute commands in.                 |
| `wait-if`           | Conditional logic for resource waiting.           |
| `start-if`          | Conditional logic for starting background tasks.  |
| `command-if`        | Conditional logic for executing main commands.    |

---

### Usage

Run a Node.js server in the background while executing tests

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          start: yarn run start:apps:server
          command: yarn run test:apps
```

## :rocket: Usage Examples

### Multiple commands command

You can also specify a build command before

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          start:
            | #Or you can do it in a comma separated style like so "yarn run app:api, yarn run "app:web
            yarn run app:api
            yarn run app:web
          command: yarn run generate:docs, yarn run test:apps
```

### Windows

Sometimes on Windows you need to run a different start command. You can use
`start-windows` and `command-windows` parameter for this, which takes precedence
over the normal commands when on Windows.

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          start: yarn run start:apps:server
          start-windows: yarn run start:apps:server:windows
          command: yarn run test:apps
          command-windows: yarn run tests:apps:windows
```

### Current working directory

If you want to set a specific directory where your commands are run, you can
specify the path via the `working-directory` option

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          working-directory: ./packages/example
          start: yarn run start:apps:server
```

### Wait for server

If you are starting a local server and it takes a while to start, you can add a
parameter `wait-on` and pass URL to wait for the server to respond.

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          start: yarn run start:apps:server
          wait-on: 'http://localhost:8080'
          command: yarn run test:apps
```

By default, wait-on will retry for 60 seconds. You can pass a custom timeout in
seconds using `wait-on-timeout`.

```yaml
- uses: MohamedRaslan/background_run_and_test@v1
    with:
      start: yarn run start:apps:server
      wait-on: 'http://localhost:8080'
      # wait for 2 minutes for the server to respond
      wait-on-timeout: 120
      command: yarn run test:apps
```

You can wait for multiple URLs to respond by separating URLs with a comma

```yaml
- uses: MohamedRaslan/background_run_and_test@v1
    with:
      start: yarn run start:apps:server
      wait-on: | #Or you can do it in a comma separated style like so 'http://localhost:8080, http://localhost:4000'
        http://localhost:8080
        http://localhost:4000
      command: yarn run test:apps
```

Wait use **[wait-on](https://www.yarnjs.com/package/wait-on)** and by defualt it
wait for a HEAD response st, you can make it wait for GET response instead as
follow

```yaml
- uses: MohamedRaslan/background_run_and_test@v1
    with:
      start: yarn run start:apps:server
      wait-on: 'http-get://localhost:8080, http://localhost:4000'
      # This will wait for the GET response of the 1st one and HEAD response to the 2nd one
      command: yarn run test:apps
```

### Conditional wait

You can also wait or not based on condtion using the `wait-if`

:information_source: Note: By default it will wait

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Lint the app
        id: lint
        run: yarn run lint
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          start: yarn run start:apps:server
          wait-if:
            contains( github.base_ref , 'local' ) || ${{ failure() &&
            steps.lint.outcome == 'failure' }}
          command: yarn run test:apps
```

### Conditional run comands

Similarly, You can also wait or not based on condition using the `start-if` ,
and `command-if`

:information_source: Note: By default it will run the commands

```yaml
name: Run Tests
on: [push]
jobs:
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Lint the app
        id: lint
        run: yarn run lint
      - name: Run E2E Tests
        uses: MohamedRaslan/background_run_and_test@v1
        with:
          start: yarn run start:apps:server
          start-if:
            contains( github.base_ref , 'local' ) || ${{ failure() &&
            steps.lint.outcome == 'failure' }}
          wait-if:
            contains( github.base_ref , 'local' ) || ${{ failure() &&
            steps.lint.outcome == 'failure' }}
          command: yarn run test:apps
          command-if:
            contains( github.base_ref , 'local' ) || ${{ failure() &&
            steps.lint.outcome == 'failure' }}
```

## Additnoal resources you can wait-on them

The action integrate with the [wait-on](https://www.npmjs.com/package/wait-on)
package to control the flow. You can pass any number of resources in the
`wait-on` configuration parameter separated by commas or newlines.

Exaples can be found here
[wait-on cli usage](https://github.com/jeffbski/wait-on?tab=readme-ov-file#cli-usage)

## :see_no_evil: Issues

If you encounter any problems, please
**[file an issue](https://github.com/MohamedRaslan/background_run_and_test/issues)**
along with a detailed description.

## :handshake: Contributing

Contributions are very welcome :heart:.

## :nerd_face: Credits & Resources

- **[wait-on :heart_eyes:](https://github.com/jeffbski/wait-on)** by
  **[Jeff Barczewski](https://github.com/jeffbski)**
- **[Cypress-io/GitHub Action :heart_eyes:](https://github.com/cypress-io/github-action)**
- **[Background-Server-Action :heart_eyes:](https://github.com/BerniWittmann/background-server-action)**
  by **[Bernhard Wittmann](https://github.com/BerniWittmann)**
- **[GitHub Docs - Createing Actions](https://docs.github.com/en/actions/creating-actions)**
- **[Actions/Typescript-Action](actions/typescript-action)**
