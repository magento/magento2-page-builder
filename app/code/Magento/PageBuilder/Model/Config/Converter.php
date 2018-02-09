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
                            $output['types'][$name][$childNode->nodeName][$appearanceName] = $appearanceData;
                        }
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
}
