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
        const locations: string = this.data.main.attributes()["data-location-listing"] || "[]";
        const controls = this.data.main.attributes()["data-show-controls"] || "true";
        let markers = [];

        let options = {
            disableDefaultUI: controls !== "true",
            mapTypeControl: controls === "true",
        };
        if (locations !== "[]") {
            const mapData = this.getMapData();

            markers = mapData.markers;
            options = mapData.options;
        }
        this.map = new GoogleMap(element, markers, options);
    }

    /**
     * Updates map
     *
     * @returns {void}
     */
    private updateMap() {
        const mapData = this.getMapData();
        this.map.onUpdate(mapData.markers, mapData.options);
    }

    /**
     * Get markers, center coordinates, and zoom from data.position
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
        let markers: any = attributes["data-location-listing"];

        if (markers !== "" && typeof markers === "string") {
            markers = JSON.parse(markers);
        }

        markers.forEach((marker: any) => {
            marker.position.lat = parseFloat(marker.position.lat);
            marker.position.lng = parseFloat(marker.position.lng);
        });

        if (markers[0]) {
            options.center = {
                lat: markers[0].position.lat,
                lng: markers[0].position.lng,
            };
        }

        return {
            markers,
            options,
        };
    }
}
