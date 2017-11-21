/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from 'Gene_BlueFoot/js/component/loader';
import Block from './block';
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import AppearanceFactory from "../appearance/appearance-factory";

interface ConfigObject {
    js_block?: string;
    [key: string]: any
}

/**
 * Retrieve the block instance from the config object
 *
 * @param config
 * @returns {any|string}
 */
function getBlockComponentPath(config: ConfigObject): string {
    return config.component || 'Gene_BlueFoot/js/component/block/block';
}

/**
 * Create a new instance of a block
 *
 * @param config
 * @param parent
 * @param stage
 * @param formData
 * @returns {Promise<BlockInterface>}
 */
export default function createBlock(config: ConfigObject, parent: EditableArea, stage: Stage, formData?: object): Promise<Block> {
    stage = stage || parent.stage;
    formData = formData || {};
    const appearanceFactory: AppearanceFactory = new AppearanceFactory();
    return new Promise((resolve: Function, reject: Function) => {
        appearanceFactory.create(config)
            .then((appearance) => {
                loadModule([getBlockComponentPath(config)], (blockComponent: any) => {
                    try {
                        resolve(new blockComponent(parent, stage, config, formData, appearance));
                    } catch (e) {
                        reject(e);
                    }
                });
            }).catch((e) => {
                reject(e);
            });
    });
}
