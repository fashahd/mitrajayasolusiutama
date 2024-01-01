<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mloan extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function list_loan($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'LoanID';
		if ($sortingDir == "") $sortingDir = 'DESC';
		// $this->db->join("mj_order_book b", " b.OrderBookID = a.ProjectID", "left");
		// $this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		// $this->db->join("mj_vendor d", " d.VendorID = a.VendorName and d.StatusCode = 'active'", "left");
		// $this->db->join("mj_project_new e", " e.ProjectID = b.ProjectID", "left");

		// ($pSearch["keySearch"] != '') ? $this->db->like("InvoiceNumber", $pSearch["keySearch"]): "";
		($pSearch["VendorID"] != '') ? $this->db->where("a.VendorName", $pSearch["VendorID"]) : "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]) : "";
		($pSearch["LoanType"] != '') ? $this->db->where("a.LoanType", $pSearch["LoanType"]) : "";
		($pSearch["EmployeeID"] != '') ? $this->db->where("a.EmployeeName", $pSearch["EmployeeID"]) : "";
		($pSearch["DocNumber"] != '') ? $this->db->where("a.DocNumber", $pSearch["DocNumber"]) : "";
		($_SESSION["role_id"] == "1") ? $this->db->where("a.CreatedBy", $_SESSION["user_id"]) : "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.LoanID");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_order_book b", " b.OrderBookID = a.ProjectID", "left");
		$this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		$this->db->join("mj_vendor d", " d.VendorID = a.VendorName and d.StatusCode = 'active'", "left");
		$this->db->join("mj_people p", " p.people_id = a.EmployeeName and p.status = 'active'", "left");
		$this->db->join("mj_project_new e", " e.ProjectID = b.ProjectID", "left");
		$this->db->join("(SELECT
			a.LoanID
			, a.DocNumber
			, SUM(b.CashbonAmount) CashbonAmount
			, b.MitraName
			, a.ProjectID
		FROM
			mj_loan a
		JOIN
			mj_vendorpayment b on b.ProjectID = a.ProjectID
		AND
			a.StatusCode = 'active' GROUP BY 
			a.LoanID, a.ProjectID, b.MitraName) q", "q.LoanID = a.LoanID AND q.MitraName = a.VendorName AND q.ProjectID = a.ProjectID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.LoanID', false);
		$this->db->select('
			a.ProjectID,
			a.LoanDate,
			a.DocNumber,
			UCASE(a.LoanType) LoanType,
			a.LoanTransferDate,
            CONCAT("Rp ",FORMAT(a.LoanAmount,2,"en_US")) LoanAmount,
			a.LoanAmountDescription,
			a.LoanDescription,
			e.ProjectName,
			CASE 
				WHEN a.Status = "open" THEN "New"
				ELSE "-"
			END AS Status,
			IF(a.LoanType = "vendor" OR a.LoanType = "subcont", CONCAT("Rp ",FORMAT(sum(q.CashbonAmount),2,"en_US")), CONCAT("Rp ",FORMAT(sum(c.LoanPaymentAmount),2,"en_US"))) TotalPayment,
			IF(a.LoanType = "vendor" OR a.LoanType = "subcont", CONCAT("Rp ",FORMAT((a.LoanAmount- sum(q.CashbonAmount)),2,"en_US")), CONCAT("Rp ",FORMAT((a.LoanAmount- sum(c.LoanPaymentAmount)),2,"en_US"))) LoanRemaining,
			IF(a.LoanType = "employee", p.people_name, d.VendorName) as VendorNameDisplay
		', false);
		$query = $this->db->get('mj_loan a');

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

	public function list_loan_detail($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{
		if ($sortingField == "") $sortingField = 'LoanID';
		if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["LoanID"] != '') ? $this->db->where("LoanID", $pSearch["LoanID"]) : "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_component mc", "mc.ComponentID = a.CostElement", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.LoanDetailID', false);
		$this->db->select('
			a.LoanID
			, a.Photo
			, a.Qty
			, a.Amount
			, a.Description
			, mc.Code CostElement
		');
		$query = $this->db->get('mj_loan_detail a');

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

	public function list_payment_loan_employee($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{
		if ($sortingField == "") $sortingField = 'LoanID';
		if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["LoanID"] != '') ? $this->db->where("LoanID", $pSearch["LoanID"]) : "";

		$this->db->where("StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS LoanPaymentID', false);
		$this->db->select('
			LoanID,
			LoanPaymentAmount,
            CONCAT("Rp ",FORMAT(LoanPaymentAmount,2,"en_US")) LoanPaymentAmount,
			LoanPaymentDate,
			DocumentNo,
			PaymentLoanDescription
		');
		$query = $this->db->get('mj_loan_payment');

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

	public function list_payment_loan($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'PaidDate';
		if ($sortingDir == "") $sortingDir = 'ASC';

		$sql = "SELECT
			b.DocumentNo			
            , CONCAT('Rp ',FORMAT(b.CashbonAmount,2,'en_US')) LoanPaymentAmount
			, b.PaidDate LoanPaymentDate
			, b.Description PaymentLoanDescription
		FROM
			mj_loan a
		JOIN
			mj_vendorpayment b on b.MitraName = a.VendorName AND b.ProjectID = a.ProjectID
		WHERE
			a.LoanID = ?
		AND
			a.StatusCode = 'active'
		ORDER BY $sortingField $sortingDir
		LIMIT $start, $limit";
		$query = $this->db->query($sql, array($pSearch["LoanID"]));

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

	public function list_loan_excel($pSearch, $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'LoanID';
		if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["VendorID"] != '') ? $this->db->where("a.VendorName", $pSearch["VendorID"]) : "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]) : "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.LoanID");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_order_book b", " b.OrderBookID = a.ProjectID", "left");
		$this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		$this->db->join("mj_vendor d", " d.VendorID = a.VendorName and d.StatusCode = 'active'", "left");
		$this->db->join("mj_project_new e", " e.ProjectID = b.ProjectID", "left");
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

	public function insert_loan_detail($post)
	{
		$Photo = $post["PhotoOld2"];
		$LoanDetailID = getUUID();
		unset($post["OpsiDisplay"]);
		unset($post["PhotoOld2"]);

		$post["LoanDetailID"] = $LoanDetailID;
		$post["Photo"] = $Photo;
		$post["CreatedBy"] = $_SESSION["user_id"];
		$post["DateCreated"] = date("Y-m-d H:i:s");

		$insert = $this->db->insert("mj_loan_detail", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanDetailID"] = $LoanDetailID;
			$response["LoanID"] = $post["LoanID"];
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function insert_loan($post)
	{
		unset($post["OpsiDisplay"]);
		unset($post["TotalPayment"]);
		unset($post["LoanRemaining"]);
		$LoanID = getUUID();
		$post["LoanID"] = $LoanID;
		$post["VendorName"] = ($post["LoanType"] == "vendor") ? $post["VendorName"] : $post["SubcontName"];
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];

		$insert = $this->db->insert("mj_loan", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanID"] = $LoanID;
			$response["LoanType"] = strtoupper($post["LoanType"]);
		} else {
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
		$LoanPaymentID = getUUID();
		$post["LoanPaymentID"] = $LoanPaymentID;

		$insert = $this->db->insert("mj_loan_payment", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanPaymentID"] = $LoanPaymentID;
			$response["LoanID"] = $post['LoanID'];
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_loan($post)
	{
		$LoanID = $post["LoanID"];
		unset($post["OpsiDisplay"]);
		unset($post["LoanID"]);
		unset($post["TotalPayment"]);
		unset($post["LoanRemaining"]);

		$post["VendorName"] = ($post["LoanType"] == "vendor") ? $post["VendorName"] : $post["SubcontName"];
		$post["UpdatedDate"] = date("Y-m-d H:i:s");
		$post["UpdatedBy"] = $_SESSION["user_id"];

		$this->db->where("LoanID", $LoanID);
		$insert = $this->db->update("mj_loan", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanID"] = $LoanID;
			$response["LoanType"] = strtoupper($post["LoanType"]);
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_loan_detail($post)
	{
		$Photo = $post["PhotoOld2"];
		$LoanDetailID = $post["LoanDetailID"];
		unset($post["OpsiDisplay"]);
		unset($post["PhotoOld2"]);
		unset($post["LoanDetailID"]);

		$post["Photo"] = $Photo;
		$post["LastModifiedBy"] = $_SESSION["user_id"];
		$post["DateUpdated"] = date("Y-m-d H:i:s");

		$this->db->where("LoanDetailID", $LoanDetailID);
		$insert = $this->db->update("mj_loan_detail", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanDetailID"] = $LoanDetailID;
			$response["LoanID"] = $post["LoanID"];
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_payment_loan($post)
	{
		$LoanPaymentID = $post["LoanPaymentID"];
		unset($post["OpsiDisplay"]);
		unset($post["LoanPaymentID"]);

		$param['DocumentNo'] = $post['DocumentNo'];
		$param['LoanPaymentAmount'] = $post['LoanPaymentAmount'];
		$param['LoanPaymentDate'] = $post['LoanPaymentDate'];
		$param['PaymentLoanDescription'] = $post['PaymentLoanDescription'];

		$this->db->where("LoanPaymentID", $LoanPaymentID);
		$insert = $this->db->update("mj_loan_payment", $param);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanPaymentID"] = $LoanPaymentID;
			$response["LoanID"] = $post['LoanID'];
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function form_loan($LoanID)
	{

		$this->db->where("a.StatusCode", "active");
		// $this->db->where("b.StatusCode", "active");
		$this->db->where("a.LoanID", $LoanID);
		$this->db->join("mj_loan_payment b", " b.LoanID = a.LoanID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.LoanID', false);
		$this->db->select('a.LoanID,
			a.DocNumber,
			a.ProjectID,
			a.LoanDate,
			a.LoanTransferDate,
			a.VendorName,
			a.VendorName SubcontName,
			a.EmployeeName,
			a.LoanType,
			a.LoanAmount,
			a.LoanAmountDescription,
			a.LoanDescription,
			SUM(b.LoanPaymentAmount) as TotalPayment,
            a.LoanAmount - SUM(b.LoanPaymentAmount) as LoanRemaining
		');
		$query = $this->db->get('mj_loan a')->row_array();

		if ($query["LoanType"] == "vendor" || $query["LoanType"] == "subcont") {
			$sql2 = "SELECT
				SUM(b.CashbonAmount) CashbonAmount
			FROM
				mj_loan a
			JOIN
				mj_vendorpayment b on b.MitraName = a.VendorName AND b.ProjectID = a.ProjectID
			WHERE
				a.LoanID = ?
			AND
				a.StatusCode = 'active'";
			$query2 = $this->db->query($sql2, array($LoanID));

			if ($query2->num_rows() > 0) {
				$row2 = $query2->row_array();

				$query["TotalPayment"] 	= $row2["CashbonAmount"];
				$query["LoanRemaining"] = (int) $query["LoanAmount"] - (int) $row2["CashbonAmount"];
			}
		}

		$result = array();
		foreach ($query as $row => $value) {
			$result["MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-" . $row] = $value;
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function form_loan_detail($LoanDetailID)
	{
		$this->db->where("LoanDetailID", $LoanDetailID);
		$this->db->select('
			LoanDetailID
			, LoanID
			, CostElement
			, Photo Photo2
			, Photo PhotoOld2
			, Qty
			, Amount
			, Description		
		');
		$query = $this->db->get('mj_loan_detail')->row_array();

		$result = array();
		foreach ($query as $row => $value) {
			$result["MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-" . $row] = $value;
		}

		$result["FilePath"] = $result["MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanDetail-Form-PhotoOld2"];

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function form_payment_loan($LoanPaymentID)
	{
		$this->db->where("LoanPaymentID", $LoanPaymentID);
		$this->db->select('LoanPaymentID,
			LoanID,
			DocumentNo,
			LoanPaymentAmount,
			LoanPaymentDate,
			PaymentLoanDescription
		');
		$query = $this->db->get('mj_loan_payment')->row_array();

		$result = array();
		foreach ($query as $row => $value) {
			$result["MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-" . $row] = $value;
		}

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

	public function list_import_failed($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'a.LoanDate';
		if ($sortingDir == "") $sortingDir = 'DESC';

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				a.ProjectID
				, a.LoanType
				, a.LoanDate
				, a.LoanTransferDate
				, a.VendorName
				, a.SubcontName
				, a.EmployeeName
				, a.LoanAmount
				, a.LoanDescription
				, a.LoanAmountDescription
			FROM
				`mj_loan_tmp` `a`
			ORDER BY
				$sortingField $sortingDir ";
		$query = $this->db->query($sql);

		$data = $query->result_array();
		$result['sql'] = $this->db->last_query();
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

		return $result;
	}

	public function updateAmountLoanDetail($post)
	{
		$sql = "SELECT SUM(Amount) TotalAmount FROM mj_loan_detail WHERE LoanID = ? AND StatusCode = 'active' GROUP BY LoanID LIMIT 1";
		$query = $this->db->query($sql, [$post["LoanID"]])->row_array();

		$dataUpdated["LoanAmount"] = $query["TotalAmount"];
		$this->db->where("LoanID", $post["LoanID"]);
		$this->db->update("mj_loan", $dataUpdated);
		
		return true;
	}
}
