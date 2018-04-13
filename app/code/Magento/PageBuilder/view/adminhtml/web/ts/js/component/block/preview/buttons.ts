/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Preview from "../../../preview";

export default class Buttons extends Preview {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);
}
