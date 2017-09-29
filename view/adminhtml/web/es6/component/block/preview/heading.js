import PreviewBlock from "./block";
import $t from 'mage/translate';
/**
 * Class Heading
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Heading extends PreviewBlock {
    constructor() {
        super(...arguments);
        // @todo move these into UI component declaration
        this.defaults = {
            heading_type: 'h2',
            title: $t('Start typing your heading here...')
        };
    }
}
