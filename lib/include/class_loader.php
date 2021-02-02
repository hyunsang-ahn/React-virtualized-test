<?php
spl_autoload_register ( function ($class) {
    // aws module을 외부에서 불러다 쓰기 위한 예외처리 추가 - 15/07/15 paul jo
    $excepted_list = array (
            "Aws",
            "Guzzle",
            "S3Client",
            "Symfony" 
    );
    
    $class = str_replace ( "\\", "/", $class );
    $file = $_SERVER ['DOCUMENT_ROOT'] . "/lib/classes/$class.php";
    
    if (! file_exists ( $file )) {
        if (preg_grep ( '#' . current ( explode ( '/', $class ) ) . '#', $excepted_list ) !== false) {
            $file = $_SERVER ['DOCUMENT_ROOT'] . "/lib/modules/aws_2.8.14/$class.php";
        } else {
            echo "There's no such class: $class, " . $_SERVER ['PHP_SELF'] . "<br />";
            return 0;
        }
    }
    
    require_once ($file);
} );
