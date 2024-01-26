<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mcomponent extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_component($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'Code';
        if ($sortingDir == "") $sortingDir = 'ASC';

		($pSearch["keySearch"] != '') ? $this->db->like("Code", $pSearch["keySearch"])->or_where("Description", $pSearch["keySearch"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.ComponentID', false);
		$this->db->select('
			Code,
			Description
		');
		$query = $this->db->get('mj_component a');

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

    public function insertComponent($post)
    {
        unset($post["OpsiDisplay"]);
		$ComponentID 			= getUUID();
		$post["ComponentID"] = $ComponentID;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		
		$insert = $this->db->insert("mj_component", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ComponentID"] = $ComponentID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function updateComponent($post)
    {
		$ComponentID = $post["ComponentID"];
        unset($post["OpsiDisplay"]);
        unset($post["ComponentID"]);

		$post["UpdatedDate"] = date("Y-m-d H:i:s");
		$post["UpdatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("ComponentID", $ComponentID);
		$insert = $this->db->update("mj_component", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ComponentID"] = $ComponentID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_component($ComponentID){

		$this->db->where("a.ComponentID", $ComponentID);
		$this->db->select('
			ComponentID,
			Code,
			Description				
		');
		$query = $this->db->get('mj_component a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.CostElement.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}
}
