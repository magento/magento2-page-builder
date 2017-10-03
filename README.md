# BlueFoot Magento 2 module
The BlueFoot module provides drag & drop content building functionality to Magento 2. Originally produced by Gene Commerce and acquired at the start of 2017 by Magento.

### Development Installation

You will need to have Magento EE running alongside having this repository symlinked into your installation.

#### Installing Magento 2 EE

You need to run the following commands to install Magento EE:

- Clone the CE & EE repositories
- Run the `build-ee.php` script to create symlinks from the EE repository within the CE repository
- Copy over the EE composer.json file into the CE repository
- Remove the composer.lock file
- Install composer dependencies

```bash
git clone git@github.com:magento-obsessive-owls/magento2ce.git
git clone git@github.com:magento-obsessive-owls/magento2ee.git
php magento2ee/dev/tools/build-ee.php
cp magento2ee/composer.json magento2ce/
rm -rf magento2ce/composer.lock
cd magento2ce
composer install
```

You will then be working out of the `magento2ce` repository, this repository will be running EE code of the latest version available.

#### Installing BlueFoot

In the same directory you ran the above commands you will need to run the following:

```Bash
git clone git@github.com:magento-obsessive-owls/bluefoot.git
mkdir magento2ce/app/code/Gene/
cd magento2ce/app/code/Gene/
ln -s ../../../../bluefoot/app/code/Gene/BlueFoot/ BlueFoot
```

This will symlink the module within `bluefoot` folder to your EE.

#### Resolving Template Validation Issues

You need to replace the paths that the system tries to load template files from to stop Magento throwing an invalid path error for the EE & BlueFoot templates.

Open `magento2ce/lib/internal/Magento/Framework/Component/ComponentRegistrar.php` and modify the `render` function to replace the new paths with the `magento2ce` path like below.

```Php
    /**
     * Sets the location of a component.
     *
     * @param string $type component type
     * @param string $componentName Fully-qualified component name
     * @param string $path Absolute file path to the component
     * @throws \LogicException
     * @return void
     */
    public static function register($type, $componentName, $path)
    {
        $path = str_replace(['magento2ee', 'bluefoot'], 'magento2ce', $path);

        self::validateType($type);
        if (isset(self::$paths[$type][$componentName])) {
            throw new \LogicException(
                ucfirst($type) . ' \'' . $componentName . '\' from \'' . $path . '\' '
                . 'has been already defined in \'' . self::$paths[$type][$componentName] . '\'.'
            );
        } else {
            self::$paths[$type][$componentName] = str_replace('\\', '/', $path);
        }
    }
```

Note: the addition here is the `str_replace` which is converting the file paths to resolve always to the `magento2ce` directory.

```php
$path = str_replace(['magento2ee', 'bluefoot'], 'magento2ce', $path);
```

#### Run Setup

Finally you'll need to run the Magento 2 setup upgrade command to perform any migrations & installation scripts of the module.

```bash
bin/magento setup:upgrade
```

### Usage

BlueFoot appears in areas where the TinyMCE WYSWIYG was previously available. You can validate if BlueFoot is working by an additional button to `Activate Advanced CMS` being placed above the WYSIWYG instance. 