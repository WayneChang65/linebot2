# linebot
[![npm](https://img.shields.io/npm/v/@waynechang65/linebot.svg)](https://www.npmjs.com/package/@waynechang65/linebot)
[![npm](https://img.shields.io/npm/dm/@waynechang65/linebot.svg)](https://www.npmjs.com/package/@waynechang65/linebot)
[![Build Status](https://travis-ci.org/WayneChang65/linebot.svg?branch=master)](https://travis-ci.org/WayneChang65/linebot)
[![GitHub](https://img.shields.io/github/license/waynechang65/linebot.svg)](https://github.com/WayneChang65/linebot/)

## !!! Remind：This project is a fork originally from [boybundit/linebot](https://github.com/boybundit/linebot). The team seems too busy to maintain this project, so the fork will be maintained continuously here. I will update this module as much as possible when [LINE](https://line.me/en/) releases new APIs.  

## !!! NPM Module：@waynchang65/linebot  

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

```js
const linebot = require('@waynechang65/linebot');

let bot = linebot({
  channelId: CHANNEL_ID,
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN
});

bot.on('message', function (event) {
  event.reply(event.message.text).then(function (data) {
    // success
  }).catch(function (error) {
    // error
  });
});

bot.listen('/linewebhook', 3000);
```

### Using with your own [Express.js][express-url] server
```js
const app = express();
const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);
app.listen(3000);
```

See [`examples`](examples) folder for more examples.

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
bot.on('message',      function (event) { });
bot.on('follow',       function (event) { });
bot.on('unfollow',     function (event) { });
bot.on('join',         function (event) { });
bot.on('leave',        function (event) { });
bot.on('memberJoined', function (event) { });
bot.on('memberLeft',   function (event) { });
bot.on('postback',     function (event) { });
bot.on('beacon',       function (event) { });
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

See: [Get the target limit for additional messages](https://developers.line.biz/en/reference/messaging-api/#get-quota)  

### LineBot.getTotalSentMessagesThisMonth()  

Get number of messages sent this month.  

### LineBot.getTotalReplyMessages(date)  

Get number of sent reply messages.    

Default date is yesterday (UTC+9).  

### LineBot.getTotalPushMessages(date)  

Get number of sent push messages.    

Default date is yesterday (UTC+9).  

### LineBot.getTotalBroadcastMessages(date)

Get number of sent broadcast messages.    

Default date is yesterday (UTC+9).  

### LineBot.getTotalMulticastMessages(date)

Get number of sent multicast messages.   

Default date is yesterday (UTC+9).  

## Insight  

### LineBot.getTotalMessagesInsight(date)  

Get number of message deliveries  

Default date is yesterday (UTC+9).  

### LineBot.getFriendDemographicsInsight()  

Get friend demographics  

### LineBot.getTotalFollowersInsight(date)

Get the number of users who have added this linebot on or before a specified date.

Default date is yesterday (UTC+9).  

## Users  

### LineBot.getUserProfile(userId)

Get user profile information of the user.

See: [Event.source.profile()](#eventsourceprofile)  

## Bot  

### LineBot.getBotInfo()  

Get bot info  

## Group  

### LineBot.getGroupProfile(groupId)  

Get a group profile.

### LineBot.getGroupMembersCount(groupId)  

Get number of users in a group.  

### LineBot.getGroupMember(groupId)

Get userId of all members in a group.

See: [Event.source.member()](#eventsourcemember)  

### LineBot.getGroupMemberProfile(groupId, userId)  

Get user profile of a member in a group.  

### LineBot.leaveGroup(groupId)  

Leave a group.  

## Chatroom  

### LineBot.getRoomMembersCount(roomId)  

Get number of users in a room.  

### LineBot.getRoomMember(roomId)  

Get userId of all members in a chat room.  

See: [Event.source.member()](#eventsourcemember)  

### LineBot.getRoomMemberProfile(roomId, userId)  

Get user profile of a member in a chat room.  

### LineBot.leaveRoom(roomId)  

Leave a room.  


## Account Link  


### LineBot.getIssueLinkToken(userId)  

Issue link token  

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
event.reply('Hello, world').then(function (data) {
  // success
}).catch(function (error) {
  // error
});

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
event.joined.profiles().then(function (profiles) {
  console.log(profiles);
});
```

### Event.left.profiles()

Get user profiles information of the sender, when a user leave a group or room.

This is a shorthand for:
  - `LineBot.getUserProfile(event.source.userId)` if it is 1:1 chat

```js
event.left.profiles().then(function (profiles) {
  console.log(profiles);
});
```

### Event.source.profile()

Get user profile information of the sender.

This is a shorthand for:
  - `LineBot.getUserProfile(event.source.userId)` if it is 1:1 chat
  - `LineBot.getGroupProfile(event.source.groupId)` if bot is in a group
  - `LineBot.getGroupMemberProfile(event.source.groupId, event.source.userId)` if bot is in a group
  - `LineBot.getRoomMemberProfile(event.source.roomId, event.source.userId)` if bot is in a chat room

```js
event.source.profile().then(function (profile) {
  event.reply('Hello ' + profile.displayName);
});
```

### Event.source.member()

Get userId of all members in a group or a chat room.

This is a shorthand for:
  - `LineBot.getGroupMember(event.source.groupId)` if bot is in a group
  - `LineBot.getRoomMember(event.source.roomId)` if bot is in a chat room

```js
event.source.member().then(function (member) {
  console.log(member.memberIds);
});
```

### Event.message.content()

Get image, video, and audio data sent by users as a [Buffer][buffer-url] object.

This is a shorthand for: `LineBot.getMessageContent(event.message.messageId)`

```js
event.message.content().then(function (content) {
  console.log(content.toString('base64'));
});
```

# Contribution  

Welcome to fork and send Pull Request. Thanks. :)  

# License

  [MIT](LICENSE)

[express-url]: http://expressjs.com
[webhook-event-url]: https://developers.line.biz/en/reference/messaging-api/#webhooks
[send-message-url]: https://developers.line.biz/en/reference/messaging-api/#message-objects
[promise-url]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[node-fetch-url]: https://github.com/bitinn/node-fetch
[buffer-url]: https://nodejs.org/api/buffer.html
