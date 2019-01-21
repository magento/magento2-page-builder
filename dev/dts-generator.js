/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

var path = require('path');

/**
 * Resolve a file system path to the Magento module import path
 *
 * @param currentModuleId
 * @returns {*}
 */
function resolveModuleIdToMagentoPath(currentModuleId) {
    return currentModuleId.replace(
        'app/code/Magento/PageBuilder/view/adminhtml/web/ts/',
        'Magento_PageBuilder'
    );
}

const typePrefix = `/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* tslint:disable */`;

require('dts-generator').default({
    project: './',
    out: 'page-builder-types/index.d.ts',
    resolveModuleId: (params) => {
        return resolveModuleIdToMagentoPath(params.currentModuleId);
    },
    resolveModuleImport: (params) => {
        return resolveModuleIdToMagentoPath(
            path.resolve(
                path.dirname(params.currentModuleId),
                params.importedModuleId,
            ).replace(
                process.cwd() + '/',
                ''
            )
        );
    }
});