'use strict';
const linebot = require('../index');
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

module.exports.echo = async (event, context) => {
  if (bot.verify(event.body, event.headers["x-line-signature"])) {
    var body = JSON.parse(event.body).events[0];
    var replyToken = body.replyToken;
    if (replyToken === '00000000000000000000000000000000') {
      let lambdaResponse = {
        statusCode: 200,
        headers: {
          "X-Line-Status": "OK"
        },
        body: '{ "result" : "Connection succeeded" }'
      };
      context.succeed(lambdaResponse);
    } else {
      var userText = body.message.text;
      await bot.reply(replyToken, userText)
        .then(function (data) {
          console.log('Success', data);
        }).catch(function (error) {
          console.log('Error', error);
        });
    }
  } else {
    console.log('Signature authentication error');
  }
};