/**
 * - Inline.js
 * Inline block, handles blocks which can be edited inline
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'underscore',
    'ko',
    'jquery',
    'Gene_BlueFoot/js/component/core/block/abstract'
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
        AbstractBlock.call(this, parent, stage, config, formData);
        this.ns = 'Gene_BlueFoot/js/component/core/block/inline';

        this.editOnInsert = false;
    }

    InlineBlock.prototype = Object.create(AbstractBlock.prototype);
    var $super = AbstractBlock.prototype;

    return InlineBlock;
});