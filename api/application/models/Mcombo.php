<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mcombo extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function getComboRole()
	{
		$sql = "SELECT
                a.`RoleID` AS id
                , a.`RoleName` AS label
            FROM
                mj_role a
            ORDER BY a.`RoleID` ASC";
		$query = $this->db->query($sql);
		$return["data"] = $query->result_array();
		return $return;
	}

	public function getComboPartner()
	{
		$sql = "SELECT
                a.`PartnerID` AS id
                , a.`PartnerName` AS label
            FROM
                mj_partner a
            WHERE
                a.`StatusCode` = 'active'
            ORDER BY a.`PartnerName` ASC";
		$query = $this->db->query($sql);
		$return["data"] = $query->result_array();
		return $return;
	}

	public function GetComponentList()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ComponentID id,
			Code label
		');

		$query = $this->db->get('mj_component')->result_array();

		return $query;
	}

	public function GetDepartmentList()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			DeptID id,
			DeptName label
		');

		$query = $this->db->get('mj_department')->result_array();

		return $query;
	}

	public function GetProjectBankList()
	{
		$this->db->where("a.StatusCode", "active");
		$this->db->select('
			a.RefBankID id,
			a.RefBankName label
		');

		$query = $this->db->get('ref_bank_project a')->result_array();

		return $query;
	}

	public function GetProjectList()
	{
		$this->db->where("a.StatusCode", "active");
		$this->db->join("mj_order_book b", " b.ProjectID = a.ProjectID", "left");
		$this->db->select('
			b.OrderBookID id,
			CONCAT(b.ContractNumber, " - ", a.ProjectName) label
		');

		$query = $this->db->get('mj_project_new a')->result_array();

		return $query;
	}

	public function GetCashbonList($param)
	{
		if ($param["VendorType"] == "SubCont") {
			if ($param["VendorID"] != "") {
				$this->db->where("SubcontName", $param["VendorID"]);
			}
		}

		if ($param["VendorType"] == "Vendor") {
			if ($param["VendorID"] != "") {
				$this->db->where("VendorName", $param["VendorID"]);
			}
		}

		if ($param["ProjectID"] != "") {
			$this->db->where("ProjectID", $param["ProjectID"]);
		}

		$this->db->select('
			a.LoanID id,
			CONCAT(a.DocNumber, " | ", "Rp ", FORMAT(LoanAmount,2)) label
		');

		$query = $this->db->get('mj_loan a')->result_array();

		return $query;
	}

	public function GetCompanyList()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			CustomerID id,
			CustomerName label
		');

		$query = $this->db->get('mj_customer')->result_array();

		return $query;
	}

	public function GetVendorList($VendorName = null)
	{
		if ($VendorName != "") {
			$this->db->where("VendorName", $VendorName);
		}

		$this->db->where("StatusCode", "active");
		$this->db->where("VendorType", "vendor");
		$this->db->select('
			VendorID id,
			VendorName label
		');

		$query = $this->db->get('mj_vendor')->result_array();

		return $query;
	}

	public function GetSubContList($SubcontName = null)
	{
		if ($SubcontName != "") {
			$this->db->where("VendorName", $SubcontName);
		}

		$this->db->where("StatusCode", "active");
		$this->db->where("VendorType", "subcont");
		$this->db->select('
			VendorID id,
			VendorName label
		');

		$query = $this->db->get('mj_vendor')->result_array();

		return $query;
	}

	public function GetAssetBrandList()
	{
		$this->db->select('
			BrandID id,
			BrandName label
		');

		$this->db->where("StatusCode", "active");
		$query = $this->db->get('mj_assets_brand')->result_array();

		return $query;
	}

	public function GetAssetCategoryList()
	{
		$this->db->select('
			CategoryID id,
			CategoryName label
		');

		$this->db->where("StatusCode", "active");
		$query = $this->db->get('mj_assets_category')->result_array();

		return $query;
	}

	public function GetBrandList()
	{
		$this->db->select('
			BrandID id,
			BrandName label
		');

		$query = $this->db->get('mj_brand')->result_array();

		return $query;
	}

	public function GetProductList()
	{
		$this->db->select('
			ProductID id,
			CONCAT(ProductCode, " - ", ProductName) label
		');

		$this->db->where("StatusCode", "active");
		$query = $this->db->get('mj_product')->result_array();

		return $query;
	}

	public function GetRackList()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			RackID id,
			RackNumber label
		');

		$query = $this->db->get('mj_master_rack')->result_array();

		return $query;
	}

	public function GetPartCodeList()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			SparepartID id,
			CONCAT(SparepartCode, " - ", SparepartNumberCode, " - ", SparepartName) label
		');

		$query = $this->db->get('mj_sparepart')->result_array();

		return $query;
	}

	public function GetToolkitList()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ToolkitID id,
			CONCAT(ToolkitCode, " - ", ToolkitName) label
		');

		$query = $this->db->get('mj_toolkit')->result_array();

		return $query;
	}

	public function GetEmployeeList($EmployeeName = null)
	{
		if ($EmployeeName != "") {
			$this->db->where("people_name", $EmployeeName);
		}

		$this->db->where("status", "active");
		$this->db->select('
			people_id id,
			CONCAT(IFNULL(people_ext_id, "EMPTY"), " - ", people_name) label,
			people_name
		');

		$query = $this->db->get('mj_people')->result_array();

		return $query;
	}

	public function GetContractNumber($CustomerID = null)
	{
		($CustomerID != "") ? $this->db->where("a.CustomerID", $CustomerID) : "";
		$this->db->where("a.StatusCode", "active");
		$this->db->join("mj_project_new b", "b.OrderBookID = a.OrderBookID", "left");
		$this->db->select('
			a.OrderBookID id,
			a.ContractNumber label,
			b.ProjectName
		');

		$query = $this->db->get('mj_order_book a')->result_array();

		return $query;
	}

	public function getCategoryExpenses()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			BudgetCategoryID id,
			BudgetCategory label
		');

		$query = $this->db->get('mj_budget_category')->result_array();

		return $query;
	}

	public function getReligion()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ReligionID id,
			ReligionName label
		');

		$query = $this->db->get('mj_religion')->result_array();

		return $query;
	}

	public function GetGolonganList()
	{
		$this->db->where("status", "active");
		$this->db->select('
			gol_id id,
			gol_name label
		');

		$query = $this->db->get('mj_staff_golongan')->result_array();

		return $query;
	}

	public function GetPositionList()
	{
		$this->db->where("status", "active");
		$this->db->select('
			position_id id,
			position_name label
		');

		$query = $this->db->get('mj_staff_position')->result_array();

		return $query;
	}

	public function GetDocumentTypeList()
	{
		$this->db->where("status", "active");
		$this->db->select('
			doc_type_id id,
			doc_type_name label
		');

		$query = $this->db->get('mj_document_type')->result_array();

		return $query;
	}

	public function getFamilyStatus()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			FamilyStatusID id,
			FamilyStatusName label
		');

		$query = $this->db->get('mj_family_status')->result_array();

		return $query;
	}

	public function getEducationLevel()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			EducationLevelID id,
			EducationLevel label
		');

		$query = $this->db->get('mj_education_level')->result_array();

		return $query;
	}

	public function getProvince()
	{
		$this->db->where("StatusCode", "active");
		$this->db->select('
			ProvinceID id,
			ProvinceName label
		');

		$query = $this->db->get('reg_province')->result_array();

		return $query;
	}

	public function getDistrict($ProvinceID = '')
	{
		if ($ProvinceID != '') {
			$this->db->where("ProvinceID", $ProvinceID);
		}

		$this->db->where("StatusCode", "active");
		$this->db->select('
			DistrictID id,
			DistrictName label
		');

		$query = $this->db->get('reg_district')->result_array();

		return $query;
	}

	public function getSubDistrict($DistrictID = '')
	{
		if ($DistrictID != '') {
			$this->db->where("DistrictID", $DistrictID);
		}

		$this->db->where("StatusCode", "active");
		$this->db->select('
			SubDistrictID id,
			SubDistrictName label
		');

		$query = $this->db->get('reg_subdistrict')->result_array();

		return $query;
	}

	public function getVillage($SubDistrictID = '')
	{
		if ($SubDistrictID != '') {
			$this->db->where("SubDistrictID", $SubDistrictID);
		}

		$this->db->where("StatusCode", "active");
		$this->db->select('
			VillageID id,
			VillageName label
		');

		$query = $this->db->get('reg_village')->result_array();

		return $query;
	}
}
