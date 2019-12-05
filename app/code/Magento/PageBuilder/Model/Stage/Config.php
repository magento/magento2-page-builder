<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\UrlInterface;

/**
 * Provide configuration to the admin JavaScript app
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 *
 * @api
 */
class Config
{
    const DEFAULT_PREVIEW_COMPONENT = 'Magento_PageBuilder/js/content-type/preview';
    const DEFAULT_MASTER_COMPONENT = 'Magento_PageBuilder/js/content-type/master';

    const XML_PATH_COLUMN_GRID_DEFAULT = 'cms/pagebuilder/column_grid_default';
    const XML_PATH_COLUMN_GRID_MAX = 'cms/pagebuilder/column_grid_max';

    const ROOT_CONTAINER_NAME = 'root-container';

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
     * @var \Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList
     */
    private $inlineEditingChecker;

    /**
     * @var \Magento\PageBuilder\Model\WidgetInitializerConfig
     */
    private $widgetInitializerConfig;

    /**
     * @var array
     */
    private $rootContainerConfig;

    /**
     * @var \Magento\Widget\Model\Widget\Config
     */
    private $widgetConfig;

    /**
     * @var \Magento\Variable\Model\Variable\Config
     */
    private $variableConfig;

    /**
     * Config constructor.
     * @param \Magento\PageBuilder\Model\ConfigInterface $config
     * @param Config\UiComponentConfig $uiComponentConfig
     * @param UrlInterface $urlBuilder
     * @param \Magento\Framework\Url $frontendUrlBuilder
     * @param \Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Parser $additionalDataParser
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor
     * @param \Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList $inlineEditingChecker
     * @param \Magento\PageBuilder\Model\WidgetInitializerConfig $widgetInitializerConfig
     * @param array $rootContainerConfig
     * @param array $data
     * @param \Magento\Widget\Model\Widget\Config|null $widgetConfig
     * @param \Magento\Variable\Model\Variable\Config|null $variableConfig
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\PageBuilder\Model\ConfigInterface $config,
        Config\UiComponentConfig $uiComponentConfig,
        \Magento\Framework\UrlInterface $urlBuilder,
        \Magento\Framework\Url $frontendUrlBuilder,
        \Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Parser $additionalDataParser,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Ui\Block\Wysiwyg\ActiveEditor $activeEditor,
        \Magento\PageBuilder\Model\Wysiwyg\InlineEditingSupportedAdapterList $inlineEditingChecker,
        \Magento\PageBuilder\Model\WidgetInitializerConfig $widgetInitializerConfig,
        array $rootContainerConfig = [],
        array $data = [],
        \Magento\Widget\Model\Widget\Config $widgetConfig = null,
        \Magento\Variable\Model\Variable\Config $variableConfig = null
    ) {
        $this->config = $config;
        $this->uiComponentConfig = $uiComponentConfig;
        $this->urlBuilder = $urlBuilder;
        $this->frontendUrlBuilder = $frontendUrlBuilder;
        $this->additionalDataParser = $additionalDataParser;
        $this->scopeConfig = $scopeConfig;
        $this->activeEditor = $activeEditor;
        $this->inlineEditingChecker = $inlineEditingChecker;
        $this->widgetInitializerConfig = $widgetInitializerConfig;
        $this->rootContainerConfig = $rootContainerConfig;
        $this->data = $data;
        $this->widgetConfig = $widgetConfig ?? \Magento\Framework\App\ObjectManager::getInstance()
                ->get(\Magento\Widget\Model\Widget\Config::class);
        $this->variableConfig = $variableConfig ?? \Magento\Framework\App\ObjectManager::getInstance()
                ->get(\Magento\Variable\Model\Variable\Config::class);
    }

    /**
     * Return the config for the page builder instance
     *
     * @return array
     */
    public function getConfig()
    {
        return [
            'menu_sections' => $this->getMenuSections(),
            'content_types' => $this->getContentTypes(),
            'stage_config' => $this->data,
            'media_url' => $this->urlBuilder->getBaseUrl(['_type' => UrlInterface::URL_TYPE_MEDIA]),
            'preview_url' => $this->urlBuilder->getUrl('pagebuilder/stage/preview'),
            'render_url' => $this->urlBuilder->getUrl('pagebuilder/stage/render'),
            'column_grid_default' => $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_DEFAULT),
            'column_grid_max' => $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_MAX),
            'can_use_inline_editing_on_stage' => $this->isWysiwygProvisionedForEditingOnStage(),
            'widgets' => $this->widgetInitializerConfig->getConfig(),
            'breakpoints' => $this->widgetInitializerConfig->getBreakpoints(),
            'tinymce' => $this->getTinyMceConfig(),
        ];
    }

    /**
     * Retrieve the TinyMCE required configuration
     *
     * @return array
     */
    private function getTinyMceConfig()
    {
        $config = [
            'widgets' => [],
            'variables' => []
        ];

        // Retrieve widget configuration
        $widgetConfig = $this->widgetConfig->getConfig(new \Magento\Framework\DataObject());
        $options = $widgetConfig->getData('plugins');
        if (isset($options[0]) && $options[0]['name'] === 'magentowidget') {
            $config['widgets'] = $options[0]['options'];
        }

        // Retrieve variable configuration
        $variableConfig = $this->variableConfig->getWysiwygPluginSettings(new \Magento\Framework\DataObject());
        if (isset($variableConfig['plugins']) && isset($variableConfig['plugins'][0])
            && $variableConfig['plugins'][0]['name'] === 'magentovariable'
        ) {
            $config['variables'] = $variableConfig['plugins'][0]['options'];
        }

        return $config;
    }

    /**
     * Retrieve the content type menu sections
     *
     * @return array
     */
    private function getMenuSections()
    {
        return $this->config->getMenuSections();
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

        // The stage requires a root container to house it's children
        $contentTypeData[self::ROOT_CONTAINER_NAME] = $this->flattenContentTypeData(
            self::ROOT_CONTAINER_NAME,
            $this->rootContainerConfig
        );

        return $contentTypeData;
    }

    /**
     * Flatten the content type
     *
     * @param string $name
     * @param array $contentType
     *
     * @return array
     */
    private function flattenContentTypeData(string $name, array $contentType)
    {
        $result = [
            'name' => $name,
            'label' => $contentType['label'],
            'icon' => isset($contentType['icon']) ? $contentType['icon'] : '',
            'form' => isset($contentType['form']) ? $contentType['form'] : '',
            'menu_section' => $contentType['menu_section'] ?? 'general',
            'fields' => isset($contentType['form'])
                ? ['default' => $this->uiComponentConfig->getFields($contentType['form'])]
                : [],
            'component' => $contentType['component'],
            'preview_component' => $contentType['preview_component'] ?? self::DEFAULT_PREVIEW_COMPONENT,
            'master_component' => $contentType['master_component'] ?? self::DEFAULT_MASTER_COMPONENT,
            'allowed_parents' => $contentType['allowed_parents'] ?? [],
            'appearances' => $contentType['appearances'] ?? [],
            'additional_data' => isset($contentType['additional_data'])
                ? $this->additionalDataParser->toArray($contentType['additional_data'])
                : [],
            'is_system' => isset($contentType['is_system']) && $contentType['is_system'] === 'false' ? false : true
        ];

        foreach ($result['appearances'] as $key => $appearance) {
            if (isset($appearance['form'])) {
                $result['fields'][$key . '-appearance'] = $this->uiComponentConfig->getFields($appearance['form']);
            }
        }

        return $result;
    }

    /**
     * Determine if active editor is configured to support inline editing mode
     *
     * @return bool
     */
    private function isWysiwygProvisionedForEditingOnStage()
    {
        $activeEditorPath = $this->activeEditor->getWysiwygAdapterPath();

        return $this->inlineEditingChecker->isSupported($activeEditorPath);
    }
}
