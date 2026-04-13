/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

/* global MediabrowserUtility, widgetTools, MagentovariablePlugin */
define([
    'Magento_Ui/js/form/element/textarea',
    'Magento_PageBuilder/js/config',
    'mage/adminhtml/wysiwyg/widget'
], function (Textarea, Config) {
    'use strict';

    var HTML_ID_PLACEHOLDER = 'HTML_ID_PLACEHOLDER';

    return Textarea.extend({
        defaults: {
            elementTmpl: 'Magento_PageBuilder/form/element/html-code',
            validationParams: {}
        },

        /**
         * @inheritdoc
         */
        initialize: function () {
            this._super();
            this.validationParams.allowUtf8mb4 = Config.getConfig('allowUtf8mb4') === true;

            return this;
        },

        /**
         * Click event for Insert Widget Button
         */
        clickInsertWidget: function () {
            return widgetTools.openDialog(
                this.widgetUrl.replace(HTML_ID_PLACEHOLDER, this.uid)
            );
        },

        /**
         * Click event for Insert Image Button
         */
        clickInsertImage: function () {
            return MediabrowserUtility.openDialog(
                this.imageUrl.replace(HTML_ID_PLACEHOLDER, this.uid)
            );
        },

        /**
         * Click event for Insert Variable Button
         */
        clickInsertVariable: function () {
            return MagentovariablePlugin.loadChooser(
                this.variableUrl,
                this.uid
            );
        }
    });
});
