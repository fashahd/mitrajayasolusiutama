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
			a.address,
			a.people_email
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

	public function list_contract($people_id, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'start_date';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$this->db->where("a.status", "active");
		$this->db->where("a.people_id", $people_id);
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.contract_id', false);
		$this->db->join('mj_staff_position b ','b.position_id = a.position','left');
		$this->db->join('mj_staff_golongan c ','c.gol_id = a.gol','left');
		$this->db->select('
			a.people_id
			, a.contract_number
			, IF(a.employee_status = "1", "Active", "Inactive") employee_status
			, b.position_name position
			, c.gol_name gol
			, if(contract_status = "permanent", a.start_date, CONCAT(a.start_date, " - ", a.end_date)) employment_date
			, UCASE(a.contract_status) contract_status
			, a.location	
		');
		$query = $this->db->get('mj_contract a');

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

	public function list_certificaiton($people_id, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){
		if ($sortingField == "") $sortingField = 'cert_id';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$this->db->where("a.status", "active");
		$this->db->where("a.people_id", $people_id);
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS a.cert_id', false);
		$this->db->select('
			, a.people_id
			, a.cert_code
			, a.cert_name
			, a.start_date
			, a.end_date
		');
		$query = $this->db->get('mj_certification a');

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

	public function insertContract($post){
		$document_old = $post["document_old"];
        unset($post["OpsiDisplay"]);
        unset($post["document_old"]);

		$contract_id 				= getUUID();
		$post["contract_id"] 		= $contract_id;
		$post["CreatedDate"] 	= date("Y-m-d H:i:s");
		$post["CreatedBy"] 		= $_SESSION["user_id"];
		$filename = str_replace(" ", "_", $document_old);

		if($document_old != ''){
			//cek folder propinsi itu sudah ada belum
			if (!file_exists('files/employee/contract')) {
				mkdir('files/employee/contract', 0777, true);
			}

			$file_tmp = pathinfo($filename);
			$gambar = date('Ymdhis') . '_' . $contract_id.".pdf";
			rename($filename, 'files/employee/contract/' . $gambar);
			$post['document'] = 'files/employee/contract/' . $gambar;
		}
		
		
		$insert = $this->db->insert("mj_contract", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["contract_id"] = $contract_id;

			if($post["employee_status"] == '1'){
				$this->db->query("UPDATE mj_contract SET employee_status = '2' WHERE contract_id != '$contract_id'");
			}
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function updateContract($post){
		$contract_id 				= $post['contract_id'];
        unset($post["OpsiDisplay"]);
        unset($post["contract_id"]);
        unset($post["document_old"]);
		
		$post["UpdatedDate"] 	= date("Y-m-d H:i:s");
		$post["UpdatedBy"] 		= $_SESSION["user_id"];
		
		$this->db->where("contract_id", $contract_id);
		$update = $this->db->update("mj_contract", $post);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["contract_id"] = $contract_id;

			if($post["employee_status"] == '1'){
				$this->db->query("UPDATE mj_contract SET employee_status = '2' WHERE contract_id != '$contract_id'");
			}
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
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

	public function insertCertification($post){		
		$document_old = $post["document_old"];
        unset($post["OpsiDisplay"]);
        unset($post["document_old"]);

		$cert_id 				= getUUID();
		$post["cert_id"] 		= $cert_id;
		$post["CreatedDate"] 	= date("Y-m-d H:i:s");
		$post["CreatedBy"] 		= $_SESSION["user_id"];
		$filename = str_replace(" ", "_", $document_old);

		if($document_old != ''){
			//cek folder propinsi itu sudah ada belum
			if (!file_exists('files/employee/certification')) {
				mkdir('files/employee/certification', 0777, true);
			}

			$file_tmp = pathinfo($filename);
			$gambar = date('Ymdhis') . '_' . $cert_id.".pdf";
			rename($filename, 'files/employee/certification/' . $gambar);
			$post['file'] = 'files/employee/certification/' . $gambar;
		}
		
		
		$insert = $this->db->insert("mj_certification", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["cert_id"] = $cert_id;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function updateCertification($post){
		$cert_id 				= $post['cert_id'];
        unset($post["OpsiDisplay"]);
        unset($post["cert_id"]);
        unset($post["document_old"]);
        unset($post["document"]);
		
		$post["UpdatedDate"] 	= date("Y-m-d H:i:s");
		$post["UpdatedBy"] 		= $_SESSION["user_id"];
		
		$this->db->where("cert_id", $cert_id);
		$update = $this->db->update("mj_certification", $post);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["cert_id"] = $cert_id;
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

	public function form_contract($contract_id){

		$this->db->where("a.contract_id", $contract_id);
		$this->db->select('
			a.contract_id
			, a.people_id
			, a.contract_number
			, a.contract_wage
			, a.employee_status
			, a.position
			, a.gol
			, a.start_date
			, a.end_date
			, a.location
			, a.contract_status
			, a.document
			, a.document document_old
		');
		$query = $this->db->get('mj_contract a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.WinFormContract-Form-".$row] = $value;
        }

		$result['document'] 	= base_url().$query['document'];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
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

	public function form_payroll($people_id){

		$this->db->where("a.people_id", $people_id);
		$this->db->select('
			a.people_id
			, a.basic_salary
			, a.tax_number
			, a.ptkp_status
			, a.bpjs_tk
			, a.bpjs_kesehatan
			, a.bpjs_family
			, a.mobile_salary
			, a.transport_salary
		');
		$query = $this->db->get('mj_people a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.PanelPayroll-Form-".$row] = $value;
        }

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

	public function form_certification($cert_id){

		$this->db->where("a.cert_id", $cert_id);
		$this->db->select('
			a.cert_id,
			a.cert_code,
			a.people_id,
			a.cert_name,
			a.start_date,
			a.end_date,
			a.description,
			a.file as document,
			a.file as document_old
		');
		$query = $this->db->get('mj_certification a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Admin.Employee.WinFormCertification-Form-".$row] = $value;
        }

		$result["document"] = $result["MitraJaya.view.Admin.Employee.WinFormCertification-Form-document"];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function list_certificaiton_notif($pSearch){
		$sql = "SELECT
			a.cert_code
			, a.cert_name
			, b.people_name
			, DATE_FORMAT(a.end_date, '%d %M %Y') end_date  
		FROM
			mj_certification a
		JOIN
			mj_people b on b.people_id = a.people_id
		WHERE
			a.status = 'active'
		AND
			a.start_date >= DATE(NOW())
		AND
			a.end_date <= DATE(NOW() + INTERVAL 14 DAY)
		LIMIT ".$pSearch["start"].",".$pSearch["limit"];
		$query = $this->db->query($sql);

		$data["total"] = $query->num_rows();
		$data["data"]	= $query->result_array();


		return $data;
	}
}
