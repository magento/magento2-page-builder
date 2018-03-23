/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Video =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Video, _Block);

    function Video() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Video.prototype;

    /**
     * Get video attributes with correct src
     *
     * @returns {DataObject}
     */
    _proto.getVideoAttributes = function getVideoAttributes() {
      var data = this.getData();
      return _.extend(this.getAttributes(), {
        height: data.height || null,
        src: this.getVideoUrl(data.video_source),
        width: data.width || null
      });
    };
    /**
     * Change video src to correct format
     *
     * @param {any} url
     * @returns {any}
     */


    _proto.getVideoUrl = function getVideoUrl(url) {
      var youtubeRegExp = new RegExp("^(?:https?:\/\/|\/\/)?(?:www\\.|m\\.)?" + "(?:youtu\\.be\/|youtube\\.com\/(?:embed\/|v\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])");
      var vimeoRegExp = new RegExp("https?:\/\/(?:www\\.|player\\.)?vimeo.com\/(?:channels\/" + "(?:\\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\\d+)\/video\/|video\/|)(\\d+)(?:$|\/|\\?)");

      if (youtubeRegExp.test(url)) {
        return "https://www.youtube.com/embed/" + youtubeRegExp.exec(url)[1];
      } else if (vimeoRegExp.test(url)) {
        return "https://player.vimeo.com/video/" + vimeoRegExp.exec(url)[3] + "?title=0&byline=0&portrait=0";
      }

      return url;
    };

    return Video;
  }(_block);

  return Video;
});
//# sourceMappingURL=video.js.map
