// The app requires the core hook system to be running very early on
require(['bluefoot/hook'], function (Hook) {

    // Declare our plugins system
    require(['bluefoot/plugins'], function (Plugins) {

        // Prepare the plugin aspect of the system
        Plugins.prepare(function () {

            // Initialize the basic config to load in plugins
            require(['bluefoot/stage', 'bluefoot/stage/build', 'bluefoot/jquery', 'bluefoot/cms-config', 'bluefoot/modal'], function (StageClass, StageBuild, jQuery, InitConfig) {

                Plugins.load('onPageLoad', function () {

                    // Detect and load any saved page builder data
                    StageBuild.init();

                    // @todo find out a better way of calling this
                    window.buildBlueFoot = function () {
                        setTimeout(function () {
                            StageBuild.init();
                        }, 1000);
                    };

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
