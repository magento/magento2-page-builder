/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface ContentBlockConfig {
    label: string;
    name: string;
    is_visible: boolean;
    icon: string;
    allowed_parents: Array<any>;
}
