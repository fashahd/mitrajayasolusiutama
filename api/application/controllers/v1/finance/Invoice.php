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
class Invoice extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("minvoice");
    }

	function list_get(){
		$pSearch["keySearch"] = $this->get("keySearch");
		$pSearch["Month"] = $this->get("Month");
		$pSearch["Year"] = $this->get("Year");
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
        $data = $this->minvoice->list_invoice($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_invoice_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Finance_Invoice_MainForm-FormBasicData-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }

		$paramPost["InvoiceAmount"] = str_replace(",","",$paramPost["InvoiceAmount"]);
		$paramPost["InvoiceVAT"] = str_replace(",","",$paramPost["InvoiceVAT"]);
		$paramPost["InvoiceTotal"] = str_replace(",","",$paramPost["InvoiceTotal"]);
		$paramPost["PPH23Value"] = str_replace(",","",$paramPost["PPH23Value"]);
		$paramPost["GrossIncome"] = str_replace(",","",$paramPost["GrossIncome"]);
		$paramPost["NettIncome"] = str_replace(",","",$paramPost["NettIncome"]);


		if ($varPost['OpsiDisplay'] == 'insert') {
            
            $CheckInvNo = $this->minvoice->CheckInvNo("InvoiceNumber",$paramPost["InvoiceNumber"],$paramPost["InvoiceID"]);

            if($CheckInvNo["exist"] == 1){
                $return["success"] = "false";
                $return["message"] = "Invoice Number Already Exist";
                $this->response($return, 400);
                return;
            }

            $proses = $this->minvoice->insert_invoice($paramPost);
        } else {
            $proses = $this->minvoice->update_invoice($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_invoice_get(){
		$InvoiceID = $this->get("InvoiceID");

        $data = $this->minvoice->form_invoice($InvoiceID);

        $this->response($data, 200);
	}

    function delete_invoice_delete(){
		$InvoiceID 		= $this->delete("InvoiceID");
		$InvoiceNumber 	= $this->delete("InvoiceNumber");

		$data["StatusCode"] 	= "nullified";
		$data["InvoiceNumber"]	= $InvoiceNumber."-deleted";

		$this->db->where("InvoiceID", $InvoiceID);
		$query = $this->db->update("mj_invoice", $data);

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

	// Import INVOICE 
    public function generate_template_post(){
        $data = $this->post();
        try{
            include APPPATH.'third_party/PHPExcel18/PHPExcel.php';        
            $excel = new PHPExcel();

            $excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
                ->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
                ->setTitle("INVOICE")
                ->setSubject("INVOICE")
                ->setDescription("INVOICE template")
                ->setKeywords("INVOICE");
            
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
            $excel->getActiveSheet()->setTitle("INVOICE Template");
            $excel->getActiveSheet()->setCellValue('A1', 'TEMPLATE GENERATOR INVOICE');
            $excel->getActiveSheet()->setCellValue('A2', 'No');
            $excel->getActiveSheet()->setCellValue('B2', 'Invoice Number');
            $excel->getActiveSheet()->setCellValue('C2', 'Month');
            $excel->getActiveSheet()->setCellValue('D2', 'Year');
            $excel->getActiveSheet()->setCellValue('E2', 'PO Number');
            $excel->getActiveSheet()->setCellValue('F2', 'Tax Number');
            $excel->getActiveSheet()->setCellValue('G2', 'Description');
            $excel->getActiveSheet()->setCellValue('H2', 'Amount');
            $excel->getActiveSheet()->setCellValue('I2', 'VAT (%)');
            $excel->getActiveSheet()->setCellValue('J2', 'Invoice GR');
            $excel->getActiveSheet()->setCellValue('K2', 'Invoice Received');
            $excel->getActiveSheet()->setCellValue('L2', 'Vendor Invoice Number');
            $excel->getActiveSheet()->setCellValue('M2', 'Vendor Tax Number');
            $excel->getActiveSheet()->setCellValue('N2', 'Due Date (Days)');
            $excel->getActiveSheet()->setCellValue('O2', 'Paid Date');
            $excel->getActiveSheet()->setCellValue('P2', 'PPH 23 (%)');

            $excel->getActiveSheet()->setCellValue('A3', '1');
            $excel->getActiveSheet()->setCellValue('B3', '00700/INV-MSU/XI/21');
            $excel->getActiveSheet()->setCellValue('C3', "11");
            $excel->getActiveSheet()->setCellValue('D3', "2022");
            $excel->getActiveSheet()->setCellValue('E3', "4535323035");
            $excel->getActiveSheet()->setCellValue('F3', "010.008-21.74458688");
            $excel->getActiveSheet()->setCellValue('G3', "Pembayaran Jasa Supervisi Standby 1 Orang Per : November 2021 (1 Bulan) (Proyek : ST Moritz)");
            $excel->getActiveSheet()->setCellValue('H3', "6200000");
            $excel->getActiveSheet()->setCellValue('I3', "11");
            $excel->getActiveSheet()->setCellValue('J3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('J3:J2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('K3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('K3:K2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('L3', '00700/INV-MSU/XI/21');
            $excel->getActiveSheet()->setCellValue('M3', '010.008-21.74458688');
            $excel->getActiveSheet()->setCellValue('N3', '45');
            $excel->getActiveSheet()->setCellValue('O3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('O3:O2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('P3', "11");

            $columnSet = 'A2:P2';
            $excel->getActiveSheet()->mergeCells('A1:C1');
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);  
            // End Sheet 5

            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
            $namaFile = 'template_invoice.xlsx';
            $objWriter->save('files/tmp/'.$namaFile);
            $this->response(array('success' => true, 'url' => 'files/tmp/'.$namaFile), 200);
        }catch(Exception $exc) {
            $this->response(array('success' => false, 'message' => $exc), 400);
        }
    }	

	public function import_invoice_post(){
		$this->load->helper('string');

        // buat folder jika blm ada
        if (!is_dir('files/tmp/import'))
            mkdir('files/tmp/import', 0777, TRUE);
        
        $config['upload_path']      = './files/tmp/import';
        $config['allowed_types']    = 'xlsx|xls';
        $config['file_name']        = 'import-' . random_string('alnum', 12) . time();

        $this->load->library('upload', $config);

		if ($this->upload->do_upload('invoice_ImportFile')) {
            $file   = $this->upload->data();
            $reader = ReaderEntityFactory::createXLSXReader();
            $reader->open($_FILES['invoice_ImportFile']['tmp_name']);

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

						$InvoiceNumber = $this->minvoice->CheckExistInvoiceNumber($cells[1]->getValue());

						if($InvoiceNumber){
							$StatusData = false;
							
							array_push($Error, "Invoice Number Already Exist");
						}

						$PONumber = $this->minvoice->getPONumber($cells[4]->getValue());
						if(!$PONumber){
							$StatusData = false;
							
							array_push($Error, "PO Number Not Found");
						}

						$InvoiceVAT = ($cells[7]->getValue() * $cells[8]->getValue() / 100);
						$PPH23Value = ($cells[7]->getValue() * $cells[15]->getValue() / 100);
						
						$data['InvoiceNumber'] 		= $cells[1]->getValue();
						$data['InvoicePeriodMonth'] = $cells[2]->getValue();
						$data['InvoicePeriodYear'] 	= $cells[3]->getValue();
						$data['ContractNumber'] 	= (!$StatusData) ? $cells[4]->getValue() : $PONumber["OrderBookID"];
						$data['CustomerID'] 		= (!$StatusData) ? '' : $PONumber["CustomerID"];
						$data['TaxNumber'] 			= $cells[5]->getValue();
						$data['Description'] 		= $cells[6]->getValue();
						$data['InvoiceAmount'] 		= $cells[7]->getValue();
						$data['VATPercent'] 		= $cells[8]->getValue();
						$data['InvoiceGR'] 			= @date_format($cells[9]->getValue(), 'Y-m-d');
						$data['InvoiceReceived'] 	= @date_format($cells[10]->getValue(), 'Y-m-d');
						$data['VendorInvoiceNumber'] 	= $cells[11]->getValue();
						$data['VendorTaxNumber'] 	= $cells[12]->getValue();
						$data['DueDatePeriod'] 		= $cells[13]->getValue();
						$data['Paid'] 				= @date_format($cells[14]->getValue(), 'Y-m-d');
						$data['PPH23Option']		= $cells[15]->getValue();
						$data['InvoiceVAT']			= $InvoiceVAT;
						$data['InvoiceTotal']		= ($cells[7]->getValue() + $InvoiceVAT);
						$data['GrossIncome']		= ($cells[7]->getValue() + $InvoiceVAT) - $PPH23Value;
						$data['NettIncome']			= ($cells[7]->getValue() - $PPH23Value);

                        if (!$StatusData) {
							
							$dataError[$err] = $data;
							$dataError[$err]["ErrorMessages"] = implode(", ", $Error);
							$err++;
                        }

						if($StatusData){
							$this->db->insert("mj_invoice", $data);
							$success++;
						}
                    }

                    $numRow++;
                }
				
				if(count($dataError) > 0){
					$this->db->truncate("mj_invoice_tmp");
					$this->db->insert_batch("mj_invoice_tmp", $dataError);
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
		$this->db->truncate("mj_invoice_tmp");

		$this->response(array(
			'success' => true
		));
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
        $data = $this->minvoice->list_import_failed($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function notifications_load_get(){
		$pSearch["start"] = $this->get("start");
		$pSearch["limit"] = $this->get("limit");

		$data = $this->minvoice->list_invoice_notif($pSearch);

		$this->response($data, 200);
	}
}
?>
