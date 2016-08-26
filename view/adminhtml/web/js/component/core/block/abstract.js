/**
 * - Abstract.js
 * Abstract class for all content / page builder blocks that are added to the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'jquery',
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/edit',
    'mage/translate',
    'bluefoot/block/preview/abstract'
], function (ko, $, AbstractStructural, Edit, $t, Preview) {

    /**
     * Class for entity blocks being included on the page
     *
     * @param parent
     * @param stage
     * @param config
     * @constructor
     */
    function AbstractBlock(parent, stage, config) {
        AbstractStructural.call(this, parent, stage);

        this.config = config;
        this.preview = new Preview(this, config);
        this.data.subscribe(function (update) {
            this.preview.update(update);
        }.bind(this));
    }

    AbstractBlock.prototype = Object.create(AbstractStructural.prototype);
    var $super = AbstractStructural.prototype;

    /**
     * Build up the options available on a row
     */
    AbstractBlock.prototype.buildOptions = function () {
        // Run the parent
        $super.buildOptions.apply(this, arguments);

        // Add column option
        this.options.addOption(this, 'edit', '<i class="fa fa-pencil"></i>', $t('Edit'), this.edit.bind(this), ['edit-block'], 50);
    };

    /**
     * Edit a block
     */
    AbstractBlock.prototype.edit = function () {
        var edit = new Edit(this);
        return edit.open();
    };

    /**
     * Return the template for the element
     *
     * @returns {string}
     */
    AbstractBlock.prototype.getTemplate = function () {
        // If a preview template is set, the entity shall use that instead
        if (this.preview.getPreviewTemplate()) {
            return this.preview.getPreviewTemplate();
        }
        return 'Gene_BlueFoot/component/core/block/abstract.html'
    };

    /**
     * Event called when sorting starts on this element
     *
     * @param sortableThis
     * @param event
     * @param ui
     * @param sortableInstance
     */
    AbstractBlock.prototype.onSortStart = function (sortableThis, event, ui, sortableInstance) {
        // Copy over the column class for the width
        ui.helper.html(jQuery('<h3 />').text(this.config.name));

        // Run the parent
        return $super.onSortStart.apply(this, arguments);
    };

    return AbstractBlock;
});