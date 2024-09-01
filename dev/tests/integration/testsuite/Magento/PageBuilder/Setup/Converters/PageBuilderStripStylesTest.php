<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Converters;

use DOMDocument;
use DOMElement;
use DOMXPath;
use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;
use PHPUnit\Framework\TestCase;

/**
 * @magentoDbIsolation enabled
 */
class PageBuilderStripStylesTest extends TestCase
{
    private const XPATH_SELECTOR = '//*[@data-content-type][@style]|//*[@data-content-type]/*[@style]';

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
     * @dataProvider conversionDataRaw
     * @param string $htmlString
     * @param int $expectedStyleTags
     */
    public function testConvert(string $htmlString, int $expectedStyleTags)
    {
        $convertPageBuilderStripStyles = $this->objectManager->create(PageBuilderStripStyles::class);
        $result = $convertPageBuilderStripStyles->convert($htmlString);

        \libxml_use_internal_errors(true);

        $docBefore = new DOMDocument();
        $docBefore->loadHTML($htmlString);
        $xpathBefore = new DOMXPath($docBefore);

        $docAfter = new DOMDocument();
        $docAfter->loadHTML($result);
        $xpathAfter = new DOMXPath($docAfter);

        \libxml_clear_errors();

        $getInternalStyles = false;
        $nodesBefore = $xpathBefore->query(self::XPATH_SELECTOR);
        $styleRules = [];

        foreach ($nodesBefore as $node) {
            /* @var DOMElement $node */
            $styleAttr = $node->getAttribute('style');

            if ($styleAttr) {
                if ($xpathAfter->query('//body/style[last()]')->item(0)) {
                    $getInternalStyles = $xpathAfter->query('//body/style[last()]')->item(0)->textContent;
                }
                $styleRules[] = $styleAttr;
            }
        }

        // Assert Inline Styles Were Removed
        $this->assertEquals(0, \count($xpathAfter->query(self::XPATH_SELECTOR)));

        // Assert Expected Internal Styles
        $this->assertEquals($expectedStyleTags, \count($xpathAfter->query('//style')));

        // Assert Converted Styles
        if ($getInternalStyles) {
            foreach ($styleRules as $styleRule) {
                $this->assertStringContainsString($styleRule, $getInternalStyles);
            }
        }
    }

