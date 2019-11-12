/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* global MediabrowserUtility, widgetTools, MagentovariablePlugin */
define([
    'Magento_Ui/js/form/element/textarea',
    'mage/adminhtml/wysiwyg/widget'
], function (Textarea) {
    'use strict';

    var HTML_ID_PLACEHOLDER = 'HTML_ID_PLACEHOLDER';

    return Textarea.extend({
        defaults: {
            elementTmpl: 'Magento_PageBuilder/form/element/html-code'
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
