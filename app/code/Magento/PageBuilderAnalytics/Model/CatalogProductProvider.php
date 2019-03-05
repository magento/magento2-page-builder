<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilderAnalytics\Model;

use Magento\Analytics\ReportXml\QueryFactory;

/**
 * Collect analytics data for Catalog Products
 */
class CatalogProductProvider
{
    /**
     * @var QueryFactory
     */
    private $queryFactory;

    /**
     * @var ContentTypeBatchReportBuilder
     */
    private $reportBuilder;

    /**
     * @var string
     */
    private $queryName;

    /**
     * @param QueryFactory $queryFactory
     * @param ContentTypeBatchReportBuilder $reportBuilder
     * @param string $queryName
     */
    public function __construct(
        QueryFactory $queryFactory,
        ContentTypeBatchReportBuilder $reportBuilder,
        $queryName
    ) {
        $this->queryFactory = $queryFactory;
        $this->reportBuilder = $reportBuilder;
        $this->queryName = $queryName;
    }

    /**
     * Build the report
     *
     * @return \IteratorIterator
     * @throws \Zend_Db_Statement_Exception
     */
    public function getReport() : \IteratorIterator
    {
        return $this->reportBuilder->create(
            $this->queryFactory->create($this->queryName)
        );
    }
}
