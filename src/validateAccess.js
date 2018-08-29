var twitch = require('twitch-api-v5');

var ObjectsModel = require('./models/objects');

module.exports = (function (callback) {
  ObjectsModel.find({ _key: { $in: [ 'accessToken', 'channelId', 'channelName' ] } }, function (objectsError, objects) {
    if (objectsError) {
      console.error(objectsError);
      callback('NOT OK', objectsError);
    } else {
      var accessToken = objects.filter(function (doc) { return doc._key === 'accessToken' })[0].toObject().value;

      twitch.auth.checkToken({ auth: accessToken }, function (authError, auth) {
        if (authError) {
          // TODO: refresh the stuff
          // POST https://id.twitch.tv/oauth2/token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials&scope=channel_read channel_subscriptions
          console.error(authError);
          callback('NOT OK', authError);
        } else {
          var channelId = objects.filter(function (doc) { return doc._key === 'channelId' })[0].toObject().value;
          var channelName = objects.filter(function (doc) { return doc._key === 'channelName' })[0].toObject().value;
          callback(accessToken, channelId, channelName);
        }
      });
    }
  });
});
