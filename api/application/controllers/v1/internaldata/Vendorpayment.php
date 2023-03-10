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
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;
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
class Vendorpayment extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("mvendorpayment");
    }

	function list_get(){
		$pSearch["keySearch"] = $this->get("keySearch");
		$pSearch["VendorID"] = $this->get("VendorID");
		$pSearch["ProjectID"] = $this->get("ProjectID");
		
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
        $data = $this->mvendorpayment->list_payment($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

    function payment_vendor_list_get(){
		$pSearch["PaymentID"] = $this->get("PaymentID");
		
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
        $data = $this->mvendorpayment->list_payment_vendor($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_payment_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_InternalData_VendorPayment_MainForm-FormBasicData-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }

		$paramPost["Amount"] 		= str_replace(",","", $paramPost["Amount"]);
		$paramPost["Insurance"] 	= str_replace(",","", $paramPost["Insurance"]);
		$paramPost["PPHValue"] 		= str_replace(",","", $paramPost["PPHValue"]);
		$paramPost["CashbonAmount"] = str_replace(",","", $paramPost["CashbonAmount"]);
		$paramPost["SIOK3Amount"] 	= str_replace(",","", $paramPost["SIOK3Amount"]);
		$paramPost["Outstanding"] 	= str_replace(",","", $paramPost["Outstanding"]);
		$paramPost["PaidAmount"] 	= str_replace(",","", $paramPost["PaidAmount"]);

        $checkingDocNoPayment = $this->mvendorpayment->checkingDocNoPayment("DocumentNo",$paramPost["DocumentNo"],$paramPost["PaymentID"]);
    
        if($checkingDocNoPayment["exist"] == 1){
            $return["success"] = "false";
            $return["message"] = "Document Number Already Exist";
            $this->response($return, 400);
            return;
        }

		if ($varPost['OpsiDisplay'] == 'insert') {
            $proses = $this->mvendorpayment->insert_payment($paramPost);
        } else {
            $proses = $this->mvendorpayment->update_payment($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

    function submit_payment_vendor_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_InternalData_VendorPayment_WinFormVendorPayment-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }


        $checkingDocNo = $this->mvendorpayment->CheckDocNo("DocumentNo",$paramPost["DocumentNo"],$paramPost["VendorPaymentID"]);
    
        if($checkingDocNo["exist"] == 1){
            $return["success"] = "false";
            $return["message"] = "Document Number Already Exist";
            $this->response($return, 400);
            return;
        }
        
		if ($varPost['OpsiDisplay'] == 'insert') {

            $proses = $this->mvendorpayment->insert_payment_vendor($paramPost);
        } else {
            $proses = $this->mvendorpayment->update_payment_vendor($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_payment_get(){
		$PaymentID = $this->get("PaymentID");

        $data = $this->mvendorpayment->form_payment($PaymentID);

        $this->response($data, 200);
	}

    function form_payment_vendor_get(){
		$VendorPaymentID = $this->get("VendorPaymentID");

        $data = $this->mvendorpayment->form_payment_vendor($VendorPaymentID);

        $this->response($data, 200);
	}

    function delete_payment_delete(){
		$PaymentID 	= $this->delete("PaymentID");
		$DocumentNo = $this->delete("DocumentNo");

		$data["StatusCode"] = "nullified";
		$data["DocumentNo"] = $DocumentNo."-deleted";

		$this->db->where("PaymentID", $PaymentID);
		$query = $this->db->update("mj_vendorpayment", $data);

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

    function delete_payment_vendor_delete(){
		$VendorPaymentID = $this->delete("VendorPaymentID");

		$data["StatusCode"] = "nullified";

		$this->db->where("VendorPaymentID", $VendorPaymentID);
		$query = $this->db->update("mj_vendorpayment_pay", $data);

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

    function export_payment_post(){
        ini_set('memory_limit', -1);
        ini_set('max_execution_time', 0);
		
		$pSearch["keySearch"] = $this->post("keySearch");
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
          
		
        $dataList       = $this->mvendorpayment->list_payment_excel($pSearch, $sortingField, $sortingDir);

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
            $namaFile = date('Y-m-d_H-i-s') . '_export_excel_payment.xlsx';
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

	function list_import_failed_get(){
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
        $data = $this->mvendorpayment->list_import_failed($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	public function import_payment_post(){
		$this->load->helper('string');
		$this->load->model('minvoice');

        // buat folder jika blm ada
        if (!is_dir('files/tmp/import'))
            mkdir('files/tmp/import', 0777, TRUE);
        
        $config['upload_path']      = './files/tmp/import';
        $config['allowed_types']    = 'xlsx|xls';
        $config['file_name']        = 'import-' . random_string('alnum', 12) . time();

        $this->load->library('upload', $config);

		if ($this->upload->do_upload('payment_ImportFile')) {
            $file   = $this->upload->data();
            $reader = ReaderEntityFactory::createXLSXReader();
            $reader->open($_FILES['payment_ImportFile']['tmp_name']);

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

						$checkingDocNo = $this->mvendorpayment->checkingDocNoPayment("DocumentNo",$cells[1]->getValue(),'');
    
						if($checkingDocNo["exist"] == 1){
							$StatusData = false;
							
							array_push($Error, "Document Number Already Exist");
						}

						$PONumber = $this->minvoice->getPONumber($cells[3]->getValue());
						if(!$PONumber){
							$StatusData = false;
							
							array_push($Error, "PO Number Not Found");
						}

						$dataVendor = $this->mvendorpayment->getVendorID($cells[2]->getValue());
						if(!$dataVendor){
							$StatusData = false;
							
							array_push($Error, "Vendor / Subcont Not Found");
						}

						$PPHValue 	= ($cells[6]->getValue() * $cells[8]->getValue() / 100);
						$Insurance 	= ($cells[6]->getValue()*3)/100;
						$Cashbon	= ($cells[10]->getValue() == "") ? 0 : $cells[10]->getValue();
						$SIOK3		= ($cells[12]->getValue() == "") ? 0 : $cells[12]->getValue();
						$data['DocumentNo'] 		= $cells[1]->getValue();
						$data['ProjectID'] 			= $PONumber["OrderBookID"];
						$data['MitraName'] 			= $dataVendor["VendorID"];
						$data['Type'] 				= $dataVendor["VendorType"];
						$data['Description'] 		= $cells[7]->getValue();
						$data['InvoiceComplete'] 	= @date_format($cells[4]->getValue(), 'Y-m-d');
						$data['DueDate'] 			= @date_format($cells[5]->getValue(), 'Y-m-d');
						$data['PeriodMonth'] 		= @date_format($cells[4]->getValue(), 'm');
						$data['PeriodYear'] 		= @date_format($cells[4]->getValue(), 'Y');
						$data['Amount'] 			= $cells[6]->getValue();
						$data['Insurance'] 			= $Insurance;
						$data['PPH23Option'] 		= $cells[8]->getValue();
						$data['PPHValue']			= $PPHValue;
						$data['CashbonDocumentNumber']	= $cells[9]->getValue();
						$data['CashbonAmount']	= $cells[10]->getValue();
						$data['SIOK3Name']		= $cells[11]->getValue();
						$data['SIOK3Amount']	= $cells[12]->getValue();
						$data['PaidDate']		= @date_format($cells[13]->getValue(), 'Y-m-d');
						$data['PaidAmount']		= $cells[14]->getValue();
						$data['Outstanding']	= $cells[6]->getValue() - ($Insurance + $PPHValue + $Cashbon + $SIOK3);

                        // echo "<pre>";print_r($data);die;

                        if (!$StatusData) {
							
							$dataError[$err] = $data;
							$dataError[$err]["ErrorMessages"] = implode(", ", $Error);
							$err++;
                        }

						if($StatusData){
							$this->db->insert("mj_vendorpayment", $data);
							$success++;
						}
                    }

                    $numRow++;
                }
				
				if(count($dataError) > 0){
					$this->db->truncate("mj_vendorpayment_temp");
					$this->db->insert_batch("mj_vendorpayment_temp", $dataError);
				}
                break;
            }
            //tutup spout reader
            $reader->close();

            $this->response(array(
                'success' => true,
                'message' => array("Success"=> $success, "Failed"=> $err),
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

	public function clear_data_get(){
		$this->db->truncate("mj_vendorpayment_temp");

		$this->response(array(
			'success' => true
		));
	}

	public function generate_template_post(){
		$data = $this->post();
        try{
            include APPPATH.'third_party/PHPExcel18/PHPExcel.php';        
            $excel = new PHPExcel();

            $excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
                ->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
                ->setTitle("Vendor Payment")
                ->setSubject("Vendor Payment")
                ->setDescription("Vendor Payment template")
                ->setKeywords("Vendor Payment");
            
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
            $excel->getActiveSheet()->setTitle("Vendor Subcont Payment Template");
            $excel->getActiveSheet()->setCellValue('A1', 'TEMPLATE GENERATOR VENDOR / SUBCONT PAYMENT');
            $excel->getActiveSheet()->setCellValue('A2', 'No');
            $excel->getActiveSheet()->setCellValue('B2', 'Document Number');
            $excel->getActiveSheet()->setCellValue('C2', 'Vendor / Subcont Name');
            $excel->getActiveSheet()->setCellValue('D2', 'PO Number');
            $excel->getActiveSheet()->setCellValue('E2', 'Invoice Date');
            $excel->getActiveSheet()->setCellValue('F2', 'Due Date');
            $excel->getActiveSheet()->setCellValue('G2', 'Amount');
            $excel->getActiveSheet()->setCellValue('H2', 'Description');
            $excel->getActiveSheet()->setCellValue('I2', 'PPH (%)');
            $excel->getActiveSheet()->setCellValue('J2', 'Doc Number (Cashbon)');
            $excel->getActiveSheet()->setCellValue('K2', 'Cashbon Amount');
            $excel->getActiveSheet()->setCellValue('L2', 'SIO K3 Name');
            $excel->getActiveSheet()->setCellValue('M2', 'SIO K3 Amount');
            $excel->getActiveSheet()->setCellValue('N2', 'Paid Date');
            $excel->getActiveSheet()->setCellValue('O2', 'Paid Amount');

            $excel->getActiveSheet()->setCellValue('A3', '1');
            $excel->getActiveSheet()->setCellValue('B3', 'BP3/VIII-22/385');
            $excel->getActiveSheet()->setCellValue('C3', 'Sutariyono');
            $excel->getActiveSheet()->setCellValue('D3', '4541763510');

            $excel->getActiveSheet()->setCellValue('E3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('E3:E2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('F3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('F3:F2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('G3', '50000000');
            $excel->getActiveSheet()->setCellValue('H3', 'Pembyaran Project A Progress 10%');
            $excel->getActiveSheet()->setCellValue('I3', '4');
            $excel->getActiveSheet()->setCellValue('J3', 'F1/VI-22/077');
            $excel->getActiveSheet()->setCellValue('K3', '4000000');
            $excel->getActiveSheet()->setCellValue('L3', 'John, Doe, Smith');
            $excel->getActiveSheet()->setCellValue('M3', '4000000');
            $excel->getActiveSheet()->setCellValue('N3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('N3')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('O3', '50000000');

            $columnSet = 'A2:O2';
            $excel->getActiveSheet()->mergeCells('A1:E1');
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);  
            // End Sheet 5

            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
            $namaFile = 'template_vendor_subcont_payment.xlsx';
            $objWriter->save('files/tmp/'.$namaFile);
            $this->response(array('success' => true, 'url' => 'files/tmp/'.$namaFile), 200);
        }catch(Exception $exc) {

			echo $exc;die;
            $this->response(array('success' => false, 'message' => $exc), 400);
        }
	}
}
?>
