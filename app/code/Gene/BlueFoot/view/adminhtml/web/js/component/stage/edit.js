define(["exports", "uiRegistry", "mage/translate"], function (exports, _uiRegistry, _translate) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _uiRegistry2 = _interopRequireDefault(_uiRegistry);

    var _translate2 = _interopRequireDefault(_translate);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Edit = function () {
        /**
         * Initiate the edit class with an instance of structural
         *
         * @param {Structural} instance
         */
        function Edit(instance, store) {
            _classCallCheck(this, Edit);

            this.modal = _uiRegistry2.default.get('bluefoot_modal_form.bluefoot_modal_form.modal');
            this.insertForm = _uiRegistry2.default.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
            this.instance = instance;
            this.store = store;
        }
        /**
         * Open and render the edit component
         */


        Edit.prototype.openAndRender = function openAndRender() {
            this.destroyInserted();
            this.setTitle();
            this.render();
            this.open();
        };

        Edit.prototype.open = function open() {
            this.modal.openModal();
        };

        Edit.prototype.getFormComponent = function getFormComponent() {
            return _uiRegistry2.default.get('component_' + this.instance.config.form);
        };

        Edit.prototype.render = function render() {
            // Pass the UI component to the render function
            this.insertForm.onRender(this.getFormComponent());
            this.setDataProviderClient();
        };

        Edit.prototype.save = function save(data, options) {
            this.store.update(this.instance.id, data);
            this.modal.closeModal();
        };

        Edit.prototype.setTitle = function setTitle() {
            this.modal.setTitle((0, _translate2.default)('Edit ' + (this.instance.config.label || (0, _translate2.default)('Block'))));
        };

        Edit.prototype.setDataProviderClient = function setDataProviderClient() {
            var _this = this;

            var formName = this.instance.config.form;
            // Retrieve the component
            _uiRegistry2.default.get(formName + '.' + formName, function (component) {
                var provider = _uiRegistry2.default.get(component.provider);
                // Set the instance to act as it's client in the data provider
                provider.client = _this;
                // Set the data on the provider from the data store
                provider.set('data', _this.store.get(_this.instance.id));
            });
        };

        Edit.prototype.getFormComponentInstance = function getFormComponentInstance() {
            var formName = this.instance.config.form;
            return _uiRegistry2.default.get(formName + '.' + formName);
        };

        Edit.prototype.destroyInserted = function destroyInserted() {
            var existingComponent = void 0;
            if (existingComponent = this.getFormComponentInstance()) {
                existingComponent.destroy();
            }
            // Reset the insert form component
            this.insertForm.destroyInserted();
            this.insertForm.removeActions();
        };

        return Edit;
    }();

    exports.default = Edit;
});