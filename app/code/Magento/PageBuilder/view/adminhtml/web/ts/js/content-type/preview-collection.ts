/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.d";
import createContentType from "../content-type-factory";
import ContentTypeInterface from "../content-type.d";
import {DataObject} from "../data-store";
import Preview from "./preview";

export default class PreviewCollection extends Preview {
    public parent: ContentTypeCollectionInterface;

    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    get previewChildTemplate(): string {
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
        const index = contentType.parent.getChildren().indexOf(contentType) + 1 || null;
        const childrenLength = contentType.children ? contentType.children().length : null;

        return new Promise((resolve, reject) => {
            createContentType(
                contentType.config,
                contentType.parent,
                contentType.stageId,
                contentType.dataStore.get() as DataObject,
                childrenLength,
            ).then((duplicate: ContentTypeCollectionInterface) => {
                if (contentType.children && contentType.children().length > 0) {
                    // Duplicate the instances children into the new duplicate
                    contentType.children().forEach(
                        (subChild: ContentTypeInterface | ContentTypeCollectionInterface) => {
                            const subChildClone = (duplicate.preview as Preview).clone(subChild, false);
                            if (subChildClone) {
                                subChildClone.then(
                                    (duplicateSubChild: ContentTypeInterface | ContentTypeCollectionInterface) => {
                                        duplicateSubChild.parent = duplicate;
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
                    contentType.parent.addChild(duplicate, index);
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

        this.parent.getChildren().each((elem: ContentTypeInterface) => {
            elem.preview.delegate.apply(elem.preview, args);
        });
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    protected isConfigured() {
        if (this.parent.children().length > 0) {
            return true;
        }

        return super.isConfigured();
    }
}
