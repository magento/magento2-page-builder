/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable strict */
define([
    'jquery',
    'ko',
    'Magento_PageBuilder/js/form/element/wysiwyg'
], function ($, ko, wysiwyg) {
    'use strict';

    var pageBuilderWysiwyg = Class.create();

    pageBuilderWysiwyg.prototype = {

        /**
         * @param {String} htmlId
         * @param {Object} config
         */
        initialize: function (htmlId, config) {

            //initialize wysiwyg component
            wysiwyg.defaults.wysiwygConfig(config);

        },

        /**
         * @returns {Object}
         */
        getAdapterPrototype: function () {
            return pageBuilderWysiwyg;
        }
    };

    return pageBuilderWysiwyg.prototype;
});
