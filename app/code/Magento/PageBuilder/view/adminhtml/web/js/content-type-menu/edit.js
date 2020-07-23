/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "underscore"], function (_events, _underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Edit =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * @param {ContentTypeInterface} instance
     * @param {DataStore} dataStore
     */
    function Edit(instance, dataStore) {
      var _this = this;

      this.instance = instance;
      this.dataStore = dataStore;

      _events.on("form:" + this.instance.id + ":saveAfter", function (data) {
        _this.dataStore.setState(_this.filterData(data));
      });
    }
    /**
     * Open the modal
     */


    var _proto = Edit.prototype;

    _proto.open = function open() {
      var contentTypeData = this.dataStore.getState();

      _events.trigger("form:renderAfter", {
        data: contentTypeData,
        appearances: this.instance.config.appearances,
        defaultNamespace: this.instance.config.form,
        id: this.instance.id,
        namespace: this.getFormNamespace(contentTypeData),
        title: this.instance.config.label
      });
    }
    /**
     * Flip flop to JSON and back again to ensure all data received from the form is serializable. Magento by default
     * adds functions into some basic types which cannot be serialized when calling PostMessage.
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    ;

    _proto.filterData = function filterData(data) {
      return JSON.parse(JSON.stringify(data));
    }
    /**
     * Determine the form namespace based on the currently set appearance
     *
     * @param {DataObject} contentTypeData
     * @returns {string}
     */
    ;

    _proto.getFormNamespace = function getFormNamespace(contentTypeData) {
      var appearance = this.dataStore.get("appearance");
      var formNamespace = this.instance.config.form; // Use the default form unless a custom one is defined

      if (!_underscore.isUndefined(this.instance.config.appearances[appearance].form)) {
        formNamespace = this.instance.config.appearances[appearance].form;
      }

      return formNamespace;
    };

    return Edit;
  }();

  return Edit;
});
//# sourceMappingURL=edit.js.map