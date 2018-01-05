/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import { Option } from "../stage/structural/options/option";
import $t from 'mage/translate';
import _ from "underscore";
import Block from "./block";
'use strict';
/*eslint-disable */
export default class Row extends Block {

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    get options(): Array<Option> {
        let removeOption;
        if (this.stage.children().length < 2) {
            removeOption = new Option(this, 'remove', '<i></i>', $t('Remove'), function() { return; }, ['remove-structural disabled'], 100);
        } else {
            removeOption = new Option(this, 'remove', '<i></i>', $t('Remove'), this.onOptionRemove, ['remove-structural'], 100);
        }
        return [
            new Option(this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10),
            new Option(this, 'edit', '<i></i>', $t('Edit'), this.onOptionEdit, ['edit-block'], 50),
            new Option(this, 'duplicate', '<i class="icon-bluefoot-copy"></i>', $t('Duplicate'), this.onOptionDuplicate, ['duplicate-structural'], 60),
            removeOption
        ];
    }

    /**
     * Get stype properties for an block
     * Example {'backgroundColor': '#cccccc'}
     *
     * @returns {DataObject}
     */
    getStyle() {
        const children:any = this.children();
        let styleAttributes:any  = {},
            isAllColumns:boolean = true;
        if (children.length !== 0) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].config.name !== 'column') {
                    isAllColumns = false;
                }
            }
        } else {
            isAllColumns = false;
        }
        if (isAllColumns) {
            styleAttributes['display'] = 'flex';
        }
        return _.extend(super.getStyle(), styleAttributes);
    }
}
