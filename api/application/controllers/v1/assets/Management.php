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
class Management extends REST_Controller
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();

		$this->load->model("massets");
	}

	public function list_get()
	{
		$pSearch["keySearch"] = $_GET["keySearch"];
		$pSearch["CategoryID"] = $_GET["CategoryID"];
		$pSearch["Year"] = $_GET["Year"];
		$pSearch["BrandID"] = $_GET["BrandID"];

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
		$data = $this->massets->list_assets($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);

		$this->response($data, 200);
	}

	function submit_post()
	{
		$varPost = $_POST;
		$paramPost = array();
		$this->db->trans_begin();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Assets_Management_MainForm-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}		

		if($paramPost["File1_old"] != ''){
			//cek folder propinsi itu sudah ada belum
			if (!file_exists('files/assets')) {
				mkdir('files/assets', 0777, true);
			}

			$file_tmp = pathinfo($paramPost["File1_old"]);
			$gambar = date('Ymdhis') . '_' .str_replace("files/tmp/", "", $paramPost["File1_old"]).".".$file_tmp["extension"];
			rename($paramPost["File1_old"], 'files/assets/' . $gambar);
			$paramPost['File1'] = 'files/assets/' . $gambar;
		}		

		if($paramPost["File2_old"] != ''){
			//cek folder propinsi itu sudah ada belum
			if (!file_exists('files/assets')) {
				mkdir('files/assets', 0777, true);
			}

			$file_tmp = pathinfo($paramPost["File2_old"]);
			$gambar = date('Ymdhis') . '_' .str_replace("files/tmp/", "", $paramPost["File2_old"]).".".$file_tmp["extension"];
			rename($paramPost["File2_old"], 'files/assets/' . $gambar);
			$paramPost['File2'] = 'files/assets/' . $gambar;
		}		

		if($paramPost["File3_old"] != ''){
			//cek folder propinsi itu sudah ada belum
			if (!file_exists('files/assets')) {
				mkdir('files/assets', 0777, true);
			}

			$file_tmp = pathinfo($paramPost["File3_old"]);
			$gambar = date('Ymdhis') . '_' .str_replace("files/tmp/", "", $paramPost["File3_old"]).".".$file_tmp["extension"];
			rename($paramPost["File3_old"], 'files/assets/' . $gambar);
			$paramPost['File3'] = 'files/assets/' . $gambar;
		}		

		if($paramPost["File4_old"] != ''){
			//cek folder propinsi itu sudah ada belum
			if (!file_exists('files/assets')) {
				mkdir('files/assets', 0777, true);
			}

			$file_tmp = pathinfo($paramPost["File4_old"]);
			$gambar = date('Ymdhis') . '_' .str_replace("files/tmp/", "", $paramPost["File4_old"]).".".$file_tmp["extension"];
			rename($paramPost["File4_old"], 'files/assets/' . $gambar);
			$paramPost['File4'] = 'files/assets/' . $gambar;
		}

		$AssetID = $paramPost['AssetID'];
		unset($paramPost["OpsiDisplay"]);
		unset($paramPost["AssetID"]);
		unset($paramPost["File1_old"]);
		unset($paramPost["File2_old"]);
		unset($paramPost["File3_old"]);
		unset($paramPost["File4_old"]);

		$paramPost["HPP"] = ($paramPost["HPP"] != '') ? str_replace(",", "", $paramPost["HPP"]) : '0';

		$dataCat = $this->massets->getCategoryID($paramPost["CategoryID"]);
		$paramPost["CategoryID"] = $dataCat["CategoryID"];
		$paramPost["AssetCode"] = ($paramPost["AssetCode"] != '') ? $paramPost["AssetCode"] : $this->massets->generateAssetCode($dataCat["CategoryCode"], $paramPost["Year"]);
		$paramPost["StatusCode"] = "active";
		$paramPost["CreatedDate"] = date("Y-m-d H:i:s");
		$paramPost["CreatedBy"] = $_SESSION["user_id"];
		$paramPost["BrandID"] = $this->massets->getBrandID($paramPost["BrandID"]);

		if ($AssetID != '') {
			$this->db->where("AssetID", $AssetID);
			$this->db->update("mj_assets", $paramPost);
		} else {
			$AssetID = getUUID();
			$paramPost["AssetID"] = $AssetID;
			$this->db->insert("mj_assets", $paramPost);
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
			$results['AssetID'] = $AssetID;
			$this->response($results, 200);
		}
	}

	function form_asset_get()
	{
		$AssetID 	= $this->get("AssetID");

		$data = $this->massets->form_asset($AssetID);

		$this->response($data, 200);
	}

	function delete_asset_delete()
	{
		$AssetID = $this->delete("AssetID");

		$data["StatusCode"] = "nullified";

		$this->db->where("AssetID", $AssetID);
		$query = $this->db->update("mj_assets", $data);

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

	function file_upload_post()
	{
		$FileSource = $_POST["FileSource"];
		//Cek file images
		$ExtNya = GetFileExt($_FILES["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"]['name']);

		if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
			$result['success'] = false;
			$result['message'] = 'File types not allowed';
			$this->response($result, 400);
		} else {
			if ($_POST["OpsiDisplay"] == "insert") {
				if ($_FILES["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"]['name'] != '') {
					$gambar = date('Ymdhis') . '_' . str_replace(" ", "_", $_FILES["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"]['name']);
					$fileupload["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"] = $_FILES["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"];

					$upload = move_upload($fileupload, 'files/tmp/' . $gambar);
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['FilePath'] = 'files/tmp/' . $gambar;
						$result['file'] = base_url() . 'files/tmp/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			} else {
				if ($_FILES["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"]['name'] != '') {
					$AssetID = $_POST["AssetID"];
					$File_old = $_POST["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource" . "_old"];

					$gambar = date('Ymdhis') . '_' . $AssetID . "." . $ExtNya;
					$fileupload["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"] = $_FILES["MitraJaya_view_Assets_Management_MainForm-FormBasicData-$FileSource"];

					//cek folder propinsi itu sudah ada belum
					if (!file_exists('files/assets')) {
						mkdir('files/assets', 0777, true);
					}

					$upload = move_upload($fileupload, 'files/assets/' . $gambar);
					if (isset($upload['upload_data'])) {


						//cek folder propinsi itu sudah ada belum
						if (file_exists($File_old)) {
							unlink($File_old);
						}

						$datapost["$FileSource"] = 'files/assets/' . $gambar;
						$this->db->where("AssetID", $AssetID);
						$this->db->update("mj_assets", $datapost);

						$result['success'] = true;
						$result['FilePath'] = 'files/assets/' . $gambar;
						$result['file'] = base_url() . 'files/assets/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}
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
