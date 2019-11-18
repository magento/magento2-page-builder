/*eslint-disable */
/* jscs:disable */
define(["jquery", "Magento_PageBuilder/js/config"], function (_jquery, _config) {
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
   * Retrieve the selection of the user
   */


  function getSelection() {
    if (window.getSelection) {
      var selection = window.getSelection();

      if (selection.getRangeAt && selection.rangeCount) {
        var range = selection.getRangeAt(0).cloneRange();
        (0, _jquery)(range.startContainer.parentNode).attr("data-startContainer", "true");
        (0, _jquery)(range.endContainer.parentNode).attr("data-endContainer", "true");
        return {
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endContainer,
          endOffset: range.endOffset
        };
      }
    }

    return null;
  }
  /**
   * Restore the users previous selection
   *
   * @param element
   * @param selection
   */


  function restoreSelection(element, selection) {
    if (selection && window.getSelection) {
      // Find the original container that had the selection
      var startContainerParent = (0, _jquery)(element).find("[data-startContainer]");
      startContainerParent.removeAttr("data-startContainer");

      var _startContainer = findTextNode(startContainerParent, selection.startContainer.nodeValue);

      var endContainerParent = (0, _jquery)(element).find("[data-endContainer]");
      endContainerParent.removeAttr("data-endContainer");
      var _endContainer = _startContainer;

      if (selection.endContainer.nodeValue !== selection.startContainer.nodeValue) {
        _endContainer = findTextNode(endContainerParent, selection.endContainer.nodeValue);
      }

      if (_startContainer && _endContainer) {
        var newSelection = window.getSelection();
        newSelection.removeAllRanges();
        var range = document.createRange();
        range.setStart(_startContainer, selection.startOffset);
        range.setEnd(_endContainer, selection.endOffset);
        newSelection.addRange(range);
      }
    }
  }
  /**
   * Find a text node within an existing element
   *
   * @param element
   * @param text
   */


  function findTextNode(element, text) {
    if (text && text.trim().length > 0) {
      return element.contents().toArray().find(function (node) {
        return node.nodeType === Node.TEXT_NODE && text === node.nodeValue;
      });
    }
  }

  return {
    isWysiwygSupported: isWysiwygSupported,
    encodeContent: encodeContent,
    convertVariablesToHtmlPreview: convertVariablesToHtmlPreview,
    convertWidgetsToHtmlPreview: convertWidgetsToHtmlPreview,
    parseAttributesString: parseAttributesString,
    getSelection: getSelection,
    restoreSelection: restoreSelection
  };
});
//# sourceMappingURL=tinymce.js.map