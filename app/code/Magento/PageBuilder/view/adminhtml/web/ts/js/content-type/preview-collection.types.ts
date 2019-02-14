/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import ContentTypeCollectionInterface from "../content-type-collection.types";
import PreviewCollection from "./preview-collection";

export interface PreviewCollectionInterface extends PreviewCollection {
    contentType: ContentTypeCollectionInterface;
}
