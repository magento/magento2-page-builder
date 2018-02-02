/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable strict */
define([
    "Magento_PageBuilder/pageBuilderAdapter"
], function (wysiwygAdapter) {
    var pageBuilderWysiwygSetup = Class.create({
        wysiwygInstance: null
    });

    pageBuilderWysiwygSetup.prototype = {

        /**
         * @param {*} htmlId
         * @param {Object} config
         */
        initialize: function (htmlId, config) {
            var WysiwygInstancePrototype = new wysiwygAdapter.getAdapterPrototype();

            this.wysiwygInstance = new WysiwygInstancePrototype(htmlId, config);
        }
    };
    window.pageBuilderWysiwygSetup = pageBuilderWysiwygSetup;
});
