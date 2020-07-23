/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../content-type-config.types";
import ContentTypeInterface from "../content-type.types";
import ObservableObject from "./observable-updater.types";

export interface PreviewInterface {
    contentType: ContentTypeInterface;
    config: ContentTypeConfigInterface;
    data: ObservableObject;
    displayLabel: KnockoutObservable<string>;
    display: KnockoutObservable<boolean>;
    wrapperElement: Element;
    placeholderCss: KnockoutObservable<object>;
    isPlaceholderVisible: KnockoutObservable<boolean>;
    isEmpty: KnockoutObservable<boolean>;
    appearance: KnockoutObservable<string>;

    /**
     * Destroys current instance
     */
    destroy(): void;
}
