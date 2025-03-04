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
class Product extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		$this->load->model("mproduct");
    }

	function list_get(){
		$pSearch["keySearch"] = $this->get("keySearch");
		$pSearch["ProductBrand"] = $this->get("ProductBrand");
		
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
        $data = $this->mproduct->list_product($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function part_list_get(){
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

        $data = $this->mproduct->list_part($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_part_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Warehouse_Product_WinFormPart-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }

        $checkingDocNo = $this->mproduct->CheckPartCode($paramPost["PartCategoryCode"],$paramPost["StartRangePartCode"],$paramPost["EndRangePartCode"],$paramPost["PartCategoryID"]);
    
        if($checkingDocNo["exist"] == 1){
            $return["success"] = "false";
            $return["message"] = $checkingDocNo["message"];
            $this->response($return, 400);
            return;
        }
        
		if ($varPost['OpsiDisplay'] == 'insert') {

            $proses = $this->mproduct->insert_part($paramPost);
        } else {
            $proses = $this->mproduct->update_part($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_product_get(){
		$ProductID = $this->get("ProductID");

        $data = $this->mproduct->form_product($ProductID);

        $this->response($data, 200);
	}

	function form_part_get(){
		$PartCategoryID = $this->get("PartCategoryID");

        $data = $this->mproduct->form_part($PartCategoryID);

        $this->response($data, 200);
	}

	function submit_post(){
		if ($_POST['OpsiDisplay'] == 'insert') {
			$ProductID = getUUID();
			$productCode = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductCode"];
			$productName = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductName"];
			$productBrand = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductBrand"];
			$fiePath = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoOld"];
			$fiePath2 = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoOld2"];
			
			$data["ProductID"] = $ProductID;
			$data["ProductCode"] = $productCode;
			$data["ProductName"] = $productName;
			$data["ProductBrand"] = $productBrand;
			$data["FilePath"] = $fiePath;
			$data["FilePath2"] = $fiePath2;
			$data["CreatedDate"] = date("Y-m-d H:i:s");
			$data["CreatedBy"] = $_SESSION["user_id"];
			$insert = $this->db->insert("mj_product", $data);
	
			$data["success"] = true;
			$data["message"] = "Data Saved";
			$data["ProductID"] = $ProductID;
			$this->response($data, 200);
		} else {
			$ProductID = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductID"];
			$productCode = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductCode"];
			$productName = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductName"];
			$productBrand = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-ProductBrand"];
			$fiePath = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoOld"];
			$fiePath2 = $_POST["MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoOld2"];
			
			$data["ProductCode"] = $productCode;
			$data["ProductName"] = $productName;
			$data["ProductBrand"] = $productBrand;
			$data["FilePath"] = $fiePath;
			$data["FilePath2"] = $fiePath2;
			$data["UpdatedDate"] = date("Y-m-d H:i:s");
			$data["UpdatedBy"] = $_SESSION["user_id"];

			$this->db->where("ProductID", $ProductID);
			$this->db->update("mj_product", $data);
	
			$data["success"] = true;
			$data["message"] = "Data Saved";
			$data["ProductID"] = $ProductID;
			$this->response($data, 200);
		}

		
	}

	function upload_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
			if ($_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput']['name'] != '') {
				$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput']['name'];
				$fileupload['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput'];

				$upload = move_upload($fileupload, 'files/product/' . $gambar);
				if (isset($upload['upload_data'])) {
					$result['success'] = true;
					$result['file'] = $upload['upload_data']['file_name'];
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
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput2']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
			if ($_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput2']['name'] != '') {
				$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput2']['name'];
				$fileupload['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput2'] = $_FILES['MitraJaya_view_Warehouse_Product_MainForm-FormBasicData-PhotoInput2'];

				$upload = move_upload($fileupload, 'files/product/' . $gambar);
				if (isset($upload['upload_data'])) {
					$result['success'] = true;
					$result['file'] = $upload['upload_data']['file_name'];
					$this->response($result, 200);
				} else {
					$result['success'] = false;
					$result['message'] = 'Upload failed';
					$this->response($result, 400);
				}
			}
        }
	}

	function delete_product_delete(){
		$ProductID = $this->delete("ProductID");

		$data["StatusCode"] = "nullified";

		$this->db->where("ProductID", $ProductID);
		$query = $this->db->update("mj_product", $data);

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

	function delete_part_delete(){
		$PartCategoryID = $this->delete("PartCategoryID");

		$data["StatusCode"] = "nullified";

		$this->db->where("PartCategoryID", $PartCategoryID);
		$query = $this->db->update("mj_part_category", $data);

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
}
?>
