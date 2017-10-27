define(["underscore", "../event-emitter", "../config", "../block/factory", "../format/read/composite"], function (_, _eventEmitter, _config, _factory, _composite) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * Build Class
   *
   * @author Dave Macaulay <hello@davemacaulay.com>
   */
  var Build =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inherits(Build, _EventEmitter);

    /**
     */
    function Build() {
      var _this;

      _classCallCheck(this, Build);

      _this = _possibleConstructorReturn(this, (Build.__proto__ || Object.getPrototypeOf(Build)).call(this));
      _this.attributeReaderComposite = new _composite();
      return _this;
    }
    /**
     * Parse the potential structure
     *
     * @param structure
     */


    _createClass(Build, [{
      key: "parseStructure",
      value: function parseStructure(structure) {
        if (!structure) {
          return false;
        }

        this.document = document.createElement('div');
        this.document.innerHTML = '<div data-role="stage">' + structure + '</div>';
        return this.document.querySelector('[' + _config.getValue('dataRoleAttributeName') + '="stage"]');
      }
      /**
       * Build the stage
       *
       * @param stage
       * @param stageElement
       * @returns {Build}
       */

    }, {
      key: "buildStage",
      value: function buildStage(stage, stageElement) {
        this.stage = stage;
        this.parseAndBuildStage(stageElement);
        return this;
      }
      /**
       * Parse and build the stage from the stage element
       *
       * @param stageElement
       * @returns {Promise<T>}
       */

    }, {
      key: "parseAndBuildStage",
      value: function parseAndBuildStage(stageElement) {
        var _this2 = this;

        return this.parseAndBuildElement(stageElement, this.stage).then(function () {
          _this2.emit('buildDone');
        }).catch(function (error) {
          _this2.emit('buildError', error);
        });
      }
      /**
       * Parse an element in the structure and build the required element
       *
       * @param element
       * @param parent
       * @returns {Promise<EditableAreaInterface>}
       */

    }, {
      key: "parseAndBuildElement",
      value: function parseAndBuildElement(element, parent) {
        if (element instanceof HTMLElement && element.getAttribute(_config.getValueAsString('dataRoleAttributeName'))) {
          parent = parent || this.stage;
          var self = this,
              role = element.getAttribute(_config.getValue('dataRoleAttributeName'));
          var getElementDataPromise = new Promise(function (resolve, error) {
            resolve(self.getElementData(element));
          }.bind(this));
          return getElementDataPromise.then(function (data) {
            var children = this.getElementChildren(element); // Add element to stage

            return this.buildElement(role, data, parent).then(function (newParent) {
              if (children.length > 0) {
                var childPromises = [];

                _.forEach(children, function (child) {
                  childPromises.push(self.parseAndBuildElement(child, newParent));
                });

                return Promise.all(childPromises);
              } else {
                return Promise.resolve(newParent);
              }
            });
          }.bind(this));
        } else {
          return Promise.reject(new Error('Element does not contain valid role attribute.'));
        }
      }
      /**
       * Retrieve the elements data
       *
       * @param element
       * @returns {{}}
       */

    }, {
      key: "getElementData",
      value: function getElementData(element) {
        var result = {};
        var readPromise = new Promise(function (resolve, reject) {
          resolve(this.attributeReaderComposite.read(element));
        }.bind(this));
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

    }, {
      key: "getElementChildren",
      value: function getElementChildren(element) {
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
       * Forward build instruction to necessary build function
       *
       * @param role
       * @param data
       * @param parent
       * @returns {Promise<EditableAreaInterface>}
       */

    }, {
      key: "buildElement",
      value: function buildElement(role, data, parent) {
        switch (role) {
          case 'stage':
            // If the stage is being built, we don't need to "build" anything, just return the stage as the
            // new parent
            return Promise.resolve(this.stage);
          // case 'row':
          //     return this.buildRow(data, parent);
          // case 'column':
          //     return this.buildColumn(data, parent);

          default:
            return this.buildEntity(role, data, parent);
        }
      }
      /**
       * Build a new row with it's associated data
       *
       * @param data
       * @param parent
       * @returns {Promise<RowInterface>}
       */

    }, {
      key: "buildRow",
      value: function buildRow(data, parent) {
        return Promise.resolve(parent.addRow(this.stage, data));
      }
      /**
       * Build a new column with it's associated data
       *
       * @param data
       * @param parent
       * @returns {Promise<ColumnInterface>}
       */

    }, {
      key: "buildColumn",
      value: function buildColumn(data, parent) {
        return Promise.resolve(parent.addColumn(data));
      }
      /**
       * Add an entity into the system
       *
       * @param role
       * @param data
       * @param parent
       * @returns {Promise<T>}
       */

    }, {
      key: "buildEntity",
      value: function buildEntity(role, data, parent) {
        return new Promise(function (resolve, reject) {
          (0, _factory)(_config.getInitConfig('contentTypes')[role], parent, this.stage, data).then(function (block) {
            parent.addChild(block);
            resolve(block);
          }).catch(function (error) {
            reject(error);
          });
        }.bind(this));
      }
    }]);

    return Build;
  }(_eventEmitter);

  return Build;
});
//# sourceMappingURL=build.js.map
