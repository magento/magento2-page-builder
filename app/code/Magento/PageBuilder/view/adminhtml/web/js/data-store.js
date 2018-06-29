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
      this.previousState = {};
    }

    var _proto = DataStore.prototype;

    /**
     * Retrieve data from the state for an editable area
     *
     * @param {string} key
     * @returns {DataObject | string | number | boolean | any[] | null | undefined}
     */
    _proto.get = function get(key) {
      if (key) {
        return this.state[key];
      }

      return this.state;
    };
    /**
     * Update the state for the content type
     *
     * @param {DataObject | string | number | boolean | any[] | null | undefined} data
     * @param {string | number} key
     */


    _proto.update = function update(data, key) {
      this.previousState = Object.assign({}, this.state);

      if (key) {
        this.state[key] = data;
      } else {
        this.state = data;
      }

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
     * Subscribe to data changes within the data store of a content type
     *
     * @param {(state: DataObject, event: Event) => void} handler
     * @param {string | number} key
     */


    _proto.subscribe = function subscribe(handler, key) {
      var _this = this;

      this.events.on("state", function (event, data) {
        if (key) {
          if (_this.previousState[key] !== data.state[key]) {
            handler(data.state, event);
          }
        } else {
          if (_this.previousState !== data.state) {
            handler(data.state, event);
          }
        }
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
