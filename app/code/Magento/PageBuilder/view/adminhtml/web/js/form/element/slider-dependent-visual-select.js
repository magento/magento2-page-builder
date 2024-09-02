/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_PageBuilder/js/form/element/dependent-visual-select',
    'uiRegistry',
    'ko'
], function (uiComponent, registry) {
    'use strict';

    return uiComponent.extend({

        /**
         * Force switcherConfig re-trigger on click
         * @returns {exports}
         */
        initObservable: function () {
            let self = this;
            this._super().observe(['value']);
            this.value.subscribe(function (value) {
                self.reTriggerClick(this, value);
            });
            return this;
        },

        reTriggerClick: function (self, value) {
            let switcherParent = registry.get('pagebuilder_slide_form.pagebuilder_slide_form.appearance_fieldset.appearance');
            if (typeof switcherParent !== "undefined" && typeof switcherParent.switcherConfig !== "undefined") {
                switcherParent.switcherConfig.rules.forEach(function (rule) {
                    if (rule.value === value) {
                        rule.actions.forEach(function (action) {
                            if (action.callback === "show") {
                                registry.get(action.target).visible(true);
                            }
                            if (action.callback === "hide") {
                                registry.get(action.target).visible(false);
                            }
                        });
                    }
                });
            }
        }
    });
});
