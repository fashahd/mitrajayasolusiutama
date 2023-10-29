<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mposition extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function listPosition($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'position_id';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("position_name", $pSearch["keySearch"])->or_where("position_code", $pSearch["keySearch"]): "";

		$this->db->where("status", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS position_id', false);
		$this->db->select('
			position_code,
			position_name
		');
		$query = $this->db->get('mj_staff_position');

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

    public function insertPosition($post)
    {
        unset($post["OpsiDisplay"]);
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		
		$insert = $this->db->insert("mj_staff_position", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["position_id"] = $this->db->insert_id();
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function updatePosition($post)
    {
		$position_id = $post["position_id"];
        unset($post["OpsiDisplay"]);
        unset($post["position_id"]);

		$post["UpdatedDate"] = date("Y-m-d H:i:s");
		$post["UpdatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("position_id", $position_id);
		$insert = $this->db->update("mj_staff_position", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["position_id"] = $position_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_position($position_id){
		$this->db->where("position_id", $position_id);
		$this->db->select('
			position_id,
			position_code,
			position_name				
		');
		$query = $this->db->get('mj_staff_position')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Position.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}
}
