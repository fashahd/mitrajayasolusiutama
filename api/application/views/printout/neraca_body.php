<?php
/**
 * @Author: fikri
 * @Date:   2020-03-19
 */
$baseurlnya = base_url();
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
				<td width="100%"  style="text-align:center">
					<div style="font-size:9pt;letter-spacing: 0.5em;">PT. Mitrajaya Solusi Utama</div>
					<div style="font-size:9pt;letter-spacing: 0.5em;">Per <?=date("t F Y", strtotime($data["Year"]."-".$data["Month"]."-01"));?></div>
				</td>
			</tr>
		</table>
		<div class="row">
			<div class="col-lg-6">
				<table class="table-border-half" width="48%" border="0" cellpadding="2" style="margin-top:10px;float:left;margin-right:10px;margin-bottom:0px">
					<tr>
						<td colspan="2" style="font-size:10pt"><b>Aktiva Lancar</b></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Kas</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Kas"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Kas Kecil</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["KasKecil"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Bank 1</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Bank1"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Bank 2</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Bank2"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Piutang Karyawan</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["PiutangKaryawan"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Persediaan</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Persediaan"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Piutang Dagang</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["PiutangDagang"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Pajak Dimuka</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["PajakDimuka"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000"></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalAktivaLancar"],2)?></td>
					</tr>
					<tr>
						<td colspan="2" style="font-size:10pt"><b>Aktiva Tetap</b></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Perlengkapan Kantor</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["PerlengkapanKantor"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Akumulasi</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Akumulasi"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000"></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalAktivTetap"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000"></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Total</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Total"],2)?></td>
					</tr>
				</table>
				<table class="table-border-half" width="48%" border="0" cellpadding="2" style="margin-top:10px;float:left;margin-right:10px">
					<tr>
						<td colspan="2" style="font-size:10pt"><b>Pasiva</b></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Hutang Direksi</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["HutangDireksi"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Hutang Pajak</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["HutangPajak"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000;font-size:10pt"><b>Modal</b></td>
						<td style="border:none; border-bottom:1px solid #000;font-size:10pt"><b>Rp <?=number_format($data["Modal"],2)?></b></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Laba/Rugi Bertahan</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["LabaRugiBertahan"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Laba Rugi Berjalan</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["LabaRugiBerjalan"],2)?></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Total</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalPasiva"],2)?></td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>
