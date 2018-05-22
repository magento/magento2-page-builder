/*eslint-disable */
define(["jquery", "uiEvents", "underscore", "Magento_PageBuilder/js/content-type-toolbar/option", "Magento_PageBuilder/js/toolbar", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _uiEvents, _underscore, _option, _toolbar, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Heading =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Heading, _BasePreview);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Heading(parent, config, observableUpdater) {
      var _this;

      _this = _BasePreview.call(this, parent, config, observableUpdater) || this;
      _this.element = void 0;
      _this.onToolbarFocusIn = void 0;
      _this.onToolbarFocusOut = void 0;
      _this.onToolbarFocusIn = _toolbar.onFocusIn;
      _this.onToolbarFocusOut = _toolbar.onFocusOut;
      return _this;
    }
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */


    var _proto = Heading.prototype;

    _proto.onRender = function onRender(element) {
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
     * @returns {ToolbarOption}
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
      return new _option(this, options);
    };

    return Heading;
  }(_preview);

  return Heading;
});
//# sourceMappingURL=preview.js.map
