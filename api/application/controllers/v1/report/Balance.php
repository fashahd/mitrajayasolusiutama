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
class Balance extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
    }

	function data_get(){
		$sql 	= "SELECT FilePath FROM mj_balance WHERE StatusCode = 'active'";
		$query = $this->db->query($sql)->row_array();

		$data["success"] = true;
		$data["data"] = $query;
        $this->response($data, 200);
	}

	function submit_post(){
		$post = $_POST["MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoOld"];
		
		$data["FilePath"] = $post;
		$data["CreatedDate"] = date("Y-m-d H:i:s");
		$data["CreatedBy"] = $_SESSION["user_id"];
		$this->db->where("BalanceID", "1");
		$this->db->update("mj_balance", $data);

		$data["success"] = true;
		$data["message"] = "Data Saved";
        $this->response($data, 200);
	}

	function upload_post(){
		//Cek file images
        $ExtNya = GetFileExt($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput']['name']);
        if (!in_array($ExtNya, array('png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'))) {
            $result['success'] = false;
            $result['message'] = lang('File types not allowed');
            $this->response($result, 400);
        } else {
			if ($_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput']['name'] != '') {
				$gambar = date('Ymdhis') . '_' . $_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput']['name'];
				$fileupload['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput'] = $_FILES['MitraJaya_view_Report_Balance_MainForm-FormBasicData-PhotoInput'];

				$upload = move_upload($fileupload, 'files/balance/' . $gambar);
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
}
?>
