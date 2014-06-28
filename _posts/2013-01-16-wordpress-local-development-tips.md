---
layout: post
title: Wordpress local development tips
category: blog
excerpt: Some of the configuration options I use in a development environment
---

Track Trunk
-----------

Always develop using an up-to-date version of Wordpress - use SVN to perform updates, and track trunk if you can (so you can see developments to the codebase before they make it into general releases, and test against them).

[Installing/Updating Wordpress using Subversion](http://codex.wordpress.org/Installing/Updating_WordPress_with_Subversion)

Enable Filesystem upgrades
--------------------------

By default, Wordpress performs updates using FTP credentials - put this into your wp-config.php to enable direct writes to the filesystem:


	define('FS_METHOD', 'direct');
	define('FS_CHMOD_DIR', (0755 &amp; ~ umask()));
	define('FS_CHMOD_FILE', (0644 &amp; ~ umask()));


You can also set upgrade constants on production servers to prevent Wordpress asking for your FTP credentials whenever you need to perform an upgrade:

[Editing wp-config.php](http://codex.wordpress.org/Editing_wp-config.php#WordPress_Upgrade_Constants)

Show Errors
-----------

Add the following to .htaccess

	php_flag display_startup_errors on
	php_flag display_errors on
	php_flag html_errors on
	php_flag log_errors on
	php_flag ignore_repeated_errors off
	php_flag ignore_repeated_source off
	php_flag report_memleaks on
	php_flag track_errors on
	php_value docref_root 0
	php_value docref_ext 0
	php_value error_reporting -1
	php_value log_errors_max_len 0

You could also enable logging to a file - more details here (as well as an example of an .htaccess file for production environments)

[Advanced PHP Error Handling via htaccess](<a href="http://perishablepress.com/advanced-php-error-handling-via-htaccess)

Wordpress also has some debugging features which can be enabled using a plugin or by adding the following to wp-config.php

	define('WP_DEBUG', true);

[Debugging in Wordpress](http://codex.wordpress.org/Debugging_in_WordPress)