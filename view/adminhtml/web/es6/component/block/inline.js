import Block from "./block";
/**
 * InlineBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class InlineBlock extends Block {
    constructor() {
        super(...arguments);
        this.editOnInsert = false;
    }
}
