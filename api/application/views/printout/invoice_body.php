<?php
/**
 * @Author: fikri
 * @Date:   2020-03-19
 */
$baseurlnya = base_url();
// $baseurlnya = str_replace('http://','https://',$baseurlnya);

//echo "<pre>";print_r($invoice_history["data"]);die;
$history = "";
$total_history = 0;
$percentage_current = ($invoicedata["InvoiceAmount"]/$invoicedata["ContractAmount"]) * 100;
if(count($invoice_history["data"]) > 0){
	$history .= "<tr>
	<td style='border:none; border-right:1px solid #000'></td>
	<td style='border:none; border-right:1px solid #000'><b>Dikurangi :</b></td>
	<td style='border:none; border-right:1px solid #000'></td>
	<td style='border:none; border-right:1px solid #000'></td>
	<td style='border:none; border-right:1px solid #000'></td>
	</tr>";
	foreach($invoice_history["data"] as $row){
		$percentage = number_format(($row["InvoiceAmount"]/$row["ContractAmount"]) * 100);
		$history .= "<tr>
		<td style='border:none; border-right:1px solid #000'></td>
		<td style='border:none; border-right:1px solid #000'>- $row[Description]</td>
		<td style='border:none; border-right:1px solid #000'>".$percentage."%</td>
		<td style='border:none; border-right:1px solid #000'><span style='float:left'>Rp</span> <span style='float:right'>".number_format($row["InvoiceAmount"])."</span></td>
		<td style='border:none;'><span style='float:left'>Rp</span> <span style='float:right'>".number_format($row["InvoiceAmount"])."</span></td>
		</tr>";
		
		$total_history += $percentage;
	}
}

