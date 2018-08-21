<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Wysiwyg;

/**
 * Returns information if inline editing available by adapter path
 */
class InlineEditingSupportedAdapterList
{
    /**
     * @var \Magento\Cms\Model\Wysiwyg\Config
     */
    private $wysiwygConfig;

    /**
     * @var array
     */
    private $wysiwygAdaptersSupportingInlineEditing;

    /**
     * InlineEditing constructor.
     * @param \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig
     * @param array $wysiwygAdaptersSupportingInlineEditing
     */
    public function __construct(
        \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig,
        array $wysiwygAdaptersSupportingInlineEditing
    ) {
        $this->wysiwygConfig = $wysiwygConfig;
        $this->wysiwygAdaptersSupportingInlineEditing = $wysiwygAdaptersSupportingInlineEditing;
    }

    /**
     * Check if inline editing available for current adapter
     * @param string $editorPath
     * @return bool
     */
    public function isSupported(string $editorPath) : bool
    {
        return !empty($this->wysiwygAdaptersSupportingInlineEditing[$editorPath]) && $this->wysiwygConfig->isEnabled();
    }
}
