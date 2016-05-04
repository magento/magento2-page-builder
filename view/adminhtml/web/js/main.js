define(['bluefoot/stage/build'], function (StageBuild) {

    var _initialized = false;

    // The app requires the core hook system to be running very early on
    require(['bluefoot/hook'], function (Hook) {

        // Declare our plugins system
        require(['bluefoot/plugins'], function (Plugins) {

            // Prepare the plugin aspect of the system
            Plugins.prepare(function () {

                // Initialize the basic config to load in plugins
                require(['bluefoot/stage', 'bluefoot/jquery', 'bluefoot/cms-config', 'bluefoot/modal'], function (StageClass, jQuery, InitConfig) {

                    Plugins.load('onPageLoad', function () {

                        _initialized = true;

                        // Detect and load any saved page builder data
                        StageBuild.init();

                        // Remove any other click events
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

    /**
     * Check to see if the system has been initialized yet every 100ms
     */
    var callbackFn = function () {
        if (_initialized == true) {
            StageBuild.init();
        } else {
            setTimeout(callbackFn, 100);
        }
    };

    return callbackFn;
});