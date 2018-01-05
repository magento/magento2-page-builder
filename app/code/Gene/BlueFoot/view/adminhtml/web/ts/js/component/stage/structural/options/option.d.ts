/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from "../abstract.d";

interface OptionInterface {
    parent: Structural;
    code: string;
    icon: string;
    title: string;
    classes: string;
    sort: number;
    template?: string;
}