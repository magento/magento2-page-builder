/**
 * Font size for Redactor
 * @author Aidan Threadgold <aidan@gene.co.uk>
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
                        dropdown = {
                            reset: {
                                title: $t('Reset'),
                                func: function() {
                                    context.fontSize.setFontSize(0);
                                }
                            }
                        },
                        context = this;

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
                },

                setFontSize: function(s) {
                    this.inline.removeFormat();

                    if (s) {
                        this.inline.format('span', 'style', 'font-size: ' + s + 'px');
                    }
                }
            };
        };
    };
});