<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes;

use Magento\Framework\ObjectManager\Config\Mapper\ArgumentParser;
use Magento\Framework\Data\Argument\InterpreterInterface;
use Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\ProviderInterface;

class Converter implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * @var ArgumentParser
     */
    private $parser;

    /**
     * @var InterpreterInterface
     */
    private $argumentInterpreter;

    /**
     * Converter constructor.
     * @param ArgumentParser $parser
     * @param InterpreterInterface $argumentInterpreter
     */
    public function __construct(
        ArgumentParser $parser,
        InterpreterInterface $argumentInterpreter
    ) {
        $this->parser = $parser;
        $this->argumentInterpreter = $argumentInterpreter;
    }

    /**
     * Convert XML structure into output array
     *
     * @param \DOMDocument $source
     * @return array
     * @throws \InvalidArgumentException
     */
    public function convert($source): array
    {
        return [
            'types' => $this->convertTypes($source)
        ];
    }

    /**
     * Convert types
     *
     * @param \DOMDocument $source
     * @return array
     */
    private function convertTypes(\DOMDocument $source): array
    {
        $typesData = [];
        /** @var \DOMNodeList $contentTypes */
        $contentTypes = $source->getElementsByTagName('type');
        /** @var \DOMNode $contentType */
        foreach ($contentTypes as $contentType) {
            $name = $contentType->attributes->getNamedItem('name')->nodeValue;
            /** @var \DOMElement $childNode */
            foreach ($contentType->childNodes as $childNode) {
                if ($this->isConfigNode($childNode)) {
                    if ('appearances' === $childNode->nodeName) {
                        $typesData[$name][$childNode->nodeName] = $this->convertAppearancesData($childNode);
                    } elseif ('additional_data' === $childNode->nodeName) {
                        $typesData[$name][$childNode->nodeName] = $this->convertAdditionalData($childNode);
                    } elseif ('allowed_parents' === $childNode->nodeName) {
                        $parents = [];
                        foreach ($childNode->getElementsByTagName('parent') as $parentNode) {
                            $parents[] = $parentNode->attributes->getNamedItem('name')->nodeValue;
                        }
                        $typesData[$name][$childNode->nodeName] = $parents;
                    } else {
                        $typesData[$name][$childNode->nodeName] = $childNode->nodeValue;
                    }
                }
            }
            $typesData[$name]['sortOrder'] = $this->getAttributeValue($contentType, 'sortOrder');
        }
        uasort($typesData, function ($firstElement, $secondElement) {
            return (int)$firstElement['sortOrder'] <=> (int)$secondElement['sortOrder'];
        });

        return $typesData;
    }

    /**
     * Convert appearances data
     *
     * @param \DOMElement $childNode
     * @return array
     * @throws \InvalidArgumentException
     */
    private function convertAppearancesData(\DOMElement $childNode): array
    {
        $appearancesData = [];
        foreach ($childNode->getElementsByTagName('appearance') as $appearanceNode) {
            $appearanceName = $appearanceNode->attributes->getNamedItem('name')->nodeValue;
            $appearancesData[$appearanceName] = $this->convertAppearanceData($appearanceNode);
        }
        $this->validateAppearanceConfig($appearancesData);
        return $appearancesData;
    }

    /**
     * Convert appearance data
     *
     * @param \DOMElement $appearanceNode
     * @return array
     */
    private function convertAppearanceData(\DOMElement $appearanceNode): array
    {
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
        $readerNode = $appearanceNode->getElementsByTagName('reader')->item(0);
        if ($readerNode && $readerNode->nodeValue) {
            $appearanceData['readers'] = [$readerNode->nodeValue];
        } else {
            $readersNode = $appearanceNode->getElementsByTagName('readers')->item(0);
            $readers = [];
            if ($readersNode) {
                foreach ($readersNode->getElementsByTagName('reader') as $readerNode) {
                    $readers[] = $this->getAttributeValue($readerNode, 'component');
                }
            }
            $appearanceData['readers'] = $readers;
        }
        $dataMappingNode = $appearanceNode->getElementsByTagName('data_mapping')->item(0);
        if ($dataMappingNode) {
            $appearanceData['data_mapping'] = $this->convertDataMapping($dataMappingNode);
        }
        $appearanceData['default'] = $this->getAttributeValue($appearanceNode, 'default');
        return $appearanceData;
    }

    /**
     * Validate that configuration appearances has default appearance
     *
     * @param array $appearanceConfig
     * @throws \InvalidArgumentException
     */
    private function validateAppearanceConfig(array $appearanceConfig)
    {
        $isDefaultAppearancePresent = false;
        foreach ($appearanceConfig as $config) {
            if ($config['default']) {
                $isDefaultAppearancePresent = true;
                break;
            }
        }
        if (!$isDefaultAppearancePresent) {
            throw new \InvalidArgumentException('Configuration for content type should have default appearance.');
        }
    }

    /**
     * Convert data mapping
     *
     * @param \DOMElement $childNode
     * @return array
     */
    private function convertDataMapping(\DOMElement $childNode): array
    {
        $elementData = [];
        foreach ($childNode->getElementsByTagName('element') as $elementNode) {
            $elementName = $elementNode->attributes->getNamedItem('name')->nodeValue;
            $elementPath = $elementNode->attributes->getNamedItem('path')->nodeValue;
            $elementData[$elementName] = [
                'path' => $elementPath,
                'style' => $this->convertProperties($elementNode),
                'attributes' => $this->convertAttributes($elementNode),
                'html' => $this->convertHtml($elementNode),
                'css' => $this->convertCss($elementNode),
                'tag' => $this->convertTag($elementNode)
            ];
        }

        $converters = $this->convertConvertersData($childNode);

        return [
            'elements' => $elementData,
            'converters' => $converters
        ];
    }

    /**
     * Convert additional data
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertAdditionalData(\DOMElement $elementNode): array
    {
        $additionalData = [];
        $xmlArgumentsNodes = $elementNode->getElementsByTagName('arguments');

        if (!$xmlArgumentsNodes->length) {
            return $additionalData;
        }
        $typeArguments = [];
        /** @var $xmlArgumentsNode \DOMElement */
        foreach ($xmlArgumentsNodes as $xmlArgumentsNode) {
            $parsedArgumentsData = $this->parser->parse($xmlArgumentsNode);
            $argumentName = $xmlArgumentsNode->attributes->getNamedItem('name')->nodeValue;
            $typeArguments[$argumentName] = $this->argumentInterpreter->evaluate(
                $parsedArgumentsData
            );
            $additionalData += $this->toArray($typeArguments);
        }

        return $additionalData;
    }

    /**
     * Convert properties
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertProperties(\DOMElement $elementNode): array
    {
        $propertiesData = [];
        $propertiesNode = $elementNode->getElementsByTagName('style_properties')->item(0);
        if ($propertiesNode) {
            foreach ($propertiesNode->getElementsByTagName('property') as $propertyNode) {
                $propertiesData[] = [
                    'var' => $this->getAttributeValue($propertyNode, 'var'),
                    'name' => $this->getAttributeValue($propertyNode, 'name'),
                    'converter' => $this->getAttributeValue($propertyNode, 'converter'),
                    'preview_converter' => $this->getAttributeValue($propertyNode, 'preview_converter'),
                    'virtual' => $this->getAttributeValue($propertyNode, 'virtual'),
                    'persist' => $this->getAttributeValue($propertyNode, 'persist'),
                ];
            }
            foreach ($propertiesNode->getElementsByTagName('complex_property') as $propertyNode) {
                $propertiesData[] = [
                    'var' => $this->getAttributeValue($propertyNode, 'var'),
                    'reader' => $this->getAttributeValue($propertyNode, 'reader'),
                    'converter' => $this->getAttributeValue($propertyNode, 'converter'),
                    'preview_converter' => $this->getAttributeValue($propertyNode, 'preview_converter'),
                    'virtual' => $this->getAttributeValue($propertyNode, 'virtual'),
                    'complex' => true
                ];
            }
            foreach ($propertiesNode->getElementsByTagName('static_property') as $propertyNode) {
                $propertiesData[] = [
                    'name' => $this->getAttributeValue($propertyNode, 'name'),
                    'value' => $this->getAttributeValue($propertyNode, 'value'),
                    'static' => true
                ];
            }
        }
        return $propertiesData;
    }

    /**
     * Convert attributes
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertAttributes(\DOMElement $elementNode): array
    {
        $attributesData = [];
        $attributesNode = $elementNode->getElementsByTagName('attributes')->item(0);
        if ($attributesNode) {
            foreach ($attributesNode->getElementsByTagName('attribute') as $attributeNode) {
                $attributesData[] = [
                    'var' => $this->getAttributeValue($attributeNode, 'var'),
                    'name' => $this->getAttributeValue($attributeNode, 'name'),
                    'converter' => $this->getAttributeValue($attributeNode, 'converter'),
                    'preview_converter' => $this->getAttributeValue($attributeNode, 'preview_converter'),
                    'virtual' => $this->getAttributeValue($attributeNode, 'virtual'),
                    'persist' => $this->getAttributeValue($attributeNode, 'persist'),
                ];
            }
            foreach ($attributesNode->getElementsByTagName('static_attribute') as $attributeNode) {
                $attributesData[] = [
                    'name' => $this->getAttributeValue($attributeNode, 'name'),
                    'value' => $this->getAttributeValue($attributeNode, 'value'),
                    'static' => true
                ];
            }
            foreach ($attributesNode->getElementsByTagName('complex_attribute') as $attributeNode) {
                $attributesData[] = [
                    'var' => $this->getAttributeValue($attributeNode, 'var'),
                    'reader' => $this->getAttributeValue($attributeNode, 'reader'),
                    'converter' => $this->getAttributeValue($attributeNode, 'converter'),
                    'preview_converter' => $this->getAttributeValue($attributeNode, 'preview_converter'),
                    'virtual' => $this->getAttributeValue($attributeNode, 'virtual'),
                    'complex' => true,
                    'persist' => $this->getAttributeValue($attributeNode, 'persist'),
                ];
            }
        }
        return $attributesData;
    }

    /**
     * Convert html
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertHtml(\DOMElement $elementNode): array
    {
        $htmlData = [];
        $htmlNode = $elementNode->getElementsByTagName('html')->item(0);
        if ($htmlNode) {
            $htmlData['var']= $this->getAttributeValue($htmlNode, 'var');
            $htmlData['placeholder'] = $this->getAttributeValue($htmlNode, 'placeholder');
            $htmlData['converter'] = $this->getAttributeValue($htmlNode, 'converter');
            $htmlData['preview_converter'] = $this->getAttributeValue($htmlNode, 'preview_converter');
        }
        return $htmlData;
    }

    /**
     * Convert css
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertCss(\DOMElement $elementNode): array
    {
        $cssData = [];
        $cssNode = $elementNode->getElementsByTagName('css')->item(0);
        if ($cssNode) {
            $cssData['var'] = $this->getAttributeValue($cssNode, 'var');
            $cssData['converter'] = $this->getAttributeValue($cssNode, 'converter');
            $filterClasses = [];
            $filterNode = $cssNode->getElementsByTagName('filter')->item(0);
            if ($filterNode) {
                foreach ($filterNode->getElementsByTagName('class') as $classNode) {
                    $filterClasses[] = $this->getAttributeValue($classNode, 'name');
                }
            }
            $cssData['filter'] = $filterClasses;
        }
        return $cssData;
    }

    /**
     * Convert tag
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertTag(\DOMElement $elementNode): array
    {
        $tagData = [];
        $tagNode = $elementNode->getElementsByTagName('tag')->item(0);
        if ($tagNode) {
            $tagData['var'] = $this->getAttributeValue($tagNode, 'var');
            $tagData['converter'] = $this->getAttributeValue($tagNode, 'converter');
        }
        return $tagData;
    }

    /**
     * @param \DOMElement $childNode
     * @return array
     */
    private function convertConvertersData(\DOMElement $childNode): array
    {
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

        return $converters;
    }

    /**
     * Check if node is configuration node
     *
     * @param \DOMNode $node
     * @return bool
     */
    private function isConfigNode(\DOMNode $node): bool
    {
        return $node->nodeType === XML_ELEMENT_NODE
            || ($node->nodeType === XML_CDATA_SECTION_NODE
                || $node->nodeType === XML_TEXT_NODE
                && trim($node->nodeValue) !== '');
    }

    /**
     * Get attribute value
     *
     * @param $attributeNode
     * @param $attributeName
     * @return string|null
     */
    private function getAttributeValue(\DOMElement $attributeNode, $attributeName)
    {
        return $attributeNode->hasAttribute($attributeName)
            ? $attributeNode->attributes->getNamedItem($attributeName)->nodeValue
            : null;
    }

    /**
     * Convert arguments node from additional data to array
     * @param array $typeArguments
     * @return array
     */
    private function toArray(array $typeArguments)
    {
        $processedData = [];
        foreach ($typeArguments as $key => $value) {
            if (is_array($value)) {
                $processedData[$key] = $this->toArray($typeArguments[$key]);
            } elseif (is_object($value) && $value instanceof ProviderInterface) {
                $processedData[$key] = $value->getData($key)[$key];
            } else {
                $processedData[$key] = $value;
            }
        }

        return $processedData;
    }
}
