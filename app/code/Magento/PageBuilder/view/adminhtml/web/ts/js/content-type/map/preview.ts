/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import GoogleMap from "Magento_PageBuilder/js/utils/map";
import module from "module";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public apiKeyValid: KnockoutObservable<boolean> = ko.observable(!!module.config().apiKey);
    public apiKeyErrorMessage: string = module.config().apiKeyErrorMessage;
    private element: Element;
    private mapElement: GoogleMap;

    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    public bindEvents() {
        super.bindEvents();

        // When the map api key fails, empties out the content type and adds the placeholder
        events.on("googleMaps:authFailure", () => {
            this.apiKeyValid(false);
        });
    }

    /**
     * Renders the map and subscribe to position for updates
     *
     * @param {Element} element
     * @returns {void}
     */
    public renderMap(element: Element) {
        this.generateMap(element);
        this.element = element;
        if (this.mapElement.map) {
            this.data.main.attributes.subscribe(() => {
                this.updateMap();
            });
        }
    }

    /**
     * Generate maps
     *
     * @param {Element} element
     * @returns {void}
     */
    private generateMap(element: Element) {
        const currentLocations: string = this.data.main.attributes()["data-locations"] || "[]";
        const controls = this.data.main.attributes()["data-show-controls"] || "true";
        let locations = [];
        let options = {
            disableDefaultUI: controls !== "true",
            mapTypeControl: controls === "true",
        };

        if (currentLocations !== "[]") {
            const mapData = this.getMapData();
            locations = mapData.locations;
            options = mapData.options;
        }

        try {
            this.mapElement = new GoogleMap(element, locations, options);
        } catch (e) {
            this.apiKeyValid(false);
        }
    }

    /**
     * Updates map
     *
     * @returns {void}
     */
    private updateMap() {
        const mapData = this.getMapData();
        this.mapElement.onUpdate(mapData.locations, mapData.options);
    }

    /**
     * Get locations, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */
    private getMapData() {
        const attributes = this.data.main.attributes();
        const controls: string = attributes["data-show-controls"];
        const options: any = {
            disableDefaultUI: controls !== "true",
            mapTypeControl: controls === "true",
        };
        let locations: any = attributes["data-locations"];

        if (locations !== "" && typeof locations === "string") {
            locations = JSON.parse(locations);
        }

        locations.forEach((location: any) => {
            location.position.latitude = parseFloat(location.position.latitude);
            location.position.longitude = parseFloat(location.position.longitude);
        });

        return {
            locations,
            options,
        };
    }
}
