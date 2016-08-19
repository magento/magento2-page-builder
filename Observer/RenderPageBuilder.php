<?php

namespace Gene\BlueFoot\Observer;

use Magento\Framework\Event\ObserverInterface;

/**
 * Class SavePageBuilder
 *
 * @package Gene\BlueFoot\Observer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class RenderPageBuilder implements ObserverInterface
{
    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $urlBuilder;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Render
     */
    protected $stageRender;

    /**
     * RenderPageBuilder constructor.
     *
     * @param \Magento\Framework\UrlInterface   $urlInterface
     * @param \Gene\BlueFoot\Model\Stage\Render $stageRender
     */
    public function __construct(
        \Magento\Framework\UrlInterface $urlInterface,
        \Gene\BlueFoot\Model\Stage\Render $stageRender
    ) {
        $this->urlBuilder = $urlInterface;
        $this->stageRender = $stageRender;
    }

    /**
     * Add in extra information to the config
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @return $this
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $response = $observer->getEvent()->getResponse();

        // Retrieve the HTML
        $html = $response->getBody();

        // Check we have some HTML's
        if (!empty($html)) {
            // Do a very quick strpos to see if the html contains page builder mark up
            if (strpos($html, \Gene\BlueFoot\Model\Stage\Save::BLUEFOOT_STRING) !== false) {
                // Render the page
                $renderedPage = $this->stageRender->render($html);

                // Set the body
                if ($renderedPage) {
                    $response->setBody($renderedPage);
                }
            }
        }

        return $this;
    }
}
