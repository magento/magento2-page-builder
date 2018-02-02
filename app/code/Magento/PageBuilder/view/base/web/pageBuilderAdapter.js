/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable strict */
define([
    'jquery'
], function () {
    'use strict';

    var pageBuilderWysiwyg = Class.create();

    pageBuilderWysiwyg.prototype = {

        /**
         * @param {String} htmlId
         * @param {Object} config
         */
        initialize: function (htmlId, config) {
            this.config = config;
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
