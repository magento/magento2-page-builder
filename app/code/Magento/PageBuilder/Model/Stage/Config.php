<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\UrlInterface;
use Magento\Framework\AuthorizationInterface;
use Magento\Framework\Cache\FrontendInterface;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\PageBuilder\Model\Session\RandomKey;

/**
 * Provide configuration to the admin JavaScript app
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @SuppressWarnings(PHPMD.TooManyFields)
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

    const TEMPLATE_DELETE_RESOURCE = 'Magento_PageBuilder::template_delete';
    const TEMPLATE_SAVE_RESOURCE = 'Magento_PageBuilder::template_save';
    const TEMPLATE_APPLY_RESOURCE = 'Magento_PageBuilder::template_apply';

    private const CONTENT_TYPE_CACHE_ID = 'CONTENT_TYPE';
    private const TINY_MCE_CONFIG_CACHE_ID = 'TINY_MCE_CONFIG';
    private const WIDGET_BREAKPOINTS_CACHE_ID = 'WIDGET_BREAKPOINS';

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
     * @var AuthorizationInterface
     */
    private $authorization;

    /**
     * @var FrontendInterface
     */
    private $cache;

    /**
     * @var Json
     */
    private $serializer;

    /**
     * @var RandomKey
     */
    private $sessionRandomKey;

    /**
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
     * @param AuthorizationInterface|null $authorization
     * @param FrontendInterface|null $cache
     * @param Json|null $serializer
     * @param RandomKey|null $sessionRandomKey
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
        \Magento\Variable\Model\Variable\Config $variableConfig = null,
        AuthorizationInterface $authorization = null,
        FrontendInterface $cache = null,
        Json $serializer = null,
        ?RandomKey $sessionRandomKey = null
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
        $this->authorization = $authorization ?: ObjectManager::getInstance()->get(AuthorizationInterface::class);
        $this->serializer = $serializer ?: \Magento\Framework\App\ObjectManager::getInstance()->get(Json::class);
        $this->cache = $cache ?: \Magento\Framework\App\ObjectManager::getInstance()->get(FrontendInterface::class);
        $this->sessionRandomKey = $sessionRandomKey
            ?: \Magento\Framework\App\ObjectManager::getInstance()->get(RandomKey::class);
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
            'template_save_url' => $this->urlBuilder->getUrl('pagebuilder/template/save'),
            'column_grid_default' => $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_DEFAULT),
            'column_grid_max' => $this->scopeConfig->getValue(self::XML_PATH_COLUMN_GRID_MAX),
            'can_use_inline_editing_on_stage' => $this->isWysiwygProvisionedForEditingOnStage(),
            'widgets' => $this->widgetInitializerConfig->getConfig(),
            'breakpoints' => $this->getCachedWidgetBreakpoints(),
            'viewports' => $this->getViewports($this->getCachedWidgetBreakpoints()),
            'defaultViewport' => $this->getDefaultViewport($this->getCachedWidgetBreakpoints()),
            'tinymce' => $this->getCachedTinyMceConfig(),
            'acl' => $this->getAcl()
        ];
    }

    /**
     * Retrieve ACL values for Page Builder
     *
     * @return array
     */
    private function getAcl()
    {
        return [
            'template_save' => $this->authorization->isAllowed(self::TEMPLATE_SAVE_RESOURCE),
            'template_apply' => $this->authorization->isAllowed(self::TEMPLATE_APPLY_RESOURCE)
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
            $contentTypeData[$name] = $this->getCachedFlattenContentTypeData(
                $name,
                $contentType
            );
        }

        // The stage requires a root container to house it's children
        $contentTypeData[self::ROOT_CONTAINER_NAME] = $this->getCachedFlattenContentTypeData(
            self::ROOT_CONTAINER_NAME,
            $this->rootContainerConfig
        );

        return $contentTypeData;
    }

    /**
     * Get flatten content type for content name from cache and add it to cache if wasn't cached
     *
     * @param string $name
     * @param array $contentType
     *
     * @return array
     */
    private function getCachedFlattenContentTypeData(string $name, array $contentType)
    {
        $identifier = self::CONTENT_TYPE_CACHE_ID . '_' . $name;

        $flattenContentTypeData = $this->getCache($identifier);
        if (empty($flattenContentTypeData)) {
            $flattenContentTypeData = $this->flattenContentTypeData(
                $name,
                $contentType
            );
            $this->saveCache($flattenContentTypeData, $identifier);
        }

        return $flattenContentTypeData;
    }

    /**
     * Flatten the content type
     *
     * @param string $name
     * @param array $contentType
     *
     * @return array
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
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
            'breakpoints' => $contentType['breakpoints'] ?? [],
            'additional_data' => isset($contentType['additional_data'])
                ? $this->additionalDataParser->toArray($contentType['additional_data'])
                : [],
            'is_system' => isset($contentType['is_system']) && $contentType['is_system'] === 'false' ? false : true
        ];

        $result['breakpoints'] = array_merge_recursive(
            $result['breakpoints'],
            $this->getBreakpointsFields($result['breakpoints'], 'default')
        );

        foreach ($result['appearances'] as $key => $appearance) {
            if (isset($appearance['form'])) {
                $result['fields'][$key . '-appearance'] = $this->uiComponentConfig->getFields($appearance['form']);
            }
            if (isset($appearance['breakpoints'])) {
                $namespace = $key . '-appearance';
                if ($appearance['default']) {
                    $namespace = 'default';
                    foreach ($appearance['breakpoints'] as $name => $breakpoint) {
                        if (isset($breakpoint['form'])) {
                            $result['breakpoints'][$name]['form'] = $breakpoint['form'];
                        }
                    }
                }
                $result['breakpoints'] = array_replace_recursive(
                    $result['breakpoints'],
                    $this->getBreakpointsFields($appearance['breakpoints'], $namespace)
                );
            }
        }

        return $result;
    }

    /**
     * Get breakpoint fields.
     *
     * @param array $breakpoints
     * @param string $namespace
     * @return array
     */
    private function getBreakpointsFields(array $breakpoints, string $namespace): array
    {
        $result = [];
        foreach ($breakpoints as $key => $breakpoint) {
            if (isset($breakpoint['form'])) {
                $result[$key]['fields'][$namespace] = $this->uiComponentConfig->getFields($breakpoint['form'], $key);
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

    /**
     * Get the TINY MCE config from cache and add it to cache if it wasn't cached
     *
     * @return array
     */
    private function getCachedTinyMceConfig(): array
    {
        $configData = $this->getCache(self::TINY_MCE_CONFIG_CACHE_ID);
        if (empty($configData)) {
            $configData = $this->getTinyMceConfig();
            $this->saveCache($configData, self::TINY_MCE_CONFIG_CACHE_ID);
        }
        return $configData;
    }

    /**
     * Get widget breakpoints from cache and add it to cache if it wasn't cached
     *
     * @return array
     */
    private function getCachedWidgetBreakpoints(): array
    {
        $cache = $this->getCache(self::WIDGET_BREAKPOINTS_CACHE_ID);
        if (empty($cache)) {
            $cache = $this->widgetInitializerConfig->getBreakpoints();
            $this->saveCache($cache, self::WIDGET_BREAKPOINTS_CACHE_ID);
        }
        return $cache;
    }

    /**
     * Get configuration cache by identifier
     *
     * @param string $cacheIdentifier
     * @return array
     */
    private function getCache(string $cacheIdentifier): array
    {
        if ($this->urlBuilder->useSecretKey()) {
            $cacheIdentifier .= '_' . $this->sessionRandomKey->getValue();
        }
        $serializedData = $this->cache->load($cacheIdentifier);
        $cache = $serializedData
            ? $this->serializer->unserialize($serializedData)
            : [];

        return $cache;
    }

    /**
     * Save configuration cache for identifier
     *
     * @param array $data
     * @param string $cacheIdentifier
     */
    private function saveCache(array $data, string $cacheIdentifier): void
    {
        if ($this->urlBuilder->useSecretKey()) {
            $cacheIdentifier .= '_' . $this->sessionRandomKey->getValue();
        }
        $this->cache->save($this->serializer->serialize($data), $cacheIdentifier);
    }

    /**
     * Get viewports.
     *
     * @param array $breakpoints
     * @return array
     */
    private function getViewports(array $breakpoints): array
    {
        $viewports = [];

        foreach ($breakpoints as $name => $breakpoint) {
            if (isset($breakpoint['stage'])) {
                $viewports[$name] = $breakpoint;
            }
        }

        return $viewports;
    }

    /**
     * Get default viewport.
     *
     * @param array $breakpoints
     * @return string
     */
    private function getDefaultViewport(array $breakpoints): string
    {
        $keyIndex = array_search(true, array_column($breakpoints, 'default'));
        return $keyIndex === false ? '' : array_keys($breakpoints)[$keyIndex];
    }
}
