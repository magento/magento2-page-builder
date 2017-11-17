define(["./block", "../config", "../../utils/directives"], function (_block, _config, _directives) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Image =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Image, _Block);

    function Image() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Image.prototype;

    _proto.getImageUrl = function getImageUrl(image) {
      var imageUrl = image[0]['url'],
          mediaUrl = _config.getInitConfig('media_url'),
          mediaPath = imageUrl.split(mediaUrl),
          directive = '{{media url=' + mediaPath[1] + '}}';

      return (0, _directives.toDataUrl)(directive);
    };

    _proto.getImage1Attributes = function getImage1Attributes() {
      var data = this.getData();

      if (data.image == "" || data.image == undefined) {
        return {};
      }

      return {
        src: this.getImageUrl(data.image),
        alt: data.alt,
        title: data.title_tag
      };
    };

    _proto.getImage2Attributes = function getImage2Attributes() {
      var data = this.getData();

      if (data.mobile_image == "" || data.mobile_image == undefined) {
        return {};
      }

      return {
        src: this.getImageUrl(data.mobile_image),
        alt: data.alt,
        title: data.title_tag
      };
    };

    _proto.getImageAttributes = function getImageAttributes() {
      var data = this.getData();

      if (data.image == "" || data.image == undefined) {
        return {};
      }

      return {
        href: this.getImageUrl(data.image),
        title: data.title_tag,
        class: data.lightbox == "Yes" ? "bluefoot-lightbox" : ""
      };
    };

    _proto.hasMobileImage = function hasMobileImage() {
      var data = this.getData();
      return data.mobile_image == "" || data.mobile_image == undefined;
    };

    _proto.getCaption = function getCaption() {
      var data = this.getData();

      if (data.show_caption == "YES") {
        return "HELLO";
      } else {
        return "";
      }
    };

    return Image;
  }(_block);

  return Image;
});
//# sourceMappingURL=image.js.map
