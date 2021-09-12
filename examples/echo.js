const linebot = require('../index.js');

const endpointToWebHook = 'webhook';

const bot = linebot({
   channelId: process.env.CHANNEL_ID,
   channelSecret: process.env.CHANNEL_SECRET,
   channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

bot.on('message', function (event) {
   event.reply(event.message.text).then(function (data) {
      console.log('Success', data);
   }).catch(function (error) {
      console.log('Error', error);
   });
});

bot.listen(`/${endpointToWebHook}`, process.env.PORT || 80, function () {
   console.log('LineBot is running. Port : ' + (process.env.PORT || 80));
});
