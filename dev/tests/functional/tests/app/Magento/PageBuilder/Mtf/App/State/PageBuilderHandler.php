<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Mtf\App\State;

use Magento\Mtf\App\State\AbstractState;
use Magento\Mtf\App\State\StateHandlerInterface;

/**
 * MTF test observer for managing PageBuilder's state
 */
class PageBuilderHandler implements StateHandlerInterface
{
    /**
     * @var \Magento\Mtf\Util\Command\Cli\Config
     */
    private $configuration;

    /**
     * @param \Magento\Mtf\Util\Command\Cli\Config $configuration
     */
    public function __construct(\Magento\Mtf\Util\Command\Cli\Config $configuration)
    {
        $this->configuration = $configuration;
    }

    /**
     * Disable Page Builder before test execution.
     *
     * @param AbstractState $state
     * @return bool
     * @throws \Exception
     * @SuppressWarnings("unused")
     */
    public function execute(AbstractState $state)
    {
        $this->configuration->setConfig('cms/pagebuilder/enabled', '0');
        $this->configuration->setConfig('web/default_layouts/default_product_layout', '1column');
        $this->configuration->setConfig('web/default_layouts/default_category_layout', '1column');
        $this->configuration->setConfig('web/default_layouts/default_cms_layout', '1column');

        return true;
    }
}
