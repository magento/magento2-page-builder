/**
 * Colour UI Component
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'jquery',
    'Gene_BlueFoot/js/resource/jquery/colorpicker/js/colorpicker'
], function (AbstractField, $) {
    'use strict';

    return AbstractField.extend({
        defaults: {
            textColor: '#000000',

            listens: {
                value: 'updateTextColor'
            }
        },

        /**
         * @inheritdoc
         */
        initObservable: function () {
            return this._super().observe('textColor');
        },

        /**
         * Render our colour picker on the element
         *
         * @param element
         */
        renderColorPicker: function (element) {
            // Attach the color picker
            $(element).ColorPicker({
                color: this.value(),
                onChange: function (hsb, hex, rgb) {
                    this.value(hex);
                }.bind(this)
            });
        },

        /**
         * Update the text colour
         */
        updateTextColor: function () {
            if (this.value()) {
                this.value(this.value().replace('#', ''));
                this.textColor((parseInt(this.value(), 16) > 0xffffff / 1.75) ? '#000000' : '#FFFFFF');
            }
        }

    });
});
