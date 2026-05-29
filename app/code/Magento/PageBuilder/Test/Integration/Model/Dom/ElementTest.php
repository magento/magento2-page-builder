<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Integration\Model\Dom;

use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlDocumentInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\HtmlDocument;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class ElementTest extends TestCase
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        $this->objectManager = Bootstrap::getObjectManager();
    }

    /**
     * Tests the removeStyle function
     */
    #[DataProvider('removeStylesDataProvider')]
    public function testRemoveStyle(string $elementData, string $styleProperty, string $expectedResult)
    {
        $document = $this->objectManager->create(
            HtmlDocumentInterface::class,
            [ 'document' => $elementData ]
        );
        /** @var ElementInterface $element */
        $element = $document->querySelector('div');
        $this->assertEquals($expectedResult, $element->removeStyle($styleProperty));
    }

    public static function removeStylesDataProvider()
    {
        // phpcs:disable Generic.Files.LineLength.TooLong
        return [
            [
                '<div data-element="inner" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">',
                'margin',
                'border-style: none; border-width: 1px; border-radius: 0px;  padding: 10px;',
            ],
            [
                '<div data-element="inner" style="border-style: none; border-width: 1px; border-radius: 0px; padding: 10px;">',
                'margin',
                'border-style: none; border-width: 1px; border-radius: 0px; padding: 10px;',
            ],
            [
                '<div data-element="inner">',
                'margin',
                '',
            ],
        ];
        // phpcs:enable Generic.Files.LineLength.TooLong
    }

    /**
     * Tests the addStyle function
     */
    #[DataProvider('addStyleDataProvider')]
    public function testAddStyle(string $elementData, string $styleProperty, string $styleValue, string $expectedResult)
    {
        $document = $this->objectManager->create(
            HtmlDocumentInterface::class,
            [ 'document' => $elementData ]
        );
        /** @var ElementInterface $element */
        $element = $document->querySelector('div');
        $this->assertEquals($expectedResult, $element->addStyle($styleProperty, $styleValue));
    }

    public static function addStyleDataProvider()
    {
        // phpcs:disable Generic.Files.LineLength.TooLong
        return [
            [
                '<div data-element="inner" style="border-style: none; border-width: 1px; border-radius: 0px; padding: 10px;">',
                'margin',
                '10px',
                'margin: 10px; border-style: none; border-width: 1px; border-radius: 0px; padding: 10px;',
            ],
            [
                '<div data-element="inner" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">',
                'margin',
                '10px',
                'margin: 10px; border-style: none; border-width: 1px; border-radius: 0px;  padding: 10px;',
            ],
            [
                '<div data-element="inner">',
                'margin',
                '10px',
                'margin: 10px; ',
            ],
        ];
        // phpcs:enable Generic.Files.LineLength.TooLong
    }
}
