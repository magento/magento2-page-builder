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

class GroupsTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var DirSearch
     */
    private $componentDirSearch;

    protected function setUp()
    {
        $componentRegistrar = new ComponentRegistrar();
        $this->componentDirSearch = new DirSearch($componentRegistrar, new ReadFactory(new DriverPool()));
    }

    public function testXmlFiles()
    {
        $invoker = new \Magento\Framework\App\Utility\AggregateInvoker($this);
        $invoker(
            function ($filename, $groups) {
                $dom = new \DOMDocument();
                $dom->loadXML(file_get_contents($filename));

                $contentTypeGroup = $dom->getElementsByTagName('group')->item(0);
                if ($contentTypeGroup) {
                    $this->assertContains(
                        $contentTypeGroup->nodeValue,
                        $groups,
                        'Invalid group "' . $contentTypeGroup->nodeValue . '" in XML File ' . $filename
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

        $groups = $this->getContentTypeGroups();

        $this->assertNotEmpty($groups, 'No groups were found');

        $files = $this->componentDirSearch->collectFiles(
            ComponentRegistrar::MODULE,
            'view/{adminhtml,base}/pagebuilder/content_type/*.xml'
        );

        $this->assertNotEmpty($files, 'No content types were found');

        foreach ($files as $file) {
            $data[] = [$file, $groups];
        }

        return $data;
    }

    /**
     * get an array of all groups from groups.xml files in all modules
     *
     * @return array
     */
    private function getContentTypeGroups(): array
    {
        $data = [];

        $files = $this->componentDirSearch->collectFiles(
            ComponentRegistrar::MODULE,
            'view/{adminhtml,base}/pagebuilder/group.xml'
        );

        foreach ($files as $filename) {
            $dom = new \DOMDocument();
            $dom->loadXML(file_get_contents($filename));
            foreach ($dom->getElementsByTagName('group') as $group) {
                if ($group->nodeType == XML_ELEMENT_NODE && $group->tagName == 'group') {
                    $data[] = $group->attributes->getNamedItem('name')->nodeValue;
                }
            }
        }

        return $data;
    }
}
