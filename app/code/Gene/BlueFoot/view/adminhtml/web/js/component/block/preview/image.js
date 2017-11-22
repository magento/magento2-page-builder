define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Image =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Image, _PreviewBlock);

    function Image() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Image.prototype;

    /**
     * Retrieve the image attributes for the preview
     *
     * @returns {any}
     */
    _proto.getPreviewImageAttributes = function getPreviewImageAttributes() {
      if (this.data.image() == "" || this.data.image() == undefined) {
        return {
          style: "visibility: hidden"
        };
      }

      return {
        src: this.data.image()[0].url,
        style: "visibility: visible; width: 20%"
      };
    };
    /**
     * Get the preview icon attributes
     *
     * @returns {any}
     */


    _proto.getPreviewIconAttributes = function getPreviewIconAttributes() {
      if (this.data.image() == "" || this.data.image() == undefined) {
        return {
          class: "icon-bluefoot-image",
          style: "visibility: visible"
        };
      }

      return {
        style: "visibility: hidden"
      };
    };

    return Image;
  }(_block);

  return Image;
});
//# sourceMappingURL=image.js.map
