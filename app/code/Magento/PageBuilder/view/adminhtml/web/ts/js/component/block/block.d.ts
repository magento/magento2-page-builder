/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from 'stage/structural/abstract.d';
import Preview from "../../preview";

export interface Block extends Structural {
    title: string;preview: Preview;
    childEntityKeys: Array<string>;
}