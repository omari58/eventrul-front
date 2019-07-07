/*******************************
 *          Watch Task
 *******************************/

const gulp = require('gulp')

// node dependencies
const console = require('better-console')

// user config
const config = require('./config/user')

// task config
const install = require('./config/project/install')

const css = require('./build/css')
const js = require('./build/javascript')
const assets = require('./build/assets')

// export task
module.exports = function() {
  if (!install.isSetup()) {
    console.error('Cannot watch files. Run "gulp install" to set-up Semantic')
    return
  }

  console.clear()
  console.log('Watching source files for changes')

  /* --------------
      Watch CSS
  --------------- */
  css.watch('default', config)

  /* --------------
      Watch JS
  --------------- */

  js.watch('default', config)

  /* --------------
    Watch Assets
  --------------- */

  assets.watch('default', config)
}
