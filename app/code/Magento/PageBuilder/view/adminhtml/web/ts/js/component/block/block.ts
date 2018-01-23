/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Appearance from "../../component/appearance/appearance";
import {ConfigContentBlock, ConfigFieldConfig} from "../config";
import Stage from "../stage";
import getPreviewInstance from "../stage/previews";
import Structural from "../stage/structural/abstract";
import EditableArea from "../stage/structural/editable-area";
import { Block as BlockInterface } from "./block.d";
import PreviewBlock from "./preview/block";

interface FieldDefaults {
    [key: string]: any;
}

export default class Block extends Structural implements BlockInterface {
    public title: string;
    public editOnInsert: boolean = true;
    public preview: PreviewBlock;
    public childEntityKeys: string[] = [];

    /**
     * Block constructor
     *
     * @param {EditableArea} parent
     * @param {Stage} stage
     * @param {ConfigContentBlock} config
     * @param formData
     * @param {Appearance} appearance
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearance: Appearance) {
        super(parent, stage, config, appearance);

        this.preview = getPreviewInstance(this, config);

        const defaults: FieldDefaults = {};
        if (typeof config !== "undefined" && config.fields) {
            _.each(config.fields, (field: ConfigFieldConfig, key: string | number) => {
                defaults[key] = field.default;
            });
        }

        this.stage.store.update(
            this.id,
            _.extend(defaults, formData),
        );
    }

    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */
    get previewTemplate(): string {
        if (this.config.preview_template) {
            return this.config.preview_template;
        }
        return "Magento_PageBuilder/component/block/preview/abstract.html";
    }

    /**
     * Retrieve the render template
     *
     * @returns {string}
     */
    get renderTemplate(): string {
        if (this.config.render_template) {
            return this.config.render_template;
        }
        return "Magento_PageBuilder/component/block/render/abstract.html";
    }
}
