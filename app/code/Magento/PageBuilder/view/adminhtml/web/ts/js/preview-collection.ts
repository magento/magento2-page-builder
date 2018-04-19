/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

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
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    protected isConfigured() {
        if (this.parent.children().length > 0) {
            return true;
        }
    }

    /**
     * Duplicate content type
     *
     * @param {ContentTypeInterface} child
     * @param {boolean} autoAppend
     * @returns {ContentTypeInterface}
     */
    public clone(child: ContentTypeInterface, autoAppend: boolean = true): ContentTypeInterface {
        const store = child.store;
        const instance = child.constructor as typeof ContentType;
        const duplicate = new instance(
            child.parent,
            child.config,
            child.stageId,
        );
        duplicate.preview = child.preview;
        duplicate.content = child.content;
        const index = child.parent.getChildren().indexOf(child) + 1 || null;
        store.update(
            duplicate.id,
            Object.assign({}, store.get(child.id)),
        );

        child.getChildren()().forEach((subChild: ContentTypeInterface, childIndex: number) => {
            const createDuplicate = subChild.preview.clone(subChild, false);
            createDuplicate.preview = subChild.preview;
            createDuplicate.content = subChild.content;
            if (createDuplicate) {
                duplicate.addChild(
                    createDuplicate,
                    childIndex,
                );
            }
        });

        this.dispatchContentTypeCloneEvents(child, duplicate, index);

        if (autoAppend) {
            child.parent.addChild(duplicate, index);
        }
        return duplicate;
    }
}
