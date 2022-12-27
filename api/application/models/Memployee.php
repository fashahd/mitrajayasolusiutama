<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Memployee extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_employee($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'people_id';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("people_name", $pSearch["keySearch"]): "";

		$this->db->where("a.status", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.people_id', false);
		$this->db->select('
			a.partner_id,
			a.people_ext_id,
			a.people_name,
			IF(a.people_gender = "male", "Male", IF(a.people_gender = "female", "Female", "-")) people_gender,
			IF(a.user_id != "", "Yes", "No") exist_user,
			a.phone_code,
			a.phone_number,
			a.address
		');
		$query = $this->db->get('mj_people a');

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
		$people_id 			= getUUID();
		$post["people_id"] = $people_id;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		
		$insert = $this->db->insert("mj_people", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["people_id"] = $people_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function updateCustomer($post)
    {
		$people_id = $post["people_id"];
        unset($post["OpsiDisplay"]);
        unset($post["people_id"]);

		$post["UpdatedDate"] = date("Y-m-d H:i:s");
		$post["UpdatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("people_id", $people_id);
		$insert = $this->db->update("mj_people", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["people_id"] = $people_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_employee($people_id){

		$this->db->where("a.people_id", $people_id);
		$this->db->select('
			a.people_id,
			a.people_ext_id,
			a.partner_id,
			a.people_name,
			a.people_gender,
			a.user_id,
			a.phone_code,
			a.phone_number,
			a.people_email,
			a.address
		');
		$query = $this->db->get('mj_people a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}
}
