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
class Neraca extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("mneraca");
    }

    function data_get(){
        $month  = $_GET["month"];
        $year   = $_GET["year"];

        $data   = $this->mneraca->getDataForm($month, $year);

        $this->response($data, 200);
    }

    function data_laba_rugi_get(){
        $month  = $_GET["month"];
        $year   = $_GET["year"];

        $data   = $this->mneraca->getDataLabaRugiForm($month, $year);

        $this->response($data, 200);
    }

	function submit_post(){
		
        $varPost = $_POST;
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Report_Neraca_MainGrid_Form-FormNeraca-", '', $key);
			if ($value == "") {
				$value = null;
			}
            if($keyNew != "month" || $keyNew != "year"){
                $value = str_replace(",","",$value);
            }
			$paramPost[$keyNew] = $value;
		}
        
        $proses = $this->mneraca->submit($paramPost);

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function submit_laba_rugi_post(){
		
        $varPost = $_POST;
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Report_Neraca_MainGrid_Form-FormLabaRugi-", '', $key);
			if ($value == "") {
				$value = null;
			}
            if($keyNew != "month" || $keyNew != "year"){
                $value = str_replace(",","",$value);
            }
			if (strpos($keyNew, "Calculate") !== false) {
				continue;
			}else{
				$paramPost[$keyNew] = $value;
			}
		}
        
        $proses = $this->mneraca->submit_laba_rugi($paramPost);

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function download_excel_get(){
		$sql 	= "SELECT filepath FROM mj_neraca_file WHERE month = ? AND year = ? AND type = ?";
		$query	= $this->db->query($sql, array($_GET["month"], $_GET["year"], $_GET["type"]))->row_array();
		$exist	= file_exists($query["filepath"]);
		if($query["filepath"] != '' && $exist == true){		
			$response["success"] = true;
			$response["filenya"] = base_url() . $query["filepath"];
	
			$this->response($response, 200);
		}else{	
			$response["success"] = false;
			$response["message"] = "File Not Found";
	
			$this->response($response, 400);
		}
	}

	function upload_excel_neraca_post(){
		$ExtNya = GetFileExt($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]]['name']);

		if (!in_array($ExtNya, array('pdf', 'xls', 'xlsx'))) {
			$result['success'] = false;
			$result['message'] = 'File types not allowed';
			$this->response($result, 400);
		} else {
			if ($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]]['name'] != '') {

				$gambar = $_POST["month"]."_".$_POST["year"]."_".$_POST["type"].".".$ExtNya;
				$fileupload['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]] = $_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]];


				if(file_exists('files/neraca/' . $gambar)){
					unlink('files/neraca/' . $gambar);
				}

				$upload = move_upload($fileupload, 'files/neraca/' . $gambar);

				$datapost["filepath"] 	= 'files/neraca/' . $gambar;
				$datapost["month"]		= $_POST["month"];
				$datapost["year"]		= $_POST["year"];
				$datapost["type"]		= $_POST["type"];

				$param = array(
					$datapost["month"],
					$datapost["year"],
					$datapost["type"],
					$datapost["filepath"],
					$datapost["month"],
					$datapost["year"],
					$datapost["type"],
					$datapost["filepath"]
				);

				$sql = "INSERT INTO `mj_neraca_file` (month , year, type, filepath) VALUES (?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE month = ?, year = ?, type = ?, filepath = ?";

				$query = $this->db->query($sql, $param);

				if (isset($upload['upload_data'])) {
					$result['success'] = true;
					$result['file'] = $upload['upload_data']['file_name'];
					$result['message'] = 'Upload Success';
					$this->response($result, 200);
				} else {
					$result['success'] = false;
					$result['message'] = 'Upload failed';
					$this->response($result, 400);
				}
			}
		}
	}

	function upload_excel_post(){
		// if($_POST["type"] == "KasKecil"){
			$ExtNya = GetFileExt($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]]['name']);

			if (!in_array($ExtNya, array('pdf', 'xls', 'xlsx'))) {
				$result['success'] = false;
				$result['message'] = 'File types not allowed';
				$this->response($result, 400);
			} else {
				if ($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]]['name'] != '') {
	
					$gambar = $_POST["month"]."_".$_POST["year"]."_".$_POST["type"].".".$ExtNya;
					$fileupload['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]] = $_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-File'.$_POST["type"]];
	
	
					if(file_exists('files/neraca/' . $gambar)){
						unlink('files/neraca/' . $gambar);
					}
	
					$upload = move_upload($fileupload, 'files/neraca/' . $gambar);
	
					$datapost["filepath"] 	= 'files/neraca/' . $gambar;
					$datapost["month"]		= $_POST["month"];
					$datapost["year"]		= $_POST["year"];
					$datapost["type"]		= $_POST["type"];
	
					$param = array(
						$datapost["month"],
						$datapost["year"],
						$datapost["type"],
						$datapost["filepath"],
						$datapost["month"],
						$datapost["year"],
						$datapost["type"],
						$datapost["filepath"]
					);
	
					$sql = "INSERT INTO `mj_neraca_file` (month , year, type, filepath) VALUES (?, ?, ?, ?)
					ON DUPLICATE KEY UPDATE month = ?, year = ?, type = ?, filepath = ?";
	
					$query = $this->db->query($sql, $param);
	
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['file'] = $upload['upload_data']['file_name'];
						$result['message'] = 'Upload Success';
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}
		// }else{
		// 	$ExtNya = GetFileExt($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput']['name']);
			
		// 	if (!in_array($ExtNya, array('pdf', 'xls', 'xlsx'))) {
		// 		$result['success'] = false;
		// 		$result['message'] = 'File types not allowed';
		// 		$this->response($result, 400);
		// 	} else {
		// 		if ($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput']['name'] != '') {
	
		// 			$gambar = $_POST["month"]."_".$_POST["year"]."_kas.".$ExtNya;
		// 			$fileupload['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput'];
	
	
		// 			if(file_exists('files/neraca/' . $gambar)){
		// 				unlink('files/neraca/' . $gambar);
		// 			}
	
		// 			$upload = move_upload($fileupload, 'files/neraca/' . $gambar);
	
		// 			$datapost["filepath"] 	= 'files/neraca/' . $gambar;
		// 			$datapost["month"]		= $_POST["month"];
		// 			$datapost["year"]		= $_POST["year"];
		// 			$datapost["type"]		= "kas";
	
		// 			$param = array(
		// 				$datapost["month"],
		// 				$datapost["year"],
		// 				$datapost["type"],
		// 				$datapost["filepath"],
		// 				$datapost["month"],
		// 				$datapost["year"],
		// 				$datapost["type"],
		// 				$datapost["filepath"]
		// 			);
	
		// 			$sql = "INSERT INTO `mj_neraca_file` (month , year, type, filepath) VALUES (?, ?, ?, ?)
		// 			ON DUPLICATE KEY UPDATE month = ?, year = ?, type = ?, filepath = ?";
	
		// 			$query = $this->db->query($sql, $param);
	
		// 			if (isset($upload['upload_data'])) {
		// 				$result['success'] = true;
		// 				$result['file'] = $upload['upload_data']['file_name'];
		// 				$result['message'] = 'Upload Success';
		// 				$this->response($result, 200);
		// 			} else {
		// 				$result['success'] = false;
		// 				$result['message'] = 'Upload failed';
		// 				$this->response($result, 400);
		// 			}
		// 		}
		// 	}
		// }
	}
}
?>
