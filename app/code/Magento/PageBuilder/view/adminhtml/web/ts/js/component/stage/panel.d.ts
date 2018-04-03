/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface PanelInterface {
    searchValue: KnockoutObservable<string>;
    searching: KnockoutObservable<boolean>;
    searchResults: KnockoutObservableArray<any>;
    groups: KnockoutObservableArray<any>;
    isVisible?: KnockoutObservable<boolean>;
    isCollapsed?: KnockoutObservable<boolean>;
}
