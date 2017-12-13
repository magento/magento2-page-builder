<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
 * Class BlueFootToPageBuilder
 *
 * Convert mixed BlueFoot & PageBuilder content to Magento PageBuilder compatible HTML structures, this should be
 * utilised for 3rd party extensions outside of core that previously extended BlueFoot's functionality.
 *
 * @package Gene\BlueFoot\Setup\DataConverter
 */
class MixedToPageBuilder implements DataConverterInterface
{
    /**
     * Convert from one format to another
     *
     * @param string $value
     * @return string
     */
    public function convert($value)
    {
        return $value;
    }
}
