/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import {Options} from "../stage/structural/options";
import Block from "./block";
import {BlockReadyEventParams} from "./factory";

export default class TabItem extends Block {

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        options.removeOption("title");
        return options;
    }
}
