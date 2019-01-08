/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/utils/object-get"], function (_jquery, _objectGet) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var DataStore =
  /*#__PURE__*/
  function () {
    "use strict";

    function DataStore() {
      this.state = {};
      this.events = (0, _jquery)({});
      this.previousState = {};
    }

    var _proto = DataStore.prototype;

    /**
     * Retrieve specific data from the data store
     *
     * @param {string} key
     * @param defaultValue
     * @returns {T}
     */
    _proto.get = function get(key, defaultValue) {
      return (0, _objectGet)(this.state, key, defaultValue);
    };
    /**
     * Retrieve the entire state of the data object
     *
     * @returns {DataObject}
     */


    _proto.getState = function getState() {
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
