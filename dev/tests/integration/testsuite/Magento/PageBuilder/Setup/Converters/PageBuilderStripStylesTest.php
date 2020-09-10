<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Converters;

use DOMDocument;
use DOMXPath;
use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;
use PHPUnit\Framework\TestCase;

class PageBuilderStripStylesTest extends TestCase
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    protected function setUp(): void
    {
        $this->objectManager = Bootstrap::getObjectManager();
    }

    /**
     * Test Batch Conversion of Page Builder Content
     *
     * @dataProvider conversionData
     * @param string $htmlString
     */
    public function testConvert(string $htmlString)
    {
        $convertPageBuilderStripStyles = $this->objectManager->create(PageBuilderStripStyles::class);
        $result = $convertPageBuilderStripStyles->convert($htmlString);

        $document = new DOMDocument();
        $document->loadHTML($result);
        $xpath = new DOMXPath($document);

        $this->assertEquals(0, sizeof($xpath->query('//*[@style]')));
        $this->assertLessThanOrEqual(1, sizeof($xpath->query('//style')));
    }

    /**
     * @return array
     */
    public function conversionData(): array
    {
        // phpcs:disable Generic.Files.LineLength.TooLong
        return [
            [
                // Example
                '<h1>Magento, an Adobe Company</h1>'
            ],
            [
                // Row
                '<div data-content-type="row" data-appearance="full-bleed" data-enable-parallax="1" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(240, 240, 240); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: center; border-style: none; border-width: 1px; border-radius: 10px; min-height: 100vh; margin: 0px 0px 10px; padding: 10px;"></div>'
            ],
            [
                // Column(s)
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main"><div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(255, 241, 193); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: left; border-style: none; border-width: 1px; border-radius: 20px; width: 50%; margin: 0px 0px 10px; padding: 10px; align-self: stretch;"></div><div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(197, 219, 240); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: right; border-style: none; border-width: 1px; border-radius: 20px; width: 50%; margin: 0px 0px 10px; padding: 10px; align-self: stretch;"></div></div></div></div>'
            ],
            [
                // Text (Raw)
                '<div class="elephant news" data-content-type="text" data-appearance="default" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 15px;">Text</div>'
            ],
            [
                // Text
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div class="elephant news" data-content-type="text" data-appearance="default" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 15px;">Text</div></div></div>'
            ],
            [
                // Heading (Raw)
                '<h2 data-content-type="heading" data-appearance="default" data-element="main" style="text-align: center; border-style: solid; border-color: rgb(0, 170, 255); border-width: 1px; border-radius: 0px; margin-top: 0px; margin-bottom: 10px;">Heading</h2>'
            ],
            [
                // Heading
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="text-align: center; border-style: solid; border-color: rgb(0, 170, 255); border-width: 1px; border-radius: 0px; margin-top: 0px; margin-bottom: 10px;">Heading</h2></div></div>'
            ],
            [
                // Button (Raw)
                '<div data-content-type="buttons" data-appearance="inline" data-same-width="false" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="https://www.adobe.com/" target="_blank" data-link-type="default" data-element="link" style="text-align: center; border-radius: 25px; margin-bottom: 10px;"><span data-element="link_text">Browse</span></a></div></div>'
            ],
            [
                // Button
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="buttons" data-appearance="inline" data-same-width="false" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="https://www.adobe.com/" target="_blank" data-link-type="default" data-element="link" style="text-align: center; border-radius: 25px; margin-bottom: 10px;"><span data-element="link_text">Browse</span></a></div></div></div></div>'
            ],
            [
                // Buttons (Raw)
                '<div data-content-type="buttons" data-appearance="inline" data-same-width="true" data-element="main" style="text-align: right; border-style: none; border-width: 1px; border-radius: 0px; margin: 20px 0px 0px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-secondary" href="https://www.example.com/style/style?style=style#style" target="" data-link-type="default" data-element="link" style="text-align: center; margin-bottom: 10px;"><span data-element="link_text">Cancel</span></a></div><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="{{widget type=\'Magento\Cms\Block\Widget\Page\Link\' page_id=\'2\' template=\'Magento_PageBuilder::widget/link_href.phtml\' type_name=\'CMS Page Link\' }}" target="" data-link-type="page" data-element="link" style="text-align: center;"><span data-element="link_text">OK</span></a></div></div>'
            ],
            [
                // Buttons
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="buttons" data-appearance="inline" data-same-width="true" data-element="main" style="text-align: right; border-style: none; border-width: 1px; border-radius: 0px; margin: 20px 0px 0px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-secondary" href="https://www.example.com/style/style?style=style#style" target="" data-link-type="default" data-element="link" style="text-align: center; margin-bottom: 10px;"><span data-element="link_text">Cancel</span></a></div><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="{{widget type=\'Magento\Cms\Block\Widget\Page\Link\' page_id=\'2\' template=\'Magento_PageBuilder::widget/link_href.phtml\' type_name=\'CMS Page Link\' }}" target="" data-link-type="page" data-element="link" style="text-align: center;"><span data-element="link_text">OK</span></a></div></div></div></div>'
            ],
            [
                // Divider (Raw)
                '<div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 5px 0px; padding: 10px;"><hr data-element="line" style="width: 100%; border-width: 2px; border-color: rgb(0, 170, 255); display: inline-block;"></div>'
            ],
            [
                // Divider
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 5px 0px; padding: 10px;"><hr data-element="line" style="width: 100%; border-width: 2px; border-color: rgb(0, 170, 255); display: inline-block;"></div></div></div>'
            ],
            [
                // HTML Code (Raw)
                '<div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 0px;">&lt;iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="display: block; opacity: 0.75;" width="560" &gt;&lt;/iframe&gt;</div>'
            ],
            [
                // HTML Code
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 0px;">&lt;iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="display: block; opacity: 0.75;" width="560" &gt;&lt;/iframe&gt;</div></div></div>'
            ]
        ];
        // phpcs:enable Generic.Files.LineLength.TooLong
    }
}
