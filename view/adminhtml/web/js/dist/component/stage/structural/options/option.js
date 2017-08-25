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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9vcHRpb25zL29wdGlvbi50cyJdLCJuYW1lcyI6WyJPcHRpb24iLCJwYXJlbnQiLCJjb2RlIiwiaWNvbiIsInRpdGxlIiwiYWN0aW9uIiwiY2xhc3NlcyIsInNvcnQiLCJ0ZW1wbGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVFNQSxNLFdBQUFBLE07QUFVRjs7Ozs7Ozs7Ozs7O0FBWUEsb0JBQ0lDLE1BREosRUFFSUMsSUFGSixFQUdJQyxJQUhKLEVBSUlDLEtBSkosRUFLSUMsTUFMSixFQU1JQyxPQU5KLEVBT0lDLElBUEosRUFRSUMsUUFSSixFQVFxQjtBQUFBOztBQXpCckIsV0FBQUgsTUFBQSxHQUEyQixLQUEzQjtBQUNBLFdBQUFDLE9BQUEsR0FBeUIsRUFBekI7QUFFQSxXQUFBRSxRQUFBLEdBQW9CLElBQXBCO0FBd0JJLFdBQUtQLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFdBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFdBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFdBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFdBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0g7QUFFRDs7Ozs7Ozs7OztvQ0FNVztBQUNQLGVBQU8sS0FBS0EsUUFBWjtBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMvb3B0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RydWN0dXJhbCB9IGZyb20gXCIuLi9hYnN0cmFjdC5kXCI7XG5pbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tIFwiLi9vcHRpb24uZFwiO1xuXG4vKipcbiAqIE9wdGlvbiBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgT3B0aW9uIGltcGxlbWVudHMgT3B0aW9uSW50ZXJmYWNlIHtcbiAgICBwYXJlbnQ6IFN0cnVjdHVyYWw7XG4gICAgY29kZTogc3RyaW5nO1xuICAgIGljb246IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIGFjdGlvbjogRnVuY3Rpb24gfCBmYWxzZSA9IGZhbHNlO1xuICAgIGNsYXNzZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBzb3J0OiBudW1iZXI7XG4gICAgdGVtcGxhdGU/OiBzdHJpbmcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9uIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIGNvZGVcbiAgICAgKiBAcGFyYW0gaWNvblxuICAgICAqIEBwYXJhbSB0aXRsZVxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0gY2xhc3Nlc1xuICAgICAqIEBwYXJhbSBzb3J0XG4gICAgICogQHBhcmFtIHRlbXBsYXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHBhcmVudDogU3RydWN0dXJhbCxcbiAgICAgICAgY29kZTogc3RyaW5nLFxuICAgICAgICBpY29uOiBzdHJpbmcsXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICAgIGFjdGlvbjogRnVuY3Rpb24gfCBmYWxzZSxcbiAgICAgICAgY2xhc3NlczogQXJyYXk8c3RyaW5nPixcbiAgICAgICAgc29ydDogbnVtYmVyLFxuICAgICAgICB0ZW1wbGF0ZT86IHN0cmluZ1xuICAgICkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICAgICAgdGhpcy5pY29uID0gaWNvbjtcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgICAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgdGhpcy5jbGFzc2VzID0gY2xhc3NlcztcbiAgICAgICAgdGhpcy5zb3J0ID0gc29ydDtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0ZW1wbGF0ZSBmb3Igb3B0aW9uXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gICAgfVxufSJdfQ==
