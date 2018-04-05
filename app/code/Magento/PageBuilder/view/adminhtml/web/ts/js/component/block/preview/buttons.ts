/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import PreviewBlock from "./block";

export default class Buttons extends PreviewBlock {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);
}
