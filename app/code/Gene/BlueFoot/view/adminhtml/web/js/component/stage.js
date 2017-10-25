define(["./stage/structural/editable-area", "./stage/structural/row", "underscore", "./data-store", "mage/translate", "./stage/save"], function (_editableArea, _row, _underscore, _dataStore, _translate, _save) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * Stage class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Stage =
  /*#__PURE__*/
  function (_EditableArea) {
    _inherits(Stage, _EditableArea);

    /**
     * Stage constructor
     *
     * @param parent
     * @param stageContent
     */
    function Stage(parent, stageContent) {
      var _this;

      _classCallCheck(this, Stage);

      _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));
      Object.defineProperty(_this, "parent", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "stage", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "active", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: true
      });
      Object.defineProperty(_this, "showBorders", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "userSelect", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "loading", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(_this, "serializeRole", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'stage'
      });
      Object.defineProperty(_this, "store", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });

      _this.setChildren(stageContent);

      _this.stage = _this;
      _this.parent = parent;
      _this.showBorders = parent.showBorders;
      _this.userSelect = parent.userSelect;
      _this.loading = parent.loading; // Create our state and store objects

      _this.store = new _dataStore(); // Any store state changes trigger a stage update event

      _this.store.subscribe(function () {
        return _this.emit('stageUpdated');
      });

      _underscore.bindAll(_this, 'onSortingStart', 'onSortingStop');

      _this.on('sortingStart', _this.onSortingStart);

      _this.on('sortingStop', _this.onSortingStop);
      /**
       * Watch for stage update events & manipulations to the store, debouce for 50ms as multiple stage changes
       * can occur concurrently.
        */


      _this.on('stageUpdated', _underscore.debounce(function () {
        (0, _save)(stageContent).then(function (renderedOutput) {
          return _this.parent.value(renderedOutput);
        });
      }, 500));

      return _this;
    }
    /**
     * Run the build system to initiate from existing structures
     *
     * @param {Build} buildInstance
     * @param {HTMLElement} buildStructure
     */


    _createClass(Stage, [{
      key: "build",
      value: function build(buildInstance, buildStructure) {
        var self = this;

        if (buildInstance && buildStructure) {
          buildInstance.buildStage(this, buildStructure).on('buildDone', self.ready.bind(self)).on('buildError', function (event, error) {
            // Inform the user that an issue has occurred
            self.parent.alertDialog({
              title: 'Advanced CMS Error',
              content: "An error has occurred whilst initiating the Advanced CMS content area.\n\n Please consult " + "with your development team on how to resolve."
            }); // self.emit('stageError', error);

            console.error(error);
          });
        } else {
          // If no build instance is present we're initiating a new stage
          this.addRow(this);
          this.ready();
        }
      }
      /**
       * The stage has been initiated fully and is ready
       */

    }, {
      key: "ready",
      value: function ready() {
        this.emit('stageReady');
        this.children.valueHasMutated();
        this.loading(false);
      }
      /**
       * Add a row to the stage
       *
       * @param self
       * @param data
       * @returns {Row}
       */

    }, {
      key: "addRow",
      value: function addRow(self, data) {
        var row = new _row(self, self);
        this.store.update(row.id, data);
        this.addChild(row);
        return row;
      }
    }, {
      key: "openTemplateManager",
      value: function openTemplateManager() {// @todo
      }
    }, {
      key: "addComponent",
      value: function addComponent() {} // @todo

      /**
       * Event handler for any element being sorted in the stage
       */

    }, {
      key: "onSortingStart",
      value: function onSortingStart() {
        this.showBorders(true);
      }
      /**
       * Event handler for when sorting stops
       */

    }, {
      key: "onSortingStop",
      value: function onSortingStop() {
        this.showBorders(false);
      }
      /**
       * Remove a child from the observable array
       *
       * @param child
       */

    }, {
      key: "removeChild",
      value: function removeChild(child) {
        if (this.children().length == 1) {
          this.parent.alertDialog({
            title: (0, _translate)('Unable to Remove'),
            content: (0, _translate)('You are not able to remove the final row from the content.')
          });
          return;
        }

        _get(Stage.prototype.__proto__ || Object.getPrototypeOf(Stage.prototype), "removeChild", this).call(this, child);
      }
    }]);

    return Stage;
  }(_editableArea);

  return Stage;
});
//# sourceMappingURL=stage.js.map
