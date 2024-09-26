<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\Catalog\Product;

use Magento\Framework\View\LayoutInterface;
use Magento\Review\Block\Product\Review;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\Framework\View\Element\Template;
use PHPUnit\Framework\TestCase;

/**
 * PageBuilder Product view integration tests.
 *
 * @magentoAppArea frontend
 */
class ViewTest extends TestCase
{
    /**
     * @var string
     */
    private $wrapperTemplatePath = 'Magento_PageBuilder::catalog/product/view/%s';

    /**
     * @var LayoutInterface
     */
    private $layout;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        $this->layout = Bootstrap::getObjectManager()->get(LayoutInterface::class);
    }

    /**
     * Check that Section Wrapper page contains section ID if it was provided.
     *
     * @param string $sectionId
     * @return void
     * @dataProvider sectionWrapperDataProvider
     */
    public function testSectionWrapperWithProvidedSectionId(string $sectionId): void
    {
        $wrapperBlock = $this->prepareSectionWrapperBlock();
        $wrapperBlock->setSectionId($sectionId);

        $this->assertStringContainsString(sprintf('id="%s"', $sectionId), $wrapperBlock->toHtml());
    }

    /**
     * Check that Section Wrapper page does NOT contain section ID if it was NOT provided.
     *
     * @param string $sectionId
     * @return void
     * @dataProvider sectionWrapperDataProvider
     */
    public function testSectionWrapperWithoutSectionId(string $sectionId): void
    {
        $wrapperBlock = $this->prepareSectionWrapperBlock();

        $this->assertStringNotContainsString(sprintf('id="%s"', $sectionId), $wrapperBlock->toHtml());
    }

    /**
     * DataProvider for testSectionWrapper().
     *
     * @return array
     */
    public static function sectionWrapperDataProvider(): array
    {
        return [
            ['description'],
            ['additional'],
            ['reviews'],
        ];
    }

    /**
     * Create and retrieve Section Wrapper block instance.
     *
     * @return Template
     */
    private function prepareSectionWrapperBlock(): Template
    {
        /** @var Template $wrapperBlock */
        $wrapperBlock = $this->layout->createBlock(Template::class);
        $wrapperBlock->setTemplate(
            sprintf(
                $this->wrapperTemplatePath,
                'section_wrapper.phtml'
            )
        );
        /** @var Review $childReviewBlock */
        $childReviewBlock = $this->layout->createBlock(Review::class);
        $childReviewBlock->setTemplate('Magento_Review::review.phtml');
        $wrapperBlock->setChild('child.review', $childReviewBlock);

        return $wrapperBlock;
    }
}
