/**
 * - Save.js
 * Handles saving the data from within the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/config',
    'underscore',
    'hyperscript',
    'xyperscript'
], function (Config, _, h, x) {

    /**
     * Save class for serialization of the stage
     *
     * @param stage
     * @param valueFn
     * @param renderer
     * @param binder
     * @constructor
     */
    function Save(stage, valueFn) {
        this.stage = stage;
        this.input = false;

        this.valueFn = valueFn;

        this.deleted = [];

        this.prefix = 'm2-cms-';

        this.update = _.debounce(
            this.commit.bind(this),
            250
        );
    }

    /**
     * Observe a specific knockout observable to fire serialization
     *
     * @param observables
     */
    Save.prototype.observe = function (observables) {
        if (!Array.isArray(observables)) {
            observables = [observables];
        }
        var self = this;
        _.forEach(observables, function (observable) {
            if (typeof observable.subscribe !== 'function') {
                throw Error('Observable passed to Save.observe() is not observable');
            }
            observable.subscribe(self.update);
        });
    };

    /**
     * Commit changes to the text area value
     */
    Save.prototype.commit = function () {
        var self = this;
        this.serializeStage().then(function (structure) {
            console.log(structure);
            self.valueFn(structure.outerHTML);
        }).catch(function (reason) {
            // Report chained errors to the console
            console.error(reason);
        });
    };

    /**
     * Retrieve the stages HTML structure
     *
     * @returns {Promise}
     */
    Save.prototype.serializeStage = function () {
        return this.serializeObject(this.stage);
    };

    /**
     * Serialize an individual Advanced CMS object
     *
     * @param object
     * @returns {Promise}
     */
    Save.prototype.serializeObject = function (object) {
        var self = this;
        if (!object.serializeTags) {
            return Promise.reject(Error('Object must declare at least serializeTags to be serialized.'));
        }

        return this.retrieveChildren(object).then(function (children) {
            return self.buildStructureElement(
                self.buildTag(object.serializeTags), /* Build the hyperscript tag e.g. div.m2-class-row */
                object.serializeData || {}, /* Provide any specific element attributes e.g. data-role="heading" */
                self.buildData(object, children) /* Provide all children elements from the children.structure function */
            );
        }).catch(function (reason) {
            // Report chained errors to the console
            console.error(reason);
        });
    };

    /**
     * Build the data for the object
     *
     * @param object
     * @param children
     */
    Save.prototype.buildData = function (object, children) {
        var objectData = this.retrieveObjectData(object);
        children = children || [];

        // Only include the data <script /> tag if the object contains data
        if (!_.isEmpty(objectData)) {
            // Ensure the children are in an array
            if (!_.isArray(children)) {
                children = [children];
            }

            // Include the data <script /> tag as the first item in the child
            children.unshift(h(
                'script',
                {
                    'type': 'text/advanced-cms-data',
                    'data-checksum': '' // Checksum is generated server side once saved
                },
                JSON.stringify(this.retrieveObjectData(object))
            ));
        }

        return children;
    };

    /**
     * Build up the data attributes object for an element
     *
     * @param object
     * @returns {{}}
     */
    Save.prototype.retrieveObjectData = function (object) {
        var attributes = {};
        if (object.dataEntityData && _.isArray(object.dataEntityData)) {
            _.forEach(object.dataEntityData, function (object) {
                // Handle KO observables & anonymous functions
                if (typeof object === 'function') {
                    object = object();
                }
                if (typeof object === 'object' && !_.isArray(object)) {
                    _.extend(attributes, object);
                }
            });
        }

        if (object.dataEntityDataIgnore && _.isArray(object.dataEntityDataIgnore)) {
            attributes = _.omit(attributes, object.dataEntityDataIgnore);
        }

        return attributes;
    };

    /**
     * Build the structure element using Hyperscript
     *
     * @param tag
     * @param data
     * @param children
     * @returns {*}
     */
    Save.prototype.buildStructureElement = function (tag, data, children) {
        return h(
            tag, /* Build the hyperscript tag e.g. div.m2-class-row */
            data || {}, /* Provide any specific element attributes e.g. data-role="heading" */
            children /* Provide all children elements from the children.structure function */
        );
    };

    /**
     * Retrieve children from object
     *
     * @param object
     * @returns {Promise}
     */
    Save.prototype.retrieveChildren = function (object) {
        if (object.serializeChildren) {
            return this.serializeChildren(object.serializeChildren).then(function(result) {
                return result;
            });
        } else {
            return Promise.resolve({});
        }
    };

    /**
     * Serialize children of an object
     *
     * @param children
     * @returns {Promise}
     */
    Save.prototype.serializeChildren = function (children) {
        var self = this;
        if (children && children.length > 0) {
            var childSerializePromises = [];
            _.forEach(children, function (childFn) {
                if (typeof childFn !== 'function') {
                    return Promise.reject(Error('An entry in serializeChildren is not a valid Knockout function.'));
                }
                _.forEach(childFn(), function (child) {
                    childSerializePromises.push(self.serializeObject(child));
                });
            });
            return Promise.all(childSerializePromises).then(function(result) {
                return result;
            });
        } else {
            return Promise.resolve({});
        }
    };

    /**
     * Build up our hyperscript tag
     *
     * @param tags
     * @returns {string}
     */
    Save.prototype.buildTag = function (tags) {
        var result = 'div';
        result += this.convertTagsToString(tags).join('');
        return result;
    };

    /**
     * Convert tags into a string format for hyperscript
     *
     * Examples:
     * ['column'] = div.m2-cms-column
     * ['column', ['test', function () { return '1234'; }]] = div.m2-cms-column.m2-cms-test-1234
     *
     * @param tags
     * @param ignorePrefix
     * @returns {Array}
     */
    Save.prototype.convertTagsToString = function (tags, ignorePrefix) {
        var self = this,
            result = [];
        _.forEach(tags, function (tag) {
            if (Array.isArray(tag)) {
                result.push('.' + self.prefix + self.convertTagsToString(tag, true).join(''));
            } else {
                if (typeof tag === 'function') {
                    tag = tag();
                }
                result.push((!ignorePrefix ? '.' + self.prefix : '') + tag);
            }
        });
        return result;
    };

    /**
     * When an entity is deleted we need to clean up by removing it's entry in the database
     *
     * @param entityId
     */
    Save.prototype.delete = function (entityId) {
        this.deleted.push(entityId);
    };

    return Save;
});
