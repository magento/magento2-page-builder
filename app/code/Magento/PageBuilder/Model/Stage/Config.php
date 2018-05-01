<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\UrlInterface;

class Config
{
    const DEFAULT_PREVIEW_COMPONENT = 'Magento_PageBuilder/js/preview';
    const DEFAULT_CONTENT_COMPONENT = 'Magento_PageBuilder/js/content';

    /**
     * @var \Magento\PageBuilder\Model\Config\ConfigInterface
     */
    private $config;

    /**
     * @var Config\UiComponentConfig
     */
    private $uiComponentConfig;

    /**
     * @var array
     */
    private $data;

    /**
     * @var UrlInterface
     */
    private $urlBuilder;

    /**
     * @var \Magento\Framework\Url
     */
    private $frontendUrlBuilder;

    /**
     * Constructor
     *
     * @param \Magento\PageBuilder\Model\Config\ConfigInterface $config
     * @param Config\UiComponentConfig $uiComponentConfig
     * @param \Magento\Framework\UrlInterface $urlBuilder
     * @param \Magento\Framework\Url $frontendUrlBuilder
     * @param array $data
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\ConfigInterface $config,
        Config\UiComponentConfig $uiComponentConfig,
        \Magento\Framework\UrlInterface $urlBuilder,
        \Magento\Framework\Url $frontendUrlBuilder,
        array $data = []
    ) {
        $this->config = $config;
        $this->uiComponentConfig = $uiComponentConfig;
        $this->urlBuilder = $urlBuilder;
        $this->frontendUrlBuilder = $frontendUrlBuilder;
        $this->data = $data;
    }

    /**
     * Return the config for the page builder instance
     *
     * @return array
     */
    public function getConfig()
    {
        return [
            'groups' => $this->getGroups(),
            'content_types' => $this->getContentTypes(),
            'stage_config' => $this->data,
            'media_url' => $this->urlBuilder->getBaseUrl(['_type' => UrlInterface::URL_TYPE_MEDIA]),
            'preview_url' => $this->frontendUrlBuilder->getUrl('pagebuilder/contenttype/preview')
        ];
    }

    /**
     * Retrieve the content block groups
     *
     * @return array
     */
    private function getGroups()
    {
        return $this->config->getGroups();
    }

    /**
     * Build up the content block data
     *
     * @return array
     */
    private function getContentTypes()
    {
        $contentTypes = $this->config->getContentTypes();

        $contentBlockData = [];
        foreach ($contentTypes as $name => $contentType) {
            $contentBlockData[$name] = $this->flattenContentTypeData(
                $name,
                $contentType
            );
        }

        return $contentBlockData;
    }

    /**
     * Flatten the content block data
     *
     * @param $name
     * @param $contentType
     *
     * @return array
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    private function flattenContentTypeData($name, $contentType)
    {
        return [
            'name' => $name,
            'label' => $contentType['label'],
            'icon' => $contentType['icon'],
            'form' => $contentType['form'],
            'contentType' => '',
            'group' => (isset($contentType['group'])
                ? $contentType['group'] : 'general'),
            'fields' => $this->uiComponentConfig->getFields($contentType['form']),
            'preview_template' => (isset($contentType['preview_template'])
                ? $contentType['preview_template'] : ''),
            'render_template' => (isset($contentType['render_template'])
                ? $contentType['render_template'] : ''),
            'component' => $contentType['component'],
            'preview_component' => (isset($contentType['preview_component'])
                ? $contentType['preview_component']
                : self::DEFAULT_PREVIEW_COMPONENT),
            'content_component' => (isset($contentType['content_component'])
                ? $contentType['content_component']
                : self::DEFAULT_CONTENT_COMPONENT),
            'allowed_parents' => isset($contentType['allowed_parents']) ? $contentType['allowed_parents'] : [],
            'readers' => isset($contentType['readers']) ? $contentType['readers'] : [],
            'appearances' => isset($contentType['appearances']) ? $contentType['appearances'] : [],
            'additional_data' => isset($contentType['additional_data']) ? $contentType['additional_data'] : [],
            'data_mapping' => isset($contentType['data_mapping']) ? $contentType['data_mapping'] : [],
            'is_visible' => isset($contentType['is_visible']) && $contentType['is_visible'] === 'false' ? false : true
        ];
    }
}
