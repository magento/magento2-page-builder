<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Processor\PreProcessor\Less;

use Magento\Deploy\Package\Package;
use Magento\Deploy\Package\Processor\ProcessorInterface;
use Magento\Deploy\Service\DeployStaticFile;
use Magento\Framework\View\Asset\PreProcessor\FileNameResolver;
use Magento\Framework\App\Cache\Type\Layout;

/**
 * Retrieve @screen__m from the LESS files for usage within Page Builder's responsive images
 */
class MobileBreakpoint implements ProcessorInterface
{
    const MOBILE_BREAKPOINT_CACHE_KEY = 'less_screen_m_cache_key';

    /**
     * @var FileNameResolver
     */
    private $fileNameResolver;

    /**
     * @var DeployStaticFile
     */
    private $deployStaticFile;

    /**
     * @var Layout
     */
    private $layoutCache;

    /**
     * MobileBreakpoint constructor.
     *
     * @param FileNameResolver $fileNameResolver
     * @param DeployStaticFile $deployStaticFile
     * @param Layout $layoutCache
     */
    public function __construct(
        FileNameResolver $fileNameResolver,
        DeployStaticFile $deployStaticFile,
        Layout $layoutCache
    ) {
        $this->fileNameResolver = $fileNameResolver;
        $this->deployStaticFile = $deployStaticFile;
        $this->layoutCache = $layoutCache;
    }

    /**
     * @inheritdoc
     */
    public function process(Package $package, array $options)
    {
        // TODO: this only seems to read the base theme?
        $files = $package->getParentFiles('less');
        foreach ($files as $file) {
            $content = $this->deployStaticFile->readTmpFile($file->getFilePath(), $file->getPackage()->getPath());
            if ($content) {
                // Match the layout max width variable from the LESS files
                preg_match("/@screen-m:\s*(\d+)px;/", $content, $matches);
                var_dump($matches);
                if (count($matches) == 2) {
                    var_dump($matches);
                    exit;
                    // TODO: storing in the cache causes issues if the admin / user does a cache clear without
                    // re-deploying stat assets
                    $this->layoutCache->save(
                        $matches[1],
                        self::MOBILE_BREAKPOINT_CACHE_KEY
                    );
                }
            }
        }
        return true;
    }
}
