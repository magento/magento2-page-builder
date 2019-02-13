/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.types";
import ContentTypeInterface from "../content-type.types";
import Preview from "./preview";

/**
 * @api
 */
export interface ContentTypeAfterRenderEventParamsInterface {
    id: string;
    element: Element;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
}

/**
 * @api
 */
export interface ContentTypeBeforeMoveEventParams {
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}

/**
 * @api
 */
export interface ContentTypeCreateEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
}

/**
 * @api
 */
export interface ContentTypeDroppedCreateEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
}

/**
 * @api
 */
export interface ContentTypeDuplicateEventParamsInterface {
    originalContentType: ContentTypeInterface | ContentTypeCollectionInterface;
    duplicateContentType: ContentTypeInterface | ContentTypeCollectionInterface;
    index: number;
    direct: boolean;
}

/**
 * @api
 */
export interface ContentTypeMountEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
    expectChildren: number;
}

/**
 * @api
 */
export interface ContentTypeMoveEventParamsInterface {
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}

/**
 * @api
 */
export interface ContentTypeReadyEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
}

/**
 * Content type event fired whenever content changes dimensions or visibility
 *
 * @api
 */
export interface ContentTypeRedrawAfterEventParamsInterface {
    id: string;
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
}

/**
 * @api
 */
export interface ContentTypeRemovedEventParamsInterface {
    contentType: ContentTypeInterface | ContentTypeCollectionInterface;
    index: number;
    parentContentType: ContentTypeCollectionInterface;
    stageId: string;
}

/**
 * @api
 */
export interface ContentTypeRemovedParamsInterface {
    parentContentType: ContentTypeCollectionInterface;
    index: number;
    contentType: ContentTypeInterface;
    stageId: string;
}

/**
 * @api
 */
export interface ContentTypeMoveParamsInterface {
    contentType: ContentTypeInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}

/**
 * @api
 */
export interface PreviewDataUpdateAfterParamsInterface {
    preview: Preview;
}
