/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "mageUtils", "underscore", "Magento_PageBuilder/js/config"], function (_events, _mageUtils, _underscore, _config) {
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
        var viewport = _config.getConfig("viewport");

        var defaultViewport = _config.getConfig("defaultViewport"); // set value to dataStore from default viewport if it is empty


        if (defaultViewport !== viewport) {
          _underscore.each(_this.instance.getViewportFields(viewport, data), function (value, key) {
            var isEmpty = !_underscore.find(_mageUtils.compare(data[key], _this.instance.dataStores[defaultViewport].get(key)).changes, function (change) {
              return !_underscore.isEmpty(change.oldValue);
            });

            if (isEmpty) {
              _this.instance.dataStores[viewport].set(key, data[key]);

              data[key] = _this.instance.dataStores[defaultViewport].get(key);
            }
          });
        }

        _this.dataStore.setState(_this.filterData(data));
      });
    }
    /**
     * Open the modal
     */


    var _proto = Edit.prototype;

    _proto.open = function open() {
      var _this2 = this;

      var contentTypeData = this.dataStore.getState();

      var viewport = _config.getConfig("viewport");

      var defaultViewport = _config.getConfig("defaultViewport"); // set empty value if it the same in default viewport


      if (defaultViewport !== viewport) {
        _underscore.each(this.instance.getViewportFields(viewport, contentTypeData), function (value, key) {
          if (_mageUtils.compare(contentTypeData[key], _this2.instance.dataStores.desktop.get(key)).equal) {
            contentTypeData[key] = undefined;
          }
        });
      }

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