define(["./event-emitter"], function (_eventEmitter) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * DataStore Class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var DataStore =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inherits(DataStore, _EventEmitter);

    function DataStore() {
      var _ref;

      var _temp, _this;

      _classCallCheck(this, DataStore);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = DataStore.__proto__ || Object.getPrototypeOf(DataStore)).call.apply(_ref, [this].concat(args))), _this.state = new Map(), _this.snapshotStorage = new Map(), _this.snapshotLog = [], _temp));
    }

    _createClass(DataStore, [{
      key: "get",

      /**
       * Retrieve data from the state for an editable area
       * 
       * @param id 
       */
      value: function get(id) {
        return this.state.get(id) || {};
      }
      /**
       * Update the state for an individual editable area
       * 
       * @param id 
       * @param data 
       */

    }, {
      key: "update",
      value: function update(id, data) {
        var previousState = this.state.get(id);

        if (previousState && previousState === data) {
          console.warn("Warning: You updated ".concat(id, " with the same object as before. This will break the ability to rollback"));
        }

        var storeData = Object.assign({}, data);
        this.state.set(id, storeData); // Append the previous state into our snapshot storage

        if (previousState) {
          var snapshots = this.snapshotStorage.get(id);

          if (!snapshots) {
            snapshots = [previousState];
            this.snapshotStorage.set(id, snapshots);
          } else {
            snapshots.unshift(previousState);
          }

          this.snapshotLog.push(id);
        }

        this.emitState(id, storeData);
        console.log('data-store:update');
      }
      /**
       * Update an individual key within an objects state
       * 
       * @param id 
       * @param data 
       * @param key 
       */

    }, {
      key: "updateKey",
      value: function updateKey(id, data, key) {
        var state = Object.assign({}, this.state.get(id)) || {};
        state[key] = data;
        this.update(id, state);
      }
      /**
       * Rollback an item to a previous state
       * 
       * @param id 
       */

    }, {
      key: "rollback",
      value: function rollback(id) {
        id = id || this.snapshotLog.shift();
        var lastState = this.snapshotStorage.get(id);

        if (lastState) {
          var data = lastState.shift();
          this.state.set(id, data);
          this.emitState(id, data);
        }
      }
      /**
       * Remove an object from the state
       * 
       * @param id 
       */

    }, {
      key: "remove",
      value: function remove(id) {
        this.state.delete(id);
        this.emitState(id, null);
      }
      /**
       * Subscribe to data changes on an editable area
       * 
       * @param handler 
       * @param id 
       */

    }, {
      key: "subscribe",
      value: function subscribe(handler, id) {
        var eventName = id ? 'state_' + id : 'state';
        this.on(eventName, function (event, data) {
          handler(data.state, event);
        });
        console.log('data-store:subscribe');
      }
      /**
       * Emit state updates through events 
       * 
       * @param id
       * @param data 
       */

    }, {
      key: "emitState",
      value: function emitState(id, data) {
        this.emit('state', {
          state: this.state
        });

        if (id) {
          this.emit('state_' + id, {
            state: data
          });
        }
      }
    }]);

    return DataStore;
  }(_eventEmitter);

  return DataStore;
});
//# sourceMappingURL=data-store.js.map
