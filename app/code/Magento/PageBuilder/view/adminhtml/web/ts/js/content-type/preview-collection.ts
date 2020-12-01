/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import createContentType from "../content-type-factory";
import ContentTypeInterface from "../content-type.types";
import Preview from "./preview";
import {PreviewCollectionInterface} from "./preview-collection.types";

export default class PreviewCollection extends Preview implements PreviewCollectionInterface {
    public contentType: ContentTypeCollectionInterface;

    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    get childTemplate(): string {
        return "Magento_PageBuilder/content-type/preview-collection";
    }

    /**
     * Duplicate a collection content type
     *
     * @param {ContentTypeCollectionInterface} contentType
     * @param {boolean} autoAppend
     * @param {boolean} direct
     * @returns {Promise<ContentTypeCollectionInterface> | void}
     */
    public clone(
        contentType: ContentTypeCollectionInterface,
        autoAppend: boolean = true,
        direct: boolean = false,
    ): Promise<ContentTypeCollectionInterface> | void {
        const defaultViewport = Config.getConfig("defaultViewport");
        const index = contentType.parentContentType.getChildren().indexOf(contentType) + 1 || null;
        const childrenLength = contentType.children ? contentType.children().length : 0;

        return new Promise((resolve, reject) => {
            createContentType(
                contentType.config,
                contentType.parentContentType,
                contentType.stageId,
                contentType.dataStores[defaultViewport].getState(),
                childrenLength,
                contentType.getDataStoresStates(),
            ).then((duplicate: ContentTypeCollectionInterface) => {
                if (contentType.children && contentType.children().length > 0) {
                    // Duplicate the instances children into the new duplicate
                    contentType.children().forEach(
                        (subChild: ContentTypeInterface | ContentTypeCollectionInterface) => {
                            const subChildClone = (duplicate.preview as Preview).clone(subChild, false);
                            if (subChildClone) {
                                subChildClone.then(
                                    (duplicateSubChild: ContentTypeInterface | ContentTypeCollectionInterface) => {
                                        duplicateSubChild.parentContentType = duplicate;
                                        duplicate.addChild(duplicateSubChild);
                                    },
                                );
                            } else {
                                reject("Unable to duplicate sub child.");
                            }
                        },
                    );
                }

                if (autoAppend) {
                    contentType.parentContentType.addChild(duplicate, index);
                }
                this.dispatchContentTypeCloneEvents(contentType, duplicate, index, direct);

                resolve(duplicate);
            });
        });
    }

    /**
     * Tries to call specified method of a current content type,
     * and delegates attempt to its' children.
     * @param args
     */
    public delegate(...args: any[]) {
        super.delegate(...args);

        this.contentType.getChildren()().forEach((elem: ContentTypeInterface) => {
            elem.preview.delegate.apply(elem.preview, args);
        });
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    protected isConfigured() {
        if (this.contentType.children().length > 0) {
            return true;
        }

        return super.isConfigured();
    }
}
