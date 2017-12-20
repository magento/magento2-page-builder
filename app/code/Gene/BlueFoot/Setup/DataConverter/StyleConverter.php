<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

class StyleConverter
{
    /**
     * Convert a hex value into it's corresponding RGB values
     *
     * @param $hex
     *
     * @return string
     */
    public function convertHexToRgb($hex)
    {
        list($r, $g, $b) = sscanf(ltrim($hex, '#'), "%02x%02x%02x");
        return "rgb($r, $g, $b)";
    }
}
