import Block from "./block";

/**
 * InlineBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class InlineBlock extends Block {
    editOnInsert: boolean = false;

    /**
     * Get template master format template
     *
     * @returns {string}
     */
    getPreviewTemplate(): string {
        return 'Gene_BlueFoot/component/stage/structural/render/heading.html';
    };
}