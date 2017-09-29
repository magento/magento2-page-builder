define(['exports', './event-emitter'], function (exports, _eventEmitter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var DataStore = function (_EventEmitter) {
        _inherits(DataStore, _EventEmitter);

        function DataStore() {
            _classCallCheck(this, DataStore);

            var _this = _possibleConstructorReturn(this, _EventEmitter.apply(this, arguments));

            _this.state = new Map();
            _this.snapshotStorage = new Map();
            _this.snapshotLog = [];
            return _this;
        }
        /**
         * Retrieve data from the state for an editable area
         *
         * @param id
         */


        DataStore.prototype.get = function get(id) {
            return this.state.get(id) || {};
        };

        DataStore.prototype.update = function update(id, data) {
            var previousState = this.state.get(id);
            if (previousState && previousState === data) {
                console.warn('Warning: You updated ' + id + ' with the same object as before. This will break the ability to rollback');
            }
            this.state.set(id, data);
            // Append the previous state into our snapshot storage
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
            this.emitState(id, data);
        };

        DataStore.prototype.updateKey = function updateKey(id, data, key) {
            var state = Object.assign({}, this.state.get(id)) || {};
            state[key] = data;
            this.update(id, state);
        };

        DataStore.prototype.rollback = function rollback(id) {
            id = id || this.snapshotLog.shift();
            var lastState = this.snapshotStorage.get(id);
            if (lastState) {
                var data = lastState.shift();
                this.state.set(id, data);
                this.emitState(id, data);
            }
        };

        DataStore.prototype.remove = function remove(id) {
            this.state.delete(id);
            this.emitState(id, null);
        };

        DataStore.prototype.subscribe = function subscribe(handler, id) {
            var eventName = id ? 'state_' + id : 'state';
            this.on(eventName, function (event, data) {
                handler(data.state, event);
            });
        };

        DataStore.prototype.emitState = function emitState(id, data) {
            this.emit('state', { state: this.state });
            if (id) {
                this.emit('state_' + id, { state: data });
            }
        };

        return DataStore;
    }(_eventEmitter2.default);

    exports.default = DataStore;
});