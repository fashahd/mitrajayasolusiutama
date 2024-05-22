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
class Claim extends REST_Controller
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();

		$this->load->model("mclaim");
	}

	function list_get()
	{
		$pSearch["ProjectID"] = $this->get("ProjectID");
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
		$data = $this->mclaim->list_claim($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function upload_post()
	{
		// echo "<pre>";print_r($_POST);die;
		//Cek file images
		if (!file_exists('files/finance/claim')) {
			mkdir('files/finance/claim', 0777, true);
		}

		$ExtNya = GetFileExt($_FILES['MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoInput2']['name']);
		if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
			$result['success'] = false;
			$result['message'] = 'File types not allowed';
			$this->response($result, 400);
		} else {
			if ($_FILES['MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoInput2']['name'] != '') {
				$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoInput2']['name'];
				$fileupload['MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoInput2'] = $_FILES['MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoInput2'];

				if ($_POST["OpsiDisplay"] == "insert") {
					if (file_exists($_POST["MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoOld2"])) {
						unlink($_POST["MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-PhotoOld2"]);
					}
				}

				$upload = move_upload($fileupload, 'files/finance/claim/' . $gambar);
				if (isset($upload['upload_data'])) {
					$result['success'] = true;
					$result['file'] = "files/finance/claim/" . $upload['upload_data']['file_name'];
					$this->response($result, 200);
				} else {
					$result['success'] = false;
					$result['message'] = 'Upload failed';
					$this->response($result, 400);
				}
			}
		}
	}

	function claim_detail_list_get()
	{
		$pSearch["ClaimID"] = $this->get("ClaimID");

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
		$data = $this->mclaim->list_claim_detail($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
		$this->response($data, 200);
	}

	function submit_claim_post()
	{

		$varPost = $_POST;
		$paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Finance_Claim_MainForm-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		$cekExistCN = $this->mclaim->CekEksisClaim("DocNumber", $paramPost["DocNumber"], $paramPost["ClaimID"]);

		if ($cekExistCN["exist"] == 1) {
			$return["success"] = "false";
			$return["message"] = "Document Number Already Registered";
			$this->response($return, 400);
			return;
		}

		if ($varPost['OpsiDisplay'] == 'insert') {

			$proses = $this->mclaim->insert_claim($paramPost);
		} else {

			$proses = $this->mclaim->update_claim($paramPost);
		}

		if ($proses['success'] == true) {
			$this->response($proses, 200);
		} else {
			$this->response($proses, 400);
		}
	}

	function submit_claim_detail_post()
	{
		$varPost = $_POST;
		$paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Finance_Claim_WinFormClaimDetail-Form-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		$paramPost["Amount"] = str_replace(",", "", $paramPost["Amount"]);
		$paramPost["Photo"] = $paramPost["PhotoOld2"];

		if ($varPost['OpsiDisplay'] == 'insert') {

			$proses = $this->mclaim->insert_claim_detail($paramPost);
		} else {

			$proses = $this->mclaim->update_claim_detail($paramPost);
		}

		if ($proses['success'] == true) {
			$this->response($proses, 200);
		} else {
			$this->response($proses, 400);
		}
	}

	function form_claim_get()
	{
		$ClaimID = $this->get("ClaimID");

		$data = $this->mclaim->form_claim($ClaimID);

		$this->response($data, 200);
	}

	function form_claim_detail_get()
	{
		$ClaimDetailID = $this->get("ClaimDetailID");

		$data = $this->mclaim->form_claim_detail($ClaimDetailID);

		$this->response($data, 200);
	}

	function delete_claim_delete()
	{
		$ClaimID = $this->delete("ClaimID");

		$data["StatusCode"] = "nullified";

		$this->db->where("ClaimID", $ClaimID);
		$query = $this->db->update("mj_claim", $data);

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

	function delete_claim_detail_delete()
	{
		$ClaimDetailID = $this->delete("ClaimDetailID");

		$data["StatusCode"] = "nullified";

		$this->db->where("ClaimDetailID", $ClaimDetailID);
		$query = $this->db->update("mj_claim_detail", $data);

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
}
