<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mloanemployee extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_loan($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'EmployeeLoanID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("InvoiceNumber", $pSearch["keySearch"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.EmployeeLoanID");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_people b", " b.people_id = a.PeopleID", "left");
		$this->db->join("mj_employee_loan_payment c", " c.EmployeeLoanID = a.EmployeeLoanID and c.StatusCode = 'active'", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.EmployeeLoanID', false);
		$this->db->select('
			a.PeopleID,
			a.LoanDate,
			a.DocNumber,
			a.LoanTransferDate,
			b.people_name Name,
			a.LoanAmount,
            CONCAT("Rp ",FORMAT(a.LoanAmount,2,"en_US")) LoanAmount,
			a.LoanAmountDescription,
			a.LoanDescription,
            CONCAT("Rp ",FORMAT(sum(c.LoanPaymentAmount),2,"en_US")) TotalPayment,
            CONCAT("Rp ",FORMAT((a.LoanAmount- sum(c.LoanPaymentAmount)),2,"en_US")) LoanRemaining,
		');
		$query = $this->db->get('mj_employee_loan a');

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

    public function list_payment_loan($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'EmployeeLoanID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["EmployeeLoanID"] != '') ? $this->db->where("EmployeeLoanID", $pSearch["EmployeeLoanID"]): "";

		$this->db->where("StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS EmployeeLoanPaymentID', false);
		$this->db->select('
			EmployeeLoanID,
			LoanPaymentAmount,
            CONCAT("Rp ",FORMAT(LoanPaymentAmount,2,"en_US")) LoanPaymentAmount,
			LoanPaymentDate,
			PaymentLoanDescription
		');
		$query = $this->db->get('mj_employee_loan_payment');

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

	public function list_loan_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'OrderBookID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("ContractNumber", $pSearch["keySearch"]): "";
		($pSearch["StartDate"] != '') ? $this->db->where("a.ContractDate >", date("Y-m-d", strtotime($pSearch["StartDate"]))): "";
		($pSearch["EndDate"] != '') ? $this->db->where("a.ContractDate <", date("Y-m-d", strtotime($pSearch["EndDate"]))): "";
		($pSearch["CustomerID"] != '') ? $this->db->where("a.CustomerID", $pSearch["CustomerID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_customer b", " b.CustomerID = a.CustomerID", "left");
		$this->db->join("mj_project_new c", " c.ProjectID = a.ProjectID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.OrderBookID', false);
		$this->db->select('
			a.CustomerID,
			a.ContractNumber,
			a.ContractDate,
			a.Description,
			a.ProjectID,
			a.DeptID,
			a.PeopleID,
			a.ContractAmount,
			a.PPN,
			a.ContractAmountPPN,
			CONCAT("Rp ",FORMAT(a.TotalContactAmount,2,"en_US")) TotalContactAmount,
			b.CustomerName,
			c.ProjectName
		');
		$query = $this->db->get('mj_order_book a');

		$data = $query->result_array();

        return $data;
	}

    public function insert_loan($post)
    {
        unset($post["OpsiDisplay"]);
        unset($post["TotalPayment"]);
        unset($post["LoanRemaining"]);
		$EmployeeLoanID = getUUID();
		$post["EmployeeLoanID"] = $EmployeeLoanID;
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		$insert = $this->db->insert("mj_employee_loan", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["EmployeeLoanID"] = $EmployeeLoanID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function insert_payment_loan($post)
    {
        unset($post["OpsiDisplay"]);
        unset($post["TotalPayment"]);
        unset($post["LoanRemaining"]);
		$EmployeeLoanPaymentID = getUUID();
		$post["EmployeeLoanPaymentID"] = $EmployeeLoanPaymentID;
		
		$insert = $this->db->insert("mj_employee_loan_payment", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["EmployeeLoanPaymentID"] = $EmployeeLoanPaymentID;
			$response["EmployeeLoanID"] = $post['EmployeeLoanID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_loan($post)
    {
		$EmployeeLoanID = $post["EmployeeLoanID"];
        unset($post["OpsiDisplay"]);
        unset($post["EmployeeLoanID"]);
        unset($post["TotalPayment"]);
        unset($post["LoanRemaining"]);
		$post["UpdatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("EmployeeLoanID", $EmployeeLoanID);
		$insert = $this->db->update("mj_employee_loan", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["EmployeeLoanID"] = $EmployeeLoanID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_payment_loan($post)
    {
		$EmployeeLoanPaymentID = $post["EmployeeLoanPaymentID"];
        unset($post["OpsiDisplay"]);
        unset($post["EmployeeLoanPaymentID"]);

        $param['LoanPaymentAmount'] = $post['LoanPaymentAmount'];
        $param['LoanPaymentDate'] = $post['LoanPaymentDate'];
        $param['PaymentLoanDescription'] = $post['PaymentLoanDescription'];
		
		$this->db->where("EmployeeLoanPaymentID", $EmployeeLoanPaymentID);
		$insert = $this->db->update("mj_employee_loan_payment", $param);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["EmployeeLoanPaymentID"] = $EmployeeLoanPaymentID;
			$response["EmployeeLoanID"] = $post['EmployeeLoanID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_loan($EmployeeLoanID){

        $this->db->where("a.StatusCode", "active");
        $this->db->where("b.StatusCode", "active");
        $this->db->where("a.EmployeeLoanID", $EmployeeLoanID);
		$this->db->join("mj_employee_loan_payment b", " b.EmployeeLoanID = a.EmployeeLoanID", "left");
		$this->db->select('a.EmployeeLoanID,
			a.PeopleID,
			a.LoanDate,
			a.DocNumber,
			a.LoanTransferDate,
			a.LoanAmount,
			a.LoanAmountDescription,
			a.LoanDescription,
            a.LoanAmount - IFNULL(sum(b.LoanPaymentAmount), 0) as LoanRemaining
		');
		$query = $this->db->get('mj_employee_loan a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Finance.Loan.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

    public function form_payment_loan($EmployeeLoanPaymentID){
		$this->db->where("EmployeeLoanPaymentID", $EmployeeLoanPaymentID);
		$this->db->select('EmployeeLoanPaymentID,
			EmployeeLoanID,
			LoanPaymentAmount,
			LoanPaymentDate,
			PaymentLoanDescription
		');
		$query = $this->db->get('mj_employee_loan_payment')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Finance.Loan.WinFormLoanPayment-Form-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CheckDocNo($field, $id, $LoanPaymentID){
		($LoanPaymentID != "") ? $this->db->where("LoanPaymentID <> ", $LoanPaymentID) : "";
		$this->db->where($field, $id);
		$this->db->select('LoanPaymentID,
			EmployeeLoanID,
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

}
