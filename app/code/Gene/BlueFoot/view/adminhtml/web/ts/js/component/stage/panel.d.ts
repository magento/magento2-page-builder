/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {StageInterface} from "../stage.d";

export interface PanelInterface {
    componentTemplate: string;
    stage: StageInterface;
    searchValue: KnockoutObservable<string>;
    searching: KnockoutObservable<boolean>;
    searchResults: KnockoutObservableArray<any>;
    groups: KnockoutObservableArray<any>;
    originalScrollTop: number;
    defaults?: object;

    isVisible?: KnockoutObservable<boolean>;
    isCollapsed?: KnockoutObservable<boolean>;
}
