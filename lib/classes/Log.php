<?php
/**
 * EXAMPLE
 * $log_recorder = new log_recorder("sms","/sms_log/", 1,1); //호출한 사람의 IP가 표시됨
 * $log_recorder = new log_recorder("sms","/sms_log/");
 */
class Log
{
    /**
     * 기본 생성자 세팅
     *
     * @param
     *            : 로그파일접두어, 로그가 저장될경로, 시간표시, 접속자IP표시, 호출자표시, 소유자
     * @return :
     */
    /**
     * PRIVATE 변수 세팅
     */
    private $path;
    private $hostname;
    private $start_path;
    private $prefix;
    private $disp_time;
    private $disp_addr;
    private $disp_self;
    private $_owner;
    private static $instance;
    private $filename;
    private $_levels;
    private $_threshold;
    private $proc_time = array(); // 17/04/02 simje
    
    // insert by simje 2014/12/24
    private $allow_hosts;
    
    const LOG_LEVEL_ERROR = 1;
    const LOG_LEVEL_WARN = 2;
    const LOG_LEVEL_INFO = 3;
    const LOG_LEVEL_DEBUG = 4;
    const LOG_LEVEL_TRACE = 5;
    const LOG_LEVEL_VERBOSE = 6;
    const LOG_LEVEL_ALL = 7;

    protected function __construct($_prefix = "default", $_path = "/developer_log/", $_owner = null, $_threshold = 4,
        $_start_path = null, $_allow_hosts = null)
    {
        $this->_levels = array (
                'error' => 1,
                'warn' => 2,
                'info' => 3,
                'debug' => 4,
                'trace' => 5,
                'verbo' => 6,
                'verbose' => 6,
                'all' => 7 
        );
        // _threshold 보다 작거나 같으면 로깅
        $this->_threshold = $_threshold;
        
        /**
         * PRIVATE 함수에 넣음
         */
        $hostname = empty ( $_SERVER ['HTTP_HOST'] ) ? php_uname ( 'n' ) : $_SERVER ['HTTP_HOST'];
        if (empty ( $_start_path )) {
            if (strstr ( $hostname, "ip-" )) {
                // $this->start_path = "/cashcow/service/logs";
                $this->start_path = "/cashcow/logs";
            }
            else {
                // $this->start_path = "/var/www/html/cashcow/service/logs";
                $this->start_path = "/var/www/html/cashcow/logs";
            }
        } else
            $this->start_path = $_start_path;
    
        $sapi_type = php_sapi_name();
        
        
        // $this->path = $this->start_path.$_path."/";
        $this->path = $this->start_path . $_path;
        if (!empty($this->path) && substr($this->path,-1)!=DIRECTORY_SEPARATOR) $this->path .= DIRECTORY_SEPARATOR;
        $this->prefix = $_prefix;
        $this->_owner = $_owner;
        if (!empty($sapi_type) && substr($sapi_type, 0, 3) == 'cli') {
            // echo "Log path=$this->path,prefix=$this->prefix,owner=$this->_owner\n";
        }
        
        // insert by simje 2014/12/24
        // $this->allow_hosts = '*';
        // 125.132.104.53- 판교 enbsoft 15/12/16
        // 125.132.104.163- 판교 캐시카우 17/07/07
        // 220.93.216.105- 광주 사무실 #1 17/07/07
        // 112.164.3.75- 광주 사무실 #2 17/07/07
        // 210.99.3.139 - 판교 enbsoft 17/07/07
        if (! empty ( $_allow_hosts ))
            $this->allow_hosts = $_allow_hosts;
        else
            //$this->allow_hosts = "localhost;192.168.;125.132.104.53;125.132.104.163;220.93.216.105;112.164.3.75";
          //112.164.3.75 제거. 121.148.38.125;121.148.38.126 추가 by ksson 190117
            //210.179.154.226 판교 IP 추가 by ksson 190129
          $this->allow_hosts = "localhost;192.168.;125.132.104.53;125.132.104.163;220.93.216.105;121.148.38.125;121.148.38.126;210.179.154.226";
        // $this->allow_hosts = "";
        // $this->allow_hosts = "210.99.208.163";
        // $this->allow_hosts = '210.99.208';
        
        /**
         * 디렉토리 없으면 생성
         */
        if (! is_dir ( $this->path )) {
            error_log ( "there is no path($this->path) let's mkdir it as 0777" );
            error_log ( $this->generateCallTrace () );
            if (mkdir ( $this->path, 0777, true ) === FALSE)
                $this->sys_error ( "mkdir($this->path) fail" );
        }
        
        /**
         * 기본값 받아오기
         */
        $prefix = $this->prefix;
        
        /**
         * 경로 및 파일이름 지정 후 fp 열기
         */
        $path = $this->path;
        
        if (empty ( $_SERVER ['HTTP_HOST'] ))
            $this->hostname = php_uname ( 'n' );
        else
            $this->hostname = $_SERVER ['HTTP_HOST'];
        // if hostname is from AWS
        if (strstr ( $this->hostname, "ip-" ))
            $this->hostname = file_get_contents ( 'http://169.254.169.254/latest/meta-data/public-hostname' );
        /*
         * change by simje 2015/09/16
         * $addprefix = str_ireplace('.cash-cow.co.kr', '', $this->hostname);
         */
        $hostnames = explode ( ".", $this->hostname );
        if (! empty ( $hostnames ) && ! empty ( $hostnames [0] ))
            $addprefix = $hostnames [0];
        else
            $addprefix = '';
        
        $file = $prefix . "_" . date ( "Ymd" ) . "." . $addprefix . ".log";
        $owner = $this->_owner;
        $this->filename = $path . $file;
        $file_exists = file_exists ( $this->filename );
        
        /*
         * //오픈 실패시
         * if(!($fp = @fopen($path.$file, "a+"))) {
         * print_r(error_get_last());
         * return 0;
         * }
         */
        
        // 오너 설정 및 파일이 존재하지 않았었을경우.
        if (isset ( $owner ) && ! $file_exists) {
            @chown ( $path . $file, $owner );
            // @chgrp($path.$file, $owner);
            @chgrp ( $path . $file, 'apache' );
        }
    }

