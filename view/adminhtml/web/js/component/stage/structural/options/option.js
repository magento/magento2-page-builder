define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Option = exports.Option = function () {
    /**
     * Option constructor
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param action
     * @param classes
     * @param sort
     * @param template
     */
    function Option(parent, code, icon, title, action, classes, sort, template) {
      _classCallCheck(this, Option);

      this.action = false;
      this.classes = [];
      this.template = null;
      this.parent = parent;
      this.code = code;
      this.icon = icon;
      this.title = title;
      this.action = action;
      this.classes = classes;
      this.sort = sort;
      this.template = template;
    }
    /**
     * Return template for option
     *
     * @deprecated
     * @returns {string}
     */


    _createClass(Option, [{
      key: "getTemplate",
      value: function getTemplate() {
        return this.template;
      }
    }]);

    return Option;
  }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMvb3B0aW9uLnRzIl0sIm5hbWVzIjpbIk9wdGlvbiIsInBhcmVudCIsImNvZGUiLCJpY29uIiwidGl0bGUiLCJhY3Rpb24iLCJjbGFzc2VzIiwic29ydCIsInRlbXBsYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUU1BLE0sV0FBQUEsTTtBQVVGOzs7Ozs7Ozs7Ozs7QUFZQSxvQkFDSUMsTUFESixFQUVJQyxJQUZKLEVBR0lDLElBSEosRUFJSUMsS0FKSixFQUtJQyxNQUxKLEVBTUlDLE9BTkosRUFPSUMsSUFQSixFQVFJQyxRQVJKLEVBUXFCO0FBQUE7O0FBekJyQixXQUFBSCxNQUFBLEdBQTJCLEtBQTNCO0FBQ0EsV0FBQUMsT0FBQSxHQUF5QixFQUF6QjtBQUVBLFdBQUFFLFFBQUEsR0FBb0IsSUFBcEI7QUF3QkksV0FBS1AsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsV0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsV0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsV0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDSDtBQUVEOzs7Ozs7Ozs7O29DQU1XO0FBQ1AsZUFBTyxLQUFLQSxRQUFaO0FBQ0giLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvb3B0aW9ucy9vcHRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdHJ1Y3R1cmFsIH0gZnJvbSBcIi4uL2Fic3RyYWN0LmRcIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbi5kXCI7XG5cbi8qKlxuICogT3B0aW9uIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBPcHRpb24gaW1wbGVtZW50cyBPcHRpb25JbnRlcmZhY2Uge1xuICAgIHBhcmVudDogU3RydWN0dXJhbDtcbiAgICBjb2RlOiBzdHJpbmc7XG4gICAgaWNvbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgYWN0aW9uOiBGdW5jdGlvbiB8IGZhbHNlID0gZmFsc2U7XG4gICAgY2xhc3NlczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHNvcnQ6IG51bWJlcjtcbiAgICB0ZW1wbGF0ZT86IHN0cmluZyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb24gY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gY29kZVxuICAgICAqIEBwYXJhbSBpY29uXG4gICAgICogQHBhcmFtIHRpdGxlXG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSBjbGFzc2VzXG4gICAgICogQHBhcmFtIHNvcnRcbiAgICAgKiBAcGFyYW0gdGVtcGxhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcGFyZW50OiBTdHJ1Y3R1cmFsLFxuICAgICAgICBjb2RlOiBzdHJpbmcsXG4gICAgICAgIGljb246IHN0cmluZyxcbiAgICAgICAgdGl0bGU6IHN0cmluZyxcbiAgICAgICAgYWN0aW9uOiBGdW5jdGlvbiB8IGZhbHNlLFxuICAgICAgICBjbGFzc2VzOiBBcnJheTxzdHJpbmc+LFxuICAgICAgICBzb3J0OiBudW1iZXIsXG4gICAgICAgIHRlbXBsYXRlPzogc3RyaW5nXG4gICAgKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgICAgICB0aGlzLmljb24gPSBpY29uO1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB0aGlzLmNsYXNzZXMgPSBjbGFzc2VzO1xuICAgICAgICB0aGlzLnNvcnQgPSBzb3J0O1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRlbXBsYXRlIGZvciBvcHRpb25cbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG59Il19
