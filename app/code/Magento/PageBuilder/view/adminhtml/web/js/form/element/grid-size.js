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
            let formQuery = 'index=' + this.ns;
            let externalForm = this.requestModule(formQuery)();
            let nonEmptyColumnCount = externalForm.source.data.non_empty_column_count;
            let maxGridSize = externalForm.source.data.max_grid_size;
            this.validationParams = {
                'non_empty_column_count': nonEmptyColumnCount,
                'max_grid_size': maxGridSize
            };
            return this._super();
        }
    });
});
