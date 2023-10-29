</div>
<!-- /.content-wrapper -->
<footer class="main-footer">
	<strong>Copyright &copy; <?= date("Y") ?> <a href="#">PT. Mitrajaya Solusi Utama</a>.</strong>
	All rights reserved.
	<div class="float-right d-none d-sm-inline-block">
		<b>Version</b> 1.0
	</div>
</footer>
</div>
<!-- ./wrapper -->

<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
	$.widget.bridge('uibutton', $.ui.button)
</script>
<!-- Bootstrap 4 -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- ChartJS -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/chart.js/Chart.min.js"></script>
<!-- Sparkline -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/sparklines/sparkline.js"></script>
<!-- JQVMap -->
<!-- <script src="<?= base_url() ?>assets/bootstrap/plugins/jqvmap/jquery.vmap.min.js"></script> -->
<!-- <script src="<?= base_url() ?>assets/bootstrap/plugins/jqvmap/maps/jquery.vmap.usa.js"></script> -->
<!-- jQuery Knob Chart -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/jquery-knob/jquery.knob.min.js"></script>
<!-- daterangepicker -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/moment/moment.min.js"></script>
<script src="<?= base_url() ?>assets/bootstrap/plugins/daterangepicker/daterangepicker.js"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
<!-- Summernote -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/summernote/summernote-bs4.min.js"></script>
<!-- overlayScrollbars -->
<script src="<?= base_url() ?>assets/bootstrap/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<!-- AdminLTE App -->
<script src="<?= base_url() ?>assets/bootstrap/dist/js/adminlte.js"></script>
<!-- AdminLTE for demo purposes -->
<!-- <script src="<?= base_url() ?>assets/bootstrap/dist/js/demo.js"></script> -->
<!-- AdminLTE dashboard demo (This is only for demo purposes) -->
<!-- <script src="<?= base_url() ?>assets/bootstrap/dist/js/pages/dashboard.js"></script> -->

<script src="<?= base_url() ?>assets/lib/jquery.nanoscroller/javascripts/jquery.nanoscroller.min.js" type="text/javascript"></script>
<script src="<?= base_url() ?>assets/js/main.js" type="text/javascript"></script>
<script src="<?= base_url() ?>assets/lib/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="<?= base_url() ?>assets/lib/datetimepicker/js/bootstrap-datetimepicker.min.js" type="text/javascript"></script>
<script src="<?= base_url() ?>assets/lib/jquery.gritter/js/jquery.gritter.js" type="text/javascript"></script>
<script src="<?= base_url() ?>js/add.js" type="text/javascript"></script> <!-- except -->
<script src="<?= base_url() ?>js/functions.js" type="text/javascript"></script> <!-- except -->
<script src="<?= base_url() ?>js/jquery.fullscreen.min.js" type="text/javascript"></script> <!-- except -->
<script src="<?= base_url() ?>js/plugins/print-lib.js" type="text/javascript"></script>

