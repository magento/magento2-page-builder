<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Component\Form\Element;

use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Ui\Component\Form\Field as UiField;

/**
 * Grid size component for column group content type.
 */
class GridSize extends UiField
{
    private const XML_PATH_COLUMN_GRID_MAX = 'cms/pagebuilder/column_grid_max';
    private const XML_PATH_COLUMN_GRID_DEFAULT = 'cms/pagebuilder/column_grid_default';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * GridSize constructor.
     *
     * @param ContextInterface $context
     * @param UiComponentFactory $uiComponentFactory
     * @param ScopeConfigInterface $scopeConfig
     * @param array $components
     * @param array $data
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        ScopeConfigInterface $scopeConfig,
        array $components = [],
        array $data = []
    ) {
        parent::__construct($context, $uiComponentFactory, $components, $data);
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Prepare component configuration
     *
     * @return void
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function prepare()
    {
        parent::prepare();
        $config = $this->getData('config');
        $config['default'] = $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_DEFAULT);
        $config['validation']['validate-default-grid-size'] = $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_MAX);
        $this->setData('config', $config);
    }
}
