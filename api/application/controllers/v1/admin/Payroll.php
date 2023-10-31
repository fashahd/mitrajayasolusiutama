<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';
require_once 'application/third_party/Spout3/Autoloader/autoload.php';

// use namespace
use Restserver\Libraries\REST_Controller;
use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Box\Spout\Writer\Common\Creator\Style\StyleBuilder;
//use Box\Spout\Common\Entity\Style\CellAlignment;
use Box\Spout\Common\Entity\Style\Color;
use Box\Spout\Common\Entity\Style\Border;
use Box\Spout\Writer\Common\Creator\Style\BorderBuilder;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;

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
class Payroll extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("mpayroll");
    }

	public function print_pay_slip_get(){
		$people_id 	= $_GET["people_id"];
		$month 		= $_GET["month"];
		$year 		= $_GET["year"];

        // Header
        $dataHeader['titleNya'] = "Print Pay Slip";
        $this->load->view('printout/print_header', $dataHeader);

		
        // Body
        $this->cetak_payroll($people_id, $month, $year);
	}

	public function cetak_payroll($people_id, $month, $year){
		
		$payroll			= $this->mpayroll->form_payroll($month, $year, $people_id);

		$paramPost = array();
		if(is_array($payroll['data'])){
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

	function list_employee_get(){
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

	function list_expense_get(){
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

	function submit_expenses_post(){
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Finance_BudgetPlan_WinFormExpenses-FormBasicData-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }

		$paramPost["BudgetAmount"] = str_replace(",","", $paramPost["BudgetAmount"]);
		$paramPost["BudgetActual"] = str_replace(",","", $paramPost["BudgetActual"]);

        if($varPost["OpsiDisplay"] == "insert"){
            $proses = $this->mpayroll->submit_expsense($paramPost);
        }

        if($varPost["OpsiDisplay"] == "update"){
            $proses = $this->mpayroll->update_expsense($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function submit_payroll_post(){
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

		$paramPost["salary"] = ($paramPost["salary"] != '') ? str_replace(",","", $paramPost["salary"]) : '0';
		$paramPost["insentif_transportasi"] = ($paramPost["insentif_transportasi"] != '') ? str_replace(",","", $paramPost["insentif_transportasi"]) : '0';
		$paramPost["insentif_komunikasi"] = ($paramPost["insentif_komunikasi"] != '') ? str_replace(",","", $paramPost["insentif_komunikasi"]) : '0';
		$paramPost["insentif_lembur"] = ($paramPost["insentif_lembur"] != '') ? str_replace(",","", $paramPost["insentif_lembur"]) : '0';
		$paramPost["insentif_bonus"] = ($paramPost["insentif_bonus"] != '') ? str_replace(",","", $paramPost["insentif_bonus"]) : '0';
		$paramPost["insentif_thr"] = ($paramPost["insentif_thr"] != '') ? str_replace(",","", $paramPost["insentif_thr"]) : '0';
		$paramPost["deduction_bpjs_tk"] = ($paramPost["deduction_bpjs_tk"] != '') ? str_replace(",","", $paramPost["deduction_bpjs_tk"]) : '0';
		$paramPost["deduction_bpjs_kesehatan"] = ($paramPost["deduction_bpjs_kesehatan"] != '') ? str_replace(",","", $paramPost["deduction_bpjs_kesehatan"]) : '0';
		$paramPost["deduction_kasbon"] = ($paramPost["deduction_kasbon"] != '') ? str_replace(",","", $paramPost["deduction_kasbon"]) : '0';
		$paramPost["deduction_pph_21_insentif"] = ($paramPost["deduction_pph_21_insentif"] != '') ? str_replace(",","", $paramPost["deduction_pph_21_insentif"]) : '0';
		$paramPost["deduction_pph_21"] = ($paramPost["deduction_pph_21"] != '') ? str_replace(",","", $paramPost["deduction_pph_21"]) : '0';

		$query = $this->db->query("SELECT * FROM mj_payroll WHERE people_id = ? AND month = ? AND year = ?", [$paramPost['people_id'],$paramPost['month'],$paramPost['year']]);
		if($query->num_rows() > 0) {
			$this->db->where("people_id", $paramPost["people_id"]);
			$this->db->update("mj_payroll", $paramPost);
		}else{
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

	function form_payroll_get(){
		$Month 	= $this->get("Month");
		$Year 	= $this->get("Year");
		$people_id 	= $this->get("people_id");

        $data = $this->mpayroll->form_payroll($Month, $Year, $people_id);

        $this->response($data, 200);
	}

	function form_prefill_payroll_get(){
		$Month 	= $this->get("Month");
		$Year 	= $this->get("Year");
		$people_id 	= $this->get("people_id");

        $data = $this->mpayroll->form_prefill_payroll($Month, $Year, $people_id);

        $this->response($data, 200);
	}

	function form_pajak_get(){
		$Month 	= $this->get("Month");
		$Year 	= $this->get("Year");

        $data = $this->mpajak->form_pajak($Month, $Year);

        $this->response($data, 200);
	}

    function delete_income_delete(){
		$BudgetPlanID = $this->delete("BudgetPlanID");

		$data["StatusCode"] = "nullified";

		$this->db->where("BudgetPlanID", $BudgetPlanID);
		$query = $this->db->update("mj_budget_plan_income", $data);

		if($query){
			$response["success"] = true;
			$response["message"] = "Deleted Success";
			$this->response($response, 200);
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to Deleted Data";
			$this->response($response, 400);
		}
	}

    function delete_expenses_delete(){
		$BudgetPlanID = $this->delete("BudgetPlanID");

		$data["StatusCode"] = "nullified";

		$this->db->where("BudgetPlanID", $BudgetPlanID);
		$query = $this->db->update("mj_budget_plan", $data);

		if($query){
			$response["success"] = true;
			$response["message"] = "Deleted Success";
			$this->response($response, 200);
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to Deleted Data";
			$this->response($response, 400);
		}
	}

    function export_data_get(){
        ini_set('memory_limit', -1);
        ini_set('max_execution_time', 0);
		
		$pSearch["Year"] 	= $this->get("Year");
		$pSearch["Month"] 	= $this->get("Month");

		$dataHeaderMonth = array(
			date("F Y", strtotime($pSearch["Year"]."-".$pSearch["Month"]."-01"))
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
		
        $dataList 		= $this->mpayroll->list_employee($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);

		include APPPATH.'third_party/PHPExcel18/PHPExcel.php';        
		$excel = new PHPExcel();

		$excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
			->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
			->setTitle("Payroll")
			->setSubject("Payroll")
			->setDescription("Payroll template")
			->setKeywords("Payroll");
		
		$styleFontBoldHeader = array(
			'font' => array(
				'name' => 'Arial',
				'size' => '12',
				'bold' => true,
			),
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			)
		);

		$styleFontBoldTableHeader = array(
			'font' => array(
				'name' => 'Arial',
				'size' => '9',
				'bold' => true,
			),
			'fill' => array(
				'type' => PHPExcel_Style_Fill::FILL_SOLID,
				'color' => array('rgb' => '8DB4E3'),
			),
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
			)
		);

		$styleFontBoldTableHeaderData = array(
			'font' => array(
				'name' => 'Arial',
				'size' => '9',
				'bold' => true,
			),
			'fill' => array(
				'type' => PHPExcel_Style_Fill::FILL_SOLID,
				'color' => array('rgb' => 'c9e2ff'),
			),
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
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			)
		);

		$styleFontBoldTableHeaderDataGreen = array(
			'font' => array(
				'name' => 'Arial',
				'size' => '9',
				'bold' => true,
			),
			'fill' => array(
				'type' => PHPExcel_Style_Fill::FILL_SOLID,
				'color' => array('rgb' => '89ff91'),
			),
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
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			)
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

		// set header 
		// Sheet 1
		$excel->getActiveSheet()->setTitle("Laporan Perencanaan Anggaran");
		$excel->getActiveSheet()->setCellValue('A1', 'Laporan Perencanaan Anggaran');
		$excel->getActiveSheet()->setCellValue('A2', 'PT Mitrajaya Solusi Utama');
		$excel->getActiveSheet()->mergeCells('A1:C1');
		$excel->getActiveSheet()->mergeCells('A2:C2');
		$columnSet = 'A1:C2';
		$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
		// $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);

		$excel->getActiveSheet()->setCellValue('A5', "Item");
		$excel->getActiveSheet()->setCellValue('B5', "Budget");
		$excel->getActiveSheet()->setCellValue('C5', "Actual");
		$columnSet = 'A5:C5';
		$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldTableHeaderData);

		$budget  = 0;
		$actual	 = 0;
		if(count($dataList)){
			$dataIncome = array();
			$tmpweek = "";
			$kn		 = 0;
			$row	 = 6;
			foreach($dataList["data"] as $valnew){
				if($valnew["Item"] != ''){
					if($tmpweek <> $valnew["Week"]){
						$tmpweek = $valnew["Week"];
						$excel->getActiveSheet()->setCellValue('A'.$row, 'Income '.$valnew["Week"]);
						$excel->getActiveSheet()->mergeCells('A'.$row.':C'.$row);
						$columnSet = 'A'.$row.':C'.$row;
						$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldTableHeader);
						$row++;
					}
					$excel->getActiveSheet()->setCellValue('A'.$row, $valnew["Item"]);
					$excel->getActiveSheet()->setCellValue('B'.$row, (int) $valnew["Budget"]);
					$excel->getActiveSheet()->setCellValue('C'.$row, (int) $valnew["Actual"]);
					$budget += (int) $valnew["Budget"];
					$actual += (int) $valnew["Actual"];
					$columnSet = 'A'.$row.':C'.$row;
					$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull);
					$row++;
				}
			}
			
			$excel->getActiveSheet()->setCellValue('A'.$row, '');
			$excel->getActiveSheet()->setCellValue('B'.$row, '');
			$excel->getActiveSheet()->setCellValue('C'.$row, '');

			$row = $row+1;
			
			$excel->getActiveSheet()->setCellValue('A'.$row, 'Total Income');
			$excel->getActiveSheet()->setCellValue('B'.$row, (int) $budget);
			$excel->getActiveSheet()->setCellValue('C'.$row, (int) $actual);
			$columnSet = 'A'.$row.':C'.$row;
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull);
		}

		$row = $row+3;

		$excel->getActiveSheet()->setCellValue('A'.$row, "Item");
		$excel->getActiveSheet()->setCellValue('B'.$row, "Budget");
		$excel->getActiveSheet()->setCellValue('C'.$row, "Actual");
		$columnSet = 'A'.$row.':C'.$row;
		$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldTableHeaderDataGreen);
		$row++;

		$budgetexpenses  = 0;
		$actualexpenses	 = 0;
		if(count($dataExpenses)){
			$dataIncome = array();
			$tmpweek = "";
			$tmpcat	 = "";
			$kn		 = 0;
			foreach($dataExpenses["data"] as $valnew){
				if($valnew["Item"] != ''){
					if($tmpweek <> $valnew["Week"]){
						$tmpweek = $valnew["Week"];
						$excel->getActiveSheet()->setCellValue('A'.$row, 'Expenses Week '.$valnew["Week"]);
						$excel->getActiveSheet()->mergeCells('A'.$row.':C'.$row);
						$columnSet = 'A'.$row.':C'.$row;
						$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldTableHeader);
						$row++;
					}
					if($tmpcat <> $valnew["Category"] AND $valnew["Category"] != ''){
						$tmpcat = $valnew["Category"];
						$excel->getActiveSheet()->setCellValue('A'.$row, $valnew["Category"]);
						$excel->getActiveSheet()->mergeCells('A'.$row.':C'.$row);
						$columnSet = 'A'.$row.':C'.$row;
						$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldTableHeaderDataGreen);
						$row++;
					}
					if($valnew["Item"] == "<b>TOTAL</b>"){						
						$excel->getActiveSheet()->setCellValue('A'.$row, "Total");
						$excel->getActiveSheet()->setCellValue('B'.$row, (int) $valnew["Budget"]);
						$excel->getActiveSheet()->setCellValue('C'.$row, (int) $valnew["Actual"]);
						$columnSet = 'A'.$row.':C'.$row;
						$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldTableHeader);
						$row++;
					}else{
						$excel->getActiveSheet()->setCellValue('A'.$row, $valnew["Item"]);
						$excel->getActiveSheet()->setCellValue('B'.$row, (int) $valnew["Budget"]);
						$excel->getActiveSheet()->setCellValue('C'.$row, (int) $valnew["Actual"]);
						$budgetexpenses += (int) $valnew["Budget"];
						$actualexpenses += (int) $valnew["Actual"];
						$columnSet = 'A'.$row.':C'.$row;
						$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull);
						$row++;
					}
				}
			}
			
			$excel->getActiveSheet()->setCellValue('A'.$row, '');
			$excel->getActiveSheet()->setCellValue('B'.$row, '');
			$excel->getActiveSheet()->setCellValue('C'.$row, '');

			$row = $row+1;
			
			$excel->getActiveSheet()->setCellValue('A'.$row, 'Total Expenses');
			$excel->getActiveSheet()->setCellValue('B'.$row, (int) $budgetexpenses);
			$excel->getActiveSheet()->setCellValue('C'.$row, (int) $actualexpenses);
			$columnSet = 'A'.$row.':C'.$row;
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull);
		}

		$row = $row+1;
			
		$excel->getActiveSheet()->setCellValue('A'.$row, '');
		$excel->getActiveSheet()->setCellValue('B'.$row, '');
		$excel->getActiveSheet()->setCellValue('C'.$row, '');

		$row = $row+1;
		
		$excel->getActiveSheet()->setCellValue('A'.$row, 'Total Difference');
		$excel->getActiveSheet()->setCellValue('B'.$row, (int) ($budget - $budgetexpenses));
		$excel->getActiveSheet()->setCellValue('C'.$row, (int) ($actual - $actualexpenses));
		$columnSet = 'A'.$row.':C'.$row;
		$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull);
			
		// 	$excel->getActiveSheet()->setCellValue('A'.$row, '');
		// 	$excel->getActiveSheet()->setCellValue('B'.$row, '');
		// 	$excel->getActiveSheet()->setCellValue('C'.$row, '');
			
		// 	$excel->getActiveSheet()->setCellValue('A'.($row+1), 'Total Income');
		// 	$excel->getActiveSheet()->setCellValue('B'.($row+1), (int) $budget);
		// 	$excel->getActiveSheet()->setCellValue('C'.($row+1), (int) $actual);
		// 	$columnSet = 'A'.$row.':C'.($row+1);
		// 	$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull);
		// }

		$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
		$namaFile = 'laporan_perencanaan_anggaran.xlsx';
		$objWriter->save('files/tmp/'.$namaFile);
		// $this->response(array('success' => true, 'url' => 'files/tmp/'.$namaFile), 200);
		$response["success"] = true;
		$response["filenya"] = base_url() . 'files/tmp/'.$namaFile;

		$this->response($response, 200);
	}

    private function validateDate($date, $format = 'Y-m-d') {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }
}
