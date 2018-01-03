/**
 * Font color for Redactor
 *
 */
define([
    'jquery',
    'mage/translate',
    'Gene_BlueFoot/js/resource/jquery/colorpicker/js/colorpicker'
], function(jQuery, $t) {
    /**
     * Redactor plugin
     */
    return function() {
        jQuery.Redactor.prototype.fontColor = function () {
            return {
                init: function () {

                    // Attach the button
                    var button = this.button.addAfter('fontSize', 'fontColor', $t('Color'));
                    this.button.setIcon(button, '<div class="redactor-color-picker"></div>');
                    this.button.addCallback(button, this.fontColor.showColorPicker.bind(this));

                    this.$editor.on('keyup.redactor-limiter', this.fontColor.handleChange.bind(this));
                    this.$editor.on('focus.redactor', this.fontColor.handleChange.bind(this));
                    this.$editor.on('click', this.fontColor.handleChange.bind(this));
                    this.$editor.on('sync', this.fontColor.handleChange.bind(this));
                },

                /**
                 * Show the colour picker
                 */
                showColorPicker: function () {
                    var element = this.selection.element(),
                        color = '000000';
                    if (jQuery(element).css('color')) {
                        color = this.fontColor.convertToHex(jQuery(element).css('color'));
                    }
                    this.events.blured = true;
                    var button = this.button.get('fontColor');
                    jQuery(button).ColorPicker({
                        color: '#' + color,
                        onChange: function (hsb, hex, rgb) {
                            this.events.blured = true;
                            this.fontColor.setFontColor(hex);
                        }.bind(this),
                        onHide: function () {
                            this.events.blured = false;
                        }.bind(this)
                    });
                    jQuery(button).ColorPickerSetColor('#' + color);
                },

                /**
                 * Convert out RGB value to a hexadecimal
                 *
                 * @param rgb
                 * @returns {string}
                 */
                convertToHex: function (rgb) {
                    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                    return (rgb && rgb.length === 4) ?
                        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                },

                /**
                 * Update the button based on the selection
                 *
                 * @param event
                 */
                handleChange: function (event) {
                    var element = this.selection.element(),
                        color = '000000',
                        button = this.button.get('fontColor');

                    if (button) {
                        if (jQuery(element).css('color')) {
                            color = this.fontColor.convertToHex(jQuery(element).css('color'));
                        }
                        this.button.setIcon(button, '<div class="redactor-color-picker" style="background-color: #' + color + '"></div>');
                    }
                },

                /**
                 * Set the font-size
                 *
                 * @param c
                 */
                setFontColor: function(c) {
                    if (c) {
                        this.inline.format('span', 'style', 'color: #' + c, 'add');
                        var button = this.button.get('fontColor');
                        this.button.setIcon(button, '<div class="redactor-color-picker" style="background-color: #' + c + ';"></div>');
                    }
                }
            };
        };
    };
});