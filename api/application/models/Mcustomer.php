<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mcustomer extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_customer($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'CustomerID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("CustomerName", $pSearch["keySearch"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.CustomerID', false);
		$this->db->select('
			a.CustomerDisplayID,
			a.CustomerName,
			a.CustomerAddress,
			a.PhoneCode,
			a.PhoneNumber,
			a.Email
		');
		$query = $this->db->get('mj_customer a');

		$data = $query->result_array();
        // $result['sql'] = $this->db->last_query();
        $result['data'] = $data;
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

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

    public function insertCustomer($post)
    {
        unset($post["OpsiDisplay"]);
		$CustomerID = getUUID();
		$post["CustomerID"] = $CustomerID;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		
		$insert = $this->db->insert("mj_customer", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["CustomerID"] = $CustomerID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function updateCustomer($post)
    {
		$CustomerID = $post["CustomerID"];
        unset($post["OpsiDisplay"]);
        unset($post["CustomerID"]);

		$post["UpdatedDate"] = date("Y-m-d H:i:s");
		$post["UpdatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("CustomerID", $CustomerID);
		$insert = $this->db->update("mj_customer", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["CustomerID"] = $CustomerID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_customer($CustomerID){

		$this->db->where("a.CustomerID", $CustomerID);
		$this->db->select('
			a.CustomerID,
			a.CustomerDisplayID,
			a.CustomerName,
			a.CustomerAddress,
			a.PhoneCode,
			a.PhoneNumber,
			a.Email
		');
		$query = $this->db->get('mj_customer a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Customer.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}
}