$percentage_total = $percentage_current+$total_history;
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
					<img src="<?php echo base_url() ?>assets/logo/logo-msu.png" style="width:80px"  onerror="this.onerror=null;">
				</td>
				<td width="20%">&nbsp;</td>
				<td width="20%"  style="text-align:center">
					<div style="font-size:16pt;letter-spacing: 0.5em;color:#4F80AD"><u>INVOICE</u></div>
					<span style="color:#4F80AD">No: <?=$invoicedata["InvoiceNumber"]?></span>
				</td>
				<td width="20%">&nbsp;</td>
				<td width="20%">&nbsp;</td>
			</tr>
		</table>
		<table width="60%" border="0" cellpadding="2" style="border:none;margin-top:20px">
			<tr>
				<td>Date</td>
				<td>:</td>
				<td><?=$invoicedata["InvoiceGR"]?></td>
			</tr>
			<tr>
				<td style="width: 40%">Tax Number</td>
				<td>:</td>
				<td><?=$invoicedata["TaxNumber"]?></td>
			</tr>
			<tr>
				<td>Based on PO </td>
				<td>:</td>
				<td><?=$invoicedata["PoNumber"]?></td>
			</tr>
			<tr>
				<td>Project Name </td>
				<td>:</td>
				<td><?=($invoicedata["ProjectName"] != "") ? "(".$invoicedata["ProjectName"].")" : ""?> <?=$invoicedata["PODescription"]?></td>
			</tr>
			<tr>
				<td>Amount Contract</td>
				<td>:</td>
				<td>Rp <?=number_format($invoicedata["ContractAmount"])?> (Excld. Tax)</td>
			</tr>
			<tr>
				<td>Terms</td>
				<td>:</td>
				<td><?=$invoicedata["DueDatePeriod"]?> days after invoice received</td>
			</tr>
			<tr>
				<td style="padding-top: 10px;">To</td>
				<td style="padding-top: 10px;">:</td>
				<td style="padding-top: 10px;"><b><?=$invoicedata["CustomerName"]?></b></td>
			</tr>
			<tr>
				<td></td>
				<td></td>
				<td><?=$invoicedata["CustomerAddress"]?></td>
			</tr>
			<tr>
				<td style="padding-top: 10px;">Attn</td>
				<td style="padding-top: 10px;">:</td>
				<td style="padding-top: 10px;"><b>Finance and Accounting Manager</b></td>
			</tr>
		</table>
		<table class="table-border" width="100%" border="0" cellpadding="2" style="margin-top:10px">
			<tr>
				<td style="width:5%">No</td>
				<td style="width:50%">Description</td>
				<td style="width:5%">Bobot</td>
				<td style="width:20%">Price/Unit</td>
				<td style="width:20%">Total Amount</td>
			</tr>
			<tr>
				<td style="border:none; border-right:1px solid #000">001</td>
				<td style="border:none; border-right:1px solid #000"><b><?=$invoicedata["Description"]?></b></td>
				<td style="border:none; border-right:1px solid #000"><?=$percentage_total?>%</td>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000">Rp <span style="float:right"><?=number_format(($invoicedata["ContractAmount"] * $percentage_total / 100))?></span></td>
			</tr>
			<tr>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000">Nilai Kontrak <span style="float:right">Rp <?=number_format($invoicedata["ContractAmount"])?></span></td>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000"></td>
			</tr>
			<!-- <tr>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000"><b><u>Rincian Tagihan :</u></b> 
					<br>Tagihan <?=$invoicedata["ProjectName"]?></span>
				</td>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000">Rp <?=number_format($invoicedata["InvoiceAmount"])?></td>
				<td style="border:none; border-right:1px solid #000">Rp <?=number_format($invoicedata["ContractAmount"])?></td>
			</tr> -->
			<?=$history?>
			<?php if(count($invoice_history["data"]) > 3){?>
			</table>
		</div>
	</div>
<div class="page">
	<div id="mainContainer">
		<table class="table-border" width="100%" border="0" cellpadding="2" style="margin-top:10px">
		<tr>
				<td style="width:5%">No</td>
				<td style="width:50%">Description</td>
				<td style="width:5%">Bobot</td>
				<td style="width:20%">Price/Unit</td>
				<td style="width:20%">Total Amount</td>
			</tr>
			<?php }
			?>
			<tr>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none; border-right:1px solid #000"><b><u>Tagihan Saat Ini :</u></b> 
					<br><?=$invoicedata["Description"]?></span>
				</td>
				<td style="border:none; border-right:1px solid #000"><?=number_format($percentage_current)?>%</td>
				<td style="border:none; border-right:1px solid #000"></td>
				<td style="border:none"><span style="float:left">Rp</span> <span style="float:right"><?=number_format($invoicedata["InvoiceAmount"])?></span></td>
			</tr>
			<tr>
				<td colspan="4"><span style="float:right">Sub Total</span></td>
				<td><span style="float:left">Rp</span> <span style="float:right"><?=number_format($invoicedata["InvoiceAmount"])?></span></td>
			</tr>
			<tr>
				<td colspan="4"><span style="float:right">PPN <?=$invoicedata["VATPercent"]?>%</span></td>
				<td><span style="float:left">Rp</span> <span style="float:right"><?=number_format($invoicedata["InvoiceVAT"])?></span></td>
			</tr>
			<?php if($invoicedata["pph"] == "yes"){ 
				$invoicedata["InvoiceTotal"] = ($invoicedata["InvoiceTotal"] - $invoicedata["PPH23Value"]);
				?>
			<tr>
				<td colspan="4"><span style="float:right">PPh 23</span></td>
				<td><span style="float:left">- Rp</span><span style="float:right"> <?=number_format($invoicedata["PPH23Value"])?></span></td>
			</tr>
			<?php } ?>
			<tr>
				<td colspan="4"><span style="float:right">Grand Total</span></td>
				<td><span style="float:left">Rp</span> <span style="float:right"><?=number_format($invoicedata["InvoiceTotal"])?></span></td>
			</tr>
			<tr>
				<td colspan="5" style="padding:10px"><b>Terbilang : <i># <?=terbilang(round($invoicedata["InvoiceTotal"]))?> Rupiah #</i></b></td>
			</tr>
			<tr>
				<td colspan="5" style="border:none;padding:10px">
					Note : <br>
					- Bank Account 	: BCA<br>
					- Acc Name 		: PT. Mitrajaya Solusi Utama<br>
					- Acc No (IDR)  : 111-045-6456<br>
					Please, Transfer in " Full Amount"<br>
				</td>
			</tr>
			<tr>
				<td colspan="3" style="border: none"></td>
				<td colspan="2" style="border: none; text-align:center">
					PT. MitraJaya Solusi Utama<br><br><br><br><br><br><br><br><br><br><br>

					<u>Mulyono</u><br>
					Direktur
				</td>
			</tr>
		</table>
	</div>

</div>
