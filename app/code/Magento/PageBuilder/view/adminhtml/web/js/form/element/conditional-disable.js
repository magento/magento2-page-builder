/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable vars-on-top, strict */

define([
    'Magento_Ui/js/form/element/abstract',
    'underscore'
], function (Abstract, _) {
    'use strict';

    /**
     * Disable self based on another fields value
     */
    return Abstract.extend({
        defaults: {
            disabledValues: [],
        },

        /**
         * Set the field as disabled when it's empty or is equal to a value within disabledValues
         *
         * @param value
         */
        setDisabled: function (value) {
            if (_.indexOf(_.values(this.disabledValues), value) !== -1) {
                this.disable();
            } else {
                this.enable();
            }
        }
    });
});