    /**
     * *싱글턴* 인스턴스를 복제할 수 없도록 복제 메소드를 private으로 제한
     *
     * @return void
     */
    private function __clone()
    {
    }

    /**
     * *싱글턴* 인스턴스를 unserialize 하지 못하게 private 으로 제한
     *
     * @return void
     */
    private function __wakeup()
    {
    }

    static function singleton($_prefix, $_path, $_owner, $_start_path = null, $_allow_hosts = null)
    {
        if (strnatcmp ( phpversion (), '5.2.13' ) >= 0) {
            if (! isset ( self::$instance )) {
                $c = __CLASS__;
                self::$instance = new $c ( $_prefix, $_path, $_owner, 4, $_start_path, $_allow_hosts );
            }
        } else {
            if (! isset ( $this ) || ! isset ( $this->instance )) {
                $c = __CLASS__;
                $instnace = new $c ( $_prefix, $_path, $_owner, 4, $_start_path, $_allow_hosts );
            }
        }
        
        if (strnatcmp ( phpversion (), '5.2.13' ) >= 0) {
            return self::$instance;
        } else {
            return $instance;
        }
    }

    function set_log_level($level)
    {
        $this->_threshold = $level;
    }
    
    function set_log_filename_append($append)
    {
        $hostnames = explode ( ".", $this->hostname );
        if (! empty ( $hostnames ) && ! empty ( $hostnames [0] )) {
            $addprefix = $hostnames [0];
        }
        else {
            $addprefix = '';
        }
        
        // 원복 simje 190702
        // change by simje 190626
        if (isset($append) && strlen($append)>0)
            $file = $this->prefix."_".$append."_".date ( "Ymd" ).".".$addprefix.".log";
        else
            $file = $this->prefix."_".date ( "Ymd" ).".".$addprefix.".log";
        /*
        if (isset($append) && strlen($append)>0) $append = "_".$append."_";
        else $append = "_";
        $file = $this->prefix.$append.date ( "Ymd" ).".".$addprefix.".log";
        */
        
        $this->filename = $this->path . $file;
    }

    function generateCallTrace()
    {
        $e = new Exception ();
        $trace = explode ( "\n", $e->getTraceAsString () );
        // reverse array to make steps line up chronologically
        $trace = array_reverse ( $trace );
        array_shift ( $trace ); // remove {main}
        array_pop ( $trace ); // remove call to this method
        $length = count ( $trace );
        $result = array ();
        
        for($i = 0; $i < $length; $i ++) {
            $result [] = ($i + 1) . ')' . substr ( $trace [$i], strpos ( $trace [$i], ' ' ) ); // replace '#someNum' with '$i)', set the right ordering
        }
        
        return "\t" . implode ( "\n\t", $result );
    }

