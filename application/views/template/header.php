<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv=”Content-Security-Policy” content=”upgrade-insecure-requests”>
	<title>Mitrajaya Solusi Utama</title>

	<!-- Google Font: Source Sans Pro -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
	<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
	<!-- Font Awesome -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/icons/font-awesome/css/all.min.css">
	<link href="<?= base_url() ?>assets/icons/font-awesome/css/fontawesome.css" rel="stylesheet">
	<link href="<?= base_url() ?>assets/icons/font-awesome/css/brands.css" rel="stylesheet">
	<link href="<?= base_url() ?>assets/icons/font-awesome/css/solid.css" rel="stylesheet">
	<!-- Ionicons -->
	<link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
	<!-- Tempusdominus Bootstrap 4 -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
	<!-- iCheck -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
	<!-- JQVMap -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/jqvmap/jqvmap.min.css">
	<!-- Theme style -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/dist/css/adminlte.min.css">
	<!-- overlayScrollbars -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
	<!-- Daterange picker -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/daterangepicker/daterangepicker.css">
	<!-- summernote -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/summernote/summernote-bs4.min.css">
	<!-- SweetAlert -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/bootstrap/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
	<script src="<?= base_url() ?>assets/bootstrap/plugins/sweetalert2/sweetalert2.min.js"></script>
	<link rel="stylesheet" href="<?= base_url() ?>assets/css/style_green.css?<?=time()?>" type="text/css" />
	<!-- custom -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/css/custom.css" type="text/css" /> <!-- except -->
	<link rel="stylesheet" href="<?= base_url() ?>assets/css/add.css?version=2" type="text/css" />

	<script src="https://kit.fontawesome.com/6f16ec3fa3.js" crossorigin="anonymous"></script>

	<script>
		var api_url = "<?= $this->config->item("api"); ?>";
	</script>

	<!-- jQuery -->
	<script src="<?= base_url() ?>assets/bootstrap/plugins/jquery/jquery.min.js"></script>
	<!-- jQuery UI 1.11.4 -->
	<script src="<?= base_url() ?>assets/bootstrap/plugins/jquery-ui/jquery-ui.min.js"></script>

	<!-- Highchart -->
	<script type="text/javascript" src="<?= base_url() ?>assets/lib/highstock/highstock.js"></script>
	<script type="text/javascript" src="<?= base_url() ?>assets/lib/highchart/highcharts-more.js"></script>
	<script type="text/javascript" src="<?= base_url() ?>assets/lib/highchart/modules/exporting.js"></script>
	<script type="text/javascript" src="<?= base_url() ?>assets/lib/highchart/modules/no-data-to-display.js"></script>
	<script type="text/javascript" src="<?= base_url() ?>assets/lib/highchart/modules/solid-gauge.js"></script>
	<script type="text/javascript" src="<?= base_url() ?>assets/lib/highchart/plugins/grouped-categories.js"></script>

	<?php $ver = $this->config->item('extjs_version') ?>


	<link href="<?= base_url() ?>assets/js/<?php echo $ver ?>/resources/css/ext-all-neptune.css" rel="stylesheet" type="text/css" />
	<script src="<?= base_url() ?>assets/js/<?php echo $ver ?>/ext-all.js" type="text/javascript"></script>

	<script src="<?= base_url() ?>assets/js/<?php echo $ver ?>/ext-theme-neptune.js" type="text/javascript"></script>
	<script src="<?= base_url() ?>assets/js/app.js" type="text/javascript"></script> <!-- except -->

	<!-- BoxSelect Source -->
	<link rel="stylesheet" type="text/css" href="<?= base_url() ?>assets/js/plugins/boxselect/extjs-boxselect-all-debug.css" />
	<script type="text/javascript" src="<?= base_url() ?>assets/js/plugins/boxselect/extjs-boxselect-debug.js"></script>
	<script type="text/javascript" src="<?= base_url() ?>assets/js/plugins/jQueryRotate.js"></script>
	<script src="<?= base_url() ?>assets/js/jquery.niftymodals/js/jquery.modalEffects.js" type="text/javascript"></script>

	<script>
		/*(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-46635047-1', 'cocoatrace.com');
		ga('send', 'pageview');
		*/
		var varjs = {
			"config": {
				"base_url": "<?php echo base_url(); ?>",
				"default_currency": "IDR",
				"extjs_version": "<?= $this->config->item('extjs_version') ?>"
			}
		};

		var mj = {
			"mj_session": "<?php echo bin2hex($_SESSION['username']); ?>",
			"mj_fullname": "<?php echo $_SESSION['realname'] ?>"
		}

		Ext.Loader.setConfig({
			enabled: true
		});
		Ext.Loader.setPath('Ext.ux', varjs.config.base_url + 'assets/js/' + varjs.config.extjs_version + '/ux');
		Ext.Loader.setPath('Ext.ux.DataView', varjs.config.base_url + 'assets/js/' + varjs.config.extjs_version + '/ux/DataView/');
		Ext.require([
			'Ext.grid.*',
			'Ext.data.*',
			'Ext.panel.*',
			'Ext.ux.grid.FiltersFeature',
			'Ext.form.Panel',
			'Ext.tab.*',
			'Ext.window.*',
			'Ext.tip.*',
			'Ext.layout.container.Border',
			'Ext.ux.GMapPanel',
			'Ext.util.*',
			'Ext.view.View',
			'Ext.ux.DataView.DragSelector',
			'Ext.ux.DataView.LabelEditor',
			'Ext.ux.NumericField',
			'Ext.ux.form.BoxSelect',
			'Ext.ux.form.field.BoxSelect'
		]);

		// Override Grid Panel
		var h = window.innerHeight - 180;

		Ext.override(Ext.grid.GridPanel, {
			autoScroll: true,
			autoHeight: true,
			maxHeight: h,

		});
		// Overide sorting header grid
		Ext.define("Ext.locale.en.grid.header.Container", {
			override: "Ext.grid.header.Container",
			sortAscText: "<?= 'Sort Ascending'; ?>",
			sortDescText: "<?= 'Sort Descending'; ?>",
			columnsText: "<?= 'Columns'; ?>"
		});
		// Overide display info grid
		<?php
		$language = $_SESSION['language'] == 'Chinese' ? ' 页' : '';
		?>
		if (Ext.PagingToolbar) {
			Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText: "<?= 'Page'; ?>",
				afterPageText: "<?= 'of' . ' ' . '{0}' . $language; ?>",
				firstText: "<?= 'First Page'; ?>",
				prevText: "<?= 'Previous Page'; ?>",
				nextText: "<?= 'Next Page'; ?>",
				lastText: "<?= 'Last Page'; ?>",
				refreshText: "<?= 'Refresh'; ?>",
				displayMsg: "<?= 'Displaying' . '  {0} - {1} ' . 'of' . ' {2}'; ?>",
				emptyMsg: '<?= 'No data to display'; ?>'
			});
		}
		// Overide Message Confirm box
		Ext.override(Ext.window.MessageBox, {
			buttonText: {
				yes: "<?= 'Yes'; ?>",
				no: "<?= 'No'; ?>",
				ok: "<?= 'OK'; ?>",
				cancel: "<?= 'Cancel'; ?>"
			},
			confirm: function(title, msg, fn, scope) {
				var $this = this;
				var promise = new Promise(async function(resolve, reject) {
					resolve($this, title, msg, fn, scope);
				}).then(function(value) {
					Ext.Ajax.request({
						waitMsg: 'Please Wait',
						url: '/api/tools/lang_c',
						params: {
							title: title,
							msg: msg
						},
						method: 'POST',
						success: function(response, opts) {
							result = response.responseText;
							result = JSON.parse(result);

							$this.show({
								title: result.data.title,
								msg: result.data.msg,
								buttonText: {
									yes: "<?= 'Yes'; ?>",
									no: "<?= 'No'; ?>"
								},
								closable: false,
								promptConfig: false,
								scope: scope,
								animateTarget: 'mb9',
								icon: 'ext-mb-info',
								fn: function() {
									if (fn) {
										fn.apply(scope, arguments);
									}
								}
							});
							return $this;
						},
					});
				});
			},
		});

		function signOut() {
			//jalankan fungsi clear localstorage
			clearlocalStorage();
			window.location = '<?php echo site_url('auth/logout') ?>';
		}

		//SCRIPT CEK COGNITO DUPLIKAT EMAIL / PHONENUMBER (BEGIN)
		if (localStorage.getItem('ctnestle_duplikatemail') == 1) {
			alert('There is an issue regarding your email address, please contact System Administrator');
			localStorage.setItem('ctnestle_duplikatemail', 0);
		}

		if (localStorage.getItem('ctnestle_duplikatphonenumber') == 1) {
			alert('There is an issue regarding your phone number, please contact System Administrator');
			localStorage.setItem('ctnestle_duplikatphonenumber', 0);
		}
		//SCRIPT CEK COGNITO DUPLIKAT EMAIL / PHONENUMBER (END)
	</script>
	<script type="text/javascript" src="<?= base_url() ?>assets/js/gValidation.js"></script>
	<style>
		body {
			font-family: 'Roboto';
		}
	</style>
