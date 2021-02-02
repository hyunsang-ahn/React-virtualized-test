<?php
$GLOBALS ['provider'] = 'wincube';
$GLOBALS ['codeset'] = 'UTF8';
$GLOBALS ['tdomain'] = 'mall';
$GLOBALS ['hostname'] = php_uname ( 'n' );

/*
$GLOBALS['db_config_path'] = "/etc/cashcow.conf";

// mall 의 hostname 을 가져온다. by ksson 2017 05 12
if (empty ( $_SERVER ['HTTP_HOST'] )) {
    $mall_hostname = php_uname ( 'n' );
} else {
    $mall_hostname = $_SERVER ['HTTP_HOST'];
}

if (strstr ( $mall_hostname, "ip-" )) {
    $mall_hostname = file_get_contents ( 'http://169.254.169.254/latest/meta-data/public-hostname' );
}

$GLOBALS['db_config_path'] = "/etc/cashcow.conf";

// $mc_host 를 설정한다. by ksson 2017 05 12
if (strstr ( $mall_hostname, "cashcow.id" ) || strstr ( $mall_hostname, "cashcow.co.id" )) {
    $log->debug ( "CASE: cashcow.id" );
    // $mc_host = "memcache-sing.dr7pan.cfg.apse1.cache.amazonaws.com";
} else if ($mall_hostname == "mall.cash-cow.co.kr") {
    $log->debug ( "CASE: mall.cash-cow.co.kr" );
    // $mc_host = "memcache-tokyo.h6jcgm.cfg.apne1.cache.amazonaws.com";
    $redis_host = "tokyo-redis-stat.h6jcgm.clustercfg.apne1.cache.amazonaws.com";
    $redis_port = 6379;
    $redis_database = 0;
} else if (strstr ( $mall_hostname,"devmall") && strstr ( $mall_hostname,"cash-cow.co.kr")) {
    // devmall.(XXX.)cash-cow.co.kr 계열 호스트 대응
    // $log->debug ( "CASE: others" );
    // $mc_host = "127.0.0.1";
    $redis_host = "192.168.0.249";
    $redis_port = 6379;
    $redis_database = 0;
}
else {
    // 로컬 Windows PC 대응
    // $mc_host = "dev.enbsoft.com";
    $GLOBALS['db_config_path'] = $_SERVER ['DOCUMENT_ROOT'].DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR
        ."..".DIRECTORY_SEPARATOR
        ."etc".DIRECTORY_SEPARATOR."cashcow.conf";
    $redis_host = "192.168.0.249";
    $redis_port = 6379;
    $redis_database = 0;
}
*/