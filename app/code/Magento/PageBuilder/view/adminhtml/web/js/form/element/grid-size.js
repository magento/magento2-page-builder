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
            const formQuery = 'index=' + this.ns;
            const externalForm = this.requestModule(formQuery)();
            const nonEmptyColumnCount = externalForm.source.data.non_empty_column_count;
            const maxGridSize = externalForm.source.data.max_grid_size;
            this.validationParams = {
                'non_empty_column_count': nonEmptyColumnCount,
                'max_grid_size': maxGridSize
            };
            return this._super();
        }
    });
});
