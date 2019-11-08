/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define(['underscore', 'jquery', 'Magento_PageBuilder/js/events'], function (_, $, events) {
    'use strict';

    return function (target) {
        return function (config, element) {
            var result = target(config, element),
                stageId = $(element).parents('[data-role="pagebuilder-stage"]').attr('id'),
                $element = $(element);

            if ($element.data('appearance') === 'contained') {
                $element = $(element).find('[data-element="inner"]');
            }

            // If Parallax isn't enabled, let's not attach the event
            if ($element.data('enableParallax') !== 1) {
                return result;
            }

            // Listen for full screen events and destroy and rebuild jarallax
            events.on('stage:' + stageId + ':fullScreenModeChangeAfter', function () {
                _.delay(function () {
                    $element.jarallax('destroy');
                    target(config, element);
                }, 350);
            });

            return result;
        };
    };
});
