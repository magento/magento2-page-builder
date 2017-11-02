define(["Gene_BlueFoot/js/component/loader"], function (_loader) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Retrieve the block instance from the config object
   *
   * @param config
   * @returns {any|string}
   */
  function getBlockComponentPath(config) {
    return config.js_block || 'Gene_BlueFoot/js/component/block/block';
  }
  /**
   * Create a new instance of a block
   *
   * @param config
   * @param parent
   * @param stage
   * @param formData
   * @returns {Promise<BlockInterface>}
   */


  function createBlock(config, parent, stage, formData) {
    var appearanceApplierComponentName = 'Gene_BlueFoot/js/utils/appearance-applier';

    var createAppearanceComponents = function createAppearanceComponents(components) {
      var appearanceComponents = {};
      Object.keys(components).map(function (key) {
        var component = components[key];
        var componentName = component.name.split(/(?=[A-Z])/).join('-').toLowerCase();
        appearanceComponents[componentName] = new component();
      });
      return appearanceComponents;
    };

    stage = stage || parent.stage;
    formData = formData || {};
    return new Promise(function (resolve, reject) {
      (0, _loader)([appearanceApplierComponentName], function (appearanceApplier) {
        var loadTypeComponent = function loadTypeComponent(appearanceComponents) {
          (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
            try {
              resolve(new blockComponent(parent, stage, config, formData, new appearanceApplier(appearanceComponents)));
            } catch (e) {
              reject(e);
            }
          });
        };

        if (config['appearances'].length) {
          (0, _loader)(config['appearances'], function () {
            for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
              components[_key] = arguments[_key];
            }

            loadTypeComponent(createAppearanceComponents(components));
          });
        } else {
          loadTypeComponent({});
        }
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
