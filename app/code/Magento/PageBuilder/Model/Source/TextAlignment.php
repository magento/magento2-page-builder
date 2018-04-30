<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**
 * TextAlignment options class used for system configuration
 */
namespace Magento\PageBuilder\Model\Source;

class TextAlignment extends \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype
{
    /**
     * @var array
     */
    private $optionsData;

    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepo;

    /**
     * TextAlignment constructor.
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     * @param array $optionsData
     */
    public function __construct(
        \Magento\Framework\View\Asset\Repository $assetRepo,
        array $optionsData = []
    ) {
        $this->assetRepo = $assetRepo;
        $this->optionsData = $optionsData;
    }

    /**
     * {@inheritdoc}
     */
    public function toOptionArray()
    {
        if ($this->optionsData) {
            foreach ($this->optionsData as $optionKey => $optionValue) {
                if (isset($optionValue['selectIcon'])) {
                    $optionValue['selectIcon'] = $this->assetRepo->getUrl($optionValue['selectIcon']);
                    $this->optionsData[$optionKey] = $optionValue;
                }
            }
        }
        return $this->optionsData;
    }
}
