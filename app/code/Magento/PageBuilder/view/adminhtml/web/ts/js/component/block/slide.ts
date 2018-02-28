/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import $t from "mage/translate";
import {Option} from "../stage/structural/options/option";

export default class Slide extends Block {

    /**
     * Return an array of options, minus the move option
     *
     * @returns {Array<Option>}
     */
    get options(): Option[] {
        return super.options.filter((option) => {
            return (option.code !== "move");
        });
    }
}
