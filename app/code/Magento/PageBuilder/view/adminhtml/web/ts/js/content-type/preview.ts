/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import confirmationDialog from "Magento_PageBuilder/js/modal/dismissible-confirm";
import _ from "underscore";
import "../binding/live-edit";
import "../binding/sortable";
import "../binding/sortable-children";
import Config from "../config";
import ContentTypeCollection from "../content-type-collection";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import ContentTypeConfigInterface, {ConfigFieldInterface} from "../content-type-config.types";
import createContentType from "../content-type-factory";
import ContentTypeMenu from "../content-type-menu";
import Edit from "../content-type-menu/edit";
import Option from "../content-type-menu/option";
import {OptionsInterface} from "../content-type-menu/option.types";
import TitleOption from "../content-type-menu/title-option";
import ContentTypeInterface from "../content-type.types";
import {DataObject} from "../data-store";
import {getDraggedContentTypeConfig} from "../drag-drop/registry";
import {getSortableOptions} from "../drag-drop/sortable";
import checkStageFullScreen from "../utils/check-stage-full-screen";
import {get} from "../utils/object";
import appearanceConfig from "./appearance-config";
import ObservableUpdater from "./observable-updater";
import ObservableObject from "./observable-updater.types";
import {PreviewInterface} from "./preview.types";

/**
 * @api
 */
export default class Preview implements PreviewInterface {
    public contentType: ContentTypeInterface;
    public config: ContentTypeConfigInterface;
    public data: ObservableObject = {};
    public displayLabel: KnockoutObservable<string> = ko.observable();
    public display: KnockoutObservable<boolean> = ko.observable(true);
    public appearance: KnockoutObservable<string> = ko.observable();
    public wrapperElement: Element;
    public placeholderCss: KnockoutObservable<object>;
    public isPlaceholderVisible: KnockoutObservable<boolean> = ko.observable(true);
    public isEmpty: KnockoutObservable<boolean> = ko.observable(true);
    public viewport: KnockoutObservable<string> = ko.observable("");

    /**
     * Provide preview data as an object which can be queried
     *
     * @deprecated please use getOptionValue directly
     */
    public previewData: {[key: string]: KnockoutObservable<any>} = {};

    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
     */
    protected fieldsToIgnoreOnRemove: string[] = [];
    protected events: DataObject = {};
    protected isSnapshot: KnockoutObservable<boolean> = ko.observable(false);

    private edit: Edit;
    private optionsMenu: ContentTypeMenu;
    private observableUpdater: ObservableUpdater;
    private mouseover: boolean = false;
    private mouseoverContext: Preview;

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        this.contentType = contentType;
        this.config = config;
        this.edit = new Edit(this.contentType, this.contentType.dataStore);
        this.optionsMenu = new ContentTypeMenu(this, this.retrieveOptions());
        this.observableUpdater = observableUpdater;
        this.displayLabel(this.config.label);
        this.placeholderCss = ko.observable({
            "visible": this.isEmpty,
            "empty-placeholder-background": this.isPlaceholderVisible,
        });

