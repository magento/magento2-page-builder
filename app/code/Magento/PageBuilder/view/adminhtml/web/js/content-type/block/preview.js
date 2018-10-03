/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/widget-initializer", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _events, _widgetInitializer, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    /**
     * @inheritdoc
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _BasePreview.call(this, parent, config, observableUpdater) || this;
      _this.displayingBlockPreview = _knockout.observable(false);
      _this.loading = _knockout.observable(false);
      _this.messages = {
        NOT_SELECTED: (0, _translate)("Empty Block"),
        UNKNOWN_ERROR: (0, _translate)("An unknown error occurred. Please try again.")
      };
      _this.placeholderText = _knockout.observable(_this.messages.NOT_SELECTED);
      return _this;
    }
    /**
     * Runs the widget initializer for each configured widget
     */


    var _proto = Preview.prototype;

    _proto.initializeWidgets = function initializeWidgets(element) {
      if (element) {
        this.element = element;
        (0, _widgetInitializer)({
          config: _config.getConfig("widgets")
        }, element);
      }
    };
    /**
     * Updates the view state using the data provided
     * @param {DataObject} data
     */


    _proto.processBlockData = function processBlockData(data) {
      // Only load if something changed
      this.displayPreviewPlaceholder(data, "block_id");

      if (data.block_id && data.template.length !== 0) {
        this.processRequest(data, "block_id", "title");
      }
    };
    /**
     * @inheritdoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a block type is dropped for the first time open the edit panel


      _events.on("block:dropAfter", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.openEdit();
          }, 300);
        }
      });
    };
    /**
     * @inheritdoc
     */


    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      _BasePreview.prototype.afterObservablesUpdated.call(this);

      var data = this.parent.dataStore.get(); // Only load if something changed

      this.processBlockData(data);
    };
    /**
     * Display preview placeholder
     *
     * @param {DataObject} data
     * @param {string} identifierName
     */


    _proto.displayPreviewPlaceholder = function displayPreviewPlaceholder(data, identifierName) {
      // Only load if something changed
      if (this.lastBlockId === data[identifierName] && this.lastTemplate === data.template) {
        // The mass converter will have transformed the HTML property into a directive
        if (this.lastRenderedHtml) {
          this.data.main.html(this.lastRenderedHtml);
          this.showBlockPreview(true);
          this.initializeWidgets(this.element);
        }
      } else {
        this.showBlockPreview(false);
        this.placeholderText("");
      }

      if (!data[identifierName] || data[identifierName] && data[identifierName].length === 0 || data.template.length === 0) {
        this.showBlockPreview(false);
        this.placeholderText(this.messages.NOT_SELECTED);
        return;
      }
    };
    /**
     *
     * @param {DataObject} data
     * @param {string} identifierName
     * @param {string} labelKey
     */


    _proto.processRequest = function processRequest(data, identifierName, labelKey) {
      var _this3 = this;

      var url = _config.getConfig("preview_url");

      var identifier = data[identifierName];
      var requestConfig = {
        // Prevent caching
        method: "POST",
        data: {
          role: this.config.name,
          block_id: identifier,
          directive: this.data.main.html()
        }
      };
      this.loading(true); // Retrieve a state object representing the block from the preview controller and process it on the stage

      _jquery.ajax(url, requestConfig) // The state object will contain the block name and either html or a message why there isn't any.
      .done(function (response) {
        // Empty content means something bad happened in the controller that didn't trigger a 5xx
        if (typeof response.data !== "object") {
          _this3.showBlockPreview(false);

          _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);

          return;
        } // Update the stage content type label with the real block title if provided


        _this3.displayLabel(response.data[labelKey] ? response.data[labelKey] : _this3.config.label);

        if (response.data.content) {
          _this3.showBlockPreview(true);

          _this3.data.main.html(response.data.content);

          _this3.initializeWidgets(_this3.element);
        } else if (response.data.error) {
          _this3.showBlockPreview(false);

          _this3.placeholderText(response.data.error);
        }

        _this3.lastBlockId = parseInt(identifier.toString(), 10);
        _this3.lastTemplate = data.template.toString();
        _this3.lastRenderedHtml = response.data.content;
      }).fail(function () {
        _this3.showBlockPreview(false);

        _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);
      }).always(function () {
        _this3.loading(false);
      });
    };
    /**
     * Toggle display of block preview.  If showing block preview, add hidden mode to PB preview.
     * @param {boolean} isShow
     */


    _proto.showBlockPreview = function showBlockPreview(isShow) {
      this.displayingBlockPreview(isShow);
    };

    return Preview;
  }(_preview);

  return _extends(Preview, {
    __esModule: true
  });
});
//# sourceMappingURL=preview.js.map
