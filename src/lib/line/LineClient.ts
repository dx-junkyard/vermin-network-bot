import { Client, ClientConfig, MiddlewareConfig } from '@line/bot-sdk';
import { middleware } from '@line/bot-sdk';
import dotenv from 'dotenv';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

// middleware
export const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

// Create a new LINE SDK client.
export const lineClient = new Client(clientConfig);

export const middlewareClient = middleware(middlewareConfig);
