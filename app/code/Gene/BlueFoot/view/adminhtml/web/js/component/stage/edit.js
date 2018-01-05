/*eslint-disable */
define(["uiRegistry", "mage/translate", "./edit/persistence-client"], function (_uiRegistry, _translate, _persistenceClient) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';

  var Edit =
  /*#__PURE__*/
  function () {
    /**
     * Initiate the edit class with an instance of structural
     *
     * @param {Structural} instance
     * @param {DataStore} store
     */
    function Edit(instance, store) {
      this.modal = _uiRegistry.get('bluefoot_modal_form.bluefoot_modal_form.modal');
      this.insertForm = _uiRegistry.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
      this.instance = void 0;
      this.store = void 0;
      this.instance = instance;
      this.store = store;
    }
    /**
     * Open the modal
     */


    var _proto = Edit.prototype;

    _proto.open = function open() {
      this.destroyInserted();
      this.setTitle();
      this.render();
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
     * Set the title on the modal
     */


    _proto.setTitle = function setTitle() {
      this.modal.setTitle((0, _translate)('Edit ' + this.instance.config.label));
    };
    /**
     * Set the data provider client to be the current instance
     */


    _proto.setDataProviderClient = function setDataProviderClient() {
      var _this = this;

      var formName = this.instance.config.form; // Destroy the last data provider so a new instance is created

      if (_uiRegistry.get('_pagebuilder_last_provider')) {
        _uiRegistry.remove(_uiRegistry.get('_pagebuilder_last_provider'));
      } // Set the current edited instances data into the registry


      _uiRegistry.set('_pagebuilder_edit_data', this.store.get(this.instance.id)); // Retrieve the component


      _uiRegistry.get(formName + '.' + formName, function (component) {
        var provider = _uiRegistry.get(component.provider);

        _uiRegistry.set('_pagebuilder_last_provider', component.provider); // Set the data provider client to our persistence client


        provider.client = new _persistenceClient(_this.modal, _this.store, _this.instance.id);
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
      var existingComponent = this.getFormComponentInstance();

      if (existingComponent) {
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
