/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import appearanceConfig from "../../component/block/appearance-config";
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
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, converterPool) {
        super(parent, stage, config, converterPool);

        this.preview = getPreviewInstance(this, config);

        const defaults: FieldDefaults = {};
        if (config.fields) {
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
        const appearance = this.preview.data.appearance ? this.preview.data.appearance() : undefined;
        let template = appearanceConfig(this.config.name, appearance).preview_template;
        if (undefined === template) {
            template = "Magento_PageBuilder/component/block/preview/abstract.html";
        }
        return template;
    }

    /**
     * Retrieve the render template
     *
     * @returns {string}
     */
    get renderTemplate(): string {
        let template = appearanceConfig(this.config.name, this.getData().appearance).render_template;
        if (undefined === template) {
            template = "Magento_PageBuilder/component/block/render/abstract.html";
        }
        return template;
    }
}
