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
    stage = stage || parent.stage;
    formData = formData || {};
    return new Promise(function (resolve, reject) {
      var componentPath = getBlockComponentPath(config);
      (0, _loader)([componentPath], function (factory) {
        return resolve(new factory(parent, stage, config, formData));
      }, function (error) {
        return reject(error);
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
