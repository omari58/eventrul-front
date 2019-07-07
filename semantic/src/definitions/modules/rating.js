/*!
 * # Fomantic-UI - Rating
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function($, window, document, undefined) {
  'use strict'

  $.isFunction =
    $.isFunction ||
    function(obj) {
      return typeof obj === 'function' && typeof obj.nodeType !== 'number'
    }

  window =
    typeof window !== 'undefined' && window.Math == Math
      ? window
      : typeof self !== 'undefined' && self.Math == Math
      ? self
      : Function('return this')()

  $.fn.rating = function(parameters) {
    const $allModules = $(this)
    const moduleSelector = $allModules.selector || ''

    let time = new Date().getTime()
    let performance = []

    const query = arguments[0]
    const methodInvoked = typeof query === 'string'
    const queryArguments = [].slice.call(arguments, 1)
    let returnedValue
    $allModules.each(function() {
      const settings = $.isPlainObject(parameters)
        ? $.extend(true, {}, $.fn.rating.settings, parameters)
        : $.extend({}, $.fn.rating.settings)

      const namespace = settings.namespace
      const className = settings.className
      const metadata = settings.metadata
      const selector = settings.selector

      const eventNamespace = '.' + namespace
      const moduleNamespace = 'module-' + namespace

      const element = this
      let instance = $(this).data(moduleNamespace)

      const $module = $(this)
      let $icon = $module.find(selector.icon)

      let initialLoad
      let module

      module = {
        initialize: function() {
          module.verbose('Initializing rating module', settings)

          if ($icon.length === 0) {
            module.setup.layout()
          }

          if (settings.interactive && !module.is.disabled()) {
            module.enable()
          } else {
            module.disable()
          }
          module.set.initialLoad()
          module.set.rating(module.get.initialRating())
          module.remove.initialLoad()
          module.instantiate()
        },

        instantiate: function() {
          module.verbose('Instantiating module', settings)
          instance = module
          $module.data(moduleNamespace, module)
        },

        destroy: function() {
          module.verbose('Destroying previous instance', instance)
          module.remove.events()
          $module.removeData(moduleNamespace)
        },

        refresh: function() {
          $icon = $module.find(selector.icon)
        },

        setup: {
          layout: function() {
            const maxRating = module.get.maxRating()
            const icon = module.get.icon()
            const html = $.fn.rating.settings.templates.icon(maxRating, icon)
            module.debug('Generating icon html dynamically')
            $module.html(html)
            module.refresh()
          }
        },

        event: {
          mouseenter: function() {
            const $activeIcon = $(this)
            $activeIcon.nextAll().removeClass(className.selected)
            $module.addClass(className.selected)
            $activeIcon
              .addClass(className.selected)
              .prevAll()
              .addClass(className.selected)
          },
          mouseleave: function() {
            $module.removeClass(className.selected)
            $icon.removeClass(className.selected)
          },
          click: function() {
            const $activeIcon = $(this)
            const currentRating = module.get.rating()
            const rating = $icon.index($activeIcon) + 1
            const canClear =
              settings.clearable == 'auto'
                ? $icon.length === 1
                : settings.clearable
            if (canClear && currentRating == rating) {
              module.clearRating()
            } else {
              module.set.rating(rating)
            }
          }
        },

        clearRating: function() {
          module.debug('Clearing current rating')
          module.set.rating(0)
        },

        bind: {
          events: function() {
            module.verbose('Binding events')
            $module
              .on(
                'mouseenter' + eventNamespace,
                selector.icon,
                module.event.mouseenter
              )
              .on(
                'mouseleave' + eventNamespace,
                selector.icon,
                module.event.mouseleave
              )
              .on('click' + eventNamespace, selector.icon, module.event.click)
          }
        },

        remove: {
          events: function() {
            module.verbose('Removing events')
            $module.off(eventNamespace)
          },
          initialLoad: function() {
            initialLoad = false
          }
        },

        enable: function() {
          module.debug('Setting rating to interactive mode')
          module.bind.events()
          $module.removeClass(className.disabled)
        },

        disable: function() {
          module.debug('Setting rating to read-only mode')
          module.remove.events()
          $module.addClass(className.disabled)
        },

        is: {
          initialLoad: function() {
            return initialLoad
          },
          disabled: function() {
            return $module.hasClass(className.disabled)
          }
        },

        get: {
          icon: function() {
            const icon = $module.data(metadata.icon)
            if (icon) {
              $module.removeData(metadata.icon)
            }
            return icon || settings.icon
          },
          initialRating: function() {
            if ($module.data(metadata.rating) !== undefined) {
              $module.removeData(metadata.rating)
              return $module.data(metadata.rating)
            }
            return settings.initialRating
          },
          maxRating: function() {
            if ($module.data(metadata.maxRating) !== undefined) {
              $module.removeData(metadata.maxRating)
              return $module.data(metadata.maxRating)
            }
            return settings.maxRating
          },
          rating: function() {
            const currentRating = $icon.filter('.' + className.active).length
            module.verbose('Current rating retrieved', currentRating)
            return currentRating
          }
        },

        set: {
          rating: function(rating) {
            const ratingIndex = rating - 1 >= 0 ? rating - 1 : 0
            const $activeIcon = $icon.eq(ratingIndex)
            $module.removeClass(className.selected)
            $icon.removeClass(className.selected).removeClass(className.active)
            if (rating > 0) {
              module.verbose('Setting current rating to', rating)
              $activeIcon
                .prevAll()
                .addBack()
                .addClass(className.active)
            }
            if (!module.is.initialLoad()) {
              settings.onRate.call(element, rating)
            }
          },
          initialLoad: function() {
            initialLoad = true
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value)
          if ($.isPlainObject(name)) {
            $.extend(true, settings, name)
          } else if (value !== undefined) {
            if ($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value)
            } else {
              settings[name] = value
            }
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
          if (!settings.silent && settings.debug) {
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
          if (!settings.silent && settings.verbose && settings.debug) {
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
          if (!settings.silent) {
            module.error = Function.prototype.bind.call(
              console.error,
              console,
              settings.name + ':'
            )
            module.error.apply(console, arguments)
          }
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
                Name: message[0],
                Arguments: [].slice.call(message, 1) || '',
                Element: element,
                'Execution Time': executionTime
              })
            }
            clearTimeout(module.performance.timer)
            module.performance.timer = setTimeout(
              module.performance.display,
              500
            )
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
            if (moduleSelector) {
              title += " '" + moduleSelector + "'"
            }
            if ($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')'
            }
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
              if (
                $.isPlainObject(object[camelCaseValue]) &&
                depth != maxDepth
              ) {
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
          instance.invoke('destroy')
        }
        module.initialize()
      }
    })

    return returnedValue !== undefined ? returnedValue : this
  }

  $.fn.rating.settings = {
    name: 'Rating',
    namespace: 'rating',

    icon: 'star',

    silent: false,
    debug: false,
    verbose: false,
    performance: true,

    initialRating: 0,
    interactive: true,
    maxRating: 4,
    clearable: 'auto',

    fireOnInit: false,

    onRate: function(rating) {},

    error: {
      method: 'The method you called is not defined',
      noMaximum:
        'No maximum rating specified. Cannot generate HTML automatically'
    },

    metadata: {
      rating: 'rating',
      maxRating: 'maxRating',
      icon: 'icon'
    },

    className: {
      active: 'active',
      disabled: 'disabled',
      selected: 'selected',
      loading: 'loading'
    },

    selector: {
      icon: '.icon'
    },

    templates: {
      icon: function(maxRating, iconClass) {
        let icon = 1
        let html = ''
        while (icon <= maxRating) {
          html += '<i class="' + iconClass + ' icon"></i>'
          icon++
        }
        return html
      }
    }
  }
})(jQuery, window, document)
