/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import PreviewCollection from "../../../preview-collection";

export default class Buttons extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);
}
