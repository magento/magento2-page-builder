define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = createBlock;
    /**
     * Retrieve the block instance from the config object
     *
     * @param config
     * @returns {any|string}
     */
    function getBlockComponentPath(config) {
        return config.js_block || 'Gene_BlueFoot/js/component/block/block';
    }
    /**
     * Create a new instance of a block
     *
     * @param config
     * @param parent
     * @param stage
     * @param formData
     * @returns {Promise<BlockInterface>}
     */
    // export default async function createBlock(config: ConfigObject, parent: EditableAreaInterface, stage: StageInterface, formData?: object): Promise<Block> {
    //     let c: typeof Block = await import(getBlockComponentPath(config));
    //     return new c(parent, stage || parent.stage, config, formData || {});
    // }
    function createBlock(config, parent, stage, formData) {
        stage = stage || parent.stage;
        formData = formData || {};
        return new Promise(function (resolve, reject) {
            require([getBlockComponentPath(config)], function (BlockInstance) {
                return resolve(new BlockInstance.default(parent, stage, config, formData));
            }, function (error) {
                return reject(error);
            });
        });
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUJsb2NrIiwiZ2V0QmxvY2tDb21wb25lbnRQYXRoIiwiY29uZmlnIiwianNfYmxvY2siLCJwYXJlbnQiLCJzdGFnZSIsImZvcm1EYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1aXJlIiwiQmxvY2tJbnN0YW5jZSIsImRlZmF1bHQiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQWdDY0EsVztBQXZCZDs7Ozs7O0FBTUEsYUFBQUMscUJBQUEsQ0FBK0JDLE1BQS9CLEVBQW1EO0FBQy9DLGVBQU9BLE9BQU9DLFFBQVAsSUFBbUIsd0NBQTFCO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDYyxhQUFBSCxXQUFBLENBQXNCRSxNQUF0QixFQUE0Q0UsTUFBNUMsRUFBMkVDLEtBQTNFLEVBQWtHQyxRQUFsRyxFQUFtSDtBQUM3SEQsZ0JBQVFBLFNBQVNELE9BQU9DLEtBQXhCO0FBQ0FDLG1CQUFXQSxZQUFZLEVBQXZCO0FBQ0EsZUFBTyxJQUFJQyxPQUFKLENBQVksVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBeUI7QUFDeENDLG9CQUFRLENBQUNULHNCQUFzQkMsTUFBdEIsQ0FBRCxDQUFSLEVBQXlDLFVBQUNTLGFBQUQsRUFBdUI7QUFDNUQsdUJBQU9ILFFBQVEsSUFBSUcsY0FBY0MsT0FBbEIsQ0FBMEJSLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5Q0gsTUFBekMsRUFBaURJLFFBQWpELENBQVIsQ0FBUDtBQUNILGFBRkQsRUFFRyxVQUFDTyxLQUFELEVBQWtCO0FBQ2pCLHVCQUFPSixPQUFPSSxLQUFQLENBQVA7QUFDSCxhQUpEO0FBS0gsU0FOTSxDQUFQO0FBT0giLCJmaWxlIjoiY29tcG9uZW50L2Jsb2NrL2ZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N0YWdlSW50ZXJmYWNlfSBmcm9tICcuLi9zdGFnZS5kJztcbmltcG9ydCB7RWRpdGFibGVBcmVhSW50ZXJmYWNlfSBmcm9tICcuLi9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgQmxvY2sgZnJvbSAnLi9ibG9jayc7XG5cbmludGVyZmFjZSBDb25maWdPYmplY3Qge1xuICAgIGpzX2Jsb2NrPzogc3RyaW5nO1xuICAgIFtrZXk6IHN0cmluZ106IGFueVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBibG9jayBpbnN0YW5jZSBmcm9tIHRoZSBjb25maWcgb2JqZWN0XG4gKlxuICogQHBhcmFtIGNvbmZpZ1xuICogQHJldHVybnMge2FueXxzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEJsb2NrQ29tcG9uZW50UGF0aChjb25maWc6IENvbmZpZ09iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5qc19ibG9jayB8fCAnR2VuZV9CbHVlRm9vdC9qcy9jb21wb25lbnQvYmxvY2svYmxvY2snO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGJsb2NrXG4gKlxuICogQHBhcmFtIGNvbmZpZ1xuICogQHBhcmFtIHBhcmVudFxuICogQHBhcmFtIHN0YWdlXG4gKiBAcGFyYW0gZm9ybURhdGFcbiAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrSW50ZXJmYWNlPn1cbiAqL1xuLy8gZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQmxvY2soY29uZmlnOiBDb25maWdPYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGZvcm1EYXRhPzogb2JqZWN0KTogUHJvbWlzZTxCbG9jaz4ge1xuLy8gICAgIGxldCBjOiB0eXBlb2YgQmxvY2sgPSBhd2FpdCBpbXBvcnQoZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZykpO1xuLy8gICAgIHJldHVybiBuZXcgYyhwYXJlbnQsIHN0YWdlIHx8IHBhcmVudC5zdGFnZSwgY29uZmlnLCBmb3JtRGF0YSB8fCB7fSk7XG4vLyB9XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVCbG9jayhjb25maWc6IENvbmZpZ09iamVjdCwgcGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSwgZm9ybURhdGE/OiBvYmplY3QpOiBQcm9taXNlPEJsb2NrPiB7XG4gICAgc3RhZ2UgPSBzdGFnZSB8fCBwYXJlbnQuc3RhZ2U7XG4gICAgZm9ybURhdGEgPSBmb3JtRGF0YSB8fCB7fTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXF1aXJlKFtnZXRCbG9ja0NvbXBvbmVudFBhdGgoY29uZmlnKV0sIChCbG9ja0luc3RhbmNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG5ldyBCbG9ja0luc3RhbmNlLmRlZmF1bHQocGFyZW50LCBzdGFnZSwgY29uZmlnLCBmb3JtRGF0YSkpO1xuICAgICAgICB9LCAoZXJyb3I6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSJdfQ==
