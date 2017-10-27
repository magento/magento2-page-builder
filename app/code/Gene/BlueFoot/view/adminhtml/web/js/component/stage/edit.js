define(["uiRegistry", "mage/translate"], function (_uiRegistry, _translate) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Edit Class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
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
      _classCallCheck(this, Edit);

      this.modal = _uiRegistry.get('bluefoot_modal_form.bluefoot_modal_form.modal');
      this.insertForm = _uiRegistry.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
      this.instance = instance;
      this.store = store;
    }
    /**
     * Open and render the edit component
     */


    _createClass(Edit, [{
      key: "openAndRender",
      value: function openAndRender() {
        this.destroyInserted();
        this.setTitle();
        this.render();
        this.open();
      }
      /**
       * Open the modal
       */

    }, {
      key: "open",
      value: function open() {
        this.modal.openModal();
      }
      /**
       * Retrieve the content types form component text from the registry
       *
       * @returns {string}
       */

    }, {
      key: "getFormComponent",
      value: function getFormComponent() {
        return _uiRegistry.get('component_' + this.instance.config.form);
      }
      /**
       * Render the form
       */

    }, {
      key: "render",
      value: function render() {
        // Pass the UI component to the render function
        this.insertForm.onRender(this.getFormComponent());
        this.setDataProviderClient();
      }
      /**
       * Save any data which has been modified in the edit panel
       *
       * @param data
       * @param options
       */

    }, {
      key: "save",
      value: function save(data, options) {
        this.store.update(this.instance.id, data);
        this.modal.closeModal();
      }
      /**
       * Set the title on the modal
       */

    }, {
      key: "setTitle",
      value: function setTitle() {
        this.modal.setTitle((0, _translate)('Edit ' + (this.instance.config.label || (0, _translate)('Block'))));
      }
      /**
       * Set the data provider client to be the current instance
       */

    }, {
      key: "setDataProviderClient",
      value: function setDataProviderClient() {
        var _this = this;

        var formName = this.instance.config.form; // Retrieve the component

        _uiRegistry.get(formName + '.' + formName, function (component) {
          var provider = _uiRegistry.get(component.provider); // Set the instance to act as it's client in the data provider


          provider.client = _this; // Set the data on the provider from the data store

          provider.set('data', _this.store.get(_this.instance.id));
        });
      }
      /**
       * Retrieve the form component
       *
       * @returns {any}
       */

    }, {
      key: "getFormComponentInstance",
      value: function getFormComponentInstance() {
        var formName = this.instance.config.form;
        return _uiRegistry.get(formName + '.' + formName);
      }
      /**
       * Destroy the inserted component
       */

    }, {
      key: "destroyInserted",
      value: function destroyInserted() {
        var existingComponent;

        if (existingComponent = this.getFormComponentInstance()) {
          existingComponent.destroy();
        } // Reset the insert form component


        this.insertForm.destroyInserted();
        this.insertForm.removeActions();
      }
    }]);

    return Edit;
  }();

  return Edit;
});
//# sourceMappingURL=edit.js.map
