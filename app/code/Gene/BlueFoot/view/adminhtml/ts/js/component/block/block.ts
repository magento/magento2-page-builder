/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Structural from '../stage/structural/abstract';
import EditableArea from '../stage/structural/editable-area'
import Stage from '../stage';
import { Block as BlockInterface } from './block.d';
import getPreviewInstance from "../stage/previews";
import PreviewBlock from "./preview/block";
import $t from "mage/translate";
import _ from "underscore";
import {ConfigContentBlock, ConfigFieldConfig} from "../config";
import AppearanceApplier from "../../utils/appearance-applier";

interface FieldDefaults {
    [key: string]: any;
}

export default class Block extends Structural implements BlockInterface {
    title: string;
    editOnInsert: boolean = true;
    preview: PreviewBlock;
    childEntityKeys: Array<string> = [];
    previewTemplate: string = 'Gene_BlueFoot/component/block/preview/abstract.html';
    renderTemplate: string = 'Gene_BlueFoot/component/block/render/abstract.html';

    /**
     * AbstractBlock constructor
     *
     * @param parent
     * @param stage
     * @param config
     * @param formData
     * @param appearanceApplier
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any, appearanceApplier: AppearanceApplier) {
        super(parent, stage, config, appearanceApplier);

        this.preview = getPreviewInstance(this, config);

        if (config.preview_template) {
            this.previewTemplate = config.preview_template;
        }
        if (config.render_template) {
            this.renderTemplate = config.render_template;
        }

        let defaults: FieldDefaults = {};
        if (config.fields) {
            _.each(config.fields, (field: ConfigFieldConfig, key: string | number) => {
                defaults[key] = field.default;
            })
        }

        this.stage.store.update(
            this.id,
            _.extend(defaults, formData)
        );
    }
}
