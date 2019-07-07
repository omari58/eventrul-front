/*!
 * # Fomantic-UI - Calendar
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

  $.fn.calendar = function(parameters) {
    const $allModules = $(this)

    const moduleSelector = $allModules.selector || ''

    let time = new Date().getTime()
    let performance = []

    const query = arguments[0]
    const methodInvoked = typeof query === 'string'
    const queryArguments = [].slice.call(arguments, 1)
    let returnedValue
    const timeGapTable = {
      '5': { row: 4, column: 3 },
      '10': { row: 3, column: 2 },
      '15': { row: 2, column: 2 },
      '20': { row: 3, column: 1 },
      '30': { row: 2, column: 1 }
    }
    $allModules.each(function() {
      const settings = $.isPlainObject(parameters)
        ? $.extend(true, {}, $.fn.calendar.settings, parameters)
        : $.extend({}, $.fn.calendar.settings)

      const className = settings.className
      const namespace = settings.namespace
      const selector = settings.selector
      const formatter = settings.formatter
      const parser = settings.parser
      const metadata = settings.metadata
      const timeGap = timeGapTable[settings.minTimeGap]
      const error = settings.error

      const eventNamespace = '.' + namespace
      const moduleNamespace = 'module-' + namespace

      const $module = $(this)
      const $input = $module.find(selector.input)
      let $container = $module.find(selector.popup)
      let $activator = $module.find(selector.activator)

      const element = this
      let instance = $module.data(moduleNamespace)

      let isTouch
      let isTouchDown = false
      let focusDateUsedForRange = false
      let module

      module = {
        initialize: function() {
          module.debug('Initializing calendar for', element, $module)

          isTouch = module.get.isTouch()
          module.setup.config()
          module.setup.popup()
          module.setup.inline()
          module.setup.input()
          module.setup.date()
          module.create.calendar()

          module.bind.events()
          module.instantiate()
        },

        instantiate: function() {
          module.verbose('Storing instance of calendar')
          instance = module
          $module.data(moduleNamespace, instance)
        },

        destroy: function() {
          module.verbose('Destroying previous calendar for', element)
          $module.removeData(moduleNamespace)
          module.unbind.events()
        },

        setup: {
          config: function() {
            if (module.get.minDate() !== null) {
              module.set.minDate($module.data(metadata.minDate))
            }
            if (module.get.maxDate() !== null) {
              module.set.maxDate($module.data(metadata.maxDate))
            }
          },
          popup: function() {
            if (settings.inline) {
              return
            }
            if (!$activator.length) {
              $activator = $module.children().first()
              if (!$activator.length) {
                return
              }
            }
            if ($.fn.popup === undefined) {
              module.error(error.popup)
              return
            }
            if (!$container.length) {
              // prepend the popup element to the activator's parent so that it has less chance of messing with
              // the styling (eg input action button needs to be the last child to have correct border radius)
              $container = $('<div/>')
                .addClass(className.popup)
                .prependTo($activator.parent())
            }
            $container.addClass(className.calendar)
            let onVisible = settings.onVisible
            let onHidden = settings.onHidden
            if (!$input.length) {
              // no input, $container has to handle focus/blur
              $container.attr('tabindex', '0')
              onVisible = function() {
                module.focus()
                return settings.onVisible.apply($container, arguments)
              }
              onHidden = function() {
                module.blur()
                return settings.onHidden.apply($container, arguments)
              }
            }
            const onShow = function() {
              // reset the focus date onShow
              module.set.focusDate(module.get.date())
              module.set.mode(settings.startMode)
              return settings.onShow.apply($container, arguments)
            }
            const on = settings.on || ($input.length ? 'focus' : 'click')
            const options = $.extend({}, settings.popupOptions, {
              popup: $container,
              on: on,
              hoverable: on === 'hover',
              onShow: onShow,
              onVisible: onVisible,
              onHide: settings.onHide,
              onHidden: onHidden
            })
            module.popup(options)
          },
          inline: function() {
            if ($activator.length && !settings.inline) {
              return
            }
            $container = $('<div/>')
              .addClass(className.calendar)
              .appendTo($module)
            if (!$input.length) {
              $container.attr('tabindex', '0')
            }
          },
          input: function() {
            if (settings.touchReadonly && $input.length && isTouch) {
              $input.prop('readonly', true)
            }
          },
          date: function() {
            if (settings.initialDate) {
              var date = parser.date(settings.initialDate, settings)
              module.set.date(date, settings.formatInput, false)
            } else if ($module.data(metadata.date) !== undefined) {
              var date = parser.date($module.data(metadata.date), settings)
              module.set.date(date, settings.formatInput, false)
            } else if ($input.length) {
              const val = $input.val()
              var date = parser.date(val, settings)
              module.set.date(date, settings.formatInput, false)
            }
          }
        },

        create: {
          calendar: function() {
            let i, r, c, p, row, cell, pageGrid

            const mode = module.get.mode()
            const today = new Date()
            const date = module.get.date()
            let focusDate = module.get.focusDate()
            let display = focusDate || date || settings.initialDate || today
            display = module.helper.dateInRange(display)

            if (!focusDate) {
              focusDate = display
              module.set.focusDate(focusDate, false, false)
            }

            const isYear = mode === 'year'
            const isMonth = mode === 'month'
            const isDay = mode === 'day'
            const isHour = mode === 'hour'
            const isMinute = mode === 'minute'
            const isTimeOnly = settings.type === 'time'

            const multiMonth = Math.max(settings.multiMonth, 1)
            const monthOffset = !isDay ? 0 : module.get.monthOffset()

            const minute = display.getMinutes()
            const hour = display.getHours()
            const day = display.getDate()
            const startMonth = display.getMonth() + monthOffset
            const year = display.getFullYear()

            const columns = isDay
              ? settings.showWeekNumbers
                ? 8
                : 7
              : isHour
              ? 4
              : timeGap.column
            let rows = isDay || isHour ? 6 : timeGap.row
            const pages = isDay ? multiMonth : 1

            let container = $container
            const tooltipPosition = container.hasClass('left')
              ? 'right center'
              : 'left center'
            container.empty()
            if (pages > 1) {
              pageGrid = $('<div/>')
                .addClass(className.grid)
                .appendTo(container)
            }

            for (p = 0; p < pages; p++) {
              if (pages > 1) {
                const pageColumn = $('<div/>')
                  .addClass(className.column)
                  .appendTo(pageGrid)
                container = pageColumn
              }

              const month = startMonth + p
              const firstMonthDayColumn =
                (new Date(year, month, 1).getDay() -
                  (settings.firstDayOfWeek % 7) +
                  7) %
                7
              if (!settings.constantHeight && isDay) {
                const requiredCells =
                  new Date(year, month + 1, 0).getDate() + firstMonthDayColumn
                rows = Math.ceil(requiredCells / 7)
              }

              const yearChange = isYear ? 10 : isMonth ? 1 : 0
              const monthChange = isDay ? 1 : 0
              const dayChange = isHour || isMinute ? 1 : 0
              const prevNextDay = isHour || isMinute ? day : 1
              const prevDate = new Date(
                year - yearChange,
                month - monthChange,
                prevNextDay - dayChange,
                hour
              )
              const nextDate = new Date(
                year + yearChange,
                month + monthChange,
                prevNextDay + dayChange,
                hour
              )

              const prevLast = isYear
                ? new Date(Math.ceil(year / 10) * 10 - 9, 0, 0)
                : isMonth
                ? new Date(year, 0, 0)
                : isDay
                ? new Date(year, month, 0)
                : new Date(year, month, day, -1)
              const nextFirst = isYear
                ? new Date(Math.ceil(year / 10) * 10 + 1, 0, 1)
                : isMonth
                ? new Date(year + 1, 0, 1)
                : isDay
                ? new Date(year, month + 1, 1)
                : new Date(year, month, day + 1)

              let tempMode = mode
              if (isDay && settings.showWeekNumbers) {
                tempMode += ' andweek'
              }
              const table = $('<table/>')
                .addClass(className.table)
                .addClass(tempMode)
                .appendTo(container)
              let textColumns = columns
              // no header for time-only mode
              if (!isTimeOnly) {
                const thead = $('<thead/>').appendTo(table)

                row = $('<tr/>').appendTo(thead)
                cell = $('<th/>')
                  .attr('colspan', '' + columns)
                  .appendTo(row)

                const headerDate =
                  isYear || isMonth
                    ? new Date(year, 0, 1)
                    : isDay
                    ? new Date(year, month, 1)
                    : new Date(year, month, day, hour, minute)
                const headerText = $('<span/>')
                  .addClass(className.link)
                  .appendTo(cell)
                headerText.text(formatter.header(headerDate, mode, settings))
                const newMode = isMonth
                  ? settings.disableYear
                    ? 'day'
                    : 'year'
                  : isDay
                  ? settings.disableMonth
                    ? 'year'
                    : 'month'
                  : 'day'
                headerText.data(metadata.mode, newMode)

                if (p === 0) {
                  const prev = $('<span/>')
                    .addClass(className.prev)
                    .appendTo(cell)
                  prev.data(metadata.focusDate, prevDate)
                  prev.toggleClass(
                    className.disabledCell,
                    !module.helper.isDateInRange(prevLast, mode)
                  )
                  $('<i/>')
                    .addClass(className.prevIcon)
                    .appendTo(prev)
                }

                if (p === pages - 1) {
                  const next = $('<span/>')
                    .addClass(className.next)
                    .appendTo(cell)
                  next.data(metadata.focusDate, nextDate)
                  next.toggleClass(
                    className.disabledCell,
                    !module.helper.isDateInRange(nextFirst, mode)
                  )
                  $('<i/>')
                    .addClass(className.nextIcon)
                    .appendTo(next)
                }
                if (isDay) {
                  row = $('<tr/>').appendTo(thead)
                  if (settings.showWeekNumbers) {
                    cell = $('<th/>').appendTo(row)
                    cell.text(settings.text.weekNo)
                    cell.addClass(className.weekCell)
                    textColumns--
                  }
                  for (i = 0; i < textColumns; i++) {
                    cell = $('<th/>').appendTo(row)
                    cell.text(
                      formatter.dayColumnHeader(
                        (i + settings.firstDayOfWeek) % 7,
                        settings
                      )
                    )
                  }
                }
              }

              const tbody = $('<tbody/>').appendTo(table)
              i = isYear
                ? Math.ceil(year / 10) * 10 - 9
                : isDay
                ? 1 - firstMonthDayColumn
                : 0
              for (r = 0; r < rows; r++) {
                row = $('<tr/>').appendTo(tbody)
                if (isDay && settings.showWeekNumbers) {
                  cell = $('<th/>').appendTo(row)
                  cell.text(
                    module.get.weekOfYear(
                      year,
                      month,
                      i + 1 - settings.firstDayOfWeek
                    )
                  )
                  cell.addClass(className.weekCell)
                }
                for (c = 0; c < textColumns; c++, i++) {
                  const cellDate = isYear
                    ? new Date(i, month, 1, hour, minute)
                    : isMonth
                    ? new Date(year, i, 1, hour, minute)
                    : isDay
                    ? new Date(year, month, i, hour, minute)
                    : isHour
                    ? new Date(year, month, day, i)
                    : new Date(year, month, day, hour, i * settings.minTimeGap)
                  const cellText = isYear
                    ? i
                    : isMonth
                    ? settings.text.monthsShort[i]
                    : isDay
                    ? cellDate.getDate()
                    : formatter.time(cellDate, settings, true)
                  cell = $('<td/>')
                    .addClass(className.cell)
                    .appendTo(row)
                  cell.text(cellText)
                  cell.data(metadata.date, cellDate)
                  const adjacent =
                    isDay && cellDate.getMonth() !== (month + 12) % 12
                  const disabled =
                    (!settings.selectAdjacentDays && adjacent) ||
                    !module.helper.isDateInRange(cellDate, mode) ||
                    settings.isDisabled(cellDate, mode) ||
                    module.helper.isDisabled(cellDate, mode) ||
                    !module.helper.isEnabled(cellDate, mode)
                  if (disabled) {
                    const disabledDate = module.helper.findDayAsObject(
                      cellDate,
                      mode,
                      settings.disabledDates
                    )
                    if (
                      disabledDate !== null &&
                      disabledDate[metadata.message]
                    ) {
                      cell.attr('data-tooltip', disabledDate[metadata.message])
                      cell.attr('data-position', tooltipPosition)
                    }
                  } else {
                    const eventDate = module.helper.findDayAsObject(
                      cellDate,
                      mode,
                      settings.eventDates
                    )
                    if (eventDate !== null) {
                      cell.addClass(
                        eventDate[metadata.class] || settings.eventClass
                      )
                      if (eventDate[metadata.message]) {
                        cell.attr('data-tooltip', eventDate[metadata.message])
                        cell.attr('data-position', tooltipPosition)
                      }
                    }
                  }
                  const active = module.helper.dateEqual(cellDate, date, mode)
                  const isToday = module.helper.dateEqual(cellDate, today, mode)
                  cell.toggleClass(className.adjacentCell, adjacent)
                  cell.toggleClass(className.disabledCell, disabled)
                  cell.toggleClass(className.activeCell, active && !adjacent)
                  if (!isHour && !isMinute) {
                    cell.toggleClass(className.todayCell, !adjacent && isToday)
                  }

                  // Allow for external modifications of each cell
                  const cellOptions = {
                    mode: mode,
                    adjacent: adjacent,
                    disabled: disabled,
                    active: active,
                    today: isToday
                  }
                  formatter.cell(cell, cellDate, cellOptions)

                  if (module.helper.dateEqual(cellDate, focusDate, mode)) {
                    // ensure that the focus date is exactly equal to the cell date
                    // so that, if selected, the correct value is set
                    module.set.focusDate(cellDate, false, false)
                  }
                }
              }

              if (settings.today) {
                const todayRow = $('<tr/>').appendTo(tbody)
                const todayButton = $('<td/>')
                  .attr('colspan', '' + columns)
                  .addClass(className.today)
                  .appendTo(todayRow)
                todayButton.text(formatter.today(settings))
                todayButton.data(metadata.date, today)
              }

              module.update.focus(false, table)
            }
          }
        },

        update: {
          focus: function(updateRange, container) {
            container = container || $container
            const mode = module.get.mode()
            const date = module.get.date()
            const focusDate = module.get.focusDate()
            const startDate = module.get.startDate()
            const endDate = module.get.endDate()
            const rangeDate =
              (updateRange ? focusDate : null) ||
              date ||
              (!isTouch ? focusDate : null)

            container.find('td').each(function() {
              const cell = $(this)
              const cellDate = cell.data(metadata.date)
              if (!cellDate) {
                return
              }
              const disabled = cell.hasClass(className.disabledCell)
              const active = cell.hasClass(className.activeCell)
              const adjacent = cell.hasClass(className.adjacentCell)
              const focused = module.helper.dateEqual(cellDate, focusDate, mode)
              const inRange = !rangeDate
                ? false
                : (!!startDate &&
                    module.helper.isDateInRange(
                      cellDate,
                      mode,
                      startDate,
                      rangeDate
                    )) ||
                  (!!endDate &&
                    module.helper.isDateInRange(
                      cellDate,
                      mode,
                      rangeDate,
                      endDate
                    ))
              cell.toggleClass(
                className.focusCell,
                focused &&
                  (!isTouch || isTouchDown) &&
                  (!adjacent || (settings.selectAdjacentDays && adjacent)) &&
                  !disabled
              )
              cell.toggleClass(
                className.rangeCell,
                inRange && !active && !disabled
              )
            })
          }
        },

        refresh: function() {
          module.create.calendar()
        },

        bind: {
          events: function() {
            module.debug('Binding events')
            $container.on('mousedown' + eventNamespace, module.event.mousedown)
            $container.on('touchstart' + eventNamespace, module.event.mousedown)
            $container.on('mouseup' + eventNamespace, module.event.mouseup)
            $container.on('touchend' + eventNamespace, module.event.mouseup)
            $container.on('mouseover' + eventNamespace, module.event.mouseover)
            if ($input.length) {
              $input.on('input' + eventNamespace, module.event.inputChange)
              $input.on('focus' + eventNamespace, module.event.inputFocus)
              $input.on('blur' + eventNamespace, module.event.inputBlur)
              $input.on('click' + eventNamespace, module.event.inputClick)
              $input.on('keydown' + eventNamespace, module.event.keydown)
            } else {
              $container.on('keydown' + eventNamespace, module.event.keydown)
            }
          }
        },

        unbind: {
          events: function() {
            module.debug('Unbinding events')
            $container.off(eventNamespace)
            if ($input.length) {
              $input.off(eventNamespace)
            }
          }
        },

        event: {
          mouseover: function(event) {
            const target = $(event.target)
            const date = target.data(metadata.date)
            const mousedown = event.buttons === 1
            if (date) {
              module.set.focusDate(date, false, true, mousedown)
            }
          },
          mousedown: function(event) {
            if ($input.length) {
              // prevent the mousedown on the calendar causing the input to lose focus
              event.preventDefault()
            }
            isTouchDown = event.type.indexOf('touch') >= 0
            const target = $(event.target)
            const date = target.data(metadata.date)
            if (date) {
              module.set.focusDate(date, false, true, true)
            }
          },
          mouseup: function(event) {
            // ensure input has focus so that it receives keydown events for calendar navigation
            module.focus()
            event.preventDefault()
            event.stopPropagation()
            isTouchDown = false
            let target = $(event.target)
            if (target.hasClass('disabled')) {
              return
            }
            const parent = target.parent()
            if (
              parent.data(metadata.date) ||
              parent.data(metadata.focusDate) ||
              parent.data(metadata.mode)
            ) {
              // clicked on a child element, switch to parent (used when clicking directly on prev/next <i> icon element)
              target = parent
            }
            const date = target.data(metadata.date)
            const focusDate = target.data(metadata.focusDate)
            const mode = target.data(metadata.mode)
            if (
              date &&
              settings.onSelect.call(element, date, module.get.mode()) !== false
            ) {
              const forceSet = target.hasClass(className.today)
              module.selectDate(date, forceSet)
            } else if (focusDate) {
              module.set.focusDate(focusDate)
            } else if (mode) {
              module.set.mode(mode)
            }
          },
          keydown: function(event) {
            if (event.keyCode === 27 || event.keyCode === 9) {
              // esc || tab
              module.popup('hide')
            }

            if (module.popup('is visible')) {
              if (
                event.keyCode === 37 ||
                event.keyCode === 38 ||
                event.keyCode === 39 ||
                event.keyCode === 40
              ) {
                // arrow keys
                var mode = module.get.mode()
                const bigIncrement =
                  mode === 'day'
                    ? 7
                    : mode === 'hour'
                    ? 4
                    : mode === 'minute'
                    ? timeGap.column
                    : 3
                let increment =
                  event.keyCode === 37
                    ? -1
                    : event.keyCode === 38
                    ? -bigIncrement
                    : event.keyCode == 39
                    ? 1
                    : bigIncrement
                increment *= mode === 'minute' ? settings.minTimeGap : 1
                const focusDate =
                  module.get.focusDate() || module.get.date() || new Date()
                const year =
                  focusDate.getFullYear() + (mode === 'year' ? increment : 0)
                const month =
                  focusDate.getMonth() + (mode === 'month' ? increment : 0)
                const day =
                  focusDate.getDate() + (mode === 'day' ? increment : 0)
                const hour =
                  focusDate.getHours() + (mode === 'hour' ? increment : 0)
                const minute =
                  focusDate.getMinutes() + (mode === 'minute' ? increment : 0)
                let newFocusDate = new Date(year, month, day, hour, minute)
                if (settings.type === 'time') {
                  newFocusDate = module.helper.mergeDateTime(
                    focusDate,
                    newFocusDate
                  )
                }
                if (module.helper.isDateInRange(newFocusDate, mode)) {
                  module.set.focusDate(newFocusDate)
                }
              } else if (event.keyCode === 13) {
                // enter
                var mode = module.get.mode()
                const date = module.get.focusDate()
                if (
                  date &&
                  !settings.isDisabled(date, mode) &&
                  !module.helper.isDisabled(date, mode) &&
                  module.helper.isEnabled(date, mode)
                ) {
                  module.selectDate(date)
                }
                // disable form submission:
                event.preventDefault()
                event.stopPropagation()
              }
            }

            if (event.keyCode === 38 || event.keyCode === 40) {
              // arrow-up || arrow-down
              event.preventDefault() // don't scroll
              module.popup('show')
            }
          },
          inputChange: function() {
            const val = $input.val()
            const date = parser.date(val, settings)
            module.set.date(date, false)
          },
          inputFocus: function() {
            $container.addClass(className.active)
          },
          inputBlur: function() {
            $container.removeClass(className.active)
            if (settings.formatInput) {
              const date = module.get.date()
              const text = formatter.datetime(date, settings)
              $input.val(text)
            }
          },
          inputClick: function() {
            module.popup('show')
          }
        },

        get: {
          weekOfYear: function(weekYear, weekMonth, weekDay) {
            // adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
            const ms1d = 864e5 // milliseconds in a day
            const ms7d = 7 * ms1d // milliseconds in a week

            return (function() {
              // return a closure so constants get calculated only once
              const DC3 = Date.UTC(weekYear, weekMonth, weekDay + 3) / ms1d // an Absolute Day Number
              const AWN = Math.floor(DC3 / 7) // an Absolute Week Number
              const Wyr = new Date(AWN * ms7d).getUTCFullYear()

              return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1
            })()
          },
          date: function() {
            return (
              module.helper.sanitiseDate($module.data(metadata.date)) || null
            )
          },
          inputDate: function() {
            return $input.val()
          },
          focusDate: function() {
            return $module.data(metadata.focusDate) || null
          },
          startDate: function() {
            const startModule = module.get.calendarModule(
              settings.startCalendar
            )
            return (
              (startModule
                ? startModule.get.date()
                : $module.data(metadata.startDate)) || null
            )
          },
          endDate: function() {
            const endModule = module.get.calendarModule(settings.endCalendar)
            return (
              (endModule
                ? endModule.get.date()
                : $module.data(metadata.endDate)) || null
            )
          },
          minDate: function() {
            return $module.data(metadata.minDate) || null
          },
          maxDate: function() {
            return $module.data(metadata.maxDate) || null
          },
          monthOffset: function() {
            return $module.data(metadata.monthOffset) || 0
          },
          mode: function() {
            // only returns valid modes for the current settings
            const mode = $module.data(metadata.mode) || settings.startMode
            const validModes = module.get.validModes()
            if ($.inArray(mode, validModes) >= 0) {
              return mode
            }
            return settings.type === 'time'
              ? 'hour'
              : settings.type === 'month'
              ? 'month'
              : settings.type === 'year'
              ? 'year'
              : 'day'
          },
          validModes: function() {
            const validModes = []
            if (settings.type !== 'time') {
              if (!settings.disableYear || settings.type === 'year') {
                validModes.push('year')
              }
              if (
                !(settings.disableMonth || settings.type === 'year') ||
                settings.type === 'month'
              ) {
                validModes.push('month')
              }
              if (settings.type.indexOf('date') >= 0) {
                validModes.push('day')
              }
            }
            if (settings.type.indexOf('time') >= 0) {
              validModes.push('hour')
              if (!settings.disableMinute) {
                validModes.push('minute')
              }
            }
            return validModes
          },
          isTouch: function() {
            try {
              document.createEvent('TouchEvent')
              return true
            } catch (e) {
              return false
            }
          },
          calendarModule: function(selector) {
            if (!selector) {
              return null
            }
            if (!(selector instanceof $)) {
              selector = $(selector).first()
            }
            // assume range related calendars are using the same namespace
            return selector.data(moduleNamespace)
          }
        },

        set: {
          date: function(date, updateInput, fireChange) {
            updateInput = updateInput !== false
            fireChange = fireChange !== false
            date = module.helper.sanitiseDate(date)
            date = module.helper.dateInRange(date)

            const mode = module.get.mode()
            const text = formatter.datetime(date, settings)
            if (
              fireChange &&
              settings.onChange.call(element, date, text, mode) === false
            ) {
              return false
            }

            module.set.focusDate(date)

            if (settings.isDisabled(date, mode)) {
              return false
            }

            const endDate = module.get.endDate()
            if (!!endDate && !!date && date > endDate) {
              // selected date is greater than end date in range, so clear end date
              module.set.endDate(undefined)
            }
            module.set.dataKeyValue(metadata.date, date)

            if (updateInput && $input.length) {
              $input.val(text)
            }
          },
          startDate: function(date, refreshCalendar) {
            date = module.helper.sanitiseDate(date)
            const startModule = module.get.calendarModule(
              settings.startCalendar
            )
            if (startModule) {
              startModule.set.date(date)
            }
            module.set.dataKeyValue(metadata.startDate, date, refreshCalendar)
          },
          endDate: function(date, refreshCalendar) {
            date = module.helper.sanitiseDate(date)
            const endModule = module.get.calendarModule(settings.endCalendar)
            if (endModule) {
              endModule.set.date(date)
            }
            module.set.dataKeyValue(metadata.endDate, date, refreshCalendar)
          },
          focusDate: function(date, refreshCalendar, updateFocus, updateRange) {
            date = module.helper.sanitiseDate(date)
            date = module.helper.dateInRange(date)
            const isDay = module.get.mode() === 'day'
            const oldFocusDate = module.get.focusDate()
            if (isDay && date && oldFocusDate) {
              const yearDelta = date.getFullYear() - oldFocusDate.getFullYear()
              const monthDelta =
                yearDelta * 12 + date.getMonth() - oldFocusDate.getMonth()
              if (monthDelta) {
                const monthOffset = module.get.monthOffset() - monthDelta
                module.set.monthOffset(monthOffset, false)
              }
            }
            const changed = module.set.dataKeyValue(
              metadata.focusDate,
              date,
              refreshCalendar
            )
            updateFocus =
              (updateFocus !== false && changed && refreshCalendar === false) ||
              focusDateUsedForRange != updateRange
            focusDateUsedForRange = updateRange
            if (updateFocus) {
              module.update.focus(updateRange)
            }
          },
          minDate: function(date) {
            date = module.helper.sanitiseDate(date)
            if (settings.maxDate !== null && settings.maxDate <= date) {
              module.verbose(
                'Unable to set minDate variable bigger that maxDate variable',
                date,
                settings.maxDate
              )
            } else {
              module.setting('minDate', date)
              module.set.dataKeyValue(metadata.minDate, date)
            }
          },
          maxDate: function(date) {
            date = module.helper.sanitiseDate(date)
            if (settings.minDate !== null && settings.minDate >= date) {
              module.verbose(
                'Unable to set maxDate variable lower that minDate variable',
                date,
                settings.minDate
              )
            } else {
              module.setting('maxDate', date)
              module.set.dataKeyValue(metadata.maxDate, date)
            }
          },
          monthOffset: function(monthOffset, refreshCalendar) {
            const multiMonth = Math.max(settings.multiMonth, 1)
            monthOffset = Math.max(1 - multiMonth, Math.min(0, monthOffset))
            module.set.dataKeyValue(
              metadata.monthOffset,
              monthOffset,
              refreshCalendar
            )
          },
          mode: function(mode, refreshCalendar) {
            module.set.dataKeyValue(metadata.mode, mode, refreshCalendar)
          },
          dataKeyValue: function(key, value, refreshCalendar) {
            const oldValue = $module.data(key)
            const equal =
              oldValue === value || (oldValue <= value && oldValue >= value) // equality test for dates and string objects
            if (value) {
              $module.data(key, value)
            } else {
              $module.removeData(key)
            }
            refreshCalendar = refreshCalendar !== false && !equal
            if (refreshCalendar) {
              module.refresh()
            }
            return !equal
          }
        },

        selectDate: function(date, forceSet) {
          module.verbose('New date selection', date)
          const mode = module.get.mode()
          const complete =
            forceSet ||
            mode === 'minute' ||
            (settings.disableMinute && mode === 'hour') ||
            (settings.type === 'date' && mode === 'day') ||
            (settings.type === 'month' && mode === 'month') ||
            (settings.type === 'year' && mode === 'year')
          if (complete) {
            const canceled = module.set.date(date) === false
            if (!canceled && settings.closable) {
              module.popup('hide')
              // if this is a range calendar, show the end date calendar popup and focus the input
              const endModule = module.get.calendarModule(settings.endCalendar)
              if (endModule) {
                endModule.popup('show')
                endModule.focus()
              }
            }
          } else {
            const newMode =
              mode === 'year'
                ? !settings.disableMonth
                  ? 'month'
                  : 'day'
                : mode === 'month'
                ? 'day'
                : mode === 'day'
                ? 'hour'
                : 'minute'
            module.set.mode(newMode)
            if (mode === 'hour' || (mode === 'day' && module.get.date())) {
              // the user has chosen enough to consider a valid date/time has been chosen
              module.set.date(date)
            } else {
              module.set.focusDate(date)
            }
          }
        },

        changeDate: function(date) {
          module.set.date(date)
        },

        clear: function() {
          module.set.date(undefined)
        },

        popup: function() {
          return $activator.popup.apply($activator, arguments)
        },

        focus: function() {
          if ($input.length) {
            $input.focus()
          } else {
            $container.focus()
          }
        },
        blur: function() {
          if ($input.length) {
            $input.blur()
          } else {
            $container.blur()
          }
        },

        helper: {
          isDisabled: function(date, mode) {
            return (
              mode === 'day' &&
              (settings.disabledDaysOfWeek.indexOf(date.getDay()) !== -1 ||
                settings.disabledDates.some(function(d) {
                  if (d instanceof Date) {
                    return module.helper.dateEqual(date, d, mode)
                  }
                  if (d !== null && typeof d === 'object') {
                    return module.helper.dateEqual(date, d[metadata.date], mode)
                  }
                }))
            )
          },
          isEnabled: function(date, mode) {
            if (mode === 'day') {
              return (
                settings.enabledDates.length == 0 ||
                settings.enabledDates.some(function(d) {
                  if (d instanceof Date) {
                    return module.helper.dateEqual(date, d, mode)
                  }
                  if (d !== null && typeof d === 'object') {
                    return module.helper.dateEqual(date, d[metadata.date], mode)
                  }
                })
              )
            } else {
              return true
            }
          },
          findDayAsObject: function(date, mode, dates) {
            if (mode === 'day') {
              let i = 0
              const il = dates.length
              let d
              for (; i < il; i++) {
                d = dates[i]
                if (
                  d instanceof Date &&
                  module.helper.dateEqual(date, d, mode)
                ) {
                  const dateObject = {}
                  dateObject[metadata.date] = d
                  return dateObject
                } else if (
                  d !== null &&
                  typeof d === 'object' &&
                  d[metadata.date] &&
                  module.helper.dateEqual(date, d[metadata.date], mode)
                ) {
                  return d
                }
              }
            }
            return null
          },
          sanitiseDate: function(date) {
            if (!date) {
              return undefined
            }
            if (!(date instanceof Date)) {
              date = parser.date('' + date, settings)
            }
            if (!date || date === null || isNaN(date.getTime())) {
              return undefined
            }
            return date
          },
          dateDiff: function(date1, date2, mode) {
            mode = mode || 'day'
            const isTimeOnly = settings.type === 'time'
            const isYear = mode === 'year'
            const isYearOrMonth = isYear || mode === 'month'
            const isMinute = mode === 'minute'
            const isHourOrMinute = isMinute || mode === 'hour'
            // only care about a minute accuracy of settings.minTimeGap
            date1 = new Date(
              isTimeOnly ? 2000 : date1.getFullYear(),
              isTimeOnly ? 0 : isYear ? 0 : date1.getMonth(),
              isTimeOnly ? 1 : isYearOrMonth ? 1 : date1.getDate(),
              !isHourOrMinute ? 0 : date1.getHours(),
              !isMinute
                ? 0
                : settings.minTimeGap *
                  Math.floor(date1.getMinutes() / settings.minTimeGap)
            )
            date2 = new Date(
              isTimeOnly ? 2000 : date2.getFullYear(),
              isTimeOnly ? 0 : isYear ? 0 : date2.getMonth(),
              isTimeOnly ? 1 : isYearOrMonth ? 1 : date2.getDate(),
              !isHourOrMinute ? 0 : date2.getHours(),
              !isMinute
                ? 0
                : settings.minTimeGap *
                  Math.floor(date2.getMinutes() / settings.minTimeGap)
            )
            return date2.getTime() - date1.getTime()
          },
          dateEqual: function(date1, date2, mode) {
            return (
              !!date1 &&
              !!date2 &&
              module.helper.dateDiff(date1, date2, mode) === 0
            )
          },
          isDateInRange: function(date, mode, minDate, maxDate) {
            if (!minDate && !maxDate) {
              const startDate = module.get.startDate()
              minDate =
                startDate && settings.minDate
                  ? new Date(Math.max(startDate, settings.minDate))
                  : startDate || settings.minDate
              maxDate = settings.maxDate
            }
            minDate =
              minDate &&
              new Date(
                minDate.getFullYear(),
                minDate.getMonth(),
                minDate.getDate(),
                minDate.getHours(),
                settings.minTimeGap *
                  Math.ceil(minDate.getMinutes() / settings.minTimeGap)
              )
            return !(
              !date ||
              (minDate && module.helper.dateDiff(date, minDate, mode) > 0) ||
              (maxDate && module.helper.dateDiff(maxDate, date, mode) > 0)
            )
          },
          dateInRange: function(date, minDate, maxDate) {
            if (!minDate && !maxDate) {
              const startDate = module.get.startDate()
              minDate =
                startDate && settings.minDate
                  ? new Date(Math.max(startDate, settings.minDate))
                  : startDate || settings.minDate
              maxDate = settings.maxDate
            }
            minDate =
              minDate &&
              new Date(
                minDate.getFullYear(),
                minDate.getMonth(),
                minDate.getDate(),
                minDate.getHours(),
                settings.minTimeGap *
                  Math.ceil(minDate.getMinutes() / settings.minTimeGap)
              )
            const isTimeOnly = settings.type === 'time'
            return !date
              ? date
              : minDate && module.helper.dateDiff(date, minDate, 'minute') > 0
              ? isTimeOnly
                ? module.helper.mergeDateTime(date, minDate)
                : minDate
              : maxDate && module.helper.dateDiff(maxDate, date, 'minute') > 0
              ? isTimeOnly
                ? module.helper.mergeDateTime(date, maxDate)
                : maxDate
              : date
          },
          mergeDateTime: function(date, time) {
            return !date || !time
              ? time
              : new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  time.getHours(),
                  time.getMinutes()
                )
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
          instance.invoke('destroy')
        }
        module.initialize()
      }
    })
    return returnedValue !== undefined ? returnedValue : this
  }

  $.fn.calendar.settings = {
    name: 'Calendar',
    namespace: 'calendar',

    silent: false,
    debug: false,
    verbose: false,
    performance: false,

    type: 'datetime', // picker type, can be 'datetime', 'date', 'time', 'month', or 'year'
    firstDayOfWeek: 0, // day for first day column (0 = Sunday)
    constantHeight: true, // add rows to shorter months to keep day calendar height consistent (6 rows)
    today: false, // show a 'today/now' button at the bottom of the calendar
    closable: true, // close the popup after selecting a date/time
    monthFirst: true, // month before day when parsing/converting date from/to text
    touchReadonly: true, // set input to readonly on touch devices
    inline: false, // create the calendar inline instead of inside a popup
    on: null, // when to show the popup (defaults to 'focus' for input, 'click' for others)
    initialDate: null, // date to display initially when no date is selected (null = now)
    startMode: false, // display mode to start in, can be 'year', 'month', 'day', 'hour', 'minute' (false = 'day')
    minDate: null, // minimum date/time that can be selected, dates/times before are disabled
    maxDate: null, // maximum date/time that can be selected, dates/times after are disabled
    ampm: true, // show am/pm in time mode
    disableYear: false, // disable year selection mode
    disableMonth: false, // disable month selection mode
    disableMinute: false, // disable minute selection mode
    formatInput: true, // format the input text upon input blur and module creation
    startCalendar: null, // jquery object or selector for another calendar that represents the start date of a date range
    endCalendar: null, // jquery object or selector for another calendar that represents the end date of a date range
    multiMonth: 1, // show multiple months when in 'day' mode
    minTimeGap: 5,
    showWeekNumbers: null, // show Number of Week at the very first column of a dayView
    disabledDates: [], // specific day(s) which won't be selectable and contain additional information.
    disabledDaysOfWeek: [], // day(s) which won't be selectable(s) (0 = Sunday)
    enabledDates: [], // specific day(s) which will be selectable, all other days will be disabled
    eventDates: [], // specific day(s) which will be shown in a different color and using tooltips
    centuryBreak: 60, // starting short year until 99 where it will be assumed to belong to the last century
    currentCentury: 2000, // century to be added to 2-digit years (00 to {centuryBreak}-1)
    selectAdjacentDays: false, // The calendar can show dates from adjacent month. These adjacent month dates can also be made selectable.
    // popup options ('popup', 'on', 'hoverable', and show/hide callbacks are overridden)
    popupOptions: {
      position: 'bottom left',
      lastResort: 'bottom left',
      prefer: 'opposite',
      hideOnScroll: false
    },

    text: {
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      monthsShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      today: 'Today',
      now: 'Now',
      am: 'AM',
      pm: 'PM',
      weekNo: 'Week'
    },

    formatter: {
      header: function(date, mode, settings) {
        return mode === 'year'
          ? settings.formatter.yearHeader(date, settings)
          : mode === 'month'
          ? settings.formatter.monthHeader(date, settings)
          : mode === 'day'
          ? settings.formatter.dayHeader(date, settings)
          : mode === 'hour'
          ? settings.formatter.hourHeader(date, settings)
          : settings.formatter.minuteHeader(date, settings)
      },
      yearHeader: function(date, settings) {
        const decadeYear = Math.ceil(date.getFullYear() / 10) * 10
        return decadeYear - 9 + ' - ' + (decadeYear + 2)
      },
      monthHeader: function(date, settings) {
        return date.getFullYear()
      },
      dayHeader: function(date, settings) {
        const month = settings.text.months[date.getMonth()]
        const year = date.getFullYear()
        return month + ' ' + year
      },
      hourHeader: function(date, settings) {
        return settings.formatter.date(date, settings)
      },
      minuteHeader: function(date, settings) {
        return settings.formatter.date(date, settings)
      },
      dayColumnHeader: function(day, settings) {
        return settings.text.days[day]
      },
      datetime: function(date, settings) {
        if (!date) {
          return ''
        }
        const day =
          settings.type === 'time'
            ? ''
            : settings.formatter.date(date, settings)
        const time =
          settings.type.indexOf('time') < 0
            ? ''
            : settings.formatter.time(date, settings, false)
        const separator = settings.type === 'datetime' ? ' ' : ''
        return day + separator + time
      },
      date: function(date, settings) {
        if (!date) {
          return ''
        }
        const day = date.getDate()
        const month = settings.text.months[date.getMonth()]
        const year = date.getFullYear()
        return settings.type === 'year'
          ? year
          : settings.type === 'month'
          ? month + ' ' + year
          : (settings.monthFirst ? month + ' ' + day : day + ' ' + month) +
            ', ' +
            year
      },
      time: function(date, settings, forCalendar) {
        if (!date) {
          return ''
        }
        let hour = date.getHours()
        const minute = date.getMinutes()
        let ampm = ''
        if (settings.ampm) {
          ampm = ' ' + (hour < 12 ? settings.text.am : settings.text.pm)
          hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        }
        return hour + ':' + (minute < 10 ? '0' : '') + minute + ampm
      },
      today: function(settings) {
        return settings.type === 'date'
          ? settings.text.today
          : settings.text.now
      },
      cell: function(cell, date, cellOptions) {}
    },

    parser: {
      date: function(text, settings) {
        if (text instanceof Date) {
          return text
        }
        if (!text) {
          return null
        }
        text = ('' + text).trim().toLowerCase()
        if (text.length === 0) {
          return null
        }

        let i, j, k
        let minute = -1
        let hour = -1
        let day = -1
        let month = -1
        let year = -1
        let isAm = undefined

        const isTimeOnly = settings.type === 'time'
        const isDateOnly = settings.type.indexOf('time') < 0

        const words = text.split(settings.regExp.dateWords)
        const numbers = text.split(settings.regExp.dateNumbers)

        if (!isDateOnly) {
          // am/pm
          isAm =
            $.inArray(settings.text.am.toLowerCase(), words) >= 0
              ? true
              : $.inArray(settings.text.pm.toLowerCase(), words) >= 0
              ? false
              : undefined

          // time with ':'
          for (i = 0; i < numbers.length; i++) {
            const number = numbers[i]
            if (number.indexOf(':') >= 0) {
              if (hour < 0 || minute < 0) {
                const parts = number.split(':')
                for (k = 0; k < Math.min(2, parts.length); k++) {
                  j = parseInt(parts[k])
                  if (isNaN(j)) {
                    j = 0
                  }
                  if (k === 0) {
                    hour = j % 24
                  } else {
                    minute = j % 60
                  }
                }
              }
              numbers.splice(i, 1)
            }
          }
        }

        if (!isTimeOnly) {
          // textual month
          for (i = 0; i < words.length; i++) {
            let word = words[i]
            if (word.length <= 0) {
              continue
            }
            word = word.substring(0, Math.min(word.length, 3))
            for (j = 0; j < settings.text.months.length; j++) {
              let monthString = settings.text.months[j]
              monthString = monthString
                .substring(
                  0,
                  Math.min(word.length, Math.min(monthString.length, 3))
                )
                .toLowerCase()
              if (monthString === word) {
                month = j + 1
                break
              }
            }
            if (month >= 0) {
              break
            }
          }

          // year > settings.centuryBreak
          for (i = 0; i < numbers.length; i++) {
            j = parseInt(numbers[i])
            if (isNaN(j)) {
              continue
            }
            if (j >= settings.centuryBreak && i === numbers.length - 1) {
              if (j <= 99) {
                j += settings.currentCentury - 100
              }
              year = j
              numbers.splice(i, 1)
              break
            }
          }

          // numeric month
          if (month < 0) {
            for (i = 0; i < numbers.length; i++) {
              k = i > 1 || settings.monthFirst ? i : i === 1 ? 0 : 1
              j = parseInt(numbers[k])
              if (isNaN(j)) {
                continue
              }
              if (j >= 1 && j <= 12) {
                month = j
                numbers.splice(k, 1)
                break
              }
            }
          }

          // day
          for (i = 0; i < numbers.length; i++) {
            j = parseInt(numbers[i])
            if (isNaN(j)) {
              continue
            }
            if (j >= 1 && j <= 31) {
              day = j
              numbers.splice(i, 1)
              break
            }
          }

          // year <= settings.centuryBreak
          if (year < 0) {
            for (i = numbers.length - 1; i >= 0; i--) {
              j = parseInt(numbers[i])
              if (isNaN(j)) {
                continue
              }
              if (j <= 99) {
                j += settings.currentCentury
              }
              year = j
              numbers.splice(i, 1)
              break
            }
          }
        }

        if (!isDateOnly) {
          // hour
          if (hour < 0) {
            for (i = 0; i < numbers.length; i++) {
              j = parseInt(numbers[i])
              if (isNaN(j)) {
                continue
              }
              if (j >= 0 && j <= 23) {
                hour = j
                numbers.splice(i, 1)
                break
              }
            }
          }

          // minute
          if (minute < 0) {
            for (i = 0; i < numbers.length; i++) {
              j = parseInt(numbers[i])
              if (isNaN(j)) {
                continue
              }
              if (j >= 0 && j <= 59) {
                minute = j
                numbers.splice(i, 1)
                break
              }
            }
          }
        }

        if (minute < 0 && hour < 0 && day < 0 && month < 0 && year < 0) {
          return null
        }

        if (minute < 0) {
          minute = 0
        }
        if (hour < 0) {
          hour = 0
        }
        if (day < 0) {
          day = 1
        }
        if (month < 0) {
          month = 1
        }
        if (year < 0) {
          year = new Date().getFullYear()
        }

        if (isAm !== undefined) {
          if (isAm) {
            if (hour === 12) {
              hour = 0
            }
          } else if (hour < 12) {
            hour += 12
          }
        }

        let date = new Date(year, month - 1, day, hour, minute)
        if (date.getMonth() !== month - 1 || date.getFullYear() !== year) {
          // month or year don't match up, switch to last day of the month
          date = new Date(year, month, 0, hour, minute)
        }
        return isNaN(date.getTime()) ? null : date
      }
    },

    // callback when date changes, return false to cancel the change
    onChange: function(date, text, mode) {
      return true
    },

    // callback before show animation, return false to prevent show
    onShow: function() {},

    // callback after show animation
    onVisible: function() {},

    // callback before hide animation, return false to prevent hide
    onHide: function() {},

    // callback after hide animation
    onHidden: function() {},

    // callback before item is selected, return false to prevent selection
    onSelect: function(date, mode) {},

    // is the given date disabled?
    isDisabled: function(date, mode) {
      return false
    },

    selector: {
      popup: '.ui.popup',
      input: 'input',
      activator: 'input'
    },

    regExp: {
      dateWords: /[^A-Za-z\u00C0-\u024F]+/g,
      dateNumbers: /[^\d:]+/g
    },

    error: {
      popup: 'UI Popup, a required component is not included in this page',
      method: 'The method you called is not defined.'
    },

    className: {
      calendar: 'calendar',
      active: 'active',
      popup: 'ui popup',
      grid: 'ui equal width grid',
      column: 'column',
      table: 'ui celled center aligned unstackable table',
      prev: 'prev link',
      next: 'next link',
      prevIcon: 'chevron left icon',
      nextIcon: 'chevron right icon',
      link: 'link',
      cell: 'link',
      disabledCell: 'disabled',
      weekCell: 'disabled',
      adjacentCell: 'adjacent',
      activeCell: 'active',
      rangeCell: 'range',
      focusCell: 'focus',
      todayCell: 'today',
      today: 'today link'
    },

    metadata: {
      date: 'date',
      focusDate: 'focusDate',
      startDate: 'startDate',
      endDate: 'endDate',
      minDate: 'minDate',
      maxDate: 'maxDate',
      mode: 'mode',
      monthOffset: 'monthOffset',
      message: 'message',
      class: 'class'
    },

    eventClass: 'blue'
  }
})(jQuery, window, document)
