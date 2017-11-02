/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface ContentBlockConfig {
    label: string;
    name: string;
    visible: boolean;
    icon: string;
    allowed_parents: Array<any>;
}