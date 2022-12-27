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
class Pengeluaranbarang extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		$this->load->model("mpengeluaranbarang");
    }

	function list_get(){
		$pSearch["TanggalBarangKeluar"] = $this->get("TanggalBarangKeluar");
		$pSearch["DocumentNo"] = $this->get("DocumentNo");
		
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

        $data = $this->mpengeluaranbarang->list_pengeluaran_barang($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function submit_pengeluaran_barang_post(){
		
        $varPost = $_POST;
        $paramPost = array();

        foreach ($varPost as $key => $value) {
            $keyNew = str_replace("MitraJaya_view_Warehouse_PengeluaranBarang_MainForm-FormBasicData-", '', $key);
            if ($value == "") {
                $value = null;
            }
            $paramPost[$keyNew] = $value;
        }

		$checkDocNo = $this->mpengeluaranbarang->checkDocNo("DocNo",$paramPost["DocNo"],$paramPost["PengeluaranBarangID"]);
    
        if($checkDocNo["exist"] == 1){
            $return["success"] = "false";
            $return["message"] = "Document Number Already Exist";
            $this->response($return, 400);
            return;
        }
        
		if ($varPost['OpsiDisplay'] == 'insert') {

            $proses = $this->mpengeluaranbarang->insert_pengeluaran_barang($paramPost);
        } else {
            $proses = $this->mpengeluaranbarang->update_pengeluaran_barang($paramPost);
        }

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}

	function form_pengeluaran_barang_get(){
		$PengeluaranBarangID = $this->get("PengeluaranBarangID");

        $data = $this->mpengeluaranbarang->form_pengeluaran_barang($PengeluaranBarangID);

        $this->response($data, 200);
	}

	function delete_pengeluaran_barang_delete(){
		$PengeluaranBarangID = $this->delete("PengeluaranBarangID");

		$data["StatusCode"] = "nullified";

		$this->db->where("PengeluaranBarangID", $PengeluaranBarangID);
		$query = $this->db->update("mj_pengeluaran_barang", $data);

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
