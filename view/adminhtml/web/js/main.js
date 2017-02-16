/**
 * - Main.js
 * Entry point for BlueFoot JS framework
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'uiComponent',
    'bluefoot/stage/build',
    'bluefoot/hook',
    'bluefoot/stage',
    'jquery',
    'bluefoot/cms-config',
    'bluefoot/modal'
], function (
    Component,
    StageBuild,
    Hook,
    StageClass,
    jQuery,
    InitConfig
) {
    /**
     * Create a new component for BlueFoot to intercept
     */
    return Component.extend({
        initialize: function () {
            this._super();
            this._initialized = false;
        },
        init: function () {
            this._initialized = true;

            // Detect and load any saved page builder data
            StageBuild.init();

            // Remove any other click events
            jQuery(document).off('click', InitConfig.init_button_class);
            jQuery(document).on('click', InitConfig.init_button_class, function (event) {

                /**
                 * Create a new instance of the stage
                 *
                 * Each BlueFoot instance is ran by a stage, this handles all operations of the "page builder" which
                 * is refereed to in code as the stage
                 */
                var Stage = new StageClass();
                Stage.init(jQuery(event.currentTarget));

            }.bind(this));
        }
    });
});