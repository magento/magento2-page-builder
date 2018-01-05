/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from 'Gene_BlueFoot/js/component/loader';
import {DataObject} from "../data-store";
import Appearance from "./appearance";
'use strict';
/*eslint-disable */
export default class AppearanceFactory {
    /**
     * Create appearance applier
     *
     * @param data {DataObject}
     * @returns {Promise<Appearance>}
     */
    create(data: DataObject): Promise<Appearance> {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                if (data['appearances'].length) {
                    loadModule(data['appearances'], (...components) => {
                        resolve(new Appearance(this.createAppearanceComponents(components)));
                    });
                } else {
                    resolve(new Appearance({}));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Create loaded component modules
     *
     * @param components
     * @returns {any}
     */
    private createAppearanceComponents(components: any) {
        let appearanceComponents: any = {};
        Object.keys(components).map(
            (key: string) => {
                const component = components[key];
                const componentName: string = component.name.split(/(?=[A-Z])/).join('-').toLowerCase();
                appearanceComponents[componentName] = new component();
            }
        );
        return appearanceComponents;
    };
}
