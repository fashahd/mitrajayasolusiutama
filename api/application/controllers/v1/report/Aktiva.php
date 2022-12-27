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
class Aktiva extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("maktiva");
    }

    function data_get(){
        $pSearch["month"]  = $_GET["month"];
        $pSearch["year"]   = $_GET["year"];

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
        $data = $this->maktiva->getDataList($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);

        $this->response($data, 200);
    }

    function form_aktiva_get(){
        $AktivaID = $_GET["AktivaID"];

        $data = $this->maktiva->getDataByID($AktivaID);

        $this->response($data, 200);
    }

	function submit_post(){
		
        $varPost = $_POST;
        $paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Report_Aktiva_WinFormAktiva-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
            if($keyNew != "Month" || $keyNew != "Year" || $keyNew != "Description"){
                $value = str_replace(",","",$value);
            }
			$paramPost[$keyNew] = $value;
		}
        
        $proses = $this->maktiva->submit($paramPost);

		if ($proses['success'] == true) {
            $this->response($proses, 200);
        } else {
            $this->response($proses, 400);
        }
	}
}
?>
