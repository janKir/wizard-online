# Wizard Online

The famous trick-taking card game for quarantine time and more!

## Requirements

- [NodeJs](https://nodejs.org/en/) >= v12
- [yarn](https://yarnpkg.com/)
- [Postgres](https://www.postgresql.org/) > 9

## Installation

```sh
> git clone git@github.com:wizard-online/wizard-online.git
> cd react-ts-parcel
> yarn
```

Create a `.env` file and set the environment variables.
You can copy the template from `.env.template.txt`.

## Run in Development Mode

Open two terminals and run the following commands.

Run server in dev mode:

```sh
> yarn run dev-server
```

Run Application with:
```sh
> yarn start
```

## Run Tests
```sh 
> yarn test
```

## Run Typescript type checks
This project uses Babel to to transpile Typescript code to browser-readable javascript instead of the Typescript compiler.
Babel does not check for correct typings but basically strips all type information away.
To run type checks manually you can run:
```sh
> yarn run type-check
```

## Run Linter
Use this command to run ESLint and Stylelint:
```sh
> yarn run lint
```

Or run them separately:

ESLint:
```sh
> yarn run lint:es
```

Stylelint:
```sh
> yarn run lint:style
```

## Recommended IDE

[VS Code](https://code.visualstudio.com/) with EsLint  extension


## Contributing

When contributing to this project, make sure that type checks, linters, and tests run without errors before pushing. This project uses Github Actions for automatic checks. Hence, you won't be able to merge a branch if those checks fail.
