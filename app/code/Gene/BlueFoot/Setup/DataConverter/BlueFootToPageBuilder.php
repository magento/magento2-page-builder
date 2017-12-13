<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\DB\DataConverter\DataConverterInterface;
use Gene\BlueFoot\Setup\TreeConverter;

/**
 * Class BlueFootToPageBuilder
 *
 * Convert existing BlueFoot 1.0.* structures into Magento PageBuilder compatible HTML structures. This is ran on first
 * install of the new Page Builder module. It will leave any unsupported content in the tree allowing the
 * MixedToPageBuilder process this later on.
 *
 * @package Gene\BlueFoot\Setup\DataConverter
 */
class BlueFootToPageBuilder implements DataConverterInterface
{
    /**
     * @var TreeConverter
     */
    private $converter;

    /**
     * BlueFootToPageBuilder constructor.
     *
     * @param TreeConverter $converter
     */
    public function __construct(
        TreeConverter $converter
    ) {
        $this->converter = $converter;
    }

    /**
     * Convert from one format to another
     *
     * @param string $value
     * @return string
     */
    public function convert($value)
    {
        if (preg_match('/<!--GENE_BLUEFOOT="(.*)"-->/', $value, $matches)) {
            $structure = $matches[1];
            if ($this->isValidBlueFootValue($structure)) {
                return $this->converter->convert($structure);
            }
        }

        return $value;
    }

    /**
     * Is the value a valid BlueFoot 1.0 structure
     *
     * @param $value
     *
     * @return bool
     */
    protected function isValidBlueFootValue($value)
    {
        if ($this->isValidJsonValue($value)) {
            $json = json_decode($value, true);

            // Determine if the object has items and the first entry has a type of row
            return count($json) > 0 && isset(current($json)["type"]) && current($json)["type"] === "row";
        }

        return false;
    }

    /**
     * Is a valid JSON serialized value
     *
     * @param string $value
     * @return bool
     */
    protected function isValidJsonValue($value)
    {
        if (in_array($value, ['null', 'false', '0', '""', '[]'])
            || (json_decode($value) !== null && json_last_error() === JSON_ERROR_NONE)
        ) {
            return true;
        }
        //JSON last error reset
        json_encode([]);
        return false;
    }
}
