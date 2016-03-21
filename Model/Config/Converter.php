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
     * Convert dom node tree to array
     *
     * @param \DOMDocument $source
     * @return array
     * @throws \InvalidArgumentException
     */
    public function convert($source)
    {
        $xpath = new \DOMXPath($source);
        $output = [
            'plugins' => [],
            'templates' => [],
            'renderers' => [],
            'widgets' => []
        ];

        // Pull in all of the JS plugins
        $jsPluginList = $xpath->query('/config/plugins/js/*');
        /** @var $node \DOMNode */
        for ($i = 0; $i < $jsPluginList->length; $i++) {
            $node = $jsPluginList->item($i);
            if ($node->hasChildNodes()) {
                foreach ($node->childNodes as $file) {
                    if ($file->nodeName == 'file') {
                        $output['plugins'][$node->getAttribute('name')][] = [
                            'alias' => $file->getAttribute('alias'),
                            'path' => $file->getAttribute('path')
                        ];
                    }
                }
            }
        }

        // Pull in all of the templates
        $templateList = $xpath->query('/config/content_blocks/templates/*');
        /** @var $node \DOMNode */
        for ($i = 0; $i < $templateList->length; $i++) {
            $node = $templateList->item($i);
            if ($node->nodeName == 'template') {
                $output['templates'][$node->getAttribute('name')] = [
                    'name' => $node->getAttribute('name'),
                    'file' => $node->getAttribute('file')
                ];
            }
        }

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

        // Pull in all of the structural information
        $structuralsList = $xpath->query('/config/structurals/*');
        for ($i = 0; $i < $structuralsList->length; $i++) {
            /* @var $node DOMElement */
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
                                            $fieldsArray[$field->getAttribute('code')][$fieldAttr->nodeName] = $fieldAttr->nodeValue;
                                        }
                                    }
                                }
                            }
                            $output['structurals'][$node->getAttribute('code')]['fields'] = $fieldsArray;
                        }
                    }
                }
            }
        }

        return $output;
    }
}