/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import ContentTypeCollection from "../../content-type-collection";
import Config from "../config";
import EventBus from "../event-bus";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import BlockMountEventParamsInterface from "./block-mount-event-params.d";
import ColumnGroup from "./column-group";
import createBlock from "./factory";

export default class Column extends ContentTypeCollection {
}
