<?php

namespace Gene\BlueFoot\Helper\Widget;

/**
 * Class Video
 *
 * @package Gene\BlueFoot\Helper\Widget
 *
 * @author Chloe Langford <chloe@gene.co.uk>
 */
class Video extends \Magento\Framework\App\Helper\AbstractHelper
{
    /**
     * Return the upload directory
     *
     * @param $url
     * @return bool|string
     */
    public function previewAction($url)
    {
        // Detect if url is youtube or Vimeo and return correct url
        // @todo build in better video detection, refactor as this not efficient
        // @codingStandardsIgnoreStart
        if (preg_match('#^(?:https?://|//)?(?:www\.|m\.)?(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=|watch\?.+&v=))([\w-]{11})(?![\w-])#', $url, $id)) {
            if (count($id)) {
                return 'https://www.youtube.com/embed/' . $id[1];
            }
        } elseif (preg_match("/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/", $url, $id)) {
            if (count($id)) {
                return 'https://player.vimeo.com/video/' . $id[3] . '?title=0&byline=0&portrait=0';
            }
        }
        // @codingStandardsIgnoreEnd

        return false;
    }
}
