/*!
 * # Fomantic-UI - Site
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function($, window, document, undefined) {
  $.isFunction =
    $.isFunction ||
    function(obj) {
      return typeof obj === 'function' && typeof obj.nodeType !== 'number'
    }

  $.site = $.fn.site = function(parameters) {
    let time = new Date().getTime()
    let performance = []

    const query = arguments[0]
    const methodInvoked = typeof query === 'string'
    const queryArguments = [].slice.call(arguments, 1)

    const settings = $.isPlainObject(parameters)
      ? $.extend(true, {}, $.site.settings, parameters)
      : $.extend({}, $.site.settings)

    const namespace = settings.namespace
    const error = settings.error

    const moduleNamespace = 'module-' + namespace

    const $document = $(document)
    const $module = $document
    const element = this
    let instance = $module.data(moduleNamespace)

    let module
    let returnedValue
    module = {
      initialize: function() {
        module.instantiate()
      },

      instantiate: function() {
        module.verbose('Storing instance of site', module)
        instance = module
        $module.data(moduleNamespace, module)
      },

      normalize: function() {
        module.fix.console()
        module.fix.requestAnimationFrame()
      },

      fix: {
        console: function() {
          module.debug('Normalizing window.console')
          if (console === undefined || console.log === undefined) {
            module.verbose('Console not available, normalizing events')
            module.disable.console()
          }
          if (
            typeof console.group === 'undefined' ||
            typeof console.groupEnd === 'undefined' ||
            typeof console.groupCollapsed === 'undefined'
          ) {
            module.verbose('Console group not available, normalizing events')
            window.console.group = function() {}
            window.console.groupEnd = function() {}
            window.console.groupCollapsed = function() {}
          }
          if (typeof console.markTimeline === 'undefined') {
            module.verbose('Mark timeline not available, normalizing events')
            window.console.markTimeline = function() {}
          }
        },
        consoleClear: function() {
          module.debug('Disabling programmatic console clearing')
          window.console.clear = function() {}
        },
        requestAnimationFrame: function() {
          module.debug('Normalizing requestAnimationFrame')
          if (window.requestAnimationFrame === undefined) {
            module.debug(
              'RequestAnimationFrame not available, normalizing event'
            )
            window.requestAnimationFrame =
              window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function(callback) {
                setTimeout(callback, 0)
              }
          }
        }
      },

      moduleExists: function(name) {
        return $.fn[name] !== undefined && $.fn[name].settings !== undefined
      },

      enabled: {
        modules: function(modules) {
          const enabledModules = []
          modules = modules || settings.modules
          $.each(modules, function(index, name) {
            if (module.moduleExists(name)) {
              enabledModules.push(name)
            }
          })
          return enabledModules
        }
      },

      disabled: {
        modules: function(modules) {
          const disabledModules = []
          modules = modules || settings.modules
          $.each(modules, function(index, name) {
            if (!module.moduleExists(name)) {
              disabledModules.push(name)
            }
          })
          return disabledModules
        }
      },

      change: {
        setting: function(setting, value, modules, modifyExisting) {
          modules =
            typeof modules === 'string'
              ? modules === 'all'
                ? settings.modules
                : [modules]
              : modules || settings.modules
          modifyExisting = modifyExisting !== undefined ? modifyExisting : true
          $.each(modules, function(index, name) {
            const namespace = module.moduleExists(name)
              ? $.fn[name].settings.namespace || false
              : true
            let $existingModules
            if (module.moduleExists(name)) {
              module.verbose('Changing default setting', setting, value, name)
              $.fn[name].settings[setting] = value
              if (modifyExisting && namespace) {
                $existingModules = $(':data(module-' + namespace + ')')
                if ($existingModules.length > 0) {
                  module.verbose(
                    'Modifying existing settings',
                    $existingModules
                  )
                  $existingModules[name]('setting', setting, value)
                }
              }
            }
          })
        },
        settings: function(newSettings, modules, modifyExisting) {
          modules =
            typeof modules === 'string'
              ? [modules]
              : modules || settings.modules
          modifyExisting = modifyExisting !== undefined ? modifyExisting : true
          $.each(modules, function(index, name) {
            let $existingModules
            if (module.moduleExists(name)) {
              module.verbose('Changing default setting', newSettings, name)
              $.extend(true, $.fn[name].settings, newSettings)
              if (modifyExisting && namespace) {
                $existingModules = $(':data(module-' + namespace + ')')
                if ($existingModules.length > 0) {
                  module.verbose(
                    'Modifying existing settings',
                    $existingModules
                  )
                  $existingModules[name]('setting', newSettings)
                }
              }
            }
          })
        }
      },

      enable: {
        console: function() {
          module.console(true)
        },
        debug: function(modules, modifyExisting) {
          modules = modules || settings.modules
          module.debug('Enabling debug for modules', modules)
          module.change.setting('debug', true, modules, modifyExisting)
        },
        verbose: function(modules, modifyExisting) {
          modules = modules || settings.modules
          module.debug('Enabling verbose debug for modules', modules)
          module.change.setting('verbose', true, modules, modifyExisting)
        }
      },
      disable: {
        console: function() {
          module.console(false)
        },
        debug: function(modules, modifyExisting) {
          modules = modules || settings.modules
          module.debug('Disabling debug for modules', modules)
          module.change.setting('debug', false, modules, modifyExisting)
        },
        verbose: function(modules, modifyExisting) {
          modules = modules || settings.modules
          module.debug('Disabling verbose debug for modules', modules)
          module.change.setting('verbose', false, modules, modifyExisting)
        }
      },

      console: function(enable) {
        if (enable) {
          if (instance.cache.console === undefined) {
            module.error(error.console)
            return
          }
          module.debug('Restoring console function')
          window.console = instance.cache.console
        } else {
          module.debug('Disabling console function')
          instance.cache.console = window.console
          window.console = {
            clear: function() {},
            error: function() {},
            group: function() {},
            groupCollapsed: function() {},
            groupEnd: function() {},
            info: function() {},
            log: function() {},
            markTimeline: function() {},
            warn: function() {}
          }
        }
      },

      destroy: function() {
        module.verbose('Destroying previous site for', $module)
        $module.removeData(moduleNamespace)
      },

      cache: {},

      setting: function(name, value) {
        if ($.isPlainObject(name)) {
          $.extend(true, settings, name)
        } else if (value !== undefined) {
          settings[name] = value
        } else {
          return settings[name]
        }
      },
      internal: function(name, value) {
        if ($.isPlainObject(name)) {
          $.extend(true, module, name)
        } else if (value !== undefined) {
          module[name] = value
        } else {
          return module[name]
        }
      },
      debug: function() {
        if (settings.debug) {
          if (settings.performance) {
            module.performance.log(arguments)
          } else {
            module.debug = Function.prototype.bind.call(
              console.info,
              console,
              settings.name + ':'
            )
            module.debug.apply(console, arguments)
          }
        }
      },
      verbose: function() {
        if (settings.verbose && settings.debug) {
          if (settings.performance) {
            module.performance.log(arguments)
          } else {
            module.verbose = Function.prototype.bind.call(
              console.info,
              console,
              settings.name + ':'
            )
            module.verbose.apply(console, arguments)
          }
        }
      },
      error: function() {
        module.error = Function.prototype.bind.call(
          console.error,
          console,
          settings.name + ':'
        )
        module.error.apply(console, arguments)
      },
      performance: {
        log: function(message) {
          let currentTime, executionTime, previousTime
          if (settings.performance) {
            currentTime = new Date().getTime()
            previousTime = time || currentTime
            executionTime = currentTime - previousTime
            time = currentTime
            performance.push({
              Element: element,
              Name: message[0],
              Arguments: [].slice.call(message, 1) || '',
              'Execution Time': executionTime
            })
          }
          clearTimeout(module.performance.timer)
          module.performance.timer = setTimeout(module.performance.display, 500)
        },
        display: function() {
          let title = settings.name + ':'
          let totalTime = 0
          time = false
          clearTimeout(module.performance.timer)
          $.each(performance, function(index, data) {
            totalTime += data['Execution Time']
          })
          title += ' ' + totalTime + 'ms'
          if (
            (console.group !== undefined || console.table !== undefined) &&
            performance.length > 0
          ) {
            console.groupCollapsed(title)
            if (console.table) {
              console.table(performance)
            } else {
              $.each(performance, function(index, data) {
                console.log(data.Name + ': ' + data['Execution Time'] + 'ms')
              })
            }
            console.groupEnd()
          }
          performance = []
        }
      },
      invoke: function(query, passedArguments, context) {
        let object = instance
        let maxDepth
        let found
        let response
        passedArguments = passedArguments || queryArguments
        context = element || context
        if (typeof query === 'string' && object !== undefined) {
          query = query.split(/[\. ]/)
          maxDepth = query.length - 1
          $.each(query, function(depth, value) {
            const camelCaseValue =
              depth != maxDepth
                ? value +
                  query[depth + 1].charAt(0).toUpperCase() +
                  query[depth + 1].slice(1)
                : query
            if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth) {
              object = object[camelCaseValue]
            } else if (object[camelCaseValue] !== undefined) {
              found = object[camelCaseValue]
              return false
            } else if ($.isPlainObject(object[value]) && depth != maxDepth) {
              object = object[value]
            } else if (object[value] !== undefined) {
              found = object[value]
              return false
            } else {
              module.error(error.method, query)
              return false
            }
          })
        }
        if ($.isFunction(found)) {
          response = found.apply(context, passedArguments)
        } else if (found !== undefined) {
          response = found
        }
        if (Array.isArray(returnedValue)) {
          returnedValue.push(response)
        } else if (returnedValue !== undefined) {
          returnedValue = [returnedValue, response]
        } else if (response !== undefined) {
          returnedValue = response
        }
        return found
      }
    }

    if (methodInvoked) {
      if (instance === undefined) {
        module.initialize()
      }
      module.invoke(query)
    } else {
      if (instance !== undefined) {
        module.destroy()
      }
      module.initialize()
    }
    return returnedValue !== undefined ? returnedValue : this
  }

  $.site.settings = {
    name: 'Site',
    namespace: 'site',

    error: {
      console:
        'Console cannot be restored, most likely it was overwritten outside of module',
      method: 'The method you called is not defined.'
    },

    debug: false,
    verbose: false,
    performance: true,

    modules: [
      'accordion',
      'api',
      'calendar',
      'checkbox',
      'dimmer',
      'dropdown',
      'embed',
      'form',
      'modal',
      'nag',
      'popup',
      'slider',
      'rating',
      'shape',
      'sidebar',
      'state',
      'sticky',
      'tab',
      'toast',
      'transition',
      'visibility',
      'visit'
    ],

    siteNamespace: 'site',
    namespaceStub: {
      cache: {},
      config: {},
      sections: {},
      section: {},
      utilities: {}
    }
  }

  // allows for selection of elements with data attributes
  $.extend($.expr[':'], {
    data: $.expr.createPseudo
      ? $.expr.createPseudo(function(dataName) {
          return function(elem) {
            return !!$.data(elem, dataName)
          }
        })
      : function(elem, i, match) {
          // support: jQuery < 1.8
          return !!$.data(elem, match[3])
        }
  })
})(jQuery, window, document)
