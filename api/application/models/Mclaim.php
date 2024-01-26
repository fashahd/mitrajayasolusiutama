<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mclaim extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function list_claim($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'ClaimDate';
		if ($sortingDir == "") $sortingDir = 'DESC';
		// $this->db->join("mj_order_book b", " b.OrderBookID = a.ProjectID", "left");
		// $this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		// $this->db->join("mj_vendor d", " d.VendorID = a.VendorName and d.StatusCode = 'active'", "left");
		// $this->db->join("mj_project_new e", " e.ProjectID = b.ProjectID", "left");

		// ($pSearch["keySearch"] != '') ? $this->db->like("InvoiceNumber", $pSearch["keySearch"]): "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]) : "";
		($pSearch["DocNumber"] != '') ? $this->db->where("a.DocNumber", $pSearch["DocNumber"]) : "";
		($_SESSION["role_id"] == "1") ? $this->db->where("a.CreatedBy", $_SESSION["user_id"]) : "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.ClaimID");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_people p", " p.people_id = a.EmployeeID", "left");
		$this->db->join("mj_project_new e", " e.ProjectID = a.ProjectID", "left");
		$this->db->join("mj_claim_detail mcd", " mcd.ClaimID = a.ClaimID ", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.ClaimID', false);
		$this->db->select('
			a.ProjectID,
			a.ClaimDate,
			a.DocNumber,
			a.Location,
			e.ProjectName,
			p.people_name PeopleName,
			SUM(mcd.Amount) TotalAmount
		');
		$query = $this->db->get('mj_claim a');

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

	public function list_claim_detail($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'ClaimDetailDate';
		if ($sortingDir == "") $sortingDir = 'ASC';
		$sqlwhere = ($_SESSION["role_id"] == "1") ? " AND mcd.CreatedBy  = '$_SESSION[user_id]' " : "";

		$sql = "SELECT
				mcd.ClaimDetailID
				, mcd.ClaimID
				, mcd.ClaimDetailDate
				, mcd.Photo
				, mcd.Amount
				, mcd.Description
				, mc.`Code` CostElement
			FROM
				`mj_claim_detail` mcd
			LEFT JOIN
				mj_component mc on mc.ComponentID = mcd.CostElement
			WHERE
				mcd.ClaimID = ?
			AND
				mcd.StatusCode = 'active'
			$sqlwhere
		ORDER BY $sortingField $sortingDir
		LIMIT $start, $limit";
		$query = $this->db->query($sql, array($pSearch["ClaimID"]));

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

	public function CekEksisClaim($field, $id, $ClaimID)
	{
		($ClaimID != "") ? $this->db->where("a.ClaimID <> ", $ClaimID) : "";
		$this->db->where($field, $id);
		$this->db->select('a.ClaimID,
			a.DocNumber
		');
		$query = $this->db->get('mj_claim a');

		$return["exist"] = 0;
		if ($query->num_rows() > 0) {
			$return["exist"] = 1;
		}

		return $return;
	}

	public function insert_claim($post)
	{
		$ClaimID = getUUID();
		$post["ClaimID"] = $ClaimID;
		$post["CreatedBy"] = $_SESSION["user_id"];
		$post["DateCreated"] = date("Y-m-d H:i:s");

		unset($post["OpsiDisplay"]);
		unset($post["TotalAmount"]);

		$insert = $this->db->insert("mj_claim", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ClaimID"] = $ClaimID;
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function insert_claim_detail($post)
	{
		unset($post["OpsiDisplay"]);
		unset($post["PhotoOld2"]);
		$ClaimDetailID = getUUID();
		$post["ClaimDetailID"] = $ClaimDetailID;
		$post["CreatedBy"] = $_SESSION["user_id"];
		$post["DateCreated"] = date("Y-m-d H:i:s");

		$insert = $this->db->insert("mj_claim_detail", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ClaimDetailID"] = $ClaimDetailID;
			$response["ClaimID"] = $post['ClaimID'];
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_claim($post)
	{
		$ClaimID = $post["ClaimID"];

		unset($post["OpsiDisplay"]);
		unset($post["ClaimID"]);
		unset($post["TotalAmount"]);
		$post["LastModifiedBy"] = $_SESSION["user_id"];
		$post["DateUpdated"] = date("Y-m-d H:i:s");

		$this->db->where("ClaimID", $ClaimID);
		$insert = $this->db->update("mj_claim", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ClaimID"] = $ClaimID;
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_claim_detail($post)
	{
		$ClaimDetailID = $post["ClaimDetailID"];
		unset($post["OpsiDisplay"]);
		unset($post["ClaimDetailID"]);
		unset($post["PhotoOld2"]);
		$post["LastModifiedBy"] = $_SESSION["user_id"];
		$post["DateUpdated"] = date("Y-m-d H:i:s");

		$this->db->where("ClaimDetailID", $ClaimDetailID);
		$insert = $this->db->update("mj_claim_detail", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ClaimDetailID"] = $ClaimDetailID;
			$response["ClaimID"] = $post['ClaimID'];
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function form_claim($ClaimID)
	{

		$this->db->group_by("a.ClaimID");
		$this->db->where("a.StatusCode", "active");
		// $this->db->where("b.StatusCode", "active");
		$this->db->where("a.ClaimID", $ClaimID);
		$this->db->join("mj_claim_detail b", " b.ClaimID = a.ClaimID AND b.StatusCode = 'active' ", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.ClaimID', false);
		$this->db->select('a.ClaimID,
			a.DocNumber,
			a.ProjectID,
			a.ClaimDate,
			a.EmployeeID,
			a.Location,
			SUM(b.Amount) TotalAmount
		');
		$query = $this->db->get('mj_claim a')->row_array();

		$result = array();
		foreach ($query as $row => $value) {
			$result["MitraJaya.view.Finance.Claim.MainForm-FormBasicData-" . $row] = $value;
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function form_claim_detail($ClaimDetailID)
	{
		$this->db->where("ClaimDetailID", $ClaimDetailID);
		$this->db->select('
			ClaimDetailID
			, ClaimID
			, ClaimDetailDate
			, Photo PhotoOld2
			, Amount
			, Description
			, CostElement
		');
		$query = $this->db->get('mj_claim_detail')->row_array();

		$result = array();
		foreach ($query as $row => $value) {
			$result["MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-" . $row] = $value;
		}

		$result["FilePath"] = $result["MitraJaya.view.Finance.Claim.WinFormClaimDetail-Form-PhotoOld2"];

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function CheckDocNo($field, $id, $LoanPaymentID)
	{
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
		if ($query->num_rows() > 0) {
			$return["exist"] = 1;
		}

		return $return;
	}
}
