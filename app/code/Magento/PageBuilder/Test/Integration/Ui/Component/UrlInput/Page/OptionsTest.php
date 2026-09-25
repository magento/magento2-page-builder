<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Integration\Ui\Component\UrlInput\Page;

use Magento\Cms\Model\ResourceModel\Page\CollectionFactory;
use Magento\PageBuilder\Ui\Component\UrlInput\Page\Options;
use Magento\TestFramework\Helper\Bootstrap;

class OptionsTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @magentoDataFixture Magento/Cms/_files/pages.php
     */
    public function testToOptionArray() : void
    {
        $expectedResult = $this->prepareExpectedResult();
        /** @var Options $cmsOptions */
        $cmsOptions = Bootstrap::getObjectManager()->get(Options::class);
        $result = $cmsOptions->toOptionArray();
        $this->assertEquals($expectedResult, $result);
    }

    private function prepareExpectedResult() : array
    {
        $options = [];
        $collection = Bootstrap::getObjectManager()->get(CollectionFactory::class)->create();
        foreach ($collection as $item) {
            $pageId = $item->getId();
            $options[$pageId] = [
                'value' => $pageId,
                'label' => $item->getTitle(),
                'identifier' => sprintf(__('ID: %s')->render(), $pageId)
            ];
        }
        return $options;
    }
}
