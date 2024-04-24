<?php

defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

// use namespace
use Restserver\Libraries\REST_Controller;
// Reference the Dompdf namespace 
use Dompdf\Dompdf;

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Payroll extends REST_Controller
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();

		$this->load->model("mpayroll");
	}

	public function print_pay_slip_get()
	{
		$people_id 	= $_GET["people_id"];
		$month 		= $_GET["month"];
		$year 		= $_GET["year"];

		// Header
		$dataHeader['titleNya'] = "Print Pay Slip";
		$this->load->view('printout/print_header', $dataHeader);


		// Body
		$this->cetak_payroll($people_id, $month, $year);
	}

	public function cetak_payroll($people_id, $month, $year)
	{

		$payroll			= $this->mpayroll->form_payroll($month, $year, $people_id);

		$paramPost = array();
		if (is_array($payroll['data'])) {
			foreach ($payroll['data'] as $key => $value) {
				$keyNew = str_replace("MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-", '', $key);
				if ($value == "") {
					$value = null;
				}
				$paramPost[$keyNew] = $value;
			}
		}

		// echo "<pre>";print_r($paramPost);die;

		$data["PayrollData"] = $paramPost;

		$this->load->view('printout/payroll', $data);
	}

	function list_employee_get()
	{
		$pSearch["Year"]    = $this->get("Year");
		$pSearch["Month"]   = $this->get("Month");

		//sort
		$sorting = json_decode($this->get('sort'));
		if (isset($sorting[0]->property)) {
			$sortingField = $sorting[0]->property;
		} else {
			$sortingField = null;
		}

		if (isset($sorting[0]->direction)) {
			$sortingDir = $sorting[0]->direction;
		} else {
			$sortingDir = null;
		}

		$start = (int) $this->get('start');
		$limit = (int) $this->get('limit');

		// echo '<pre>'; print_r($pSearch); exit;
		$data = $this->mpayroll->list_employee($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function list_expense_get()
	{
		$pSearch["Year"]    = $this->get("Year");
		$pSearch["Month"]   = $this->get("Month");

		//sort
		$sorting = json_decode($this->get('sort'));
		if (isset($sorting[0]->property)) {
			$sortingField = $sorting[0]->property;
		} else {
			$sortingField = null;
		}

		if (isset($sorting[0]->direction)) {
			$sortingDir = $sorting[0]->direction;
		} else {
			$sortingDir = null;
		}

		$start = (int) $this->get('start');
		$limit = (int) $this->get('limit');

		// echo '<pre>'; print_r($pSearch); exit;
		$data = $this->mpayroll->list_expense($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function submit_expenses_post()
	{
		$varPost = $_POST;
		$paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Finance_BudgetPlan_WinFormExpenses-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		$paramPost["BudgetAmount"] = str_replace(",", "", $paramPost["BudgetAmount"]);
		$paramPost["BudgetActual"] = str_replace(",", "", $paramPost["BudgetActual"]);

		if ($varPost["OpsiDisplay"] == "insert") {
			$proses = $this->mpayroll->submit_expsense($paramPost);
		}

		if ($varPost["OpsiDisplay"] == "update") {
			$proses = $this->mpayroll->update_expsense($paramPost);
		}

		if ($proses['success'] == true) {
			$this->response($proses, 200);
		} else {
			$this->response($proses, 400);
		}
	}

	function submit_setting_post()
	{
		$varPost = $_POST;

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}
		$post["signature"] = $paramPost["document_old"];
		$post["name"] = $paramPost["signatrue_name"];

		//cek folder propinsi itu sudah ada belum
		if (!file_exists('files/payroll/setting')) {
			mkdir('files/payroll/setting', 0777, true);
		}

		$ExtNya = GetFileExt($post["signature"]);
		$gambar = time() . "_signature." . $ExtNya;

		$upload = rename($post["signature"], 'files/payroll/setting/' . $gambar);

		$post["signature"] = 'files/payroll/setting/' . $gambar;

		$this->db->where("id", "1");
		$this->db->update("mj_payroll_setting", $post);


		$results['success'] = true;
		$results['message'] = "Data saved";
		$this->response($results, 200);
	}

	function signature_upload_post()
	{
		//Cek file images
		$ExtNya = GetFileExt($_FILES['MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-document']['name']);
		if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
			$result['success'] = false;
			$result['message'] = lang('File types not allowed');
			$this->response($result, 400);
		} else {
			if ($_FILES['MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-document']['name'] != '') {
				$gambar = date('Ymdhis') . '_' . str_replace(" ", "_", strtolower($_FILES['MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-document']['name']));
				$fileupload['MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-document'] = $_FILES['MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-document'];

				$data_exist = $_POST["MitraJaya_view_Admin_Payroll_WinFormSettingPayroll-FormBasicData-document_old"];

				//cek folder propinsi itu sudah ada belum
				if (file_exists($data_exist)) {
					unlink($data_exist);
				}

				$upload = move_upload($fileupload, 'files/tmp/' . $gambar);

				if (isset($upload['upload_data'])) {
					$result['success'] = true;
					$result['FilePath'] = 'files/tmp/' . $upload["upload_data"]["file_name"];
					$result['file'] = base_url() . 'files/tmp/' . $upload["upload_data"]["file_name"];
					$this->response($result, 200);
				} else {
					$result['success'] = false;
					$result['message'] = 'Upload failed';
					$this->response($result, 400);
				}
			}
		}
	}

	function submit_payroll_post()
	{
		$varPost = $_POST;
		$paramPost = array();
		$this->db->trans_begin();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Admin_Payroll_WinFormPayroll-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		unset($paramPost["OpsiDisplay"]);

		$paramPost["salary"] = ($paramPost["salary"] != '') ? str_replace(",", "", $paramPost["salary"]) : '0';
		$paramPost["insentif_transportasi"] = ($paramPost["insentif_transportasi"] != '') ? str_replace(",", "", $paramPost["insentif_transportasi"]) : '0';
		$paramPost["insentif_komunikasi"] = ($paramPost["insentif_komunikasi"] != '') ? str_replace(",", "", $paramPost["insentif_komunikasi"]) : '0';
		$paramPost["insentif_lembur"] = ($paramPost["insentif_lembur"] != '') ? str_replace(",", "", $paramPost["insentif_lembur"]) : '0';
		$paramPost["insentif_bonus"] = ($paramPost["insentif_bonus"] != '') ? str_replace(",", "", $paramPost["insentif_bonus"]) : '0';
		$paramPost["insentif_thr"] = ($paramPost["insentif_thr"] != '') ? str_replace(",", "", $paramPost["insentif_thr"]) : '0';
		$paramPost["deduction_bpjs_tk"] = ($paramPost["deduction_bpjs_tk"] != '') ? str_replace(",", "", $paramPost["deduction_bpjs_tk"]) : '0';
		$paramPost["deduction_bpjs_kesehatan"] = ($paramPost["deduction_bpjs_kesehatan"] != '') ? str_replace(",", "", $paramPost["deduction_bpjs_kesehatan"]) : '0';
		$paramPost["deduction_kasbon"] = ($paramPost["deduction_kasbon"] != '') ? str_replace(",", "", $paramPost["deduction_kasbon"]) : '0';
		$paramPost["deduction_pph_21_insentif"] = ($paramPost["deduction_pph_21_insentif"] != '') ? str_replace(",", "", $paramPost["deduction_pph_21_insentif"]) : '0';
		$paramPost["deduction_pph_21"] = ($paramPost["deduction_pph_21"] != '') ? str_replace(",", "", $paramPost["deduction_pph_21"]) : '0';
		$paramPost["deduction_pph_21_kompensasi"] = ($paramPost["deduction_pph_21_kompensasi"] != '') ? str_replace(",", "", $paramPost["deduction_pph_21_kompensasi"]) : '0';
		$paramPost["deduction_pph_21_thr"] = ($paramPost["deduction_pph_21_thr"] != '') ? str_replace(",", "", $paramPost["deduction_pph_21_thr"]) : '0';

		$query = $this->db->query("SELECT * FROM mj_payroll WHERE people_id = ? AND month = ? AND year = ?", [$paramPost['people_id'], $paramPost['month'], $paramPost['year']]);
		if ($query->num_rows() > 0) {
			$this->db->where("people_id", $paramPost["people_id"]);
			$this->db->where("year", $paramPost["year"]);
			$this->db->where("month", $paramPost["month"]);
			$this->db->update("mj_payroll", $paramPost);
		} else {
			$this->db->insert("mj_payroll", $paramPost);
		}

		if ($this->db->trans_status() === false) {
			$this->db->trans_rollback();
			$results['success'] = false;
			$results['message'] = "Failed to save data";
			//function table temp
			$this->response($results, 400);
		} else {
			$this->db->trans_commit();
			$results['success'] = true;
			$results['message'] = "Data saved";
			$this->response($results, 200);
		}
	}

	function form_payroll_get()
	{
		$Month 	= $this->get("Month");
		$Year 	= $this->get("Year");
		$people_id 	= $this->get("people_id");

		$data = $this->mpayroll->form_payroll($Month, $Year, $people_id);

		$this->response($data, 200);
	}

	function form_payroll_setting_get()
	{
		$this->db->select("signature as document_old, name as signatrue_name, signature as document");
		$query = $this->db->get("mj_payroll_setting")->result_array();

		$result = array();
		if ($query[0]) {
			foreach ($query[0] as $row => $value) {
				$result["MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-" . $row] = $value;
			}
		}

		$result["document"] = base_url() . $result["MitraJaya.view.Admin.Payroll.WinFormSettingPayroll-FormBasicData-document"];


		$return["success"]  = true;
		$return["data"]     = $result;

		$this->response($return, 200);
	}

	function form_prefill_payroll_get()
	{
		$Month 	= $this->get("Month");
		$Year 	= $this->get("Year");
		$people_id 	= $this->get("people_id");

		$data = $this->mpayroll->form_prefill_payroll($Month, $Year, $people_id);

		$this->response($data, 200);
	}

	function form_pajak_get()
	{
		$Month 	= $this->get("Month");
		$Year 	= $this->get("Year");

		$data = $this->mpajak->form_pajak($Month, $Year);

		$this->response($data, 200);
	}

	function delete_income_delete()
	{
		$BudgetPlanID = $this->delete("BudgetPlanID");

		$data["StatusCode"] = "nullified";

		$this->db->where("BudgetPlanID", $BudgetPlanID);
		$query = $this->db->update("mj_budget_plan_income", $data);

		if ($query) {
			$response["success"] = true;
			$response["message"] = "Deleted Success";
			$this->response($response, 200);
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to Deleted Data";
			$this->response($response, 400);
		}
	}

	function delete_expenses_delete()
	{
		$BudgetPlanID = $this->delete("BudgetPlanID");

		$data["StatusCode"] = "nullified";

		$this->db->where("BudgetPlanID", $BudgetPlanID);
		$query = $this->db->update("mj_budget_plan", $data);

		if ($query) {
			$response["success"] = true;
			$response["message"] = "Deleted Success";
			$this->response($response, 200);
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to Deleted Data";
			$this->response($response, 400);
		}
	}

	function export_data_get()
	{
		ini_set('memory_limit', -1);
		ini_set('max_execution_time', 0);

		include APPPATH . 'third_party/PHPExcel18/PHPExcel.php';
		$excel = new PHPExcel();
		$styleFontBoldHeader = array(
			'font' => array(
				'name' => 'Arial',
				'size' => '9',
				'bold' => true,
			),
			'fill' => array(
				'type' => PHPExcel_Style_Fill::FILL_SOLID,
				'color' => array('rgb' => '8DB4E3'),
			),
		);

		$styleBorderFull = array(
			'borders' => array(
				'left' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
				),
				'right' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
				),
				'bottom' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
				),
				'top' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN,
				),
			),
		);

		$pSearch["Year"] 	= $this->get("Year");
		$pSearch["Month"] 	= $this->get("Month");

		$dataHeaderMonth = array(
			date("F Y", strtotime($pSearch["Year"] . "-" . $pSearch["Month"] . "-01"))
		);

		//sort
		$sorting = json_decode($this->get('sort'));
		if (isset($sorting[0]->property)) {
			$sortingField = $sorting[0]->property;
		} else {
			$sortingField = null;
		}

		if (isset($sorting[0]->direction)) {
			$sortingDir = $sorting[0]->direction;
		} else {
			$sortingDir = null;
		}

		$start = (int) $this->get('start');
		$limit = (int) $this->get('limit');

		$dataList 		= $this->mpayroll->list_employee_export($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);

		if (count($dataList['data'])) {
			//Kolom Header order book
			$dataHeader = array('No');
			foreach ($dataList['data'][0] as $key => $value) {
				array_push($dataHeader, $key);
			}
			//Kolom Header order book

			//Kolom Body order book
			$dataListExcel = array();
			$no = 1;
			foreach ($dataList['data'] as $key => $value) {
				$data = array();
				array_push($data, $no);
				foreach ($value as $keyx => $valuex) {
					array_push($data, $valuex);
				}
				$dataListExcel[$key] = $data;
				$no++;
			}
			//Kolom Body order book
		}
		$excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
			->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
			->setTitle("Payroll " . $dataHeaderMonth[0])
			->setSubject("Payroll")
			->setDescription("Payroll " . $dataHeaderMonth[0])
			->setKeywords("Payroll");


		$namaFile =	"Payroll_" . str_replace(" ", "_", $dataHeaderMonth[0]) . '_' . time() . '_export_excel_payroll.xlsx';
		$filePath = 'files/tmp/' . $namaFile;
		$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
		$namaFile = 'template_invoice.xlsx';
		$objWriter->save($filePath);
		// $this->response(array('success' => true, 'url' => 'files/tmp/'.$namaFile), 200);
		$response["success"] = true;
		$response["filenya"] = base_url() . $filePath;

		$this->response($response, 200);
	}

	private function validateDate($date, $format = 'Y-m-d')
	{
		$d = DateTime::createFromFormat($format, $date);
		return $d && $d->format($format) === $date;
	}

	public function print_header()
	{
		$titleNya = "Print Pay Slip";
		$baseurlnya = base_url();

		$html = '<html lang="en" xmlns="http://www.w3.org/1999/html" moznomarginboxes mozdisallowselectionprint>'
			. '<head>'
			. '<meta charset="utf-8"/>'
			. '<title>' . $titleNya . '</title>'

			. '<!--<link rel="stylesheet" type="text/css" href="' . $baseurlnya . 'assets/css/bootstrap.min.css"/>-->'
			. '<link href="https://fonts.cdnfonts.com/css/cascadia-code" rel="stylesheet">'
			. '<style>'
			. '	@import url("https://fonts.cdnfonts.com/css/cascadia-code");'
			. '</style>'

			. '<link rel="stylesheet" type="text/css" href="' . $baseurlnya . 'assets/css/print_beneficiary/print_beneficiary.css?' . time() . '"/>'
			. '<link rel="stylesheet" type="text/css" href="' . $baseurlnya . 'assets/css/print_beneficiary/print_beneficiary-media.css?' . time() . ' " media="print"/>'
			. '<link'
			. 'rel="stylesheet"'
			. 'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"'
			. '/>'

			. '<script src="' . $baseurlnya . 'assets/js/print_beneficiary/jquery-1.8.3.min.js" type="text/javascript"></script>'
			. '<!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACXVwWCJen2OZeCAEYdRxP_HEh7CkxOvs"></script> -->'
			. '<!-- <script src="' . $baseurlnya . 'assets/js/gmap3.js"></script> -->'
			. '</head>'
			. '<body>';

		return $html;
	}

	public function print_body($paramPost)
	{

		// echo "<pre>";print_r($paramPost);die;

		$PayrollData = $paramPost;
		$history = "";
		$total_history = 0;
		$net_salary = $PayrollData["salary"] + $PayrollData["total_insentif"] - $PayrollData["total_deduction"];

		$html = '<style type="text/css">
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
				<table width="95%" border="0" cellpadding="4" style="border:none">
					<tr>
						<td height="60px" width="20%" align="center" style="vertical-align:middle;">
							<img src="' . base_url() . 'assets/logo/logo-msu.png" style="width:80px"  onerror="this.onerror=null;">
						</td>
						<td width="80%"  style="text-align:center" colspan="2">
							<div style="font-size:16pt;color:#000"><u>PT. MITRAJAYA SOLUSI UTAMA</u></div>
							<span style="color:#000">Jl. Tentara Pelajar No. 21 RT 004/008, Jakarta 12210</span>
							<span style="color:#000">Phone (021) 53653465</span>
						</td>
					</tr>
				</table>
				<hr style="border-top: 4px solid #5188B9; width:95%; margin-left:0px">
				<table width="95%" border="0" cellpadding="4" style="border:none;margin-top:20px">
					<tr>
						<td width="95%"  style="text-align:center" colspan="2">
							<div style="font-size:14pt;color:#000"><u>SLIP GAJI KARYAWAN</u></div>
							<span style="color:#000">Periode : ' . date("F", strtotime($PayrollData["year"] . "-" . $PayrollData["month"] . "-01")) . " " . $PayrollData["year"] . '</span>
						</td>
					</tr>
				</table>
				<table width="60%" border="0" cellpadding="4" style="border:none;margin-top:40px;font-weight:800;font-size:10pt">
					<tr>
						<td>No. Induk</td>
						<td>:</td>
						<td>' . $PayrollData["people_ext_id"] . '</td>
					</tr>
					<tr>
						<td style="width: 30%">Nama</td>
						<td>:</td>
						<td>' . $PayrollData["people_name"] . '</td>
					</tr>
					<tr>
						<td>Jabatan</td>
						<td>:</td>
						<td>' . $PayrollData["position_name"] . '</td>
					</tr>
					<tr>
						<td>Gaji Bruto (A)</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["salary"], 2) . '</td>
					</tr>
				</table>
				<table width="65%" border="0" cellpadding="2" style="border:none;margin-top:40px;font-weight:600;font-size:9pt">
					<tr>
						<td>
							<h3>Insentif (B)</h3>
						</td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td>THR</td>
						<td>:</td>
						<td>Rp '.number_format($PayrollData["insentif_thr"], 2).'</td>
					</tr>
				</table>
				<table width="60%" border="0" cellpadding="4" style="border:none;margin-top:40px;font-weight:800;font-size:10pt">
					<tr>
						<td>Potongan (C)</td>
						<td></td>
						<td></td>
					</tr>
					<tr>
						<td>BPJS TK</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_bpjs_tk"], 2) . '</td>
					</tr>
					<tr>
						<td style="width: 30%">BPJS Kesehatan</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_bpjs_kesehatan"], 2) . '</td>
					</tr>
					<tr>
						<td>PPh 21 Gaji</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_pph_21"], 2) . '</td>
					</tr>
					<tr>
						<td>PPh 21 Insentif</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_pph_21_insentif"], 2) . '</td>
					</tr>
					<tr>
						<td>PPh 21 Kompensasi</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_pph_21_kompensasi"], 2) . '</td>
					</tr>
					<tr>
						<td>PPh 21 THR</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_pph_21_thr"], 2) . '</td>
					</tr>
					<tr>
						<td>Kasbon</td>
						<td>:</td>
						<td>Rp ' . number_format($PayrollData["deduction_kasbon"], 2) . '</td>
					</tr>
				</table>
				<table width="100%" border="0" cellpadding="2" style="border:none;margin-top:40px;font-weight:600;font-size:9pt">
					<tr>
						<td style="width: 30%">Total (A)</td>
						<td>:</td>
						<td>Rp '.number_format($PayrollData["salary"], 2).'</td>
					</tr>
					<tr>
						<td style="width: 30%">Total (B)</td>
						<td>:</td>
						<td>Rp '.number_format($PayrollData["total_insentif"], 2).'</td>
					</tr>
					<tr>
						<td>Total (C)</td>
						<td>:</td>
						<td>Rp '.number_format($PayrollData["total_deduction"], 2).'</td>
					</tr>
				</table>
				<table width="95%" border="1" cellpadding="4" style="border:1px solid #000;margin-top:40px;font-weight:800;font-size:10pt;background:#b7d0e5">
					<tr>
						<td style="width:80%; text-align:center">Penerimaan Bersih (A-B)</td>
						<td colspan="3">: Rp ' . number_format($net_salary, 2) . '</td>
					</tr>
					<tr>
						<td style="width:60%; text-align:center" colspan="4">Terbilang : #' . terbilang(round($net_salary)) . ' Rupiah</td>
					</tr>
					<tr>
						<td style="width:60%; text-align:center" colspan="4">Catatan : '.$PayrollData["notes"].'</td>
					</tr>
				</table>
				<div style="white-space: pre; padding-right: 100px">
					<p style="text-align: right;font-size:10pt">Jakarta, ' . date("d F Y", strtotime($PayrollData["date_state"])) . '</p>
					<img style="float:right" width="250" src="' . $PayrollData["document"] . '">
					<br>
					<br>
					<p style="text-align: right;font-size:10pt">' . $PayrollData["signatrue_name"] . '</p>
				</div>
			</div>		
		</div>
		</body>
		</html>
		';

		return $html;
	}

	public function share_payroll_get()
	{
		$people_id 	= $_GET["people_id"];
		$month 		= $_GET["month"];
		$year 		= $_GET["year"];
		
		$sendPayroll = $this->sendPayroll($people_id, $month, $year);

		if ($sendPayroll["success"]) {
			$this->response($sendPayroll, 200);
			return;
		} else {
			$this->response($sendPayroll, 400);
			return;
		}
	}	

	public function share_payroll_all_get()
	{
		$pSearch["Month"] = $_GET["month"];
		$pSearch["Year"] = $_GET["year"];

		$data = $this->mpayroll->list_employee($pSearch);

		if(count($data["data"]) > 0){
			$sukses = 0;
			$failed = 0;

			foreach($data["data"] as $row){
				$sendPayroll = $this->sendPayroll($row["people_id"],$pSearch["Month"], $pSearch["Year"]);

				$statusSend = isset($sendPayroll["success"]) ? $sendPayroll["success"] : NULL;

				if($statusSend){
					$sukses++;
				}else{
					$failed++;
				}
			}
			
			$response["success"] = true;
			$response["desc"] = "success";
			$response["message"] = "Sending -> Success : $sukses | Failed : $failed";
		
			$this->response($response, 200);
		}else{
			$response["success"] = false;
			$response["desc"] = "error";
			$response["message"] = "No Employees Found";
		
			$this->response($response, 400);
		}
	}

	function sendPayroll($people_id, $month, $year){

		$period	= date("F", strtotime($year . "-" . $month . "-01")) . " " . $year;
		$payroll = $this->mpayroll->form_payroll($month, $year, $people_id);

		$paramPost = array();
		if (is_array($payroll['data'])) {
			foreach ($payroll['data'] as $key => $value) {
				$keyNew = str_replace("MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-", '', $key);
				if ($value == "") {
					$value = null;
				}
				$paramPost[$keyNew] = $value;
			}
		}

		if ($paramPost["people_email"] == "") {
			$response["success"] = false;
			$response["desc"] = "warning";
			$response["message"] = "Email not Found";
			$this->response($response, 400);
			return;
		}

		// Instantiate and use the dompdf class 
		$dompdf = new Dompdf();
		$html = $this->print_header();
		$body = $this->print_body($paramPost);

		// (Optional) Setup the paper size and orientation 
		$dompdf->setPaper('A4', 'potrait');

		$tmp = 'assets/payroll/';

		$dompdf = new Dompdf([
			'logOutputFile' => '',
			// authorize DomPdf to download fonts and other Internet assets
			'isRemoteEnabled' => true,
			// all directories must exist and not end with /
			'fontDir' => $tmp,
			'fontCache' => $tmp,
			'tempDir' => $tmp,
			'chroot' => $tmp,
		]);

		$dompdf->loadHtml($html . $body); //load an html

		$dompdf->render('/assets/payroll/' . time() . '.pdf');

		$pdf = $dompdf->output();

		// $dompdf->stream(time() . '.pdf', [
		// 	'compress' => true,
		// 	'Attachment' => false,
		// ]);

		$this->load->library('email');
		$config = array();
		$config['protocol'] = 'smtp';
		$config['smtp_host'] = 'idsmtp5.idcloudhosting.com';
		$config['smtp_user'] = 'hrd@mitrajayasolusiutama.com';
		$config['smtp_pass'] = 'Password1234!';
		$config['smtp_port'] = 465;
		$config['smtp_crypto'] = 'ssl';
		$config['newline'] = "\r\n";
		$this->email->initialize($config);

		$this->email->from('hrd@mitrajayasolusiutama.com', 'HRD Mitrajaya Solusi Utama');
		$this->email->to($paramPost["people_email"]);
		$this->email->subject('Slip Gaji Periode ' . $period . ' - ' . $paramPost['people_name']);
		$this->email->message('Dear ' . $paramPost['people_name'] . ', Berikut Lampiran Slip Gaji Periode ' . $period . ".");
		$this->email->attach($pdf, 'application/pdf', "Slip Gaji " . $period . ' - ' . $paramPost['people_name'] . ".pdf", false);

		if ($this->email->send()) {
			$response["success"] = true;
			$response["desc"] = "success";
			$response["message"] = "Email Terkirim";
		} else {
			$response["success"] = false;
			$response["desc"] = "error";
			$response["message"] = "Email Gagal Terkirim";
			$response["error"] = $this->email->print_debugger();
		}

		return $response;
	}
}
