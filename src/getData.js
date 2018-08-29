var twitch = require('twitch-api-v5');

var ObjectsModel = require('./models/objects');

module.exports = (function (auth, id, callback) {
  var data = {
    latestFollower: {},
    latestSubscriber: {},
    totalFollowers: 0,
    totalSubscribers: 0,
    subscriberGoal: 0,
  };

  if (auth === 'NOT OK') {
    callback(data);
  } else {
    ObjectsModel.findOne({ _key: 'subscriberGoal' }, function (goalError, subscriberGoalDoc) {
      if (goalError) {
        console.error(goalError);
        callback(data);
      } else {
        data.subscriberGoal = subscriberGoalDoc.toObject().value;

        twitch.channels.followers({ channelID: id, direction: 'desc', limit: 1 }, function (followersError, followers) {
          if (followersError) {
            console.error(followersError);
            callback(data);
          } else {
            if (followers && followers._total) {
              data.totalFollowers = followers._total || 0;
              data.latestFollower = { name: followers.follows[0].user.display_name };
            }

            twitch.channels.subs({ auth: auth, channelID: id, direction: 'desc', limit: 1 }, function (subsError, subs) {
              if (subsError) {
                console.error(subsError);
              } else {
                if (subs && subs._total) {
                  data.totalSubscribers = (subs._total - 1) || 0;
                  data.latestSubscriber = { name: subs.subscriptions[0].user.display_name, plan: subs.subscriptions[0].sub_plan };
                }
              }

              callback(data);
            });
          }
        });
      }
    });
  }
});
