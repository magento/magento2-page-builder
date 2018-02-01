define([
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/confirm',
    'jquery/ui',
    'domReady!'
], function ($, $t, confirm) {
    return function (config, enableSelectEl) {
        var $enableSelectEl = $(enableSelectEl),
            isEnabledInDatabase = !!parseInt($enableSelectEl.val())
        ;

        $enableSelectEl.on('change', function () {
            var userIsDisabling = !parseInt($enableSelectEl.val());

            if (!isEnabledInDatabase || !userIsDisabling) {
                return;
            }

            confirm({
                title: $t(config.modalTitleText),
                content: $t(config.modalContentBody),
                buttons: [{
                    text: $t('Cancel'),
                    class: 'action-secondary action-dismiss action-pagebuilder-disable-cancel',

                    /**
                     * Click handler.
                     */
                    click: function (event) {
                        this.closeModal(event);
                    }
                }, {
                    text: $t('Turn Off'),
                    class: 'action-primary action-accept',

                    /**
                     * Click handler.
                     */
                    click: function (event) {
                        this.closeModal(event, true);
                    }
                }],
                actions: {

                    /**
                     * Revert back to original Enabled setting
                     */
                    cancel: function () {
                        $enableSelectEl.val(Number(true));
                    }
                }
            });
        });
    }
});
