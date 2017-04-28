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
    function Save(stage, valueFn, renderer, binder) {
        this.stage = stage;
        this.input = false;

        this.valueFn = valueFn;
        this.renderer = renderer;
        this.binder = binder;

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
        this.serializeStage().then(function (result) {
            var structure = result.structure,
                data = x.compile(result.data, [])(); // Commit the XML structure creating an XML string

            // @todo determine submission strategy for this data
            console.log(structure, data);
            self.valueFn(structure);
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
        return Promise.all([
            this.retrieveChildren(object),
            this.retrieveRepresentation(object)
        ]).then(function (result) {
            var children = result[0],
                structureChildren = children.structure || [],
                representation = result[1],
                dataChildren = children.data || [];

            return {
                structure: self.buildStructureElement(
                    self.buildTag(object.serializeTags), /* Build the hyperscript tag e.g. div.m2-class-row */
                    object.serializeData || {}, /* Provide any specific element attributes e.g. data-role="heading" */
                    self.buildStructureChildren(structureChildren, representation)
                        /* Provide all children elements from the children.structure function */
                ),
                data: self.buildDataElement(
                    object.dataTag, /* The data tag is the XML tagName e.g. entity */
                    self.buildDataAttributes(object), /* These are the attributes applied to the element */
                    self.buildDataChildren(dataChildren, object) /* These are any children applied within the element */
                )
            };
        }).catch(function (reason) {
            // Report chained errors to the console
            console.error(reason);
        });
    };

    /**
     * Build up the structure children, this is a combination of child elements & any HTML representation
     *
     * @param structureChildren
     * @param representation
     * @returns []
     */
    Save.prototype.buildStructureChildren = function (structureChildren, representation) {
        // Detect if the representation is a HTMLCollection or not
        if (representation && representation instanceof HTMLCollection) {
            _.forEach(representation, function (element) {
                structureChildren.push(element);
            });
        } else if (representation) {
            structureChildren.push(representation);
        }

        return structureChildren;
    };

    /**
     * Build up the data attributes object for an element
     *
     * @param object
     * @returns {{}}
     */
    Save.prototype.buildDataAttributes = function (object) {
        if (object.dataAttributes && typeof object.dataAttributes == 'object') {
            var attributes = {};
            _.forEach(object.dataAttributes, function (value, key) {
                if (typeof value === 'function') {
                    value = value();
                }
                attributes[key] = x.param(value);
            });
            return attributes;
        }

        return {};
    };

    /**
     * Build up the children of an object to be inserted into the data tree. This includes child elements alongside
     * an <attributes /> node if required.
     *
     * <attributes /> is used to store data to be persisted to the database. It'll be parsed, stored & removed server
     * side.
     *
     * @param dataChildren
     * @param object
     * @returns []
     */
    Save.prototype.buildDataChildren = function (dataChildren, object) {
        if (object.dataEntityData) {
            _.forEach(object.dataEntityData, function (dataAttr) {
                if (typeof dataAttr === 'function') {
                    var attributes = [];
                    _.forEach(dataAttr(), function (value, key) {
                        if (_.indexOf(object.dataEntityDataIgnore || [], key) === -1) {
                            attributes.push(x.x(key, [
                                x.cdata(value)
                            ]));
                        }
                    });
                    dataChildren.push(x.x('attributes', attributes));
                }
            })
        }

        return dataChildren;
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
     * Build the data XML element using xyperscript
     *
     * @param tag
     * @param attributes
     * @param children
     * @returns {*}
     */
    Save.prototype.buildDataElement = function (tag, attributes, children) {
        return x.x(
            tag,
            attributes || {},
            children
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
                return {
                    structure: result.structure,
                    data: result.data
                }
            });
        } else {
            return Promise.resolve({
                structure: [],
                data: []
            });
        }
    };

    /**
     * Retrieve the HTML representation of an object, this will allow 3rd parties to understand the format of the
     * object. This will be a KnockoutJS template stored against an XML node in advanced_cms.xml
     *
     * @param object
     * @returns {Promise}
     */
    Save.prototype.retrieveRepresentation = function (object) {
        if (object.serializeRepresentation) {
            var self = this;
            return this.renderer.render(object.serializeRepresentation).then(function (template) {
                return self.binder.applyBindings(object.data() || {}, template);
            });
        } else {
            return Promise.resolve(null);
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
                var childStructure = [],
                    childData = [];
                _.each(result, function (child) {
                    childStructure.push(child.structure);
                    childData.push(child.data);
                });
                return {
                    structure: childStructure,
                    data: childData
                };
            });
        } else {
            return Promise.resolve({
                structure: [],
                data: []
            });
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
