<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mproject extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function list_project($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'mc.CustomerName';
		if ($sortingDir == "") $sortingDir = 'DESC';

		$sqlwhere = ($pSearch["keySearch"] != '') ? " AND mpn.ProjectName like '%" . $pSearch["keySearch"] . "%'" : "";
		$sqlwhere .= ($pSearch["CustomerID"] != '') ? " AND mpn.CustomerID = '" . $pSearch["CustomerID"] . "'" : "";

		$sql = "SELECT SQL_CALC_FOUND_ROWS
					mpn.ProjectID
					, mpn.ProjectName
					, mc.CustomerName
					, COUNT(mob.OrderBookID) TotalPO
					, SUM(mi.TotalInvoice) TotalInvoice
				FROM
					`mj_project_new` mpn
				LEFT JOIN
					mj_customer mc on mc.CustomerID = mpn.CustomerID
				LEFT JOIN
					mj_order_book mob on mob.ProjectID = mpn.ProjectID
				LEFT JOIN
					(
						SELECT COUNT(InvoiceID) TotalInvoice, ContractNumber FROM mj_invoice GROUP BY ContractNumber
					) mi on mi.ContractNumber = mob.OrderBookID
				WHERE
					mpn.StatusCode = 'active'
					$sqlwhere
				GROUP BY
					mpn.ProjectID
			ORDER BY
				$sortingField $sortingDir 
		LIMIT $start, $limit";
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

		$_SESSION['informationGrid'] = '
            <div class="Sfr_BoxInfoDataGrid_Title"><strong>' . number_format($query->row()->total, 0, ".", ",") . '</strong> ' . 'Data' . '</div>
            <ul class="Sft_UlListInfoDataGrid">
                <li class="Sft_ListInfoDataGrid">
                    <img class="Sft_ListIconInfoDataGrid" src="' . base_url() . 'assets/icons/font-awesome/svgs/solid/arrow-up-wide-short.svg" width="20" />&nbsp;&nbsp;Sorted by ' . $sortingField . ' ' . $sortingInfo . '
                </li>
            </ul>';

		return $result;
	}

	public function list_invoice($OrderBookID, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{
		$sql = "SELECT SQL_CALC_FOUND_ROWS
			a.InvoiceID
			, a.InvoiceNumber
			, DATE_FORMAT(`a`.`DueDate`, '%d %M %Y') DueDate
			, CONCAT('Rp ', FORMAT(a.InvoiceTotal,2)) Amount
			, IF(a.Paid != '', 'Paid', 'Unpaid') Status
		FROM
			`mj_invoice` a 
		WHERE
			a.ContractNumber = ?
		ORDER BY a.DueDate DESC";

		$query = $this->db->query($sql, array($OrderBookID));

		$data = $query->result_array();
		$result['sql'] = $this->db->last_query();
		$result['data'] = $data;
		// echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

		$query = $this->db->query('SELECT FOUND_ROWS() AS total');
		$result['total'] = $query->row()->total;

		return $result;
	}

	public function list_import_failed($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'a.ContractDate';
		if ($sortingDir == "") $sortingDir = 'DESC';

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				a.OrderBookID,
				`a`.`CustomerID` CustomerName,
				`a`.`ContractNumber`,
				DATE_FORMAT(`a`.`ContractDate`, '%d %M %Y') ContractDate,
				`a`.`Description`,
				`a`.`ProjectID` ProjectName,
				`a`.`DeptID` DeptName,
				`a`.`PeopleID`,
				`a`.`ContractAmount`,
				`a`.`PPN`,
				`a`.`ContractAmountPPN`,
				`a`.`ErrorMessages`,
				CONCAT(
					'Rp ',
				FORMAT( a.TotalContactAmount, 2, 'en_US' )) TotalContactAmount
			FROM
				`mj_order_book_tmp` `a`
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

	public function list_order_excel($pSearch, $sortingField, $sortingDir)
	{

		if ($sortingField == "") $sortingField = 'OrderBookID';
		if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("ContractNumber", $pSearch["keySearch"]) : "";
		($pSearch["StartDate"] != '') ? $this->db->where("a.ContractDate => ", date("Y-m-d", strtotime($pSearch["StartDate"]))) : "";
		($pSearch["EndDate"] != '') ? $this->db->where("a.ContractDate <= ", date("Y-m-d", strtotime($pSearch["EndDate"]))) : "";
		($pSearch["CustomerID"] != '') ? $this->db->where("a.CustomerID", $pSearch["CustomerID"]) : "";

		$this->db->where("a.StatusCode", "active");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_customer b", " b.CustomerID = a.CustomerID", "left");
		$this->db->join("mj_project_new c", " c.ProjectID = a.ProjectID", "left");
		$this->db->join("mj_department d", " d.DeptID = a.DeptID", "left");
		$this->db->join("mj_people e", " e.people_id = a.PeopleID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.OrderBookID', false);
		$this->db->select('
			b.CustomerName AS "Customer",
			a.ContractDate AS "PO Date",
			a.ContractNumber AS "PO Number",
			a.Description,
			c.ProjectName AS "Project Name",
			d.DeptName AS "Dept",
			e.people_name AS "PJ",
			CONCAT("Rp ",FORMAT(a.ContractAmount,2,"en_US")) AS "PO (Excld. PPN)",
			CONCAT("Rp ",FORMAT(a.ContractAmountPPN,2,"en_US")) AS "PPN",
			CONCAT("Rp ",FORMAT(a.TotalContactAmount,2,"en_US")) AS "PO (Incld. PPN)"
		');
		$query = $this->db->get('mj_order_book a');

		$data = $query->result_array();

		return $data;
	}

	public function insert_project($post)
	{
		$ProjectName = $post["Project"];
		$ProjectID = getUUID();
		$post["ProjectID"] = $ProjectID;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		$post["StatusCode"] = "active";

		unset($post["OpsiDisplay"]);

		$insert = $this->db->insert("mj_project_new", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ProjectID"] = $ProjectID;
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_project($post)
	{
		$ProjectID = $post["ProjectID"];
		unset($post["OpsiDisplay"]);
		unset($post["ProjectID"]);

		$this->db->where("ProjectID", $ProjectID);
		$update = $this->db->update("mj_project_new", $post);

		if ($update) {

			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ProjectID"] = $ProjectID;
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function form_project($ProjectID)
	{
		$this->db->where("a.ProjectID", $ProjectID);
		$this->db->select('a.ProjectID,
			a.CustomerID,
			a.ProjectName
		');
		$query = $this->db->get('mj_project_new a')->row_array();

		$result = array();
		foreach ($query as $row => $value) {
			$result["MitraJaya.view.Project.MainForm-FormBasicData-" . $row] = $value;
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}
}
