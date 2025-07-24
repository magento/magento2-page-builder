/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */
/// <reference types="jqueryui" />

import ContentTypeCollectionInterface from "../content-type-collection.types";

/**
 * @api
 */
export interface PreviewSortableSortUpdateEventParams {
    instance: ContentTypeCollectionInterface;
    newPosition: number;
    originalPosition: number;
    ui: JQueryUI.SortableUIParams;
    event: JQueryEventObject;
}

/**
 * @api
 */
export interface PlaceholderOptionsInterface {
    element: (clone: JQuery) => JQuery;
    update: () => boolean;
}

/**
 * @api
 */
export interface SortableOptionsInterface extends JQueryUI.SortableOptions {
    placeholder?: any | string | PlaceholderOptionsInterface;
}
