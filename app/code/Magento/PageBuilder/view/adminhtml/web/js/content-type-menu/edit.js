/*eslint-disable */
define(["uiEvents"], function (_uiEvents) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Edit =
  /*#__PURE__*/
  function () {
    /**
     * @param {ContentTypeInterface} instance
     * @param {DataStore} store
     */
    function Edit(instance, store) {
      var _this = this;

      this.instance = void 0;
      this.store = void 0;
      this.instance = instance;
      this.store = store;

      _uiEvents.on("form:save:" + this.instance.id, function (data) {
        _this.store.update(_this.instance.id, data);
      });
    }
    /**
     * Open the modal
     */


    var _proto = Edit.prototype;

    _proto.open = function open() {
      var contentTypeData = this.store.get(this.instance.id);
      var formNamespace = this.instance.config.form; // Use the default form unless a custom one is defined

      if (undefined !== this.instance.config.appearances[contentTypeData.appearance].form) {
        formNamespace = this.instance.config.appearances[contentTypeData.appearance].form;
      }

      _uiEvents.trigger("form:render", {
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
