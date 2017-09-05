define([
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/storage/strategies'
], function (AbstractContentBlock, StorageStrategies) {

    /**
     * Heading content block
     *
     * @constructor
     */
    function HeadingContentBlock() {
        AbstractContentBlock.apply(this, arguments);

        this.strategy = StorageStrategies.combined(
            { strategy: StorageStrategies.outerTagName('heading_type'), keys: ['heading_type'] },
            { strategy: StorageStrategies.htmlContent('content'), keys: ['content'] }
        );
    }
    HeadingContentBlock.prototype = Object.create(AbstractContentBlock.prototype);

    return HeadingContentBlock;
});