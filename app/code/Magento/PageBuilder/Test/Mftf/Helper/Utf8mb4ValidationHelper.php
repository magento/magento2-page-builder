<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Mftf\Helper;

use Magento\Framework\App\Bootstrap;
use Magento\Framework\ObjectManagerInterface;
use Magento\FunctionalTestingFramework\Helper\Helper;
use Magento\Ui\Model\ResourceModel\Utf8mb4SupportInterface;
use PHPUnit\Framework\SkippedWithMessageException;

class Utf8mb4ValidationHelper extends Helper
{
    /**
     * Skip the current test when the target storage is utf8mb4-safe.
     *
     * @param string $table
     * @param string $column
     * @return void
     */
    public function skipIfUtf8mb4Supported(string $table, string $column): void
    {
        if ($this->isColumnSupported($table, $column)) {
            throw new SkippedWithMessageException(
                sprintf(
                    'Skipping utf8mb3 rejection path because %s.%s is utf8mb4-safe.',
                    $table,
                    $column
                )
            );
        }
    }

    /**
     * Check whether the target storage can safely persist utf8mb4 characters.
     *
     * @param string $table
     * @param string $column
     * @return bool
     */
    private function isColumnSupported(string $table, string $column): bool
    {
        try {
            return $this->getObjectManager()
                ->get(Utf8mb4SupportInterface::class)
                ->isColumnSupported($table, $column);
        } catch (\Throwable $exception) {
            return false;
        }
    }

    /**
     * Get the real Magento object manager from the application bootstrap.
     *
     * @return ObjectManagerInterface
     */
    private function getObjectManager(): ObjectManagerInterface
    {
        static $objectManager;

        if (!$objectManager instanceof ObjectManagerInterface) {
            $rootPath = defined('BP') ? BP : $this->findMagentoRoot(__DIR__);

            if ($rootPath === null) {
                throw new \RuntimeException(
                    'Cannot locate Magento root directory from ' . __DIR__
                );
            }

            require_once $rootPath . '/app/bootstrap.php';

            $objectManager = Bootstrap::create($rootPath, $_SERVER)->getObjectManager();
        }

        return $objectManager;
    }

    /**
     * Walk up the directory tree to find the Magento root, the directory containing app/bootstrap.php
     *
     * @param string $startPath
     * @return string|null
     */
    private function findMagentoRoot(string $startPath): ?string
    {
        $path = $startPath;
        for ($i = 0; $i < 12; $i++) {
            if (file_exists($path . '/app/bootstrap.php')) {
                return $path;
            }
            $parent = dirname($path);
            if ($parent === $path) {
                return null;
            }
            $path = $parent;
        }
        return null;
    }
}
