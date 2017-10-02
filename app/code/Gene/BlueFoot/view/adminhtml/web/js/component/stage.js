/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/editable-area',
    'ko',
    'underscore',
    'bluefoot/stage/save',
    'bluefoot/stage/structural/row',
    'bluefoot/utils/array',
    'uiRegistry',
    'mageUtils'
], function (EditableArea, ko, _, Save, Row, arrayUtil, registry, utils) {

    /**
     * Stage Class
     *
     * @constructor
     */
    function Stage(parent, stageId, stageContent) {
        this.id = stageId;

        // All EditableArea's should have a reference to parent & stage
        this.parent = parent;
        this.stage = this;

        this.stageContent = stageContent;
        this.active = true;
        this.showBorders = parent.showBorders;
        this.userSelect = parent.userSelect;
        this.loading = parent.loading;

        this.save = new Save(
            this,
            this.parent.value
        );
        this.save.observe(this.stageContent);

        this.serializeRole = 'stage';
        this.serializeChildren = [this.stageContent];

        EditableArea.call(this, this.stageContent, this);

        this.on('sortingStart', this.onSortingStart.bind(this));
        this.on('sortingStop', this.onSortingStop.bind(this));
    }
    Stage.prototype = Object.create(EditableArea.prototype);

    /**
     * Build the stage
     */
    Stage.prototype.build = function (buildInstance, buildStructure) {
        var self = this;
        if (buildInstance && buildStructure) {
            buildInstance.buildStage(this, buildStructure)
                .on('buildDone', self.ready.bind(self))
                .on('buildError', function (event, error) {
                    // Inform the user that an issue has occurred
                    self.parent.alertDialog({
                        title: 'Advanced CMS Error',
                        content: "An error has occurred whilst initiating the Advanced CMS content area.\n\n Please consult " +
                        "with your development team on how to resolve."
                    });

                    self.emit('stageError', error);
                    console.error(error);
                });
        } else {
            // If no build instance is present we're initiating a new stage
            this.addRow(this);
            this.ready();
        }
    };

    /**
     * The stage has been initiated fully and is ready
     */
    Stage.prototype.ready = function () {
        this.emit('stageReady');
        this.stageContent.valueHasMutated();
        this.loading(false);
    };

    /**
     * Add a row to the content
     *
     * @param self
     * @param data
     */
    Stage.prototype.addRow = function (self, data) {
        var row = new Row(self, self);
        row.data(data);
        this.addChild(row);

        return row;
    };

    /**
     * Open the template manager; passing the stage context through
     */
    Stage.prototype.openTemplateManager = function() {
        registry.get('bluefoot_template_manager.bluefoot_template_manager').openManager(this);
    };

    /**
     * Run the apply function passed from the parent,
     * to add a new sidebar UI component from
     * modules detected in the DOM.
     */
    Stage.prototype.addComponent = function () {
        return this.parent.applyConfigFor.apply(null, arguments);
    };

    /**
     * Event handler for any element being sorted in the stage
     */
    Stage.prototype.onSortingStart = function () {
        this.showBorders(true);
    };

    /**
     * Event handler for when sorting stops
     */
    Stage.prototype.onSortingStop = function () {
        this.showBorders(false);
    };

    return Stage;
});