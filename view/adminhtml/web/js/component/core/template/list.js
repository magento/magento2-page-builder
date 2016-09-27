define([
    'uiElement',
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/alert'
], function (Element, $, $t, alert) {

    return Element.extend({
        defaults: {
            template: 'Gene_BlueFoot/component/core/template/select',
            loading: true,
            templateData: [],
            selectedTemplate: 0
        },

        /** @inheritDoc */
        initialize: function () {
            this._super();

            // Load the data once the parent has rendered
            $.async({
                component: this.parentName
            }, this.dataRequest.bind(this));
        },

        /** @inheritDoc */
        initObservable: function () {
            return this._super()
                .observe([
                    'loading',
                    'templateData',
                    'selectedTemplate'
                ]);
        },

        /**
         * Load saved template data
         */
        dataRequest: function() {
            var request = $.ajax({
                url: this.render_url,
                method: 'GET',
                dataType: 'json',
                data: {form_key: window.FORM_KEY}
            });

            request.done(function(response) {
                if (response['templates']) {
                    this.templateData(response['templates']);
                    this.loading(false);
                }
            }.bind(this));

            request.fail(function() {
                alert({
                    content: $t('Something went wrong.')
                });
            });
        },

        /**
         * Record the selected template
         * @param item
         */
        selectTemplate: function(item) {
            this.selectedTemplate(item.id);
        },

        /**
         * Class name for selected template
         * @param item
         * @returns {string}
         */
        isSelected: function(item) {
            return this.selectedTemplate() == item.id ? 'selected' : '';
        }
    });
});