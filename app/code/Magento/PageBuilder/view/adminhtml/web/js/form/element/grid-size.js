/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'Magento_Ui/js/lib/validation/validator'
], function (Abstract, validator) {
    'use strict';

    return Abstract.extend({
        validate: function () {
            var formQuery = 'index=' + this.ns;
            var externalForm = this.requestModule(formQuery)();
            var nonEmptyColumnCount = externalForm.source.data.non_empty_column_count;
            this.validationParams = {'non_empty_column_count': nonEmptyColumnCount};
            return this._super();
        }
    });
});
