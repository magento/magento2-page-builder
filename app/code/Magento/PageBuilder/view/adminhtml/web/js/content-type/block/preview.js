/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _uiEvents, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.displayPreview = _knockout.observable(false), _this.placeholderText = _knockout.observable((0, _translate)("Block Not Selected")), _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Bind events
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a block type is dropped for the first time open the edit panel


      _uiEvents.on("block:contentType:dropped:create", function (event, params) {
        if (event.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.edit.open();
          }, 300);
        }
      });

      _uiEvents.on("previewObservables:updated", function (args) {
        if (args.preview.parent.id !== _this2.parent.id) {
          return;
        }

        _this2.placeholderText((0, _translate)("Loading..."));

        _this2.displayPreview(false);

        var data = _this2.parent.dataStore.get();

        if (!data.block_id || data.template.length === 0) {
          return;
        }

        var url = _config.getConfig("preview_url");

        var requestConfig = {
          method: "GET",
          data: {
            role: _this2.config.name,
            block_id: data.block_id,
            directive: _this2.data.main.html()
          }
        }; // Retrieve a state object representing the block from the preview controller and process it on the stage

        _jquery.ajax(url, requestConfig).done(function (response) {
          var content = response.content !== undefined ? response.content.trim() : ""; // Empty content means something bad happened in the controller that didn't trigger a 5xx

          if (content.length === 0) {
            _this2.placeholderText((0, _translate)("An unknown error occurred. Please try again."));

            return;
          } // The state object will contain the block name and either html or a message why there isn't any.


          var blockData = _jquery.parseJSON(content); // Update the stage content type label with the real block title if provided


          _this2.displayLabel(blockData.blockTitle ? blockData.blockTitle : _this2.config.label);

          if (blockData.html) {
            _this2.displayPreview(true);

            _this2.data.main.html(blockData.html);
          } else if (blockData.errorMessage) {
            _this2.placeholderText(blockData.errorMessage);
          }
        }).fail(function () {
          _this2.placeholderText((0, _translate)("An unknown error occurred. Please try again."));
        });
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
