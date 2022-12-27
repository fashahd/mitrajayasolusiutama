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
class Order extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("morder");
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
        $data = $this->morder->list_order($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
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
        $data = $this->morder->list_import_failed($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function list_invoice_get(){
		$OrderBookID = $this->get("OrderBookID");

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

        $data = $this->morder->list_invoice($OrderBookID, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_order_post(){
		
        $varPost = $_POST;
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Finance_OrderBook_MainForm-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}


		$cekExistCN = $this->morder->CekEksisOrderBook("ContractNumber",$paramPost["ContractNumber"],$paramPost["OrderBookID"]);
		$cekExistJO	= $this->morder->CekEksisOrderBook("JONumber",$paramPost["JONumber"],$paramPost["OrderBookID"]);

		if($cekExistCN["exist"] == 1){
			$return["success"] = "false";
			$return["message"] = "Contract Number Already Registered";
            $this->response($return, 400);
			return;
		}

		if($cekExistJO["exist"] == 1){
			$return["success"] = "false";
			$return["message"] = "JO Number Already Registered";
            $this->response($return, 400);
			return;
		}

		if ($varPost['OpsiDisplay'] == 'insert') {

            $proses = $this->morder->insert_order($paramPost);
        } else {

            $proses = $this->morder->update_order($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_order_get(){
		$OrderBookID = $this->get("OrderBookID");

        $data = $this->morder->form_order_book($OrderBookID);

        $this->response($data, 200);
	}

	function delete_order_delete(){
		$OrderBookID 	= $this->delete("OrderBookID");
		$ContractNumber	= $this->delete("ContractNumber");

		$data["StatusCode"] 	= "nullified";
		$data["ContractNumber"] = $ContractNumber."-deleted";

		$this->db->where("OrderBookID", $OrderBookID);
		$query = $this->db->update("mj_order_book", $data);

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

	function export_order_post(){
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
          
		
        $dataList       = $this->morder->list_order_excel($pSearch, $sortingField, $sortingDir);

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
            $namaFile = date('Y-m-d_H-i-s') . '_export_excel_order_book.xlsx';
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

	// Import Order Book 
    public function generate_template_post(){
        $data = $this->post();
        try{
            include APPPATH.'third_party/PHPExcel18/PHPExcel.php';        
            $excel = new PHPExcel();

            $excel->getProperties()->setCreator('PT. Mitrajaya Solusi Utama')
                ->setLastModifiedBy('PT. Mitrajaya Solusi Utama')
                ->setTitle("Order Book")
                ->setSubject("Order Book")
                ->setDescription("Order Book template")
                ->setKeywords("Order Book");
            
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
            $excel->getActiveSheet()->setTitle("Order Book Template");
            $excel->getActiveSheet()->setCellValue('A1', 'TEMPLATE GENERATOR ORDER BOOK');
            $excel->getActiveSheet()->setCellValue('A2', 'No');
            $excel->getActiveSheet()->setCellValue('B2', 'PO Number');
            $excel->getActiveSheet()->setCellValue('C2', 'Customer');
            $excel->getActiveSheet()->setCellValue('D2', 'PO Date');
            $excel->getActiveSheet()->setCellValue('E2', 'Description');
            $excel->getActiveSheet()->setCellValue('F2', 'Project Name');
            $excel->getActiveSheet()->setCellValue('G2', 'Dept');
            $excel->getActiveSheet()->setCellValue('H2', 'PJ');
            $excel->getActiveSheet()->setCellValue('I2', 'PO (Excld. PPN)');
            $excel->getActiveSheet()->setCellValue('J2', 'PPN');

            $excel->getActiveSheet()->setCellValue('A3', '1');
            $excel->getActiveSheet()->setCellValue('B3', '071/FIDA/SPK/V/21');
            $excel->getActiveSheet()->setCellValue('C3', 'PT Kone Indo Elevator');

            $excel->getActiveSheet()->setCellValue('D3', PHPExcel_Shared_Date::PHPToExcel('2022-01-01'));
            $excel->getActiveSheet()->getStyle('D3:D2000')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD2);
            $excel->getActiveSheet()->setCellValue('E3', 'Description');
            $excel->getActiveSheet()->setCellValue('F3', 'Project Name');
            $excel->getActiveSheet()->setCellValue('G3', 'Stand By');
            $excel->getActiveSheet()->setCellValue('H3', 'Agus');
            $excel->getActiveSheet()->setCellValue('I3', '50000000');
            $excel->getActiveSheet()->setCellValue('J3', '11');

            $columnSet = 'A2:J2';
            $excel->getActiveSheet()->mergeCells('A1:C1');
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleFontBoldHeader);
            $excel->getActiveSheet()->getStyle($columnSet)->applyFromArray($styleBorderFull, false);  
            // End Sheet 5

            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
            $namaFile = 'template_order_book.xlsx';
            $objWriter->save('files/tmp/'.$namaFile);
            $this->response(array('success' => true, 'url' => 'files/tmp/'.$namaFile), 200);
        }catch(Exception $exc) {
            $this->response(array('success' => false, 'message' => $exc), 400);
        }
    }

    public function download_template_get(){
        $filenya =  $this->get('url');
        $namaFile =  $this->get('namaFile');

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="'.$namaFile);
        header('Cache-Control: max-age=0');

        readfile($filenya);
        exit;
    }

	public function import_order_post(){
		$this->load->helper('string');

        // buat folder jika blm ada
        if (!is_dir('files/tmp/import'))
            mkdir('files/tmp/import', 0777, TRUE);
        
        $config['upload_path']      = './files/tmp/import';
        $config['allowed_types']    = 'xlsx|xls';
        $config['file_name']        = 'import-' . random_string('alnum', 12) . time();

        $this->load->library('upload', $config);

		if ($this->upload->do_upload('order_ImportFile')) {
            $file   = $this->upload->data();
            $reader = ReaderEntityFactory::createXLSXReader();
            $reader->open($_FILES['order_ImportFile']['tmp_name']);

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

						$ContractNumber = $this->morder->CheckExistContractNumber($cells[1]->getValue());

						if($ContractNumber){
							$StatusData = false;
							
							array_push($Error, "Contract Number Already Exist");
						}

						$CustomerID = $this->morder->getCustomerID($cells[2]->getValue());
						if(!$CustomerID){
							$StatusData = false;
							
							array_push($Error, "Customer Not Found");
						}

						$DeptID = $this->morder->getDeptID($cells[6]->getValue());
						if(!$DeptID){
							$StatusData = false;
							
							array_push($Error, "Department Not Found");
						}

						$PeopleID = $this->morder->getPeopleID($cells[7]->getValue());
						if(!$PeopleID){
							$StatusData = false;
							
							array_push($Error, "Employee Not Found");
						}

						$ContractPPN = ($cells[8]->getValue() * $cells[9]->getValue() / 100);
						$data['ContractNumber'] 	= $cells[1]->getValue();
						$data['CustomerID'] 		= (!$StatusData) ? $cells[2]->getValue() : $CustomerID;
						$data['ContractDate'] 		= @date_format($cells[3]->getValue(), 'Y-m-d');
						$data['Description'] 		= $cells[4]->getValue();
						$data['ProjectID'] 			= (!$StatusData) ? $cells[5]->getValue() : '';
						$data['DeptID'] 			= (!$StatusData) ? $cells[6]->getValue() : $DeptID;
						$data['PeopleID'] 			= (!$StatusData) ? $cells[7]->getValue() : $PeopleID;
						$data['ContractAmount'] 	= $cells[8]->getValue();
						$data['PPN'] 				= $cells[9]->getValue();
						$data['ContractAmountPPN']	= $ContractPPN;
						$data['TotalContactAmount']	= $cells[8]->getValue() + $ContractPPN;

                        if (!$StatusData) {
							
							$dataError[$err] = $data;
							$dataError[$err]["ErrorMessages"] = implode(", ", $Error);
							$err++;
                        }

						if($StatusData){
							$this->db->insert("mj_order_book", $data);
							$success++;
						}
                    }

                    $numRow++;
                }
				
				if(count($dataError) > 0){
					$this->db->truncate("mj_order_book_tmp");
					$this->db->insert_batch("mj_order_book_tmp", $dataError);
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
		$this->db->truncate("mj_order_book_tmp");

		$this->response(array(
			'success' => true
		));
	}

    private function _importValid($data){
        // supplier name
        if ($data[3]->getValue() == ''){
            return false;
        }
        // gender
        if ($data[2]->getValue() == ''){
            return false;
        }
        // Birthdate
        if ($data[5]->getValue() == ''){
            return false;
        }

        return true;
    }
}
?>
