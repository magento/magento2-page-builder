/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'Magento_Ui/js/form/element/abstract'
], function (Abstract) {
    'use strict';

    return Abstract.extend({
        validate: function () {
            var externalFormSourceData = this.requestModule('index=' + this.ns)().source.data;

            this.validationParams = {
                'non_empty_column_count': externalFormSourceData.non_empty_column_count,
                'max_grid_size': externalFormSourceData.max_grid_size
            };

            return this._super();
        }
    });
});
