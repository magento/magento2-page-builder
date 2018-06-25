<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\TestModulePageBuilderExtensionPoints\Model\Stage\Renderer;

/**
 * Class Test
 */
class Test implements \Magento\PageBuilder\Model\Stage\RendererInterface
{
    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $json;

    /**
     * Constructor
     *
     * @param \Magento\Framework\Serialize\Serializer\Json $json
     */
    public function __construct(
        \Magento\Framework\Serialize\Serializer\Json $json
    ) {
        $this->json = $json;
    }

    /**
     * Render HTML for the specified block
     *
     * @param array $params
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function render(array $params): string
    {
        return $this->json->serialize('Test Content');
    }
}
