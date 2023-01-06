<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Morder extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_invoice($OrderBookID, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){
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

	public function list_order($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'a.ContractDate';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$sqlwhere = ($pSearch["keySearch"] != '') ? " AND a.ContractNumber = '".$pSearch["keySearch"]."'" : "";
		$sqlwhere .= ($pSearch["StartDate"] != '') ? " AND a.ContractDate >= '".date("Y-m-d", strtotime($pSearch["StartDate"]))."'" : "";
		$sqlwhere .= ($pSearch["EndDate"] != '') ? " AND a.ContractDate <= '".date("Y-m-d", strtotime($pSearch["EndDate"]))."'" : "";
		$sqlwhere .= ($pSearch["CustomerID"] != '') ? " AND a.CustomerID = '".$pSearch["CustomerID"]."'" : "";

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				a.OrderBookID,
				`a`.`CustomerID`,
				`a`.`ContractNumber`,
				DATE_FORMAT(`a`.`ContractDate`, '%d %M %Y') ContractDate,
				`a`.`Description`,
				`a`.`ProjectID`,
				`a`.`DeptID`,
				`d`.`DeptName`,
				`a`.`PeopleID`,
				`a`.`ContractAmount`,
				`a`.`PPN`,
				`a`.`ContractAmountPPN`,
				CONCAT(
					'Rp ',
				FORMAT( a.TotalContactAmount, 2, 'en_US' )) TotalContactAmount,
				`b`.`CustomerName`,
				`c`.`ProjectName`,
				CONCAT('Rp ', FORMAT(IFNULL(paid.Total, 0), 2)) TotalPaid,
				CONCAT('Rp ', FORMAT(IFNULL(unpaid.Total, 0), 2)) TotalUnpaid
			FROM
				`mj_order_book` `a`
				LEFT JOIN `mj_customer` `b` ON `b`.`CustomerID` = `a`.`CustomerID`
				LEFT JOIN `mj_project` `c` ON `c`.`OrderBookID` = `a`.`OrderBookID`
				LEFT JOIN mj_department d on d.DeptID = a.DeptID
				LEFT JOIN (
					SELECT
						a.ContractNumber
						, SUM(InvoiceTotal) Total
					FROM
						mj_invoice a
					WHERE
						a.StatusCode = 'active'
					AND
						a.Paid IS NOT NULL
					GROUP BY
						a.ContractNumber
				) paid on paid.ContractNumber = a.OrderBookID
				LEFT JOIN (
					SELECT
						a.ContractNumber
						, SUM(InvoiceTotal) Total
					FROM
						mj_invoice a
					WHERE
						a.StatusCode = 'active'
					AND
						a.Paid IS NULL
					GROUP BY
						a.ContractNumber
				) unpaid on unpaid.ContractNumber = a.OrderBookID
			WHERE
				`a`.`StatusCode` = 'active'
				$sqlwhere
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

	public function list_import_failed($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

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

	public function list_order_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'OrderBookID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("ContractNumber", $pSearch["keySearch"]): "";
		($pSearch["StartDate"] != '') ? $this->db->where("a.ContractDate => ", date("Y-m-d", strtotime($pSearch["StartDate"]))): "";
		($pSearch["EndDate"] != '') ? $this->db->where("a.ContractDate <= ", date("Y-m-d", strtotime($pSearch["EndDate"]))): "";
		($pSearch["CustomerID"] != '') ? $this->db->where("a.CustomerID", $pSearch["CustomerID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_customer b", " b.CustomerID = a.CustomerID", "left");
		$this->db->join("mj_project c", " c.ProjectID = a.ProjectID", "left");
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

    public function insert_order($post)
    {
		$ProjectName = $post["Project"];
		$OrderBookID = getUUID();
		$post["OrderBookID"] = $OrderBookID;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"]	 = $_SESSION["user_id"];

        unset($post["OpsiDisplay"]);
        unset($post["Project"]);

		$post["ContractAmount"] = str_replace(",","",$post["ContractAmount"]);
		$post["ContractAmountPPN"] = str_replace(",","",$post["ContractAmountPPN"]);
		$post["TotalContactAmount"] = str_replace(",","",$post["TotalContactAmount"]);		
		$post["Qty"] = str_replace(",","",$post["Qty"]);	
		
		$insert = $this->db->insert("mj_order_book", $post);

		if($insert){
			$ProjectID = getUUID();
			$postProject["ProjectID"] = $ProjectID;
			$postProject["OrderBookID"] = $OrderBookID;
			$postProject["ProjectName"]	= $ProjectName;
			$postProject["CreatedDate"] = date("Y-m-d H:i:s");
			$postProject["CreatedBy"]	= $_SESSION["user_id"];
			$insert = $this->db->insert("mj_project", $postProject);

			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["OrderBookID"] = $OrderBookID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_order($post)
    {
		$ProjectName = $post["Project"];
		$OrderBookID = $post["OrderBookID"];
        unset($post["OpsiDisplay"]);
        unset($post["OrderBookID"]);
        unset($post["Project"]);

		$post["ContractAmount"] = str_replace(",","",$post["ContractAmount"]);
		$post["ContractAmountPPN"] = str_replace(",","",$post["ContractAmountPPN"]);
		$post["TotalContactAmount"] = str_replace(",","",$post["TotalContactAmount"]);
		
		$this->db->where("OrderBookID", $OrderBookID);
		$insert = $this->db->update("mj_order_book", $post);

		if($insert){
			$sql = "SELECT * FROM mj_project WHERE OrderBookID = ? ";
			$query = $this->db->query($sql, array($OrderBookID));

			if($query->num_rows() > 0){
				$postProject["ProjectName"]	= $ProjectName;
				$postProject["UpdatedDate"] = date("Y-m-d H:i:s");
				$postProject["UpdatedBy"]	= $_SESSION["user_id"];
				$this->db->where("OrderBookID", $OrderBookID);
				$insert = $this->db->update("mj_project", $postProject);
			}else{
				$postProject["ProjectName"]	= $ProjectName;
				$postProject["OrderBookID"] = $OrderBookID;
				$insert = $this->db->insert("mj_project", $postProject);
			}
			
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["OrderBookID"] = $OrderBookID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_order_book($OrderBookID){
		$this->db->where("a.OrderBookID", $OrderBookID);
		$this->db->join("mj_project b", " b.OrderBookID = a.OrderBookID", "left");
		$this->db->select('a.OrderBookID,
			a.CustomerID,
			a.ContractNumber,
			a.JONumber,
			a.ContractDate,
			a.Description,
			b.ProjectName Project,
			a.DeptID,
			a.PeopleID,
			a.ContractAmount,
			a.PPN,
			a.Qty,
			a.ContractAmountPPN,
			a.TotalContactAmount,
		');
		$query = $this->db->get('mj_order_book a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CekEksisOrderBook($field, $id, $OrderBookID){
		($OrderBookID != "") ? $this->db->where("a.OrderBookID <> ", $OrderBookID) : "";
		$this->db->where($field, $id);
		$this->db->join("mj_project b", " b.OrderBookID = a.OrderBookID", "left");
		$this->db->select('a.OrderBookID,
			a.CustomerID,
			a.ContractNumber,
			a.ContractDate,
			a.Description,
			b.ProjectName Project,
			a.DeptID,
			a.PeopleID,
			a.ContractAmount,
			a.PPN,
			a.ContractAmountPPN,
			a.TotalContactAmount,
		');
		$query = $this->db->get('mj_order_book a');

		$return["exist"] = 0;
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

	public function getCustomerID($CustomerName){
		$sql 	= "SELECT CustomerID FROM mj_customer WHERE CustomerName = ?";
		$query	= $this->db->query($sql, array($CustomerName));

		if($query->num_rows()>0){
			$row = $query->row_array();
			return $row["CustomerID"];
		}else{
			return false;
		}
	}

	public function getDeptID($DeptName){
		$sql 	= "SELECT DeptID FROM mj_department WHERE DeptName = ?";
		$query	= $this->db->query($sql, array($DeptName));

		if($query->num_rows()>0){
			$row = $query->row_array();
			return $row["DeptID"];
		}else{
			return false;
		}
	}

	public function getPeopleID($EmployeeName){
		$sql 	= "SELECT people_id FROM mj_people WHERE people_name = ?";
		$query	= $this->db->query($sql, array($EmployeeName));

		if($query->num_rows()>0){
			$row = $query->row_array();
			return $row["people_id"];
		}else{
			return false;
		}
	}

	public function CheckExistContractNumber($ContractNumber){
		$sql 	= "SELECT ContractNumber FROM mj_order_book WHERE ContractNumber = ?";
		$query	= $this->db->query($sql, array($ContractNumber));

		if($query->num_rows()>0){
			return true;
		}else{
			return false;
		}
	}
}
