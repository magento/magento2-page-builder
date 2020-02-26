<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilderAnalytics\Model;

use Magento\Analytics\ReportXml\ConnectionFactory;
use Magento\Analytics\ReportXml\IteratorFactory;
use Magento\Analytics\ReportXml\Query;
use Magento\Analytics\ReportXml\QueryFactory;
use Magento\Framework\DB\Adapter\AdapterInterface;
use Magento\PageBuilder\Model\Config;

/**
 * Provides content type usage data report
 */
class ContentTypeUsageReportProvider
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
     * @var IteratorFactory
     */
    private $iteratorFactory;

    /**
     * @var ConnectionFactory
     */
    private $connectionFactory;

    /**
     * @var int
     */
    private $batchSize;

    /**
     * ContentTypeProvider constructor.
     *
     * @param Config $config
     * @param QueryFactory $queryFactory
     * @param IteratorFactory $iteratorFactory
     * @param ConnectionFactory $connectionFactory
     * @param int $batchSize
     */
    public function __construct(
        Config $config,
        QueryFactory $queryFactory,
        IteratorFactory $iteratorFactory,
        ConnectionFactory $connectionFactory,
        $batchSize = 5000
    ) {
        $this->config = $config;
        $this->queryFactory = $queryFactory;
        $this->iteratorFactory = $iteratorFactory;
        $this->connectionFactory = $connectionFactory;
        $this->batchSize = $batchSize;
    }

    /**
     * Create the report based on the supplied query
     *
     * @param string $name
     *
     * @return \IteratorIterator
     * @throws \Zend_Db_Statement_Exception
     */
    public function getReport($name) : \IteratorIterator
    {
        $query = $this->queryFactory->create($name);

        // Prepare our type count data
        $typeCounts = [];
        $contentTypes = $this->config->getContentTypes();
        foreach ($contentTypes as $type) {
            $typeCounts[$type['name']] = 0;
        }

        $connection = $this->connectionFactory->getConnection($query->getConnectionName());

        // Determine the total row count and then calculate the batch size
        $rowCount = $this->getRowCount($connection, $query);
        $batches = ceil($rowCount / $this->batchSize);

        if ($batches > 0) {
            for ($batch = 0; $batch <= $batches; $batch++) {
                $batchQuery = $connection->query(
                    $query->getSelect()->limit($this->batchSize, $batch * $this->batchSize)
                );
                foreach ($batchQuery->fetchAll() as $row) {
                    foreach ($contentTypes as $type) {
                        // Count the amount of content types within the content
                        $rowContent = $row['content'] ?? '';
                        if (strlen($rowContent) > 0) {
                            $typeCounts[$type['name']] += substr_count(
                                $rowContent,
                                'data-content-type="' . $type['name'] . '"'
                            );
                        }
                    }
                }
            }
        }

        foreach ($contentTypes as $type) {
            $reportData[] = [
                'type' => $type['name'],
                'count' => $typeCounts[$type['name']]
            ];
        }

        return $this->iteratorFactory->create(
            new \ArrayIterator($reportData)
        );
    }

    /**
     * Determine the row count for the current entity
     *
     * @param AdapterInterface $connection
     * @param Query $query
     *
     * @return string
     */
    private function getRowCount(AdapterInterface $connection, Query $query) : string
    {
        $countSelect = clone $query->getSelect();
        $countSelect->reset(\Magento\Framework\DB\Select::COLUMNS)
            ->columns(['row_count' => new \Zend_Db_Expr('COUNT(*)')]);

        return $connection->fetchOne($countSelect);
    }
}
