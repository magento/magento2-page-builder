<?php

namespace Gene\BlueFoot\Model\Stage;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Save
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\ParserFactory
     */
    protected $parserFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Save\Renderer
     */
    protected $rendererFactory;

    /**
     * Save constructor.
     *
     * @param \Gene\BlueFoot\Model\Stage\Save\ParserFactory   $parserFactory
     * @param \Gene\BlueFoot\Model\Stage\Save\RendererFactory $rendererFactory
     */
    public function __construct(
        Save\ParserFactory $parserFactory,
        Save\RendererFactory $rendererFactory
    ) {
        $this->parserFactory = $parserFactory;
        $this->rendererFactory = $rendererFactory;
    }

    /**
     * Process an objects fields to save and render their content
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @param array                                  $fields
     */
    public function processObject(\Magento\Framework\Model\AbstractModel $object, array $fields)
    {
        foreach ($fields as $field) {
            if ($html = $object->getData($field)) {
                // @todo determine which store ID should be retrieved from CMS pages
                $processedOutput = $this->processHtml($html, 0, $object);
                if ($processedOutput) {
                    $object->setData($field, $processedOutput);
                }
            }
        }
    }

    /**
     * Process HTML through the parser and renderer
     *
     * @param      $html
     * @param int  $storeId
     * @param bool $object Used for contextual awareness in rendering
     *
     * @return bool|string
     */
    public function processHtml($html, $storeId = 0, $object = false)
    {
        // Parser turns the HTML string into nested Parser\Element's
        $parser = $this->parserFactory->create([
            'html' => $html
        ]);

//        if ($parser->hasStage()) {
//            /* @var $stageElement \Gene\BlueFoot\Model\Stage\Save\Parser\Element */
//            $stageElement = $parser->parse();
//
//            // Render the stage element as HTML
//            return $this->rendererFactory->create([
//                'storeId' => $storeId,
//                'object' => $object /* Object passed for contextual rendering */
//            ])->render(
//                $stageElement,
//                true
//            );
//        }

        return false;
    }
}
