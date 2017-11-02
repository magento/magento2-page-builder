define(["uiRegistry", "mage/translate"], function (_uiRegistry, _translate) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Edit =
  /*#__PURE__*/
  function () {
    /**
     * Initiate the edit class with an instance of structural
     *
     * @param {Structural} instance
     */
    function Edit(instance, store) {
      this.modal = _uiRegistry.get('bluefoot_modal_form.bluefoot_modal_form.modal');
      this.insertForm = _uiRegistry.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
      this.instance = instance;
      this.store = store;
    }
    /**
     * Open and render the edit component
     */


    var _proto = Edit.prototype;

    _proto.openAndRender = function openAndRender() {
      this.destroyInserted();
      this.setTitle();
      this.render();
      this.open();
    };
    /**
     * Open the modal
     */


    _proto.open = function open() {
      this.modal.openModal();
    };
    /**
     * Retrieve the content types form component text from the registry
     *
     * @returns {string}
     */


    _proto.getFormComponent = function getFormComponent() {
      return _uiRegistry.get('component_' + this.instance.config.form);
    };
    /**
     * Render the form
     */


    _proto.render = function render() {
      // Pass the UI component to the render function
      this.insertForm.onRender(this.getFormComponent());
      this.setDataProviderClient();
    };
    /**
     * Save any data which has been modified in the edit panel
     *
     * @param data
     * @param options
     */


    _proto.save = function save(data, options) {
      this.store.update(this.instance.id, data);
      this.modal.closeModal();
    };
    /**
     * Set the title on the modal
     */


    _proto.setTitle = function setTitle() {
      this.modal.setTitle((0, _translate)('Edit ' + (this.instance.config.label || (0, _translate)('Block'))));
    };
    /**
     * Set the data provider client to be the current instance
     */


    _proto.setDataProviderClient = function setDataProviderClient() {
      var _this = this;

      var formName = this.instance.config.form; // Retrieve the component

      _uiRegistry.get(formName + '.' + formName, function (component) {
        var provider = _uiRegistry.get(component.provider); // Set the instance to act as it's client in the data provider


        provider.client = _this; // Set the data on the provider from the data store

        provider.set('data', _this.store.get(_this.instance.id));
      });
    };
    /**
     * Retrieve the form component
     *
     * @returns {any}
     */


    _proto.getFormComponentInstance = function getFormComponentInstance() {
      var formName = this.instance.config.form;
      return _uiRegistry.get(formName + '.' + formName);
    };
    /**
     * Destroy the inserted component
     */


    _proto.destroyInserted = function destroyInserted() {
      var existingComponent;

      if (existingComponent = this.getFormComponentInstance()) {
        existingComponent.destroy();
      } // Reset the insert form component


      this.insertForm.destroyInserted();
      this.insertForm.removeActions();
    };

    return Edit;
  }();

  return Edit;
});
//# sourceMappingURL=edit.js.map
