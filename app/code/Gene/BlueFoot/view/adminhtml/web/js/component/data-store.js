/*eslint-disable */
define(["./event-emitter"], function (_eventEmitter) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var DataStore =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inheritsLoose(DataStore, _EventEmitter);

    function DataStore() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _EventEmitter.call.apply(_EventEmitter, [this].concat(args)) || this, _this.state = new Map(), _this.snapshotStorage = new Map(), _this.snapshotLog = [], _temp) || _this;
    }

    var _proto = DataStore.prototype;

    /**
     * Retrieve data from the state for an editable area
     *
     * @param id
     */
    _proto.get = function get(id) {
      return this.state.get(id) || {};
    };
    /**
     * Update the state for an individual editable area
     *
     * @param id
     * @param data
     */


    _proto.update = function update(id, data) {
      var previousState = this.state.get(id);

      if (previousState && previousState === data) {
        console.warn("Warning: You updated " + id + " with the same object as before." + "This will break the ability to rollback");
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
    };
    /**
     * Update an individual key within an objects state
     *
     * @param id
     * @param data
     * @param key
     */


    _proto.updateKey = function updateKey(id, data, key) {
      var state = Object.assign({}, this.state.get(id)) || {};
      state[key] = data;
      this.update(id, state);
    };
    /**
     * Rollback an item to a previous state
     *
     * @param id
     */


    _proto.rollback = function rollback(id) {
      id = id || this.snapshotLog.shift();
      var lastState = this.snapshotStorage.get(id);

      if (lastState) {
        var data = lastState.shift();
        this.state.set(id, data);
        this.emitState(id, data);
      }
    };
    /**
     * Remove an object from the state
     *
     * @param id
     */


    _proto.remove = function remove(id) {
      this.state.delete(id);
      this.emitState(id, null);
    };
    /**
     * Subscribe to data changes on an editable area
     *
     * @param handler
     * @param id
     */


    _proto.subscribe = function subscribe(handler, id) {
      var eventName = id ? "state_" + id : "state";
      this.on(eventName, function (event, data) {
        handler(data.state, event);
      });
    };
    /**
     * Emit state updates through events
     *
     * @param i
     * @param data
     */


    _proto.emitState = function emitState(id, data) {
      this.emit("state", {
        state: this.state
      });

      if (id) {
        this.emit("state_" + id, {
          state: data
        });
      }
    };

    return DataStore;
  }(_eventEmitter);

  return DataStore;
});
//# sourceMappingURL=data-store.js.map