    // remove private simje 16/03/28
    // private
    function get_ip()
    {
        if (! empty ( $_SERVER ['HTTP_CLIENT_IP'] ))
            $ip = $_SERVER ['HTTP_CLIENT_IP'];
        else if (isset ( $_SERVER ['HTTP_X_FORWARDED_FOR'] ) && $_SERVER ['HTTP_X_FORWARDED_FOR']) {
            $ip = $_SERVER ['HTTP_X_FORWARDED_FOR'];
        } else if (isset ( $_SERVER ['REMOTE_ADDR'] )) {
            $ip = $_SERVER ['REMOTE_ADDR'];
        } else {
            $ip = 'localhost';
        }
        
        return $ip;
    }

    private function filter_log($level)
    {
        // all logging for error and warn
        if ($level == 'warn' || $level == 'error')
            return true;
        
        // level check
        if (! isset ( $this->_levels [$level] ) or ($this->_levels [$level] > $this->_threshold)) {
            return false;
        }
        
        // 개발이면 모두 로깅하도록 수정 16/08/09
        if (isset ( $GLOBALS ['isdev'] ) && $GLOBALS ['isdev'] !== true) {
            // ip check
            $ip = $this->get_ip ();
            $ah = explode ( ";", $this->allow_hosts );
            $bf = false;
            foreach ( $ah as $host ) {
                if ($host == '*' || $host == 'all') {
                    $bf = true;
                    break;
                }
                if (! empty ( $host ) && strstr ( $ip, $host )) {
                    $bf = true;
                    break;
                }
            }
        } else
            $bf = true;
        
        // $bf = false;
        
        // var_dump($bf);
        return $bf;
    }

    public function verbose($msg)
    {
        // return $this->log($msg, 'verbose');
        return $this->log ( $msg, 'verbo' );
    }
    
    // insert by simje 190624
    public function verbose_array($msg, $array)
    {
        $this->log ( $msg, 'verbo' );
        return $this->log ( $array, 'verbose' );
    }
    
    public function verbose_func($msg='')
    {
        $level = 'verbose';
        if (! isset ( $this->_levels [$level] ) or ($this->_levels [$level] > $this->_threshold)) {
            return false;
        }
        $bt = debug_backtrace ();
        if (is_array ( $bt )) {
            $bt_debug_print = array_shift ( $bt );
            $bt_called_function = array_shift ( $bt );
        }
        $file_name = str_replace ( $_SERVER ['DOCUMENT_ROOT'], '', $bt_debug_print ['file'] );
        $line_num = $bt_debug_print ['line'];
        $function = (empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class']) . (empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type']) . (empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function']);
    
        $str = sprintf ( "start %s%s%s()", empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class'], empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type'], empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function'] );
        if (! empty ( $bt_called_function ['args'] )) {
            $this->verbose_array ( $str . " args", $bt_called_function ['args'] );
        }
        else {
            $this->verbose ( $str . " args=empty" );
        }
        
        $this->proc_time["$str"] = microtime(TRUE);
    }

    public function trace($msg)
    {
        return $this->log ( $msg, 'trace' );
    }

    public function trace_array($msg, $array)
    {
        $this->log ( $msg, 'trace' );
        return $this->log ( $array, 'trace' );
    }
    
    public function get_calling_info(&$str, &$arg)
    {
        $bt = debug_backtrace ();
        if (is_array ( $bt )) {
            $bt_debug_print = array_shift ( $bt );
            $bt_called_function = array_shift ( $bt );
        }
        $file_name = str_replace ( $_SERVER ['DOCUMENT_ROOT'], '', $bt_debug_print ['file'] );
        $line_num = $bt_debug_print ['line'];
        $function = (empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class']) . (empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type']) . (empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function']);
    
        $str = sprintf ( "start %s%s%s()", empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class'], empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type'], empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function'] );
    }

    public function trace_func($msg = '')
    {
        $level = 'trace';
        if (! isset ( $this->_levels [$level] ) or ($this->_levels [$level] > $this->_threshold)) {
            return false;
        }
        
        $bt = debug_backtrace ();
        if (is_array ( $bt )) {
            $bt_debug_print = array_shift ( $bt );
            $bt_called_function = array_shift ( $bt );
        }
        $file_name = str_replace ( $_SERVER ['DOCUMENT_ROOT'], '', $bt_debug_print ['file'] );
        $line_num = $bt_debug_print ['line'];
        $function = (empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class']) . (empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type']) . (empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function']);
        
        $str = sprintf ( "start %s%s%s()", empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class'], empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type'], empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function'] );
        if (! empty ( $bt_called_function ['args'] )) {
            $this->trace_array ( $str . " args", $bt_called_function ['args'] );
        }
        else {
            $this->trace ( $str . " args=empty" );
        }
        /*
        $str = '';
        $arg = '';
        $this->get_calling_info($str, $arg);
        if (! empty ( $arg ))
            $this->trace_array ( $str . " args", $arg );
        else
            $this->trace ( $str . " args=empty" );
        */
        
        $this->proc_time["$str"] = microtime(TRUE);
    }

