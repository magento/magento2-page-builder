define(["Gene_BlueFoot/js/component/loader", "./appearance-applier"], function (_loader, _appearanceApplier) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AppearanceApplierFactory =
  /*#__PURE__*/
  function () {
    function AppearanceApplierFactory() {}

    var _proto = AppearanceApplierFactory.prototype;

    /**
     * Create appearance applier
     *
     * @param data {DataObject}
     * @returns {Promise<AppearanceApplier>}
     */
    _proto.create = function create(data) {
      var createAppearanceComponents = function createAppearanceComponents(components) {
        var appearanceComponents = {};
        Object.keys(components).map(function (key) {
          var component = components[key];
          var componentName = component.name.split(/(?=[A-Z])/).join('-').toLowerCase();
          appearanceComponents[componentName] = new component();
        });
        return appearanceComponents;
      };

      return new Promise(function (resolve, reject) {
        try {
          if (data['appearances'].length) {
            (0, _loader)(data['appearances'], function () {
              for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
                components[_key] = arguments[_key];
              }

              resolve(new _appearanceApplier(createAppearanceComponents(components)));
            });
          } else {
            resolve(new _appearanceApplier({}));
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    return AppearanceApplierFactory;
  }();

  return AppearanceApplierFactory;
});
//# sourceMappingURL=appearance-applier-factory.js.map
