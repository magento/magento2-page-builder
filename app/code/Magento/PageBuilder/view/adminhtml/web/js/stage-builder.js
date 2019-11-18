/*eslint-disable */
/* jscs:disable */
define(["mage/translate", "Magento_PageBuilder/js/events", "Magento_Ui/js/modal/alert", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-collection", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type/appearance-config", "Magento_PageBuilder/js/master-format/validator", "Magento_PageBuilder/js/utils/directives", "Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/utils/object"], function (_translate, _events, _alert, _, _config, _contentTypeCollection, _contentTypeFactory, _appearanceConfig, _validator, _directives, _loader, _object) {
  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Build the stage with the provided value
   *
   * @param {stage} stage
   * @param {string} value
   * @returns {Promise<void>}
   */
  function buildFromContent(stage, value) {
    var stageDocument = new DOMParser().parseFromString(value, "text/html");
    stageDocument.body.setAttribute(_config.getConfig("dataContentTypeAttributeName"), "stage");
    return buildElementIntoStage(stageDocument.body, stage.rootContainer, stage);
  }
  /**
   * Build an element and it's children into the stage
   *
   * @param {Element} element
   * @param {ContentTypeCollectionInterface} contentType
   * @param {stage} stage
   * @returns {Promise<void>}
   */


  function buildElementIntoStage(element, contentType, stage) {
    if (element instanceof HTMLElement && element.getAttribute(_config.getConfig("dataContentTypeAttributeName"))) {
      var childPromises = [];
      var childElements = [];
      var children = getElementChildren(element);

      if (children.length > 0) {
        _.forEach(children, function (childElement) {
          childPromises.push(createElementContentType(childElement, stage, contentType));
          childElements.push(childElement);
        });
      } // Wait for all the promises to finish and add the instances to the stage


      return Promise.all(childPromises).then(function (childrenPromises) {
        return Promise.all(childrenPromises.map(function (child, index) {
          contentType.addChild(child); // Only render children if the content type implements the collection

          if (child instanceof _contentTypeCollection) {
            return buildElementIntoStage(childElements[index], child, stage);
          }
        }));
      });
    }
  }
  /**
   * Parse an element in the structure and build the required element
   *
   * @param {Element} element
   * @param {ContentTypeCollectionInterface} contentType
   * @param {stage} stage
   * @returns {Promise<ContentTypeInterface>}
   */


  function createElementContentType(element, stage, contentType) {
    contentType = contentType || stage.rootContainer;
    var role = element.getAttribute(_config.getConfig("dataContentTypeAttributeName"));

    if (!role) {
      return Promise.reject("Invalid master format: Content type element does not contain\n            " + _config.getConfig("dataContentTypeAttributeName") + " attribute.");
    }

    var config = _config.getContentTypeConfig(role);

    if (!config) {
      return Promise.reject("Unable to load Page Builder configuration for content type \"" + role + "\".");
    }

    return getElementData(element, config).then(function (data) {
      return (0, _contentTypeFactory)(config, contentType, stage.id, data, getElementChildren(element).length);
    });
  }
  /**
   * Retrieve the elements data
   *
   * @param {HTMLElement} element
   * @param {ContentTypeConfigInterface} config
   * @returns {Promise<{[p: string]: any}>}
   */


  function getElementData(element, config) {
    // Create an object with all fields for the content type with an empty value
    var appearance = element.dataset.appearance + "-appearance";
    var fields = config.fields[appearance] || config.fields.default;
    var result = createInitialElementData(fields);
    return new Promise(function (resolve) {
      var role = element.getAttribute(_config.getConfig("dataContentTypeAttributeName"));

      if (!_config.getConfig("content_types").hasOwnProperty(role)) {
        resolve(result);
      } else {
        var readerComponents = (0, _appearanceConfig)(role, element.dataset.appearance).reader;
        (0, _loader)([readerComponents], function () {
          for (var _len = arguments.length, readers = new Array(_len), _key = 0; _key < _len; _key++) {
            readers[_key] = arguments[_key];
          }

          var ReaderComponent = readers.pop();
          var reader = new ReaderComponent();
          reader.read(element).then(function (readerData) {
            /**
             * Iterate through the reader data and set the values onto the result array to ensure dot notation
             * keys are properly handled.
             */
            _.each(readerData, function (value, key) {
              (0, _object.set)(result, key, value);
            });

            resolve(result);
          });
        });
      }
    });
  }
  /**
   * Create the initial object for storing the elements data
   *
   * @param {ConfigFieldInterface} fields
   * @returns {FieldDefaultsInterface}
   */


  function createInitialElementData(fields) {
    return _.mapObject(fields, function (field) {
      if (!_.isUndefined(field.default)) {
        return "";
      } else if (_.isObject(field)) {
        return createInitialElementData(field);
      }
    });
  }
  /**
   * Return elements children, search for direct descendants, or traverse through to find deeper children
   *
   * @param {HTMLElement} element
   * @returns {Array<HTMLElement>}
   */


  function getElementChildren(element) {
    if (element.hasChildNodes()) {
      var children = []; // Find direct children of the element

      _.forEach(element.childNodes, function (child) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.hasAttribute(_config.getConfig("dataContentTypeAttributeName"))) {
            children.push(child);
          } else {
            children = getElementChildren(child);
          }
        }
      });

      return children;
    }

    return [];
  }
  /**
   * Build a new instance of stage, add row & text content types if needed
   *
   * @param {Stage} stage
   * @param {string} initialValue
   * @returns {Promise<any>}
   */


  function buildEmpty(stage, initialValue) {
    var stageConfig = _config.getConfig("stage_config");

    var rootContainer = stage.rootContainer;

    var rootContentTypeConfig = _config.getContentTypeConfig(stageConfig.root_content_type);

    var htmlDisplayContentTypeConfig = _config.getContentTypeConfig(stageConfig.html_display_content_type);

    if (rootContentTypeConfig) {
      return (0, _contentTypeFactory)(rootContentTypeConfig, rootContainer, stage.id).then(function (rootContentType) {
        if (!rootContentType) {
          return Promise.reject("Unable to create initial " + stageConfig.root_content_type + " content type " + " within stage.");
        }

        rootContainer.addChild(rootContentType);

        if (htmlDisplayContentTypeConfig && initialValue) {
          return (0, _contentTypeFactory)(htmlDisplayContentTypeConfig, rootContainer, stage.id, {
            html: initialValue
          }).then(function (text) {
            rootContentType.addChild(text);
          });
        }
      });
    }

    return Promise.resolve();
  }
  /**
   * Build a stage with the provided content type, content observable and initial value
   *
   * @param {Stage} stage
   * @param {string} content
   * @returns {Promise}
   */


  function build(stage, content) {
    var currentBuild;
    content = (0, _directives.removeQuotesInMediaDirectives)(content); // Determine if we're building from existing page builder content

    if ((0, _validator)(content)) {
      currentBuild = buildFromContent(stage, content).catch(function (error) {
        console.error(error);
        stage.rootContainer.children([]);
        currentBuild = buildEmpty(stage, content);
      });
    } else {
      currentBuild = buildEmpty(stage, content);
    } // Once the build process is finished the stage is ready


    return currentBuild.catch(function (error) {
      (0, _alert)({
        content: (0, _translate)("An error has occurred while initiating Page Builder. Please consult with your technical " + "support contact."),
        title: (0, _translate)("Page Builder Error")
      });

      _events.trigger("stage:error", error);

      console.error(error);
    });
  }

  return build;
});
//# sourceMappingURL=stage-builder.js.map