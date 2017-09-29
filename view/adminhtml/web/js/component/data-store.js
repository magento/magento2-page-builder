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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9kYXRhLXN0b3JlLnRzIiwiY29tcG9uZW50L2RhdGEtc3RvcmUuanMiXSwibmFtZXMiOlsiRGF0YVN0b3JlIiwiYXJndW1lbnRzIiwic3RhdGUiLCJNYXAiLCJzbmFwc2hvdFN0b3JhZ2UiLCJzbmFwc2hvdExvZyIsImdldCIsImlkIiwidXBkYXRlIiwiZGF0YSIsInByZXZpb3VzU3RhdGUiLCJjb25zb2xlIiwid2FybiIsInNldCIsInNuYXBzaG90cyIsInVuc2hpZnQiLCJwdXNoIiwiZW1pdFN0YXRlIiwidXBkYXRlS2V5Iiwia2V5IiwiT2JqZWN0IiwiYXNzaWduIiwicm9sbGJhY2siLCJzaGlmdCIsImxhc3RTdGF0ZSIsInJlbW92ZSIsImRlbGV0ZSIsInN1YnNjcmliZSIsImhhbmRsZXIiLCJldmVudE5hbWUiLCJvbiIsImV2ZW50IiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBcUJjQSxTOzs7QUFBZCw2QkFBQTtBQUFBOztBQUFBLHlEQ2JRLDBCQUFTQyxTQUFULENEYVI7O0FBQ0ksa0JBQUFDLEtBQUEsR0FBaUMsSUFBSUMsR0FBSixFQUFqQztBQUNBLGtCQUFBQyxlQUFBLEdBQWtELElBQUlELEdBQUosRUFBbEQ7QUFDQSxrQkFBQUUsV0FBQSxHQUE2QixFQUE3QjtBQUhKO0FBNEdDO0FBdkdHOzs7Ozs7OzRCQUtBQyxHLGdCQUFJQyxFLEVBQVU7QUFDVixtQkFBTyxLQUFLTCxLQUFMLENBQVdJLEdBQVgsQ0FBZUMsRUFBZixLQUFzQixFQUE3QjtBQUNILFM7OzRCQVFEQyxNLG1CQUFPRCxFLEVBQVlFLEksRUFBZ0I7QUFDL0IsZ0JBQU1DLGdCQUFnQixLQUFLUixLQUFMLENBQVdJLEdBQVgsQ0FBZUMsRUFBZixDQUF0QjtBQUNBLGdCQUFJRyxpQkFBaUJBLGtCQUFrQkQsSUFBdkMsRUFBNkM7QUFDekNFLHdCQUFRQyxJQUFSLDJCQUFxQ0wsRUFBckM7QUFDSDtBQUVELGlCQUFLTCxLQUFMLENBQVdXLEdBQVgsQ0FBZU4sRUFBZixFQUFtQkUsSUFBbkI7QUFFQTtBQUNBLGdCQUFJQyxhQUFKLEVBQW1CO0FBQ2Ysb0JBQUlJLFlBQVksS0FBS1YsZUFBTCxDQUFxQkUsR0FBckIsQ0FBeUJDLEVBQXpCLENBQWhCO0FBQ0Esb0JBQUksQ0FBQ08sU0FBTCxFQUFnQjtBQUNaQSxnQ0FBWSxDQUFDSixhQUFELENBQVo7QUFDQSx5QkFBS04sZUFBTCxDQUFxQlMsR0FBckIsQ0FBeUJOLEVBQXpCLEVBQTZCTyxTQUE3QjtBQUNILGlCQUhELE1BR087QUFDSEEsOEJBQVVDLE9BQVYsQ0FBa0JMLGFBQWxCO0FBQ0g7QUFDRCxxQkFBS0wsV0FBTCxDQUFpQlcsSUFBakIsQ0FBc0JULEVBQXRCO0FBQ0g7QUFFRCxpQkFBS1UsU0FBTCxDQUFlVixFQUFmLEVBQW1CRSxJQUFuQjtBQUNILFM7OzRCQVNEUyxTLHNCQUFVWCxFLEVBQVlFLEksRUFBb0RVLEcsRUFBcUI7QUFDM0YsZ0JBQUlqQixRQUFRa0IsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS25CLEtBQUwsQ0FBV0ksR0FBWCxDQUFlQyxFQUFmLENBQWxCLEtBQXlDLEVBQXJEO0FBQ0FMLGtCQUFNaUIsR0FBTixJQUFhVixJQUFiO0FBQ0EsaUJBQUtELE1BQUwsQ0FBWUQsRUFBWixFQUFnQkwsS0FBaEI7QUFDSCxTOzs0QkFPRG9CLFEscUJBQVNmLEUsRUFBVztBQUNoQkEsaUJBQUtBLE1BQU0sS0FBS0YsV0FBTCxDQUFpQmtCLEtBQWpCLEVBQVg7QUFDQSxnQkFBTUMsWUFBWSxLQUFLcEIsZUFBTCxDQUFxQkUsR0FBckIsQ0FBeUJDLEVBQXpCLENBQWxCO0FBQ0EsZ0JBQUlpQixTQUFKLEVBQWU7QUFDWCxvQkFBTWYsT0FBT2UsVUFBVUQsS0FBVixFQUFiO0FBQ0EscUJBQUtyQixLQUFMLENBQVdXLEdBQVgsQ0FBZU4sRUFBZixFQUFtQkUsSUFBbkI7QUFFQSxxQkFBS1EsU0FBTCxDQUFlVixFQUFmLEVBQW1CRSxJQUFuQjtBQUNIO0FBQ0gsUzs7NEJBT0ZnQixNLG1CQUFPbEIsRSxFQUFVO0FBQ2IsaUJBQUtMLEtBQUwsQ0FBV3dCLE1BQVgsQ0FBa0JuQixFQUFsQjtBQUVBLGlCQUFLVSxTQUFMLENBQWVWLEVBQWYsRUFBbUIsSUFBbkI7QUFDSCxTOzs0QkFRRG9CLFMsc0JBQVVDLE8sRUFBbUJyQixFLEVBQVc7QUFDcEMsZ0JBQUlzQixZQUFhdEIsS0FBSyxXQUFXQSxFQUFoQixHQUFxQixPQUF0QztBQUNBLGlCQUFLdUIsRUFBTCxDQUFRRCxTQUFSLEVBQW1CLFVBQUNFLEtBQUQsRUFBZXRCLElBQWYsRUFBbUM7QUFDbERtQix3QkFBUW5CLEtBQUtQLEtBQWIsRUFBb0I2QixLQUFwQjtBQUNILGFBRkQ7QUFHSCxTOzs0QkFRT2QsUyxzQkFBVVYsRSxFQUFhRSxJLEVBQVU7QUFDckMsaUJBQUt1QixJQUFMLENBQVUsT0FBVixFQUFtQixFQUFFOUIsT0FBTyxLQUFLQSxLQUFkLEVBQW5CO0FBQ0EsZ0JBQUlLLEVBQUosRUFBUTtBQUNKLHFCQUFLeUIsSUFBTCxDQUFVLFdBQVd6QixFQUFyQixFQUF5QixFQUFFTCxPQUFPTyxJQUFULEVBQXpCO0FBQ0g7QUFDSixTOzs7OztzQkEzR1NULFMiLCJmaWxlIjoiY29tcG9uZW50L2RhdGEtc3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCIuL2V2ZW50LWVtaXR0ZXJcIjtcbmltcG9ydCBFZGl0YWJsZUFyZWEgZnJvbSBcIi4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhXCI7XG5pbXBvcnQgXyBmcm9tIFwidW5kZXJzY29yZVwiO1xuXG5pbnRlcmZhY2UgRGF0YVN0b3JlRXZlbnQge1xuICAgIHN0YXRlOiBTdGF0ZVxufVxuXG5pbnRlcmZhY2UgU3RhdGUge1xuICAgIHN0YXRlOiBvYmplY3QgfCBudWxsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGF0YU9iamVjdCB7XG4gICAgW2tleTogc3RyaW5nXTogdW5kZWZpbmVkIHwgbnVsbCB8IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gLy8gU3RhdGUgb2JqZWN0IGNhbiBvbmx5IGNvbnRhaW4gcHJpbWl0aXZlc1xufVxuXG4vKipcbiAqIERhdGFTdG9yZSBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRhU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHN0YXRlOiBNYXA8c3RyaW5nLCBEYXRhT2JqZWN0PiA9IG5ldyBNYXA7XG4gICAgc25hcHNob3RTdG9yYWdlOiBNYXA8c3RyaW5nLCBBcnJheTxEYXRhT2JqZWN0Pj4gPSBuZXcgTWFwO1xuICAgIHNuYXBzaG90TG9nOiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBkYXRhIGZyb20gdGhlIHN0YXRlIGZvciBhbiBlZGl0YWJsZSBhcmVhXG4gICAgICogXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqL1xuICAgIGdldChpZDogc3RyaW5nKTogRGF0YU9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmdldChpZCkgfHwge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzdGF0ZSBmb3IgYW4gaW5kaXZpZHVhbCBlZGl0YWJsZSBhcmVhXG4gICAgICogXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqL1xuICAgIHVwZGF0ZShpZDogc3RyaW5nLCBkYXRhOiBEYXRhT2JqZWN0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSB0aGlzLnN0YXRlLmdldChpZCk7XG4gICAgICAgIGlmIChwcmV2aW91c1N0YXRlICYmIHByZXZpb3VzU3RhdGUgPT09IGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgV2FybmluZzogWW91IHVwZGF0ZWQgJHtpZH0gd2l0aCB0aGUgc2FtZSBvYmplY3QgYXMgYmVmb3JlLiBUaGlzIHdpbGwgYnJlYWsgdGhlIGFiaWxpdHkgdG8gcm9sbGJhY2tgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhdGUuc2V0KGlkLCBkYXRhKTtcblxuICAgICAgICAvLyBBcHBlbmQgdGhlIHByZXZpb3VzIHN0YXRlIGludG8gb3VyIHNuYXBzaG90IHN0b3JhZ2VcbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUpIHtcbiAgICAgICAgICAgIGxldCBzbmFwc2hvdHMgPSB0aGlzLnNuYXBzaG90U3RvcmFnZS5nZXQoaWQpO1xuICAgICAgICAgICAgaWYgKCFzbmFwc2hvdHMpIHtcbiAgICAgICAgICAgICAgICBzbmFwc2hvdHMgPSBbcHJldmlvdXNTdGF0ZV07XG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwc2hvdFN0b3JhZ2Uuc2V0KGlkLCBzbmFwc2hvdHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzbmFwc2hvdHMudW5zaGlmdChwcmV2aW91c1N0YXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc25hcHNob3RMb2cucHVzaChpZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXRTdGF0ZShpZCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGFuIGluZGl2aWR1YWwga2V5IHdpdGhpbiBhbiBvYmplY3RzIHN0YXRlXG4gICAgICogXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqIEBwYXJhbSBrZXkgXG4gICAgICovXG4gICAgdXBkYXRlS2V5KGlkOiBzdHJpbmcsIGRhdGE6IHVuZGVmaW5lZCB8IG51bGwgfCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuLCBrZXk/OiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgICAgbGV0IHN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5nZXQoaWQpKSB8fCB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGRhdGE7XG4gICAgICAgIHRoaXMudXBkYXRlKGlkLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm9sbGJhY2sgYW4gaXRlbSB0byBhIHByZXZpb3VzIHN0YXRlXG4gICAgICogXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqL1xuICAgIHJvbGxiYWNrKGlkPzogc3RyaW5nKSB7XG4gICAgICAgIGlkID0gaWQgfHwgdGhpcy5zbmFwc2hvdExvZy5zaGlmdCgpO1xuICAgICAgICBjb25zdCBsYXN0U3RhdGUgPSB0aGlzLnNuYXBzaG90U3RvcmFnZS5nZXQoaWQpO1xuICAgICAgICBpZiAobGFzdFN0YXRlKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbGFzdFN0YXRlLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNldChpZCwgZGF0YSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZW1pdFN0YXRlKGlkLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gb2JqZWN0IGZyb20gdGhlIHN0YXRlXG4gICAgICogXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqL1xuICAgIHJlbW92ZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdGUuZGVsZXRlKGlkKTtcblxuICAgICAgICB0aGlzLmVtaXRTdGF0ZShpZCwgbnVsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIGRhdGEgY2hhbmdlcyBvbiBhbiBlZGl0YWJsZSBhcmVhXG4gICAgICogXG4gICAgICogQHBhcmFtIGhhbmRsZXIgXG4gICAgICogQHBhcmFtIGlkIFxuICAgICAqL1xuICAgIHN1YnNjcmliZShoYW5kbGVyOiBGdW5jdGlvbiwgaWQ/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgbGV0IGV2ZW50TmFtZSA9IChpZCA/ICdzdGF0ZV8nICsgaWQgOiAnc3RhdGUnKTtcbiAgICAgICAgdGhpcy5vbihldmVudE5hbWUsIChldmVudDogRXZlbnQsIGRhdGE6IERhdGFTdG9yZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVyKGRhdGEuc3RhdGUsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdCBzdGF0ZSB1cGRhdGVzIHRocm91Z2ggZXZlbnRzIFxuICAgICAqIFxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBkYXRhIFxuICAgICAqL1xuICAgIHByaXZhdGUgZW1pdFN0YXRlKGlkPzogc3RyaW5nLCBkYXRhPzogYW55KSB7XG4gICAgICAgIHRoaXMuZW1pdCgnc3RhdGUnLCB7IHN0YXRlOiB0aGlzLnN0YXRlIH0pO1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnc3RhdGVfJyArIGlkLCB7IHN0YXRlOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcIi4vZXZlbnQtZW1pdHRlclwiO1xuLyoqXG4gKiBEYXRhU3RvcmUgQ2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF0YVN0b3JlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ldyBNYXA7XG4gICAgICAgIHRoaXMuc25hcHNob3RTdG9yYWdlID0gbmV3IE1hcDtcbiAgICAgICAgdGhpcy5zbmFwc2hvdExvZyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBkYXRhIGZyb20gdGhlIHN0YXRlIGZvciBhbiBlZGl0YWJsZSBhcmVhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKi9cbiAgICBnZXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0KGlkKSB8fCB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzdGF0ZSBmb3IgYW4gaW5kaXZpZHVhbCBlZGl0YWJsZSBhcmVhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHVwZGF0ZShpZCwgZGF0YSkge1xuICAgICAgICBjb25zdCBwcmV2aW91c1N0YXRlID0gdGhpcy5zdGF0ZS5nZXQoaWQpO1xuICAgICAgICBpZiAocHJldmlvdXNTdGF0ZSAmJiBwcmV2aW91c1N0YXRlID09PSBkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFdhcm5pbmc6IFlvdSB1cGRhdGVkICR7aWR9IHdpdGggdGhlIHNhbWUgb2JqZWN0IGFzIGJlZm9yZS4gVGhpcyB3aWxsIGJyZWFrIHRoZSBhYmlsaXR5IHRvIHJvbGxiYWNrYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5zZXQoaWQsIGRhdGEpO1xuICAgICAgICAvLyBBcHBlbmQgdGhlIHByZXZpb3VzIHN0YXRlIGludG8gb3VyIHNuYXBzaG90IHN0b3JhZ2VcbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUpIHtcbiAgICAgICAgICAgIGxldCBzbmFwc2hvdHMgPSB0aGlzLnNuYXBzaG90U3RvcmFnZS5nZXQoaWQpO1xuICAgICAgICAgICAgaWYgKCFzbmFwc2hvdHMpIHtcbiAgICAgICAgICAgICAgICBzbmFwc2hvdHMgPSBbcHJldmlvdXNTdGF0ZV07XG4gICAgICAgICAgICAgICAgdGhpcy5zbmFwc2hvdFN0b3JhZ2Uuc2V0KGlkLCBzbmFwc2hvdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc25hcHNob3RzLnVuc2hpZnQocHJldmlvdXNTdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNuYXBzaG90TG9nLnB1c2goaWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdFN0YXRlKGlkLCBkYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIGFuIGluZGl2aWR1YWwga2V5IHdpdGhpbiBhbiBvYmplY3RzIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKi9cbiAgICB1cGRhdGVLZXkoaWQsIGRhdGEsIGtleSkge1xuICAgICAgICBsZXQgc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0YXRlLmdldChpZCkpIHx8IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZGF0YTtcbiAgICAgICAgdGhpcy51cGRhdGUoaWQsIHN0YXRlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm9sbGJhY2sgYW4gaXRlbSB0byBhIHByZXZpb3VzIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKi9cbiAgICByb2xsYmFjayhpZCkge1xuICAgICAgICBpZCA9IGlkIHx8IHRoaXMuc25hcHNob3RMb2cuc2hpZnQoKTtcbiAgICAgICAgY29uc3QgbGFzdFN0YXRlID0gdGhpcy5zbmFwc2hvdFN0b3JhZ2UuZ2V0KGlkKTtcbiAgICAgICAgaWYgKGxhc3RTdGF0ZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGxhc3RTdGF0ZS5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZXQoaWQsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5lbWl0U3RhdGUoaWQsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBvYmplY3QgZnJvbSB0aGUgc3RhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqL1xuICAgIHJlbW92ZShpZCkge1xuICAgICAgICB0aGlzLnN0YXRlLmRlbGV0ZShpZCk7XG4gICAgICAgIHRoaXMuZW1pdFN0YXRlKGlkLCBudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIGRhdGEgY2hhbmdlcyBvbiBhbiBlZGl0YWJsZSBhcmVhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaGFuZGxlclxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqL1xuICAgIHN1YnNjcmliZShoYW5kbGVyLCBpZCkge1xuICAgICAgICBsZXQgZXZlbnROYW1lID0gKGlkID8gJ3N0YXRlXycgKyBpZCA6ICdzdGF0ZScpO1xuICAgICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgKGV2ZW50LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVyKGRhdGEuc3RhdGUsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVtaXQgc3RhdGUgdXBkYXRlcyB0aHJvdWdoIGV2ZW50c1xuICAgICAqXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICBlbWl0U3RhdGUoaWQsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzdGF0ZScsIHsgc3RhdGU6IHRoaXMuc3RhdGUgfSk7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdzdGF0ZV8nICsgaWQsIHsgc3RhdGU6IGRhdGEgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
