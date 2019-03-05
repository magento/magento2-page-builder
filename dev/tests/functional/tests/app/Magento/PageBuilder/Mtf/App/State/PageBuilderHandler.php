<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Mtf\App\State;

use Magento\Mtf\App\State\AbstractState;
use Magento\Mtf\App\State\StateHandlerInterface;

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
        $config = include BP . '/app/etc/config.php';
        $moduleStatuses = $config['modules'];
        $moduleNames = array_keys($moduleStatuses);

        $enabledPageBuilderModuleNames = array_filter($moduleNames, function ($moduleName) use ($moduleStatuses) {
            $isEnabled = (bool) $moduleStatuses[$moduleName];
            $isPageBuilderRelatedModule = stripos($moduleName, 'PageBuilder') !== false;

            return $isEnabled && $isPageBuilderRelatedModule;
        });

        // disable modules in reverse order of installation
        foreach (array_reverse($enabledPageBuilderModuleNames) as $enabledPageBuilderModuleName) {
            $this->configuration->execute('module:disable', [$enabledPageBuilderModuleName]);
        }

        return true;
    }
}
