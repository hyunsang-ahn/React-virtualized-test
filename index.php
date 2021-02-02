<?php

// file formatting by simje 180503

$_SERVER ['DOCUMENT_ROOT'] = dirname ( __FILE__ );

if (file_exists ( "DEBUG" )) {
    ini_set ( 'display_errors', 1 );
    ini_set ( 'display_startup_errors', 1 );
    error_reporting ( E_ALL );
} else {
    ini_set ( 'display_errors', 0 );
    error_reporting ( E_ALL & ~ E_NOTICE );
}

include_once $_SERVER ['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR. "lib".DIRECTORY_SEPARATOR."classes".DIRECTORY_SEPARATOR."Log.php";
// 로그 위치 버그 수정 simje 20 10 23
$log = Log::singleton ( 'hybrid', DIRECTORY_SEPARATOR.'developer_log'.DIRECTORY_SEPARATOR, 'ec2-user',
    $_SERVER ['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."logs" );
    // $_SERVER ['DOCUMENT_ROOT'] .DIRECTORY_SEPARATOR."logs" );

if (isset ( $_SERVER ['HTTPS'] ) && $_SERVER ['HTTPS'] == 'on')
    $https = true;
else
    $https = false;

$log->info ( "========== start " . ($https ? 'https ' : 'http ') . basename ( __FILE__ ) );

$page = isset ( $_GET ['fhc_page'] ) ? $_GET ['fhc_page'] : 'index';

// get app_mal_ver from URI by ksson 180918
$app_mall_ver = empty($_REQUEST['appver']) ? '' : $_REQUEST['appver'];
$log->info("app mall ver=$app_mall_ver");

$path = $_SERVER ['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR. "app" . DIRECTORY_SEPARATOR . "controllers" .DIRECTORY_SEPARATOR;
$viewpath_default = $page . ".html";

$job = $path . $page . ".php";
if (! is_file ( $job )) {
    if (is_dir ( $path . $page )) {
        $job = $path . $page . DIRECTORY_SEPARATOR."index.php";
        $viewpath_default = $page . DIRECTORY_SEPARATOR."index.html";
    }
}

if (! preg_match ( "/^" . preg_quote ( $path, '/' ) . "/", realpath ( $job ) ))
    exit ();

$res = Array ();

// Preload from defined
$preload_list = array (
        "lib".DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR."config.php",
        "lib".DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR."class_loader.php",
        "lib".DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR."core.php"
);
foreach ( $preload_list as $filename ) {
    include ($filename);
}

foreach ( glob ( "lib".DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR."*.php") as $filename ) {
    if (in_array ( $filename, $preload_list ))
        continue;
    include ($filename);
}

include $job;

if (! defined ( "__RENDERED__" )) {
    render ( $viewpath_default );
}

define ( "__FHC_END__", true );
