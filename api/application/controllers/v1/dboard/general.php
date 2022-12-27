<?php

defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . '/libraries/REST_Controller.php';

use Restserver\Libraries\REST_Controller;

Class General extends REST_Controller{
	
	function __construct()
    {
        // Construct the parent class
        parent::__construct();
		
		$this->load->model("Mdboard");
    }

	function display_chart_get(){
		$paramPost["year"] 		= $_GET["fyear"];
		$paramPost["quartal"]	= $_GET["quartal"];
		$data = $this->Mdboard->display_chart($paramPost);

		$this->response($data, 200);
	}
}

?>
