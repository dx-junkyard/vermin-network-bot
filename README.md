# vermin-network-bot

A template LINE bot to report incidents of animal damage.

## Prerequisite

- Git
- Node.js version 10 and up
- Vercel Account
- LINE Developers Account for the bot
- AWS S3

## Installation

- Install all dependencies.

```bash
yarn install
```

- Configure all of the environment variables.

```
# .env
CHANNEL_ACCESS_TOKEN=
CHANNEL_SECRET=
PORT=3000
DATABASE_URL=
S3_ACCESS_KEY=
S3_SECRET_ACCESS_KEY=
S3_REGION=
S3_BUCKET=
```

- Setup your webhook URL in your LINE Official Account to be in the following format. Don't forget to disable the greeting messages and auto-response messages for convenience.

```bash
https://example-url.com/webhook
```

- Run the application.

```bash
yarn dev
```

## Reference

- https://github.com/line/line-bot-sdk-nodejs/tree/next/examples/echo-bot-ts
