<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);


namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Wysiwyg;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;

/**
 * Returns adapter config based on active editor path
 */
class Config implements ProviderInterface
{
    /**
     * @var \Magento\Cms\Model\Wysiwyg\Config
     */
    private $wysiwygConfig;

    /**
     * @var \Magento\PageBuilder\Model\Wysiwyg\InlineEditing
     */
    private $inlineEditingChecker;

    /**
     * @var \Magento\Ui\Block\Wysiwyg\ActiveEditor
     */
    private $activeEditor;

    /**
     * ConfigProvider constructor.
     * @param \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig
     * @param \Magento\PageBuilder\Model\Wysiwyg\InlineEditing $inlineEditingChecker
     * @param \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor
     */
    public function __construct(
        \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig,
        \Magento\PageBuilder\Model\Wysiwyg\InlineEditing $inlineEditingChecker,
        \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor
    ) {
        $this->wysiwygConfig = $wysiwygConfig;
        $this->inlineEditingChecker = $inlineEditingChecker;
        $this->activeEditor = $activeEditor;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        $config = [];
        if ($this->inlineEditingChecker->isAvailable($this->activeEditor->getWysiwygAdapterPath())) {
            $config = $this->wysiwygConfig->getConfig()->getData();
        }
        return [$itemName => $config];
    }
}
