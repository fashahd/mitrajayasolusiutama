<?php

defined('BASEPATH') or exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

// use namespace
use Restserver\Libraries\REST_Controller;

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

		$query = $this->db->query("SELECT * FROM mj_payroll WHERE people_id = ? AND month = ? AND year = ?", [$paramPost['people_id'], $paramPost['month'], $paramPost['year']]);
		if ($query->num_rows() > 0) {
			$this->db->where("people_id", $paramPost["people_id"]);
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
}
