<?php

namespace Gene\BlueFoot\Helper\Widget;

/**
 * Class Video
 *
 * @package Gene\BlueFoot\Helper\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
        if (preg_match('#^(?:https?://|//)?(?:www\.|m\.)?(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=|watch\?.+&v=))([\w-]{11})(?![\w-])#', $url, $id)) {
            if (count($id)) {
                return 'https://www.youtube.com/embed/' . $id[1];
            }
        } else if (preg_match("/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/", $url, $id)) {
            if (count($id)) {
                return 'https://player.vimeo.com/video/' . $id[3] . '?title=0&byline=0&portrait=0';
            }
        }

        return false;
    }
}