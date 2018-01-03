/**
 * Design Options UI Component
 *
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'ko',
    'jquery',
    'jquery/ui',
    'Gene_BlueFoot/js/resource/jquery/colorpicker/js/colorpicker'
], function (AbstractField, ko, $) {
    'use strict';

    return AbstractField.extend({
        defaults: {
            marginTop: '-',
            marginRight: '-',
            marginBottom: '-',
            marginLeft: '-',

            borderTop: '-',
            borderRight: '-',
            borderBottom: '-',
            borderLeft: '-',
            borderColor: '000000',
            borderTextColor: '#FFFFFF',
            borderStyle: 'inherit',
            borderRadius: '0',
            borderSlider: false,

            paddingTop: '-',
            paddingRight: '-',
            paddingBottom: '-',
            paddingLeft: '-',

            backgroundColor: '',
            backgroundTextColor: '#000000',

            listens: {
                marginTop: 'updateValue',
                marginRight: 'updateValue',
                marginBottom: 'updateValue',
                marginLeft: 'updateValue',

                borderTop: 'updateValue',
                borderRight: 'updateValue',
                borderBottom: 'updateValue',
                borderLeft: 'updateValue',
                borderColor: 'updateValue updateBorderTextColor',
                borderStyle: 'updateValue',
                borderRadius: 'updateValue updateSlider',

                paddingTop: 'updateValue',
                paddingRight: 'updateValue',
                paddingBottom: 'updateValue',
                paddingLeft: 'updateValue',

                backgroundColor: 'updateValue updateBackgroundTextColor'
            }
        },

        /**
         * Convert the JSON string into it's respected values
         *
         * @returns {exports}
         */
        setInitialValue: function () {
            this._super();

            if (this.initialValue) {
                var obj = JSON.parse(this.initialValue);
                this.marginTop(obj.margin[0]);
                this.marginRight(obj.margin[1]);
                this.marginBottom(obj.margin[2]);
                this.marginLeft(obj.margin[3]);

                this.borderTop(obj.border[0]);
                this.borderRight(obj.border[1]);
                this.borderBottom(obj.border[2]);
                this.borderLeft(obj.border[3]);
                if (obj.borderColor) {
                    this.borderColor(obj.borderColor);
                }
                this.borderStyle(obj.borderStyle);
                this.borderRadius(obj.borderRadius);

                this.paddingTop(obj.padding[0]);
                this.paddingRight(obj.padding[1]);
                this.paddingBottom(obj.padding[2]);
                this.paddingLeft(obj.padding[3]);

                this.backgroundColor(obj.backgroundColor);
            }

            return this;
        },

        /**
         * @inheritdoc
         */
        initObservable: function () {
            return this._super().observe('marginTop marginRight marginBottom marginLeft ' +
                'borderTop borderRight borderBottom borderLeft borderColor borderTextColor borderStyle borderRadius ' +
                'paddingTop paddingRight paddingBottom paddingLeft ' +
                'backgroundColor backgroundTextColor');
        },

        /**
         * Update the value of the field
         */
        updateValue: function () {
            var obj = {
                margin: [this.marginTop(), this.marginRight(), this.marginBottom(), this.marginLeft()],
                border: [this.borderTop(), this.borderRight(), this.borderBottom(), this.borderLeft()],
                borderColor: this.borderColor(),
                borderStyle: this.borderStyle(),
                borderRadius: this.borderRadius(),
                padding: [this.paddingTop(), this.paddingRight(), this.paddingBottom(), this.paddingLeft()],
                backgroundColor: this.backgroundColor()
            };

            this.value(JSON.stringify(obj));
        },

        /**
         * Render the colour picker, fired from afterRender on element
         *
         * @param element
         * @param field
         */
        renderColorPicker: function (element, field) {
            // Attach the color picker
            $(element).ColorPicker({
                color: this[field](),
                onChange: function (hsb, hex, rgb) {
                    this[field](hex);
                }.bind(this)
            });
        },

        /**
         * Calculate the border text colour based on the border colour
         */
        updateBorderTextColor: function () {
            if (this.borderColor()) {
                this.borderColor(this.borderColor().replace('#', ''));
                this.borderTextColor((parseInt(this.borderColor(), 16) > 0xffffff / 1.75) ? '#000000' : '#FFFFFF');
            }
        },

        /**
         * Update the background text colour based on the selection
         */
        updateBackgroundTextColor: function () {
            if (this.backgroundColor()) {
                this.backgroundColor(this.backgroundColor().replace('#', ''));
                this.backgroundTextColor((parseInt(this.backgroundColor(), 16) > 0xffffff / 1.75) ? '#000000' : '#FFFFFF');
            }
        },

        /**
         * Render the slider element
         *
         * @param element
         */
        renderSlider: function (element) {
            $(element).slider({
                value: this.borderRadius(),
                min: 0,
                max: 50,
                slide: function( event, ui ) {
                    this.borderRadius(ui.value);
                }.bind(this)
            });
            this.borderSlider = $(element);
        },

        /**
         * Update the slider
         */
        updateSlider: function () {
            if (this.borderSlider) {
                this.borderSlider.slider("option", "value", this.borderRadius());
            }
        }

    });
});