<script type='text/javascript'>
	/*
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-46635047-1', 'cocoatrace.com');
    ga('send', 'pageview');
    */

	$(window).on('load', function() {
		$('#loading').fadeOut();
	});

	$(document).ready(function() {
		$('body').css('display', 'none');
		$('body').fadeIn(500);


		$("#logo a, #sidebar_menu a:not(.accordion-toggle), a.ajx").click(function() {
			//event.preventDefault();
			//newLocation = this.href;
			//$('body').fadeOut(500, newpage);
		});

		function newpage() {
			window.location = newLocation;
		}
		setTimeout(window.loadGoogleMaps(), 100);

		//getNotifHeader();
		//loadAnnouncement();
		//loadDocument();

	});

	/*
	 * GOOGLE MAPS
	 * description: Append google maps to head dynamically
	 */

	var gMapsLoaded = false;
	window.gMapsCallback = function() {
		gMapsLoaded = true;
		$(window).trigger('gMapsLoaded');
	}
	window.loadGoogleMaps = function(callback) {
		if (gMapsLoaded)
			return window.gMapsCallback();
		var script_tag = document.createElement('script');
		script_tag.setAttribute("type", "text/javascript");
		script_tag.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyDbGS38WjSvRp-gg8E_M8HndT8cu1MaC-A &libraries=places,drawing&callback=gMapsCallback");
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
		if (callback) {
			callback();
		}
	}
	/* ~ END: BAIDU MAPS */
	/*
	 * BAIDU MAPS
	 * description: Append google maps to head dynamically
	 */

	var bMapsLoaded = false;
	window.bMapsCallback = function() {
		bMapsLoaded = true;
		$(window).trigger('bMapsLoaded');
	}
	// window.loadBaiduMaps = function(callback) {
	//     if (bMapsLoaded)
	//         return window.bMapsCallback();
	//     var protocol = location.protocol;
	//     var script_tag = document.createElement('script');
	//     script_tag.setAttribute("type", "text/javascript");
	//     script_tag.setAttribute("src", protocol+"//api.map.baidu.com/api?v=2.0&ak=xAs9K0QDgzbAQr4KoZHn8PWZO9OtHeTd&callback=bMapsCallback");
	//     (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	//     if (callback) {
	//         callback();
	//     }
	// }
	/* ~ END: BAIDU MAPS */

	/*
	 * LOAD SCRIPTS
	 * Usage:
	 * Define function = myPrettyCode ()...
	 * loadScript("js/my_lovely_script.js", myPrettyCode);
	 */

	var jsArray = {};

	function loadScript(scriptName, callback) {

		if (!jsArray[scriptName]) {
			jsArray[scriptName] = true;

			// adding the script tag to the head as suggested before
			var body = document.getElementsByTagName('body')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = scriptName;

			// then bind the event to the callback function
			// there are several events for cross browser compatibility
			//script.onreadystatechange = callback;
			script.onload = callback;

			// fire the loading
			body.appendChild(script);

		} else if (callback) { // changed else to else if(callback)
			// console.log("JS file already added!");
			//execute function
			callback();
		}

	}

	/* ~ END: LOAD SCRIPTS */
</script>
<!--<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACXVwWCJen2OZeCAEYdRxP_HEh7CkxOvs&sensor=false"></script>-->

<script language="javascript" type="text/javascript" src="<?php echo $this->config->item('SpcCDN') ?>/js/gmap3.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
		//initialize the javascript
		App.init();
		// App.dashboard();

		//ambil data notifikasi header
		var interval = <?php echo $this->config->item('NotifInterval') ?>;
		if (interval * 1 > 1) {
			setInterval(function() {
				getNotifHeader();
				getNotifHeaderCert();
			}, interval * 1);
		}

		//form feedback
		$(document).on("submit", "#formMainFeedback", function(e) {
			e.preventDefault();

			//cek validasi form
			var titleFeedback = $("#titleFeedback").val();
			var contentFeedback = $("#contentFeedback").val();
			if (titleFeedback == "") {
				Ext.MessageBox.show({
					title: 'Notifications',
					msg: 'Title is empty',
					buttons: Ext.MessageBox.OK,
					animateTarget: 'mb9',
					icon: 'ext-mb-warning'
				});
				return false;
			}
			if (contentFeedback == "") {
				Ext.MessageBox.show({
					title: 'Notifications',
					msg: 'Content is empty',
					buttons: Ext.MessageBox.OK,
					animateTarget: 'mb9',
					icon: 'ext-mb-warning'
				});
				return false;
			}

			Ext.MessageBox.show({
				msg: 'Submitting your data, please wait...',
				progressText: 'Saving...',
				width: 300,
				wait: true,
				waitConfig: {
					interval: 200
				},
				icon: 'ext-mb-download', //custom class in msg-box.html
				animateTarget: 'mb7'
			});

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: m_api + '/cms_feedback/insert_feedback',
				method: 'POST',
				params: {
					titleFeedback: titleFeedback,
					contentFeedback: contentFeedback
				},
				success: function(response, opts) {
					Ext.MessageBox.hide();
					$("#titleFeedback").val('');
					$("#contentFeedback").val('');

					Ext.MessageBox.show({
						title: 'Notifications',
						msg: 'Feedback sent successfully!',
						buttons: Ext.MessageBox.OK,
						animateTarget: 'mb9',
						icon: 'ext-mb-info'
					});
				},
				failure: function(response, opts) {
					Ext.MessageBox.hide();
					Ext.MessageBox.show({
						title: 'Notifications',
						msg: 'Failed to send feedback!',
						buttons: Ext.MessageBox.OK,
						animateTarget: 'mb9',
						icon: 'ext-mb-error'
					});
				}
			});

		});

	});
</script>
</body>

</html>
