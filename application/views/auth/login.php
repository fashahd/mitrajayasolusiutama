<!DOCTYPE html>
<!--
* CoreUI - Free Bootstrap Admin Template
* @version v4.2.1
* @link https://coreui.io
* Copyright (c) 2022 creativeLabs Łukasz Holeczek
* Licensed under MIT (https://coreui.io/license)
-->
<html lang="en">
  <head>
    <base href="./">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="description" content="Mitrajaya Solusi Utama">
    <meta name="author" content="Fashah Darullah">
    <meta name="keyword" content="Mitrajaya,Solusi,Utama">
	<meta http-equiv=”Content-Security-Policy” content=”upgrade-insecure-requests”>
    <title>Mitrajaya Solusi Utama</title>
    <link rel="apple-touch-icon" sizes="57x57" href="<?=base_url()?>assets/assets/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="<?=base_url()?>assets/assets/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="<?=base_url()?>assets/assets/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="<?=base_url()?>assets/assets/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="<?=base_url()?>assets/assets/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="<?=base_url()?>assets/assets/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="<?=base_url()?>assets/assets/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="<?=base_url()?>assets/assets/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="<?=base_url()?>assets/assets/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="<?=base_url()?>assets/assets/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?=base_url()?>assets/assets/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="<?=base_url()?>assets/assets/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?=base_url()?>assets/assets/favicon/favicon-16x16.png">
    <link rel="manifest" href="<?=base_url()?>assets/assets/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="assets/favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <!-- Vendors styles-->
    <link rel="stylesheet" href="<?=base_url()?>assets/vendors/simplebar/css/simplebar.css">
    <link rel="stylesheet" href="<?=base_url()?>assets/css/vendors/simplebar.css">
    <!-- Main styles for this application-->
    <link href="<?=base_url()?>assets/css/style.css" rel="stylesheet">
    <!-- We use those styles to show code examples, you should remove them in your application.-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.23.0/themes/prism.css">
    <link href="<?=base_url()?>assets/css/examples.css" rel="stylesheet">
    <!-- Global site tag (gtag.js) - Google Analytics-->
    <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-118965717-3"></script>
    <script>
      window.dataLayer = window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      // Shared ID
      gtag('config', 'UA-118965717-3');
      // Bootstrap ID
      gtag('config', 'UA-118965717-5');
    </script>
  </head>
  <body>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="card-group d-block d-md-flex row">
              <div class="card col-md-2 p-3 mb-0">
                <div class="card-body">
									<form id="FormLogin">
	  								<img style="width:350px;margin-left:50px" src="<?=base_url()?>/assets/icons/logo_black.png"/>
										<div id="error"></div>
										<p class="text-medium-emphasis">Sign In to your account</p>
										<div class="input-group mb-3">
											<span class="input-group-text">
												<svg class="icon">
													<use xlink:href="<?=base_url()?>assets/vendors/@coreui/icons/svg/free.svg#cil-user"></use>
												</svg>
											</span>
											<input class="form-control" type="text" placeholder="Username" name="username" id="username">
										</div>
										<div class="input-group mb-4">
											<span class="input-group-text">
												<svg class="icon">
													<use xlink:href="<?=base_url()?>assets/vendors/@coreui/icons/svg/free.svg#cil-lock-locked"></use>
												</svg>
											</span>
											<input class="form-control" type="password" placeholder="Password" name="password" id="password">
										</div>
										<div class="row">
											<div class="col-6">
												<button class="btn btn-primary px-4" type="submit">Login</button>
											</div>
										</div>
									</form>
                </div>
              </div>
              <div class="card col-md-9 text-white bg-primary py-7">
                <div class="card-body text-center">
                  <div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- CoreUI and necessary plugins-->
    <script src="<?=base_url()?>assets/vendors/@coreui/coreui/js/coreui.bundle.min.js"></script>
    <script src="<?=base_url()?>assets/vendors/simplebar/js/simplebar.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script>
			$(document).ready(function() {	
				$('#FormLogin').submit(function(event){
					event.preventDefault();

					$.ajax({
						type: "post",
						url: "<?=$this->config->item("api")?>/v1/auth/login",
						data: $("form").serialize(),
						success: function (response) {
							if(response.message == "success"){								
								window.location = '<?php echo base_url()?>';
							}
						}, error: function(e){
							console.log(e);
							$("#error").html('<div class="alert"> '+
							'<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> '+
  						e.responseJSON.message+
							'</div>')
							console.log(e.responseJSON.message);
						}
					})
					return false;
				})
			});
    </script>
  </body>
</html>
