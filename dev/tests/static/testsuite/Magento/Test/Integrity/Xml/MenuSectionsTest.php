<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\Test\Integrity\Xml;

use Magento\Framework\Component\DirSearch;
use Magento\Framework\Component\ComponentRegistrar;
use Magento\Framework\Filesystem\Directory\ReadFactory;
use Magento\Framework\Filesystem\DriverPool;

class MenuSectionsTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var DirSearch
     */
    private $componentDirSearch;

    protected function setUp(): void
    {
        $componentRegistrar = new ComponentRegistrar();
        $this->componentDirSearch = new DirSearch($componentRegistrar, new ReadFactory(new DriverPool()));
    }

    public function testXmlFiles()
    {
        $invoker = new \Magento\Framework\App\Utility\AggregateInvoker($this);
        $invoker(
            function ($filename, $menuSections) {
                $dom = new \DOMDocument();
                $dom->loadXML(file_get_contents($filename));

                $contentTypeMenuSection = $dom->getElementsByTagName('menu_section')->item(0);
                if ($contentTypeMenuSection) {
                    $this->assertStringContainsString(
                        $contentTypeMenuSection->nodeValue,
                        $menuSections,
                        'Invalid menu section "' . $contentTypeMenuSection->nodeValue . '" in XML File ' . $filename
                    );
                }
            },
            $this->getXmlFiles()
        );
    }

    /**
     * get all xml files in content_types directory for all modules
     *
     * @return array
     */
    private function getXmlFiles(): array
    {
        $data = [];

        $menuSections = $this->getContentTypeMenuSections();

        $this->assertNotEmpty($menuSections, 'No menu sections were found');

        $files = $this->componentDirSearch->collectFiles(
            ComponentRegistrar::MODULE,
            'view/{adminhtml,base}/pagebuilder/content_type/*.xml'
        );

        $this->assertNotEmpty($files, 'No content types were found');

        foreach ($files as $file) {
            $data[] = [$file, $menuSections];
        }

        return $data;
    }

    /**
     * get an array of all menu sections from menu_sections.xml files in all modules
     *
     * @return array
     */
    private function getContentTypeMenuSections(): array
    {
        $data = [];

        $files = $this->componentDirSearch->collectFiles(
            ComponentRegistrar::MODULE,
            'view/{adminhtml,base}/pagebuilder/menu_section.xml'
        );

        foreach ($files as $filename) {
            $dom = new \DOMDocument();
            $dom->loadXML(file_get_contents($filename));
            foreach ($dom->getElementsByTagName('menu_section') as $menuSection) {
                if ($menuSection->nodeType == XML_ELEMENT_NODE && $menuSection->tagName == 'menu_section') {
                    $data[] = $menuSection->attributes->getNamedItem('name')->nodeValue;
                }
            }
        }

        return $data;
    }
}
