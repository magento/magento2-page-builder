<?php
/**
 * Copyright 2024 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\Stage;

use Magento\PageBuilder\Model\Stage\HtmlFilter;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

class HtmlFilterTest extends TestCase
{
    /**
     * @var LoggerInterface|MockObject
     */
    private $loggerMock;

    /**
     * @var HtmlFilter
     */
    private $htmlFilter;

    protected function setUp(): void
    {
        $this->loggerMock = $this->createMock(LoggerInterface::class);
        $this->htmlFilter = new HtmlFilter($this->loggerMock);
    }

    public function testFilterHtml()
    {
        //test for script tag
        $inputHtml = '<div><script type="text/x-magento-init">alert("test")</script><p>Content</p></div>';
        $expectedOutput = '<div><p>Content</p></div>';

        $result = $this->htmlFilter->filterHtml($inputHtml);
        $this->assertEquals($expectedOutput, $result);

        //test for PB placeholder
        $inputHtml = '
<div data-content-type="html" data-appearance="default" data-element="main" class="test">
<div class="block-123">Test</div>
</div>';
        $expectedOutput = '
<div data-content-type="html" data-appearance="default" data-element="main" class="test placeholder-html-code">
&lt;div class="block-123"&gt;Test&lt;/div&gt;
</div>';

        $result = $this->htmlFilter->filterHtml($inputHtml);
        $this->assertEquals($expectedOutput, $result);
    }
}
