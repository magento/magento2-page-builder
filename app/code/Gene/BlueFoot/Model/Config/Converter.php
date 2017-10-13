<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Class Converter
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class Converter implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * Convert XML structure into output array
     *
     * @param \DOMDocument $source
     *
     * @return array
     *
     * @todo add translation
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
                    $output['types'][$name][$childNode->nodeName] = $childNode->nodeValue;
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
