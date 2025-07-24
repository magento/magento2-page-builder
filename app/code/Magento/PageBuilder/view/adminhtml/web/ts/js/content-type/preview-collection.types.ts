/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */
import ContentTypeCollectionInterface from "../content-type-collection.types";
import PreviewCollection from "./preview-collection";

export interface PreviewCollectionInterface extends PreviewCollection {
    contentType: ContentTypeCollectionInterface;
}
