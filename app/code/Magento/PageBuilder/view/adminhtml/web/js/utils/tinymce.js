/*eslint-disable */
/* jscs:disable */
define(["jquery", "mageUtils", "Magento_PageBuilder/js/config"], function (_jquery, _mageUtils, _config) {
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
      return convertVariablesToHtmlPreview(convertWidgetsToHtmlPreview(content));
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
      var placeholder = document.createElement("span");
      placeholder.id = Base64.idEncode(path);
      placeholder.classList.add("magento-variable", "magento-placeholder", "mceNonEditable");

      if (magentoVariables[path].variable_type === "custom") {
        placeholder.classList.add("magento-custom-var");
      }

      var variableType = magentoVariables[path].variable_type;

      if (magentoVariables[path] && (variableType === "default" || variableType === "custom")) {
        placeholder.textContent = magentoVariables[path].variable_name;
      } else {
        // If we're unable to find the placeholder we need to attach an error class
        placeholder.classList.add("magento-placeholder-error");
        placeholder.textContent = variableType === "custom" ? path : "Not Found";
      }

      return placeholder.outerHTML;
    });
  }
  /**
   * Convert widgets within content to their HTML counterparts
   *
   * @param content
   */


  function convertWidgetsToHtmlPreview(content) {
    var config = _config.getConfig("tinymce").widgets;

    return content.replace(/\{\{widget(.*?)\}\}/ig, function (match, widgetBody) {
      var attributes = parseAttributesString(widgetBody);
      var imageSrc;

      if (attributes.type) {
        var placeholder = document.createElement("span");
        placeholder.id = _mageUtils.uniqueid();
        placeholder.contentEditable = "false";
        placeholder.classList.add("magento-placeholder", "magento-widget", "mceNonEditable");
        attributes.type = attributes.type.replace(/\\\\/g, "\\");
        imageSrc = config.placeholders[attributes.type];

        if (!imageSrc) {
          imageSrc = config.error_image_url;
          placeholder.classList.add("magento-placeholder-error");
        }

        var image = document.createElement("img");
        image.id = Base64.idEncode(match);
        image.src = imageSrc;
        placeholder.append(image);
        var widgetType = "";

        if (config.types[attributes.type]) {
          widgetType += config.types[attributes.type];
        }

        var text = document.createTextNode(widgetType);
        placeholder.append(text);
        return placeholder.outerHTML;
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
      result[key] = value.replace(/&quote;/g, "\"");
      return "";
    });
    return result;
  }
  /**
   * Create a bookmark within the content to be restored later
   */


  function createBookmark(event) {
    var wrapperElement = (0, _jquery)(event.target).parents(".inline-wysiwyg"); // Handle direct clicks onto an IMG

    if (event.target.nodeName === "IMG") {
      return {
        name: event.target.nodeName,
        index: findIndex(wrapperElement[0], event.target.nodeName, event.target)
      };
    }

    if (window.getSelection) {
      var selection = window.getSelection();

      var _id = _mageUtils.uniqueid();

      if (selection.getRangeAt && selection.rangeCount) {
        var range = normalizeTableCellSelection(selection.getRangeAt(0).cloneRange());
        var node = getNode(wrapperElement[0], range);

        if (node.nodeName === "IMG" || node.nodeName === "SPAN" && node.classList.contains("magento-placeholder")) {
          return {
            name: node.nodeName,
            index: findIndex(wrapperElement[0], node.nodeName, node)
          };
        }

        if (!range.collapsed) {
          range.collapse(false);
          var endBookmarkNode = createBookmarkSpan(_id + "_end");
          range.insertNode(endBookmarkNode);
        }

        var range2 = normalizeTableCellSelection(selection.getRangeAt(0));
        range2.collapse(true);
        var startBookmarkNode = createBookmarkSpan(_id + "_start");
        range2.insertNode(startBookmarkNode);
        return {
          id: _id
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
    tinymce.activeEditor.selection.moveToBookmark(bookmark);
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


  function findIndex(wrapperElement, name, element) {
    var selector = name.toLowerCase() + ':not([data-mce-bogus="all"])'; // If there is no ID on the element add a unique ID so we can efficiently find it

    if (!element.id) {
      element.id = _mageUtils.uniqueid();
    }

    return (0, _jquery)(wrapperElement).find(selector).toArray().findIndex(function (node) {
      return node.id === element.id;
    });
  }

  function moveEndPoint(rng, start) {
    var container;
    var offset;
    var childNodes;
    var prefix = start ? "start" : "end";
    container = rng[prefix + "Container"];
    offset = rng[prefix + "Offset"];

    if (container.nodeType === Node.ELEMENT_NODE && container.nodeName === "TR") {
      childNodes = container.childNodes;
      container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];

      if (container) {
        offset = start ? 0 : container.childNodes.length;
        rng["set" + (start ? "Start" : "End")](container, offset);
      }
    }
  }

  function normalizeTableCellSelection(rng) {
    moveEndPoint(rng, true);
    moveEndPoint(rng, false);
    return rng;
  }

  function getNode(root, rng) {
    var elm, startContainer, endContainer, startOffset, endOffset; // Range maybe lost after the editor is made visible again

    if (!rng) {
      return root;
    }

    startContainer = rng.startContainer;
    endContainer = rng.endContainer;
    startOffset = rng.startOffset;
    endOffset = rng.endOffset;
    elm = rng.commonAncestorContainer; // Handle selection a image or other control like element such as anchors

    if (!rng.collapsed) {
      if (startContainer === endContainer) {
        if (endOffset - startOffset < 2) {
          if (startContainer.hasChildNodes()) {
            elm = startContainer.childNodes[startOffset];
          }
        }
      } // If the anchor node is a element instead of a text node then return this element
      // if (tinymce.isWebKit && sel.anchorNode && sel.anchorNode.nodeType == 1)
      // return sel.anchorNode.childNodes[sel.anchorOffset];
      // Handle cases where the selection is immediately wrapped around a node and return that node instead of it's parent.
      // This happens when you double click an underlined word in FireFox.


      if (startContainer.nodeType === 3 && endContainer.nodeType === 3) {
        if (startContainer.length === startOffset) {
          startContainer = skipEmptyTextNodes(startContainer.nextSibling, true);
        } else {
          startContainer = startContainer.parentNode;
        }

        if (endOffset === 0) {
          endContainer = skipEmptyTextNodes(endContainer.previousSibling, false);
        } else {
          endContainer = endContainer.parentNode;
        }

        if (startContainer && startContainer === endContainer) {
          return startContainer;
        }
      }
    }

    if (elm && elm.nodeType === 3) {
      return elm.parentNode;
    }

    return elm;
  }

  return {
    isWysiwygSupported: isWysiwygSupported,
    encodeContent: encodeContent,
    convertVariablesToHtmlPreview: convertVariablesToHtmlPreview,
    convertWidgetsToHtmlPreview: convertWidgetsToHtmlPreview,
    parseAttributesString: parseAttributesString,
    createBookmark: createBookmark,
    moveToBookmark: moveToBookmark
  };
});
//# sourceMappingURL=tinymce.js.map