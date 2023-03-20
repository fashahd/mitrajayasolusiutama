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
class Employee extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("memployee");
    }

	function list_get(){
		$pSearch["keySearch"] = $this->get("keySearch");
		
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
        $data = $this->memployee->list_employee($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function contract_list_get(){
		$people_id = $this->get("people_id");
		
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
        $data = $this->memployee->list_contract($people_id, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function education_list_get(){
		$people_id = $this->get("people_id");
		
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
        $data = $this->memployee->list_education($people_id, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function family_list_get(){
		$people_id = $this->get("people_id");
		
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
        $data = $this->memployee->list_family($people_id, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_contract_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Admin_Employee_WinFormContract-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }


		if ($varPost['OpsiDisplay'] == 'insert') {
            $proses = $this->memployee->insertContract($paramPost);
        } else {
            $proses = $this->memployee->updateContract($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function submit_payroll_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Admin_Employee_PanelPayroll-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }

		$people_id = $paramPost["people_id"];
		$paramPost["basic_salary"] = str_replace(",", "",$paramPost["basic_salary"]);

		unset($paramPost["people_id"]);

		$this->db->where("people_id", $people_id);
		$this->db->update("mj_people", $paramPost);

		
		$response["success"] = true;
		$response["people_id"] = $people_id;

		if ($response['success'] == true) {
            $this->response($response, 200);
        } else {
            $this->response($response, 400);
        }
	}

	function submit_family_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Admin_Employee_WinFormFamily-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }


		if ($varPost['OpsiDisplay'] == 'insert') {
            $proses = $this->memployee->insertFamily($paramPost);
        } else {
            $proses = $this->memployee->updateFamily($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function submit_education_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Admin_Employee_WinFormEducation-Form-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }


		if ($varPost['OpsiDisplay'] == 'insert') {
            $proses = $this->memployee->insertEducation($paramPost);
        } else {
            $proses = $this->memployee->updateEducation($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function submit_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Admin_Employee_MainForm-FormBasicData-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }


		if ($varPost['OpsiDisplay'] == 'insert') {
            $proses = $this->memployee->insertCustomer($paramPost);
        } else {
            $proses = $this->memployee->updateCustomer($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_contract_get(){
		$contract_id = $this->get("contract_id");

        $data = $this->memployee->form_contract($contract_id);

        $this->response($data, 200);
	}

	function form_payroll_get(){
		$people_id = $this->get("people_id");

        $data = $this->memployee->form_payroll($people_id);

        $this->response($data, 200);
	}

	function form_family_get(){
		$family_id = $this->get("family_id");

        $data = $this->memployee->form_family($family_id);

        $this->response($data, 200);
	}

	function form_education_get(){
		$education_id = $this->get("education_id");

        $data = $this->memployee->form_education($education_id);

        $this->response($data, 200);
	}

	function form_employee_get(){
		$people_id = $this->get("people_id");

        $data = $this->memployee->form_employee($people_id);

        $this->response($data, 200);
	}

    function delete_employee_delete(){
		$people_id = $this->delete("people_id");

		$data["status"] = "nullified";

		$this->db->where("people_id", $people_id);
		$query = $this->db->update("mj_people", $data);

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

    function delete_family_delete(){
		$family_id = $this->delete("family_id");

		$data["status"] = "nullified";

		$this->db->where("family_id", $family_id);
		$query = $this->db->update("mj_family", $data);

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

    function delete_education_delete(){
		$education_id = $this->delete("education_id");

		$data["status"] = "nullified";

		$this->db->where("education_id", $education_id);
		$query = $this->db->update("mj_education", $data);

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

    function delete_contract_delete(){
		$contract_id = $this->delete("contract_id");

		$data["status"] = "nullified";

		$this->db->where("contract_id", $contract_id);
		$query = $this->db->update("mj_contract", $data);

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

	function photo_upload_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
			if($_POST["OpsiDisplay"] == "insert"){
				if ($_FILES['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput']['name'];
					$fileupload['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput'];
	
					$upload = move_upload($fileupload, 'files/tmp/' . $gambar);
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['file'] = 'files/tmp/' . $gambar;
						$result['fileurl'] = base_url().'files/tmp/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}else{
				if ($_FILES['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput']['name'] != '') {
					$people_id = $_POST["people_id"];
					$gambar = date('Ymdhis') . '_' . $people_id.".".$ExtNya;
					$fileupload['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Admin_Employee_MainForm-FormBasicData-PhotoInput'];
	
					//cek folder propinsi itu sudah ada belum
					if (!file_exists('files/employee')) {
						mkdir('files/employee', 0777, true);
					}

					$upload = move_upload($fileupload, 'files/employee/' . $gambar);
					if (isset($upload['upload_data'])) {
						
						$datapost["photo"] = 'files/employee/' . $gambar;
						$this->db->where("people_id", $people_id);
						$this->db->update("mj_people", $datapost);

						$result['success'] = true;
						$result['file'] = 'files/employee/' . $gambar;
						$result['fileurl'] = base_url().'files/employee/' . $gambar;
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

	function document_contract_upload_post(){

		$mime_type = mime_content_type($_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document']['tmp_name']);
		$ExtNya = GetFileExt($_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document']['name']);
		
		if (!in_array($mime_type, array('application/pdf'))) {
			$result['success'] = false;
			$result['message'] = 'File types not allowed / Corrupt';
			$this->response($result, 400);
		}else{
			if($_POST["OpsiDisplay"] == "insert"){
				if ($_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document']['name'];
					$fileupload['MitraJaya_view_Admin_Employee_WinFormContract-Form-document'] = $_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document'];
	
					$upload = move_upload($fileupload, 'files/tmp/' . $gambar);
					if (isset($upload['upload_data'])) {
						$result['success'] = true;
						$result['FilePath'] = 'files/tmp/' . $gambar;
						$result['file'] = base_url().'files/tmp/' . $gambar;
						$this->response($result, 200);
					} else {
						$result['success'] = false;
						$result['message'] = 'Upload failed';
						$this->response($result, 400);
					}
				}
			}else{
				if ($_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document']['name'] != '') {
					$gambar = date('Ymdhis') . '_' . $_POST['contract_id'].".pdf";
					$fileupload['MitraJaya_view_Admin_Employee_WinFormContract-Form-document'] = $_FILES['MitraJaya_view_Admin_Employee_WinFormContract-Form-document'];
	
					//cek folder propinsi itu sudah ada belum
					if (!file_exists('files/employee/contract')) {
						mkdir('files/employee/contract', 0777, true);
					}

					$upload = move_upload($fileupload, 'files/employee/contract/' . $gambar);
					if (isset($upload['upload_data'])) {
						$contract_id = $_POST["contract_id"];
						
						$datapost["document"] = 'files/employee/contract/' . $gambar;
						$this->db->where("contract_id", $contract_id);
						$this->db->update("mj_contract", $datapost);

						//cek folder propinsi itu sudah ada belum
						if (file_exists($_POST['MitraJaya_view_Admin_Employee_WinFormContract-Form-document_old'])) {
							unlink($_POST['MitraJaya_view_Admin_Employee_WinFormContract-Form-document_old']);
						}

						$result['success'] = true;
						$result['FilePath'] = 'files/employee/contract/' . $gambar;
						$result['file'] = base_url().'files/employee/contract/' . $gambar;
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
}
?>
