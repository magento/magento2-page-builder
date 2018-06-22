/*eslint-disable */
define(["uiEvents"], function (_uiEvents) {
  var _this = void 0,
      _arguments = arguments;

  var _default = {
    /**
     * Calls callback when name event is triggered
     *
     * @param {string} events
     * @param {Function} callback
     * @param {Function} ns
     * @return {object}
     */
    on: function on(events, callback, ns) {
      _uiEvents.on(events, callback, ns);

      return _this;
    },

    /**
     * Removed callback from listening to target event
     *
     * @param {string} ns
     * @return {object}
     */
    off: function off(ns) {
      _uiEvents.off(ns);

      return _this;
    },

    /**
     * Triggers event and executes all attached callbacks
     *
     * @param {string} name
     * @param {any} arguments
     * @returns {boolean}
     */
    trigger: function trigger(name, arguments) {
      return _uiEvents.trigger(name, _arguments);
    }
  };
  return _default;
});
//# sourceMappingURL=events.js.map
