import Block from "../block";
import _, {Dictionary} from "underscore";
import ko from "knockout";

interface PreviewData {
    [key: string]: KnockoutObservable<any>;
}

/**
 * PreviewBlock class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class PreviewBlock {
    template: string = '';
    parent: Block;
    config: any;
    data: PreviewData = {};

    constructor(parent: Block, config: object) {
        this.parent = parent;
        this.config = config;

        if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
            this.template = this.config.preview_template;
        }

        // Subscribe to this blocks data in the store
        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                const missingFields = _.difference(this.config.fields_list, _.keys(data));
                missingFields.forEach((key) => {
                    this.updateDataValue(key, '');
                });
                _.forEach(data, (value, key) => {
                    this.updateDataValue(key, value);
                });
            },
            this.parent.id
        );
    }

    /**
     * Update the data value of a part of our internal Knockout data store
     *
     * @param {string} key
     * @param value
     */
    private updateDataValue(key: string, value: any) {
        if (typeof this.data[key] !== 'undefined' && ko.isObservable(this.data[key])) {
            this.data[key](value);
        } else {
            this.data[key] = ko.observable(value);
        }
    }

    /**
     * @returns {object}
     */
    getStyle() {
        let styleAttributes = [
            'min_height',
            'background_color',
            'background_image',
            'background_size',
            'background_attachment',
            'background_repeat',
            'border_style',
            'border_width',
            'border_color',
            'border_radius',
            'margin_top',
            'margin_right',
            'margin_bottom',
            'margin_left',
            'padding_top',
            'padding_right',
            'padding_bottom',
            'padding_left'
        ];
        let data = {};
        Object.keys(this.data).map(
            function (key) {
                if (Object.values(styleAttributes).indexOf(key) > -1) {
                    data[this.fromSnakeToCamelCase(key)] = this.data[key]
                }
            }.bind(this)
        );
        console.log(data)
        return data;
    }

    /**
     * Convert from snake case to camel case
     *
     * @param string
     * @returns {string}
     */
    private fromSnakeToCamelCase(string) {
        let parts = string.split(/[_-]/);
        let newString = '';
        for (let i = 1; i < parts.length; i++) {
            newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return parts[0] + newString;
    }
}