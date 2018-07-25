/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface PreviewDataElementData {
    [key: string]: any;
}

export default interface PreviewData {
    [key: string]: {
        [key: string]: KnockoutObservable<PreviewDataElementData>;
        attributes: KnockoutObservable<PreviewDataElementData>;
        style: KnockoutObservable<PreviewDataElementData>;
        css: KnockoutObservable<PreviewDataElementData>;
        html: KnockoutObservable<PreviewDataElementData>;
    };
}
