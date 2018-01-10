/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import {DataObject} from "../data-store";
import Appearance from "./appearance";

export default class AppearanceFactory {
    /**
     * Create appearance applier
     *
     * @param data {DataObject}
     * @returns {Promise<Appearance>}
     */
    public create(data: DataObject): Promise<Appearance> {
        return new Promise((resolve: (Appearance: Appearance) => void, reject: (e: Error) => void) => {
            try {
                const appearanceKey = "appearances";
                if (data[appearanceKey].length) {
                    loadModule(data[appearanceKey], (...components: object[]) => {
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
        const appearanceComponents: any = {};
        Object.keys(components).map(
            (key: string) => {
                const component = components[key];
                const componentName: string = component.name.split(/(?=[A-Z])/).join("-").toLowerCase();
                appearanceComponents[componentName] = new component();
            },
        );
        return appearanceComponents;
    }
}
