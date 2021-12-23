/*eslint-disable */
/* jscs:disable */
define(["jquery", "mage/adminhtml/tools", "mage/translate", "mageUtils", "Magento_PageBuilder/js/config"], function (_jquery, _tools, _translate, _mageUtils, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Is the inline WYSIWYG supported?
   */
  function isWysiwygSupported() {
    return _config.getConfig("can_use_inline_editing_on_stage");
  }
  /**
   * Encode content for TinyMCE
   *
   * @param content
   */


  function encodeContent(content) {
    if (isWysiwygSupported()) {
      return convertVariablesToHtmlPreview(convertWidgetsToHtmlPreview(unescapeDoubleQuoteWithinWidgetDirective(removeInvalidPlaceholders(content))));
    }

    return content;
  }
  /**
   * Prior to parsing the content remove any invalid placeholders within the content
   *
   * @param content
   */


  function removeInvalidPlaceholders(content) {
    if (content.indexOf("magento-placeholder") !== -1) {
      var html = new DOMParser().parseFromString(content, "text/html");
      var placeholders = html.querySelectorAll("span.magento-placeholder");

      if (placeholders.length > 0) {
        [].slice.call(placeholders).forEach(function (placeholder) {
          // If the invalid placeholder contains a directive, let's insert it back where it belongs
          if (placeholder.innerText.indexOf("{{") !== -1) {
            placeholder.parentNode.insertBefore(document.createTextNode(placeholder.innerText), placeholder);
          }

          placeholder.remove();
        });
      }

      return html.body.innerHTML;
    }

    return content;
  }
  /**
   * Convert all variables to their HTML preview counterparts
   *
   * Re-implements logic from lib/web/mage/adminhtml/wysiwyg/tiny_mce/plugins/magentovariable/editor_plugin.js to parse
   * and replace the variables within the content.
   *
   * @param content
   */


  function convertVariablesToHtmlPreview(content) {
    var config = _config.getConfig("tinymce").variables;

    var magentoVariables = JSON.parse(config.placeholders);
    return content.replace(/{\{\s?(?:customVar code=|config path=\")([^\}\"]+)[\"]?\s?\}\}/ig, function (match, path) {
      var id = btoa(path).replace(/\+/g, ":").replace(/\//g, "_").replace(/=/g, "-");
      var placeholder = (0, _jquery)("<span />").addClass("magento-variable").addClass("magento-placeholder").addClass("mceNonEditable").prop("id", id).prop("contentEditable", "false");

      if (magentoVariables[path].variable_type === "custom") {
        placeholder.addClass("magento-custom-var");
      }

      var variableType = magentoVariables[path].variable_type;

      if (magentoVariables[path] && (variableType === "default" || variableType === "custom")) {
        placeholder.text(magentoVariables[path].variable_name);
      } else {
        // If we're unable to find the placeholder we need to attach an error class
        placeholder.addClass("magento-placeholder-error");
        placeholder.text(variableType === "custom" ? path : (0, _translate)("Not Found"));
      }

      return placeholder[0].outerHTML;
    });
  }
  /**
   * Convert widgets within content to their HTML counterparts
   *
   * @param content
   */


  function convertWidgetsToHtmlPreview(content) {
    var config = _config.getConfig("tinymce").widgets;

    return content.replace(/\{\{widget([\S\s]*?)\}\}/ig, function (match, widgetBody) {
      var attributes = parseAttributesString(widgetBody);
      var imageSrc;

      if (attributes.type) {
        var placeholder = (0, _jquery)("<span />").addClass("magento-placeholder").addClass("magento-widget").addClass("mceNonEditable").prop("id", _mageUtils.uniqueid()).prop("contentEditable", "false");
        attributes.type = attributes.type.replace(/\\\\/g, "\\");
        imageSrc = config.placeholders[attributes.type];

        if (!imageSrc) {
          imageSrc = config.error_image_url;
          placeholder.addClass("magento-placeholder-error");
        }

        var image = (0, _jquery)("<img />").prop("id", window.Base64.idEncode(match)).prop("src", imageSrc);
        placeholder.append(image);
        var widgetType = "";

        if (config.types[attributes.type]) {
          widgetType += config.types[attributes.type];
        }

        placeholder.append((0, _jquery)(document.createTextNode(widgetType)));
        return placeholder[0].outerHTML;
      }
    });
  }
  /**
   * Parse attributes into a string
   *
   * @param attributes
   */


  function parseAttributesString(attributes) {
    var result = {};
    attributes.replace(/(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, function (match, key, value) {
      result[key] = value ? value.replace(/&quote;/g, "\"") : value;
      return "";
    });
    return result;
  }
  /**
   * Lock all image sizes before initializing TinyMCE to avoid content jumps
   *
   * @param element
   */


  function lockImageSize(element) {
    [].slice.call(element.querySelectorAll("img")).forEach(function (image) {
      if (image.style.width.length === 0) {
        image.style.width = /^\d+$/.test(image.getAttribute("width")) ? image.getAttribute("width") + "px" : image.getAttribute("width");
        image.setAttribute("data-width-locked", "true");
      }

      if (image.style.height.length === 0) {
        image.style.height = /^\d+$/.test(image.getAttribute("height")) ? image.getAttribute("height") + "px" : image.getAttribute("height");
        image.setAttribute("data-height-locked", "true");
      }
    });
  }
  /**
   * Reverse forced image size after TinyMCE is finished initializing
   *
   * @param element
   */


  function unlockImageSize(element) {
    [].slice.call(element.querySelectorAll("img")).forEach(function (image) {
      if (image.getAttribute("data-width-locked")) {
        image.style.width = null;
        image.removeAttribute("data-width-locked");
      }

      if (image.getAttribute("data-height-locked")) {
        image.style.height = null;
        image.removeAttribute("data-height-locked");
      }
    });
  }
  /**
   * Create a bookmark within the content to be restored later
   */


  function createBookmark(event) {
    var wrapperElement = (0, _jquery)(event.target).parents(".inline-wysiwyg");
    /**
     * Create an element bookmark
     *
     * @param element
     */

    var createElementBookmark = function createElementBookmark(element) {
      return {
        name: element.nodeName,
        index: findNodeIndex(wrapperElement[0], element.nodeName, element)
      };
    }; // Handle direct clicks onto an IMG


    if (event.target.nodeName === "IMG") {
      return createElementBookmark(event.target);
    }

    if (window.getSelection) {
      var selection = window.getSelection();

      var id = _mageUtils.uniqueid();

      if (selection.getRangeAt && selection.rangeCount) {
        var range = normalizeTableCellSelection(selection.getRangeAt(0).cloneRange()); // Determine if the current node is an image or span that we want to select instead of text

        var currentNode = range.startContainer;

        if (currentNode.nodeType === Node.ELEMENT_NODE && (currentNode.nodeName === "IMG" || currentNode.nodeName === "SPAN" && currentNode.classList.contains("magento-placeholder"))) {
          return createElementBookmark(currentNode);
        } // Also check if the direct parent is either of these


        var parentNode = range.startContainer.parentNode;

        if (parentNode.nodeName === "IMG" || parentNode.nodeName === "SPAN" && parentNode.classList.contains("magento-placeholder")) {
          return createElementBookmark(parentNode);
        }

        if (!range.collapsed) {
          range.collapse(false);
          var endBookmarkNode = createBookmarkSpan(id + "_end");
          range.insertNode(endBookmarkNode);
        }

        var range2 = normalizeTableCellSelection(selection.getRangeAt(0));
        range2.collapse(true);
        var startBookmarkNode = createBookmarkSpan(id + "_start");
        range2.insertNode(startBookmarkNode);
        return {
          id: id
        };
      }
    }

    return null;
  }
  /**
   * Move the cursor to our new bookmark
   *
   * @param bookmark
   */


  function moveToBookmark(bookmark) {
    window.tinymce.activeEditor.selection.moveToBookmark(bookmark);
  }
  /**
   * Retrieve active editor from TinyMCE
   */


  function getActiveEditor() {
    return window.tinymce.activeEditor;
  }
  /**
   * Create a bookmark span for the selection
   *
   * @param id
   */


  function createBookmarkSpan(id) {
    var bookmark = document.createElement("span");
    bookmark.setAttribute("data-mce-type", "bookmark");
    bookmark.id = id;
    bookmark.style.overflow = "hidden";
    bookmark.style.lineHeight = "0px";
    return bookmark;
  }
  /**
   * Find the index of an element within a wrapper
   *
   * @param wrapperElement
   * @param name
   * @param element
   */


  function findNodeIndex(wrapperElement, name, element) {
    var selector = name.toLowerCase() + ':not([data-mce-bogus="all"])'; // If there is no ID on the element add a unique ID so we can efficiently find it

    if (!element.id) {
      element.id = _mageUtils.uniqueid();
    }

    return (0, _jquery)(wrapperElement).find(selector).toArray().findIndex(function (node) {
      return node.id === element.id;
    });
  }
  /**
   * Get a node by index within a wrapper
   *
   * @param wrapperElement
   * @param name
   * @param index
   */


  function getNodeByIndex(wrapperElement, name, index) {
    var selector = name.toLowerCase() + ':not([data-mce-bogus="all"])';
    return (0, _jquery)(wrapperElement).find(selector).get(index);
  }
  /**
   * Create a double click event that works in all browsers
   */


  function createDoubleClickEvent() {
    try {
      return new MouseEvent("dblclick", {
        view: window,
        bubbles: true,
        cancelable: true
      });
    } catch (e) {
      var dblClickEvent = document.createEvent("MouseEvent");
      dblClickEvent.initMouseEvent("dblclick", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      return dblClickEvent;
    }
  }
  /**
   * Replace all desktop styles that left unprocessed back to style element to prevent data corruption.
   */


  function processInlineStyles(html) {
    var name = _config.getConfig("defaultViewport");

    var searchPattern = new RegExp("data-" + name + "-style=", "g");
    return html.replace(searchPattern, "style=");
  }
  /**
   * Move the end point of a range to handle tables
   *
   * @param range
   * @param start
   */


  function moveEndPoint(range, start) {
    var container;
    var offset;
    var childNodes;

    if (start) {
      container = range.startContainer;
      offset = range.startOffset;
    } else {
      container = range.endContainer;
      offset = range.endOffset;
    }

    if (container.nodeType === Node.ELEMENT_NODE && container.nodeName === "TR") {
      childNodes = container.childNodes;
      container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];

      if (container) {
        offset = start ? 0 : container.childNodes.length;

        if (start) {
          range.setStart(container, offset);
        } else {
          range.setEnd(container, offset);
        }
      }
    }
  }
  /**
   * Normalize the table sell selection within a range to better handle selections being inside of tables
   *
   * @param range
   */


  function normalizeTableCellSelection(range) {
    moveEndPoint(range, true);
    moveEndPoint(range, false);
    return range;
  }
  /**
   * Convert HTML encoded double quote to double quote with backslash within widget directives
   *
   * @param {string} content
   * @returns {string}
   */


  function escapeDoubleQuoteWithinWidgetDirective(content) {
    return content.replace(/\{\{widget[\S\s]*?\}\}/ig, function (match) {
      return match.replace(/&quot;/g, "\\\"");
    });
  }
  /**
   * Convert double quote with backslash to HTML encoded double quote within widget directives
   *
   * @param {string} content
   * @returns {string}
   */


  function unescapeDoubleQuoteWithinWidgetDirective(content) {
    return content.replace(/\{\{widget[\S\s]*?\}\}/ig, function (match) {
      return match.replace(/\\+"/g, "&quot;");
    });
  }
  /**
   * Convert double quote to single quote within magento variable directives
   *
   * @param {string} content
   * @returns {string}
   */


  function replaceDoubleQuoteWithSingleQuoteWithinVariableDirective(content) {
    // Find html elements which attributes contain magento variables directives
    return content.replace(/<([a-z0-9\-\_]+)([^>]+?[a-z0-9\-\_]+="[^"]*?\{\{.+?\}\}.*?".*?)>/gi, function (match1, tag, attributes) {
      // Replace double quote with single quote within magento variable directive
      var sanitizedAttributes = attributes.replace(/\{\{[^\{\}]+\}\}/gi, function (match2) {
        return match2.replace(/"/g, "'");
      });
      return "<" + tag + sanitizedAttributes + ">";
    });
  }

  return {
    isWysiwygSupported: isWysiwygSupported,
    encodeContent: encodeContent,
    parseAttributesString: parseAttributesString,
    lockImageSize: lockImageSize,
    unlockImageSize: unlockImageSize,
    createBookmark: createBookmark,
    moveToBookmark: moveToBookmark,
    getActiveEditor: getActiveEditor,
    findNodeIndex: findNodeIndex,
    getNodeByIndex: getNodeByIndex,
    createDoubleClickEvent: createDoubleClickEvent,
    processInlineStyles: processInlineStyles,
    escapeDoubleQuoteWithinWidgetDirective: escapeDoubleQuoteWithinWidgetDirective,
    unescapeDoubleQuoteWithinWidgetDirective: unescapeDoubleQuoteWithinWidgetDirective,
    replaceDoubleQuoteWithSingleQuoteWithinVariableDirective: replaceDoubleQuoteWithSingleQuoteWithinVariableDirective
  };
});
//# sourceMappingURL=editor.js.map