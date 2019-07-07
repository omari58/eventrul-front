/*!
 * # Fomantic-UI - Slider
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function($, window, document, undefined) {
  'use strict'

  window =
    typeof window != 'undefined' && window.Math == Math
      ? window
      : typeof self != 'undefined' && self.Math == Math
      ? self
      : Function('return this')()

  $.fn.slider = function(parameters) {
    var $allModules = $(this);

    var moduleSelector = $allModules.selector || '';

    var time           = new Date().getTime();
    var performance    = [];

    var query          = arguments[0];
    var methodInvoked  = (typeof query == 'string');
    var queryArguments = [].slice.call(arguments, 1);

    var alphabet       = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    var SINGLE_STEP     = 1;
    var BIG_STEP        = 2;
    var NO_STEP         = 0;
    var SINGLE_BACKSTEP = -1;
    var BIG_BACKSTEP    = -2;

    // Used to manage document bound events.
    // Use this so that we can distinguish between which document events are bound to which range.
    var currentRange    = 0;

    var returnedValue

    $allModules.each(function() {
      let
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.slider.settings, parameters)
          : $.extend({}, $.fn.slider.settings);

        var className       = settings.className;
        var metadata        = settings.metadata;
        var namespace       = settings.namespace;
        var error           = settings.error;
        var keys            = settings.keys;
        var interpretLabel  = settings.interpretLabel;

        var isHover         = false;
        var eventNamespace  = '.' + namespace;
        var moduleNamespace = 'module-' + namespace;

        var $module         = $(this);
        var $currThumb;
        var $thumb;
        var $secondThumb;
        var $track;
        var $trackFill;
        var $labels;

        var element         = this;
        var instance        = $module.data(moduleNamespace);

        var documentEventID;

        var value;
        var position;
        var secondPos;
        var offset;
        var precision;
        var isTouch;

        var module

      module = {
        initialize: function() {
          module.debug('Initializing slider', settings)

          currentRange += 1
          documentEventID = currentRange

          isTouch = module.setup.testOutTouch()
          module.setup.layout()
          module.setup.labels()

          if (!module.is.disabled()) {
            module.bind.events()
          }

          module.read.metadata()
          module.read.settings()

          module.instantiate()
        },

        instantiate: function() {
          module.verbose('Storing instance of slider', module)
          instance = module
          $module.data(moduleNamespace, module)
        },

        destroy: function() {
          module.verbose('Destroying previous slider for', $module)
          clearInterval(instance.interval)
          module.unbind.events()
          module.unbind.slidingEvents()
          $module.removeData(moduleNamespace)
          instance = undefined
        },

        setup: {
          layout: function() {
            if ($module.attr('tabindex') === undefined) {
              $module.attr('tabindex', 0)
            }
            if ($module.find('.inner').length == 0) {
              $module.append(
                "<div class='inner'>" +
                  "<div class='track'></div>" +
                  "<div class='track-fill'></div>" +
                  "<div class='thumb'></div>" +
                  '</div>'
              )
            }
            precision = module.get.precision()
            $thumb = $module.find('.thumb:not(.second)')
            $currThumb = $thumb
            if (module.is.range()) {
              if ($module.find('.thumb.second').length == 0) {
                $module
                  .find('.inner')
                  .append("<div class='thumb second'></div>")
              }
              $secondThumb = $module.find('.thumb.second')
            }
            $track = $module.find('.track')
            $trackFill = $module.find('.track-fill')
            offset = $thumb.width() / 2
          },
          labels: function() {
            if (module.is.labeled()) {
              $labels = $module.find('.labels:not(.auto)')
              if ($labels.length != 0) {
                module.setup.customLabel()
              } else {
                module.setup.autoLabel()
              }

              if (settings.showLabelTicks) {
                $module.addClass(className.ticked)
              }
            }
          },
          testOutTouch: function() {
            try {
              document.createEvent('TouchEvent')
              return true
            } catch (e) {
              return false
            }
          },
          customLabel: function() {
            let
              $children   = $labels.find('.label');
              var numChildren = $children.length;
              var min         = module.get.min();
              var max         = module.get.max();
              var ratio
            $children.each(function(index) {
              let
                $child = $(this);
                var attrValue = $child.attr('data-value')
              if (attrValue) {
                attrValue =
                  attrValue > max ? max : attrValue < min ? min : attrValue
                ratio = (attrValue - min) / (max - min)
              } else {
                ratio = (index + 1) / (numChildren + 1)
              }
              module.update.labelPosition(ratio, $(this))
            })
          },
          autoLabel: function() {
            if (module.get.step() != 0) {
              $labels = $module.find('.labels')
              if ($labels.length != 0) {
                $labels.empty()
              } else {
                $labels = $module
                  .append('<ul class="auto labels"></ul>')
                  .find('.labels')
              }
              for (let i = 0, len = module.get.numLabels(); i <= len; i++) {
                let
                  labelText = module.get.label(i);
                  var $label = (labelText !== "") ? $('<li class="label">' + labelText + '</li>') : null;
                  var ratio = i / len
                if ($label) {
                  module.update.labelPosition(ratio, $label)
                  $labels.append($label)
                }
              }
            }
          }
        },

        bind: {
          events: function() {
            module.bind.globalKeyboardEvents()
            module.bind.keyboardEvents()
            module.bind.mouseEvents()
            if (module.is.touch()) {
              module.bind.touchEvents()
            }
          },
          keyboardEvents: function() {
            module.verbose('Binding keyboard events')
            $module.on('keydown' + eventNamespace, module.event.keydown)
          },
          globalKeyboardEvents: function() {
            $(document).on(
              'keydown' + eventNamespace + documentEventID,
              module.event.activateFocus
            )
          },
          mouseEvents: function() {
            module.verbose('Binding mouse events')
            $module
              .find('.track, .thumb, .inner')
              .on('mousedown' + eventNamespace, function(event) {
                event.stopImmediatePropagation()
                event.preventDefault()
                module.event.down(event)
              })
            $module.on('mousedown' + eventNamespace, module.event.down)
            $module.on('mouseenter' + eventNamespace, function(event) {
              isHover = true
            })
            $module.on('mouseleave' + eventNamespace, function(event) {
              isHover = false
            })
          },
          touchEvents: function() {
            module.verbose('Binding touch events')
            $module
              .find('.track, .thumb, .inner')
              .on('touchstart' + eventNamespace, function(event) {
                event.stopImmediatePropagation()
                event.preventDefault()
                module.event.down(event)
              })
            $module.on('touchstart' + eventNamespace, module.event.down)
          },
          slidingEvents: function() {
            // these don't need the identifier because we only ever want one of them to be registered with document
            module.verbose(
              'Binding page wide events while handle is being draged'
            )
            if (module.is.touch()) {
              $(document).on('touchmove' + eventNamespace, module.event.move)
              $(document).on('touchend' + eventNamespace, module.event.up)
            } else {
              $(document).on('mousemove' + eventNamespace, module.event.move)
              $(document).on('mouseup' + eventNamespace, module.event.up)
            }
          }
        },

        unbind: {
          events: function() {
            $module
              .find('.track, .thumb, .inner')
              .off('mousedown' + eventNamespace)
            $module
              .find('.track, .thumb, .inner')
              .off('touchstart' + eventNamespace)
            $module.off('mousedown' + eventNamespace)
            $module.off('mouseenter' + eventNamespace)
            $module.off('mouseleave' + eventNamespace)
            $module.off('touchstart' + eventNamespace)
            $module.off('keydown' + eventNamespace)
            $module.off('focusout' + eventNamespace)
            $(document).off(
              'keydown' + eventNamespace + documentEventID,
              module.event.activateFocus
            )
          },
          slidingEvents: function() {
            if (module.is.touch()) {
              $(document).off('touchmove' + eventNamespace)
              $(document).off('touchend' + eventNamespace)
            } else {
              $(document).off('mousemove' + eventNamespace)
              $(document).off('mouseup' + eventNamespace)
            }
          }
        },

        event: {
          down: function(event, originalEvent) {
            event.preventDefault()
            if (module.is.range()) {
              let
                eventPos = module.determine.eventPos(event, originalEvent);
                var newPos = module.determine.pos(eventPos)
              $currThumb = module.determine.closestThumb(newPos)
            }
            if (!module.is.disabled()) {
              module.bind.slidingEvents()
            }
          },
          move: function(event, originalEvent) {
            event.preventDefault()
            let value = module.determine.valueFromEvent(event, originalEvent)
            if (module.get.step() == 0 || module.is.smooth()) {
              let
                thumbVal = module.thumbVal;
                var secondThumbVal = module.secondThumbVal;
                var thumbSmoothVal = module.determine.smoothValueFromEvent(
                  event,
                  originalEvent
                )
              if (!$currThumb.hasClass('second')) {
                thumbVal = value
              } else {
                secondThumbVal = value
              }
              value = Math.abs(thumbVal - (secondThumbVal || 0))
              module.update.position(thumbSmoothVal)
              settings.onMove.call(element, value, thumbVal, secondThumbVal)
            } else {
              module.update.value(value, function(
                value,
                thumbVal,
                secondThumbVal
              ) {
                settings.onMove.call(element, value, thumbVal, secondThumbVal)
              })
            }
          },
          up: function(event, originalEvent) {
            event.preventDefault()
            let value = module.determine.valueFromEvent(event, originalEvent)
            module.set.value(value)
            module.unbind.slidingEvents()
          },
          keydown: function(event, first) {
            if (module.is.focused()) {
              $(document).trigger(event)
            }
            if (first || module.is.focused()) {
              let step = module.determine.keyMovement(event)
              if (step != NO_STEP) {
                event.preventDefault()
                switch (step) {
                  case SINGLE_STEP:
                    module.takeStep()
                    break
                  case BIG_STEP:
                    module.takeStep(module.get.multiplier())
                    break
                  case SINGLE_BACKSTEP:
                    module.backStep()
                    break
                  case BIG_BACKSTEP:
                    module.backStep(module.get.multiplier())
                    break
                }
              }
            }
          },
          activateFocus: function(event) {
            if (
              !module.is.focused() &&
              module.is.hover() &&
              module.determine.keyMovement(event) != NO_STEP
            ) {
              event.preventDefault()
              module.event.keydown(event, true)
              $module.focus()
            }
          }
        },

        resync: function() {
          module.verbose('Resyncing thumb position based on value')
          if (module.is.range()) {
            module.update.position(module.secondThumbVal, $secondThumb)
          }
          module.update.position(module.thumbVal, $thumb)
          module.setup.labels()
        },
        takeStep: function(multiplier) {
          var multiplier = multiplier != undefined ? multiplier : 1;
            var step = module.get.step();
            var currValue = module.get.currentThumbValue()
          module.verbose('Taking a step')
          if (step > 0) {
            module.set.value(currValue + step * multiplier)
          } else if (step == 0) {
            let
              precision = module.get.precision();
              var newValue = currValue + multiplier / precision
            module.set.value(Math.round(newValue * precision) / precision)
          }
        },

        backStep: function(multiplier) {
          var multiplier = multiplier != undefined ? multiplier : 1;
            var step = module.get.step();
            var currValue = module.get.currentThumbValue()
          module.verbose('Going back a step')
          if (step > 0) {
            module.set.value(currValue - step * multiplier)
          } else if (step == 0) {
            let
              precision = module.get.precision();
              var newValue = currValue - multiplier / precision
            module.set.value(Math.round(newValue * precision) / precision)
          }
        },

        is: {
          range: function() {
            return $module.hasClass(settings.className.range)
          },
          hover: function() {
            return isHover
          },
          focused: function() {
            return $module.is(':focus')
          },
          disabled: function() {
            return $module.hasClass(settings.className.disabled)
          },
          labeled: function() {
            return $module.hasClass(settings.className.labeled)
          },
          reversed: function() {
            return $module.hasClass(settings.className.reversed)
          },
          vertical: function() {
            return $module.hasClass(settings.className.vertical)
          },
          smooth: function() {
            return (
              settings.smooth || $module.hasClass(settings.className.smooth)
            )
          },
          touch: function() {
            return isTouch
          }
        },

        get: {
          trackOffset: function() {
            if (module.is.vertical()) {
              return $track.offset().top
            } else {
              return $track.offset().left
            }
          },
          trackLength: function() {
            if (module.is.vertical()) {
              return $track.height()
            } else {
              return $track.width()
            }
          },
          trackLeft: function() {
            if (module.is.vertical()) {
              return $track.position().top
            } else {
              return $track.position().left
            }
          },
          trackStartPos: function() {
            return module.is.reversed()
              ? module.get.trackLeft() + module.get.trackLength()
              : module.get.trackLeft()
          },
          trackEndPos: function() {
            return module.is.reversed()
              ? module.get.trackLeft()
              : module.get.trackLeft() + module.get.trackLength()
          },
          trackStartMargin: function() {
            let margin
            if (module.is.vertical()) {
              margin = module.is.reversed()
                ? $module.css('padding-bottom')
                : $module.css('padding-top')
            } else {
              margin = module.is.reversed()
                ? $module.css('padding-right')
                : $module.css('padding-left')
            }
            return margin || '0px'
          },
          trackEndMargin: function() {
            let margin
            if (module.is.vertical()) {
              margin = module.is.reversed()
                ? $module.css('padding-top')
                : $module.css('padding-bottom')
            } else {
              margin = module.is.reversed()
                ? $module.css('padding-left')
                : $module.css('padding-right')
            }
            return margin || '0px'
          },
          precision: function() {
            let
              decimalPlaces;
              var step = module.get.step()
            if (step != 0) {
              let split = String(step).split('.')
              if (split.length == 2) {
                decimalPlaces = split[1].length
              } else {
                decimalPlaces = 0
              }
            } else {
              decimalPlaces = settings.decimalPlaces
            }
            let precision = Math.pow(10, decimalPlaces)
            module.debug('Precision determined', precision)
            return precision
          },
          min: function() {
            return settings.min
          },
          max: function() {
            return settings.max
          },
          step: function() {
            return settings.step
          },
          numLabels: function() {
            let value = Math.round(
              (module.get.max() - module.get.min()) / module.get.step()
            )
            module.debug('Determined that their should be ' + value + ' labels')
            return value
          },
          labelType: function() {
            return settings.labelType
          },
          label: function(value) {
            if (interpretLabel) {
              return interpretLabel(value)
            }

            switch (settings.labelType) {
              case settings.labelTypes.number:
                return value * module.get.step() + module.get.min()
              case settings.labelTypes.letter:
                return alphabet[value % 26]
              default:
                return value
            }
          },
          value: function() {
            return value
          },
          currentThumbValue: function() {
            return $currThumb.hasClass('second')
              ? module.secondThumbVal
              : module.thumbVal
          },
          thumbValue: function(which) {
            switch (which) {
              case 'second':
                if (module.is.range()) {
                  return module.secondThumbVal
                } else {
                  module.error(error.notrange)
                  break
                }
              case 'first':
              default:
                return module.thumbVal
            }
          },
          multiplier: function() {
            return settings.pageMultiplier
          },
          thumbPosition: function(which) {
            switch (which) {
              case 'second':
                if (module.is.range()) {
                  return secondPos
                } else {
                  module.error(error.notrange)
                  break
                }
              case 'first':
              default:
                return position
            }
          }
        },

        determine: {
          pos: function(pagePos) {
            return module.is.reversed()
              ? module.get.trackStartPos() - pagePos + module.get.trackOffset()
              : pagePos - module.get.trackOffset() - module.get.trackStartPos()
          },
          closestThumb: function(eventPos) {
            let
              thumbPos = parseFloat(module.determine.thumbPos($thumb));
              var thumbDelta = Math.abs(eventPos - thumbPos);
              var secondThumbPos = parseFloat(module.determine.thumbPos($secondThumb));
              var secondThumbDelta = Math.abs(eventPos - secondThumbPos)
            return thumbDelta <= secondThumbDelta ? $thumb : $secondThumb
          },
          closestThumbPos: function(eventPos) {
            let
              thumbPos = parseFloat(module.determine.thumbPos($thumb));
              var thumbDelta = Math.abs(eventPos - thumbPos);
              var secondThumbPos = parseFloat(module.determine.thumbPos($secondThumb));
              var secondThumbDelta = Math.abs(eventPos - secondThumbPos)
            return thumbDelta <= secondThumbDelta ? thumbPos : secondThumbPos
          },
          thumbPos: function($element) {
            let pos = module.is.vertical()
              ? module.is.reversed()
                ? $element.css('bottom')
                : $element.css('top')
              : module.is.reversed()
              ? $element.css('right')
              : $element.css('left')
            return pos
          },
          positionFromValue: function(value) {
            var min = module.get.min();
              var max = module.get.max();
              var value = value > max ? max : value < min ? min : value;
              var trackLength = module.get.trackLength();
              var ratio = (value - min) / (max - min);
              var position = Math.round(ratio * trackLength)
            module.verbose(
              'Determined position: ' + position + ' from value: ' + value
            )
            return position
          },
          positionFromRatio: function(ratio) {
            let
              trackLength = module.get.trackLength();
              var step = module.get.step();
              var position = Math.round(ratio * trackLength);
              var adjustedPos =
                step == 0 ? position : Math.round(position / step) * step
            return adjustedPos
          },
          valueFromEvent: function(event, originalEvent) {
            let
              eventPos = module.determine.eventPos(event, originalEvent);
              var newPos = module.determine.pos(eventPos);
              var value
            if (eventPos < module.get.trackOffset()) {
              value = module.is.reversed() ? module.get.max() : module.get.min()
            } else if (
              eventPos >
              module.get.trackOffset() + module.get.trackLength()
            ) {
              value = module.is.reversed() ? module.get.min() : module.get.max()
            } else {
              value = module.determine.value(newPos)
            }
            return value
          },
          smoothValueFromEvent: function(event, originalEvent) {
            let
              min = module.get.min();
              var max = module.get.max();
              var trackLength = module.get.trackLength();
              var eventPos = module.determine.eventPos(event, originalEvent);
              var newPos = eventPos - module.get.trackOffset();
              var ratio;
              var value
            newPos =
              newPos < 0 ? 0 : newPos > trackLength ? trackLength : newPos
            ratio = newPos / trackLength
            if (module.is.reversed()) {
              ratio = 1 - ratio
            }
            value = ratio * (max - min) + min
            return value
          },
          eventPos: function(event, originalEvent) {
            if (module.is.touch()) {
              let
                  event.changedTouches[0].pageY || event.touches[0].pageY;
                var touchX = event.changedTouches[0].pageX || event.touches[0].pageX
              return module.is.vertical() ? touchY : touchX
            }
            let
              clickY = event.pageY || originalEvent.pageY;
              var clickX = event.pageX || originalEvent.pageX
            return module.is.vertical() ? clickY : clickX
          },
          value: function(position) {
            let
              startPos = module.is.reversed() ? module.get.trackEndPos() : module.get.trackStartPos();
              var endPos = module.is.reversed() ? module.get.trackStartPos() : module.get.trackEndPos();
              var ratio = (position - startPos) / (endPos - startPos);
              var range = module.get.max() - module.get.min();
              var step = module.get.step();
              var value = (ratio * range);
              var difference = step == 0 ? value : Math.round(value / step) * step
            module.verbose(
              'Determined value based upon position: ' +
                position +
                ' as: ' +
                value
            )
            if (value != difference) {
              module.verbose('Rounding value to closest step: ' + difference)
            }
            // Use precision to avoid ugly Javascript floating point rounding issues
            // (like 35 * .01 = 0.35000000000000003)
            difference = Math.round(difference * precision) / precision
            module.verbose('Cutting off additional decimal places')
            return difference + module.get.min()
          },
          keyMovement: function(event) {
            let
              key = event.which;
              var downArrow =
                module.is.vertical()
                ?
                module.is.reversed() ? keys.downArrow : keys.upArrow
                :
                keys.downArrow
              ;
              var upArrow =
                module.is.vertical()
                ?
                module.is.reversed() ? keys.upArrow : keys.downArrow
                :
                keys.upArrow
              ;
              var leftArrow =
                !module.is.vertical()
                ?
                module.is.reversed() ? keys.rightArrow : keys.leftArrow
                :
                keys.leftArrow
              ;
              var rightArrow = !module.is.vertical()
                ? module.is.reversed()
                  ? keys.leftArrow
                  : keys.rightArrow
                : keys.rightArrow
            if (key == downArrow || key == leftArrow) {
              return SINGLE_BACKSTEP
            } else if (key == upArrow || key == rightArrow) {
              return SINGLE_STEP
            } else if (key == keys.pageDown) {
              return BIG_BACKSTEP
            } else if (key == keys.pageUp) {
              return BIG_STEP
            } else {
              return NO_STEP
            }
          }
        },

        handleNewValuePosition: function(val) {
          let
            min = module.get.min();
            var max = module.get.max();
            var newPos
          if (val <= min) {
            val = min
          } else if (val >= max) {
            val = max
          }
          newPos = module.determine.positionFromValue(val)
          return newPos
        },

        set: {
          value: function(newValue) {
            module.update.value(newValue, function(
              value,
              thumbVal,
              secondThumbVal
            ) {
              settings.onChange.call(element, value, thumbVal, secondThumbVal)
              settings.onMove.call(element, value, thumbVal, secondThumbVal)
            })
          },
          rangeValue: function(first, second) {
            if (module.is.range()) {
              let
                min = module.get.min();
                var max = module.get.max()
              if (first <= min) {
                first = min
              } else if (first >= max) {
                first = max
              }
              if (second <= min) {
                second = min
              } else if (second >= max) {
                second = max
              }
              module.thumbVal = first
              module.secondThumbVal = second
              value = Math.abs(module.thumbVal - module.secondThumbVal)
              module.update.position(module.thumbVal, $thumb)
              module.update.position(module.secondThumbVal, $secondThumb)
              settings.onChange.call(
                element,
                value,
                module.thumbVal,
                module.secondThumbVal
              )
              settings.onMove.call(
                element,
                value,
                module.thumbVal,
                module.secondThumbVal
              )
            } else {
              module.error(error.notrange)
            }
          },
          position: function(position, which) {
            let thumbVal = module.determine.value(position)
            switch (which) {
              case 'second':
                module.secondThumbVal = thumbVal
                module.update.position(thumbVal, $secondThumb)
                break
              default:
                module.thumbVal = thumbVal
                module.update.position(thumbVal, $thumb)
            }
            value = Math.abs(module.thumbVal - (module.secondThumbVal || 0))
            module.set.value(value)
          }
        },

        update: {
          value: function(newValue, callback) {
            let
              min = module.get.min();
              var max = module.get.max()
            if (newValue <= min) {
              newValue = min
            } else if (newValue >= max) {
              newValue = max
            }
            if (!module.is.range()) {
              value = newValue
              module.thumbVal = value
            } else {
              if (!$currThumb.hasClass('second')) {
                module.thumbVal = newValue
              } else {
                module.secondThumbVal = newValue
              }
              value = Math.abs(module.thumbVal - module.secondThumbVal)
            }
            module.update.position(newValue)
            module.debug('Setting slider value to ' + value)
            if (typeof callback === 'function') {
              callback(value, module.thumbVal, module.secondThumbVal)
            }
          },
          position: function(newValue, $element) {
            let
              newPos = module.handleNewValuePosition(newValue);
              var $targetThumb = $element != undefined ? $element : $currThumb;
              var thumbVal = module.thumbVal || module.get.min();
              var secondThumbVal = module.secondThumbVal || module.get.min()
            if (module.is.range()) {
              if (!$targetThumb.hasClass('second')) {
                position = newPos
                thumbVal = newValue
              } else {
                secondPos = newPos
                secondThumbVal = newValue
              }
            } else {
              position = newPos
              thumbVal = newValue
            }
            let
              trackPosValue;
              var thumbPosValue;
              var min = module.get.min();
              var max = module.get.max();
              var thumbPosPercent = 100 * (newValue - min) / (max - min);
              var trackStartPosPercent = 100 * (Math.min(thumbVal, secondThumbVal) - min) / (max - min);
              var trackEndPosPercent =
                100 *
                (1 - (Math.max(thumbVal, secondThumbVal) - min) / (max - min))
            if (module.is.vertical()) {
              if (module.is.reversed()) {
                thumbPosValue = {
                  bottom: 'calc(' + thumbPosPercent + '% - ' + offset + 'px)',
                  top: 'auto'
                }
                trackPosValue = {
                  bottom: trackStartPosPercent + '%',
                  top: trackEndPosPercent + '%'
                }
              } else {
                thumbPosValue = {
                  top: 'calc(' + thumbPosPercent + '% - ' + offset + 'px)',
                  bottom: 'auto'
                }
                trackPosValue = {
                  top: trackStartPosPercent + '%',
                  bottom: trackEndPosPercent + '%'
                }
              }
            } else if (module.is.reversed()) {
                thumbPosValue = {right: 'calc(' + thumbPosPercent + '% - ' + offset + 'px)', left: 'auto'};
                trackPosValue = {right: trackStartPosPercent + '%', left: trackEndPosPercent + '%'};
              }
              else {
                thumbPosValue = {left: 'calc(' + thumbPosPercent + '% - ' + offset + 'px)', right: 'auto'};
                trackPosValue = {left: trackStartPosPercent + '%', right: trackEndPosPercent + '%'};
              }
            $targetThumb.css(thumbPosValue)
            $trackFill.css(trackPosValue)
            module.debug('Setting slider position to ' + newPos)
          },
          labelPosition: function(ratio, $label) {
            let
              startMargin = module.get.trackStartMargin();
              var endMargin   = module.get.trackEndMargin();
              var posDir =
                module.is.vertical()
                ?
                module.is.reversed() ? 'bottom' : 'top'
                :
                  module.is.reversed() ? 'right' : 'left';
              var startMarginMod =
                module.is.reversed() && !module.is.vertical() ? ' - ' : ' + '
            var position =
              '(100% - ' + startMargin + ' - ' + endMargin + ') * ' + ratio
            $label.css(
              posDir,
              'calc(' + position + startMarginMod + startMargin + ')'
            )
          }
        },

        goto: {
          max: function() {
            module.set.value(module.get.max())
          },
          min: function() {
            module.set.value(module.get.min())
          }
        },

        read: {
          metadata: function() {
            let
              data = {
              thumbVal: $module.data(metadata.thumbVal),
              secondThumbVal: $module.data(metadata.secondThumbVal)
            }
            if (data.thumbVal) {
              if (module.is.range() && data.secondThumbVal) {
                module.debug(
                  'Current value set from metadata',
                  data.thumbVal,
                  data.secondThumbVal
                )
                module.set.rangeValue(data.thumbVal, data.secondThumbVal)
              } else {
                module.debug('Current value set from metadata', data.thumbVal)
                module.set.value(data.thumbVal)
              }
            }
          },
          settings: function() {
            if (settings.start !== false) {
              if (module.is.range()) {
                module.debug(
                  'Start position set from settings',
                  settings.start,
                  settings.end
                )
                module.set.rangeValue(settings.start, settings.end)
              } else {
                module.debug('Start position set from settings', settings.start)
                module.set.value(settings.start)
              }
            }
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
            let
              currentTime,
              executionTime,
              previousTime
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
            let
              title = settings.name + ':';
              var totalTime = 0
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
                  console.log(
                    data['Name'] + ': ' + data['Execution Time'] + 'ms'
                  )
                })
              }
              console.groupEnd()
            }
            performance = []
          }
        },

        invoke: function(query, passedArguments, context) {
          let
            object = instance;
            var maxDepth;
            var found;
            var response
          passedArguments = passedArguments || queryArguments
          context = element || context
          if (typeof query === 'string' && object !== undefined) {
            query = query.split(/[\. ]/)
            maxDepth = query.length - 1
            $.each(query, function(depth, value) {
              let camelCaseValue =
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
          if ($.isArray(returnedValue)) {
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

  $.fn.slider.settings = {
    silent: false,
    debug: false,
    verbose: false,
    performance: true,

    name: 'Slider',
    namespace: 'slider',

    error: {
      method: 'The method you called is not defined.',
      notrange: 'This slider is not a range slider'
    },

    metadata: {
      thumbVal: 'thumbVal',
      secondThumbVal: 'secondThumbVal'
    },

    min: 0,
    max: 20,
    step: 1,
    start: 0,
    end: 20,
    labelType: 'number',
    showLabelTicks: false,
    smooth: false,

    // the decimal place to round to if step is undefined
    decimalPlaces: 2,

    // page up/down multiplier. How many more times the steps to take on page up/down press
    pageMultiplier: 2,

    selector: {},

    className: {
      reversed: 'reversed',
      disabled: 'disabled',
      labeled: 'labeled',
      ticked: 'ticked',
      vertical: 'vertical',
      range: 'range',
      smooth: 'smooth'
    },

    keys: {
      pageUp: 33,
      pageDown: 34,
      leftArrow: 37,
      upArrow: 38,
      rightArrow: 39,
      downArrow: 40
    },

    labelTypes: {
      number: 'number',
      letter: 'letter'
    },

    onChange: function(value, thumbVal, secondThumbVal) {},
    onMove: function(value, thumbVal, secondThumbVal) {}
  }
})(jQuery, window, document)
