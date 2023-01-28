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
class Toolkit extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		$this->load->model("mtoolkit");
    }

	function list_get(){
		$pSearch["ToolkitCode"] = $this->get("ToolkitCode");
		$pSearch["ToolkitName"] = $this->get("ToolkitName");
		
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

        $data = $this->mtoolkit->list_toolkit($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function form_toolkit_get(){
		$ToolkitID = $this->get("ToolkitID");

        $data = $this->mtoolkit->form_toolkit($ToolkitID);

        $this->response($data, 200);
	}

	function submit_toolkit_post(){
		$varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Warehouse_Toolkit_MainForm-FormBasicData-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }
        
		if ($varPost['OpsiDisplay'] == 'insert') {

            $proses = $this->mtoolkit->insert_toolkit($paramPost);
        } else {
            $proses = $this->mtoolkit->update_toolkit($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function delete_toolkit_delete(){
		$ToolkitID = $this->delete("ToolkitID");

		$data["StatusCode"] = "nullified";

		$this->db->where("ToolkitID", $ToolkitID);
		$query = $this->db->update("mj_toolkit", $data);

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
