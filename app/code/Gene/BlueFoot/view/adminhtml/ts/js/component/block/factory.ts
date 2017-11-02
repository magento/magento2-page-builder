/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from './block';
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import loadModule from 'Gene_BlueFoot/js/component/loader';

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
    return config.js_block || 'Gene_BlueFoot/js/component/block/block';
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
    const appearanceApplierComponentName: string = 'Gene_BlueFoot/js/utils/appearance-applier';
    const createAppearanceComponents = (components) => {
        let appearanceComponents: any = {};
        Object.keys(components).map(
            (key: string) => {
                let component = components[key];
                let componentName: string = component.name.split(/(?=[A-Z])/).join('-').toLowerCase();
                appearanceComponents[componentName] = new component();
            }
        );
        return appearanceComponents;
    };
    stage = stage || parent.stage;
    formData = formData || {};
    return new Promise((resolve, reject) => {
        loadModule([appearanceApplierComponentName], (appearanceApplier) => {
            const loadTypeComponent = (appearanceComponents) => {
                loadModule([getBlockComponentPath(config)], (blockComponent: any) => {
                    try {
                        resolve(new blockComponent(parent, stage, config, formData, new appearanceApplier(appearanceComponents)));
                    } catch (e) {
                        reject(e);
                    }
                });
            };
            if (config['appearances'].length) {
                loadModule(config['appearances'], (...components) => {
                    loadTypeComponent(createAppearanceComponents(components));
                });
            } else {
                loadTypeComponent({});
            }
        });
    });
}
