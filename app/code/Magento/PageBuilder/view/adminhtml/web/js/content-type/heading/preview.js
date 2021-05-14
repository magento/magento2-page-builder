/*eslint-disable */
/* jscs:disable */

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

define(["jquery", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type-toolbar", "Magento_PageBuilder/js/utils/promise-deferred", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _events, _underscore, _hideShowOption, _contentTypeToolbar, _promiseDeferred, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview = /*#__PURE__*/function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(contentType, config, observableUpdater) {
      var _this;

      _this = _preview2.call(this, contentType, config, observableUpdater) || this;
      _this.afterRenderDeferred = (0, _promiseDeferred)();
      _this.toolbar = new _contentTypeToolbar(_assertThisInitialized(_this), _this.getToolbarOptions());
      return _this;
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */


    var _proto = Preview.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);

      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * On render init the heading
     *
     * @param {Element} element
     */
    ;

    _proto.afterRender = function afterRender(element) {
      this.element = element;
      this.afterRenderDeferred.resolve(element);
    };

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _preview2.prototype.bindEvents.call(this); // When a heading is dropped for the first time show heading toolbar


      _events.on("heading:dropAfter", function (args) {
        if (args.id === _this2.contentType.id) {
          Promise.all([_this2.afterRenderDeferred.promise, _this2.toolbar.afterRenderDeferred.promise]).then(function (_ref) {
            var element = _ref[0];

            _underscore.defer(function () {
              (0, _jquery)(element).focus();
            });
          });
        }
      });
    }
    /**
     * Get option value from observable data.
     *
     * @param {string} key
     * @return {*}
     */
    ;

    _proto.getOptionValue = function getOptionValue(key) {
      if (key === "heading_type") {
        return this.data.main.heading_type();
      } else if (key === "text_align") {
        return this.data.main.style().textAlign;
      }

      return;
    }
    /**
     * Build and return the tool bar options for heading
     *
     * @returns {OptionInterface[]}
     */
    ;

    _proto.getToolbarOptions = function getToolbarOptions() {
      return [{
        key: "heading_type",
        type: "select",
        values: [{
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
        values: [{
          value: "left",
          label: "Left",
          icon: "icon-pagebuilder-align-left"
        }, {
          value: "center",
          label: "Center",
          icon: "icon-pagebuilder-align-center"
        }, {
          value: "right",
          label: "Right",
          icon: "icon-pagebuilder-align-right"
        }]
      }];
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map