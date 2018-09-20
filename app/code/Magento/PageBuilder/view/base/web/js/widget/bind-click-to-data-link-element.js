/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery'], function ($) {
    'use strict';

    return function (config, element) {
        var $linkElements = $(element).find('[data-link-type]');

        $linkElements.each(function (idx, linkElement) {
            var $linkElement = $(linkElement);

            if ($linkElement.prop('nodeName') === 'A' || !$linkElement.attr('href')) {
                return;
            }

            $linkElement.on('click', function (e) {
                var $nestedAnchorElementsReceivingTheClick = $(e.target).closest('a', $linkElement);

                if ($nestedAnchorElementsReceivingTheClick.length) {
                    return;
                }

                window.location.href = $linkElement.attr('href');
            });
        });
    };
});
