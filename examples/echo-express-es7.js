'use strict';
const linebot = require('../index.js');
const express = require('express');

const endpointToWebHook = 'webhook';

const bot = linebot({
   channelId: process.env.CHANNEL_ID,
   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
   channelSecret: process.env.CHANNEL_SECRET,
});

const linebotParser = bot.parser();

const app = express();

app.post(`/${endpointToWebHook}`, linebotParser);

bot.on('message', async event => {
   try {
      await event.reply(event.message.text);
      console.log('Success');
   } catch (error) {
      console.error(error);
   }
});

const port = process.env.PORT || 80;
app.listen(port, () => {
   console.log('LineBot is running. Port : ' + port);
});