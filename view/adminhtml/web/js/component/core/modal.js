/**
 * - Modal.js
 * Handles showing modal windows
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 *
 * @todo bring in line with Deflate's alerts system
 */
define(['bluefoot/hook', 'bluefoot/renderer', 'bluefoot/jquery', 'bluefoot/config'], function (Hook, Render, jQuery, Config) {

    return {
        /**
         * Throw an alert to the screen
         *
         * @param message
         * @param title
         */
        alert: function (message, title) {
            title = title || 'BlueFoot says:';

            var alertTemplate = jQuery(Config.getValue('alert_template')).html();

            // Declare the configuration
            var config = {
                class: 'gene-bluefoot-modal-alert',
                title: title,
                message: message,
                buttons: [
                    {
                        code: 'okay',
                        class: 'gene-bluefoot-okay gene-bluefoot-close',
                        label: 'Okay',
                        keyCode: 13
                    }
                ]
            };

            // Render the alert HTML
            var alertHtml = Render.renderFromConfig('alert_template', config);
            var alert = jQuery(alertHtml);
            alert.css({'visibility': 'hidden'});

            // Append the HTML into the body
            jQuery('.gene-bluefoot-modal-alert').remove();
            jQuery('body').append(alert);

            // @todo improve with fancy animations
            alert.find('[data-model]').css({marginTop: '-' + (alert.find('[data-model]').outerHeight() / 2) + 'px'});
            alert.css({'visibility': 'visible'});

            alert.find('.gene-bluefoot-close').on('click', function () {
                alert.remove();
            });

            jQuery(window).off('keydown').on('keydown', function (event) {
                if (event.keyCode == 13 && alert.find('.gene-bluefoot-okay')) {
                    alert.find('.gene-bluefoot-okay').trigger('click');
                }
            });
        },

        /**
         * Confirm window
         *
         * @param message
         * @param title
         * @param callback
         */
        confirm: function (message, title, callback) {
            title = title || 'BlueFoot says:';

            // Declare the configuration
            var config = {
                class: 'gene-bluefoot-modal-alert',
                title: title,
                message: message,
                buttons: [
                    {
                        code: 'cancel',
                        class: 'gene-bluefoot-close',
                        label: 'Cancel'
                    },
                    {
                        code: 'okay',
                        class: 'gene-bluefoot-okay',
                        label: 'Okay',
                        keyCode: 13
                    }
                ]
            };

            // Render the alert HTML
            var confirmHtml = Render.renderFromConfig('alert_template', config);
            var confirm = jQuery(confirmHtml);
            confirm.css({'visibility': 'hidden'});

            // Append the HTML into the body
            jQuery('.gene-bluefoot-modal-alert').remove();
            jQuery('body').append(confirm);

            // @todo improve with fancy animations
            confirm.find('[data-model]').css({marginTop: '-' + (confirm.find('[data-model]').outerHeight() / 2) + 'px'});
            confirm.css({'visibility': 'visible'});

            // Handle close / cancel events
            confirm.find('.gene-bluefoot-close').on('click', function (event) {
                event.preventDefault();
                return confirm.remove();
            });

            // Handle confirmation
            confirm.find('.gene-bluefoot-okay').on('click', function (event) {
                event.preventDefault();
                callback();
                return confirm.remove();
            });

            jQuery(window).off('keydown').on('keydown', function (event) {
                if (event.keyCode == 13 && confirm.find('.gene-bluefoot-okay')) {
                    confirm.find('.gene-bluefoot-okay').trigger('click');
                }
            });
        },

        /**
         * Custom confirm system
         *
         * @param message
         * @param title
         * @param customConfig
         */
        custom: function (message, title, customConfig) {
            title = title || 'BlueFoot says:';

            var config = {
                class: 'gene-bluefoot-modal-alert',
                title: title,
                message: message
            };
            config = jQuery.extend(config, customConfig);

            // Render the alert HTML
            var confirmHtml = Render.renderFromConfig('alert_template', config);
            var confirm = jQuery(confirmHtml);
            confirm.css({'visibility': 'hidden'});

            // Append the HTML into the body
            jQuery('.gene-bluefoot-modal-alert').remove();
            jQuery('body').append(confirm);

            // @todo improve with fancy animations
            confirm.find('[data-model]').css({marginTop: '-' + (confirm.find('[data-model]').outerHeight() / 2) + 'px'});
            confirm.css({'visibility': 'visible'});

            // Handle close / cancel events
            confirm.find('.gene-bluefoot-close').on('click', function (event) {
                event.preventDefault();
                return confirm.remove();
            });

            // Bind our events
            jQuery.each(config.buttons, function (index, button) {
                // Handle confirmation
                confirm.find('.' + button.class).on('click', function (event) {
                    event.preventDefault();
                    if (typeof button.onClick === 'function') {
                        button.onClick(button);
                    }
                    return confirm.remove();
                });

                if (button.keyCode) {
                    jQuery(window).on('keydown', function (event) {
                        if (event.keyCode == button.keyCode && confirm.find('.gene-bluefoot-okay')) {
                            confirm.find('.gene-bluefoot-okay').trigger('click');
                        }
                        jQuery(window).off('keydown');
                    });
                }
            });

        },
        templateSelectionGrid: function (templates,callbacks)
        {
            var config = {
                class: 'gene-bluefoot-template-selection-grid',
                templates : templates,
                title: 'Please select a template'
            };

            if (templates.length === 0) {
                return this.alert('You have not saved any templates, please create a template and then click \'Save Template\'.');
            }
            //todo bad hack is bad
            var $old = jQuery('.gene-bluefoot-template-selection-grid');
            if ($old.length != 0)
            {
                $old.remove();
            }

            var templateGridHtml = Render.renderFromConfig('template_selection_grid_template',config);
            var templateGrid = jQuery(templateGridHtml);

            templateGrid.css({'visibility':'hidden'});
            jQuery('gene-bluefoot-template-selection-grid').remove();
            jQuery('body').append(templateGrid);

            templateGrid.find('[data-model]').css({marginTop: '-' + (templateGrid.find('[data-model]').outerHeight() / 2) + 'px'});
            templateGrid.css({'visibility':'visible'});
            // Handle deletion click
            templateGrid.find('button[name=delete-template]').on('click', function (event) {
                event.preventDefault();
                callbacks.delete(this.getAttribute('data-template-id'));
            });
            // Handle selection of template
            templateGrid.find('button[name=add-template]').on('click', function (event) {
                event.preventDefault();
                callbacks.load(this.dataset.templateId);
                return templateGrid.remove();
            });
            // Handle close / cancel events
            templateGrid.find('.gene-bluefoot-close').on('click', function (event) {
                event.preventDefault();
                return templateGrid.remove();
            });
            // Handle favourite event
            templateGrid.find('.gene-bluefoot-template-pinned').on('click', function (event) {
                event.preventDefault();
                if (this.classList.contains('active'))
                {
                    jQuery(this).removeClass('active');
                    callbacks.pin(this.getAttribute('data-template-id'),false);
                }
                else
                {
                    jQuery(this).addClass('active');
                    callbacks.pin(this.getAttribute('data-template-id'),true);
                }
            });
        }
    }
});