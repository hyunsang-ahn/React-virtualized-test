<?php
$sess_expire = 3600;
session_start ();

if (isset ( $_SESSION ['isExternal'] ) && $_SESSION ['isExternal'] == 'yes') {
    $rqst_time = $_SERVER ['REQUEST_TIME'];
    $log->debug ( "server rqst_time=$rqst_time=" . date ( 'Y-m-d H:i:s', $rqst_time ) . ", sess_expire=$sess_expire sec" );
    
    if (isset ( $_SESSION ['LAST_ACTIVITY'] )) {
        $log->debug ( "session last activity time=" . $_SESSION ['LAST_ACTIVITY'] . "=" . date ( 'Y-m-d H:i:s', $_SESSION ['LAST_ACTIVITY'] ) );
        $log->debug ( "rqst time diff activity time=" . ($rqst_time - $_SESSION ['LAST_ACTIVITY']) );
        
        if (($rqst_time - $_SESSION ['LAST_ACTIVITY']) > $sess_expire) {
            session_unset ();
            session_start ();
            ini_set ( "session.cookie_lifetime", $sess_expire );
            ini_set ( "session.gc_maxlifetime", $sess_expire );
            $log->debug ( "new session start, expire=$sess_expire secs" );
        } else {
            $log->debug ( "\$_SESSION['LAST_ACTIVITY'] do not expire" );
        }
    } else {
        $log->debug ( "\$_SESSION['LAST_ACTIVITY'] is not set" );
    }
    
    $_SESSION ['LAST_ACTIVITY'] = $rqst_time;
    $log->debug ( "session is(core) : " );
    $log->debug ( $_SESSION );
}

if (empty ( $GLOBALS ['locale'] )) {
    $GLOBALS ['locale'] = 'ko_KR';
} else if ($GLOBALS ['locale'] == 'id_ID' || $GLOBALS ['locale'] == 'ko_KR') {
    if (substr ( strtolower ( $_REQUEST ['applocale'] ), 0, 2 ) === 'id')
        $GLOBALS ['locale'] = 'id_ID';
    else if (substr ( strtolower ( $_REQUEST ['applocale'] ), 0, 2 ) === 'en')
        $GLOBALS ['locale'] = 'en_US';
    else if (substr ( strtolower ( $_REQUEST ['applocale'] ), 0, 2 ) === 'ko')
        $GLOBALS ['locale'] = 'ko_KR';
} else {
    $GLOBALS ['locale'] = 'ko_KR';
}

/*
 * // Sets the path for a domain
 * $td = bindtextdomain($tdomain, 'app/assets/locales');
 *
 * // Specify the character encoding in which the messages from the DOMAIN message catalog will be returned
 * $td = bind_textdomain_codeset($tdomain, 'UTF-8');
 *
 * // Sets the default domain
 * $td = textdomain($tdomain);
 */

function get_file_mtime($path)
{
    if (strpos ( $path, 'assets' ) !== false)
        $path = '/app' . $path;
    $path = $_SERVER ['DOCUMENT_ROOT'] . $path;
    $fm = filemtime ( $path );
    if (file_exists ( $path ))
        $r = date ( "ymdHis", $fm );
    return $r;
}

function render($filename, $layout = "default.html")
{
    define ( "__RENDERED__", true );
    global $res;
    global $log;
    
    if (isset ( $_REQUEST ['fhc_dataType'] )) {
        if ($_REQUEST ['fhc_dataType'] == "json") {
            if (! empty ( $_REQUEST ['var'] )) {
                $var = $_REQUEST ['var'];
                if ($res [$var]) {
                    echo json_encode ( $res [$var] );
                }
            } else {
                echo json_encode ( $res );
            }
            return;
        } else if ($_REQUEST ['fhc_dataType'] == 'html') {
            $layout = null;
        }
    }
    
    $path = $_SERVER ['DOCUMENT_ROOT'] . "/app/views/$filename";
    $path_layout = $_SERVER ['DOCUMENT_ROOT'] . "/app/views/layouts/" . $layout;
    
    if ($layout != null) {
        $log->trace ( "include path for html=$path" );
        ob_start ();
        if (! @include_once ($path)) {
            $log->warn ( "core.php render(). There is no such path for html=$path" );
        }
        $contents = ob_get_contents ();
        ob_end_clean ();
        
        if (! @include_once ($path_layout)) {
            $log->warn ( "core.php render(). There is no such path for layout=$path_layout" );
        }
    } else {
        $log->trace ( "include path for html=$path" );
        if (! @include_once ($path)) {
            $log->warn ( "core.php render(). There is no such path for html=$path" );
        }
    }
}
