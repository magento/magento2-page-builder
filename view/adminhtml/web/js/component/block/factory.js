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
                return resolve(new BlockInstance(parent, stage, config, formData));
            }, function (error) {
                return reject(error);
            });
        });
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUJsb2NrIiwiZ2V0QmxvY2tDb21wb25lbnRQYXRoIiwiY29uZmlnIiwianNfYmxvY2siLCJwYXJlbnQiLCJzdGFnZSIsImZvcm1EYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1aXJlIiwiQmxvY2tJbnN0YW5jZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7c0JBZ0NjQSxXO0FBdkJkOzs7Ozs7QUFNQSxhQUFBQyxxQkFBQSxDQUErQkMsTUFBL0IsRUFBbUQ7QUFDL0MsZUFBT0EsT0FBT0MsUUFBUCxJQUFtQix5QkFBMUI7QUFDSDtBQUVEOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNjLGFBQUFILFdBQUEsQ0FBc0JFLE1BQXRCLEVBQTRDRSxNQUE1QyxFQUEyRUMsS0FBM0UsRUFBa0dDLFFBQWxHLEVBQW1IO0FBQzdIRCxnQkFBUUEsU0FBU0QsT0FBT0MsS0FBeEI7QUFDQUMsbUJBQVdBLFlBQVksRUFBdkI7QUFDQSxlQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUF5QjtBQUN4Q0Msb0JBQVEsQ0FBQ1Qsc0JBQXNCQyxNQUF0QixDQUFELENBQVIsRUFBeUMsVUFBQ1MsYUFBRCxFQUE0QjtBQUNqRSx1QkFBT0gsUUFBUSxJQUFJRyxhQUFKLENBQWtCUCxNQUFsQixFQUEwQkMsS0FBMUIsRUFBaUNILE1BQWpDLEVBQXlDSSxRQUF6QyxDQUFSLENBQVA7QUFDSCxhQUZELEVBRUcsVUFBQ00sS0FBRCxFQUFjO0FBQ2IsdUJBQU9ILE9BQU9HLEtBQVAsQ0FBUDtBQUNILGFBSkQ7QUFLSCxTQU5NLENBQVA7QUFPSCIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svZmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3RhZ2VJbnRlcmZhY2V9IGZyb20gJy4uL3N0YWdlLmQnO1xuaW1wb3J0IHtFZGl0YWJsZUFyZWFJbnRlcmZhY2V9IGZyb20gJy4uL3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7QmxvY2t9IGZyb20gJy4vYmxvY2snO1xuXG5pbnRlcmZhY2UgQ29uZmlnT2JqZWN0IHtcbiAgICBqc19ibG9jaz86IHN0cmluZztcbiAgICBba2V5OiBzdHJpbmddOiBhbnlcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgYmxvY2sgaW5zdGFuY2UgZnJvbSB0aGUgY29uZmlnIG9iamVjdFxuICpcbiAqIEBwYXJhbSBjb25maWdcbiAqIEByZXR1cm5zIHthbnl8c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRCbG9ja0NvbXBvbmVudFBhdGgoY29uZmlnOiBDb25maWdPYmplY3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBjb25maWcuanNfYmxvY2sgfHwgJ2JsdWVmb290L2Jsb2NrL2Fic3RyYWN0Jztcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBibG9ja1xuICpcbiAqIEBwYXJhbSBjb25maWdcbiAqIEBwYXJhbSBwYXJlbnRcbiAqIEBwYXJhbSBzdGFnZVxuICogQHBhcmFtIGZvcm1EYXRhXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja0ludGVyZmFjZT59XG4gKi9cbi8vIGV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUJsb2NrKGNvbmZpZzogQ29uZmlnT2JqZWN0LCBwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSwgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlLCBmb3JtRGF0YT86IG9iamVjdCk6IFByb21pc2U8QmxvY2s+IHtcbi8vICAgICBsZXQgYzogdHlwZW9mIEJsb2NrID0gYXdhaXQgaW1wb3J0KGdldEJsb2NrQ29tcG9uZW50UGF0aChjb25maWcpKTtcbi8vICAgICByZXR1cm4gbmV3IGMocGFyZW50LCBzdGFnZSB8fCBwYXJlbnQuc3RhZ2UsIGNvbmZpZywgZm9ybURhdGEgfHwge30pO1xuLy8gfVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQmxvY2soY29uZmlnOiBDb25maWdPYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGZvcm1EYXRhPzogb2JqZWN0KTogUHJvbWlzZTxCbG9jaz4ge1xuICAgIHN0YWdlID0gc3RhZ2UgfHwgcGFyZW50LnN0YWdlO1xuICAgIGZvcm1EYXRhID0gZm9ybURhdGEgfHwge307XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVxdWlyZShbZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZyldLCAoQmxvY2tJbnN0YW5jZTogdHlwZW9mIEJsb2NrKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShuZXcgQmxvY2tJbnN0YW5jZShwYXJlbnQsIHN0YWdlLCBjb25maWcsIGZvcm1EYXRhKSk7XG4gICAgICAgIH0sIChlcnJvcjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59Il19
