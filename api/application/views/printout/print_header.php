<?php
/**
 * @Author: fikri
 * @Date:   2020-03-19
 */
$baseurlnya = base_url();
// $baseurlnya = str_replace('http://','https://',$baseurlnya);
?>
<html lang="en" xmlns="http://www.w3.org/1999/html" moznomarginboxes mozdisallowselectionprint>
    <head>
        <meta charset="utf-8"/>
        <title><?php echo $titleNya; ?></title>

        <!--<link rel="stylesheet" type="text/css" href="<?php echo $baseurlnya ?>assets/css/bootstrap.min.css"/>-->
		<link href="https://fonts.cdnfonts.com/css/cascadia-code" rel="stylesheet">
		<style>
			@import url('https://fonts.cdnfonts.com/css/cascadia-code');
		</style>

        <link rel="stylesheet" type="text/css" href="<?php echo $baseurlnya ?>assets/css/print_beneficiary/print_beneficiary.css?<?=time()?>"/>
        <link rel="stylesheet" type="text/css" href="<?php echo $baseurlnya ?>assets/css/print_beneficiary/print_beneficiary-media.css?<?=time()?> " media="print"/>
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
        />

        <script src="<?php echo $baseurlnya;?>assets/js/print_beneficiary/jquery-1.8.3.min.js" type="text/javascript"></script>
        <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACXVwWCJen2OZeCAEYdRxP_HEh7CkxOvs"></script> -->
        <!-- <script src="<?php echo $baseurlnya; ?>assets/js/gmap3.js"></script> -->
    </head>
    <body>
