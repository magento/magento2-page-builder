/*eslint-disable */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/content-type/preview-collection", "Magento_PageBuilder/js/drag-drop/sortable"], function (_previewCollection, _sortable) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var RootPreview =
  /*#__PURE__*/
  function (_previewCollection2) {
    "use strict";

    _inheritsLoose(RootPreview, _previewCollection2);

    function RootPreview() {
      return _previewCollection2.apply(this, arguments) || this;
    }

    var _proto = RootPreview.prototype;

    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */
    _proto.getSortableOptions = function getSortableOptions() {
      return (0, _sortable.getSortableOptions)(this);
    };
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      return {};
    };
    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */


    _proto.bindEvents = function bindEvents() {};

    _createClass(RootPreview, [{
      key: "previewTemplate",
      get: function get() {
        return this.config.preview_template;
      }
    }]);

    return RootPreview;
  }(_previewCollection);

  return RootPreview;
});
//# sourceMappingURL=preview.js.map
