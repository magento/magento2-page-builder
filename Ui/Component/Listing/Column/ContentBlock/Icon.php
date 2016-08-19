<?php
namespace Gene\BlueFoot\Ui\Component\Listing\Column\ContentBlock;

/**
 * Class Icon
 * @package Gene\BlueFoot\Ui\Component\Listing\Column\ContentBlock
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class Icon extends \Magento\Ui\Component\Listing\Columns\Column
{
    /**
     * Convert icon value into HTML markup
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as & $item) {
                if (isset($item[$this->getData('name')])) {
                    $item[$this->getData('name')] = $this->getMarkup($item[$this->getData('name')]);
                }
            }
        }

        return $dataSource;
    }

    protected function getMarkup($value)
    {
        return '<i style="color:#444; font-size:24px;" class="' . $value . '"></i>';
    }
}
