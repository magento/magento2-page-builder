define(["./block", "../config", "underscore"], function (_block, _config, _underscore) {
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

      return directive;
    };

    _proto.getMainImageAttributes = function getMainImageAttributes() {
      var data = this.getData();

      if (data.image == "" || data.image == undefined) {
        return {};
      } else if (_underscore.isEmpty(data.image[0])) {
        return;
      }

      return {
        src: this.getImageUrl(data.image),
        alt: data.alt,
        title: data.title_tag
      };
    };

    _proto.getMobileImageAttributes = function getMobileImageAttributes() {
      var data = this.getData();

      if (data.mobile_image == "" || data.mobile_image == undefined) {
        return {};
      } else if (_underscore.isEmpty(data.mobile_image[0])) {
        return;
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
      } else if (_underscore.isEmpty(data.image[0])) {
        return;
      }

      return {
        href: this.getImageUrl(data.image),
        title: data.title_tag,
        class: data.lightbox == "Yes" ? "bluefoot-lightbox" : ""
      };
    };

    _proto.getCaption = function getCaption() {
      var data = this.getData();

      if (data.show_caption == "Yes") {
        return data.title_tag;
      } else {
        return "";
      }
    };

    return Image;
  }(_block);

  return Image;
});
//# sourceMappingURL=image.js.map
