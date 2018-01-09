/*eslint-disable */
define(["Gene_BlueFoot/js/component/loader", "./appearance"], function (_loader, _appearance) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AppearanceFactory =
  /*#__PURE__*/
  function () {
    function AppearanceFactory() {}

    var _proto = AppearanceFactory.prototype;

    /**
     * Create appearance applier
     *
     * @param data {DataObject}
     * @returns {Promise<Appearance>}
     */
    _proto.create = function create(data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          var appearanceKey = "appearances";

          if (data[appearanceKey].length) {
            (0, _loader)(data[appearanceKey], function () {
              for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
                components[_key] = arguments[_key];
              }

              resolve(new _appearance(_this.createAppearanceComponents(components)));
            });
          } else {
            resolve(new _appearance({}));
          }
        } catch (e) {
          reject(e);
        }
      });
    };
    /**
     * Create loaded component modules
     *
     * @param components
     * @returns {any}
     */


    _proto.createAppearanceComponents = function createAppearanceComponents(components) {
      var appearanceComponents = {};
      Object.keys(components).map(function (key) {
        var component = components[key];
        var componentName = component.name.split(/(?=[A-Z])/).join("-").toLowerCase();
        appearanceComponents[componentName] = new component();
      });
      return appearanceComponents;
    };

    return AppearanceFactory;
  }();

  return AppearanceFactory;
});
//# sourceMappingURL=appearance-factory.js.map
