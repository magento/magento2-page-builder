/*eslint-disable vars-on-top, strict, no-useless-escape, max-len*/
/*global Base64, tinyMCE*/

/**
 * Magento Widget selector
 */

define([
    'Magento_Ui/js/form/element/abstract',
    'underscore',
    'mage/translate',
    'bluefoot/config',
    "mage/adminhtml/wysiwyg/widget,",
    "mage/adminhtml/wysiwyg/widget,"
], function (AbstractField, _, $t, Config, WysiwygWidget, widgetTools) {
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
        if (typeof WysiwygWidget.Widget.prototype.bluefoot === 'function' ){
            widgetCode = WysiwygWidget.Widget.prototype.bluefoot();
            WysiwygWidget.Widget.prototype.bluefoot = null;
        }
        // Magento wysiwyg
        else if (this.wysiwygExists()) {
            var e = this.getWysiwygNode();

            if (e !== undefined && e.id) {
                widgetCode = Base64.idDecode(e.id);
            }
        }

        if (widgetCode && widgetCode.indexOf('{{widget') !== -1) {
            this.optionValues = new Hash({});
            widgetCode.gsub(/([a-z0-9\_]+)\s*\=\s*[\"]{1}([^\"]+)[\"]{1}/i, function(match){
                if (match[1] === 'type') {
                    this.widgetEl.value = match[2];
                } else {
                    this.optionValues.set(match[1], match[2]);
                }
            }.bind(this));

            this.loadOptions();
        }
    };
    WysiwygWidget.Widget.prototype.initialize = function(formEl, widgetEl, widgetOptionsEl, optionsSourceUrl, widgetTargetId) {
        $(formEl).insert({bottom: widgetTools.getDivHtml(widgetOptionsEl)});
        jQuery('#' + formEl).mage('validation', {
            ignore: ".skip-submit",
            errorClass: 'mage-error'
        });
        this.formEl = formEl;
        this.widgetEl = $(widgetEl);
        this.widgetOptionsEl = $(widgetOptionsEl);
        this.optionsUrl = optionsSourceUrl;
        this.optionValues = new Hash({});
        this.widgetTargetId = widgetTargetId;

        // Bluefoot edit
        if (typeof WysiwygWidget.Widget.prototype.bluefoot !== 'function' ) {
            if (typeof tinyMCE !== "undefined" && tinyMCE.activeEditor) {
                this.bMark = tinyMCE.activeEditor.selection.getBookmark();
            }
        }
        else {
            this.bMark = null;
        }

        Event.observe(this.widgetEl, "change", this.loadOptions.bind(this));

        this.initOptionValues();
    };


    return AbstractField.extend({
        defaults: {
            listens: {
                value: 'onValueChange'
            }
        },

        onValueChange: function(text) {
            this.value(text.substring(text.lastIndexOf('{{widget '), text.length));
        },

        openWidgets: function() {
            WysiwygWidget.Widget.prototype.bluefoot = this.value;
            widgetTools.openDialog(
                Config.getPluginConfig("gene_widget_magentowidget", "widget_url") + 'widget_target_id/' + this.uid + '/'
            );
        }

    });
});
