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
class InlineEditing
{
    /**
     * @var array
     */
    private $wysiwygAdaptersSupportingInlineEditing;

    /**
     * InlineEditing constructor.
     * @param array $wysiwygAdaptersSupportingInlineEditing
     */
    public function __construct($wysiwygAdaptersSupportingInlineEditing = [])
    {
        $this->wysiwygAdaptersSupportingInlineEditing = $wysiwygAdaptersSupportingInlineEditing;
    }

    /**
     * Check if inline editing available for current adapter
     * @param string $editorPath
     * @return bool
     */
    public function isAvailable(string $editorPath) : bool
    {
        return $this->wysiwygAdaptersSupportingInlineEditing[$editorPath] ?? false;
    }
}
