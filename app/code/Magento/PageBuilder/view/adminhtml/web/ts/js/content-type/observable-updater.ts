/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import consoleLogger from "consoleLogger";
import ko from "knockout";
import _ from "underscore";
import Config from "../config";
import {
    ContentTypeConfigAppearanceElementInterface,
    ContentTypeConfigAppearanceElementsInterface,
    ConverterInterface,
} from "../content-type-config.types";
import ConverterPool from "../converter/converter-pool";
import {DataObject} from "../data-store";
import MassConverterPool from "../mass-converter/converter-pool";
import appearanceConfig from "./appearance-config";
import Master from "./master";
import {BindingGenerator, GeneratedElementsData} from "./observable-updater.types";
import {default as generateAttributes} from "./observable-updater/attributes";
import {default as generateCss} from "./observable-updater/css";
import {default as generateHtml} from "./observable-updater/html";
import {default as generateStyle} from "./observable-updater/style";
import Preview from "./preview";

type Binding = "attributes" | "css" | "html" | "style";

export default class ObservableUpdater {
    private converterPool: typeof ConverterPool;
    private massConverterPool: typeof MassConverterPool;
    private converterResolver: (config: object) => string;
    private previousData: GeneratedElementsData = {};
    private bindingGenerators: Record<Binding, BindingGenerator> = {
        attributes: generateAttributes,
        css: generateCss,
        html: generateHtml,
        style: generateStyle,
    };

    /**
     * @param {typeof ConverterPool} converterPool
     * @param {typeof MassConverterPool} massConverterPool
     * @param {(config: object) => string} converterResolver
     */
    constructor(
        converterPool: typeof ConverterPool,
        massConverterPool: typeof MassConverterPool,
        converterResolver: (config: object) => string,
    ) {
        this.converterPool = converterPool;
        this.massConverterPool = massConverterPool;
        this.converterResolver = converterResolver;
    }

    /**
     * Update the associated viewModel with the generated data
     *
     * We create an API for each potential binding and make it available in the master and preview templates through
     * the data variable. Each data variable will have associated observables that are updated on a data change.
     *
     * @param {Preview} viewModel
     * @param {DataObject} data
     * @param {DataObject} dataStores
     */
    public update(viewModel: Preview | Master, data: DataObject, dataStores?: {[key: string]: DataObject}) {
        const appearance = data && data.appearance !== undefined ? data.appearance as string : undefined;
        const appearanceConfiguration = appearanceConfig(viewModel.contentType.config.name, appearance);
        if (undefined === appearanceConfiguration
            || undefined === appearanceConfiguration.elements
        ) {
            return;
        }

        // Generate Knockout bindings in objects for usage in preview and master templates
        const generatedBindings = this.generateKnockoutBindings(
            appearanceConfiguration.elements,
            appearanceConfiguration.converters,
            data,
            dataStores,
        );

        for (const element in generatedBindings) {
            if (generatedBindings.hasOwnProperty(element)) {
                // Ensure every element is represented by an object
                if (viewModel.data[element] === undefined) {
                    viewModel.data[element] = {};
                }

                /**
                 * Iterate through each elements data (css, style, attributes) and apply data updates within the
                 * observable. If no observable already exists create a new one.
                 */
                Object.keys(generatedBindings[element]).forEach((key) => {
                    const elementBindings = viewModel.data[element][key];
                    if (elementBindings !== undefined && ko.isObservable(elementBindings)) {
                        elementBindings(generatedBindings[element][key]);
                    } else {
                        viewModel.data[element][key] = ko.observable(generatedBindings[element][key]);
                    }
                });
            }
        }
    }

    /**
     * Generate binding object to be applied to master format
     *
     * This function iterates through each element defined in the content types XML and generates a nested object of
     * the associated Knockout binding data. We support 5 bindings attributes, style, css, html & tag.
     *
     * @param elements
     * @param converters
     * @param data
     * @param dataStoreStates
     */
    public generateKnockoutBindings(
        elements: ContentTypeConfigAppearanceElementsInterface,
        converters: ConverterInterface[],
        data: DataObject,
        dataStoreStates?: {[key: string]: DataObject},
    ): GeneratedElementsData {
        const convertedData = this.convertData(data, converters);
        const generatedData: GeneratedElementsData = {};

        for (const elementName of Object.keys(elements)) {
            const elementConfig = elements[elementName];
            if (this.previousData[elementName] === undefined) {
                this.previousData[elementName] = {};
            }

            generatedData[elementName] = {
                attributes: this.generateKnockoutBinding("attributes", elementName, elementConfig, data),
                style: Config.getMode() === "Preview" ?
                    this.generateKnockoutBinding("style", elementName, elementConfig, data) :
                    this.generateKnockoutBindingForBreakpoints(
                        "style",
                        elementName,
                        elementConfig,
                        data,
                        dataStoreStates,
                    ),
                css: elementConfig.css.var in convertedData ?
                    this.generateKnockoutBinding("css", elementName, elementConfig, data) : {},
                html: this.generateKnockoutBinding("html", elementName, elementConfig, data),
            };

            if (elementConfig.tag !== undefined && elementConfig.tag.var !== undefined) {
                if (generatedData[elementName][elementConfig.tag.var] === undefined) {
                    generatedData[elementName][elementConfig.tag.var] = "";
                }
                generatedData[elementName][elementConfig.tag.var] = convertedData[elementConfig.tag.var];
            }
        }

        return generatedData;
    }

    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {object} data
     * @param {ConverterInterface[]} convertersConfig
     * @returns {object}
     */
    public convertData(data: DataObject, convertersConfig: ConverterInterface[]): DataObject {
        for (const converterConfig of convertersConfig) {
            this.massConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
        }
        return data;
    }

    /**
     * Generate an individual knockout binding
     *
     * @param binding
     * @param elementName
     * @param config
     * @param data
     */
    private generateKnockoutBinding(
        binding: Binding,
        elementName: string,
        config: ContentTypeConfigAppearanceElementInterface,
        data: DataObject,
    ) {
        if (config[binding] === undefined) {
            return {};
        }

        let previousData = {};
        if (this.previousData[elementName][binding] !== undefined) {
            previousData = this.previousData[elementName][binding];
        }

        if (this.bindingGenerators[binding] === undefined) {
            consoleLogger.error("Unable to find Knockout binding generator for " + binding);
            return {};
        }

        // Generate the associated binding using our dedicated generators
        const generatedBindingData = this.bindingGenerators[binding](
            elementName,
            config,
            data,
            this.converterResolver,
            this.converterPool,
            previousData,
        );

        this.previousData[elementName][binding] = generatedBindingData;
        return generatedBindingData;
    }
    /**
     * Generate an individual knockout binding for breakpoints
     *
     * @param binding
     * @param elementName
     * @param config
     * @param data
     * @param dataStoreStates
     */
    private generateKnockoutBindingForBreakpoints(
        binding: Binding,
        elementName: string,
        config: ContentTypeConfigAppearanceElementInterface,
        data: DataObject,
        dataStoreStates: {[key: string]: DataObject},
    ) {
        const result: {[key: string]: any} = {};

        Object.keys(dataStoreStates).forEach((name: string) => {
            result[name] = _.isEmpty(dataStoreStates[name]) ?
                {} :
                this.generateKnockoutBinding(binding, elementName, config, dataStoreStates[name]);
        });

        return result;
    }
}
