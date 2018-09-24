/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(['jquery'], function ($) {
    'use strict';

    /**
     * Binds window navigation event handler to non-anchor elements to facilitate simulated nested anchor functionality
     * @param {Object|null} config
     * @param {Node} element
     */
    function bindClickWidget(config, element) {
        var $linkElements = $(element).find('[data-link-type]');

        $linkElements.each(function (idx, linkElement) {
            var $linkElement = $(linkElement),
                isActualAnchorElement = $linkElement.prop('nodeName') === 'A',
                href = ($linkElement.attr('href') || '').trim(),
                isValidHref = ['javascript:void(0)', ''].indexOf(href) === -1;

            if (isActualAnchorElement || !isValidHref) {
                return;
            }

            $linkElement.on('click', function (e) {
                var $nestedAnchorElementsReceivingTheClick = $(e.target).closest('a', $linkElement);

                if ($nestedAnchorElementsReceivingTheClick.length) {
                    return;
                }

                bindClickWidget.redirectTo($linkElement.attr('href'));
            });
        });
    }

    /**
     * Navigate to href in browser
     * @param {String} href
     */
    bindClickWidget.redirectTo = function (href) {
        window.location.href = href;
    };

    return bindClickWidget;
});
