<?php
/**
 * @Author: Nikolius Lau
 * @Date:   2018-07-24 15:47:22
 * @Last Modified by:   Nikolius Lau
 * @Last Modified time: 2018-07-24 15:47:31
 */
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;
use Restserver\Libraries\REST_Controller;

class Printout extends REST_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->file = $_FILES;
	}

	public function print_invoice_get(){
		$InvoiceID 	= $_GET["InvoiceID"];
		$pph 		= $_GET["pph"];

        // Header
        $dataHeader['titleNya'] = "Print Invoice";
        $this->load->view('printout/print_header', $dataHeader);

		
        // Body
        $this->cetak_invoice($InvoiceID, $pph);
	}

	public function cetak_invoice($InvoiceID, $pph="no"){
		$this->load->model("Minvoice");
		$invoice			= $this->Minvoice->form_invoice($InvoiceID);

		$paramPost = array();
		if(is_array($invoice['data'])){
			foreach ($invoice['data'] as $key => $value) {
				$keyNew = str_replace("MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-", '', $key);
				if ($value == "") {
					$value = null;
				}
				$paramPost[$keyNew] = $value;
			}
		}
		$paramPost["pph"] = $pph;

		$data["invoicedata"] = $paramPost;
		
		$data["invoice_history"]	= $this->Minvoice->form_invoice_historical($InvoiceID, $paramPost["ContractNumber"]);

		// echo "<pre>";print_r($data);die;

        $this->load->view('printout/invoice_body', $data);
	}

	public function print_neraca_get(){
		$this->load->model("mneraca");

		$Month 	= $_GET["Month"];
		$Year 	= $_GET["Year"];

        // Header
        $dataHeader['titleNya'] = "Print Neraca";
        $this->load->view('printout/print_header', $dataHeader);

		
        // Body
        $this->cetak_neraca($Month, $Year);
	}

	public function cetak_neraca($Month, $Year){
		$data   = $this->mneraca->getDataForm($Month, $Year);

		$datanew = array();
		if(count($data["data"]) > 0){
			foreach($data["data"] as $key => $val){
				$keyNew = str_replace("MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-", '', $key);
				if ($val == "") {
					$val = null;
				}
				$datanew[$keyNew] = $val;
			}
		}

		$dataset["data"] = $datanew;

		// echo "<pre>";print_r($dataset);die;

        $this->load->view('printout/neraca_body', $dataset);
	}

	public function print_laba_rugi_get(){
		$this->load->model("mneraca");

		$Month 	= $_GET["Month"];
		$Year 	= $_GET["Year"];

        // Header
        $dataHeader['titleNya'] = "Print Laba Rugi";
        $this->load->view('printout/print_header', $dataHeader);

		
        // Body
        $this->cetak_laba_rugi($Month, $Year);
	}

	public function cetak_laba_rugi($Month, $Year){
        $data   = $this->mneraca->getDataLabaRugiForm($Month, $Year);

		$datanew = array();
		if(count($data["data"]) > 0){
			foreach($data["data"] as $key => $val){
				$keyNew = str_replace("MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-", '', $key);
				if ($val == "") {
					$val = null;
				}
				$datanew[$keyNew] = $val;
			}
		}

		$dataset["data"] = $datanew;

		// echo "<pre>";print_r($dataset);

        $this->load->view('printout/laba_rugi_body', $dataset);
	}
}
 