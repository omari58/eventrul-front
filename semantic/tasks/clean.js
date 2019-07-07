/*******************************
          Clean Task
*******************************/

const del = require('del')
const config = require('./config/user')
const tasks = require('./config/tasks')
// cleans distribution files
module.exports = function() {
  return del([config.paths.clean], tasks.settings.del)
}
