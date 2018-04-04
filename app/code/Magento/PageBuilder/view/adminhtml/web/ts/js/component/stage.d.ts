/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { EditableAreaInterface } from "stage/structural/editable-area.d";
import DataStore from "./data-store";
import PageBuilder from "./page-builder";

export interface StageInterface extends EditableAreaInterface {
    parent: PageBuilder;
    showBorders: KnockoutObservable<boolean>;
    userSelect: KnockoutObservable<boolean>;
    loading: KnockoutObservable<boolean>;
    store: DataStore;

    ready(): void;
    getTemplate(): string;
}
