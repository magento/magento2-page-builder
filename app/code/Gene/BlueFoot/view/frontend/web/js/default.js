/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

requirejs(['jquery', 'fancybox', 'highlight', 'underscore', 'slick'], function ($, fancybox, hljs, _) {
    $(document).ready(function() {
        $('.bluefoot-lightbox').fancybox();

        $('pre code:not(.hljs)').each(function(i, block) {
            $(block).html(
                hljs.highlight('html', $(block).html()).value
            );
        });

        $("div[data-role='advanced-slider']").each(function (index, element) {

            /**
             * Assign a debounce and delay to the init of slick to ensure the DOM has updated
             *
             * @type {(() => any) & _.Cancelable}
             */
            _.debounce(() => {
                _.delay(() => {
                    if ($(element) && $(element).length > 0) {
                        try {
                            $(element).slick('unslick');
                        } catch (e) {
                            // This may error
                        }
                        $(element).addClass('ready');

                        $(element).slick({
                            autoplay: $(element).data('autoplay') === 1,
                            autoplaySpeed: $(element).data('autoplay-speed') || 0,
                            fade: $(element).data('fade') === 1,
                            infinite: $(element).data('is-infinite') === 1,
                            arrows: $(element).data('show-arrows') === 1,
                            dots: $(element).data('show-dots') === 1
                        });
                    }
                }, 100);
            }, 20)();
        });
    });
});
