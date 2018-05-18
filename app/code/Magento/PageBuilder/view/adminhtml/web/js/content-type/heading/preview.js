/*eslint-disable */
define(["jquery", "uiEvents", "underscore", "Magento_PageBuilder/js/toolbar-options", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _uiEvents, _underscore, _toolbarOptions, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Heading =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Heading, _BasePreview);

    function Heading() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.element = void 0, _temp) || _this;
    }

    var _proto = Heading.prototype;

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    _proto.onHeadingRender = function onHeadingRender(element) {
      this.element = element;
    };

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a heading is dropped for the first time show heading toolbar


      _uiEvents.on("heading:block:dropped:create", function (args) {
        if (args.id === _this2.parent.id) {
          _underscore.delay(function () {
            (0, _jquery)(_this2.element).focus();
          }, 100); // 100 ms delay to allow for heading to render

        }
      });
    };
    /**
     * Build and return the tool bar options for heading
     *
     * @returns {ToolbarOptions}
     */


    _proto.getHeadingToolbar = function getHeadingToolbar() {
      var options = [{
        key: "heading_type",
        type: "select",
        options: [{
          value: "h1",
          label: "H1",
          icon: ""
        }, {
          value: "h2",
          label: "H2",
          icon: ""
        }, {
          value: "h3",
          label: "H3",
          icon: ""
        }, {
          value: "h4",
          label: "H4",
          icon: ""
        }, {
          value: "h5",
          label: "H5",
          icon: ""
        }, {
          value: "h6",
          label: "H6",
          icon: ""
        }]
      }, {
        key: "text_align",
        type: "select",
        options: [{
          value: "left",
          label: "Left",
          icon: "icon-pagebuilder-text-left"
        }, {
          value: "center",
          label: "Center",
          icon: "icon-pagebuilder-text-center"
        }, {
          value: "right",
          label: "Right",
          icon: "icon-pagebuilder-text-right"
        }]
      }];
      return new _toolbarOptions.ToolbarOptions(this, options);
    };

    return Heading;
  }(_preview);

  return Heading;
});
//# sourceMappingURL=preview.js.map
