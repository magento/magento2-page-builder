/**
 * - Save.js
 * Handles saving the data from within the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/config'
], function (Config) {

    /**
     * Our Stage class
     *
     * @constructor
     */
    function Save(stage) {
        this.stage = stage;
        this.input = false;

        this.deleted = [];

        this.init();
    }

    /**
     * Build up our save instance
     */
    Save.prototype.init = function () {
        this.stage.stageContent.subscribe(function () {
            this.update();
        }.bind(this));
    };

    /**
     * Update our fellow input
     */
    Save.prototype.update = function () {
        this.stage.parent.value(
            Config.getInitConfig('encode_string') + JSON.stringify(this.stage.toJSON())
        );
    };

    /**
     * When an entity is deleted we need to clean up by removing it's entry in the database
     *
     * @param entityId
     */
    Save.prototype.delete = function (entityId) {
        this.deleted.push(entityId);
    };

    /**
     * Return the JSON data
     * @returns {*}
     */
    Save.prototype.getData = function () {
        return JSON.parse(this.input.val());
    };

    return Save;
});
