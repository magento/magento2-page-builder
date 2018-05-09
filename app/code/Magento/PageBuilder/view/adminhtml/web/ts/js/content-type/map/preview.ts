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
        let markers: any = typeof this.data.main.attributes()["data-markers"] === "string" ?
            JSON.parse(this.data.main.attributes()["data-markers"]) : this.data.main.attributes()["data-markers"];
        let options = {
            zoom: 8,
            disableDefaultUI: false,
        };

        if (markers && markers !== "" && markers.length && Object.keys(markers[0]).length) {
            const pos = this.getMarkers();
            markers = pos.markers;
            options = pos.options;
        }

        this.map = new GoogleMap(element, markers, options);
    }

    /**
     * Updates map
     *
     * @returns {void}
     */
    private updateMap() {
        let markers = this.data.main.attributes()["data-markers"];
        if (typeof markers === "string" && markers !== "") {
           markers = JSON.parse(this.data.main.attributes()["data-markers"]) ;
        }
        if (markers.length) {
            const pos = this.getMarkers();
            this.map.onUpdate(pos.markers, pos.options);
        }
    }

    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */
    private getMarkers() {
        const attributes = this.data.main.attributes();
        const markers: any = typeof attributes["data-markers"] === "string" ?
            JSON.parse(attributes["data-markers"]) : attributes["data-markers"];
        let zoom: number = attributes["data-zoom"];
        let location: string = attributes["data-location-name"];
        let address: string = attributes["data-address"];
        let city: string = attributes["data-city"];
        let comment: string = attributes["data-comment"];
        let controls = attributes['data-show-controls'];
        let country: string = attributes["data-country"];
        let zip: string = attributes["data-zip"];

        if (typeof zoom !== "number") {
            zoom = parseInt(zoom, 10);
        }

        return {
            markers: [{
                coordinates : {
                    lat: parseFloat(markers[0].lat),
                    lng: parseFloat(markers[0].lng),
                },
                location,
                address,
                city,
                comment,
                country,
                zip,
            }],
            options: {
                zoom,
                center: {
                    lat: parseFloat(markers[0].lat),
                    lng: parseFloat(markers[0].lng),
                },
                disableDefaultUI: controls !== 'false',
            },
        };
    }
}
