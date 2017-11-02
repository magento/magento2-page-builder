/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from 'stage/structural/abstract.d';
import PreviewBlock from "./preview/block";

export interface Block extends Structural {
    title: string;
    editOnInsert: boolean;
    preview: PreviewBlock;
    childEntityKeys: Array<string>;
}