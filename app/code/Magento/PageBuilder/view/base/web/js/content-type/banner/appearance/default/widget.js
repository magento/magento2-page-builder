/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'Magento_PageBuilder/js/widget/show-on-hover',
    'Magento_PageBuilder/js/widget/video-background'
], function (showOnHover, videoBackground) {
    'use strict';

    return function (config, element) {
        showOnHover(config);

        var videoElement = element[0].querySelector('[data-background-type=video]');
        if (videoElement) {
            videoBackground(config, videoElement);
        }
    };
});
