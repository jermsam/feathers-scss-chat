// Initializes the `onlineUsers` service on path `/online-users`
const { OnlineUsers } = require('./online-users.class');
const hooks = require('./online-users.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/online-users', new OnlineUsers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('online-users');

  service.hooks(hooks);
};
