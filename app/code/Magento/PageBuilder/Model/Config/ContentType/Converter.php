<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType;

use Magento\Framework\ObjectManager\Config\Mapper\ArgumentParser;

/**
 * Convert content type configuration data
 */
class Converter implements \Magento\Framework\Config\ConverterInterface
{
    const DEFAULT_ATTRIBUTE_READER = 'Magento_PageBuilder/js/property/attribute-reader';
    const DEFAULT_PROPERTY_READER = 'Magento_PageBuilder/js/property/style-property-reader';

    /**
     * @var ArgumentParser
     */
    private $parser;

    /**
     * Converter constructor.
     * @param ArgumentParser $parser
     */
    public function __construct(
        ArgumentParser $parser
    ) {
        $this->parser = $parser;
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
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    private function convertTypes(\DOMDocument $source): array
    {
        $typesData = [];
        $parentChildData = [];
        /** @var \DOMNodeList $contentTypes */
        $contentTypes = $source->getElementsByTagName('type');
        /** @var \DOMNode $contentType */
        foreach ($contentTypes as $contentType) {
            $name = $contentType->attributes->getNamedItem('name')->nodeValue;
            /** @var \DOMElement $attributeValue */
            foreach ($contentType->attributes as $attributeName => $attributeValue) {
                $typesData[$name][$attributeName] = $attributeValue->nodeValue;
            }
            /** @var \DOMElement $childNode */
            foreach ($contentType->childNodes as $childNode) {
                if ($this->isConfigNode($childNode)) {
                    if ('appearances' === $childNode->nodeName) {
                        $typesData[$name][$childNode->nodeName] = $this->convertAppearancesData($childNode);
                    } elseif ('additional_data' === $childNode->nodeName) {
                        $typesData[$name][$childNode->nodeName] = $this->convertAdditionalData($childNode);
                    } elseif ('parents' === $childNode->nodeName) {
                        $parentChildData[$name][$childNode->nodeName] = [
                            'defaultPolicy' => $this->getAttributeValue($childNode, 'default_policy'),
                            'types' => $this->convertParentChildData($childNode, 'parent')
                        ];
                    } elseif ('children' === $childNode->nodeName) {
                        $parentChildData[$name][$childNode->nodeName] = [
                            'defaultPolicy' => $this->getAttributeValue($childNode, 'default_policy'),
                            'types' => $this->convertParentChildData($childNode, 'child')
                        ];
                    } elseif ('breakpoints' === $childNode->nodeName) {
                        $typesData[$name][$childNode->nodeName] = $this->convertBreakpoints($childNode);
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

        $allowedParents = $this->convertParentChildDataToAllowedParents(array_keys($typesData), $parentChildData);

        return array_merge_recursive($typesData, $allowedParents);
    }

    /**
     * Convert breakpoints data
     *
     * @param \DOMElement $childNode
     * @return array
     * @throws \InvalidArgumentException
     */
    private function convertBreakpoints(\DOMElement $childNode): array
    {
        $breakpointsData = [];
        foreach ($childNode->getElementsByTagName('breakpoint') as $breakpointNode) {
            $breakpointName = $breakpointNode->attributes->getNamedItem('name')->nodeValue;
            $breakpointsData[$breakpointName] = $this->convertBreakpointData($breakpointNode);
        }
        return $breakpointsData;
    }

    /**
     * Convert breakpoint data
     *
     * @param \DOMElement $childNode
     * @return array
     * @throws \InvalidArgumentException
     */
    private function convertBreakpointData(\DOMElement $childNode): array
    {
        $breakpointsData = [];
        $formNode = $childNode->getElementsByTagName('form')->item(0);
        if ($formNode && $formNode->nodeValue) {
            $breakpointsData['form'] = $formNode->nodeValue;
        }
        return $breakpointsData;
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
        $appearanceData = array_merge(
            $appearanceData,
            $this->convertAppearanceStyles($appearanceNode)
        );
        $elementsNode = $appearanceNode->getElementsByTagName('elements')->item(0);
        if ($elementsNode) {
            $appearanceData['elements'] = $this->convertElements($elementsNode);
        }
        $appearanceData['converters'] = $this->convertConvertersData($appearanceNode);
        $appearanceData['preview_template'] = $this->getAttributeValue($appearanceNode, 'preview_template');
        $appearanceData['master_template'] = $this->getAttributeValue($appearanceNode, 'master_template');
        $appearanceData['reader'] = $this->getAttributeValue($appearanceNode, 'reader');
        $appearanceData['default'] = $this->getAttributeValue($appearanceNode, 'default');

        foreach ($appearanceNode->childNodes as $node) {
            if ($node->nodeName === 'form') {
                $formNode = $node;
            }
        }
        if (isset($formNode) && $formNode->nodeValue) {
            $appearanceData['form'] = $formNode->nodeValue;
        }
        $breakpointsNode = $appearanceNode->getElementsByTagName('breakpoints')->item(0);
        if ($breakpointsNode && $breakpointsNode->nodeValue) {
            $appearanceData['breakpoints'] = $this->convertBreakpoints($breakpointsNode);
        }
        return $appearanceData;
    }

    /**
     * Convert appearance properties
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertAppearanceStyles(\DOMElement $elementNode): array
    {
        $data = [];
        foreach ($elementNode->getElementsByTagName('data') as $dataNode) {
            $dataName = $dataNode->attributes->getNamedItem('name')->nodeValue;
            $data[$dataName] = $dataNode->nodeValue;
        }
        return $data;
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
     * Convert elements
     *
     * @param \DOMElement $childNode
     * @return array
     */
    private function convertElements(\DOMElement $childNode): array
    {
        $elementData = [];
        foreach ($childNode->getElementsByTagName('element') as $elementNode) {
            $elementName = $elementNode->attributes->getNamedItem('name')->nodeValue;
            $elementData[$elementName] = [
                'style' => $this->convertStyles($elementNode),
                'attributes' => $this->convertAttributes($elementNode),
                'html' => $this->convertHtml($elementNode),
                'css' => $this->convertCss($elementNode),
                'tag' => $this->convertTag($elementNode)
            ];
        }

        return $elementData;
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
        $xmlItemNodes = $elementNode->childNodes;

        if (!$xmlItemNodes->length) {
            return $additionalData;
        }

        /** @var $xmlItemNode \DOMElement */
        foreach ($xmlItemNodes as $xmlItemNode) {
            if ($xmlItemNode->nodeType == XML_ELEMENT_NODE && $xmlItemNode->nodeName === 'item') {
                $parsedItemData = $this->parser->parse($xmlItemNode);
                $itemName = $xmlItemNode->attributes->getNamedItem('name')->nodeValue;

                if (!isset($additionalData[$itemName])) {
                    $additionalData[$itemName] = [];
                }
                $additionalData[$itemName] += $parsedItemData;
            }
        }

        return $additionalData;
    }

    /**
     * Convert styles
     *
     * @param \DOMElement $elementNode
     * @return array
     */
    private function convertStyles(\DOMElement $elementNode): array
    {
        $stylesData = [];
        foreach ($elementNode->getElementsByTagName('style') as $styleNode) {
            $stylesData[] = [
                'var' => $this->extractVariableName($styleNode),
                'name' => $this->getAttributeValue($styleNode, 'source'),
                'converter' => $this->getAttributeValue($styleNode, 'converter'),
                'preview_converter' => $this->getAttributeValue($styleNode, 'preview_converter'),
                'persistence_mode' => $this->getAttributeValue($styleNode, 'persistence_mode')
                    ?? 'readwrite',
                'reader' => $this->getAttributeValue($styleNode, 'reader')
                    ?? self::DEFAULT_PROPERTY_READER,
            ];
        }
        foreach ($elementNode->getElementsByTagName('static_style') as $styleNode) {
            $stylesData[] = [
                'name' => $this->getAttributeValue($styleNode, 'source'),
                'value' => $this->getAttributeValue($styleNode, 'value'),
                'static' => true
            ];
        }

        return $stylesData;
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
        foreach ($elementNode->getElementsByTagName('attribute') as $attributeNode) {
            $attributesData[] = [
                'var' => $this->extractVariableName($attributeNode),
                'name' => $this->getAttributeValue($attributeNode, 'source'),
                'converter' => $this->getAttributeValue($attributeNode, 'converter'),
                'preview_converter' => $this->getAttributeValue($attributeNode, 'preview_converter'),
                'persistence_mode' => $this->getAttributeValue($attributeNode, 'persistence_mode')
                    ?? 'readwrite',
                'reader' => $this->getAttributeValue($attributeNode, 'reader')
                    ?? self::DEFAULT_ATTRIBUTE_READER,
            ];
        }
        foreach ($elementNode->getElementsByTagName('static_attribute') as $attributeNode) {
            $attributesData[] = [
                'name' => $this->getAttributeValue($attributeNode, 'source'),
                'value' => $this->getAttributeValue($attributeNode, 'value'),
                'static' => true
            ];
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
            $htmlData['var']= $this->getAttributeValue($htmlNode, 'name');
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
            $cssData['var'] = $this->getAttributeValue($cssNode, 'name');
            $filterClasses = [];
            $filterNode = $cssNode->getElementsByTagName('filter')->item(0);
            if ($filterNode) {
                foreach ($filterNode->getElementsByTagName('class') as $classNode) {
                    $filterClasses[] = $this->getAttributeValue($classNode, 'source');
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
            $tagData['var'] = $this->getAttributeValue($tagNode, 'name');
            $tagData['converter'] = $this->getAttributeValue($tagNode, 'converter');
        }
        return $tagData;
    }

    /**
     * Converts converter data
     *
     * @param \DOMElement $appearanceNode
     * @return array
     */
    private function convertConvertersData(\DOMElement $appearanceNode): array
    {
        $convertersNode = $appearanceNode->getElementsByTagName('converters')->item(0);
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
     * Convert parent and child data to correct format
     *
     * @param \DOMElement $elementNode
     * @param string $tagName
     * @return array
     */
    private function convertParentChildData(\DOMElement $elementNode, string $tagName): array
    {
        $data = [];
        foreach ($elementNode->getElementsByTagName($tagName) as $node) {
            $name = $node->attributes->getNamedItem('name')->nodeValue;
            $data[$node->attributes->getNamedItem('policy')->nodeValue][] = $name;
        }
        return $data;
    }

    /**
     * Convert parent and child data to allowed parents
     *
     * @param array $types
     * @param array $parentChildData
     * @return array
     */
    private function convertParentChildDataToAllowedParents(array $types, array $parentChildData): array
    {
        $allowedParentsData = [];

        // convert children
        $allowedParents = $this->convertChildrenToAllowedParents($parentChildData, $types);
        foreach ($types as $type) {
            $allowedParentsData[$type]['allowed_parents'] = $allowedParents[$type];
        }

        // convert parents
        $allowedParentsData = $this->convertParentsToAllowedParents($parentChildData, $types, $allowedParentsData);

        return $allowedParentsData;
    }

    /**
     * Convert children data to allow parents
     *
     * @param array $parentChildData
     * @param array $types
     * @return array
     */
    private function convertChildrenToAllowedParents(array $parentChildData, array $types): array
    {
        $allowedParents = [];

        // setup allowed parents array
        foreach ($types as $type) {
            $allowedParents[$type] = [];
        }

        foreach ($parentChildData as $key => $value) {
            $children = $value['children'] ?? [];

            if (empty($children)) {
                continue;
            }

            foreach ($allowedParents as $type => $parents) {
                $typeAllowed = in_array($type, $children['types']['allow'] ?? []);
                $typeDenied = in_array($type, $children['types']['deny'] ?? []);
                if (($children['defaultPolicy'] === 'deny' && !$typeAllowed) || $typeDenied) {
                    $allowedParents[$type] = $this->removeDataInArray($key, $parents);
                } else {
                    $allowedParents[$type][] = $key;
                }
            }
        }

        return $allowedParents;
    }

    /**
     * Convert parents data to allowed parents
     *
     * @param array $parentChildData
     * @param array $types
     * @param array $allowedParentsData
     * @return array
     */
    private function convertParentsToAllowedParents(
        array $parentChildData,
        array $types,
        array $allowedParentsData
    ): array {
        foreach ($parentChildData as $key => $value) {
            $parent = $value['parents'] ?? [];

            if (empty($parent)) {
                continue;
            }

            $allowedTypes = $parent['types']['allow'] ?? [];
            $deniedTypes = $parent['types']['deny'] ?? [];

            if ($parent['defaultPolicy'] === 'deny') {
                $allowedParents = $allowedTypes;
            } else {
                $allowedParents = array_merge($types, $allowedTypes);
                foreach ($deniedTypes as $type) {
                    $allowedParents = $this->removeDataInArray($type, $allowedParents);
                }
            }
            $allowedParentsData[$key]['allowed_parents'] = $allowedParents;
        }

        return $allowedParentsData;
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
     * @param \DOMElement $attributeNode
     * @param string $attributeName
     * @return string|null
     */
    private function getAttributeValue(\DOMElement $attributeNode, string $attributeName)
    {
        return $attributeNode->hasAttribute($attributeName)
            ? $attributeNode->attributes->getNamedItem($attributeName)->nodeValue
            : null;
    }

    /**
     * Extract variable name from style and attribute nodes
     *
     * @param \DOMElement $node
     * @return string
     */
    private function extractVariableName(\DOMElement $node): string
    {
        return $this->getAttributeValue($node, 'storage_key')
            ?: $this->getAttributeValue($node, 'name');
    }

    /**
     * Remove data from array
     *
     * @param string $searchValue
     * @param array $data
     * @return array
     */
    private function removeDataInArray(string $searchValue, array $data): array
    {
        $removeKey = array_search($searchValue, $data);
        if ($removeKey !== false) {
            unset($data[$removeKey]);
        }
        return array_values($data);
    }
}
