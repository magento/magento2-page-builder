define([
    'Magento_Ui/js/form/element/abstract',
    'ko',
    'jquery',
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
            borderColor: '#000000',
            borderTextColor: '#FFFFFF',

            paddingTop: '-',
            paddingRight: '-',
            paddingBottom: '-',
            paddingLeft: '-',

            listens: {
                marginTop: 'updateValue',
                marginRight: 'updateValue',
                marginBottom: 'updateValue',
                marginLeft: 'updateValue',

                borderTop: 'updateValue',
                borderRight: 'updateValue',
                borderBottom: 'updateValue',
                borderLeft: 'updateValue',
                borderColor: 'updateValue',

                paddingTop: 'updateValue',
                paddingRight: 'updateValue',
                paddingBottom: 'updateValue',
                paddingLeft: 'updateValue'
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
                this.borderColor(obj.borderColor);
                this.updateBorderTextColor();

                this.paddingTop(obj.padding[0]);
                this.paddingRight(obj.padding[1]);
                this.paddingBottom(obj.padding[2]);
                this.paddingLeft(obj.padding[3]);
            }

            return this;
        },

        /**
         * @inheritdoc
         */
        initObservable: function () {
            return this._super().observe('marginTop marginRight marginBottom marginLeft ' +
                'borderTop borderRight borderBottom borderLeft borderColor borderTextColor ' +
                'paddingTop paddingRight paddingBottom paddingLeft');
        },

        /**
         * Update the value of the field
         */
        updateValue: function () {
            var obj = {
                margin: [this.marginTop(), this.marginRight(), this.marginBottom(), this.marginLeft()],
                border: [this.borderTop(), this.borderRight(), this.borderBottom(), this.borderLeft()],
                borderColor: this.borderColor(),
                padding: [this.paddingTop(), this.paddingRight(), this.paddingBottom(), this.paddingLeft()]
            };

            this.value(JSON.stringify(obj));

            this.updateBorderTextColor();
        },

        /**
         * Render the colour picker, fired from afterRender on element
         *
         * @param element
         */
        renderColorPicker: function (element) {
            // Attach the color picker
            $(element).ColorPicker({
                color: this.borderColor(),
                onChange: function (hsb, hex, rgb) {
                    this.borderColor(hex);
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
        }

    });
});
