<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mcombo extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function GetComponentList(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ComponentID id,
			Code label
		');

		$query = $this->db->get('mj_component')->result_array();	

        return $query;
	}

	public function GetDepartmentList(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			DeptID id,
			DeptName label
		');

		$query = $this->db->get('mj_department')->result_array();	

        return $query;
	}

	public function GetProjectBankList(){
		$this->db->where("a.StatusCode", "active");
		$this->db->select('
			a.RefBankID id,
			a.RefBankName label
		');

		$query = $this->db->get('ref_bank_project a')->result_array();	

        return $query;
	}

	public function GetProjectList(){
		$this->db->where("a.StatusCode", "active");
		$this->db->join("mj_order_book b"," b.OrderBookID = a.OrderBookID","left");
		$this->db->select('
			b.OrderBookID id,
			CONCAT(b.ContractNumber, " - ", a.ProjectName) label
		');

		$query = $this->db->get('mj_project a')->result_array();	

        return $query;
	}

	public function GetCompanyList(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			CustomerID id,
			CustomerName label
		');

		$query = $this->db->get('mj_customer')->result_array();	

        return $query;
	}

	public function GetVendorList(){
		$this->db->where("StatusCode", "active");
		$this->db->where("VendorType", "vendor");
		$this->db->select('
			VendorID id,
			VendorName label
		');

		$query = $this->db->get('mj_vendor')->result_array();	

        return $query;
	}

	public function GetSubContList(){
		$this->db->where("StatusCode", "active");
		$this->db->where("VendorType", "subcont");
		$this->db->select('
			VendorID id,
			VendorName label
		');

		$query = $this->db->get('mj_vendor')->result_array();	

        return $query;
	}

	public function GetBrandList(){
		$this->db->select('
			BrandID id,
			BrandName label
		');

		$query = $this->db->get('mj_brand')->result_array();	

        return $query;
	}

	public function GetRackList(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			RackID id,
			RackNumber label
		');

		$query = $this->db->get('mj_master_rack')->result_array();

        return $query;
	}

	public function GetPartCodeList(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			SparepartID id,
			CONCAT(SparepartCode, " - ", SparepartNumberCode, " - ", SparepartName) label
		');

		$query = $this->db->get('mj_sparepart')->result_array();

        return $query;
	}

	public function GetToolkitList(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ToolkitID id,
			CONCAT(ToolkitCode, " - ", ToolkitName) label
		');

		$query = $this->db->get('mj_toolkit')->result_array();

        return $query;
	}

	public function GetEmployeeList(){
		$this->db->where("status", "active");
		$this->db->select('
			people_id id,
			CONCAT(IFNULL(people_ext_id, "EMPTY"), " - ", people_name) label
		');

		$query = $this->db->get('mj_people')->result_array();	

        return $query;
	}

	public function GetContractNumber($CustomerID){
		$this->db->where("CustomerID", $CustomerID);
		$this->db->where("StatusCode", "active");
		$this->db->select('
			OrderBookID id,
			ContractNumber label
		');

		$query = $this->db->get('mj_order_book')->result_array();	

        return $query;
	}

	public function getCategoryExpenses(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			BudgetCategoryID id,
			BudgetCategory label
		');

		$query = $this->db->get('mj_budget_category')->result_array();	

        return $query;
	}

	public function getReligion(){
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ReligionID id,
			ReligionName label
		');

		$query = $this->db->get('mj_religion')->result_array();	

        return $query;
	}
}
