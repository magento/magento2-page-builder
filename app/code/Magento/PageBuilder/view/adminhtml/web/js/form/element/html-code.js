/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

define([
    'Magento_Ui/js/form/element/textarea',
    'mage/adminhtml/wysiwyg/widget',
], function (Textarea) {
    'use strict';

    return Textarea.extend({
        defaults: {
            elementTmpl: 'Magento_PageBuilder/form/element/html-code',
            htmlId: 'HTML_ID'
        },

        /**
         * Click event for Insert Widget Button
         */
        clickInsertWidget: function () {
            return widgetTools.openDialog(
                this.widgetUrl.replace(this.htmlId, this.uid)
            );
        },

        /**
         * Click event for Insert Image Button
         */
        clickInsertImage: function () {
            return MediabrowserUtility.openDialog(
                this.imageUrl.replace(this.htmlId, this.uid)
            );
        },

        /**
         * Click event for Insert Variable Button
         */
        clickInsertVariable: function () {
            return MagentovariablePlugin.loadChooser(
                this.variableUrl, this.uid
            );
        },
    });
});
