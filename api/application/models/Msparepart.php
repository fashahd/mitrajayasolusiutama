<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Msparepart extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

    public function getType($val){
		switch ($val) {
			case 'elect':
				return "Electricals Part";
				break;
			case 'mech':
				return "Mechanicals Part";
				break;
			case 'pcbs':
				return "Electronics Part";
				break;
			default:
			return "";
				break;
		}
	}

    public function getCategory($val){
		switch ($val) {
			case 'c':
				return "Critical";
				break;
			case 'f':
				return "Fast Moving";
				break;
			case 's':
				return "Standard";
				break;
			default:
			return "";
				break;
		}
	}

    public function getStatus($val){
		switch ($val) {
			case 'ready':
				return "Ready Stock";
				break;
			case 'indent':
				return "Indent";
				break;
			default:
			return "";
				break;
		}
	}

	public function list_sparepart($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'SparepartID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("SparepartName", $pSearch["keySearch"]): "";
		($pSearch["keySearch2"] != '') ? $this->db->where("SparepartCode", $pSearch["keySearch2"]): "";
		($pSearch["ProductID"] != '') ? $this->db->where("a.ProductID", $pSearch["ProductID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.SparepartID");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_part_category b", "SparepartNumberCode BETWEEN b.StartRangePartCode AND b. EndRangePartCode AND a.ProductID = b.ProductID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.SparepartID', false);
		$this->db->select('a.SparepartID,
            CONCAT(a.SparepartCode," - ",LPAD(a.SparepartNumberCode, 4, 0)) SparepartCode,
            a.SparepartNumberCode,
			a.ActualLocation,
            a.SparepartName,
            a.SparepartNo,
            a.SparepartType,
            a.SparepartCategory,
            a.SparepartQty,
            a.SparepartBasicPrice,
            a.SparepartSellingPrice,
            a.SparepartStatus,
            a.SparepartRemark,
            a.FilePath,
            a.FilePath2,
            a.FilePath3
		');
		$query = $this->db->get('mj_sparepart a');

        $data = $query->result_array();
		if($query->num_rows()>0){
			foreach($data as $k => $row){
				foreach($row as $key => $val){
					if($key == "SparepartType"){
						$type = $this->getType($val);
						$data[$k][$key] = $type;
					}
				}
			}
		}

		if($query->num_rows()>0){
			foreach($data as $k => $row){
				foreach($row as $key => $val){
					if($key == "SparepartCategory"){
						$category = $this->getCategory($val);
						$data[$k][$key] = $category;
					}
				}
			}
		}

        if($query->num_rows()>0){
			foreach($data as $k => $row){
				foreach($row as $key => $val){
					if($key == "SparepartStatus"){
						$status = $this->getStatus($val);
						$data[$k][$key] = $status;
					}
				}
			}
		}

        $result['data'] = $data;

        $query = $this->db->query('SELECT FOUND_ROWS() AS total');
        $result['total'] = $query->row()->total;

        if ($sortingDir == 'ASC') {
            $sortingInfo = 'ascending';
        }
        if ($sortingDir == 'DESC') {
            $sortingInfo = 'descending';
        }

        $_SESSION['informationGrid'] = '
            <div class="Sfr_BoxInfoDataGrid_Title"><strong>' . number_format($query->row()->total, 0, ".", ",") . '</strong> ' . 'Data' . '</div>
            <ul class="Sft_UlListInfoDataGrid">
                <li class="Sft_ListInfoDataGrid">
                    <img class="Sft_ListIconInfoDataGrid" src="' . base_url() . 'assets/icons/font-awesome/svgs/solid/arrow-up-wide-short.svg" width="20" />&nbsp;&nbsp;Sorted by ' . $sortingField . ' ' . $sortingInfo . '
                </li>
            </ul>';

        return $result;
	}

	public function list_loan_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'LoanID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["VendorID"] != '') ? $this->db->where("a.VendorName", $pSearch["VendorID"]): "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.LoanID");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_project b", " b.ProjectID = a.ProjectID", "left");
		$this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		$this->db->join("mj_vendor d", " d.VendorID = a.VendorName and d.StatusCode = 'active'", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.LoanID', false);
		$this->db->select('
			b.ProjectName,
			d.VendorName as VendorName,
			a.LoanDate,
			a.LoanTransferDate,
			a.LoanAmount,
            CONCAT("Rp ",FORMAT(a.LoanAmount,2,"en_US")) LoanAmount,
			a.LoanAmountDescription,
			a.LoanDescription,
            CONCAT("Rp ",FORMAT(sum(c.LoanPaymentAmount),2,"en_US")) TotalPayment,
            CONCAT("Rp ",FORMAT((a.LoanAmount- sum(c.LoanPaymentAmount)),2,"en_US")) LoanRemaining,
		');
		$query = $this->db->get('mj_loan a');

		$data = $query->result_array();

        return $data;
	}

	public function form_sparepart($SparepartID){

        $this->db->where("StatusCode", "active");
        $this->db->where("SparepartID", $SparepartID);
		$this->db->select('SQL_CALC_FOUND_ROWS SparepartID', false);
		$this->db->select('SparepartID,
            SparepartCode,
            SparepartNumberCode,
            SparepartName,
            SparepartNo,
            SparepartType,
            SparepartCategory,
            SparepartQty,
            SparepartBasicPrice,
            SparepartSellingPrice,
            SparepartStatus,
            SparepartRemark,
			ProductID,
            FilePath,
            FilePath2,
            FilePath3
		');
		$query = $this->db->get('mj_sparepart')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-".$row] = $value;
        }

        $result["FilePath"] = $query["FilePath"];
        $result["FilePath2"] = $query["FilePath2"];
        $result["FilePath3"] = $query["FilePath3"];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CheckDocNo($field, $id, $LoanPaymentID){
		($LoanPaymentID != "") ? $this->db->where("LoanPaymentID <> ", $LoanPaymentID) : "";
		$this->db->where($field, $id);
		$this->db->select('LoanPaymentID,
			LoanID,
			DocumentNo,
			LoanPaymentAmount,
			LoanPaymentDate,
			PaymentLoanDescription,
		');
		$query = $this->db->get('mj_loan_payment');

		$return["exist"] = 0;
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

	public function getProductCode($ProductID){
		$sql 	= "SELECT ProductCode FROM mj_product WHERE ProductID = ?";
		$query	= $this->db->query($sql, array($ProductID))->row_array();

		return $query["ProductCode"];
	}

	public function CheckSparepartCode($ProductID, $SparepartNumberCode, $SparepartID){
		if($SparepartID != ''){
			$this->db->where("SparepartID <>", $SparepartID);
		}
		$this->db->where("ProductID", $ProductID);
		$this->db->where("SparepartNumberCode", $SparepartNumberCode);
		$this->db->select("SparepartID");
		$query = $this->db->get('mj_sparepart');

		if($query->num_rows()>0){
			return true;
		}else{
			return false;
		}
	}

	public function submit_sparepart($post){
		$SparepartID = $post["SparepartID"];

		$post["SparepartBasicPrice"] 	= str_replace(",","", $post["SparepartBasicPrice"]);
		$post["SparepartSellingPrice"] 	= str_replace(",","", $post["SparepartSellingPrice"]);
		$post["FilePath"] 	= $post["PhotoOld"];
		$post["FilePath2"] 	= $post["PhotoOld2"];
		$post["FilePath3"] 	= $post["PhotoOld3"];
		$post["SparePartCode"] = $this->getProductCode($post["ProductID"]);


		$duplicate	= $this->CheckSparepartCode($post["ProductID"], $post["SparepartNumberCode"], $SparepartID);
		
		if($duplicate){			
			$return["success"]  = false;
			$return["message"]	= "Sparepart Number Code Already Exist !"; 
			$return["SparepartID"] = $SparepartID;
			return $return;
		}

		unset($post["OpsiDisplay"]);
		unset($post["PartCategoryID"]);
		unset($post["SparepartID"]);
		unset($post["PhotoOld"]);
		unset($post["PhotoOld2"]);
		unset($post["PhotoOld3"]);

		$path = $post["FilePath"];
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		
		if($SparepartID == ""){
			if($post["FilePath"] != "") {
				$newpath = "files/sparepart/".time()."_photo_1.".$ext;
				if (strpos($post["FilePath"], 'files/tmp/') !== false) {
					rename($post["FilePath"], $newpath);
				}
				$post["FilePath"] = $newpath;
			}

			if($post["FilePath2"] != "") {
				$newpath = "files/sparepart/".time()."_photo_2.".$ext;
				
				if (strpos($post["FilePath2"], 'files/tmp/') !== false) {
					rename($post["FilePath2"], $newpath);
				}
				$post["FilePath2"] = $newpath;
			}

			if($post["FilePath3"] != "") {
				$newpath = "files/sparepart/".time()."_photo_3.".$ext;
				
				if (strpos($post["FilePath3"], 'files/tmp/') !== false) {
					rename($post["FilePath3"], $newpath);
				}
				$post["FilePath3"] = $newpath;
			}
			
			$SparepartID = getUUID();
			$post["SparepartID"] = $SparepartID;
			$post["CreatedDate"] 	= date("Y-m-d H:i:s");
			$post["CreatedBy"] 		= $_SESSION["user_id"];
			$query = $this->db->insert("mj_sparepart", $post);
		}else{
			$post["UpdatedDate"] 	= date("Y-m-d H:i:s");
			$post["UpdatedBy"] 		= $_SESSION["user_id"];

			$this->db->where("SparepartID", $SparepartID);
			$query = $this->db->update("mj_sparepart", $post);
		}

		if($query){
			$return["success"]  = true;
			$return["message"]	= "Data Saved";
			$return["SparepartID"] = $SparepartID;
		}else{
			$return["success"]  = false;
			$return["message"]	= "Failed to Saved Data"; 
			$return["SparepartID"] = $SparepartID;
		}

		return $return;
	}

}
