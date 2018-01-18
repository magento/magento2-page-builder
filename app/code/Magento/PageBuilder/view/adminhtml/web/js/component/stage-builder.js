/*eslint-disable */
define(["./stage", "./format/format-validator", "mage/translate", "./config", "./block/factory", "underscore", "./format/read/composite"], function (_stage, _formatValidator, _translate, _config, _factory, _, _composite) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Build the stage with the provided value
   *
   * @param {stage} stage
   * @param {string} value
   * @returns {Promise<void>}
   */
  function buildStageFromPageBuilderContent(stage, value) {
    var stageDocument = document.createElement('div');
    stageDocument.setAttribute(_config.getValueAsString('dataRoleAttributeName'), 'stage');
    stageDocument.innerHTML = value;
    return buildElementIntoStage(stageDocument, stage, stage);
  }
  /**
   * Build an element and it's children into the stage
   *
   * @param {Element} element
   * @param {EditableArea} parent
   * @param {stage} stage
   * @returns {Promise<void>}
   */


  function buildElementIntoStage(element, parent, stage) {
    if (element instanceof HTMLElement && element.getAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
      var childPromises = [],
          childElements = [],
          children = getElementChildren(element);

      if (children.length > 0) {
        _.forEach(children, function (childElement) {
          childPromises.push(createElementBlock(childElement, stage, stage));
          childElements.push(childElement);
        });
      } // Wait for all the promises to finish and add the instances to the stage


      return Promise.all(childPromises).then(function (children) {
        return children.forEach(function (child, index) {
          parent.addChild(child);
          buildElementIntoStage(childElements[index], child, stage);
        });
      });
    }
  }
  /**
   * Parse an element in the structure and build the required element
   *
   * @param {Element} element
   * @param {EditableArea} parent
   * @param {stage} stage
   * @returns {Promise<EditableAreaInterface>}
   */


  function createElementBlock(element, parent, stage) {
    parent = parent || stage;
    var role = element.getAttribute(_config.getValueAsString('dataRoleAttributeName'));
    return getElementData(element).then(function (data) {
      return (0, _factory)(_config.getInitConfig('contentTypes')[role], parent, stage, data);
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
    if (element.hasChildNodes()) {
      var children = []; // Find direct children of the element

      _.forEach(element.childNodes, function (child) {
        // Only search elements which tagName's and not script tags
        if (child.tagName && child.tagName != 'SCRIPT') {
          if (child.hasAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
            children.push(child);
          } else {
            children = getElementChildren(child);
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


  function buildNewStageInstance(stage, initialValue) {
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
   * @param {function} stageBinder
   * @returns {Stage}
   */


  function build(parent, panel, stageContent, initialValue, stageBinder) {
    // Create a new instance of the stage
    var stage = new _stage(parent, stageContent);

    if (typeof stageBinder !== "undefined") {
      stageBinder(stage);
    }

    var build; // Bind the panel to the stage

    panel.bindStage(stage); // Determine if we're building from existing page builder content

    if ((0, _formatValidator)(initialValue)) {
      build = buildStageFromPageBuilderContent(stage, initialValue);
    } else {
      build = buildNewStageInstance(stage, initialValue);
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
