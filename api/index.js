import { createApp } from '../server/dist/server/src/app.js';

let appInstance = null;

export default function handler(req, res) {
  if (!appInstance) {
    appInstance = createApp();
  }
  return appInstance(req, res);
}

