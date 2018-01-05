/*eslint-disable vars-on-top, strict*/
/**
 * Font size for Redactor
 */
define(["jquery", "mage/translate"], function(jQuery, $t) {
    /**
     * Redactor plugin
     */
    return function() {
        jQuery.Redactor.prototype.fontSize = function () {
            return {
                init: function () {
                    // Build font sizes dropdown
                    var sizes = [10, 12, 14, 16, 18, 20, 24, 28, 30],
                        context = this,
                        dropdown = {
                            reset: {
                                title: $t('Reset'),
                                func: function() {
                                    context.fontSize.setFontSize(0);
                                }
                            }
                        };

                    jQuery.each(sizes, function(i, size) {
                        dropdown['s' + size] = {
                            title: size + "px",
                            func: function() {
                                context.fontSize.setFontSize(size);
                            }
                        };
                    });

                    // Attach the button
                    var button = this.button.addFirst('fontSize', $t('Size'));

                    this.button.addDropdown(button, dropdown);
                    this.button.setIcon(button, '14px');

                    this.$editor.on('keyup.redactor-limiter', this.fontSize.handleChange.bind(this));
                    this.$editor.on('focus.redactor', this.fontSize.handleChange.bind(this));
                    this.$editor.on('click', this.fontSize.handleChange.bind(this));
                    this.$editor.on('sync', this.fontSize.handleChange.bind(this));
                },

                /**
                 * Update the button based on the selection
                 *
                 * @param event
                 */
                handleChange: function () {
                    var element = this.selection.element(),
                        fontSize = 14,
                        button = this.button.get('fontSize');

                    if (button) {
                        if (jQuery(element).css('fontSize')) {
                            fontSize = parseInt(jQuery(element).css('fontSize'), 10);
                        }
                        this.button.setIcon(button, fontSize + 'px');
                    }
                },

                /**
                 * Set the font-size
                 *
                 * @param s
                 */
                setFontSize: function(s) {
                    if (s) {
                        this.inline.format('span', 'style', 'font-size: ' + s + 'px', 'add');
                        this.button.setIcon(this.button.get('fontSize'), s + 'px');
                    }
                }
            };
        };
    };
});