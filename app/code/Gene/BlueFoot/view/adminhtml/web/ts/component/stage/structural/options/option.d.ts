import { Structural } from "../abstract.d";

/**
 * Option Interface
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
interface OptionInterface {
    parent: Structural;
    code: string;
    icon: string;
    title: string;
    classes: string;
    sort: number;
    template?: string;
}