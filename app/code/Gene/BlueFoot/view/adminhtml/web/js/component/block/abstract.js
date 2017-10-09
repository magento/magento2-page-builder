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
    'mage/translate',
    'bluefoot/stage/previews'
], function (_, ko, $, AbstractStructural, $t, Preview) {

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
        this.ns = 'Gene_BlueFoot/js/component/block/abstract';

        this.config = config;
        this.editOnInsert = true;
        if (typeof config.editOnInsert !== 'undefined') {
            this.editOnInsert = config.editOnInsert;
        }

        var previewInstance = Preview.get(this.config);
        this.preview = new previewInstance(this, config);

        this.childEntityKeys = [];
        this.populateChildEntityKeys(config.fields);

        this.data.subscribe(function (update) {
            this.preview.update(update);
        }.bind(this));

        // Update the abstract with some form data
        if (formData) {
            this.data(formData);
        }

        this.serializeRole = this.config.code;
        this.dataEntityDataIgnore = ['preview_view'];

        // Attach specific events to the block
        this.on('blockReady', this.onBlockReady.bind(this));
        this.on('blockMoved', this.onBlockMoved.bind(this));
    }

    AbstractBlock.prototype = Object.create(AbstractStructural.prototype);
    var $super = AbstractStructural.prototype;

    /**
     * Copy data across to new instance
     *
     * @param duplicate
     * @returns {AbstractBlock}
     */
    AbstractBlock.prototype.duplicateData = function (duplicate) {
        // Run the parent
        $super.duplicateData.apply(this, arguments);

        // Strip out any entity ID's
        var data = duplicate.data();
        data.entity_id = false;
        if (data.preview_view) {
            data.preview_view.entity_id = false;
        }

        // Handle data in child entities
        if (this.childEntityKeys.length > 0) {
            ko.utils.arrayForEach(this.childEntityKeys, function (childEntityKey) {
                data[childEntityKey] = [];
                ko.utils.arrayForEach(this.data()[childEntityKey], function (childEntity, index) {
                    childEntity.duplicate(false, childEntity, function (childDuplicate) {
                        childDuplicate.parent = duplicate;
                        duplicate.addChild(childDuplicate, index, childEntityKey);
                    });
                });
            }.bind(this));
        }

        duplicate.data(data);

        return this;
    };

    /**
     * Provide the arguments needed to duplicate this element
     * @returns {*[]}
     */
    AbstractBlock.prototype.duplicateArgs = function () {
        return [this.parent, this.stage, this.config, this.data()];
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

        return 'Gene_BlueFoot/component/block/abstract.html'
    };

    /**
     * Event called when sorting starts on this element
     *
     * @param event
     * @param params
     * @returns {*}
     */
    AbstractBlock.prototype.onSortStart = function (event, params) {
        // Copy over the column class for the width
        params.helper.html(jQuery('<h3 />').text(this.config.name));

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

        // Ensure the child entitys key is added into our array. This is covered by populateChildEntityKeys but this
        // can catch extra children that aren't part of fields
        this.childEntityKeys = _.union(this.childEntityKeys, [key]);

        return false;
    };

    /**
     * Populate the child entity keys on construct
     *
     * @param fields
     */
    AbstractBlock.prototype.populateChildEntityKeys = function (fields) {
        _.forEach(fields, function (field) {
            if (field.widget == 'child_block') {
                this.childEntityKeys = _.union(this.childEntityKeys, [field.code]);
            }
        }.bind(this));
    };

    /**
     * Event ran after the block is ready
     */
    AbstractBlock.prototype.onBlockReady = function () {
        if (this.editOnInsert) {
            this.edit();
        }
    };

    /**
     * Update the instance
     */
    AbstractBlock.prototype.onBlockMoved = function () {
        this.preview.update(this.data());
    };

    return AbstractBlock;
});