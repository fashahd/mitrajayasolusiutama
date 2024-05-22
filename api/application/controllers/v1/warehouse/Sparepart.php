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
class Sparepart extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		$this->load->model("msparepart");
    }

	function list_get(){
		$pSearch["keySearch"] = $this->get("keySearch");
		$pSearch["keySearch2"] = $this->get("keySearch2");
		$pSearch["ProductID"] = $this->get("ProductID");
		
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

        $data = $this->msparepart->list_sparepart($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function form_sparepart_get(){
		$SparepartID = $this->get("SparepartID");

        $data = $this->msparepart->form_sparepart($SparepartID);

        $this->response($data, 200);
	}

	function submit_post(){
		$varPost = $this->post();
		
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}
		
		$submit = $this->msparepart->submit_sparepart($paramPost);
		
		$this->response($submit, 200);
	}

	function upload_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = 'File types not allowed';
            $this->response($result, 400);
        } else {
			if($_POST["OpsiDisplay"] == "insert"){
				if ($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput']['name'];
					$fileupload['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput'];
	
					$upload = move_upload($fileupload, 'files/tmp/' . $gambar);
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['file'] = 'files/tmp/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}else{
				if ($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput']['name'];
					$fileupload['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput'];
	
					$upload = move_upload($fileupload, 'files/sparepart/' . $gambar);
					if (isset($upload['upload_data'])) {
						$SparepartID = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartID"];
						
						$datapost["FilePath"] = 'files/sparepart/' . $gambar;
						$this->db->where("SparepartID", $SparepartID);
						$this->db->update("mj_sparepart", $datapost);

						$result['success'] = true;
						$result['file'] = 'files/sparepart/' . $gambar;
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

    function upload2_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = 'File types not allowed';
            $this->response($result, 400);
        } else {
			if($_POST["OpsiDisplay"] == "insert"){
				if ($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2']['name'];
					$fileupload['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2'] = $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2'];

					$upload = move_upload($fileupload, 'files/tmp/' . $gambar);
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['file'] = 'files/tmp/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}else{
				if ($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2']['name'];
					$fileupload['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2'] = $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2'];

					$upload = move_upload($fileupload, 'files/sparepart/' . $gambar);
					if (isset($upload['upload_data'])) {
						$SparepartID = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartID"];
						
						$datapost["FilePath2"] = 'files/sparepart/' . $gambar;
						$this->db->where("SparepartID", $SparepartID);
						$this->db->update("mj_sparepart", $datapost);

						$result['success'] = true;
						$result['file'] = 'files/sparepart/' . $gambar;
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

    function upload3_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = 'File types not allowed';
            $this->response($result, 400);
        } else {
			if($_POST["OpsiDisplay"] == "insert"){
				if ($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3']['name'];
					$fileupload['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3'] = $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3'];

					$upload = move_upload($fileupload, 'files/tmp/' . $gambar);
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['file'] = 'files/tmp/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}else{
				if ($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3']['name'];
					$fileupload['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3'] = $_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3'];

					$upload = move_upload($fileupload, 'files/sparepart/' . $gambar);
					if (isset($upload['upload_data'])) {
						
						$SparepartID = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartID"];
						
						$datapost["FilePath3"] = 'files/sparepart/' . $gambar;
						$this->db->where("SparepartID", $SparepartID);
						$this->db->update("mj_sparepart", $datapost);

						$result['success'] = true;
						$result['file'] = 'files/sparepart/' . $gambar;
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

	function delete_sparepart_delete(){
		$SparepartID = $this->delete("SparepartID");

		$data["StatusCode"] 			= "nullified";
		$data["SparepartNumberCode"]	= $this->delete("SparepartCode")." - nullified";

		$this->db->where("SparepartID", $SparepartID);
		$query = $this->db->update("mj_sparepart", $data);

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

	function submit_sparepart_post(){
		$varPost = $this->post();
		
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}
		
		$submit = $this->msparepart->submit_sparepart($paramPost);
		
		$this->response($submit, 200);
	}
}
?>
