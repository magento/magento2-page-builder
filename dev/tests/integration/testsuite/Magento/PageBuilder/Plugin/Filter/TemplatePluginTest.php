<?php
/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Filter;

use Magento\Framework\App\Area;
use Magento\Framework\Filter\Template as FrameworkTemplateFilter;
use Magento\Store\Model\Store;
use Magento\TestFramework\Fixture\AppArea;
use Magento\TestFramework\Fixture\DataFixture;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\Widget\Model\Template\Filter as WidgetTemplateFilter;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

#[
    CoversClass(TemplatePlugin::class),
    DataFixture('Magento/PageBuilder/_files/custom_variable_xss.php'),
]
class TemplatePluginTest extends TestCase
{
    /**
     * @param string $preFiltered
     * @param string $postFiltered
     * @param string $preFilteredBasename
     */
    #[
        AppArea(Area::AREA_GLOBAL),
        DataProvider('filterDataProvider'),
    ]
    public function testFilter(string $preFiltered, string $postFiltered, string $preFilteredBasename): void
    {
        $templateFilter = Bootstrap::getObjectManager()->create(FrameworkTemplateFilter::class);
        $filtered = $templateFilter->filter($preFiltered);
        $this->assertEquals(
            $this->formatHtml($postFiltered),
            $this->formatHtml($filtered),
            "Failed asserting that two strings are equal after filtering $preFilteredBasename"
        );
    }

    /**
     * @param string $preFiltered
     * @param string $postFiltered
     * @param string $preFilteredBasename
     */
    #[
        AppArea(Area::AREA_FRONTEND),
        DataProvider('filterFrontendDataProvider'),
    ]
    public function testFilterFrontend(string $preFiltered, string $postFiltered, string $preFilteredBasename): void
    {
        $templateFilter = Bootstrap::getObjectManager()->create(WidgetTemplateFilter::class);
        // set store id to 0 to recognize that escaping is required in custom variable
        $templateFilter->setStoreId(Store::DEFAULT_STORE_ID);
        $filtered = $templateFilter->filter($preFiltered);
        $this->assertEquals(
            $this->formatHtml($postFiltered),
            $this->formatHtml($filtered),
            "Failed asserting that two strings are equal after filtering $preFilteredBasename"
        );
    }

    /**
     * @param array $preFilteredFiles
     * @return array[]
     */
    private static function loadFiles(array $preFilteredFiles): array
    {
        $dataProviderArgs = [];
        foreach ($preFilteredFiles as $preFilteredFile) {
            $preFilteredBasename = basename($preFilteredFile);
            $postFilteredBasename = str_replace('pre_filter', 'post_filter', $preFilteredBasename);
            $postFilteredFile = pathinfo($preFilteredFile, PATHINFO_DIRNAME) . '/' . $postFilteredBasename;

            $dataProviderArgs[] = [
                file_get_contents($preFilteredFile),
                file_get_contents($postFilteredFile),
                $preFilteredBasename
            ];
        }

        return $dataProviderArgs;
    }

    /**
     * @return array
     */
    public static function filterDataProvider(): array
    {
        $preFilteredFiles = glob(__DIR__ . '/../../_files/template_plugin/*pre_filter*');
        $dataProviderArgs = self::loadFiles($preFilteredFiles);

        return $dataProviderArgs;
    }

    /**
     * @return array
     */
    public static function filterFrontendDataProvider(): array
    {
        $dataProviderArgs = self::filterDataProvider();
        $preFilteredFiles = glob(__DIR__ . '/../../_files/template_plugin/frontend/*pre_filter*');
        $dataProviderArgs = array_merge($dataProviderArgs, self::loadFiles($preFilteredFiles));

        return $dataProviderArgs;
    }

    /**
     * Strip whitespace from the HTML to conduct a fairer comparison
     *
     * @param string $html
     * @return string
     */
    private function formatHtml(string $html): string
    {
        return preg_replace('/(?<=>)\s+|\s+(?=<)/m', '', $html);
    }
}