        if (Config.getConfig("pagebuilder_content_snapshot")) {
            this.isSnapshot(!checkStageFullScreen(this.contentType.stageId));
        }
        this.viewport(Config.getConfig("viewport"));
        this.bindEvents();
        this.populatePreviewData();
    }

    /**
     * Retrieve the preview template
     *
     * @returns {string}
     */
    get template(): string {
        return appearanceConfig(this.config.name, this.appearance()).preview_template;
    }

    /**
     * Calls methods by event name.
     *
     * @param {string}  eventName
     * @param {any} params
     */
    public trigger(eventName: string, params: any): void {
        if (this.events[eventName]) {
            const methods = this.events[eventName] as string;

            _.each(methods.split(" "), (methodName) => {
                const method = (this as any)[methodName];

                if (method) {
                    method.call(this, params);
                }
            }, this);
        }
    }

    /**
     * Tries to call specified method of a current content type.
     *
     * @param args
     */
    public delegate(...args: any[]) {
        const methodName = args.slice(0, 1)[0];
        const method = (this as any)[methodName];

        if (method) {
            method.apply(this, args.slice(1, args.length));
        }
    }

    /**
     * Open the edit form for this content type
     */
    public openEdit(): void {
        return this.edit.open();
    }

    /**
     * Update data store
     *
     * @param {string} key
     * @param {string} value
     */
    public updateData(key: string, value: string) {
        this.contentType.dataStore.set(key, value);
    }

    /**
     * Retrieve the value for an option
     *
     * @param key
     */
    public getOptionValue(key: string) {
        return this.contentType.dataStore.get(key);
    }

    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onMouseOver(context: Preview, event: Event): void {
        if (this.mouseover || getDraggedContentTypeConfig()) {
            return;
        }

        // Ensure no other options panel is displayed
        $(".pagebuilder-options-visible").removeClass("pagebuilder-options-visible");
        this.mouseover = true;
        this.mouseoverContext = context;
        const currentTarget = event.currentTarget as HTMLElement;
        let optionsMenu = $(currentTarget).find(".pagebuilder-options-wrapper");

        if (!$(currentTarget).hasClass("type-nested")) {
            optionsMenu = optionsMenu.first();
        }

        const middleOfPreview = currentTarget.getBoundingClientRect().left + currentTarget.offsetWidth / 2;

        // Check for space for option menu
        if (window.innerWidth - middleOfPreview > optionsMenu.width() / 2) {
            optionsMenu.parent().addClass("pagebuilder-options-middle");
        } else {
            optionsMenu.parent().removeClass("pagebuilder-options-middle");
        }

        optionsMenu.parent().addClass("pagebuilder-options-visible");

        $(currentTarget).addClass("pagebuilder-content-type-active");
    }

    /**
     * Set state based on mouseout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onMouseOut(context: Preview, event: Event) {
        this.mouseover = false;

        if (getDraggedContentTypeConfig()) {
            return;
        }

        _.delay(() => {
            if (!this.mouseover && this.mouseoverContext === context) {
                const currentTarget = event.currentTarget;
                let optionsMenu = $(currentTarget).find(".pagebuilder-options-wrapper");

                if (!$(currentTarget).hasClass("type-nested")) {
                    optionsMenu = optionsMenu.first();
                }

                optionsMenu.parent().removeClass("pagebuilder-options-visible");
                $(currentTarget).removeClass("pagebuilder-content-type-active");
            }
        }, 100); // 100 ms delay to allow for users hovering over other elements
    }

    /**
     * After children render fire an event
     *
     * @param {Element} element
     * @deprecated
     */
    public afterChildrenRender(element: Element): void {
        events.trigger("contentType:childrenRenderAfter",
            {
                id: this.contentType.id,
                contentType: this.contentType,
                element,
            },
        );
        events.trigger(
            this.contentType.config.name + ":childrenRenderAfter",
            {
                contentType: this.contentType,
                element,
                id: this.contentType.id,
            },
        );
    }

    /**
     * Dispatch an after render event for individual content types
     *
     * @param {Element[]} elements
     */
    public dispatchAfterRenderEvent(elements: Element[]): void {
        const elementNodes = elements.filter((renderedElement: Element) => {
            return renderedElement.nodeType === Node.ELEMENT_NODE;
        });
        if (elementNodes.length > 0) {
            const element = elementNodes[0];
            this.wrapperElement = element;
            events.trigger("contentType:renderAfter",
                {
                    id: this.contentType.id,
                    contentType: this.contentType,
                    element,
                },
            );
            events.trigger(
                this.contentType.config.name + ":renderAfter",
                {
                    contentType: this.contentType,
                    element,
                    id: this.contentType.id,
                },
            );
            this.disableImageUploadOnHide(element);
        }
    }

    /**
     * Get the options instance
     *
     * @returns {ContentTypeMenu}
     */
    public getOptions(): ContentTypeMenu {
        return this.optionsMenu;
    }

    /**
     * Handle user editing an instance
     */
    public onOptionEdit(): void {
        this.openEdit();
    }

    /**
     * Reverse the display data currently in the data store
     */
    public onOptionVisibilityToggle(): void {
        const display = this.contentType.dataStore.get<boolean>("display");
        this.contentType.dataStore.set("display", !display);
        this.dispatchContentTypeVisibilityEvents(this.contentType, !display);
    }

    /**
     * Handle duplicate of items
     */
    public onOptionDuplicate(): void {
        this.clone(this.contentType, true, true);
    }

    /**
     * Duplicate content type
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
     * @param {boolean} autoAppend
     * @param {boolean} direct
     * @returns {Promise<ContentTypeInterface> | void}
     */
    public clone(
        contentType: ContentTypeInterface | ContentTypeCollectionInterface,
        autoAppend: boolean = true,
        direct: boolean = false,
    ): Promise<ContentTypeInterface> | void {
        const defaultViewport = Config.getConfig("defaultViewport");
        const contentTypeData = contentType.dataStores[defaultViewport].getState();
        const index = contentType.parentContentType.getChildren()().indexOf(contentType) + 1 || null;

        return createContentType(
            contentType.config,
            contentType.parentContentType,
            contentType.stageId,
            contentTypeData,
            0,
            contentType.getDataStoresStates(),
        ).then((duplicateContentType: ContentTypeInterface) => {
            if (autoAppend) {
                contentType.parentContentType.addChild(duplicateContentType, index);
            }

            this.dispatchContentTypeCloneEvents(contentType, duplicateContentType, index, direct);

            return duplicateContentType;
        });
    }

    /**
     * Handle content type removal
     */
    public onOptionRemove(): void {
        const removeContentType = () => {
            if (this.wrapperElement) {
                // Fade out the content type
                $(this.wrapperElement).fadeOut(350 / 2, () => {
                    this.contentType.destroy();
                });
            } else {
                this.contentType.destroy();
            }
        };

        if (this.isConfigured()) {
            confirmationDialog({
                actions: {
                    confirm: () => {
                        // Call the parent to remove the child element
                        removeContentType();
                    },
                },
                content: $t("Are you sure you want to remove this item? The data within this item is not recoverable once removed."), // tslint:disable-line:max-line-length
                dismissKey: "pagebuilder_modal_dismissed",
                dismissible: true,
                title: $t("Confirm Item Removal"),
            });
        } else {
            removeContentType();
        }
    }

    /**
     * Determine if the container can receive drop events? With the current matrix system everything can unless
     * specified in an inherited preview instance.
     *
     * @returns {boolean}
     */
    public isContainer() {
        return true;
    }

    /**
     * Return the sortable options
     *
     * @returns {JQueryUI.SortableOptions}
     */
    public getSortableOptions(): JQueryUI.SortableOptions | any {
        return getSortableOptions(this);
    }

    /**
     * Destroys current instance
     */
    public destroy(): void {
        return;
    }

    /**
     * Get the CSS classes for the children element, as we dynamically create this class name it can't sit in the DOM
     * without causing browser issues
     *
     * @returns {{[p: string]: boolean}}
     */
    public getChildrenCss() {
        return {
            [this.config.name + "-container"]: true,
        };
    }

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    protected retrieveOptions(): OptionsInterface {
        const options: OptionsInterface = {
            move: new Option({
                preview: this,
                icon: "<i class='icon-admin-pagebuilder-handle'></i>",
                title: $t("Move"),
                classes: ["move-structural"],
                sort: 10,
            }),
            title: new TitleOption({
                preview: this,
                title: this.config.label,
                template: "Magento_PageBuilder/content-type/title",
                sort: 20,
            }),
            edit: new Option({
                preview: this,
                icon: "<i class='icon-admin-pagebuilder-systems'></i>",
                title: $t("Edit"),
                action: this.onOptionEdit,
                classes: ["edit-content-type"],
                sort: 30,
            }),
            duplicate: new Option({
                preview: this,
                icon: "<i class='icon-pagebuilder-copy'></i>",
                title: $t("Duplicate"),
                action: this.onOptionDuplicate,
                classes: ["duplicate-structural"],
                sort: 50,
            }),
            remove: new Option({
                preview: this,
                icon: "<i class='icon-admin-pagebuilder-remove'></i>",
                title: $t("Remove"),
                action: this.onOptionRemove,
                classes: ["remove-structural"],
                sort: 60,
            }),
        };

        return options;
    }

    /**
     * Dispatch content type clone events
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} originalContentType
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} duplicateContentType
     * @param {number} index
     * @param {boolean} direct
     */
    protected dispatchContentTypeCloneEvents(
        originalContentType: ContentTypeInterface | ContentTypeCollectionInterface,
        duplicateContentType: ContentTypeInterface | ContentTypeCollectionInterface,
        index: number,
        direct: boolean,
    ) {
        const duplicateEventParams = {
            originalContentType,
            duplicateContentType,
            index,
            direct,
        };

        events.trigger("contentType:duplicateAfter", duplicateEventParams);
        events.trigger(originalContentType.config.name + ":duplicateAfter", duplicateEventParams);
    }

    /**
     * Dispatch content type visibility events
     *
     * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
     * @param {boolean} visibility
     */
    protected dispatchContentTypeVisibilityEvents(
        contentType: ContentTypeInterface | ContentTypeCollectionInterface,
        visibility: boolean,
    ) {
        const visibilityEventParams = {
            contentType,
            visibility,
        };

        events.trigger("contentType:visibilityAfter", visibilityEventParams);
        events.trigger(contentType.config.name + ":visibilityAfter", visibilityEventParams);
    }

    /**
     * Bind events
     */
    protected bindEvents() {
        const fullScreenModeChangeAfterEvent = `stage:${this.contentType.stageId}:fullScreenModeChangeAfter`;

        this.contentType.dataStore.subscribe(
            (data: DataObject) => {
                this.updateObservables();
                this.updatePlaceholderVisibility(data);
                // Keep a reference to the display state in an observable for adding classes to the wrapper
                this.display(!!data.display);
                this.appearance(data.appearance);
            },
        );
        if (this.contentType instanceof ContentTypeCollection) {
            this.contentType.children.subscribe(
                (children: any[]) => {
                    this.isEmpty(!children.length);
                },
            );
        }

        events.on(fullScreenModeChangeAfterEvent, this.toggleSnapshot.bind(this));
        events.on(`stage:${this.contentType.stageId}:viewportChangeAfter`, (args: {viewport: string}) => {
            this.viewport(args.viewport);
        });
    }

    /**
     * After observables updated, allows to modify observables
     */
    protected afterObservablesUpdated(): void {
        return;
    }

    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */
    protected isConfigured() {
        const data = this.contentType.dataStore.getState();
        const fields = this.contentType.config.fields[this.appearance() + "-appearance"] ||
            this.contentType.config.fields.default;
        let hasDataChanges = false;
        _.each(fields, (field, key: string) => {
            if (this.fieldsToIgnoreOnRemove && this.fieldsToIgnoreOnRemove.includes(key)) {
                return;
            }
            let fieldValue = get(data, key);
            if (!fieldValue) {
                fieldValue = "";
            }
            // Default values can only ever be strings
            if (_.isObject(fieldValue)) {
                // Empty arrays as default values appear as empty strings
                if (_.isArray(fieldValue) && fieldValue.length === 0) {
                    fieldValue = "";
                } else {
                    fieldValue = JSON.stringify(fieldValue);
                }
            }
            if (_.isObject(field.default)) {
                if (JSON.stringify(field.default) !== fieldValue) {
                    hasDataChanges = true;
                }
            } else if (field.default !== fieldValue) {
                hasDataChanges = true;
            }
            return;
        });
        return hasDataChanges;
    }

    /**
     * Any hidden element should block drag / drop events from uploading images from the OS. We have to block this for
     * all elements as underlying elements could still receive the events if a parent is hidden.
     *
     * @param {Element} element
     */
    private disableImageUploadOnHide(element: Element) {
        $(element).on("drag dragstart dragend dragover dragenter dragleave drop", (event) => {
            if (this.display() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

    /**
     * Update observables
     */
    private updateObservables(): void {
        this.observableUpdater.update(
            this,
            _.extend({}, this.contentType.dataStore.getState()),
        );
        this.afterObservablesUpdated();
    }

    /**
     * Update placeholder background visibility base on height and padding
     *
     * @param {DataObject} data
     */
    private updatePlaceholderVisibility(data: DataObject): void {
        const minHeight = !_.isEmpty(data.min_height) ? parseFloat(data.min_height as string) : 130;
        const marginsAndPadding = _.isString(data.margins_and_padding) && data.margins_and_padding ?
            JSON.parse(data.margins_and_padding as string) :
            data.margins_and_padding || {};
        const padding = marginsAndPadding.padding || {};
        const paddingBottom = parseFloat(padding.bottom) || 0;
        const paddingTop = parseFloat(padding.top) || 0;

        this.isPlaceholderVisible(paddingBottom + paddingTop + minHeight >= 130);
    }

    /**
     * Populate the preview data with calls to the supported getOptionValue method
     *
     * @deprecated this function is only included to preserve backwards compatibility, use getOptionValue directly
     */
    private populatePreviewData(): void {
        if (this.config.fields) {
            _.each(this.config.fields, (fields) => {
                _.keys(fields).forEach((key: string) => {
                    this.previewData[key] = ko.observable("");
                });
            });
        }

        // Subscribe to this content types data in the store
        this.contentType.dataStore.subscribe(
            (data: DataObject) => {
                _.forEach(data, (value, key) => {
                    const optionValue = this.getOptionValue(key);
                    if (ko.isObservable(this.previewData[key])) {
                        this.previewData[key](optionValue);
                    } else {
                        if (_.isArray(optionValue)) {
                            this.previewData[key] = ko.observableArray(optionValue);
                        } else {
                            this.previewData[key] = ko.observable(optionValue);
                        }
                    }
                });
            },
        );
    }

    /**
     * Enable snapshot mode.
     * @param args
     */
    private toggleSnapshot(args: any): void
    {
        if (Config.getConfig("pagebuilder_content_snapshot")) {
            this.isSnapshot(!args.fullScreen);
        }
    }
}