    // new 2015/03/25 by simje
    public function debug_func($msg = '')
    {
        $level = 'debug';
        if (! isset ( $this->_levels [$level] ) or ($this->_levels [$level] > $this->_threshold)) {
            return false;
        }
        
        
        $bt = debug_backtrace ();
        if (is_array ( $bt )) {
            $bt_debug_print = array_shift ( $bt );
            $bt_called_function = array_shift ( $bt );
        }
        $file_name = str_replace ( $_SERVER ['DOCUMENT_ROOT'], '', $bt_debug_print ['file'] );
        $line_num = $bt_debug_print ['line'];
        $function = (empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class']) . (empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type']) . (empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function']);
        
        // $str = sprintf("start %s%s%s()",
        $str = sprintf ( "%s%s%s()", empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class'], empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type'], empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function'] );
        // $this->log($str);
        if (! empty ( $bt_called_function ['args'] )) {
            $this->debug_array ( $str . " args", $bt_called_function ['args'] );
        }
        else {
            $this->debug ( $str . " args=empty" );
        }
        /*
        $str = '';
        $arg = '';
        $this->get_calling_info($str, $arg);
        if (! empty ( $arg ))
            $this->debug_array ( $str . " args", $arg );
        else
            $this->debug ( $str . " args=empty" );
        */
        /*
        $classname = empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class'];
        $type = empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type'];
        $function = empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function'];
        */
        $this->proc_time["$str"] = microtime(TRUE);
    }
    
    public function debug_func_end($ret)
    {
        $bt = debug_backtrace ();
        if (is_array ( $bt )) {
            $bt_debug_print = array_shift ( $bt );
            $bt_called_function = array_shift ( $bt );
        }
        $file_name = str_replace ( $_SERVER ['DOCUMENT_ROOT'], '', $bt_debug_print ['file'] );
        $line_num = $bt_debug_print ['line'];
        $function = (empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class']) . (empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type']) . (empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function']);
        
        // $str = sprintf("start %s%s%s()",
        $fnstr = sprintf ( "%s%s%s()", empty ( $bt_called_function ['class'] ) ? '' : $bt_called_function ['class'], empty ( $bt_called_function ['type'] ) ? '' : $bt_called_function ['type'], empty ( $bt_called_function ['function'] ) ? '' : $bt_called_function ['function'] );
        
        // $this->debug_array("for test", $this->proc_time);
        
        $dur = microtime(TRUE) - $this->proc_time["$fnstr"];
        
        switch(gettype($ret)) {
            case "boolean":
                $retstr = ($ret===false?'false':'true');
                break;
            case "array":
            case "object":
                // 여기서 마지막 파라미터가 TRUE가 아니면 json 회신하는 곳에 데이터가 섞이는 문제가 있다. simje 17/04/02
                $retstr = var_export($ret, TRUE);
                break;
            case "integer":
            case "double":
            case "string":
                $retstr = "$ret";
                break;
            default:
                $retstr = "un-supported type";
                break;
        }
        $this->debug ( $fnstr." end ret=$retstr proc time=$dur" );
    }

    public function debug($msg)
    {
        /*
         * ob_start();
         * print_r($msg);
         * $ob_msg = ob_get_contents();
         * ob_clean();
         * return $this->log($ob_msg, 'debug');
         */
        return $this->log ( $msg, 'debug' );
    }

    public function debug_array($msg, $array)
    {
        $this->log ( $msg, 'debug' );
        return $this->log ( $array, 'debug' );
    }

    public function info($msg)
    {
        /*
         * ob_start();
         * print_r($msg);
         * $ob_msg = ob_get_contents();
         * ob_clean();
         * return $this->log($ob_msg, 'info');
         */
        return $this->log ( $msg, 'info' );
    }

    public function info_array($msg, $array)
    {
        $this->log ( $msg, 'info' );
        return $this->log ( $array, 'info' );
    }

    public function warn($msg)
    {
        return $this->log ( $msg, 'warn' );
    }

    // new 16/04/07 simje
    public function warn_array($msg, $array)
    {
        $this->log ( $msg, 'warn' );
        return $this->log ( $array, 'warn' );
    }

    public function error($msg)
    {
        return $this->log ( $msg, 'error' );
    }

    // new 16/04/07 simje
    public function error_array($msg, $array)
    {
        $this->log ( $msg, 'error' );
        return $this->log ( $array, 'error' );
    }

