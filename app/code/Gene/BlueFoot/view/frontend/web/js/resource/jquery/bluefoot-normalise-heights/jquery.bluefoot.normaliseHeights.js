/*eslint-disable */

/*
 * BlueFoot Normalise Heights JS
 *
 * Plugin to normalise the heights of blocks within a container
 *
 */
(function (jQuery) {
    'use strict';
    jQuery.fn.bluefootNormaliseHeights = function (options) {

        var opts = jQuery.extend( {}, jQuery.fn.bluefootNormaliseHeights.defaults, options );
        var container = jQuery(this);
        var resizeTimeout;

        /**
         * Main normalise function
         */
        function normalise()
        {
            if (container.length > 0) {

                // Loop through each container
                container.each(function(){
                    var block = jQuery(this).find(opts.block);
                    
                    // Reset heights
                    block.height('');
                    // Only run if there is more than one 'block'
                    if (block.length > 1) {
                        var $height = 0;

                        // Loop through each 'block' and change the variable height if it's bigger
                        block.each(function(){
                            if (jQuery(this).height() > $height) {
                                $height = jQuery(this).height();
                            }
                        }).promise().done(function(){
                            block.height($height);
                        });
                    }
                });
            }
        }
        // Run the normalise function
        normalise();

        // Run the normalise function on window load
        jQuery(window).load(function () {
            normalise();
        });

        // Run the normalise function on window resize (with a 1 second delay)
        jQuery(window).resize(function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(normalise(), 1000);
        });
    };


    /**
     * block - CSS Identifier of block | default '.bluefoot-normalise-heights'
     */
    jQuery.fn.bluefootNormaliseHeights.defaults = {
        block: '.bluefoot-normalise-heights'
    };
})(jQuery);
