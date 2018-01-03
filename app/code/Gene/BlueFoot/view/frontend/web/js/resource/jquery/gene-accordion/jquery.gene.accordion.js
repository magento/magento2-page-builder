/*
 * Gene Accordion JS
 *
 * Very basic accordion plugin stripped down to be used with the BlueFoot
 */
(function (jQuery) {
    jQuery.fn.geneAccordion = function (options) {

        var opts = jQuery.extend( {}, jQuery.fn.geneAccordion.defaults, options );
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
     * links - CSS Identifier of Accordion link | default '.gene-accordion-link'
     * inner - CSS Identifier of Accordion Content | default '.gene-accordion-inner'
     * outer - CSS Identifier of Accordion Outer | default '.gene-accordion-outer'
     */
    jQuery.fn.geneAccordion.defaults = {
        links: '.gene-accordion-link',
        inner: '.gene-accordion-inner',
        outer: '.gene-accordion-outer'
    };
})(jQuery);