    /**
     * @return array
     */
    public static function conversionData(): array
    {
        // phpcs:disable Generic.Files.LineLength.TooLong
        return [
            [
                // Basic CMS Content
                '<h1>Magento, an Adobe Company</h1>',
                0
            ],
            [
                // Basic CMS Content with Inline Style
                '<h1 style="color: #101020;">Magento, an Adobe Company</h1>',
                1
            ],
            [
                // Basic CMS Content with Existing Style
                '<h1>Magento, an Adobe Company</h1><style>h1 { background-color: #dadada; }</style>',
                1
            ],
            [
                // Basic CMS Content with Inline/Existing Style
                '<h1 style="color: #101020;">Magento, an Adobe Company</h1><style>h1 { background-color: #dadada; }</style>',
                2
            ],
            [
                // Basic CMS Content with Inline/Existing Style (Unclosed)
                '<h1 style="color: #101020;">Magento, an Adobe Company<style>h1 { background-color: #dadada; }</style>',
                2
            ],
            [
                // Row
                '<div data-content-type="row" data-appearance="full-bleed" data-enable-parallax="1" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(240, 240, 240); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: center; border-style: none; border-width: 1px; border-radius: 10px; min-height: 100vh; margin: 0px 0px 10px; padding: 10px;"></div>',
                1
            ],
            [
                // Column(s)
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main"><div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(255, 241, 193); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: left; border-style: none; border-width: 1px; border-radius: 20px; width: 50%; margin: 0px 0px 10px; padding: 10px; align-self: stretch;"></div><div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(197, 219, 240); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: right; border-style: none; border-width: 1px; border-radius: 20px; width: 50%; margin: 0px 0px 10px; padding: 10px; align-self: stretch;"></div></div></div></div>',
                1
            ],
            [
                // Text
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="text" data-appearance="default" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 15px;">Text</div></div></div>',
                1
            ],
            [
                // Heading
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="text-align: center; border-style: solid; border-color: rgb(0, 170, 255); border-width: 1px; border-radius: 0px; margin-top: 0px; margin-bottom: 10px;">Heading</h2></div></div>',
                1
            ],
            [
                // Button
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="buttons" data-appearance="inline" data-same-width="false" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="https://www.adobe.com/" target="_blank" data-link-type="default" data-element="link" style="text-align: center; border-radius: 25px; margin-bottom: 10px;"><span data-element="link_text">Browse</span></a></div></div></div></div>',
                1
            ],
            [
                // Buttons
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="buttons" data-appearance="inline" data-same-width="true" data-element="main" style="text-align: right; border-style: none; border-width: 1px; border-radius: 0px; margin: 20px 0px 0px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-secondary" href="https://www.example.com/style/style?style=style#style" target="" data-link-type="default" data-element="link" style="text-align: center; margin-bottom: 10px;"><span data-element="link_text">Cancel</span></a></div><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="{{widget type=\'Magento\Cms\Block\Widget\Page\Link\' page_id=\'2\' template=\'Magento_PageBuilder::widget/link_href.phtml\' type_name=\'CMS Page Link\' }}" target="" data-link-type="page" data-element="link" style="text-align: center;"><span data-element="link_text">OK</span></a></div></div></div></div>',
                1
            ],
            [
                // Divider
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 5px 0px; padding: 10px;"><hr data-element="line" style="width: 100%; border-width: 2px; border-color: rgb(0, 170, 255); display: inline-block;"></div></div></div>',
                1
            ],
            [
                // HTML Code
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 0px;">&lt;iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="display: block; opacity: 0.75;" width="560" &gt;&lt;/iframe&gt;</div></div></div>',
                1
            ],
            [
                // Tabs
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div class="tab-align-left" data-content-type="tabs" data-appearance="default" data-active-tab="" data-element="main" style="margin: 0px; padding: 0px;"><ul role="tablist" class="tabs-navigation" data-element="navigation" style="text-align: left;"><li role="tab" class="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#M9OME54" class="tab-title"><span class="tab-title">Tab 1</span></a></li><li role="tab" class="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#KJWLCIB" class="tab-title"><span class="tab-title">Tab 2</span></a></li></ul><div class="tabs-content" data-element="content" style="border-width: 1px; border-radius: 0px; min-height: 300px;"><div data-content-type="tab-item" data-appearance="default" data-tab-name="Tab 1" data-background-images="{}" data-element="main" id="M9OME54" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(240, 240, 240); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: left; border-width: 1px; border-radius: 0px; margin: 0px; padding: 40px;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Heading</h2></div><div data-content-type="tab-item" data-appearance="default" data-tab-name="Tab 2" data-background-images="{}" data-element="main" id="KJWLCIB" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(234, 234, 234); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-width: 1px; border-radius: 0px; margin: 0px; padding: 40px;"><div data-content-type="text" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">Text</div></div></div></div></div></div>',
                1
            ],
            [
                // Image
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><figure data-content-type="image" data-appearance="full-width" data-element="main" style="text-align: center; margin: 0px; padding: 0px; border-style: none;"><img class="pagebuilder-mobile-hidden" src="{{media url=wysiwyg/512.jpeg}}" alt="Magento, an Adobe Company" title="Magento, an Adobe Company" data-element="desktop_image" style="border-style: solid; border-color: rgb(255, 255, 255); border-width: 2px; border-radius: 256px; max-width: 100%; height: auto;"><img class="pagebuilder-mobile-only" src="{{media url=wysiwyg/512.jpeg}}" alt="Magento, an Adobe Company" title="Magento, an Adobe Company" data-element="mobile_image" style="border-style: solid; border-color: rgb(255, 255, 255); border-width: 2px; border-radius: 256px; max-width: 100%; height: auto;"><figcaption data-element="caption">Magento, an Adobe Company</figcaption></figure></div></div>',
                1
            ],
            [
                // Slider
                '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div class="pagebuilder-slider" data-content-type="slider" data-appearance="default" data-autoplay="false" data-autoplay-speed="4000" data-fade="false" data-infinite-loop="false" data-show-arrows="false" data-show-dots="true" data-element="main" style="min-height: 300px; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;"><div data-content-type="slide" data-slide-name="" data-appearance="collage-left" data-show-button="hover" data-show-overlay="never" data-element="main" style="min-height: 300px; margin: 0px;"><a href="{{widget type=\'Magento\Cms\Block\Widget\Page\Link\' page_id=\'2\' template=\'Magento_PageBuilder::widget/link_href.phtml\' type_name=\'CMS Page Link\' }}" target="" data-link-type="page" data-element="link"><div class="pagebuilder-slide-wrapper" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="wrapper" style="background-color: rgb(240, 192, 194); background-position: left top; background-size: cover; background-repeat: no-repeat; border-style: none; border-width: 1px; border-radius: 0px; min-height: 300px; padding: 40px; text-align: left;"><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">Slide 1</div><button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" data-element="button" style="opacity: 0; visibility: hidden;">Home</button></div></div></div></a></div><div data-content-type="slide" data-slide-name="" data-appearance="collage-centered" data-show-button="never" data-show-overlay="hover" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-slide-wrapper" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="wrapper" style="background-color: rgb(210, 230, 201); background-position: center center; background-size: cover; background-repeat: repeat; border-style: none; border-width: 1px; border-radius: 0px; min-height: 400px; padding: 40px; text-align: center;"><div class="pagebuilder-overlay" data-overlay-color="#f0f0f0" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">Slide 2</div></div></div></div></div></div><div data-content-type="slide" data-slide-name="" data-appearance="collage-right" data-show-button="hover" data-show-overlay="never" data-element="main" style="margin: 0px;"><a href="https://www.magento.com/products/magento-commerce/" target="_blank" data-link-type="default" data-element="link"><div class="pagebuilder-slide-wrapper" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="wrapper" style="background-position: right bottom; background-size: cover; background-repeat: no-repeat; border-style: none; border-width: 1px; border-radius: 0px; min-height: 500px; padding: 40px; text-align: right;"><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">Slide 3</div><button type="button" class="pagebuilder-slide-button pagebuilder-button-link" data-element="button" style="opacity: 0; visibility: hidden;">Magento Commerce</button></div></div></div></a></div></div></div></div>',
                1
            ]
        ];
        // phpcs:enable Generic.Files.LineLength.TooLong
    }

