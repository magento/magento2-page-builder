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
     * @var \Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList
     */
    private $inlineEditingChecker;

    /**
     * @var \Magento\Ui\Block\Wysiwyg\ActiveEditor
     */
    private $activeEditor;

    /**
     * @var array
     */
    private $editors;

    /**
     * Config constructor.
     * @param \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig
     * @param \Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList $inlineEditingChecker
     * @param \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor
     * @param array $editors
     */
    public function __construct(
        \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig,
        \Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList $inlineEditingChecker,
        \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor,
        $editors = []
    ) {
        $this->wysiwygConfig = $wysiwygConfig;
        $this->inlineEditingChecker = $inlineEditingChecker;
        $this->activeEditor = $activeEditor;
        $this->editors = $editors;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        $config = [];
        $activeEditorPath = $this->activeEditor->getWysiwygAdapterPath();
        if ($this->inlineEditingChecker->isSupported($activeEditorPath)) {
            $config['adapter'] = $this->wysiwygConfig->getConfig()->getData();
            if (isset($this->editors[$activeEditorPath])) {
                $config['adapter_config'] = $this->editors[$activeEditorPath];
            }
        }
        return [$itemName => $config,];
    }
}
