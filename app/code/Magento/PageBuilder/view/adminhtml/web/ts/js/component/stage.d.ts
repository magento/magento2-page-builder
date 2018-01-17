/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { EditableAreaInterface } from "stage/structural/editable-area.d";
import DataStore from "./data-store";

export interface StageInterface extends EditableAreaInterface {
    parent: any;
    active: boolean;
    showBorders: KnockoutObservable<boolean>;
    userSelect: KnockoutObservable<boolean>;
    loading: KnockoutObservable<boolean>;
    originalScrollTop: number;
    serializeRole: string;
    store: DataStore;

    ready(): void
    goFullScreen(): void
    onSortingStart(): void
    onSortingStop(): void
    isFullScreen(): boolean
}
