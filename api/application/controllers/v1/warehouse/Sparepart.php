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
		if ($_POST['OpsiDisplay'] == 'insert') {
			$SparepartID = getUUID();
			$ProductID = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-ProductID"];
			$SparepartCode = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartCode"];
			$SparepartNumberCode = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartNumberCode"];
			$SparepartName = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartName"];
			$SparepartNo = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartNo"];
			$SparepartType = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartType"];
			$SparepartCategory = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartCategory"];
			$SparepartQty = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartQty"];
			$SparepartBasicPrice = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartBasicPrice"];
			$SparepartSellingPrice = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartSellingPrice"];
			$SparepartStatus = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartStatus"];
			$SparepartRemark = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartRemark"];
			$fiePath = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoOld"];
			$fiePath2 = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoOld2"];
			$filePath3 = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoOld3"];

			if($fiePath != "") {
				$newpath = "files/sparepart/".time()."_photo_1.".$ext;
				rename($fiePath, $newpath);
				$fiePath = $newpath;
			}
	
			if($fiePath2 != "") {
				$newpath = "files/sparepart/".time()."_photo_2.".$ext;
				rename($fiePath2, $newpath);
				$fiePath2 = $newpath;
			}
	
			if($filePath3 != "") {
				$newpath = "files/sparepart/".time()."_photo_3.".$ext;
				rename($filePath3, $newpath);
				$filePath3 = $newpath;
			}
			
			$data["ProductID"] = $ProductID;
			$data["SparepartID"] = $SparepartID;
			$data["SparepartCode"] = $SparepartCode;
			$data["SparepartNumberCode"] = $SparepartNumberCode;
			$data["SparepartName"] = $SparepartName;
			$data["SparepartNo"] = $SparepartNo;
			$data["SparepartType"] = $SparepartType;
			$data["SparepartCategory"] = $SparepartCategory;
			$data["SparepartQty"] = $SparepartQty;
			$data["SparepartBasicPrice"] = str_replace(",","",$SparepartBasicPrice);
			$data["SparepartSellingPrice"] = str_replace(",","",$SparepartSellingPrice);
			$data["SparepartStatus"] = $SparepartStatus;
			$data["SparepartRemark"] = $SparepartRemark;
			$data["FilePath"] = $fiePath;
			$data["FilePath2"] = $fiePath2;
			$data["FilePath3"] = $filePath3;
			$data["CreatedDate"] = date("Y-m-d H:i:s");
			$data["CreatedBy"] = $_SESSION["user_id"];
			$insert = $this->db->insert("mj_sparepart", $data);
	
			$data["success"] = true;
			$data["message"] = "Data Saved";
			$data["SparepartID"] = $SparepartID;
			$this->response($data, 200);
		} else {
			$SparepartID = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartID"];
			$SparepartCode = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartCode"];
			$SparepartNumberCode = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartNumberCode"];
			$SparepartName = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartName"];
			$SparepartNo = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartNo"];
			$SparepartType = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartType"];
			$SparepartCategory = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartCategory"];
			$SparepartQty = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartQty"];
			$SparepartBasicPrice = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartBasicPrice"];
			$SparepartSellingPrice = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartSellingPrice"];
			$SparepartStatus = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartStatus"];
			$SparepartRemark = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-SparepartRemark"];
			$fiePath = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoOld"];
			$fiePath2 = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoOld2"];
			$filePath3 = $_POST["MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoOld3"];

			if($fiePath != "") {
				$newpath = "files/sparepart/".time()."_photo_1.".$ext;
				rename($fiePath, $newpath);
				$fiePath = $newpath;
			}
	
			if($fiePath2 != "") {
				$newpath = "files/sparepart/".time()."_photo_2.".$ext;
				rename($fiePath2, $newpath);
				$fiePath2 = $newpath;
			}
	
			if($filePath3 != "") {
				$newpath = "files/sparepart/".time()."_photo_3.".$ext;
				rename($filePath3, $newpath);
				$filePath3 = $newpath;
			}
			
			$data["SparepartCode"] = $SparepartCode;
			$data["SparepartNumberCode"] = $SparepartNumberCode;
			$data["SparepartName"] = $SparepartName;
			$data["SparepartNo"] = $SparepartNo;
			$data["SparepartType"] = $SparepartType;
			$data["SparepartCategory"] = $SparepartCategory;
			$data["SparepartQty"] = $SparepartQty;
			$data["SparepartBasicPrice"] = str_replace(",","",$SparepartBasicPrice);
			$data["SparepartSellingPrice"] = str_replace(",","",$SparepartSellingPrice);
			$data["SparepartStatus"] = $SparepartStatus;
			$data["SparepartRemark"] = $SparepartRemark;
			$data["FilePath"] = $fiePath;
			$data["FilePath2"] = $fiePath2;
			$data["FilePath3"] = $filePath3;
			$data["UpdatedDate"] = date("Y-m-d H:i:s");
			$data["UpdatedBy"] = $_SESSION["user_id"];

			$this->db->where("SparepartID", $SparepartID);
			$this->db->update("mj_sparepart", $data);
	
			$data["success"] = true;
			$data["message"] = "Data Saved";
			$data["SparepartID"] = $SparepartID;
			$this->response($data, 200);
		}
	}

	function upload_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
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
        }
	}

    function upload2_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput2']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
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
        }
	}

    function upload3_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Sparepart_MainForm-FormBasicData-PhotoInput3']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
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
        }
	}

	function delete_sparepart_delete(){
		$SparepartID = $this->delete("SparepartID");

		$data["StatusCode"] = "nullified";

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
