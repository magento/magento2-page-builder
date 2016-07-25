define([
    'uiComponent',
    'bluefoot/stage/build'
], function (Component, StageBuild) {

    return Component.extend({
        initialize: function () {
            this._super();
            this._initialized = false;
        },
        init: function () {
            var self = this;
            // The app requires the core hook system to be running very early on
            require(['bluefoot/hook'], function (Hook) {

                // Declare our plugins system
                require(['bluefoot/plugins'], function (Plugins) {

                    // Prepare the plugin aspect of the system
                    Plugins.prepare(function () {

                        // Initialize the basic config to load in plugins
                        require(['bluefoot/stage', 'bluefoot/jquery', 'bluefoot/cms-config', 'bluefoot/modal'], function (StageClass, jQuery, InitConfig) {

                            Plugins.load('onPageLoad', function () {

                                self._initialized = true;

                                // Detect and load any saved page builder data
                                StageBuild.init();

                                // Remove any other click events
                                jQuery(document).off('click', InitConfig.init_button_class);
                                jQuery(document).on('click', InitConfig.init_button_class, function (event) {

                                    /**
                                     * Create a new instance of the stage
                                     *
                                     * Each Gene CMS instance is ran by a stage, this handles all operations of the "page builder" which
                                     * is refereed to in code as the stage
                                     */
                                    var Stage = new StageClass();
                                    Stage.init(jQuery(event.currentTarget));

                                }.bind(this));

                            });

                        });

                    });

                });

            });
        }
    });
});