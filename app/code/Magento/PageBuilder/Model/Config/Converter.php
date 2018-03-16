<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Config;

class Converter implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * Convert XML structure into output array
     *
     * @param \DOMDocument $source
     * @return array
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function convert($source)
    {
        $output = [
            'groups' => [],
            'types' => []
        ];

        /** @var \DOMNodeList $contentTypes */
        $contentTypes = $source->getElementsByTagName('type');
        /** @var \DOMNode $contentType */
        foreach ($contentTypes as $contentType) {
            $name = $contentType->attributes->getNamedItem('name')->nodeValue;
            if (!$name) {
                throw new \InvalidArgumentException('Name is missing from content_types/type node');
            }
            /** @var \DOMElement $childNode */
            foreach ($contentType->childNodes as $childNode) {
                if ($childNode->nodeType == XML_ELEMENT_NODE ||
                    ($childNode->nodeType == XML_CDATA_SECTION_NODE ||
                        $childNode->nodeType == XML_TEXT_NODE && trim(
                            $childNode->nodeValue
                        ) != '')
                ) {
                    if ('readers' === $childNode->nodeName) {
                        foreach ($childNode->getElementsByTagName('reader') as $reader) {
                            $component = $reader->attributes->getNamedItem('component')->nodeValue;
                            $output['types'][$name][$childNode->nodeName][] = $component;
                        }
                    } elseif ('appearances' === $childNode->nodeName) {
                        foreach ($childNode->getElementsByTagName('appearance') as $appearanceNode) {
                            $appearanceName = $appearanceNode->attributes->getNamedItem('name')->nodeValue;
                            $appearanceData = [];
                            foreach ($appearanceNode->getElementsByTagName('data') as $dataNode) {
                                $dataName = $dataNode->attributes->getNamedItem('name')->nodeValue;
                                $appearanceData[$dataName] = $dataNode->nodeValue;
                            }
                            $previewTemplateNode = $appearanceNode->getElementsByTagName('preview_template')->item(0);
                            if ($previewTemplateNode) {
                                $appearanceData['preview_template'] = $previewTemplateNode->nodeValue;
                            }
                            $renderTemplateNode = $appearanceNode->getElementsByTagName('render_template')->item(0);
                            if ($renderTemplateNode) {
                                $appearanceData['render_template'] = $renderTemplateNode->nodeValue;
                            }
                            $readersNode = $appearanceNode->getElementsByTagName('readers')->item(0);
                            if ($readersNode) {
                                $readers = [];
                                foreach ($readersNode->getElementsByTagName('reader') as $readerNode) {
                                    $readers[] = $readerNode->attributes->getNamedItem('component')->nodeValue;
                                }
                                $appearanceData['readers'] = $readers;
                            }
                            $dataMappingNode = $appearanceNode->getElementsByTagName('data_mapping')->item(0);
                            if ($dataMappingNode) {
                                $appearanceData['data_mapping'] = $this->convertDataMappingConfiguration(
                                    $dataMappingNode
                                );
                            }
                            $output['types'][$name][$childNode->nodeName][$appearanceName] = $appearanceData;
                        }
                    } elseif ('data_mapping' === $childNode->nodeName) {
                        $output['types'][$name]['data_mapping'] = $this->convertDataMappingConfiguration($childNode);
                    } else {
                        $output['types'][$name][$childNode->nodeName] = $childNode->nodeValue;
                    }
                }
            }
        }

        /** @var \DOMNodeList $contentTypes */
        $groups = $source->getElementsByTagName('groups');
        /** @var \DOMNode $contentType */
        foreach ($groups->item(0)->childNodes as $group) {
            if ($group->nodeType == XML_ELEMENT_NODE && $group->tagName == 'group') {
                $name = $group->attributes->getNamedItem('name')->nodeValue;
                if (!$name) {
                    throw new \InvalidArgumentException('Name is missing from groups/group node');
                }
                /** @var \DOMElement $childNode */
                foreach ($group->childNodes as $childNode) {
                    if ($childNode->nodeType == XML_ELEMENT_NODE ||
                        ($childNode->nodeType == XML_CDATA_SECTION_NODE ||
                            $childNode->nodeType == XML_TEXT_NODE && trim(
                                $childNode->nodeValue
                            ) != '')
                    ) {
                        $output['groups'][$name][$childNode->nodeName] = $childNode->nodeValue;
                    }
                }
                $output['groups'][$name]['sortOrder'] =
                    $group->attributes->getNamedItem('sortOrder')->nodeValue;
            }
        }

        return $output;
    }

    /**
     * @param $childNode
     * @return array
     */
    private function convertDataMappingConfiguration($childNode): array
    {
        $elementData = [];
        foreach ($childNode->getElementsByTagName('element') as $elementNode) {
            $elementName = $elementNode->attributes->getNamedItem('name')->nodeValue;
            $elementPath = $elementNode->attributes->getNamedItem('path')->nodeValue;
            $elementData[$elementName]['path'] = $elementPath;
            $stylePropertiesNode = $elementNode->getElementsByTagName('style_properties')->item(0);
            if ($stylePropertiesNode) {
                foreach ($stylePropertiesNode->getElementsByTagName('property') as $propertyNode) {
                    $elementData[$elementName]['style'][] = [
                        'var' => $propertyNode->attributes->getNamedItem('var')->nodeValue,
                        'name' => $propertyNode->attributes->getNamedItem('name')->nodeValue,
                        'virtual' => $propertyNode->hasAttribute('virtual')
                            ? $propertyNode->attributes->getNamedItem('virtual')->nodeValue
                            : null,
                        'converter' => $propertyNode->hasAttribute('converter')
                            ? $propertyNode->attributes->getNamedItem('converter')->nodeValue
                            : null,
                        'preview_converter' => $propertyNode->hasAttribute('preview_converter')
                            ? $propertyNode->attributes->getNamedItem('preview_converter')->nodeValue
                            : null,
                    ];
                }
            }
            $attributesNode = $elementNode->getElementsByTagName('attributes')->item(0);
            if ($attributesNode) {
                foreach ($attributesNode->getElementsByTagName('attribute') as $attributeNode) {
                    $elementData[$elementName]['attributes'][] = [
                        'var' => $attributeNode->attributes->getNamedItem('var')->nodeValue,
                        'name' => $attributeNode->attributes->getNamedItem('name')->nodeValue,
                        'virtual' => $attributeNode->hasAttribute('virtual')
                            ? $attributeNode->attributes->getNamedItem('virtual')->nodeValue
                            : null,
                        'converter' => $attributeNode->hasAttribute('converter')
                            ? $attributeNode->attributes->getNamedItem('converter')->nodeValue
                            : null,
                        'persist' => $attributeNode->hasAttribute('persist')
                            ? $attributeNode->attributes->getNamedItem('persist')->nodeValue
                            : null,
                        'preview_converter' => $attributeNode->hasAttribute('preview_converter')
                            ? $attributeNode->attributes->getNamedItem('preview_converter')->nodeValue
                            : null,
                    ];
                }
            }
            $htmlNode = $elementNode->getElementsByTagName('html')->item(0);
            if ($htmlNode) {
                $elementData[$elementName]['html']['var']
                    = $htmlNode->attributes->getNamedItem('var')->nodeValue;
                $elementData[$elementName]['html']['placeholder'] = $htmlNode->hasAttribute('placeholder')
                    ? $htmlNode->attributes->getNamedItem('placeholder')->nodeValue
                    : null;
            }
            $cssNode = $elementNode->getElementsByTagName('css')->item(0);
            if ($cssNode) {
                $elementData[$elementName]['css']['var']
                    = $cssNode->attributes->getNamedItem('var')->nodeValue;
                $filterClasses = [];
                $filterNode = $cssNode->getElementsByTagName('filter')->item(0);
                if ($filterNode) {
                    foreach ($filterNode->getElementsByTagName('class') as $classNode) {
                        $filterClasses[] = $classNode->attributes->getNamedItem('name')->nodeValue;
                    }
                }
                $elementData[$elementName]['css']['filter'] = $filterClasses;
            }
            $tagNode = $elementNode->getElementsByTagName('tag')->item(0);
            if ($tagNode) {
                $elementData[$elementName]['tag']['var']
                    = $tagNode->attributes->getNamedItem('var')->nodeValue;
            }
        }

        $convertersNode = $childNode->getElementsByTagName('converters')->item(0);
        $converters = [];
        if ($convertersNode) {
            foreach ($convertersNode->getElementsByTagName('converter') as $converterNode) {
                $converterName = $converterNode->attributes->getNamedItem('name')->nodeValue;
                $converterComponent = $converterNode->attributes->getNamedItem('component')->nodeValue;
                $converterConfig = $converterNode->getElementsByTagName('config')->item(0);
                $config = [];
                if ($converterConfig) {
                    foreach ($converterConfig->getElementsByTagName('item') as $configItemNode) {
                        $configItemName = $configItemNode->attributes->getNamedItem('name')->nodeValue;
                        $configItemValue = $configItemNode->attributes->getNamedItem('value')->nodeValue;
                        $config[$configItemName] = $configItemValue;
                    }
                }
                $converters[] = [
                    'name' => $converterName,
                    'component' => $converterComponent,
                    'config' => $config
                ];
            }
        }

        return [
            'elements' => $elementData,
            'converters' => $converters
        ];
    }
}
