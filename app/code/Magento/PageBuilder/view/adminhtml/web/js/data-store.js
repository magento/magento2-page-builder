/*eslint-disable */
define(["jquery"], function (_jquery) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var DataStore =
  /*#__PURE__*/
  function () {
    function DataStore() {
      this.state = {};
      this.events = (0, _jquery)({});
    }

    var _proto = DataStore.prototype;

    /**
     * Retrieve data from the state for an editable area
     */
    _proto.get = function get() {
      return this.state;
    };
    /**
     * Update the state for an individual editable area
     *
     * @param data
     * @param key
     */


    _proto.update = function update(data, key) {
      var storeState = key ? this.state : data;

      if (key) {
        storeState[key] = data;
      }

      this.state = storeState;
      this.emitState();
    };
    /**
     * Remove item from DataStore
     *
     * @param {string | number} key
     */


    _proto.unset = function unset(key) {
      var storeState = this.state;
      delete storeState[key];
      this.update(storeState);
    };
    /**
     * Subscribe to data changes on an editable area
     *
     * @param {(state: DataObject, event: Event) => void} handler
     */


    _proto.subscribe = function subscribe(handler) {
      this.events.on("state", function (event, data) {
        handler(data.state, event);
      });
    };
    /**
     * Emit state updates through events
     */


    _proto.emitState = function emitState() {
      this.events.trigger("state", {
        state: this.state
      });
    };

    return DataStore;
  }();

  return DataStore;
});
//# sourceMappingURL=data-store.js.map