</head>

<body class="hold-transition sidebar-mini layout-fixed">
	<div class="wrapper">

		<!-- Preloader -->
		<!-- <div class="preloader flex-column justify-content-center align-items-center">
    <img class="animation__shake" src="<?= base_url() ?>assets/bootstrap/dist/img/AdminLTELogo.png" alt="AdminLTELogo" height="60" width="60">
  </div> -->

		<!-- Navbar -->
		<nav class="main-header navbar navbar-expand navbar-white navbar-light">
			<!-- Left navbar links -->
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
				</li>
			</ul>

			<!-- Right navbar links -->
			<ul class="navbar-nav ml-auto">
				<li class="nav-item dropdown">
					<a class="nav-link" data-toggle="dropdown" href="#">
						<i class="fas fa-envelope-open-text"></i>
						<span class="badge badge-danger navbar-badge" id="NumNotifHeader">0</span>
					</a>
					<div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" id="NotifData">
					</div>
				</li>

				<li class="nav-item dropdown">
					<a class="nav-link" data-toggle="dropdown" href="#" onclick="signOut()">
						<i class="fa-solid fa-right-from-bracket"></i> Logout
					</a>
				</li>
			</ul>
		</nav>
		<!-- /.navbar -->

		<!-- Main Sidebar Container -->
		<aside class="main-sidebar sidebar-dark-primary elevation-4">
			<!-- Brand Logo -->
			<a href="index3.html" class="brand-link">
				<span class="brand-text font-weight-light"></span>
				<img style="width:220px" src="<?= base_url() ?>/assets/icons/logo.png" />
			</a>

			<!-- Sidebar -->
			<div class="sidebar">
				<!-- Sidebar user panel (optional) -->
				<div class="user-panel mt-3 pb-3 mb-3 d-flex">
					<!-- <div class="image">
          <img src="<?= base_url() ?>assets/bootstrap/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
        </div> -->
					<div class="info">
						<a href="#" class="d-block"><?= $_SESSION["name"] ?></a>
					</div>
				</div>

				<!-- Sidebar Menu -->
				<nav class="mt-2">
					<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
						<!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
						<?php foreach ($menus as $menu) : ?>
							<?php
							$href = '#';
							$onclick = '';
							if (!empty($menu['MenuModule'])) {
								$href = site_url($menu['MenuModule']);
								$onclick = 'link(this.href);';
							} elseif (!empty($menu['child_module']) and !empty($menu['child_param'])) {
								$href = site_url($menu['child_module']) . '/index/' . $menu['child_param'];
								$onclick = 'link(this.href);';
							}
							?>
							<li class="nav-item">
								<a class="nav-link" href="<?php echo $href ?>" onclick="<?php echo $onclick ?> return false;">
									<i class="<?php echo $menu['MenuIcon'] ?> nav-icon"></i>
									<p><?php echo $menu['MenuName'] ?>
										<?php echo (!empty($menu['child'])) ? '<i class="right fas fa-angle-left"></i>' : "" ?>
									</p>
								</a>
								<?php if (!empty($menu['child'])) : ?>
									<ul class="nav nav-treeview">
										<?php foreach ($menu['child'] as $child) : ?>
											<?php
											$child_href = '';
											if (!empty($child['MenuModule'])) {
												$child_href = site_url($child['MenuModule'] . (!empty($child['MenuParam']) ? '/index/' . $child['MenuParam'] : ''));
											} elseif (!empty($child['child_module']) and !empty($child['child_param'])) {
												$child_href = site_url($child['child_module']) . '/index/' . $child['child_param'];
											}
											?>
											<li class="nav-item"><a href="<?php echo $child_href; ?>" onclick="link(this.href); return false;" class="nav-link" style="margin-left:20px">
													<?php if ($child['MenuIcon']) : ?>
														<i class="<?php echo $child['MenuIcon'] ?> nav-icon"></i>
													<?php endif ?>
													<p style="margin-left: 5px; "><?php echo $child['MenuName'] ?></p>
												</a></li>
										<?php endforeach ?>
									</ul>
								<?php endif ?>
							</li>
						<?php endforeach ?>
					</ul>
				</nav>
				<!-- /.sidebar-menu -->
			</div>
			<!-- /.sidebar -->
		</aside>

		<!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper" id="wrapper" style="background:#ffffff">
