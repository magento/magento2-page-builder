define(["underscore", "../event-emitter", "../config", "../block/factory", "../format/read/composite"], function (_, _eventEmitter, _config, _factory, _composite) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Build =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inheritsLoose(Build, _EventEmitter);

    function Build(fieldValue) {
      var _this;

      _this = _EventEmitter.call(this) || this;
      _this.fieldValue = void 0;
      _this.stage = void 0;
      _this.stageElement = void 0;
      _this.stageDocument = void 0;
      _this.attributeReaderComposite = void 0;
      _this.attributeReaderComposite = new _composite();
      _this.fieldValue = fieldValue;
      return _this;
    }
    /**
     * Can we build Page Builder from the fields value?
     *
     * @returns {boolean}
     */


    var _proto = Build.prototype;

    _proto.canBuild = function canBuild() {
      // Create a document with a role of stage to wrap the contents
      this.stageDocument = document.createElement('div');
      this.stageDocument.setAttribute(_config.getValueAsString('dataRoleAttributeName'), 'stage');
      this.stageDocument.innerHTML = this.fieldValue; // Validate if the new stage contains any rows, if it doesn't it's not compatible with our system

      return !!this.stageDocument.querySelector('[' + _config.getValueAsString('dataRoleAttributeName') + '="row"]');
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
      var _this2 = this;

      if (element instanceof HTMLElement && element.getAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
        var childPromises = [],
            childElements = [],
            children = this.getElementChildren(element);

        if (children.length > 0) {
          _.forEach(children, function (childElement) {
            childPromises.push(_this2.createBlock(childElement, _this2.stage));
            childElements.push(childElement);
          });
        } // Wait for all the promises to finish and add the instances to the stage


        return Promise.all(childPromises).then(function (children) {
          return children.forEach(function (child, index) {
            parent.addChild(child);

            _this2.buildElement(childElements[index], child);
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
      var _this3 = this;

      parent = parent || this.stage;
      var self = this,
          role = element.getAttribute(_config.getValueAsString('dataRoleAttributeName'));
      return this.getElementData(element).then(function (data) {
        return (0, _factory)(_config.getInitConfig('contentTypes')[role], parent, _this3.stage, data);
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
      var _this4 = this;

      if (element.hasChildNodes()) {
        var children = []; // Find direct children of the element

        _.forEach(element.childNodes, function (child) {
          // Only search elements which tagName's and not script tags
          if (child.tagName && child.tagName != 'SCRIPT') {
            if (child.hasAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
              children.push(child);
            } else {
              children = _this4.getElementChildren(child);
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
  }(_eventEmitter);

  return Build;
});
//# sourceMappingURL=build.js.map
