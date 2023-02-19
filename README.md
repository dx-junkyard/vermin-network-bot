# LINE Echo Bot with TypeScript

An example LINE bot to echo message with TypeScript. The bot is coded according to TypeScript's best practices.

## Prerequisite

- Git
- Node.js version 10 and up
- Vercel Account
- LINE Developers Account for the bot

## Installation

- Install all dependencies.

```bash
yarn install
```

- Configure all of the environment variables.

```bash
export CHANNEL_ACCESS_TOKEN=<YOUR_CHANNEL_ACCESS_TOKEN>
export CHANNEL_SECRET=<YOUR_CHANNEL_SECRET>
export PORT=<YOUR_PORT>
```

- Setup your webhook URL in your LINE Official Account to be in the following format. Don't forget to disable the greeting messages and auto-response messages for convenience.

```bash
https://example-url.com/webhook
```

- Run the application.

```bash
yarn start
```

## Reference

- https://github.com/line/line-bot-sdk-nodejs/tree/next/examples/echo-bot-ts
