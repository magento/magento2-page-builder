<?php
/**
 * Copyright 2024 Adobe
 * All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\Filter;

use Magento\Framework\Math\Random;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\ConfigInterface;
use Magento\PageBuilder\Model\Filter\Template;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

class TemplateTest extends TestCase
{
    /**
     * @var MockObject|LoggerInterface
     */
    private $logger;

    /**
     * @var ConfigInterface|MockObject
     */
    private $viewConfig;

    /**
     * @var Template
     */
    private $model;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->logger = $this->createMock(LoggerInterface::class);
        $this->viewConfig = $this->createMock(ConfigInterface::class);
        $this->model = new Template(
            $this->logger,
            $this->viewConfig,
            new Random(),
            new Json()
        );
    }

    /**
     * @dataProvider filterProvider
     * @param string $input
     * @param string $output
     */
    public function testFilter(string $input, string $output): void
    {
        $this->assertEquals($output, $this->model->filter($input));
    }

    /**
     * @return array
     */
    public static function filterProvider(): array
    {
        return [
            [
                '',
                ''
            ],
            [
                '<div class="messages">' .
                    '<span class="message alert-success">success</span>' .
                '</div>',
                '<div class="messages">' .
                    '<span class="message alert-success">success</span>' .
                '</div>'
            ],
            [
                '<div data-content-type="html">' .
                    '<div class="messages">' .
                        '<span class="message alert-success">success</span>' .
                    '</div>' .
                '</div>',
                '<div data-content-type="html" data-decoded="true">' .
                    '<div class="messages">' .
                        '<span class="message alert-success">success</span>' .
                    '</div>' .
                '</div>'
            ],
            [
                '<div data-content-type="html">' .
                    '&lt;div class="messages"&gt;' .
                        '&lt;span class="message alert-success"&gt;success&lt;/span&gt;' .
                    '&lt;/div&gt;' .
                '</div>',
                '<div data-content-type="html" data-decoded="true">' .
                    '<div class="messages">' .
                        '<span class="message alert-success">success</span>' .
                    '</div>' .
                '</div>'
            ],
            [
                '<div class="widget">' .
                    '<div>smart widget</div>' .
                    '<script type="text/x-magento-template">' .
                        '<span>smart template</span>' .
                    '</script>' .
                '</div>',
                '<div class="widget">' .
                    '<div>smart widget</div>' .
                    '<script type="text/x-magento-template">' .
                        '<span>smart template</span>' .
                    '</script>' .
                '</div>'
            ],
            [
                '<div data-content-type="html">' .
                    '<div class="widget">' .
                        '<div>smart widget</div>' .
                        '<script type="text/x-magento-template">' .
                            '<span>smart template</span>' .
                        '</script>' .
                    '</div>' .
                '</div>',
                '<div data-content-type="html" data-decoded="true">' .
                    '<div class="widget">' .
                        '<div>smart widget</div>' .
                        '<script type="text/x-magento-template">' .
                            '<span>smart template</span>' .
                        '</script>' .
                    '</div>' .
                '</div>',
            ],
        ];
    }
}
