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

        EventBus.on("map:block:mount", (event: Event, params: {[key: string]: any}) => {
            if (params.id === this.id) {
                setTimeout(() => {
                    params.block.edit.open();
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
        const position = this.data.main.attributes()["data-position"];
        let markers: any = [];
        let centerCoord = {
            lat: 30.2672,
            lng: -97.7431,
        };
        let options = {
            zoom: 8,
        };
        if (position && position !== "") {
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
        if (this.data.main.attributes()["data-position"]) {
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
        const positions = this.data.main.attributes()["data-position"].split(",");
        return {
            latLng: {
                lat: parseFloat(positions[0]),
                lng: parseFloat(positions[1]),
            },
            markers: [{
                lat: parseFloat(positions[0]),
                lng: parseFloat(positions[1]),
            }],
            zoom: parseInt(positions[2], 10),
        };
    }
}
