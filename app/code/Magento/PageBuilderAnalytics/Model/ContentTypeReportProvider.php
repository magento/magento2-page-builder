<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilderAnalytics\Model;

use Magento\Analytics\ReportXml\ConnectionFactory;
use Magento\Analytics\ReportXml\QueryFactory;
use Magento\PageBuilder\Model\Config;

/**
 * Provides content type data report
 */
class ContentTypeReportProvider
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @var QueryFactory
     */
    private $queryFactory;

    /**
     * @var ConnectionFactory
     */
    private $connectionFactory;

    /**
     * @param Config $config
     * @param QueryFactory $queryFactory
     * @param ConnectionFactory $connectionFactory
     */
    public function __construct(
        Config $config,
        QueryFactory $queryFactory,
        ConnectionFactory $connectionFactory
    ) {
        $this->config = $config;
        $this->queryFactory = $queryFactory;
        $this->connectionFactory = $connectionFactory;
    }

    /**
     * Generates report with Page Builder content type counts
     *
     * @param string $name
     * @return \IteratorIterator
     */
    public function getReport($name)
    {
        $typeCounts = [];
        $contentTypes = $this->config->getContentTypes();
        foreach ($contentTypes as $type) {
            $typeCounts[$type] = 0;
        }

        $query = $this->queryFactory->create($name);
        $connection = $this->connectionFactory->getConnection($query->getConnectionName());
        $statement = $connection->query($query->getSelect()->limit(1000));
        $batchNum = 1;
        while ($statement->rowCount() > 0) {
            foreach ($statement->fetchAll() as $row) {
                $value = $row['content'];
                foreach ($contentTypes as $type) {
                    $typeCounts[$type] += substr_count($value, "data-role=\"" . $type . "\"");
                }
            }
            $statement = $connection->query($query->getSelect()->limit(1000, 1000 * $batchNum));
            $batchNum++;
        }

        $reportData[] = ['Content Type', 'Count'];
        foreach ($contentTypes as $type) {
            $reportData[] = [$type, $typeCounts[$type]];
        }
        return new \IteratorIterator(new \ArrayIterator($reportData));
    }
}
