<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\RendererInterface;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\PageBuilderDataMigration\Setup\DataConverter\Format;

/**
 * Render non PageBuilder content type to html content type with embedded data
 */
class Unmigrated implements RendererInterface
{
    /**
     * @var Json
     */
    private $serializer;

    /**
     * @param Json $serializer
     */
    public function __construct(
        Json $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * @inheritdoc
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        return '<div data-element="main" data-role="html" data-appearance="default">'
            . '<!--'
            . Format::UNMIGRATED_KEY
            . '="'
            . $this->serializer->serialize($itemData)
            . '"-->'
            . '</div>';
    }
}
