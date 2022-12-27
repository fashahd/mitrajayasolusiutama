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
					<div style="font-size:9pt;letter-spacing: 0.5em;">Per <?=date("F Y", strtotime($data["Year"]."-".$data["Month"]."-01"));?></div>
				</td>
			</tr>
		</table>
		<div class="row">
			<div class="col-lg-6">
				<table class="table-border-half" width="62%" border="0" cellpadding="1" style="margin-top:10px;float:left;margin-right:10px;margin-bottom:0px">
					<tr>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>Pendapatan</b></td>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>Bulan Ini</b></td>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Pendapatan</td>
						<td style="border:none; border-bottom:1px solid #000"></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Pendapatan"],2)?></td>
					</tr>
					<tr>
						<td colspan="2" style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>BIAYA OPERASIONAL</b></td>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b></b></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">PROYEK</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Proyek"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">TRANSPORT</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Transport"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">ANTIGEN</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Antigen"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">ATK</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ATK"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">ENTERTAIN</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Entertaint"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">MATERAI</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Materai"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">ADM</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ADM"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">ART</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ART"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">PENGIRIMAN BARANG</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["PengirimanBarang"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">IURAN</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Iuran"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">PENGOBATAN</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Pengobatan"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">ART</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ART2"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">BPJS</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["BPJS"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">LISTRIK & INET</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ListrikInet"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">INSENTIVE</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Insentive"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">SALARY</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Salary"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">BIAYA PENYUSUTAN</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["BiayaPenyusutan"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>TOTAL BIAYA OPERASIONAL</b></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalBiayaOperasional"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td colspan="2" style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>Pendapatan/Biaya Lain Lain</b></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">BIAYA ADMINISTRASI BANK</td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["BiayaAdminBank"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>Total Pendapatan/Biaya Lain</b></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalPendapatanLain"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>LABA(RUGI)</b></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["LabaRugi"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
				</table>
				<table class="table-border-half" width="35%" border="0" cellpadding="1" style="margin-top:10px;float:left;margin-right:10px">
					<tr>
						<td colspan="2" style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>Bulan Jan <?=($data["Month"] > 1) ? " - ".date("F", strtotime($data["Year"]."-".$data["Month"]."-01")) : ""?></b></td>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"></td>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format(($data["Pendapatan"]+$data["PendapatanCalculateTemp"]),2)?></td>
					</tr>
					<tr>
						<td colspan="2" style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>BIAYA OPERASIONAL</b></td>
						<td style="font-size:9pt;border:none; border-bottom:1px solid #000"><b></b></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Proyek"] + $data["ProyekCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Transport"] + $data["TransportCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Antigen"] + $data["AntigenCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ATK"] + $data["ATKCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Entertaint"] + $data["EntertaintCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Materai"] + $data["MateraiCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ADM"] + $data["ADMCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ART"] + $data["ARTCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["PengirimanBarang"] + $data["PengirimanBarangCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Iuran"] + $data["IuranCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Pengobatan"] + $data["PengobatanCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ART2"] + $data["ART2Calculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["BPJS"] + $data["BPJSCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["ListrikInet"] + $data["ListrikInetCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Insentive"] + $data["InsentiveCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["Salary"] + $data["SalaryCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["BiayaPenyusutan"] + $data["BiayaPenyusutanCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalBiayaOperasional"] + $data["TotalBiayaOperasionalCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td colspan="2" style="font-size:9pt;border:none; border-bottom:1px solid #000"><b>Pendapatan/Biaya Lain Lain</b></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["BiayaAdminBank"] + $data["BiayaAdminBankCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["TotalPendapatanLain"] + $data["TotalPendapatanLainCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
					<tr>
						<td style="border:none; border-bottom:1px solid #000">Rp <?=number_format($data["LabaRugi"] + $data["LabaRugiCalculate"])?></td>
						<td style="border:none; border-bottom:1px solid #000"></td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>
