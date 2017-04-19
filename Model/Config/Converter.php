<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Class Converter
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Converter implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * Convert XML structure into output array
     *
     * @param \DOMDocument $source
     *
     * @return array
     */
    public function convert($source)
    {
        $xpath = new \DOMXPath($source);
        $output = [
            'templates' => [],
            'renderers' => [],
            'widgets' => [],
            'global_fields' => []
        ];

        $this->convertTemplates($xpath, $output);
        $this->convertRenderers($xpath, $output);
        $this->convertWidgets($xpath, $output);
        $this->convertStructurals($xpath, $output);
        $this->convertGlobalFields($xpath, $output);

        return $output;
    }

    /**
     * Build up our template list from our config
     *
     * @param \DOMXPath $xpath
     * @param           $output
     */
    protected function convertTemplates(\DOMXPath $xpath, &$output)
    {
        // Pull in all of the templates
        $templateList = $xpath->query('/config/content_blocks/templates/*');
        /** @var $node \DOMNode */
        for ($i = 0; $i < $templateList->length; $i++) {
            $node = $templateList->item($i);
            if ($node->nodeName == 'template') {
                $output['templates'][$node->getAttribute('name')] = [
                    'name' => $node->getAttribute('name'),
                    'file' => $node->getAttribute('file'),
                    'preview' => $node->getAttribute('preview'),
                    'preview_block' => $node->getAttribute('preview_block'),
                    'js_block' => $node->getAttribute('block')
                ];

                if ($node->hasChildNodes()) {
                    /* @var $assets DOMNodeList */
                    $assets = $node->getElementsByTagName('asset');
                    if ($assets->length > 0) {
                        for ($assetI = 0; $assetI < $assets->length; $assetI++) {
                            $asset = $assets->item($assetI);
                            $output['templates'][$node->getAttribute('name')]['assets'][$asset->getAttribute('name')]
                                = $asset->getAttribute('src');
                        }
                    }
                }
            }
        }
    }

    /**
     * Convert the XML nodes into renderers
     *
     * @param \DOMXPath $xpath
     * @param           $output
     */
    protected function convertRenderers(\DOMXPath $xpath, &$output)
    {
        // Pull in all of the renderers
        $rendererList = $xpath->query('/config/content_blocks/renderers/*');
        /** @var $node \DOMNode */
        for ($i = 0; $i < $rendererList->length; $i++) {
            $node = $rendererList->item($i);
            if ($node->nodeName == 'renderer') {
                $output['renderers'][$node->getAttribute('name')] = [
                    'name' => $node->getAttribute('name'),
                    'class' => $node->getAttribute('class')
                ];
            }
        }
    }

    /**
     * Convert the XML nodes into widgets
     *
     * @param \DOMXPath $xpath
     * @param           $output
     */
    protected function convertWidgets(\DOMXPath $xpath, &$output)
    {
        // Pull in all of the widgets
        $rendererList = $xpath->query('/config/widgets/*');
        /** @var $node \DOMNode */
        for ($i = 0; $i < $rendererList->length; $i++) {
            $node = $rendererList->item($i);
            if ($node->nodeName == 'widget') {
                $output['widgets'][$node->getAttribute('alias')] = [
                    'name' => $node->getAttribute('name'),
                    'label' => $node->getAttribute('label'),
                    'alias' => $node->getAttribute('alias'),
                    'input_type' => $node->getAttribute('inputType'),
                    'group' => $node->getAttribute('group')
                ];

                // Retrieve the template if one is set
                $templateElement = $node->getElementsByTagName('data_model');
                if ($template = $templateElement->item(0)) {
                    $output['widgets'][$node->getAttribute('alias')]['data_model'] = $template->nodeValue;
                }
            }
        }
    }

    /**
     * Convert structurals XML into array
     *
     * @param \DOMXPath $xpath
     * @param           $output
     */
    protected function convertStructurals(\DOMXPath $xpath, &$output)
    {
        // Pull in all of the structural information
        $structuralsList = $xpath->query('/config/structurals/*');
        for ($i = 0; $i < $structuralsList->length; $i++) {
            /* @var $node \DOMElement */
            $node = $structuralsList->item($i);
            if ($node->nodeName == 'structural') {
                $output['structurals'][$node->getAttribute('code')] = [
                    'code' => $node->getAttribute('code'),
                    'icon' => $node->getAttribute('icon'),
                    'name' => $node->getAttribute('name'),
                    'color' => $node->getAttribute('color'),
                ];

                // Retrieve the template if one is set
                $templateElement = $node->getElementsByTagName('template');
                if ($template = $templateElement->item(0)) {
                    $output['structurals'][$node->getAttribute('code')]['template'] = $template->getAttribute('file');
                }

                // Retrieve the renderer if one is set
                $rendererElement = $node->getElementsByTagName('renderer');
                if ($renderer = $rendererElement->item(0)) {
                    $output['structurals'][$node->getAttribute('code')]['renderer'] = $renderer->getAttribute('class');
                }

                // Convert the structurals fields
                $output['structurals'][$node->getAttribute('code')]['fields'] =
                    $this->retrieveStructuralsFields($node);
            }
        }
    }

    /**
     * Retrieve structural fields from a node
     *
     * @param \DOMElement $node
     *
     * @return array
     */
    protected function retrieveStructuralsFields(\DOMElement $node)
    {
        // Build up the fields data
        $fieldsElement = $node->getElementsByTagName('fields');
        if ($fields = $fieldsElement->item(0)) {
            if ($fields->hasChildNodes()) {
                $fieldsElements = $fields->getElementsByTagName('field');
                if ($fieldsElements->length > 0) {
                    $fieldsArray = [];
                    for ($fieldCount = 0; $fieldCount < $fieldsElements->length; $fieldCount++) {
                        /* @var $field \DOMElement */
                        $field = $fieldsElements->item($fieldCount);
                        $fieldsArray[$field->getAttribute('code')] = [];
                        if ($field->hasChildNodes()) {
                            foreach ($field->childNodes as $fieldAttr) {
                                if ($fieldAttr instanceof \DOMElement) {
                                    $fieldsArray[$field->getAttribute('code')][$fieldAttr->nodeName]
                                        = $fieldAttr->nodeValue;
                                }
                            }
                        }
                    }

                    return $fieldsArray;
                }
            }
        }

        return [];
    }

    /**
     * Convert XML into global fields
     *
     * @param \DOMXPath $xpath
     * @param           $output
     */
    protected function convertGlobalFields(\DOMXPath $xpath, &$output)
    {
        // Pull in all of the global fields
        $globalFields = $xpath->query('/config/global_fields/*');
        for ($i = 0; $i < $globalFields->length; $i++) {
            /* @var $node DOMElement */
            $node = $globalFields->item($i);
            if ($node->nodeName == 'field') {
                $output['global_fields'][$node->getAttribute('code')] = [];

                if ($node->hasChildNodes()) {
                    $fieldsElements = $node->childNodes;
                    foreach ($fieldsElements as $fieldAttr) {
                        if ($fieldAttr instanceof \DOMElement) {
                            $output['global_fields'][$node->getAttribute('code')][$fieldAttr->nodeName]
                                = $fieldAttr->nodeValue;
                        }
                    }
                }
            }
        }
    }
}
