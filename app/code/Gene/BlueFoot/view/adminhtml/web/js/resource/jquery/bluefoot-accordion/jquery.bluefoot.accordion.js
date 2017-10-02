/*
 * BlueFoot Accordion JS
 * @author Hob Adams <hob@gene.co.uk>
 *
 * Very basic accordion plugin stripped down to be used with the BlueFoot
 */
(function (jQuery) {
    jQuery.fn.bluefootAccordion = function (options) {

        var opts = jQuery.extend( {}, jQuery.fn.bluefootAccordion.defaults, options );
        var container = jQuery(this);

        container.find(opts.links).on('click', function() {

            var link = jQuery(this);

            // Check if the accordion is already active
            if (link.parents(opts.outer).hasClass('active')) {

                container.find(opts.inner).stop(true, true).slideUp();
                container.find(opts.outer).removeClass('active');

            } else {

                container.find(opts.inner).stop(true, true).slideUp();
                container.find(opts.outer).removeClass('active');
                link.parents(opts.outer).addClass('active').find(opts.inner).stop(true, true).slideDown();
            }
            return false;
        });
    };

    /*
     * links - CSS Identifier of Accordion link | default '.bluefoot-accordion-link'
     * inner - CSS Identifier of Accordion Content | default '.bluefoot-accordion-inner'
     * outer - CSS Identifier of Accordion Outer | default '.bluefoot-accordion-outer'
     */
    jQuery.fn.bluefootAccordion.defaults = {
        links: '.bluefoot-accordion-link',
        inner: '.bluefoot-accordion-inner',
        outer: '.bluefoot-accordion-outer'
    };
})(jQuery);