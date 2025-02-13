<?php

    require_once('bd.php');

    if(isset($_POST['insert'])){
        $exito = insertRegister($_POST['username'],$_POST['password']);
        if ($exito==1){
            header('Location: ../registrarse.php?codi=1');
        }elseif ($exito==0) {
        
            header('Location: ../registrarse.php?codi=0');
        }
        
        exit();
    }
    if (isset($_POST['pass'])) {
        $exito = login($_POST['user'],$_POST['password']);

        if ($exito==1){
            
            header('Location: ../iniciar-sesion.php?codi=1');
        }elseif ($exito==2) {
        
            header('Location: ../iniciar-sesion.php?codi=2');
        }else{
        
            header('Location: ../iniciar-sesion.php?codi=0');
        }
        
        exit();
    }

    

?>