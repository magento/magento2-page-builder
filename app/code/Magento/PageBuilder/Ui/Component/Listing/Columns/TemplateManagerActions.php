<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\Component\Listing\Columns;

use Magento\Framework\Escaper;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Ui\Component\Listing\Columns\Column;

/**
 * Class TemplateManagerActions
 */
class TemplateManagerActions extends Column
{
    /**
     * @var Escaper
     */
    private $escaper;

    /**
     * @var UrlInterface
     */
    private $urlBuilder;

    /**
     * @param ContextInterface $context
     * @param UiComponentFactory $uiComponentFactory
     * @param Escaper $escaper
     * @param UrlInterface $urlBuilder
     * @param array $components
     * @param array $data
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        Escaper $escaper,
        UrlInterface $urlBuilder,
        array $components = [],
        array $data = []
    ) {
        $this->escaper = $escaper;
        $this->urlBuilder = $urlBuilder;
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * @inheritDoc
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as & $item) {
                $name = $this->getData('name');
                $indexField = $this->getData('config/indexField') ?: 'template_id';
                if (isset($item[$indexField])) {
                    $templateName = $this->escaper->escapeHtml($item['name']);
                    $item[$name]['delete'] = [
                        'label' => __('Delete'),
                        'href' => $this->urlBuilder->getUrl(
                            'pagebuilder/template/delete',
                            [
                                'template_id' => $item[$indexField],
                            ]
                        ),
                        'confirm' => [
                            'title' => __('Delete %1?', $templateName),
                            'message' => __('Are you sure you want to permanently delete template %1?', $templateName),
                            '__disableTmpl' => true,
                        ],
                        '__disableTmpl' => true,
                    ];
                }
            }
        }

        return $dataSource;
    }
}
