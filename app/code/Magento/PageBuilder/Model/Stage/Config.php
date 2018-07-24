<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\UrlInterface;

/**
 * Class Config
 *
 * @api
 */
class Config
{
    const DEFAULT_PREVIEW_COMPONENT = 'Magento_PageBuilder/js/content-type/preview';
    const DEFAULT_MASTER_COMPONENT = 'Magento_PageBuilder/js/content-type/master';

    const XML_PATH_COLUMN_GRID_DEFAULT = 'cms/pagebuilder/column_grid_default';
    const XML_PATH_COLUMN_GRID_MAX = 'cms/pagebuilder/column_grid_max';

    /**
     * @var \Magento\PageBuilder\Model\ConfigInterface
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
     * @var \Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Parser
     */
    private $additionalDataParser;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var \Magento\Ui\Block\Wysiwyg\ActiveEditor
     */
    private $activeEditor;

    /**
     * @var \Magento\PageBuilder\Model\Wysiwyg\InlineEditing
     */
    private $inlineEditingChecker;

    /**
     * Config constructor.
     * @param \Magento\PageBuilder\Model\ConfigInterface $config
     * @param Config\UiComponentConfig $uiComponentConfig
     * @param UrlInterface $urlBuilder
     * @param \Magento\Framework\Url $frontendUrlBuilder
     * @param \Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Parser $additionalDataParser
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor
     * @param \Magento\PageBuilder\Model\Wysiwyg\InlineEditing $inlineEditingChecker
     * @param array $data
     */
    public function __construct(
        \Magento\PageBuilder\Model\ConfigInterface $config,
        Config\UiComponentConfig $uiComponentConfig,
        \Magento\Framework\UrlInterface $urlBuilder,
        \Magento\Framework\Url $frontendUrlBuilder,
        \Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Parser $additionalDataParser,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor,
        \Magento\PageBuilder\Model\Wysiwyg\InlineEditing $inlineEditingChecker,
        array $data = []
    ) {
        $this->config = $config;
        $this->uiComponentConfig = $uiComponentConfig;
        $this->urlBuilder = $urlBuilder;
        $this->frontendUrlBuilder = $frontendUrlBuilder;
        $this->additionalDataParser = $additionalDataParser;
        $this->scopeConfig = $scopeConfig;
        $this->activeEditor = $activeEditor;
        $this->inlineEditingChecker = $inlineEditingChecker;
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
            'preview_url' => $this->frontendUrlBuilder->getUrl('pagebuilder/contenttype/preview'),
            'column_grid_default' => $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_DEFAULT),
            'column_grid_max' => $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_MAX),
            'can_use_inline_editing_on_stage' => $this->isWysiwygProvisionedForEditingOnStage()
        ];
    }

    /**
     * Retrieve the content type groups
     *
     * @return array
     */
    private function getGroups()
    {
        return $this->config->getGroups();
    }

    /**
     * Build up the content type data
     *
     * @return array
     */
    private function getContentTypes()
    {
        $contentTypes = $this->config->getContentTypes();

        $contentTypeData = [];
        foreach ($contentTypes as $name => $contentType) {
            $contentTypeData[$name] = $this->flattenContentTypeData(
                $name,
                $contentType
            );
        }

        return $contentTypeData;
    }

    /**
     * Flatten the content type data
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
            'master_component' => (isset($contentType['master_component'])
                ? $contentType['master_component']
                : self::DEFAULT_MASTER_COMPONENT),
            'allowed_parents' => isset($contentType['allowed_parents']) ? $contentType['allowed_parents'] : [],
            'readers' => isset($contentType['readers']) ? $contentType['readers'] : [],
            'appearances' => isset($contentType['appearances']) ? $contentType['appearances'] : [],
            'additional_data' => isset($contentType['additional_data'])
                ? $this->additionalDataParser->toArray($contentType['additional_data'])
                : [],
            'data_mapping' => isset($contentType['data_mapping']) ? $contentType['data_mapping'] : [],
            'is_visible' => isset($contentType['is_visible']) && $contentType['is_visible'] === 'false' ? false : true
        ];
    }

    /**
     * Determine if active editor is configured to support inline editing mode
     *
     * @return bool
     */
    private function isWysiwygProvisionedForEditingOnStage()
    {
        $activeEditorPath = $this->activeEditor->getWysiwygAdapterPath();

        return $this->inlineEditingChecker->isAvailable($activeEditorPath);
    }
}
