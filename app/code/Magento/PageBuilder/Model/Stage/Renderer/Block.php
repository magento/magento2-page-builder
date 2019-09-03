<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

use Magento\Framework\Controller\ResultFactory;
use Magento\PageBuilder\Model\Filter\Template;

/**
 * Renders a block for the stage
 */
class Block implements \Magento\PageBuilder\Model\Stage\RendererInterface
{
    /**
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * @var \Magento\Framework\View\Element\BlockFactory
     */
    private $blockFactory;

    /**
     * @var ResultFactory
     */
    private $resultFactory;

    /**
     * @var Template
     */
    private $templateFilter;

    /**
     * @param \Magento\PageBuilder\Model\Config $config
     * @param \Magento\Framework\View\Element\BlockFactory $blockFactory
     * @param ResultFactory $resultFactory
     * @param Template|null $templateFilter
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config $config,
        \Magento\Framework\View\Element\BlockFactory $blockFactory,
        ResultFactory $resultFactory,
        Template $templateFilter = null
    ) {
        $this->config = $config;
        $this->blockFactory = $blockFactory;
        $this->resultFactory = $resultFactory;
        $this->templateFilter = $templateFilter ?? \Magento\Framework\App\ObjectManager::getInstance()
                ->get(\Magento\PageBuilder\Model\Filter\Template::class);
    }

    /**
     * Render HTML for specified block
     *
     * @param array $params
     * @return array
     */
    public function render(array $params): array
    {
        $result = [
            'content' => null,
        ];

        $contentTypes = $this->config->getContentTypes();
        $backendBlockClassName = isset($contentTypes[$params['role']]['backend_block'])
            ? $contentTypes[$params['role']]['backend_block'] : false;
        $backendBlockTemplate = isset($contentTypes[$params['role']]['backend_template'])
            ? $contentTypes[$params['role']]['backend_template'] : false;

        if ($backendBlockTemplate) {
            $params['template'] = $backendBlockTemplate;
        }

        if ($backendBlockClassName) {
            $backendBlockInstance = $this->blockFactory->createBlock(
                $backendBlockClassName,
                ['data' => $params]
            );
            $pageResult = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
            $pageResult->getLayout()->addBlock($backendBlockInstance);

            $result['content'] = $this->templateFilter->filter($backendBlockInstance->toHtml());
        }

        return $result;
    }
}
