/*eslint-disable */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

define(["Magento_PageBuilder/js/content-type-collection", "Magento_Ui/js/modal/alert", "Magento_PageBuilder/js/content-type/root/preview"], function (_contentTypeCollection, _alert, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Root =
  /*#__PURE__*/
  function (_contentTypeCollectio) {
    "use strict";

    _inheritsLoose(Root, _contentTypeCollectio);

    /**
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    function Root(config, stageId) {
      var _this;

      _this = _contentTypeCollectio.call(this, null, config, stageId) || this;
      _this.preview = new _preview(_assertThisInitialized(_assertThisInitialized(_this)), _this.config, null);
      return _this;
    }
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    var _proto = Root.prototype;

    _proto.removeChild = function removeChild(child) {
      if (this.getChildren().length === 1) {
        (0, _alert)({
          content: $t("You are not able to remove the final row from the content."),
          title: $t("Unable to Remove")
        });
        return;
      }

      _contentTypeCollectio.prototype.removeChild.call(this, child);
    };
    /**
     * Determine if the container can receive drop events?
     *
     * @returns {boolean}
     */


    _proto.isContainer = function isContainer() {
      return true;
    };
    /**
     * Retrieve the preview template from the config
     *
     * @returns {string}
     */


    /**
     * Bind associated events
     */
    _proto.bindEvents = function bindEvents() {};

    _createClass(Root, [{
      key: "previewTemplate",
      get: function get() {
        return this.config.preview_template;
      }
    }]);

    return Root;
  }(_contentTypeCollection);

  return Root;
});
//# sourceMappingURL=root.js.map
