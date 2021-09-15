# linebot
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![npm](https://img.shields.io/npm/v/@waynechang65/linebot.svg)](https://www.npmjs.com/package/@waynechang65/linebot)
[![npm](https://img.shields.io/npm/dm/@waynechang65/linebot.svg)](https://www.npmjs.com/package/@waynechang65/linebot)
[![Npm package total downloads](https://badgen.net/npm/dt/@waynechang65/linebot)](https://npmjs.ccom/package/@waynechang65/linebot)
[![Build Status](https://travis-ci.com/WayneChang65/linebot2.svg?branch=master)](https://travis-ci.com/WayneChang65/linebot2)
[![GitHub](https://img.shields.io/github/license/waynechang65/linebot.svg)](https://github.com/WayneChang65/linebot/)

## !!! Remind：This project is a fork originally from [boybundit/linebot][boybundit-linebot-url]. The team seems too busy to maintain this project, so the fork will be maintained continuously here and will update this module as much as possible when [LINE][line-offical-url] releases new APIs.  

## :exclamation::exclamation::exclamation: NPM Module：[@waynchang65/linebot][waynechang65-linebot-npm-url]  

🤖 SDK for the LINE Messaging API for Node.js
- Come with built-in server for quick setup
- Provide convenient addon functions to [event object](#event-object)

# About LINE Messaging API

Please refer to the official API documents for details.
- Developer Documents - https://developers.line.biz/en/docs/
- API Reference - https://developers.line.biz/en/reference/messaging-api/

# Installation

```bash
$ npm install @waynechang65/linebot --save
```

# Usage  
:heavy_exclamation_mark: Notice: Check endpoint of the webhook is the same to 「Webhook URL」 of setting page to LINE Message API. (The demo is 'webhook')  
```js
const linebot = require('@waynechang65/linebot');

const endpointToWebHook = 'webhook';

let bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN
});

bot.on('message', async function (event) {
  try {
    result = await event.reply(event.message.text);
    // Do something here as success
    console.log('Success', result);
  } catch (error) {
    // Do something here to deal with error
    console.log('Error', error);
  }
});

bot.listen(`/${endpointToWebHook}`, process.env.PORT || 80, function () {
   console.log('LineBot is running. Port : ' + (process.env.PORT || 80));
});
```  

### Using with your own [Express.js][express-url] server
```js
const endpointToWebHook = 'webhook';
const app = express();
const linebotParser = bot.parser();
app.post(`/${endpointToWebHook}`, linebotParser);  
app.listen(process.env.PORT || 80, function () {
   console.log('LineBot is running. Port : ' + (process.env.PORT || 80));
});  
```  

### Using with [AWS Lambda][aws-lambda-url] service   
```js
module.exports.echo = async (event) => {
   if (bot.verify(event.body, event.headers['x-line-signature'])) {
      var body = JSON.parse(event.body).events[0];
      var replyToken = body.replyToken;
      var userText = body.message.text;

      await bot.reply(replyToken, userText)
         .then(function (data) {
            console.log('Success', data);
         }).catch(function (error) {
            console.log('Error', error);
         });
   } else {
      console.log('Signature authentication error');
   }
};
```  

See [`examples`](examples) folder for more examples.

# Docker Container DEMO
Run the docker container ([waynechang65/linebot][waynechang65-linebot-dockerhub]) of DEMO code (examples/demo.js) from [dockerhub][docker-hub-url] with `CHANNEL_ID`, `CHANNEL_SECRET` and `CHANNEL_ACCESS_TOKEN`. The endpoint is set to be 'webhook' in the docker image.  

```Shell
sudo docker container run -p 3310:80 \
-e CHANNEL_ID="163......." \
-e CHANNEL_SECRET="797...................." \
-e CHANNEL_ACCESS_TOKEN="srd5..............." \
waynechang65/linebot:latest
```  
:star_struck: It's also possible to dockerize your bot by modifying the [dockerfile][linebot2-dockerfile].  

# API

## LineBot object

### linebot(config)
Create LineBot instance with specified configuration.
```js
const bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  verify: true // Verify 'X-Line-Signature' header (default=true)
});
```

## Basic

### LineBot.listen(webHookPath, port, callback)

Start built-in http server on the specified `port`,
and accept POST request callback on the specified `webHookPath`.

This method is provided for convenience.
You can write you own server and use `verify` and `parse` methods to process webhook events.
See [`examples/echo-express-long.js`](examples/echo-express-long.js) for example.

### LineBot.parser()

Create [Express.js][express-url] middleware to parse the request.

The parser assumes that the request body has never been parsed by any body parser before,
so it must be placed BEFORE any generic body parser e.g. `app.use(bodyParser.json());`

### LineBot.verify(rawBody, signature)

Verify `X-Line-Signature` header.

### LineBot.parse(body)

Process incoming webhook request, and raise an event.

### LineBot.on(eventType, eventHandler)

Raised when a [Webhook event][webhook-event-url] is received.
```js
bot.on('message',      async function (event) { });
bot.on('follow',       async function (event) { });
bot.on('unfollow',     async function (event) { });
bot.on('join',         async function (event) { });
bot.on('leave',        async function (event) { });
bot.on('memberJoined', async function (event) { });
bot.on('memberLeft',   async function (event) { });
bot.on('postback',     async function (event) { });
bot.on('beacon',       async function (event) { });
```

## Message

### LineBot.reply(replyToken, message)

Reply a message.

See: [Event.reply(message)](#eventreplymessage)

### LineBot.push(to, message)

Send push message.

`to` is a userId, or an array of userId.
A userId can be saved from `event.source.userId`
when added as a friend (follow event), or during the chat (message event).

`message` can be a string, an array of string,
a [Send message][send-message-url] object,
or an array of [Send message][send-message-url] objects.

### LineBot.multicast(to, message)

Send push message to multiple users (Max: 150 users).
This is more efficient than `push` as it will make api call only once.

`to` is an array of userId.

`message` can be a string, an array of string,
a [Send message][send-message-url] object,
or an array of [Send message][send-message-url] objects.

### LineBot.broadcast(message)

Send push message to all users.
This is more efficient than `push` as it will make api call only once.

`message` can be a string, an array of string,
a [Send message][send-message-url] object,
or an array of [Send message][send-message-url] objects.

### LineBot.getMessageContent(messageId)

Get image, video, and audio data sent by users as a [Buffer][buffer-url] object.

See: [Event.message.content()](#eventmessagecontent)

### LineBot.getQuota()

Get the number of messages quota in the current month.  

### LineBot.getTotalSentMessagesThisMonth()  

Get number of messages sent this month.  

### LineBot.getTotalReplyMessages(date)  

Get number of sent reply messages.  
 
`date` Date the messages were sent  
* Format: `yyyyMMdd` (Example: `20210909`)  
* Timezone: UTC+9  
* Default date is yesterday (UTC+9).  

### LineBot.getTotalPushMessages(date)  

Get number of sent push messages.    

`date` Date the messages were sent  
* Format: `yyyyMMdd` (Example: `20210909`)  
* Timezone: UTC+9  
* Default date is yesterday (UTC+9).  

### LineBot.getTotalBroadcastMessages(date)

Get number of sent broadcast messages.    

`date` Date the messages were sent  
* Format: `yyyyMMdd` (Example: `20210909`)  
* Timezone: UTC+9  
* Default date is yesterday (UTC+9).  

### LineBot.getTotalMulticastMessages(date)

Get number of sent multicast messages.   

`date` Date the messages were sent  
* Format: `yyyyMMdd` (Example: `20210909`)  
* Timezone: UTC+9  
* Default date is yesterday (UTC+9).  

## Insight  

### LineBot.getTotalMessagesInsight(date)  

Get number of message deliveries  

`date` Date the messages were sent  
* Format: `yyyyMMdd` (Example: `20210909`)  
* Timezone: UTC+9  
* Default date is yesterday (UTC+9).  

### LineBot.getFriendDemographicsInsight()  

Get friend demographics  

### LineBot.getTotalFollowersInsight(date)

Get the number of users who have added this linebot on or before a specified date.

`date` Date the messages were sent  
* Format: `yyyyMMdd` (Example: `20210909`)  
* Timezone: UTC+9  
* Default date is yesterday (UTC+9).  

## Users  

### LineBot.getUserProfile(userId)

Get user profile information of the user.

`userId` User ID that is returned in a webhook event object (e.g. U4af4980629...).  

See: [Event.source.profile()](#eventsourceprofile), [Event.left.profiles()](#eventleftprofiles)  

## Bot  

### LineBot.getBotInfo()  

Get bot info  

## Group  

### LineBot.getGroupProfile(groupId)  

Get a group profile.  

`groupId` Group ID. Found in the source object of webhook event objects (e.g. Ca56f94637c...).  

See: [Event.source.profile()](#eventsourceprofile)  

### LineBot.getGroupMembersCount(groupId)  

Get number of users in a group.  

`groupId` Group ID. Found in the source object of webhook event objects (e.g. Ca56f94637c...).  

### LineBot.getGroupMember(groupId)

Get userId of all members in a group.  

`groupId` Group ID. Found in the source object of webhook event objects (e.g. Ca56f94637c...).  

See: [Event.source.member()](#eventsourcemember)  

### LineBot.getGroupMemberProfile(groupId, userId)  

Get user profile of a member in a group.  

See: [Event.joined.profiles()](#eventjoinedprofiles)  

### LineBot.leaveGroup(groupId)  

Leave a group.  

`groupId` Group ID. Found in the source object of webhook event objects (e.g. Ca56f94637c...).  

## Chatroom  

### LineBot.getRoomMembersCount(roomId)  

Get number of users in a room.  

`roomId` Room ID. Found in the source object of webhook event objects.  

### LineBot.getRoomMember(roomId)  

Get userId of all members in a chat room.  

`roomId` Room ID. Found in the source object of webhook event objects.  

See: [Event.source.member()](#eventsourcemember)  

### LineBot.getRoomMemberProfile(roomId, userId)  

Get user profile of a member in a chat room.  

`roomId` Room ID. Found in the source object of webhook event objects.  

`userId` User ID that is returned in a webhook event object (e.g. U4af4980629...).  

See: [Event.joined.profiles()](#eventjoinedprofiles)  

### LineBot.leaveRoom(roomId)  

Leave a room.  

`roomId` Room ID. Found in the source object of webhook event objects.  

## Account Link  


### LineBot.getIssueLinkToken(userId)  

Issue link token  

`userId` User ID that is returned in a webhook event object (e.g. U4af4980629...).  

## Event object

Provide convenient shorthands to call LineBot's functions
which require parameter from a source event object.

### Event.reply(message)

Respond to the event.

`message` can be a string, an array of string,
a [Send message][send-message-url] object,
or an array of [Send message][send-message-url] objects.

Return a [Promise][promise-url] object from [`node-fetch`][node-fetch-url] module.

This is a shorthand for: `LineBot.reply(event.replyToken, message)`

```js
// reply text message
try {
  result = await event.reply(event.message.text);
  // Do something here as success
  console.log('Success', result);
} catch (error) {
  // Do something here to deal with error
  console.log('Error', error);
}

// reply multiple text messages
event.reply(['Hello, world 1', 'Hello, world 2']);

// reply message object
event.reply({ type: 'text', text: 'Hello, world' });

// reply multiple message object
event.reply([
  { type: 'text', text: 'Hello, world 1' },
  { type: 'text', text: 'Hello, world 2' }
]);

event.reply({
  type: 'image',
  originalContentUrl: 'https://example.com/original.jpg',
  previewImageUrl: 'https://example.com/preview.jpg'
});

event.reply({
  type: 'video',
  originalContentUrl: 'https://example.com/original.mp4',
  previewImageUrl: 'https://example.com/preview.jpg'
});

event.reply({
  type: 'audio',
  originalContentUrl: 'https://example.com/original.m4a',
  duration: 240000
});

event.reply({
  type: 'location',
  title: 'my location',
  address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  latitude: 35.65910807942215,
  longitude: 139.70372892916203
});

event.reply({
  type: 'sticker',
  packageId: '1',
  stickerId: '1'
});

event.reply({
  type: 'imagemap',
  baseUrl: 'https://example.com/bot/images/rm001',
  altText: 'this is an imagemap',
  baseSize: { height: 1040, width: 1040 },
  actions: [{
    type: 'uri',
    linkUri: 'https://example.com/',
    area: { x: 0, y: 0, width: 520, height: 1040 }
  }, {
    type: 'message',
    text: 'hello',
    area: { x: 520, y: 0, width: 520, height: 1040 }
  }]
});

event.reply({
  type: 'template',
  altText: 'this is a buttons template',
  template: {
    type: 'buttons',
    thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
    title: 'Menu',
    text: 'Please select',
    actions: [{
      type: 'postback',
      label: 'Buy',
      data: 'action=buy&itemid=123'
    }, {
      type: 'postback',
      label: 'Add to cart',
      data: 'action=add&itemid=123'
    }, {
      type: 'uri',
      label: 'View detail',
      uri: 'http://example.com/page/123'
    }]
  }
});

event.reply({
  type: 'template',
  altText: 'this is a confirm template',
  template: {
    type: 'confirm',
    text: 'Are you sure?',
    actions: [{
      type: 'message',
      label: 'Yes',
      text: 'yes'
    }, {
      type: 'message',
      label: 'No',
      text: 'no'
    }]
  }
});

event.reply({
  type: 'template',
  altText: 'this is a carousel template',
  template: {
    type: 'carousel',
    columns: [{
      thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
      title: 'this is menu',
      text: 'description',
      actions: [{
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111'
      }, {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=111'
      }, {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/111'
      }]
    }, {
      thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
      title: 'this is menu',
      text: 'description',
      actions: [{
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=222'
      }, {
        type: 'postback',
        label: 'Add to cart',
        data: 'action=add&itemid=222'
      }, {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222'
      }]
    }]
  }
});
```

### Event.joined.profiles()

Get user profiles information of the sender, when a user joins a group or room.

This is a shorthand for:
  - `LineBot.getGroupMemberProfile(event.source.groupId, event.source.userId)` if bot is in a group
  - `LineBot.getRoomMemberProfile(event.source.roomId, event.source.userId)` if bot is in a chat room

```js
let profiles = await event.joined.profiles();
console.log(profiles);
```

### Event.left.profiles()

Get user profiles information of the sender, when a user leave a group or room.

This is a shorthand for:
  - `LineBot.getUserProfile(event.source.userId)` if it is 1:1 chat

```js
let profiles = await event.left.profiles();
console.log(profiles);
```

### Event.source.profile()

Get user profile information of the sender.

This is a shorthand for:
  - `LineBot.getUserProfile(event.source.userId)` if it is 1:1 chat
  - `LineBot.getGroupProfile(event.source.groupId)` if bot is in a group
  - `LineBot.getGroupMemberProfile(event.source.groupId, event.source.userId)` if bot is in a group
  - `LineBot.getRoomMemberProfile(event.source.roomId, event.source.userId)` if bot is in a chat room

```js
let profile = await event.source.profile();
await event.reply('Hello ' + profile.displayName);
```

### Event.source.member()

Get userId of all members in a group or a chat room.

This is a shorthand for:
  - `LineBot.getGroupMember(event.source.groupId)` if bot is in a group
  - `LineBot.getRoomMember(event.source.roomId)` if bot is in a chat room

```js
let member = await event.source.member();
console.log(member.memberIds);
```

### Event.message.content()

Get image, video, and audio data sent by users as a [Buffer][buffer-url] object.

This is a shorthand for: `LineBot.getMessageContent(event.message.messageId)`

```js
let content = await event.message.content();
console.log(content.toString('base64'));
```

# Contribution  

Welcome to fork and send Pull Request. Thanks. :)  

# Contributors  
<a href="https://github.com/waynechang65/linebot2/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=waynechang65/linebot2" />
</a>  

Special thanks to original designer of the linebot project. [boybundit/linebot][boybundit-linebot-url]  

# License

  [MIT](LICENSE)

[line-offical-url]: https://line.me/en/
[express-url]: http://expressjs.com
[aws-lambda-url]: https://aws.amazon.com/lambda/
[waynechang65-linebot-npm-url]: https://www.npmjs.com/package/@waynechang65/linebot
[webhook-event-url]: https://developers.line.biz/en/reference/messaging-api/#webhooks
[send-message-url]: https://developers.line.biz/en/reference/messaging-api/#message-objects
[promise-url]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[node-fetch-url]: https://github.com/bitinn/node-fetch
[buffer-url]: https://nodejs.org/api/buffer.html
[boybundit-linebot-url]: https://github.com/boybundit/linebot
[docker-hub-url]: https://hub.docker.com/
[waynechang65-linebot-dockerhub]: https://hub.docker.com/r/waynechang65/linebot/tags?page=1&ordering=last_updated
[linebot2-dockerfile]: https://github.com/WayneChang65/linebot2/blob/master/Dockerfile
