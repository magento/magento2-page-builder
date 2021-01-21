<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Plugin\Filter;

use Magento\PageBuilder\Model\Filter\Template as TemplateFilter;
use Magento\Framework\Filter\Template as FrameworkTemplateFilter;
use Magento\PageBuilder\Plugin\Filter\TemplatePlugin;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * Test for page builder template filter plugin
 */
class TemplatePluginTest extends TestCase
{
    /**
     * @var FrameworkTemplateFilter|MockObject
     */
    private $frameworkTemplateFilter;

    /**
     * @var TemplateFilter|MockObject
     */
    private $templateFilter;

    /**
     * @var TemplatePlugin
     */
    private $templatePlugin;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->frameworkTemplateFilter = $this->createMock(FrameworkTemplateFilter::class);
        $this->templateFilter = $this->createMock(TemplateFilter::class);
        $this->templatePlugin = new TemplatePlugin($this->templateFilter);
    }

    public function testAfterFilter(): void
    {
        $result = null;
        $this->templateFilter->expects($this->once())
            ->method('filter')
            ->with('')
            ->willReturn('');
        $this->assertSame('', $this->templatePlugin->afterFilter($this->frameworkTemplateFilter, $result));
    }
}
