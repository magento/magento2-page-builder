/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "./content-type-config.types";

export default interface ConfigInterface {
    menu_sections: MenuSectionInterface;
    content_types: ContentTypeConfigInterface[];
    stage_config: StageConfigInterface;
    media_url: string;
    preview_url: string;
    render_url: string;
    column_grid_default: string;
    column_grid_max: string;
    can_use_inline_editing_on_stage: boolean;
    widgets: WidgetsInterface;
    defaultViewport: string;
    viewport: string;
    viewports: {[key: string]: object};
}

export type Mode = "Preview" | "Master";

export interface MenuSectionInterface {
    [key: string]: MenuSectionItemInterface;
}

export interface MenuSectionItemInterface {
    label: string;
    name: string;
    sortOrder: string;
    translate: string;
}

export interface StageConfigInterface {
    [key: string]: any;
}

export interface WidgetsInterface {
    [key: string]: {
        [key: string]: {
            buttonSelector?: string;
            showOverlay?: string;
            dataRole?: string;
        };
    };
}
