/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConfigFieldInterface from "./config-field.d";

/**
 * @api
 */
export default interface ContentTypeConfigInterface {
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
    master_component: string;
    component: string;
    appearances: string[];
    readers: string[];
    allowed_parents: string[];
    is_visible: boolean;
}
