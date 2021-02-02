<?php
/*
include_once 'mall_data.php';

// 세션에 cidx 설정 
// $_REQUEST['cidx'] 없는 경우 $_SESSION['cidx'] 보존 by hsji 181002
if(!empty($_REQUEST['cidx'])) {
    $request_cidx = $_REQUEST['cidx'];
    $log->debug('Request cidx: ' . $request_cidx);
    
    if (isset($_REQUEST['cidx']) && $_REQUEST['cidx'] == '0') {
        $log->debug('cidx is zero, resetting $_SESSION[\'cidx\']');
        $_SESSION['cidx'] = 0;
    } else if (!empty($request_cidx)) {
        //$_SESSION['cidx'] = seed_decrypt($request_cidx);
        $_SESSION['cidx'] = $request_cidx;
        $log->debug("Session cidx set: $_SESSION[cidx]");
    } else if (!isset($_REQUEST['cidx'])) {
        $log->debug('cidx is not set.');
    }
} else {
    $log->debug('\$_REQUEST[cidx] is empty. Session cidx: ' . $_SESSION['cidx']);
}

//세션에 앱 버전을 설정한다. by ksson 2017 04 10
// $_REQUEST['appver'] 없는 경우 $_SESSION['appver'] 보존 by hsji 181002

if(!empty($_REQUEST['appver'])) {
    $request_appver = $_REQUEST['appver'];
    $log->debug('Request appver: ' . $request_appver);
    $_SESSION['appver'] = $request_appver;
    $log->debug("Session appver set: $_SESSION[appver]");
} else {
    $log->debug('\$_REQUEST[appver] is empty. Session appver: ' . $_SESSION['appver']);
}

$res['page'] = basename(__FILE__, '.php');
$res['title'] = '포인트 사용하기';

// 카테고리 정보 추가 180724 by hsji
// $res['script'] = getMallDataJs('home') . getMallDataJs('user');
$res['script'] = getMallDataJs('home') . getMallDataJs('user') . getMallDataJs('server') . getMallDataJs('session');


//ios에서 기부하기를 숨길 대상 버전 획득 by ksson 2017 05 12
$version = new Version();
$res['ios_hide_donation_appver'] = $version->get_ios_hide_donation_appver();
*/
render('/blank.html', $layout='default.html');