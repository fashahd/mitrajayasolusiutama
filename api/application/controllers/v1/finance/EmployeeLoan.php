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
class Employeeloan extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("mloanemployee");
    }

	function list_get(){
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
        $data = $this->mloanemployee->list_loan($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

    function payment_loan_list_get(){
		$pSearch["EmployeeLoanID"] = $this->get("EmployeeLoanID");
		
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
        $data = $this->mloanemployee->list_payment_loan($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_loan_post(){
		
        $varPost = $_POST;
        $paramPost = array();

		if ($varPost['OpsiDisplay'] == 'insert') {

            foreach ($varPost as $key => $value) {
                $keyNew = str_replace("MitraJaya_view_Finance_Loan_MainForm-FormBasicData-", '', $key);
                if ($value == "") {
                    $value = null;
                }
                $paramPost[$keyNew] = $value;
            }

            $proses = $this->mloanemployee->insert_loan($paramPost);
        } else {

            foreach ($varPost as $key => $value) {
                $keyNew = str_replace("MitraJaya_view_Finance_Loan_MainForm-FormBasicData-", '', $key);
                if ($value == "") {
                    $value = null;
                }
                $paramPost[$keyNew] = $value;
            }

			echo "<pre>";print_r($paramPost);die;

            $proses = $this->mloanemployee->update_loan($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

    function submit_payment_loan_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Finance_Loan_WinFormLoanPayment-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }
        
		if ($varPost['OpsiDisplay'] == 'insert') {

            $proses = $this->mloanemployee->insert_payment_loan($paramPost);
        } else {
            $proses = $this->mloanemployee->update_payment_loan($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_loan_get(){
		$EmployeeLoanID = $this->get("EmployeeLoanID");

        $data = $this->mloanemployee->form_loan($EmployeeLoanID);

        $this->response($data, 200);
	}

    function form_payment_loan_get(){
		$EmployeeLoanPaymentID = $this->get("EmployeeLoanPaymentID");

        $data = $this->mloanemployee->form_payment_loan($EmployeeLoanPaymentID);

        $this->response($data, 200);
	}

    function delete_loan_delete(){
		$LoanID = $this->delete("LoanID");

		$data["StatusCode"] = "nullified";

		$this->db->where("LoanID", $LoanID);
		$query = $this->db->update("mj_loan", $data);

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

    function delete_payment_loan_delete(){
		$EmployeeLoanPaymentID = $this->delete("EmployeeLoanPaymentID");

		$data["StatusCode"] = "nullified";

		$this->db->where("EmployeeLoanPaymentID", $EmployeeLoanPaymentID);
		$query = $this->db->update("mj_employee_loan_payment", $data);

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

    function export_invoice_post(){
        ini_set('memory_limit', -1);
        ini_set('max_execution_time', 0);
		
		$pSearch["keySearch"] = $this->post("keySearch");
		$pSearch["StartDate"] = $this->post("StartDate");
		$pSearch["EndDate"] = $this->post("EndDate");
		$pSearch["CustomerID"] = $this->post("CustomerID");
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
          
		
        $dataList       = $this->minvoice->list_invoice_excel($pSearch, $sortingField, $sortingDir);

		if(count($dataList)){

            //Kolom Header order book
            $dataHeader = array('No');
            foreach($dataList[0] as $key => $value){
                array_push($dataHeader,$key);
            }
            //Kolom Header order book

			//Kolom Body order book
            $dataListExcel = array();
            $no = 1;
            foreach ($dataList as $key => $value) {
                $data = array();
                array_push($data,$no);
                foreach($value as $keyx => $valuex){
                    array_push($data,$valuex);
                }
                $dataListExcel[$key] = $data;
                $no++;
            }
            //Kolom Body order book

            $writer = WriterEntityFactory::createXLSXWriter(); // for XLSX files// 
            $namaFile = date('Y-m-d_H-i-s') . '_export_excel_invoice.xlsx';
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

            for ($i=0; $i < count($dataListExcel); $i++) {
                $dataRows = $dataListExcel[$i];
                $cells = array();
    
                for ($j=0; $j < count($dataRows); $j++) {
                    $styleRow = null;
                    $dataRow = null;
    
                    //cek apakah numeric
                    if(is_numeric($dataRows[$j])){
                        $styleRow = $styleFormatAngka;
                        $dataRow = $dataRows[$j];
                    } else {
                        //cek apakah tanggal
                        if($this->validateDate($dataRows[$j]) == true) {
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
		}else{
			$response["success"] = true;
			$response["filenya"] = '';

            $this->response($response, 400);
        }
	}

    private function validateDate($date, $format = 'Y-m-d') {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }
}
?>
