<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

// use namespace
use Restserver\Libraries\REST_Controller;

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
class Combo extends REST_Controller {
	function __construct()
    {
        // Construct the parent class
        parent::__construct();

		$this->load->model("mcombo");
	}

	function combo_month_get(){

		for ($i_month = 1; $i_month <= 12; $i_month++) { 
			$key = $i_month-1;

			if($i_month < 10){
				$i_month = "0".$i_month;
			}
			
            $arrReturn[$key]['id'] = (string) $i_month;
            $arrReturn[$key]['label'] = date('F', mktime(0,0,0,$i_month));
		}

        $this->response($arrReturn, 200);
	}

	function combo_year_get(){
		$yearRange = (int) $this->get('yearRange');
        if($yearRange == 0) $yearRange = 50;

        $yearNow = date('Y')+2;

		if($this->get("endyear")){
			$yearNow = ($this->get("endyear") == 'now') ? date("Y") : date("Y") + 2;
		}

        $arrReturn = array();
        $incre = 0;

        for ($i=$yearNow; $i >= ($yearNow-$yearRange); $i--) {
            $arrReturn[$incre]['id'] = $i;
            $arrReturn[$incre]['label'] = $i;
            $incre++;
        }

        $this->response($arrReturn, 200);
	}

	function combo_cost_element_get(){
		
		$data = $this->mcombo->GetComponentList();

		
		$this->response($data);
	}

	function combo_department_get(){
		
		$data = $this->mcombo->GetDepartmentList();

		
		$this->response($data);
	}

	function combo_project_get(){
		
		$data = $this->mcombo->GetProjectList();

		
		$this->response($data);
	}

	function combo_project_bank_get(){
		
		$data = $this->mcombo->GetProjectBankList();

		
		$this->response($data);
	}

	function combo_company_get(){
		
		$data = $this->mcombo->GetCompanyList();

		
		$this->response($data);
	}

	function combo_subcont_get(){
		
		$data = $this->mcombo->GetSubContList();

		
		$this->response($data);
	}

	function combo_vendor_get(){
		
		$data = $this->mcombo->GetVendorList();

		
		$this->response($data);
	}

	function combo_brand_get(){
		
		$data = $this->mcombo->GetBrandList();

		
		$this->response($data);
	}

	function combo_product_get(){
		
		$data = $this->mcombo->GetProductList();

		
		$this->response($data);
	}

	function combo_rack_get(){
		
		$data = $this->mcombo->GetRackList();

		
		$this->response($data);
	}

	function combo_part_code_get(){
		
		$data = $this->mcombo->GetPartCodeList();

		
		$this->response($data);
	}

	function combo_toolkit_get(){
		
		$data = $this->mcombo->GetToolkitList();

		
		$this->response($data);
	}

	function combo_employee_get(){
		
		$data = $this->mcombo->GetEmployeeList();

		
		$this->response($data);
	}

	function combo_contract_number_get(){
		$CustomerID = $this->get("CustomerID");
		
		$data = $this->mcombo->GetContractNumber($CustomerID);

		
		$this->response($data);
	}

	function combo_category_expenses_get(){

		$data = $this->mcombo->getCategoryExpenses();

		
		$this->response($data);
	}

	function combo_religion_get(){

		$data = $this->mcombo->getReligion();

		
		$this->response($data);
	}
}
