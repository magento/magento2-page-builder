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
        const position: string = this.data.main.attributes()["data-position"] || "{}";
        const controls = this.data.main.attributes()["data-show-controls"] || "true";
        let marker: {} = {};

        let options = {
            disableDefaultUI: controls !== "true",
            mapTypeControl: controls === "true",
        };
        if (position !== "{}") {
            const mapData = this.getMapData();
            marker = mapData.marker;
            options = mapData.options;
        }
        this.map = new GoogleMap(element, marker, options);
    }

    /**
     * Updates map
     *
     * @returns {void}
     */
    private updateMap() {
        if (this.data.main.attributes()["data-position"] !== "{}") {
            const mapData = this.getMapData();
            this.map.onUpdate(mapData.marker, mapData.options);
        }
    }

    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */
    private getMapData() {
        const attributes = this.data.main.attributes();
        const location: string = attributes["data-location-name"];
        let position: string = attributes["data-position"];
        const address: string = attributes["data-address"];
        const city: string = attributes["data-city"];
        const comment: string = attributes["data-comment"];
        const controls = attributes["data-show-controls"];
        const country: string = attributes["data-country"];
        const zipcode: string = attributes["data-zipcode"];
        if (position !== "" && typeof position === "string") {
            position = JSON.parse(position);
        }

        return {
            marker: {
                coordinates: {
                    lat: parseFloat(position.lat),
                    lng: parseFloat(position.lng),
                },
                location,
                address,
                city,
                comment,
                country,
                zipcode,
            },
            options: {
                center: {
                    lat: parseFloat(position.lat),
                    lng: parseFloat(position.lng),
                },
                disableDefaultUI: controls !== "true",
                mapTypeControl: controls === "true",
            },
        };
    }
}
