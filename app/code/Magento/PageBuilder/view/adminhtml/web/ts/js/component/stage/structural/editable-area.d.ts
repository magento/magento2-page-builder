/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Structural } from './abstract.d';
import Stage from "../../stage";

export interface EditableAreaInterface {
    id: string;
    children: KnockoutObservableArray<any>;
    stage: Stage;
    title: string;

    addChild(child: Structural, index?: number): void;
    removeChild(child: any): void;
}