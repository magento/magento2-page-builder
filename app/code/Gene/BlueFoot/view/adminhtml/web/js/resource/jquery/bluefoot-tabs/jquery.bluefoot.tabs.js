/*
 * BlueFoot Tabs JS
 * Very basic tabs js
 * @author Hob Adams <hob@gene.co.uk>
 */
(function (jQuery) {
    jQuery.fn.bluefootTabs = function (options) {

        var opts = jQuery.extend( {}, jQuery.fn.bluefootTabs.defaults, options );
        var container = jQuery(this);

        container.find(opts.links).on('click', function() {

            /* Check if the tab is already active */
            if (!jQuery(this).hasClass('active')){

                /* Remove Active Classes from all links + tabs inside container */
                container.find(opts.links).removeClass('active');
                container.find(opts.content).removeClass('active');

                /* Add Active class to the new element */
                var target = jQuery(this).data('tab');
                jQuery(target).addClass('active');
                jQuery(this).addClass('active');

            }
            return false;
        });
    };


    jQuery.fn.bluefootTabs.defaults = {
        links: '.bluefoot-tab',
        content: '.bluefoot-tab-content'
    };
})(jQuery);
