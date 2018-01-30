/*eslint-disable */
define(["underscore", "../block/factory", "../config", "../format/read/composite"], function (_, _factory, _config, _composite) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Build =
  /*#__PURE__*/
  function () {
    function Build(fieldValue) {
      this.stage = void 0;
      this.stageElement = void 0;
      this.attributeReaderComposite = void 0;
      this.fieldValue = void 0;
      this.stageDocument = void 0;
      this.attributeReaderComposite = new _composite();
      this.fieldValue = fieldValue;
    }
    /**
     * Can we build Page Builder from the fields value?
     *
     * @returns {boolean}
     */


    var _proto = Build.prototype;

    _proto.canBuild = function canBuild() {
      // Create a document with a role of stage to wrap the contents
      this.stageDocument = document.createElement("div");
      this.stageDocument.setAttribute(_config.getValueAsString("dataRoleAttributeName"), "stage");
      this.stageDocument.innerHTML = this.fieldValue; // Validate if the new stage contains any rows, if it doesn't it's not compatible with our system

      return !!this.stageDocument.querySelector("[" + _config.getValueAsString("dataRoleAttributeName") + "='row']");
    };
    /**
     * Build the stage
     *
     * @param stage
     * @returns {Build}
     */


    _proto.buildStage = function buildStage(stage) {
      this.stage = stage; // Iterate through the stages children

      return this.buildElement(this.stageDocument, this.stage);
    };
    /**
     * Build an element and it's children into the stage
     *
     * @param {Element} element
     * @param {EditableArea} parent
     * @returns {Promise<void>}
     */


    _proto.buildElement = function buildElement(element, parent) {
      var _this = this;

      if (element instanceof HTMLElement && element.getAttribute(_config.getValueAsString("dataRoleAttributeName"))) {
        var childPromises = [];
        var childElements = [];
        var elementChildren = this.getElementChildren(element);

        if (elementChildren.length > 0) {
          _.forEach(elementChildren, function (childElement) {
            childPromises.push(_this.createBlock(childElement, parent || _this.stage));
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
    };
    /**
     * Parse an element in the structure and build the required element
     *
     * @param {Element} element
     * @param {EditableArea} parent
     * @returns {Promise<EditableAreaInterface>}
     */


    _proto.createBlock = function createBlock(element, parent) {
      var _this2 = this;

      parent = parent || this.stage;
      var role = element.getAttribute(_config.getValueAsString("dataRoleAttributeName"));
      return this.getElementData(element).then(function (data) {
        return (0, _factory)(_config.getInitConfig("contentTypes")[role], parent, _this2.stage, data);
      });
    };
    /**
     * Retrieve the elements data
     *
     * @param element
     * @returns {{}}
     */


    _proto.getElementData = function getElementData(element) {
      var result = {};
      var readPromise = this.attributeReaderComposite.read(element);
      return readPromise.then(function (data) {
        return result ? _.extend(result, data) : {};
      });
    };
    /**
     * Return elements children, search for direct decedents, or traverse through to find deeper children
     *
     * @param element
     * @returns {Array}
     */


    _proto.getElementChildren = function getElementChildren(element) {
      var _this3 = this;

      if (element.hasChildNodes()) {
        var children = []; // Find direct children of the element

        _.forEach(element.childNodes, function (child) {
          // Only search elements which tagName"s and not script tags
          if (child.tagName && child.tagName !== "SCRIPT") {
            if (child.hasAttribute(_config.getValueAsString("dataRoleAttributeName"))) {
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
    };

    return Build;
  }();

  return Build;
});
//# sourceMappingURL=build.js.map
