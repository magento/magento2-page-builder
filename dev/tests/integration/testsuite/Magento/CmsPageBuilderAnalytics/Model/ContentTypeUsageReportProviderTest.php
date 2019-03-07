<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\CmsPageBuilderAnalytics\Model;

use Magento\TestFramework\Helper\Bootstrap;
use Magento\Framework\App\ResourceConnection;

/**
 * @magentoAppArea adminhtml
 */
class ContentTypeUsageReportProviderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @magentoAppIsolation enabled
     * @magentoDataFixture Magento/CmsPageBuilderAnalytics/_files/pages.php
     * @dataProvider reportDataProvider
     */
    public function testGetReport($expectedReportData)
    {
        /* @var $resourceConnection ResourceConnection */
        $resourceConnection = Bootstrap::getObjectManager()->get(ResourceConnection::class)
            ->getConnection(ResourceConnection::DEFAULT_CONNECTION);
        $connectionFactoryMock = $this->createMock(\Magento\Analytics\ReportXml\ConnectionFactory::class);
        $connectionFactoryMock->expects($this->once())
            ->method('getConnection')
            ->willReturn($resourceConnection);
        /* @var $contentTypeUsageReportProvider \Magento\PageBuilderAnalytics\Model\ContentTypeUsageReportProvider */
        $contentTypeUsageReportProvider = Bootstrap::getObjectManager()->create(
            \Magento\PageBuilderAnalytics\Model\ContentTypeUsageReportProvider::class,
            [
                'connectionFactory' => $connectionFactoryMock
            ]
        );
        $reportData = $contentTypeUsageReportProvider->getReport('pagebuilder_page_test');

        $this->assertEquals($expectedReportData, iterator_to_array($reportData->getInnerIterator()));
    }

    /**
     * @return array
     */
    public function reportDataProvider(): array
    {
        return [
            [
                [
                    [
                        'Content Type',
                        'Count'
                    ],
                    [
                        'button-item',
                        6
                    ],
                    [
                        'slide',
                        12
                    ],
                    [
                        'text',
                        1
                    ],
                    [
                        'image',
                        2
                    ],
                    [
                        'block',
                        1
                    ],
                    [
                        'row',
                        7
                    ],
                    [
                        'column-group',
                        5
                    ],
                    [
                        'column',
                        12
                    ],
                    [
                        'video',
                        2
                    ],
                    [
                        'heading',
                        3
                    ],
                    [
                        'tabs',
                        1
                    ],
                    [
                        'products',
                        0
                    ],
                    [
                        'tab-item',
                        2
                    ],
                    [
                        'banner',
                        4
                    ],
                    [
                        'buttons',
                        2
                    ],
                    [
                        'slider',
                        3
                    ],
                    [
                        'divider',
                        5
                    ],
                    [
                        'map',
                        2
                    ],
                    [
                        'html',
                        2
                    ]
                ]
            ]
        ];
    }
}