    /**
     * @return array
     */
    public static function conversionDataRaw(): array
    {
        // phpcs:disable Generic.Files.LineLength.TooLong
        return [
            [
                // Text (Raw)
                '<div data-content-type="text" data-appearance="default" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 15px;">Text</div>',
                1
            ],
            [
                // Heading (Raw)
                '<h2 data-content-type="heading" data-appearance="default" data-element="main" style="text-align: center; border-style: solid; border-color: rgb(0, 170, 255); border-width: 1px; border-radius: 0px; margin-top: 0px; margin-bottom: 10px;">Heading</h2>',
                1
            ],
            [
                // Button (Raw)
                '<div data-content-type="buttons" data-appearance="inline" data-same-width="false" data-element="main" style="text-align: left; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="https://www.adobe.com/" target="_blank" data-link-type="default" data-element="link" style="text-align: center; border-radius: 25px; margin-bottom: 10px;"><span data-element="link_text">Browse</span></a></div></div>',
                1
            ],
            [
                // Buttons (Raw)
                '<div data-content-type="buttons" data-appearance="inline" data-same-width="true" data-element="main" style="text-align: right; border-style: none; border-width: 1px; border-radius: 0px; margin: 20px 0px 0px; padding: 10px 10px 0px;"><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-secondary" href="https://www.example.com/style/style?style=style#style" target="" data-link-type="default" data-element="link" style="text-align: center; margin-bottom: 10px;"><span data-element="link_text">Cancel</span></a></div><div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="{{widget type=\'Magento\Cms\Block\Widget\Page\Link\' page_id=\'2\' template=\'Magento_PageBuilder::widget/link_href.phtml\' type_name=\'CMS Page Link\' }}" target="" data-link-type="page" data-element="link" style="text-align: center;"><span data-element="link_text">OK</span></a></div></div>',
                1
            ],
            [
                // Divider (Raw)
                '<div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 5px 0px; padding: 10px;"><hr data-element="line" style="width: 100%; border-width: 2px; border-color: rgb(0, 170, 255); display: inline-block;"></div>',
                1
            ],
            [
                // HTML Code (Raw)
                '<div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 0px;">&lt;iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="display: block; opacity: 0.75;" width="560" &gt;&lt;/iframe&gt;</div>',
                1
            ],
            [
                // Tabs (Raw)
                '<div class="tab-align-left" data-content-type="tabs" data-appearance="default" data-active-tab="" data-element="main" style="margin: 0px; padding: 0px;"><ul role="tablist" class="tabs-navigation" data-element="navigation" style="text-align: left;"><li role="tab" class="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#M9OME54" class="tab-title"><span class="tab-title">Tab 1</span></a></li><li role="tab" class="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#KJWLCIB" class="tab-title"><span class="tab-title">Tab 2</span></a></li></ul><div class="tabs-content" data-element="content" style="border-width: 1px; border-radius: 0px; min-height: 300px;"><div data-content-type="tab-item" data-appearance="default" data-tab-name="Tab 1" data-background-images="{}" data-element="main" id="M9OME54" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(240, 240, 240); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: left; border-width: 1px; border-radius: 0px; margin: 0px; padding: 40px;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Heading</h2></div><div data-content-type="tab-item" data-appearance="default" data-tab-name="Tab 2" data-background-images="{}" data-element="main" id="KJWLCIB" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgb(234, 234, 234); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-width: 1px; border-radius: 0px; margin: 0px; padding: 40px;"><div data-content-type="text" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">Text</div></div></div></div>',
                1
            ],
            [
                // Image (Raw)
                '<figure data-content-type="image" data-appearance="full-width" data-element="main" style="text-align: center; margin: 0px; padding: 0px; border-style: none;"><img class="pagebuilder-mobile-hidden" src="{{media url=wysiwyg/512.jpeg}}" alt="Magento, an Adobe Company" title="Magento, an Adobe Company" data-element="desktop_image" style="border-style: solid; border-color: rgb(255, 255, 255); border-width: 2px; border-radius: 256px; max-width: 100%; height: auto;"><img class="pagebuilder-mobile-only" src="{{media url=wysiwyg/512.jpeg}}" alt="Magento, an Adobe Company" title="Magento, an Adobe Company" data-element="mobile_image" style="border-style: solid; border-color: rgb(255, 255, 255); border-width: 2px; border-radius: 256px; max-width: 100%; height: auto;"><figcaption data-element="caption">Magento, an Adobe Company</figcaption></figure>',
                1
            ],
            [
                // Slider (Raw)
                '<div class="pagebuilder-slider" data-content-type="slider" data-appearance="default" data-autoplay="false" data-autoplay-speed="4000" data-fade="false" data-infinite-loop="false" data-show-arrows="false" data-show-dots="true" data-element="main" style="min-height: 300px; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;"><div data-content-type="slide" data-slide-name="" data-appearance="collage-left" data-show-button="hover" data-show-overlay="never" data-element="main" style="min-height: 300px; margin: 0px;"><a href="{{widget type=\'Magento\Cms\Block\Widget\Page\Link\' page_id=\'2\' template=\'Magento_PageBuilder::widget/link_href.phtml\' type_name=\'CMS Page Link\' }}" target="" data-link-type="page" data-element="link"><div class="pagebuilder-slide-wrapper" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="wrapper" style="background-color: rgb(240, 192, 194); background-position: left top; background-size: cover; background-repeat: no-repeat; border-style: none; border-width: 1px; border-radius: 0px; min-height: 300px; padding: 40px; text-align: left;"><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">Slide 1</div><button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" data-element="button" style="opacity: 0; visibility: hidden;">Home</button></div></div></div></a></div><div data-content-type="slide" data-slide-name="" data-appearance="collage-centered" data-show-button="never" data-show-overlay="hover" data-element="main" style="margin: 0px;"><div data-element="empty_link"><div class="pagebuilder-slide-wrapper" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="wrapper" style="background-color: rgb(210, 230, 201); background-position: center center; background-size: cover; background-repeat: repeat; border-style: none; border-width: 1px; border-radius: 0px; min-height: 400px; padding: 40px; text-align: center;"><div class="pagebuilder-overlay" data-overlay-color="#f0f0f0" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">Slide 2</div></div></div></div></div></div><div data-content-type="slide" data-slide-name="" data-appearance="collage-right" data-show-button="hover" data-show-overlay="never" data-element="main" style="margin: 0px;"><a href="https://www.magento.com/products/magento-commerce/" target="_blank" data-link-type="default" data-element="link"><div class="pagebuilder-slide-wrapper" data-background-images="{}" data-background-type="image" data-video-loop="true" data-video-play-only-visible="true" data-video-lazy-load="true" data-video-fallback-src="" data-element="wrapper" style="background-position: right bottom; background-size: cover; background-repeat: no-repeat; border-style: none; border-width: 1px; border-radius: 0px; min-height: 500px; padding: 40px; text-align: right;"><div class="pagebuilder-overlay" data-overlay-color="" data-element="overlay" style="background-color: transparent;"><div class="pagebuilder-collage-content"><div data-element="content">Slide 3</div><button type="button" class="pagebuilder-slide-button pagebuilder-button-link" data-element="button" style="opacity: 0; visibility: hidden;">Magento Commerce</button></div></div></div></a></div></div>',
                1
            ]
        ];
        // phpcs:enable Generic.Files.LineLength.TooLong
    }
}
