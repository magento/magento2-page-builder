<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Filter;

use Magento\TestFramework\ObjectManager;

class TemplateTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var Template
     */
    private $templateFilter;

    protected function setUp(): void
    {
        $this->templateFilter = ObjectManager::getInstance()->create(Template::class);
    }

    /**
     * @param string $results
     * @param bool $contains
     * @param string $value
     * @dataProvider getFilterForDataProvider
     */
    public function testFilterFor(string $results, bool $contains, string $value)
    {
        $contains ?
            self::assertStringContainsString($results, $this->templateFilter->filter($value)) :
            self::assertStringNotContainsString($results, $this->templateFilter->filter($value));
    }

    /**
     * @return array
     */
    public static function getFilterForDataProvider() : array
    {
        $template = <<<TEMPLATE
<div data-content-type="row" data-appearance="contained" data-element="main">
	<div data-enable-parallax="0" data-parallax-speed="0.5"
	data-background-images="{\&quot;desktop_image\&quot;:\&quot;{{media url=jb-decorating.jpg}}\&quot;}"
	data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column;
	background-position: center center; background-size: cover; background-repeat: repeat;
	background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; min-height: 350px;
	margin: 0px 0px 10px; padding: 10px;"></div>
</div>
TEMPLATE;

        $template2 = <<<TEMPLATE
<div data-content-type="row" data-element="main" data-appearance="contained">
	<div style="background-position: center; border-width: 1px; border-style: none; margin: 0px 0px 10px;
	padding: 10px; border-radius: 0px; background-repeat: repeat; background-attachment: scroll; display: flex;
	min-height: 350px; background-size: cover; flex-direction: column; justify-content: flex-start;"
	data-element="inner" data-background-images='{\"desktop_image\":\"{{media url=jb-decorating.jpg}}\"}'
	data-parallax-speed="0.5" data-enable-parallax="0"></div>
</div>
TEMPLATE;

        $template3 = <<<TEMPLATE
<div data-content-type="row" data-element="main" data-appearance="contained">
	<div style="background-position: center; border-width: 1px; border-style: none; margin: 0px 0px 10px;
	padding: 10px; border-radius: 0px; background-repeat: repeat; background-attachment: scroll; display: flex;
	min-height: 350px; background-size: cover; flex-direction: column; justify-content: flex-start;"
	data-element="inner" data-background-images='{}' data-parallax-speed="0.5" data-enable-parallax="0"></div>
</div>
TEMPLATE;

        $expectedResult = <<<EXPECTED_RESULT
<style type="text/css">.background-image-
EXPECTED_RESULT;

        $expectedResult2 = <<<EXPECTED_RESULT
class="background-image-
EXPECTED_RESULT;
        return [
            [
                $expectedResult,
                true,
                $template
            ],
            [
                $expectedResult2,
                true,
                $template
            ],
            [
                $expectedResult,
                true,
                $template2
            ],
            [
                $expectedResult2,
                true,
                $template2
            ],
            [
                $expectedResult,
                false,
                $template3
            ],
            [
                $expectedResult2,
                false,
                $template3
            ],
        ];
    }
}
