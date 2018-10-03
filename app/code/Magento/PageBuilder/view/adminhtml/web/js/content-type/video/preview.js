/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview"], function (_knockout, _events, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this;
      _this.displayPreview = _knockout.observable(false);
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * Bind events
     */

    /**
     * Open edit menu on video content type drop with a delay of 300ms
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a map is dropped for the first time open the edit panel


      _events.on("video:dropAfter", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.openEdit();
          }, 300);
        }
      });
    };

    return Preview;
  }(_preview);

  return _extends(Preview, {
    __esModule: true
  });
});
//# sourceMappingURL=preview.js.map
