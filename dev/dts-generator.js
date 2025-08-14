/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

const path = require('path');
const fs = require('fs');
const prettier = require('prettier'),
    typesFile = 'page-builder-types/index.d.ts',
    copyrightComment = `/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */`;

/**
 * Resolve a file system path to the Magento module import path
 *
 * @param {string} currentModuleId
 * @returns {string}
 */
// eslint-disable-next-line strict
function resolveModuleIdToMagentoPath(currentModuleId) {
    return currentModuleId.replace(
        'app/code/Magento/PageBuilder/view/adminhtml/web/ts/',
        'Magento_PageBuilder/'
    );
}

// Use dts-generator to create a single types definition file
require('dts-generator').default({
    project: './',
    out: typesFile,
    // eslint-disable-next-line strict
    resolveModuleId: (params) => {
        return resolveModuleIdToMagentoPath(params.currentModuleId);
    },
    // eslint-disable-next-line strict
    resolveModuleImport: (params) => {
        // Convert relative imports into their Magento counterparts
        if (params.importedModuleId.startsWith('../') || params.importedModuleId.startsWith('./')) {
            return resolveModuleIdToMagentoPath(
                path.resolve(
                    path.dirname(params.currentModuleId),
                    params.importedModuleId
                ).replace(
                    process.cwd() + '/',
                    ''
                )
            );
        }

        return params.importedModuleId;
    }
// eslint-disable-next-line strict
}).then(() => {
    const { exec } = require('child_process'),
        // Lint the generated file
        lint = exec(`./node_modules/tslint/bin/tslint --fix ${typesFile}`);

    lint.on('exit', () => {
        // Replace all tab characters with 4 spaces
        fs.readFile(typesFile, 'utf-8', (error, contents) => {
            if (error) {
                throw Error(`Unable to read types file ${typesFile}.`);
            }
            let modifiedContents = contents
                .replace(/.*\/\*\*\n.*Copyright © Magento.*\n.*\n.*\*\//gm, '') // Strip all Magento copyright
                .replace(/.*\/\*\*\n.*@api.*\n.*\*\//gm, ''); // Strip all @api comments

            modifiedContents = `${copyrightComment}\n${modifiedContents}`;
            // eslint-disable-next-line max-nested-callbacks
            fs.writeFile(typesFile, prettier.format(modifiedContents, {parser: 'typescript'}), null, () => {
                console.log('Type definition generation completed.');
                process.exit();
            });
        });
    });
});