    // insert by simje 2015/09/16
    public function sys_error($msg)
    {
        $se = error_get_last ();
        $this->error ( "$msg-system error", 'error' );
        return $this->error ( $se, 'error' );
    }

    /**
     * * 로그 남기기
     * *
     * * @param : 메세지
     * * @return : 성공시 ; 1 or 닷네임아이피인경우 로그 경로 출력, 실패시 ; 0
     */
    public function log($msg, $level = 'debug')
    {
        if ($this->filter_log ( $level ) == false)
            return 0;
        
        /*
         * //** 기본값 받아오기
         * $prefix = $this->prefix;
         *
         * //** 경로 및 파일이름 지정 후 fp 열기
         * $path = $this->path;
         * $file = $prefix."_".date("Ymd").".log";
         * $owner = $this->_owner;
         * $file_exists = file_exists($path.$file);
         *
         * //오픈 실패시
         * if(!($fp = @fopen($path.$file, "a+"))) {
         * print_r(error_get_last());
         * return 0;
         * }
         *
         * //오너 설정 및 파일이 존재하지 않았었을경우.
         * if ( isset($owner) && !$file_exists) {
         * @chown($path.$file, $owner);
         * // @chgrp($path.$file, $owner);
         * @chgrp($path.$file, 'apache');
         * }
         */
        
        /**
         * 메세지 내용 출력하기
         */
        // flush();
        ob_start ();
        print_r ( $msg );
        $ob_msg = ob_get_contents ();
        /*
         * change by simje 2015/03/06
         * ob_clean();
         */
        ob_end_clean ();
        
        return $this->write_log ( $ob_msg, $level );
        /*
         * //** LOG HEADER 세팅
         * $d_time = "[".date("y-m-d H:i:s")."]";
         * // @$d_addr = "[".$_SERVER['REMOTE_ADDR']."]";
         * @$d_addr = "[".$this->get_ip()."]";
         * @$d_self = "[".$_SERVER['REQUEST_URI']."]";
         * $log_header = $d_time.$d_addr.$d_self;
         *
         * //** 헤더가 있으면 공백 추가
         * if( $log_header != "" ){
         * $ob_msg = " ".$ob_msg;
         * }
         *
         * /** 로그쓰기
         * if( fwrite($fp, $log_header.$ob_msg."\n") === FALSE){
         * fclose($fp);
         * return 0;
         * }
         * fclose($fp);
         *
         * return 1;
         */
    }

    private function write_log($msg, $level)
    {
        // 오픈
        if (! ($fp = @fopen ( $this->filename, "a+" ))) {
            // print_r(error_get_last());
            return 0;
        }
        
        /**
         * LOG HEADER 세팅
         */
        // '['과 ']'를 좌우에서 제거하고 공백으로 대신 simje 2016/01/16
        // $d_level = '['.$level.(($level == 'info'||$level == 'warn') ? ' ' : '').']';
        $d_level = $level . (($level == 'info' || $level == 'warn') ? ' ' : '');
        // logging 파일에 날짜가 있으므로 날짜 제거 simje 2016/01/16
        // $d_time = "[".date("y-m-d H:i:s")."]";
        $d_time = date ( "H:i:s" );
        /*
         * @$d_addr = "[".$this->get_ip()."]";
         * @$d_self = "[".$_SERVER['REQUEST_URI']."]";
         */
        @$d_addr = $this->get_ip ();
        @$d_self = $_SERVER ['REQUEST_URI'];
        
        // change by simje 180227
        // $d_self = strlen ( $d_self ) > 50 ? substr ( $d_self, 0, 50 ) . "..." : $d_self;
        $d_self = strlen ( $d_self ) > 32 ? substr ( $d_self, 0, 32 ) . "..." : $d_self;
        $log_header = $d_level . " " . $d_time . " " . $d_addr . " " . $d_self;
        
        /**
         * 헤더가 있으면 공백 추가
         */
        if ($log_header != "") {
            $msg = " " . $msg;
        }
        
        /**
         * 로그쓰기
         */
        if (fwrite ( $fp, $log_header . $msg . "\n" ) === FALSE) {
            fclose ( $fp );
            return 0;
        }
        fclose ( $fp );
        
        return 1;
    }
    
    
    /**
     *  메모리 사용량 획득
     *  
     *  simje 17/05/23
     */
    public function get_memory_usage($peak=false, $unit='B')
    {
        if ($peak===true) $mem = memory_get_peak_usage(true);
        else $mem = memory_get_usage(true);
        
        if ($unit==='K') $mem = $mem/1024;
        else if ($unit==='M') $mem = $mem/(1024*1024);
        
        return $mem;
    }
}
