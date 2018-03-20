/**
 * Convert the relative path imports within TypeScript into absolute paths with pre-fixed module name
 *
 * @returns {{visitor: {ImportDeclaration: visitor.ImportDeclaration}}}
 */
module.exports = function () {
    'use strict';

    return {
        visitor: {
            /**
             * Convert ../../utils/util import into Magento_Module/js/utils/util
             *
             * @param path
             * @param state
             * @constructor
             */
            ImportDeclaration: function (path, state) {
                var prefix, fileDir, importParts, traverseUpwards, fileDirParts, absolutePath, importPath;
                var fileName = state.file.opts.filenameRelative;
                var importExpression = path.node.source.value;

                if (!state.opts.prefix) {
                    throw Error("Prefix must be defined");
                }

                // Config
                prefix = state.opts.prefix;

                // Is the file being imported from another directory?
                if (fileName && importExpression.indexOf("./") !== -1) {
                    fileDir = fileName.substr(0, fileName.lastIndexOf("/"));
                    importParts = importExpression.split("/");
                    traverseUpwards = 0;
                    importParts.forEach(function (part) {
                        if (part === "..") {
                            ++traverseUpwards;
                        }
                    });

                    fileDirParts = fileDir.split("/");
                    absolutePath = fileDirParts.slice(0, fileDirParts.length - traverseUpwards).join("/") + "/";
                    importPath = importParts.slice(traverseUpwards).join("/").replace("./", "");

                    // Translated path
                    path.node.source.value = prefix + absolutePath + importPath;
                }
            }
        }
    };
};