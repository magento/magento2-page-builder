/**
 * - Abstract.js
 * Abstract class for all content / page builder blocks that are added to the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'underscore',
    'ko',
    'jquery',
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/edit',
    'mage/translate',
    'bluefoot/stage/previews'
], function (_, ko, $, AbstractStructural, Edit, $t, Preview) {

    /**
     * Class for entity blocks being included on the page
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     * @constructor
     */
    function AbstractBlock(parent, stage, config, formData) {
        AbstractStructural.call(this, parent, stage);

        this.config = config;

        var previewInstance = Preview.get(this.config);
        this.preview = new previewInstance(this, config);

        this.childEntityKeys = [];

        this.data.subscribe(function (update) {
            this.preview.update(update);
        }.bind(this));

        // Update the abstract with some form data
        if (formData) {
            this.data(formData);
        }
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
        return new Edit(this);
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

    /**
     * Add a child to the current element
     *
     * @param child
     * @param index
     * @param key
     */
    AbstractBlock.prototype.addChild = function (child, index, key) {
        if (typeof key === 'undefined' || !key) {
            console.error('Field must be specified when adding a child to an entity.');
            return false;
        }

        // Update the data object to contain an object
        if (typeof this.data()[key] !== 'object' && !Array.isArray(this.data()[key])) {
            this.data()[key] = [];
        }

        // Add the child into the children data
        this.data()[key].push(child);
        this.childEntityKeys = _.union(this.childEntityKeys, [key]);

        return false;
    };

    /**
     * To JSON
     *
     * @returns {{children, formData}|{children: Array}}
     */
    AbstractBlock.prototype.toJSON = function () {
        var json = $super.toJSON.apply(this, arguments);
        json.contentType = this.config.code;

        // Reset children back to an object
        json.children = {};
        if (this.childEntityKeys.length > 0) {
            _.forEach(this.childEntityKeys, function (key) {
                json.children[key] = [];
                if (typeof this.data()[key] === 'object' && Array.isArray(this.data()[key])) {
                    _.forEach(this.data()[key], function (child) {
                        json.children[key].push(child.toJSON());
                    });
                }
                delete json.formData[key];
            }.bind(this))
        }

        console.log(json);

        return json;
    };

    return AbstractBlock;
});