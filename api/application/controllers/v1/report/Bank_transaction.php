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
class Bank_transaction extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("mbank_transaction");
    }

	function list_get(){
		$pSearch["Month"] = $this->get("Month");
		$pSearch["Year"] = $this->get("Year");

        // echo '<pre>'; print_r($pSearch); exit;
        $data = $this->mbank_transaction->list_bank_transaction($pSearch);
        $this->response($data, 200);
	}

	function submit_transaction_post(){
		
        $varPost = $_POST;
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Report_BankTransaction_MainGrid-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		if ($paramPost['BankTransactionID'] == '') {

            $proses = $this->mbank_transaction->insert_bank_transaction($paramPost);
        } else {
            $proses = $this->mbank_transaction->update_bank_transaction($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

    function delete_transaction_delete(){
		$BankTransactionID = $this->delete("BankTransactionID");

		$data["StatusCode"] = "nullified";

		$this->db->where("BankTransactionID", $BankTransactionID);
		$query = $this->db->update("mj_bank_transaction", $data);

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

            //Kolom Header Bank Transaction
            $dataHeader = array('No');
            foreach($dataList[0] as $key => $value){
                array_push($dataHeader,$key);
            }
            //Kolom Header Bank Transaction

			//Kolom Body Bank Transaction
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
            //Kolom Body Bank Transaction

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

	public function export_excel_post(){
		$pSearch["Month"] 	= $this->post("Month");
		$pSearch["Year"] 	= $this->post("Year");

		
        $dataList = $this->mbank_transaction->list_bank_transaction_excel($pSearch);

		if(count($dataList['data'])){

			include APPPATH.'third_party/PHPExcel18/PHPExcel.php';        
            $excel = new PHPExcel();

            $excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
                ->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
                ->setTitle("Bank Transaction")
                ->setSubject("Bank Transaction")
                ->setDescription("Bank Transaction template")
                ->setKeywords("Bank Transaction");
            
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

			$excel->getActiveSheet()->setTitle("Bank Transaction");

			//Kolom Header Bank Transaction
            $dataHeader = array('No');
            foreach($dataList['data'][0] as $key => $value){
                array_push($dataHeader,$key);
            }

			//Kolom Body Bank Transaction
            $dataListExcel = array();
            $no = 1;
            foreach ($dataList['data'] as $key => $value) {
                $data = array();
                array_push($data,$no);
                foreach($value as $keyx => $valuex){
                    array_push($data,$valuex);
                }
                $dataListExcel[$key] = $data;
                $no++;
            }
            //Kolom Body Bank Transaction

            //Kolom Header Bank Transaction
			$col = 0;
			foreach($dataHeader as $keyheader => $val){
				$row = 1;
				$excel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $val);
				$col++;
			}


            //Kolom Body Bank Transaction
			$row = 2;
			foreach($dataListExcel as $keybody => $val){
				$col = 0;
				foreach($val as $value){
					$excel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $value);
					$col++;
				}
				$row++;
			}
			// echo "<pre>";print_r($dataHeader);die;

            // $excel->getActiveSheet()->setCellValue('A1', 'TEMPLATE GENERATOR Bank Transaction');

			$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
            $namaFile = time().'_data_bank_transaction.xlsx';
            $objWriter->save('files/tmp/'.$namaFile);

			$response["success"] = true;
			$response["filenya"] = base_url() . 'files/tmp/'.$namaFile;
    
            $this->response($response, 200);
		}else{
			$response["success"] = true;
			$response["filenya"] = '';

            $this->response($response, 400);
        }
	}

	// Import Bank Transaction 
    public function generate_template_post(){
        $data = $this->post();
        try{
            include APPPATH.'third_party/PHPExcel18/PHPExcel.php';        
            $excel = new PHPExcel();

            $excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
                ->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
                ->setTitle("Bank Transaction")
                ->setSubject("Bank Transaction")
                ->setDescription("Bank Transaction template")
                ->setKeywords("Bank Transaction");
            
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
            $excel->getActiveSheet()->setTitle("Bank Transaction Template");
            $excel->getActiveSheet()->setCellValue('A1', 'TEMPLATE GENERATOR BANK TRANSACTION');
            $excel->getActiveSheet()->setCellValue('A2', 'No');
            $excel->getActiveSheet()->setCellValue('B2', 'Date Transaction');
            $excel->getActiveSheet()->setCellValue('C2', 'Checking Account');
            $excel->getActiveSheet()->setCellValue('D2', 'Transaction No');
            $excel->getActiveSheet()->setCellValue('E2', 'Cost Element');
            $excel->getActiveSheet()->setCellValue('F2', 'Description');
            $excel->getActiveSheet()->setCellValue('G2', 'Transaction Type');
            $excel->getActiveSheet()->setCellValue('H2', 'Amount');
            $excel->getActiveSheet()->setCellValue('I2', 'Project');

            $excel->getActiveSheet()->setCellValue('A3', '1');
            $excel->getActiveSheet()->setCellValue('B3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('B3:B2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);

            $excel->getActiveSheet()->setCellValue('C3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('C3:C2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
			
            $excel->getActiveSheet()->setCellValue('D3', '');
            $excel->getActiveSheet()->setCellValue('E3', 'MSU02');
            $excel->getActiveSheet()->setCellValue('F3', 'Pembayaran');
            $excel->getActiveSheet()->setCellValue('G3', 'debit');
            $excel->getActiveSheet()->setCellValue('H3', '50000000');
            $excel->getActiveSheet()->setCellValue('I3', 'SALDO AWAL');

            $columnSet = 'A2:J2';
            $excel->getActiveSheet()->mergeCells('A1:C1');
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);  
            // End Sheet 5

            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
            $namaFile = 'template_bank_transaction.xlsx';
            $objWriter->save('files/tmp/'.$namaFile);
            $this->response(array('success' => true, 'url' => 'files/tmp/'.$namaFile), 200);
        }catch(Exception $exc) {
            $this->response(array('success' => false, 'message' => $exc), 400);
        }
    }

	public function import_post(){
		// buat folder jika blm ada
        $this->load->helper('string');
        if (!is_dir('files/tmp/import'))
            mkdir('files/tmp/import', 0777, TRUE);
        
        $config['upload_path']      = './files/tmp/import';
        $config['allowed_types']    = 'xlsx|xls';
        $config['file_name']        = 'import-' . random_string('alnum', 12) . time();

        $this->load->library('upload', $config);

		if ($this->upload->do_upload('bank_transaction_ImportFile')) {
            $file   = $this->upload->data();
            $reader = ReaderEntityFactory::createXLSXReader();
            $reader->open($_FILES['bank_transaction_ImportFile']['tmp_name']);

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

						$Costelement = $this->mbank_transaction->CheckExistCostelement($cells[4]->getValue());

						if($Costelement == ""){
							$StatusData = false;
							
							array_push($Error, "Cost Element Not Found");
						}

						$ProjectID = $this->mbank_transaction->CheckExistProjectID($cells[8]->getValue());

						if($ProjectID == ""){
							$StatusData = false;
							
							array_push($Error, "Project Not Found");
						}

						$TransactionType = $cells[6]->getValue();
						$Amount 	= $cells[7]->getValue();
						$data['Costelement'] 		= $Costelement;
						$data['DateTransaction'] 	= @date_format($cells[1]->getValue(), 'Y-m-d');
						$data['CheckingAccount'] 	= @date_format($cells[2]->getValue(), 'Y-m-d');
						$data['NoVoucher'] 			= $cells[3]->getValue();
						$data['Description'] 		= $cells[5]->getValue();
						$data['TransactionType'] 	= $TransactionType;
						$data['ProjectID'] 			= $ProjectID;
						($TransactionType == "debit") ? $data['TransactionAmountDebit'] = $Amount  :  $data['TransactionAmountCredit'] = $Amount;

                        if (!$StatusData) {
							
							$dataError[$err] = $data;
							$dataError[$err]["ErrorMessages"] = implode(", ", $Error);
							$err++;
                        }

						if($StatusData){
							$this->db->insert("mj_bank_transaction", $data);
							$success++;
						}
                    }

                    $numRow++;
                }
				
				if(count($dataError) > 0){
					$this->db->truncate("mj_bank_transaction_tmp");
					$this->db->insert_batch("mj_bank_transaction_tmp", $dataError);
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
        $data = $this->mbank_transaction->list_import_failed($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	public function clear_data_get(){
		$this->db->truncate("mj_bank_transaction_tmp");

		$this->response(array(
			'success' => true
		));
	}
}
?>
