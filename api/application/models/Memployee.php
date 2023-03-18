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

	public function list_family($people_id, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'family_id';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$this->db->where("a.status", "active");
		$this->db->where("a.people_id", $people_id);
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.family_id', false);
		$this->db->select('
			a.family_name
			, IF(a.family_gender = "male", "Male", IF(a.family_gender = "female", "Female", "-")) family_gender
			, a.family_status
			, a.family_student
			, a.family_gender
			, a.family_birth_place
			, a.family_birth_date
			, a.family_religion
			, a.family_address
			, a.family_phone
			, a.family_email
		');
		$query = $this->db->get('mj_family a');

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

	public function list_education($people_id, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'education_id';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$this->db->where("a.status", "active");
		$this->db->where("a.people_id", $people_id);
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.education_id', false);
		$this->db->join("mj_education_level b","b.EducationLevelID = a.education_level", "left");
		$this->db->select('
			, a.people_id
			, b.EducationLevel education_level
			, a.start_year
			, a.end_year
			, a.school_name
			, IF(a.gpa_from != "", CONCAT(a.gpa, " - ", a.gpa_from), a.gpa) gpa
		');
		$query = $this->db->get('mj_education a');

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

	public function insertFamily($post){
        unset($post["OpsiDisplay"]);
		$family_id 				= getUUID();
		$post["family_id"] 		= $family_id;
		$post["CreatedDate"] 	= date("Y-m-d H:i:s");
		$post["CreatedBy"] 		= $_SESSION["user_id"];
		
		
		$insert = $this->db->insert("mj_family", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["family_id"] = $family_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function updateFamily($post){
		$family_id 				= $post['family_id'];
        unset($post["OpsiDisplay"]);
        unset($post["family_id"]);
		
		$post["UpdatedDate"] 	= date("Y-m-d H:i:s");
		$post["UpdatedBy"] 		= $_SESSION["user_id"];
		
		$this->db->where("family_id", $family_id);
		$update = $this->db->update("mj_family", $post);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["family_id"] = $family_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function insertEducation($post){
        unset($post["OpsiDisplay"]);
		$education_id 			= getUUID();
		$post["education_id"] 	= $education_id;
		$post["CreatedDate"] 	= date("Y-m-d H:i:s");
		$post["CreatedBy"] 		= $_SESSION["user_id"];
		
		
		$insert = $this->db->insert("mj_education", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["education_id"] = $education_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function updateEducation($post){
		$education_id 				= $post['education_id'];
        unset($post["OpsiDisplay"]);
        unset($post["education_id"]);
		
		$post["UpdatedDate"] 	= date("Y-m-d H:i:s");
		$post["UpdatedBy"] 		= $_SESSION["user_id"];
		
		$this->db->where("education_id", $education_id);
		$update = $this->db->update("mj_education", $post);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["education_id"] = $education_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
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
		$post["photo"] = $post["PhotoOld"];
        unset($post["OpsiDisplay"]);
        unset($post["people_id"]);
        unset($post["PhotoOld"]);

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
			a.people_id
			, a.people_ext_id
			, a.partner_id
			, a.people_name
			, a.people_gender
			, a.user_id
			, a.phone_code
			, a.phone_number
			, a.people_email
			, a.address
			, a.province_id
			, a.district_id
			, a.subdistrict_id
			, a.village_id
			, a.birth_date
			, a.birth_place
			, a.bank
			, a.account_no
			, a.account_beneficiary
			, a.religion
			, a.photo PhotoOld
			, a.photo
		');
		$query = $this->db->get('mj_people a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.MainForm-FormBasicData-".$row] = $value;
        }
		
		$result['province_id'] = $query['province_id'];
		$result['district_id'] = $query['district_id'];
		$result['subdistrict_id'] = $query['subdistrict_id'];
		$result['village_id'] = $query['village_id'];
		$result['photo'] 	= base_url().$query['photo'];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function form_family($family_id){

		$this->db->where("a.family_id", $family_id);
		$this->db->select('
			a.family_id
			, a.people_id
			, a.family_name
			, a.family_status
			, a.family_student
			, a.family_gender
			, a.family_birth_place
			, a.family_birth_date
			, a.family_religion
			, a.family_address
			, a.family_phone
			, a.family_email
			, a.province_id
			, a.district_id
			, a.subdistrict_id
			, a.village_id		
		');
		$query = $this->db->get('mj_family a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.WinFormFamily-Form-".$row] = $value;
        }
		
		$result['province_id'] = $query['province_id'];
		$result['district_id'] = $query['district_id'];
		$result['subdistrict_id'] = $query['subdistrict_id'];
		$result['village_id'] = $query['village_id'];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function form_education($education_id){

		$this->db->where("a.education_id", $education_id);
		$this->db->select('
			a.education_id
			, a.people_id
			, a.education_level
			, a.school_name
			, a.start_year
			, a.end_year
			, a.gpa
			, a.gpa_from				
		');
		$query = $this->db->get('mj_education a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.WinFormEducation-Form-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}
}
