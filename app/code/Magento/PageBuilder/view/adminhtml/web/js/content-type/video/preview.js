/*eslint-disable */
/* jscs:disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type/preview"], function (_hideShowOption, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      return _preview2.apply(this, arguments) || this;
    }

    var _proto = Preview.prototype;

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
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
    };

    _proto.isHosted = function isHosted(src) {
      var youtubeRegExp = new RegExp("^(?:https?:\/\/|\/\/)?(?:www\\.|m\\.)?" + "(?:youtu\\.be\/|youtube\\.com\/(?:embed\/|v\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])");
      var vimeoRegExp = new RegExp("https?:\/\/(?:www\\.|player\\.)?vimeo.com\/(?:channels\/" + "(?:\\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\\d+)\/video\/|video\/|)(\\d+)(?:$|\/|\\?)");
      return vimeoRegExp.test(src) || youtubeRegExp.test(src);
    }
    /**
     * After render callback
     *
     * @param {HTMLVideoElement} videoElement
     * @param {Preview} self
     */
    ;

    _proto.onAfterRender = function onAfterRender(videoElement, self) {
      // Assign muted attribute explicitly due to API issues
      videoElement.muted = self.data.video.attributes().autoplay;
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map