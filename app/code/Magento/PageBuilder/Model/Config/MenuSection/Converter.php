<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\MenuSection;

/**
 * Converter for menu section in configuration
 */
class Converter implements \Magento\Framework\Config\ConverterInterface
{
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
            'menu_sections' => $this->convertMenuSections($source)
        ];
    }

    /**
     * Convert data for menu sections
     *
     * @param \DOMDocument $source
     * @return array
     */
    private function convertMenuSections(\DOMDocument $source): array
    {
        $menuSectionsData = [];
        /** @var \DOMNode $menuSection */
        foreach ($source->getElementsByTagName('menu_section') as $menuSection) {
            $name = $menuSection->attributes->getNamedItem('name')->nodeValue;
            /** @var \DOMElement $attributeValue */
            foreach ($menuSection->attributes as $attributeName => $attributeValue) {
                $menuSectionsData[$name][$attributeName] = $attributeValue->nodeValue;
            }
        }
        uasort($menuSectionsData, function ($firstElement, $secondElement) {
            return (int)$firstElement['sortOrder'] <=> (int)$secondElement['sortOrder'];
        });

        return $menuSectionsData;
    }
}
