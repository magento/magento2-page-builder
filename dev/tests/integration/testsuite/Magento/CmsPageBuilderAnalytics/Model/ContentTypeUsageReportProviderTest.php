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
    public function testGetReport($expectedReportData, $ignoredContentTypes)
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
        $moduleManager = Bootstrap::getObjectManager()->get(\Magento\Framework\Module\Manager::class);
        // If CMS Staging is enabled we need to use an alternative query
        if ($moduleManager->isEnabled('Magento_CmsStaging')) {
            $reportData = $contentTypeUsageReportProvider->getReport('pagebuilder_page_cms_staging_test');
        } else {
            $reportData = $contentTypeUsageReportProvider->getReport('pagebuilder_page_cms_test');
        }

        $expectedReportDataByType = array_combine(array_column($expectedReportData, 'type'), $expectedReportData);

        foreach ($reportData->getInnerIterator() as $reportItem) {
            // Skip over any ignored content types
            if (in_array($reportItem['type'], $ignoredContentTypes)) {
                continue;
            }

            // Verify we have expected report data for the content type
            if (!isset($expectedReportDataByType[$reportItem['type']])) {
                $this->fail('There is no report data for ' . $reportItem['type'] . '.');
            }

            // Verify the count values match the expected report data
            $this->assertEquals($expectedReportDataByType[$reportItem['type']]['count'], $reportItem['count']);
        }
    }

    /**
     * @return array
     */
    public static function reportDataProvider(): array
    {
        return [
            [
                [
                    ['type' => 'button-item', 'count' => 6],
                    ['type' => 'slide', 'count' => 12],
                    ['type' => 'text', 'count' => 1],
                    ['type' => 'image', 'count' => 2],
                    ['type' => 'block', 'count' => 1],
                    ['type' => 'row', 'count' => 7],
                    ['type' => 'column-group', 'count' => 5],
                    ['type' => 'column-line', 'count' => 5],
                    ['type' => 'column', 'count' => 12],
                    ['type' => 'video', 'count' => 2],
                    ['type' => 'heading', 'count' => 3],
                    ['type' => 'tabs', 'count' => 1],
                    ['type' => 'products', 'count' => 0],
                    ['type' => 'tab-item', 'count' => 2],
                    ['type' => 'banner', 'count' => 4],
                    ['type' => 'buttons', 'count' => 2],
                    ['type' => 'slider', 'count' => 3],
                    ['type' => 'divider', 'count' => 5],
                    ['type' => 'map', 'count' => 2],
                    ['type' => 'html', 'count' => 2]
                ],
                // Ignored content types
                [
                    'dynamic_block'
                ]
            ]
        ];
    }
}
