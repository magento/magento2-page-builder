define(["Gene_BlueFoot/js/component/loader"], function (_loader) {
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
  // export default async function createBlock(config: ConfigObject, parent: EditableAreaInterface, stage: StageInterface, formData?: object): Promise<Block> {
  //     let c: typeof Block = await import(getBlockComponentPath(config));
  //     return new c(parent, stage || parent.stage, config, formData || {});
  // }


  function createBlock(config, parent, stage, formData) {
    var appearanceApplierComponentName = 'Gene_BlueFoot/js/utils/appearance-applier';
    stage = stage || parent.stage;
    formData = formData || {};
    return new Promise(function (resolve, reject) {
      (0, _loader)([appearanceApplierComponentName], function (appearanceApplier) {
        if (config['appearances'].length) {
          (0, _loader)(config['appearances'], function () {
            for (var _len = arguments.length, components = new Array(_len), _key = 0; _key < _len; _key++) {
              components[_key] = arguments[_key];
            }

            var appearanceComponents = {};
            Object.keys(components).map(function (key) {
              var component = components[key];
              var componentName = component.name.split(/(?=[A-Z])/).join('-').toLowerCase();
              appearanceComponents[componentName] = new component();
            });
            (0, _loader)([getBlockComponentPath(config)], function (BlockInstance) {
              return resolve(new BlockInstance(parent, stage, config, formData, new appearanceApplier(appearanceComponents)));
            }, function (error) {
              return reject(error);
            });
          });
        } else {
          (0, _loader)([getBlockComponentPath(config)], function (BlockInstance) {
            return resolve(new BlockInstance(parent, stage, config, formData, new appearanceApplier({})));
          }, function (error) {
            return reject(error);
          });
        }
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
