/**
 * - Inline.js
 * Inline block, handles blocks which can be edited inline
 *
 */
define([
    'underscore',
    'ko',
    'jquery',
    'Gene_BlueFoot/js/component/block/abstract'
], function (_, ko, $, AbstractBlock) {

    /**
     * Class for entity blocks being included on the page
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     * @constructor
     */
    function InlineBlock(parent, stage, config, formData) {
        AbstractBlock.apply(this, arguments);
        this.ns = 'Gene_BlueFoot/js/component/block/inline';

        this.editOnInsert = false;
    }

    InlineBlock.prototype = Object.create(AbstractBlock.prototype);
    var $super = AbstractBlock.prototype;

    return InlineBlock;
});