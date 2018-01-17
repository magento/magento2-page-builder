/*eslint-disable */
define(["./stage", "./format/format-validator", "mage/translate", "./config", "./block/factory", "underscore", "./format/read/composite"], function (_stage, _formatValidator, _translate, _config, _factory, _, _composite) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Build the stage with the provided value
   *
   * @param {string} value
   * @returns {Promise<void>}
   */
  function buildStage(value) {
    var stageDocument = document.createElement('div');
    stageDocument.setAttribute(_config.getValueAsString('dataRoleAttributeName'), 'stage');
    stageDocument.innerHTML = value;
    return this.buildElement(stageDocument, this.stage);
  }
  /**
   * Build an element and it's children into the stage
   *
   * @param {Element} element
   * @param {EditableArea} parent
   * @returns {Promise<void>}
   */


  function buildElement(element, parent) {
    var _this = this;

    if (element instanceof HTMLElement && element.getAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
      var childPromises = [],
          childElements = [],
          children = this.getElementChildren(element);

      if (children.length > 0) {
        _.forEach(children, function (childElement) {
          childPromises.push(_this.createElementBlock(childElement, _this.stage));
          childElements.push(childElement);
        });
      } // Wait for all the promises to finish and add the instances to the stage


      return Promise.all(childPromises).then(function (children) {
        return children.forEach(function (child, index) {
          parent.addChild(child);

          _this.buildElement(childElements[index], child);
        });
      });
    }
  }
  /**
   * Parse an element in the structure and build the required element
   *
   * @param {Element} element
   * @param {EditableArea} parent
   * @returns {Promise<EditableAreaInterface>}
   */


  function createElementBlock(element, parent) {
    var _this2 = this;

    parent = parent || this.stage;
    var role = element.getAttribute(_config.getValueAsString('dataRoleAttributeName'));
    return this.getElementData(element).then(function (data) {
      return (0, _factory)(_config.getInitConfig('contentTypes')[role], parent, _this2.stage, data);
    });
  }
  /**
   * Retrieve the elements data
   *
   * @param element
   * @returns {{}}
   */


  function getElementData(element) {
    var result = {};
    var attributeReaderComposite = new _composite();
    var readPromise = attributeReaderComposite.read(element);
    return readPromise.then(function (data) {
      return result ? _.extend(result, data) : {};
    });
  }
  /**
   * Return elements children, search for direct decedents, or traverse through to find deeper children
   *
   * @param element
   * @returns {Array}
   */


  function getElementChildren(element) {
    var _this3 = this;

    if (element.hasChildNodes()) {
      var children = []; // Find direct children of the element

      _.forEach(element.childNodes, function (child) {
        // Only search elements which tagName's and not script tags
        if (child.tagName && child.tagName != 'SCRIPT') {
          if (child.hasAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
            children.push(child);
          } else {
            children = _this3.getElementChildren(child);
          }
        }
      });

      if (children.length > 0) {
        return children;
      }
    }

    return [];
  }
  /**
   * Build a new instance of stage, add row & text content types if needed
   *
   * @param {Stage} stage
   * @param {string} initialValue
   * @returns {Promise<any>}
   */


  function buildNew(stage, initialValue) {
    return new Promise(function (resolve) {
      var rowConfig = _config.getContentType('row');

      var textConfig = _config.getContentType('text');

      if (rowConfig) {
        (0, _factory)(rowConfig, stage, stage, {}).then(function (row) {
          stage.addChild(row);

          if (textConfig && initialValue) {
            (0, _factory)(textConfig, stage, stage, {
              content: initialValue
            }).then(function (text) {
              row.addChild(text);
              resolve();
            });
          } else {
            resolve();
          }
        });
      } else {
        // The row content type can not exist and the system be functional
        resolve();
      }
    });
  }
  /**
   * Build a stage with the provided parent, content observable and initial value
   *
   * @param parent
   * @param panel
   * @param {KnockoutObservableArray<Structural>} stageContent
   * @param {string} initialValue
   * @returns {Stage}
   */


  function build(parent, panel, stageContent, initialValue) {
    // Create a new instance of the stage
    var stage = new _stage(parent, stageContent);
    var build; // Bind the panel to the stage

    panel.bindStage(stage); // Determine if we're building from existing page builder content

    if ((0, _formatValidator)(initialValue)) {
      build = this.buildStage(initialValue);
    } else {
      build = this.buildNew(stage, initialValue);
    } // Once the build process is finished the stage is ready


    build.then(stage.ready.bind(stage)).catch(function (error) {
      parent.alertDialog({
        title: (0, _translate)('Advanced CMS Error'),
        content: (0, _translate)("An error has occurred while initiating the content area.")
      });
      stage.emit('stageError', error);
      console.error(error);
    });
    return stage;
  }

  return build;
});
//# sourceMappingURL=stage-builder.js.map
