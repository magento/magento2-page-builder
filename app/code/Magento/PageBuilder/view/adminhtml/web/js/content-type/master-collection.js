/*eslint-disable */
define(["Magento_PageBuilder/js/content-type/master"], function (_master) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var MasterCollection =
  /*#__PURE__*/
  function (_BaseMaster) {
    _inheritsLoose(MasterCollection, _BaseMaster);

    function MasterCollection() {
      return _BaseMaster.apply(this, arguments) || this;
    }

    _createClass(MasterCollection, [{
      key: "renderChildTemplate",

      /**
       * Retrieve the child template
       *
       * @returns {string}
       */
      get: function get() {
        return "Magento_PageBuilder/content-type/master-collection";
      }
    }]);

    return MasterCollection;
  }(_master);

  return Object.assign(MasterCollection, {
    __esModule: true
  });
});
//# sourceMappingURL=master-collection.js.map
