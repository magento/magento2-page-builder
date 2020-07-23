<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Template\Source;

use Magento\Framework\Data\OptionSourceInterface;
use Magento\PageBuilder\Model\Stage\Config;

/**
 * Class PageLayout
 */
class TemplateTypes implements OptionSourceInterface
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * @inheritdoc
     */
    public function toOptionArray()
    {
        $templateTypes = $this->config->getConfig()['stage_config']['template_types'];
        foreach ($templateTypes as $key => $value) {
            $options[] = [
                'label' => $value,
                'value' => $key,
            ];
        }

        return $options;
    }
}
