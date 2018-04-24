/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import createContentType from "./content-type-factory";
import ContentTypeInterface from "./content-type.d";
import Preview from "./preview";

export default class PreviewCollection extends Preview {
    /**
     * Retrieve the preview child template
     *
     * @returns {string}
     */
    get previewChildTemplate(): string {
        return "Magento_PageBuilder/component/block/preview/children.html";
    }

    /**
     * Duplicate content type
     *
     * @param {ContentTypeInterface} contentType
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface>}
     */
    public clone(contentType: ContentTypeInterface, autoAppend: boolean = true): Promise<ContentTypeInterface> {
        const index = contentType.parent.getChildren().indexOf(contentType) + 1 || null;

        return new Promise((resolve, reject) => {
            createContentType(
                contentType.config,
                contentType.parent,
                contentType.stageId,
                contentType.store.get(contentType.id),
            ).then((duplicate: ContentTypeInterface) => {
                if (contentType.children && contentType.children().length > 0) {
                    // Duplicate the instances children into the new duplicate
                    contentType.children().forEach((subChild: ContentTypeInterface) => {
                        duplicate.preview.clone(subChild, false).then((duplicateSubChild) => {
                            duplicateSubChild.parent = duplicate;
                            duplicate.addChild(duplicateSubChild);
                        });
                    });
                }

                if (autoAppend) {
                    contentType.parent.addChild(duplicate, index);
                }
                this.dispatchContentTypeCloneEvents(contentType, duplicate, index);

                resolve(duplicate);
            });
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
