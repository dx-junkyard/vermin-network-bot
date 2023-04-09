import { WebhookEvent } from '@line/bot-sdk';
import { Request, Response } from 'express';

import { botEventHandler } from '../lib/line/botEventHandler';
import { logger } from '../lib/log4js/logger';

export const webhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const events: WebhookEvent[] = req.body.events;

  // Process all of the received events asynchronously.
  const results = await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await botEventHandler(event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          logger.error(err);
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
};
