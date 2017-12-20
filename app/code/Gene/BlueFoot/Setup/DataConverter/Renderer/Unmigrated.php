<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Magento\Framework\Serialize\Serializer\Json;
use Gene\BlueFoot\Setup\DataConverter\Format;

/**
 * Render non BlueFoot content type to html content type with embedded data
 */
class Unmigrated implements RendererInterface
{
    /**
     * @var Json
     */
    private $serializer;

    public function __construct(
        Json $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = [])
    {

        return '<div data-role="html">'
            . '<!--'
            . Format::UNMIGRATED_KEY
            . '="'
            . $this->serializer->serialize($itemData)
            . '"-->'
            . '</div>';
    }
}
