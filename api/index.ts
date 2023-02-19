// Import all dependencies, mostly using destructuring for better view.
import { middleware, MiddlewareConfig, WebhookEvent } from '@line/bot-sdk';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';

import { textEventHandler } from './lib/line/textEventHandler';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

// middleware
const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

// Create a new Express application.
const app: Application = express();

const basePath = '/api';

// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.get(basePath, async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: 'success',
    message: 'Connected successfully!',
  });
});

// This route is used for the Webhook.
app.post(
  `${basePath}/webhook`,
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;

    // Process all of the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          // Return an error message.
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    // Return a successfull message.
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

if (process.env.NODE_ENV == 'development') {
  // Create a server and listen to it.
  app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
  });
}

module.exports = app;
