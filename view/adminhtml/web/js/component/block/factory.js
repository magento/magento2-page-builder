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
        return config.js_block || 'bluefoot/block/abstract';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUJsb2NrIiwiZ2V0QmxvY2tDb21wb25lbnRQYXRoIiwiY29uZmlnIiwianNfYmxvY2siLCJwYXJlbnQiLCJzdGFnZSIsImZvcm1EYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1aXJlIiwiQmxvY2tJbnN0YW5jZSIsImRlZmF1bHQiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQWdDY0EsVztBQXZCZDs7Ozs7O0FBTUEsYUFBQUMscUJBQUEsQ0FBK0JDLE1BQS9CLEVBQW1EO0FBQy9DLGVBQU9BLE9BQU9DLFFBQVAsSUFBbUIseUJBQTFCO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDYyxhQUFBSCxXQUFBLENBQXNCRSxNQUF0QixFQUE0Q0UsTUFBNUMsRUFBMkVDLEtBQTNFLEVBQWtHQyxRQUFsRyxFQUFtSDtBQUM3SEQsZ0JBQVFBLFNBQVNELE9BQU9DLEtBQXhCO0FBQ0FDLG1CQUFXQSxZQUFZLEVBQXZCO0FBQ0EsZUFBTyxJQUFJQyxPQUFKLENBQVksVUFBVUMsT0FBVixFQUFtQkMsTUFBbkIsRUFBeUI7QUFDeENDLG9CQUFRLENBQUNULHNCQUFzQkMsTUFBdEIsQ0FBRCxDQUFSLEVBQXlDLFVBQUNTLGFBQUQsRUFBbUI7QUFDeEQsdUJBQU9ILFFBQVEsSUFBSUcsY0FBY0MsT0FBbEIsQ0FBMEJSLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5Q0gsTUFBekMsRUFBaURJLFFBQWpELENBQVIsQ0FBUDtBQUNILGFBRkQsRUFFRyxVQUFDTyxLQUFELEVBQWM7QUFDYix1QkFBT0osT0FBT0ksS0FBUCxDQUFQO0FBQ0gsYUFKRDtBQUtILFNBTk0sQ0FBUDtBQU9IIiwiZmlsZSI6ImNvbXBvbmVudC9ibG9jay9mYWN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTdGFnZUludGVyZmFjZX0gZnJvbSAnLi4vc3RhZ2UuZCc7XG5pbXBvcnQge0VkaXRhYmxlQXJlYUludGVyZmFjZX0gZnJvbSAnLi4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IEJsb2NrIGZyb20gJy4vYmxvY2snO1xuXG5pbnRlcmZhY2UgQ29uZmlnT2JqZWN0IHtcbiAgICBqc19ibG9jaz86IHN0cmluZztcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgYmxvY2sgaW5zdGFuY2UgZnJvbSB0aGUgY29uZmlnIG9iamVjdFxuICpcbiAqIEBwYXJhbSBjb25maWdcbiAqIEByZXR1cm5zIHthbnl8c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRCbG9ja0NvbXBvbmVudFBhdGgoY29uZmlnOiBDb25maWdPYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuanNfYmxvY2sgfHwgJ2JsdWVmb290L2Jsb2NrL2Fic3RyYWN0Jztcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBibG9ja1xuICpcbiAqIEBwYXJhbSBjb25maWdcbiAqIEBwYXJhbSBwYXJlbnRcbiAqIEBwYXJhbSBzdGFnZVxuICogQHBhcmFtIGZvcm1EYXRhXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja0ludGVyZmFjZT59XG4gKi9cbi8vIGV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUJsb2NrKGNvbmZpZzogQ29uZmlnT2JqZWN0LCBwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSwgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlLCBmb3JtRGF0YT86IG9iamVjdCk6IFByb21pc2U8QmxvY2s+IHtcbi8vICAgICBsZXQgYzogdHlwZW9mIEJsb2NrID0gYXdhaXQgaW1wb3J0KGdldEJsb2NrQ29tcG9uZW50UGF0aChjb25maWcpKTtcbi8vICAgICByZXR1cm4gbmV3IGMocGFyZW50LCBzdGFnZSB8fCBwYXJlbnQuc3RhZ2UsIGNvbmZpZywgZm9ybURhdGEgfHwge30pO1xuLy8gfVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQmxvY2soY29uZmlnOiBDb25maWdPYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGZvcm1EYXRhPzogb2JqZWN0KTogUHJvbWlzZTxCbG9jaz4ge1xuICAgIHN0YWdlID0gc3RhZ2UgfHwgcGFyZW50LnN0YWdlO1xuICAgIGZvcm1EYXRhID0gZm9ybURhdGEgfHwge307XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVxdWlyZShbZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZyldLCAoQmxvY2tJbnN0YW5jZTogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShuZXcgQmxvY2tJbnN0YW5jZS5kZWZhdWx0KHBhcmVudCwgc3RhZ2UsIGNvbmZpZywgZm9ybURhdGEpKTtcbiAgICAgICAgfSwgKGVycm9yOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0iXX0=
