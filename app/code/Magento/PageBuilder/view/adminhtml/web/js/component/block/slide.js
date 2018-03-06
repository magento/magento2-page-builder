/*eslint-disable */
define(["./block"], function (_block) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Slide =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Slide, _Block);

    function Slide() {
      return _Block.apply(this, arguments) || this;
    }

    _createClass(Slide, [{
      key: "options",

      /**
       * Return an array of options, minus the move option
       *
       * @returns {Array<Option>}
       */
      get: function get() {
        return _Block.prototype.options.filter(function (option) {
          return option.code !== "move";
        });
      }
    }]);

    return Slide;
  }(_block);

  return Slide;
});
//# sourceMappingURL=slide.js.map
