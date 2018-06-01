/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import GoogleMap from "Magento_PageBuilder/js/utils/map";
import events from "uiEvents";
import BasePreview from "../preview";

export default class Preview extends BasePreview {

    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    public bindEvents() {
        super.bindEvents();

        // When a map is dropped for the first time open the edit panel
        events.on("map:block:dropped:create", (args: {[key: string]: any}) => {
            if (args.id === this.parent.id) {
                setTimeout(() => {
                    this.edit.open();
                }, 300);
            }
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
        this.data.main.attributes.subscribe(() => {
            this.updateMap();
        });
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
        this.map = new GoogleMap(element, locations, options);
    }

    /**
     * Updates map
     *
     * @returns {void}
     */
    private updateMap() {
        const mapData = this.getMapData();
        this.map.onUpdate(mapData.locations, mapData.options);
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
            location.position.lat = parseFloat(location.position.lat);
            location.position.lng = parseFloat(location.position.lng);
        });

        if (locations[0]) {
            options.center = {
                lat: locations[0].position.lat,
                lng: locations[0].position.lng,
            };
        }

        return {
            locations,
            options,
        };
    }
}
