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
     * Can we build BlueFoot from the fields value?
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
      this.stage = stage;
      return this.parseAndBuildElement(this.stageDocument, this.stage);
    };
    /**
     * Parse an element in the structure and build the required element
     *
     * @param element
     * @param parent
     * @returns {Promise<EditableAreaInterface>}
     */


    _proto.parseAndBuildElement = function parseAndBuildElement(element, parent) {
      var _this2 = this;

      if (element instanceof HTMLElement && element.getAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
        parent = parent || this.stage;
        var self = this,
            role = element.getAttribute(_config.getValueAsString('dataRoleAttributeName'));
        var getElementDataPromise = new Promise(function (resolve, error) {
          resolve(self.getElementData(element));
        });
        return getElementDataPromise.then(function (data) {
          var children = _this2.getElementChildren(element); // Add element to stage


          return _this2.buildElement(role, data, parent).then(function (newParent) {
            if (children.length > 0) {
              var childPromises = [];

              _.forEach(children, function (child) {
                childPromises.push(self.parseAndBuildElement(child, newParent));
              });

              return Promise.all(childPromises);
            } else {
              return newParent;
            }
          });
        });
      } else {
        return Promise.reject(new Error('Element does not contain valid role attribute.'));
      }
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
    };
    /**
     * Forward build instruction to necessary build function
     *
     * @param role
     * @param data
     * @param parent
     * @returns {Promise<EditableAreaInterface>}
     */


    _proto.buildElement = function buildElement(role, data, parent) {
      switch (role) {
        case 'stage':
          // If the stage is being built, we don't need to "build" anything, just return the stage as the
          // new parent
          return Promise.resolve(this.stage);

        default:
          return this.buildEntity(role, data, parent);
      }
    };
    /**
     * Add an entity into the system
     *
     * @param role
     * @param data
     * @param parent
     * @returns {Promise<T>}
     */


    _proto.buildEntity = function buildEntity(role, data, parent) {
      return new Promise(function (resolve, reject) {
        (0, _factory)(_config.getInitConfig('contentTypes')[role], parent, this.stage, data).then(function (block) {
          parent.addChild(block);
          resolve(block);
        }).catch(function (error) {
          reject(error);
        });
      }.bind(this));
    };

    return Build;
  }(_eventEmitter);

  return Build;
});
//# sourceMappingURL=build.js.map
