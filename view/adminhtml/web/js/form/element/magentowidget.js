/**
 * Magento Widget selector
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */

define([
    'Magento_Ui/js/form/element/abstract',
    'underscore',
    'mage/translate',
    'bluefoot/config',
    "mage/adminhtml/wysiwyg/widget"
], function (AbstractField, _, $t, Config) {
    'use strict';

    /**
     * Rewrite the initOptionValues() function to look in our bluefoot field for the widget's information
     * @see wysiwyg/widget.js
     * @type {null}
     */
    WysiwygWidget.Widget.prototype.bluefoot = null;
    WysiwygWidget.Widget.prototype.initOptionValues = function() {
        var widgetCode = '';

        // Bluefoot field
        if (typeof WysiwygWidget.Widget.prototype.bluefoot == 'function' ){
            widgetCode = WysiwygWidget.Widget.prototype.bluefoot();
            WysiwygWidget.Widget.prototype.bluefoot = null;
        }
        // Magento wysiwyg
        else if (this.wysiwygExists()) {
            var e = this.getWysiwygNode();
            if (e != undefined && e.id) {
                widgetCode = Base64.idDecode(e.id);
            }
        }

        if (widgetCode.indexOf('{{widget') != -1) {
            this.optionValues = new Hash({});
            widgetCode.gsub(/([a-z0-9\_]+)\s*\=\s*[\"]{1}([^\"]+)[\"]{1}/i, function(match){
                if (match[1] == 'type') {
                    this.widgetEl.value = match[2];
                } else {
                    this.optionValues.set(match[1], match[2]);
                }
            }.bind(this));

            this.loadOptions();
        }
    };

    return AbstractField.extend({
        defaults: {
            listens: {
                value: 'onValueChange'
            }
        },

        openWidgets: function() {
            WysiwygWidget.Widget.prototype.bluefoot = this.value;
            widgetTools.openDialog(
                Config.getPluginConfig("gene_widget_magentowidget", "widget_url") + 'widget_target_id/' + this.uid + '/'
            );
        }

    });
});
