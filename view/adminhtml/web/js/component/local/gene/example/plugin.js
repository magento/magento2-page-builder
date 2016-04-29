/**
 * Example Plugin for BlueFoot
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['hook'], function (Hook) {

    // Declare any events
    Hook.attach('gene-bluefoot-before-stage-init', function ($hook) {
        // Do various logic
        $hook.done();
    });

    return {
        /**
         * Initialize function called by the CMS
         */
        init: function () {
            // Do any init logic
        }
    };
});