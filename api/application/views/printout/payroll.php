<?php

/**
 * @Author: fikri
 * @Date:   2020-03-19
 */
$baseurlnya = base_url();
// $baseurlnya = str_replace('http://','https://',$baseurlnya);

// echo "<pre>";print_r($PayrollData);die;
$history = "";
$total_history = 0;
$net_salary = $PayrollData["salary"] - $PayrollData["total_deduction"];
?>

<style type="text/css">
	.gm-style-cc:last-child {
		display: none !important;
		height: 0px !important;
	}

	a[title="Report errors in the road map or imagery to Google"] {
		display: none !important;
		height: 0px !important;
	}

	a[href="https://www.google.com/intl/en-US_US/help/terms_maps.html"] {
		display: none !important;
		height: 0px !important;
	}
</style>

<div class="page">
	<div id="mainContainer">
		<table width="100%" border="0" cellpadding="2" style="border:none">
			<tr>
				<td height="60px" width="20%" align="center" style="vertical-align:middle;">
					<img src="<?php echo base_url() ?>assets/logo/logo-msu.png" style="width:80px" onerror="this.onerror=null;">
				</td>
				<td width="80%" style="text-align:center" colspan="2">
					<div style="font-size:16pt;color:#000"><u>PT. MITRAJAYA SOLUSI UTAMA</u></div>
					<span style="color:#000">Jl. Tentara Pelajar No. 21 RT 004/008, Jakarta 12210</span>
					<span style="color:#000">Phone (021) 53653465</span>
				</td>
			</tr>
		</table>
		<hr style="border-top: 4px solid #5188B9">
		<table width="100%" border="0" cellpadding="2" style="border:none;margin-top:20px">
			<tr>
				<td width="100%" style="text-align:center" colspan="2">
					<div style="font-size:14pt;color:#000"><u>SLIP GAJI KARYAWAN</u></div>
					<span style="color:#000">Periode : <?= date("F", strtotime($PayrollData["year"] . "-" . $PayrollData["month"] . "-01")) . " " . $PayrollData["year"] ?></span>
				</td>
			</tr>
		</table>
		<table width="100%" border="0" cellpadding="2" style="border:none;margin-top:40px;font-weight:800;font-size:9pt">
			<tr>
				<td>No. Induk</td>
				<td>:</td>
				<td><?= $PayrollData["people_ext_id"] ?></td>
			</tr>
			<tr>
				<td style="width: 30%">Nama</td>
				<td>:</td>
				<td><?= $PayrollData["people_name"] ?></td>
			</tr>
			<tr>
				<td>Jabatan</td>
				<td>:</td>
				<td><?= $PayrollData["position_name"] ?></td>
			</tr>
			<tr>
				<td>
					<h3>Gaji Bruto (A)</h3>
				</td>
				<td>:</td>
				<td>
					<h3>Rp <?= number_format($PayrollData["salary"], 2) ?></h3>
				</td>
			</tr>
		</table>
		<table width="100%" border="0" cellpadding="2" style="border:none;margin-top:40px;font-weight:600;font-size:9pt">
			<tr>
				<td>
					<h3>Potongan (B)</h3>
				</td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td>BPJS TK</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["deduction_bpjs_tk"], 2) ?></td>
			</tr>
			<tr>
				<td style="width: 30%">BPJS Kesehatan</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["deduction_bpjs_kesehatan"], 2) ?></td>
			</tr>
			<tr>
				<td>PPh 21 Gaji</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["deduction_pph_21"], 2) ?></td>
			</tr>
			<tr>
				<td>PPh 21 Insentif</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["deduction_pph_21_insentif"], 2) ?></td>
			</tr>
			<tr>
				<td>Kasbon</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["deduction_kasbon"], 2) ?></td>
			</tr>
		</table>
		<table width="100%" border="0" cellpadding="2" style="border:none;margin-top:40px;font-weight:600;font-size:9pt">
			<tr>
				<td style="width: 30%">Total (A)</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["salary"], 2) ?></td>
			</tr>
			<tr>
				<td>Total (B)</td>
				<td>:</td>
				<td>Rp <?= number_format($PayrollData["total_deduction"], 2) ?></td>
			</tr>
		</table>
		<table width="100%" border="1" cellpadding="2" style="border:1px solid #000;margin-top:40px;font-weight:600;font-size:9pt;background:#b7d0e5">
			<tr>
				<td style="width:80%; text-align:center">Penerimaan Bersih (A-B)</td>
				<td colspan="2">: Rp <?= number_format($net_salary, 2) ?></td>
			</tr>
			<tr>
				<td style="width:60%; text-align:center" colspan="4">Terbilang : #<?= terbilang(round($net_salary)) ?> Rupiah</td>
			</tr>
		</table>
		<div style="white-space: pre; padding-right: 100px">
			<p style="text-align: right;font-size:10pt">Jakarta, <?=($PayrollData["date_state"] != '') ? date("d F Y", strtotime($PayrollData["date_state"])) : ''?></p>
			<img style="float:right" width="250" src="<?=($PayrollData["document"] != '') ? $PayrollData["document"] : ''?>">
			<br>
			<br>
			<p style="text-align: right;font-size:10pt"><?=($PayrollData["signatrue_name"] != '') ? $PayrollData["signatrue_name"] : ''?></p>
		</div>
	</div>

</div>
