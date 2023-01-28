<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mtoolkit extends CI_Model {
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

	public function list_toolkit($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'ToolkitID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["ToolkitCode"] != '') ? $this->db->where("ToolkitCode", $pSearch["ToolkitCode"]): "";
		($pSearch["ToolkitName"] != '') ? $this->db->like("ToolkitName", $pSearch["ToolkitName"]): "";

		$this->db->where("StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS ToolkitID', false);
		$this->db->select('ToolkitID,
            ToolkitCode,
			ToolkitName,
            ToolkitQty
		');
		$query = $this->db->get('mj_toolkit');

        // $data = $query->result_array();
		// if($query->num_rows()>0){
		// 	foreach($data as $k => $row){
		// 		foreach($row as $key => $val){
		// 			if($key == "SparepartType"){
		// 				$type = $this->getType($val);
		// 				$data[$k][$key] = $type;
		// 			}
		// 		}
		// 	}
		// }

		// if($query->num_rows()>0){
		// 	foreach($data as $k => $row){
		// 		foreach($row as $key => $val){
		// 			if($key == "SparepartCategory"){
		// 				$category = $this->getCategory($val);
		// 				$data[$k][$key] = $category;
		// 			}
		// 		}
		// 	}
		// }

        // if($query->num_rows()>0){
		// 	foreach($data as $k => $row){
		// 		foreach($row as $key => $val){
		// 			if($key == "SparepartStatus"){
		// 				$status = $this->getStatus($val);
		// 				$data[$k][$key] = $status;
		// 			}
		// 		}
		// 	}
		// }
		$data = $query->result_array();
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

	public function form_toolkit($ToolkitID){

        $this->db->where("StatusCode", "active");
        $this->db->where("ToolkitID", $ToolkitID);
		$this->db->select('SQL_CALC_FOUND_ROWS ToolkitID', false);
		$this->db->select('ToolkitID,
            ToolkitCode,
            ToolkitName,
            ToolkitQty,
			RackID,
			Photo
		');
		$query = $this->db->get('mj_toolkit')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-".$row] = $value;
        }
        $result["file"] = $query["Photo"];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function update_toolkit($post)
    {
		$ToolkitID = $post["ToolkitID"];
        unset($post["OpsiDisplay"]);
        unset($post["ToolkitID"]);

        $param['ToolkitCode'] = $post['ToolkitCode'];
        $param['ToolkitName'] = $post['ToolkitName'];
        $param['ToolkitQty'] = $post['ToolkitQty'];
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("ToolkitID", $ToolkitID);
		$update = $this->db->update("mj_toolkit", $param);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ToolkitID"] = $ToolkitID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }


	public function insert_toolkit($post)
    {
		$ToolkitID = getUUID();
		$PhotoOld = $post["PhotoOld"];
        unset($post["OpsiDisplay"]);
        unset($post["ToolkitID"]);
        unset($post["PhotoOld"]);

		$post["ToolkitID"] = $ToolkitID;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];

		if($PhotoOld != "") {
			$path = $PhotoOld;
			$ext = pathinfo($path, PATHINFO_EXTENSION);

			$newpath = "files/toolkit/".time()."_toolkit.".$ext;
			if (strpos($PhotoOld, 'files/tmp/') !== false) {
				rename($PhotoOld, $newpath);
			}
			$post["Photo"] = $newpath;
		}
		
		$update = $this->db->insert("mj_toolkit", $post);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ToolkitID"] = $ToolkitID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }
}
