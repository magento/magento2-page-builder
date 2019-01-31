/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
const typesFile = 'page-builder-types/index.d.ts';
const copyrightComment = `/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */`;

/**
 * Resolve a file system path to the Magento module import path
 *
 * @param {string} currentModuleId
 * @returns {string}
 */
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
    resolveModuleId: (params) => {
        return resolveModuleIdToMagentoPath(params.currentModuleId);
    },
    resolveModuleImport: (params) => {
        // Convert relative imports into their Magento counterparts
        if (params.importedModuleId.startsWith('../') || params.importedModuleId.startsWith('./')) {
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

        return params.importedModuleId;
    }
}).then(() => {
    const { exec } = require('child_process');
    // Lint the generated file
    const lint = exec(`./node_modules/tslint/bin/tslint --fix ${typesFile}`);
    lint.on("exit", () => {
        // Replace all tab characters with 4 spaces
        fs.readFile(typesFile, 'utf-8', (error, contents) => {
            if (error) {
                throw Error(`Unable to read types file ${typesFile}.`);
            }
            let modifiedContents = contents
                .replace(/.*\/\*\*\n.*Copyright © Magento.*\n.*\n.*\*\//gm, '') // Strip all Magento copyright
                .replace(/.*\/\*\*\n.*@api.*\n.*\*\//gm, ''); // Strip all @api comments
            modifiedContents = `${copyrightComment}\n${modifiedContents}`;
            fs.writeFile(typesFile, prettier.format(modifiedContents, {parser: "typescript"}), null, () => {
                console.log("Type definition generation completed.");
                process.exit();
            });
        });
    });
});