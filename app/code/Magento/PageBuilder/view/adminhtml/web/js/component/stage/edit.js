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
     * Initiate the edit class with an instance of structural
     *
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
      _uiEvents.trigger("form:render", {
        data: this.store.get(this.instance.id),
        id: this.instance.id,
        namespace: this.instance.config.form,
        title: this.instance.config.label
      });
    };

    return Edit;
  }();

  return Edit;
});
//# sourceMappingURL=edit.js.map
