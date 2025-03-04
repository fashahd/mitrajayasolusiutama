<?php

defined('BASEPATH') or exit('No direct script access allowed');

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
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;
use PhpParser\Node\Stmt\Switch_;

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
class Loan extends REST_Controller
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();

		$this->load->model("mloan");
	}

	function list_get()
	{
		$pSearch["VendorID"] = $this->get("VendorID");
		$pSearch["ProjectID"] = $this->get("ProjectID");
		$pSearch["EmployeeID"] = $this->get("EmployeeID");
		$pSearch["LoanType"] = $this->get("LoanType");
		$pSearch["DocNumber"] = $this->get("DocNumber");

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
		$data = $this->mloan->list_loan($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function list_loan_detail_get()
	{
		$pSearch["LoanID"] = $this->get("LoanID");

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
		$data = $this->mloan->list_loan_detail($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function payment_loan_list_employee_get()
	{
		$pSearch["LoanID"] = $this->get("LoanID");

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
		$data = $this->mloan->list_payment_loan_employee($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function payment_loan_list_get()
	{
		$pSearch["LoanID"] = $this->get("LoanID");

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
		$data = $this->mloan->list_payment_loan($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function submit_loan_detail_post()
	{
		$varPost = $_POST;
		$paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}
		$paramPost["Amount"] = str_replace(",", "", $paramPost["Amount"]);
		$paramPost["Qty"] = str_replace(",", "", $paramPost["Qty"]);

		if ($varPost['OpsiDisplay'] == 'insert') {

			$proses = $this->mloan->insert_loan_detail($paramPost);
		} else {

			$proses = $this->mloan->update_loan_detail($paramPost);
		}

		if ($proses['success'] == true) {
			$this->mloan->updateAmountLoanDetail($paramPost);

			$this->response($proses, 200);
		} else {
			$this->response($proses, 400);
		}
	}

	function submit_loan_post()
	{

		$varPost = $_POST;
		$paramPost = array();

		if ($varPost['OpsiDisplay'] == 'insert') {

			foreach ($varPost as $key => $value) {
				$keyNew = str_replace("MitraJaya_view_Finance_PinjamanSubCont_MainForm-FormBasicData-", '', $key);
				if ($value == "") {
					$value = null;
				}
				$paramPost[$keyNew] = $value;
			}

			$paramPost["LoanAmount"] = str_replace(",", "", $paramPost["LoanAmount"]);

			$proses = $this->mloan->insert_loan($paramPost);
		} else {

			foreach ($varPost as $key => $value) {
				$keyNew = str_replace("MitraJaya_view_Finance_PinjamanSubCont_MainForm-FormBasicData-", '', $key);
				if ($value == "") {
					$value = null;
				}
				$paramPost[$keyNew] = $value;
			}

			$paramPost["LoanAmount"] = str_replace(",", "", $paramPost["LoanAmount"]);

			$proses = $this->mloan->update_loan($paramPost);
		}

		if ($proses['success'] == true) {
			$this->response($proses, 200);
		} else {
			$this->response($proses, 400);
		}
	}

	function submit_payment_loan_post()
	{

		$varPost = $_POST;
		$paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanPayment-Form-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		$paramPost["LoanPaymentAmount"] = str_replace(",", "", $paramPost["LoanPaymentAmount"]);


		$checkingDocNo = $this->mloan->CheckDocNo("DocumentNo", $paramPost["DocumentNo"], $paramPost["LoanPaymentID"]);

		if ($checkingDocNo["exist"] == 1) {
			$return["success"] = "false";
			$return["message"] = "Document Number Already Exist";
			$this->response($return, 400);
			return;
		}

		if ($varPost['OpsiDisplay'] == 'insert') {

			$proses = $this->mloan->insert_payment_loan($paramPost);
		} else {
			$proses = $this->mloan->update_payment_loan($paramPost);
		}

		if ($proses['success'] == true) {
			$this->response($proses, 200);
		} else {
			$this->response($proses, 400);
		}
	}

	function form_loan_get()
	{
		$LoanID = $this->get("LoanID");

		$data = $this->mloan->form_loan($LoanID);

		$this->response($data, 200);
	}	

	function form_loan_detail_get()
	{
		$LoanDetailID = $this->get("LoanDetailID");

		$data = $this->mloan->form_loan_detail($LoanDetailID);

		$this->response($data, 200);
	}

	function form_payment_loan_get()
	{
		$LoanPaymentID = $this->get("LoanPaymentID");

		$data = $this->mloan->form_payment_loan($LoanPaymentID);

		$this->response($data, 200);
	}

	function delete_loan_delete()
	{
		$LoanID = $this->delete("LoanID");

		$data["StatusCode"] = "nullified";

		$this->db->where("LoanID", $LoanID);
		$query = $this->db->update("mj_loan", $data);

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

	function delete_loan_detail_delete()
	{
		$LoanDetailID = $this->delete("LoanDetailID");

		$data["StatusCode"] = "nullified";

		$this->db->where("LoanDetailID", $LoanDetailID);
		$query = $this->db->update("mj_loan_detail", $data);
		$paramPost["LoanID"] = $this->delete("LoanID");

		if ($query) {
			$response["success"] = true;
			$response["message"] = "Deleted Success";
			$this->mloan->updateAmountLoanDetail($paramPost);

			$this->response($response, 200);
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to Deleted Data";
			$this->response($response, 400);
		}
	}

	function delete_payment_loan_delete()
	{
		$LoanPaymentID = $this->delete("LoanPaymentID");

		$data["StatusCode"] = "nullified";

		$this->db->where("LoanPaymentID", $LoanPaymentID);
		$query = $this->db->update("mj_loan_payment", $data);

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

	function export_loan_post()
	{
		ini_set('memory_limit', -1);
		ini_set('max_execution_time', 0);

		$pSearch["VendorID"] = $this->post("VendorID");
		$pSearch["ProjectID"] = $this->post("ProjectID");
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


		$dataList       = $this->mloan->list_loan_excel($pSearch, $sortingField, $sortingDir);

		if (count($dataList)) {

			//Kolom Header Project Loan
			$dataHeader = array('No');
			foreach ($dataList[0] as $key => $value) {
				array_push($dataHeader, $key);
			}
			//Kolom Header Project Loan

			//Kolom Body Project Loan
			$dataListExcel = array();
			$no = 1;
			foreach ($dataList as $key => $value) {
				$data = array();
				array_push($data, $no);
				foreach ($value as $keyx => $valuex) {
					array_push($data, $valuex);
				}
				$dataListExcel[$key] = $data;
				$no++;
			}
			//Kolom Body Project Loan

			$writer = WriterEntityFactory::createXLSXWriter(); // for XLSX files// 
			$namaFile = date('Y-m-d_H-i-s') . '_export_excel_project_loan.xlsx';
			$filePath = 'files/tmp/' . $namaFile;
			$writer->openToFile($filePath);

			$defaultStyle = (new StyleBuilder())
				->setFontName('Arial')
				->setFontSize(11)
				->setShouldWrapText(false)
				->build();
			$writer->setDefaultRowStyle($defaultStyle)
				->openToFile($filePath);

			$borderDefa = (new BorderBuilder())
				->setBorderBottom(Color::BLACK, Border::WIDTH_THIN, Border::STYLE_SOLID)
				->setBorderTop(Color::BLACK, Border::WIDTH_THIN, Border::STYLE_SOLID)
				->setBorderRight(Color::BLACK, Border::WIDTH_THIN, Border::STYLE_SOLID)
				->setBorderLeft(Color::BLACK, Border::WIDTH_THIN, Border::STYLE_SOLID)
				->build();

			//style
			$styleHeader = (new StyleBuilder())
				->setFontColor(Color::WHITE)
				->setBorder($borderDefa)
				->setBackgroundColor(Color::GREEN)
				->build();

			//row header
			$rowHeader = WriterEntityFactory::createRowFromArray($dataHeader, $styleHeader);
			$writer->addRow($rowHeader);

			$styleData = (new StyleBuilder())
				->setBorder($borderDefa)
				->build();

			$styleFormatAngka = (new StyleBuilder())
				->setBorder($borderDefa)
				->setFormat('0')
				->build();

			$styleFormatTanggal = (new StyleBuilder())
				->setBorder($borderDefa)
				->setFormat('YYYY-mm-dd')
				->build();

			for ($i = 0; $i < count($dataListExcel); $i++) {
				$dataRows = $dataListExcel[$i];
				$cells = array();

				for ($j = 0; $j < count($dataRows); $j++) {
					$styleRow = null;
					$dataRow = null;

					//cek apakah numeric
					if (is_numeric($dataRows[$j])) {
						$styleRow = $styleFormatAngka;
						$dataRow = $dataRows[$j];
					} else {
						//cek apakah tanggal
						if ($this->validateDate($dataRows[$j]) == true) {
							$styleRow = $styleFormatTanggal;
							$dataRow = $dataRows[$j];
						} else {
							$styleRow = $styleData;
							$dataRow = $dataRows[$j];
						}
					}

					$cells[$j] = WriterEntityFactory::createCell($dataRow, $styleRow);
				}
				/*$cells = [
                    WriterEntityFactory::createCell($dataRows[0], $styleData),
                    WriterEntityFactory::createCell((float) $dataRows[1], $styleFormatAngka),
                    WriterEntityFactory::createCell($dataRows[2], $styleData),
                    WriterEntityFactory::createCell(25569 + (time() / 86400), $styleFormatTanggal),
                    WriterEntityFactory::createCell($dataRows[4], $styleFormatTanggal)
                ];*/

				$rowData = WriterEntityFactory::createRow($cells);
				$writer->addRow($rowData);
			}

			$writer->close();

			$response["success"] = true;
			$response["filenya"] = base_url() . $filePath;

			$this->response($response, 200);
		} else {
			$response["success"] = true;
			$response["filenya"] = '';

			$this->response($response, 400);
		}
	}

	private function validateDate($date, $format = 'Y-m-d')
	{
		$d = DateTime::createFromFormat($format, $date);
		return $d && $d->format($format) === $date;
	}

	// Import Project Loan 
	public function generate_template_post()
	{
		$this->load->model("mcombo");
		$data = $this->post();
		try {
			include APPPATH . 'third_party/PHPExcel18/PHPExcel.php';
			$excel = new PHPExcel();

			$excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
				->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
				->setTitle("Project Loan")
				->setSubject("Project Loan")
				->setDescription("Project Loan template")
				->setKeywords("Project Loan");

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

			/*
             * farmer get data
            */

			// set header 
			// Sheet 1
			$excel->getActiveSheet()->setTitle("Project Loan Template");
			$excel->getActiveSheet()->setCellValue('A1', 'TEMPLATE GENERATOR PROJECT LOAN');
			$excel->getActiveSheet()->setCellValue('A2', 'No');
			$excel->getActiveSheet()->setCellValue('B2', 'Loan Date');
			$excel->getActiveSheet()->setCellValue('C2', 'Loan Amount');
			$excel->getActiveSheet()->setCellValue('D2', 'Loan Transfer Date');
			$excel->getActiveSheet()->setCellValue('E2', 'Type');
			$excel->getActiveSheet()->setCellValue('F2', 'Name');
			$excel->getActiveSheet()->setCellValue('G2', 'PO Number');
			$excel->getActiveSheet()->setCellValue('H2', 'Loan Amount Description');
			$excel->getActiveSheet()->setCellValue('I2', 'Loan Description');

			$excel->getActiveSheet()->setCellValue('A3', '1');
			$excel->getActiveSheet()->setCellValue('B3', PHPExcel_Shared_Date::PHPToExcel('2022-12-01'));
			$excel->getActiveSheet()->getStyle('B3:B2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
			$excel->getActiveSheet()->setCellValue('C3', '500000000');
			$excel->getActiveSheet()->getStyle('C3:C2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_IDR_SIMPLE);
			$excel->getActiveSheet()->setCellValue('D3', PHPExcel_Shared_Date::PHPToExcel('2022-12-01'));
			$excel->getActiveSheet()->getStyle('D3:D2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
			$excel->getActiveSheet()->setCellValue('E3', '1 = Vendor, 2 = Subcont, 3 = Employee');
			$excel->getActiveSheet()->setCellValue('F3', 'Zuhurul');
			$excel->getActiveSheet()->setCellValue('G3', '4540595400');
			$excel->getActiveSheet()->setCellValue('H3', 'Description');
			$excel->getActiveSheet()->setCellValue('I3', 'Loan Description');

			$columnSet = 'A2:I2';
			$excel->getActiveSheet()->mergeCells('A1:D1');
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);
			// End Sheet 1

			$objValidation = $excel->getActiveSheet()->getDataValidation('G3:G2000');
			$objValidation->setType(PHPExcel_Cell_DataValidation::TYPE_LIST);
			$objValidation->setErrorStyle(PHPExcel_Cell_DataValidation::STYLE_INFORMATION);
			$objValidation->setAllowBlank(false);
			$objValidation->setShowInputMessage(true);
			$objValidation->setShowErrorMessage(true);
			$objValidation->setShowDropDown(true);
			$objValidation->setErrorTitle('Input error');
			$objValidation->setError('Value is not in list.');
			$objValidation->setPromptTitle('Pick from list');
			$objValidation->setPrompt('Please pick a value from the drop-down list.');
			$objValidation->setFormula1("=ponumber");

			// Sheet 2
			// Reference PO Number
			$excel->createSheet(1)->setTitle("PO Number Reference");
			$excel->setActiveSheetIndex(1);
			$excel->getActiveSheet()->setCellValue('A1', 'REFERENCE PO NUMBER');
			$excel->getActiveSheet()->setCellValue('A2', 'No');
			$excel->getActiveSheet()->setCellValue('B2', 'PO Number');
			$excel->getActiveSheet()->setCellValue('C2', 'Project Name');

			$PoNumber = $this->mcombo->GetContractNumber();

			$number = 1;
			$idx = 3;
			foreach ($PoNumber as $data_ponumber) {
				$excel->getActiveSheet()->setCellValue('A' . $idx, $number);
				$excel->getActiveSheet()->setCellValue('B' . $idx, $data_ponumber['label']);
				$excel->getActiveSheet()->setCellValue('C' . $idx, $data_ponumber['ProjectName']);
				$excel->getActiveSheet()->getStyle('A' . $idx . ':C' . $idx)->applyFromArray($styleBorderFull, false);

				$excel->addNamedRange(
					new PHPExcel_NamedRange(
						'ponumber',
						$excel->getSheetByName('PO Number Reference'),
						'B3:B2500'
					)
				);

				$idx++;
				$number++;
			}

			$columnSet = 'A2:C2';
			$excel->getActiveSheet()->mergeCells('A1:C1');
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);
			// End Sheet 2

			// Sheet 3
			// Reference Vendor Name
			$excel->createSheet(1)->setTitle("Vendor Name Reference");
			$excel->setActiveSheetIndex(1);
			$excel->getActiveSheet()->setCellValue('A1', 'REFERENCE VENDOR NAME');
			$excel->getActiveSheet()->setCellValue('A2', 'No');
			$excel->getActiveSheet()->setCellValue('B2', 'Vendor Name');

			$vendor = $this->mcombo->GetVendorList();

			$number = 1;
			$idx = 3;
			foreach ($vendor as $data_vendor) {
				$excel->getActiveSheet()->setCellValue('A' . $idx, $number);
				$excel->getActiveSheet()->setCellValue('B' . $idx, $data_vendor['label']);
				$excel->getActiveSheet()->getStyle('A' . $idx . ':C' . $idx)->applyFromArray($styleBorderFull, false);

				$excel->addNamedRange(
					new PHPExcel_NamedRange(
						'vendor',
						$excel->getSheetByName('Vendor Name Reference'),
						'B3:B2500'
					)
				);

				$idx++;
				$number++;
			}

			$columnSet = 'A2:C2';
			$excel->getActiveSheet()->mergeCells('A1:C1');
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);
			// End Sheet 3

			// Sheet 4
			// Reference Subcont
			$excel->createSheet(1)->setTitle("Subcont Reference");
			$excel->setActiveSheetIndex(1);
			$excel->getActiveSheet()->setCellValue('A1', 'REFERENCE SUBCONT');
			$excel->getActiveSheet()->setCellValue('A2', 'No');
			$excel->getActiveSheet()->setCellValue('B2', 'Subcont');

			$subcont = $this->mcombo->GetSubContList();

			$number = 1;
			$idx = 3;
			foreach ($subcont as $data_subcont) {
				$excel->getActiveSheet()->setCellValue('A' . $idx, $number);
				$excel->getActiveSheet()->setCellValue('B' . $idx, $data_subcont['label']);
				$excel->getActiveSheet()->getStyle('A' . $idx . ':C' . $idx)->applyFromArray($styleBorderFull, false);

				$excel->addNamedRange(
					new PHPExcel_NamedRange(
						'subcont',
						$excel->getSheetByName('Subcont Reference'),
						'B3:B2500'
					)
				);

				$idx++;
				$number++;
			}

			$columnSet = 'A2:C2';
			$excel->getActiveSheet()->mergeCells('A1:C1');
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
			$excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);
			// End Sheet 4

			$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
			$namaFile = 'template_project_loan.xlsx';
			$objWriter->save('files/tmp/' . $namaFile);
			$this->response(array('success' => true, 'url' => 'files/tmp/' . $namaFile), 200);
		} catch (Exception $exc) {
			$this->response(array('success' => false, 'message' => $exc), 400);
		}
	}

	function list_import_failed_get()
	{
		$pSearch["keySearch"] = $this->get("keySearch");
		$pSearch["StartDate"] = $this->get("StartDate");
		$pSearch["EndDate"] = $this->get("EndDate");
		$pSearch["CustomerID"] = $this->get("CustomerID");

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
		$data = $this->mloan->list_import_failed($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function upload_post()
	{
		if (!file_exists('files/finance/loan')) {
			mkdir('files/finance/loan', 0777, true);
		}

		//Cek file images
		$ExtNya = GetFileExt($_FILES['MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoInput2']['name']);
		if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
			$result['success'] = false;
			$result['message'] = lang('File types not allowed');
			$this->response($result, 400);
		} else {
			if ($_FILES['MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoInput2']['name'] != '') {
				$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoInput2']['name'];
				$fileupload['MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoInput2'] = $_FILES['MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoInput2'];

				if ($_POST["OpsiDisplay"] == "insert") {
					if (file_exists($_POST["MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoOld2"])) {
						unlink($_POST["MitraJaya_view_Finance_PinjamanSubCont_WinFormLoanDetail-Form-PhotoOld2"]);
					}
				}

				$upload = move_upload($fileupload, 'files/finance/loan/' . $gambar);
				if (isset($upload['upload_data'])) {
					$result['success'] = true;
					$result['file'] = "files/finance/loan/" . $upload['upload_data']['file_name'];
					$this->response($result, 200);
				} else {
					$result['success'] = false;
					$result['message'] = 'Upload failed';
					$this->response($result, 400);
				}
			}
		}
	}

	public function import_loan_post()
	{
		$this->load->model("morder");
		$this->load->model("mcombo");
		$this->load->helper('string');

		// buat folder jika blm ada
		if (!is_dir('files/tmp/import'))
			mkdir('files/tmp/import', 0777, TRUE);

		$config['upload_path']      = './files/tmp/import';
		$config['allowed_types']    = 'xlsx|xls';
		$config['file_name']        = 'import-' . random_string('alnum', 12) . time();

		$this->load->library('upload', $config);

		if ($this->upload->do_upload('loan_ImportFile')) {
			$file   = $this->upload->data();
			$reader = ReaderEntityFactory::createXLSXReader();
			$reader->open($_FILES['loan_ImportFile']['tmp_name']);

			// untuk validasi        
			foreach ($reader->getSheetIterator() as $sheet) {
				$numRow = 1;
				$success = 0;
				$err	 = 0;
				$dataError = array();

				//looping pembacaan row dalam sheet
				foreach ($sheet->getRowIterator() as $row) {

					if ($numRow >= 4) {
						$StatusData = true;
						$Error		= array();

						//ambil cell
						$cells = $row->getCells();

						$ContractNumber = $this->morder->CheckExistContractNumber($cells[6]->getValue());

						if (!$ContractNumber) {
							$StatusData = false;

							array_push($Error, "Contract Number Not Exist");
						}

						switch ($cells[4]->getValue()) {
							case "1":
								$Label = "Vendor";
								$loanType = "vendor";
								$Name = $this->mcombo->GetVendorList($cells[5]->getValue());
								$data['VendorName']         = $Name[0]["id"];
								break;
							case "2":
								$Label = "Subcont";
								$loanType = "subcont";
								$Name = $this->mcombo->GetSubContList($cells[5]->getValue());
								$data['SubcontName']        = $Name[0]["id"];
								break;
							case "3":
								$Label = "Employee";
								$loanType = "employee";
								$Name = $this->mcombo->GetEmployeeList($cells[5]->getValue());
								$data['EmployeeName']       = $Name[0]["id"];
								break;
							default:
								$StatusData = false;
								$Name = [];
								$Label = "Type";
								$loanType = null;
						}

						if (count($Name) == 0) {
							$StatusData = false;

							array_push($Error, $Label . " Not Found");
						}

						$project = $this->morder->getProjectIDByContractNumber($cells[6]->getValue());
						$data['ProjectID']          = $project["OrderBookID"];
						$data['LoanType']           = $loanType;
						$data['LoanDate']           = @date_format($cells[1]->getValue(), 'Y-m-d');
						$data['LoanTransferDate']   = @date_format($cells[3]->getValue(), 'Y-m-d');
						$data['LoanAmount']         = $cells[2]->getValue();
						$data['LoanDescription']    = $cells[8]->getValue();
						$data['LoanAmountDescription']  = $cells[7]->getValue();
						$data['CreatedDate']        = date("Y-m-d H:i:s");
						$data['CreatedBy']          = $_SESSION["user_id"];

						if (!$StatusData) {

							$dataError[$err] = $data;
							$dataError[$err]["ErrorMessages"] = implode(", ", $Error);
							$err++;
						}

						if ($StatusData) {
							$this->db->insert("mj_loan", $data);
							$success++;
						}
					}

					$numRow++;
				}

				if (count($dataError) > 0) {
					$this->db->truncate("mj_loan_tmp");
					$this->db->insert_batch("mj_loan_tmp", $dataError);
				}
				break;
			}
			//tutup spout reader
			$reader->close();

			$this->response(array(
				'success' => true,
				'message' => array("Success" => $success, "Failed" => $err),
			), 200);
		} else {
			$error = array('error' => $this->upload->display_errors());
			$this->response(array(
				'success' => false,
				'message' => 'Bad request',
				'error' => $error
			), 400);
		}
	}

	public function clear_data_get()
	{
		$this->db->truncate("mj_loan_tmp");

		$this->response(array(
			'success' => true
		));
	}
}
