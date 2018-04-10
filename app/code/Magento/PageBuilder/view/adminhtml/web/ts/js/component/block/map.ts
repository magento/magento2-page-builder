/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import GoogleMap from "Magento_PageBuilder/js/utils/map";
import EventBus from "../event-bus";
import Block from "./block";

export default class Map extends Block {

    /**
     * Open edit menu on map content type drop with a delay of 300ms
     */
    public bindEvents() {
        super.bindEvents();

        // When a map is dropped for the first time open the edit panel
        EventBus.on("map:block:dropped:create", (event: Event, params: {[key: string]: any}) => {
            if (params.id === this.id) {
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
        let centerCoord = {
            lat: 30.2672,
            lng: -97.7431,
        };
        let options = {
            zoom: 8,
        };

        if (markers && markers !== "" && markers.length && Object.keys(markers[0]).length) {
            const pos = this.getPosition();
            markers = pos.markers;
            centerCoord = pos.latLng;
            options = {
                zoom: pos.zoom,
            };
        }
        this.map = new GoogleMap(element, markers, centerCoord, options);
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
            const pos = this.getPosition();
            this.map.onUpdate(pos.markers, pos.latLng, pos.zoom);
        }
    }

    /**
     * Get markers, center coordinates, and zoom from data.position
     *
     * @returns {Object}
     */
    private getPosition() {
        const markers: any = typeof this.data.main.attributes()["data-markers"] === "string" ?
            JSON.parse(this.data.main.attributes()["data-markers"]) : this.data.main.attributes()["data-markers"];
        let zoom: number = this.data.main.attributes()["data-zoom"];
        if (typeof zoom !== "number") {
            zoom = parseInt(zoom, 10);
        }

        return {
            latLng: {
                lat: parseFloat(markers[0].lat),
                lng: parseFloat(markers[0].lng),
            },
            markers: [{
                lat: parseFloat(markers[0].lat),
                lng: parseFloat(markers[0].lng),
            }],
            zoom,
        };
    }
}
