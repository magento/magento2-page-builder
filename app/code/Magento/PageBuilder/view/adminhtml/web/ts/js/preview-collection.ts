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
     * @param {ContentTypeInterface} contentBlock
     * @param {boolean} autoAppend
     * @returns {Promise<ContentTypeInterface>}
     */
    public clone(contentBlock: ContentTypeInterface, autoAppend: boolean = true): Promise<ContentTypeInterface> {
        const index = contentBlock.parent.getChildren().indexOf(contentBlock) + 1 || null;

        return new Promise((resolve, reject) => {
            createContentType(
                contentBlock.config,
                contentBlock.parent,
                contentBlock.stageId,
                contentBlock.store.get(contentBlock.id),
            ).then((duplicate: ContentTypeInterface) => {
                if (contentBlock.children && contentBlock.children().length > 0) {
                    // Duplicate the instances children into the new duplicate
                    contentBlock.children().forEach((subChild: ContentTypeInterface) => {
                        duplicate.preview.clone(subChild, false).then((duplicateSubChild) => {
                            duplicateSubChild.parent = duplicate;
                            duplicate.addChild(duplicateSubChild);
                        });
                    });
                }

                if (autoAppend) {
                    contentBlock.parent.addChild(duplicate, index);
                }
                this.dispatchContentTypeCloneEvents(contentBlock, duplicate, index);

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
