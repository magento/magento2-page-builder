# Responsive layouts

<!-- {% raw %} -->

## What's in this topic

This topic describes how to use your custom themes to control responsive layouts within Page Builder.

## Responsive Mobile Images

By default, when you configure Page Builder to render a background image for a container, it uses a mobile image when the container's width is less than the industry-standard max-width of 768px. This width is configured within `Magento_PageBuilder/etc/view.xml`, as follows:

```xml
<vars module="Magento_PageBuilder">
    <var name="breakpoints">
        <var name="mobile">
            <var name="conditions">
                <var name="max-width">768px</var>
            </var>
        </var>
    </var>
</vars>
```

If your custom theme also uses this max-width breakpoint for your mobile layout, no additional configuration is required.

However, if your custom theme uses a different mobile breakpoint, you'll need to add that breakpoint (in pixels) to your theme's `view.xml` by including the following XML within the `<view />` node, and replacing `CUSTOM-BREAKPOINT` with the integer value of your theme's breakpoint, as follows:

```xml
<vars module="Magento_PageBuilder">
    <var name="breakpoints">
        <var name="mobile">
            <var name="conditions">
                <var name="max-width">CUSTOM-BREAKPOINTpx</var>
            </var>
        </var>
    </var>
</vars>
```

This directs Page Builder to use your theme's mobile breakpoint instead of its default breakpoint of 768px. Other responsive breakpoints from your custom theme can be added in the same way.

[Note: I think it might be nice to include another example or two of configuring other breakpoints (or other styles?) from custom themes as relevant.]

<!-- {% endraw %} -->