<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\Component\UrlInput\Page;

use Magento\TestFramework\Helper\Bootstrap;
use Magento\Cms\Model\ResourceModel\Page\CollectionFactory;

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
