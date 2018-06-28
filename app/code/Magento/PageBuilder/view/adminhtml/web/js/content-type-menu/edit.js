/*eslint-disable */
define(["Magento_PageBuilder/js/events"], function (_events) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Edit =
  /*#__PURE__*/
  function () {
    /**
     * @param {ContentTypeInterface} instance
     * @param {DataStore} dataStore
     */
    function Edit(instance, dataStore) {
      var _this = this;

      this.instance = void 0;
      this.dataStore = void 0;
      this.instance = instance;
      this.dataStore = dataStore;

      _events.on("form:" + this.instance.id + ":save", function (data) {
        _this.dataStore.update(data);
      });
    }
    /**
     * Open the modal
     */


    var _proto = Edit.prototype;

    _proto.open = function open() {
      var contentTypeData = this.dataStore.get();
      var formNamespace = this.instance.config.form; // Use the default form unless a custom one is defined

      if (undefined !== this.instance.config.appearances[contentTypeData.appearance].form) {
        formNamespace = this.instance.config.appearances[contentTypeData.appearance].form;
      }

      _events.trigger("form:render", {
        data: contentTypeData,
        appearances: this.instance.config.appearances,
        defaultNamespace: this.instance.config.form,
        id: this.instance.id,
        namespace: formNamespace,
        title: this.instance.config.label
      });
    };

    return Edit;
  }();

  return Edit;
});
//# sourceMappingURL=edit.js.map
