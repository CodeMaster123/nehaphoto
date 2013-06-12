<?php

/**
 * Send contact form message
 */

define('TO', 'email@domain.com');


$message = 'Message from: ' . $_POST['name'] . ' <'.$_POST['email'].'>' . "\n
Message: " . $_POST['message'];


if (mail(TO, $_POST['subject'], $message)){
	echo 'ok';
}else{
	echo 'Error occurred while sending email';
}

/**
* end of file
*/