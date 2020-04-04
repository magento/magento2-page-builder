<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Test\Mftf\Helper;

use Magento\FunctionalTestingFramework\Helper\Helper;

/**
 * Class SelectText provides an ability to select needed text.
 */
class SelectText extends Helper
{
    /**
     * Select needed text.
     *
     * @param string $context
     * @param int $startX
     * @param int $startY
     * @param int $endX
     * @param int $endY
     * @return void
     */
    public function selectText(string $context, int $startX, int $startY, int $endX, int $endY)
    {
        try {
            /** @var \Magento\FunctionalTestingFramework\Module\MagentoWebDriver $webDriver */
            $webDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');

            $contextElement = $webDriver->webDriver->findElement(\Facebook\WebDriver\WebDriverBy::xpath($context));
            $actions = new \Facebook\WebDriver\Interactions\WebDriverActions($webDriver->webDriver);
            $actions->moveToElement($contextElement, $startX, $startY)
                ->clickAndHold()
                ->moveToElement($contextElement, $endX, $endY)
                ->release()
                ->perform();
        } catch (\Exception $e) {
            $this->fail($e->getMessage());
        }
    }

    /**
     * Select needed text between 2 context elements.
     *
     * @param string $firstContext
     * @param string $secondContext
     * @param int $startX
     * @param int $startY
     * @param int $endX
     * @param int $endY
     * @return void
     */
    public function selectHeadingTextAndVariableTinyMCE(
        string $firstContext,
        string $secondContext,
        int $startX,
        int $startY,
        int $endX,
        int $endY
    ) {
        try {
            /** @var \Magento\FunctionalTestingFramework\Module\MagentoWebDriver $webDriver */
            $webDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');

            $heading = $webDriver->webDriver->findElement(\Facebook\WebDriver\WebDriverBy::xpath($firstContext));
            $text = $webDriver->webDriver->findElement(\Facebook\WebDriver\WebDriverBy::xpath($secondContext));
            $actions = new \Facebook\WebDriver\Interactions\WebDriverActions($webDriver->webDriver);
            $actions->moveToElement($heading, $startX, $startY)
                ->clickAndHold()
                ->moveToElement($text, $endX, $endY)
                ->release()
                ->perform();
        } catch (\Exception $e) {
            $this->fail($e->getMessage());
        }
    }
}
