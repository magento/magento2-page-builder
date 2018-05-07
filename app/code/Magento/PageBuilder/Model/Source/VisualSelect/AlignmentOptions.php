<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Source\VisualSelect;

/**
 * Options class used for text alignment field
 */
class AlignmentOptions extends \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype
{
    /**
     * @var OptionsSourceInterface
     */
    private $optionsSource;

    /**
     * AlignmentOptions constructor.
     *
     * @param \Magento\PageBuilder\Model\Source\VisualSelect\OptionsSourceInterface $optionsSource
     */
    public function __construct(
        \Magento\PageBuilder\Model\Source\VisualSelect\OptionsSourceInterface $optionsSource
    ) {
        $this->optionsSource = $optionsSource;
    }

    /**
     * {@inheritdoc}
     */
    public function toOptionArray(): array
    {
        return $this->optionsSource->getOptions();
    }
}
