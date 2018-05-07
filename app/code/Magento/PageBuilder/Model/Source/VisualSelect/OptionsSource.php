<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Source\VisualSelect;

/**
 * Prepares options for Visual Select
 */
class OptionsSource implements \Magento\PageBuilder\Model\Source\VisualSelect\OptionsSourceInterface
{
    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepo;

    /**
     * @var array
     */
    private $optionsData;

    /**
     * @var string|null
     */
    private $optionsSize;

    /**
     * OptionsSource constructor.
     *
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     * @param array $optionsData
     * @param string|null $optionsSize
     */
    public function __construct(
        \Magento\Framework\View\Asset\Repository $assetRepo,
        array $optionsData,
        $optionsSize
    ) {
        $this->assetRepo = $assetRepo;
        $this->optionsData = $optionsData;
        $this->optionsSize  = $optionsSize;
    }

    /**
     * {@inheritdoc}
     */
    public function getOptions(): array
    {
        if ($this->optionsData) {
            foreach ($this->optionsData as $optionKey => $optionValue) {
                if (isset($optionValue['icon'])) {
                    $optionValue['icon'] = $this->assetRepo->getUrl($optionValue['icon']);
                }
                $optionValue['size'] = $this->optionsSize ?? 'small';
                $this->optionsData[$optionKey] = $optionValue;
            }
        } else {
            return [];
        }

        return $this->optionsData;
    }
}
