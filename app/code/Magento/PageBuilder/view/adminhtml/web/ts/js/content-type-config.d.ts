/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConfigFieldInterface from "./component/block/config-field.d";

export interface ContentTypeConfigInterface {
    name: string;
    label: string;
    icon: string;
    form: string;
    contentType: string;
    group: string;
    fields: ConfigFieldInterface;
    preview_template: string;
    render_template: string;
    preview_component: string;
    content_component: string;
    component: string;
    appearances: string[];
    readers: string[];
    allowed_parents: string[];
    is_visible: boolean;
}