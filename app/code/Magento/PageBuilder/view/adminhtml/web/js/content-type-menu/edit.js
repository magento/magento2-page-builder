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

      _events.trigger("contentType:editBefore", {
        contentType: this.instance
      });

      _events.trigger("form:renderAfter", {
        data: contentTypeData,
        appearances: this.instance.config.appearances,
        defaultNamespace: this.getDefaultNamespaceForm(),
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
      var viewport = this.instance.preview.viewport();
      var currentAppearance = this.dataStore.get("appearance");
      var appearance = this.instance.config.appearances[currentAppearance];
      var breakpoints = appearance.breakpoints;
      var formNamespace = this.getDefaultNamespaceForm(); // Use the default form unless a custom one is defined

      if (breakpoints && breakpoints[viewport] && breakpoints[viewport].form) {
        formNamespace = breakpoints[viewport].form;
      } else if (!_underscore.isUndefined(appearance.form)) {
        formNamespace = appearance.form;
      }

      return formNamespace;
    }
    /**
     * Determine the form default namespace based on the currently set appearance and breakpoint
     *
     * @returns {string}
     */
    ;

    _proto.getDefaultNamespaceForm = function getDefaultNamespaceForm() {
      var viewport = this.instance.preview.viewport();
      var breakpoints = this.instance.config.breakpoints;
      var formNamespace = this.instance.config.form;

      if (breakpoints && breakpoints[viewport] && breakpoints[viewport].form) {
        formNamespace = breakpoints[viewport].form;
      }

      return formNamespace;
    };

    return Edit;
  }();

  return Edit;
});
//# sourceMappingURL=edit.js.map