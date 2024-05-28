<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Minvoice extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function getMonth($val){
		switch ($val) {
			case '01':
				return "Januari";
				break;
			case '02':
				return "Februari";
				break;
			case '03':
				return "March";
				break;
			case '04':
				return "April";
				break;
			case '05':
				return "May";
				break;
			case '06':
				return "June";
				break;
			case '07':
				return "July";
				break;
			case '08':
				return "August";
				break;
			case '09':
				return "September";
				break;
			case '10':
				return "October";
				break;
			case '11':
				return "November";
				break;
			case '12':
				return "December";
				break;
			default:
			return "";
				break;
		}
	}

	public function list_invoice_notif($pSearch){
		$sql = "SELECT
			InvoiceNumber
			, b.CustomerName
			, a.InvoiceTotal
			, CONCAT('Rp ',FORMAT(a.InvoiceTotal,2,'en_US')) InvoiceTotal
			, a.DueDate
			, DATE_FORMAT(a.DueDate, '%d %M %Y') DueDate  
		FROM
			mj_invoice a
		JOIN
			mj_customer b on b.CustomerID = a.CustomerID
		WHERE
			a.StatusCode = 'active'
		AND
			a.DueDate >= DATE(NOW())
		AND
			a.DueDate <= DATE(NOW() + INTERVAL 7 DAY)
		AND
			a.Paid IS NULL LIMIT ".$pSearch["start"].",".$pSearch["limit"];
		$query = $this->db->query($sql);

		$data["total"] = $query->num_rows();
		$data["data"]	= $query->result_array();


		return $data;
	}

	public function list_invoice($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'InvoiceID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->where("InvoiceNumber", $pSearch["keySearch"])->or_where("c.ContractNumber", $pSearch["keySearch"]) : "";
		($pSearch["CustomerID"] != '') ? $this->db->where("b.CustomerID", $pSearch["CustomerID"]): "";
		($pSearch["Month"] != '') ? $this->db->where("a.InvoicePeriodMonth", $pSearch["Month"]): "";
		($pSearch["Year"] != '') ? $this->db->where("a.InvoicePeriodYear", $pSearch["Year"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_order_book c", " c.OrderBookID = a.ContractNumber", "left");
		$this->db->join("mj_customer b", " b.CustomerID = a.CustomerID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.InvoiceID', false);
		$this->db->select('
			a.InvoiceNumber,
			a.InvoicePeriodMonth,
			a.InvoicePeriodYear,
			a.CustomerID,
			c.ContractNumber,
			a.TaxNumber,
			a.Description,
			a.InvoiceAmount,
			CONCAT("Rp ",FORMAT(a.InvoiceAmount,2,"en_US")) InvoiceAmount,
			a.InvoiceVAT,
			CONCAT("Rp ",FORMAT(a.InvoiceVAT,2,"en_US")) InvoiceVAT,
			a.VATPercent,
			a.InvoiceTotal,
			CONCAT("Rp ",FORMAT(a.InvoiceTotal,2,"en_US")) InvoiceTotal,
			a.InvoiceGR,
			a.InvoiceReceived,
			a.VendorInvoiceNumber,
			a.VendorTaxNumber,
			a.DueDatePeriod,
			a.DueDate,
			a.Paid,
			a.PPH23Option,
			a.PPH23Value,
			CONCAT("Rp ",FORMAT(a.PPH23Value,2,"en_US")) PPH23Value,
			a.GrossIncome,
			CONCAT("Rp ",FORMAT(a.GrossIncome,2,"en_US")) GrossIncome,
			a.NettIncome,
			CONCAT("Rp ",FORMAT(a.NettIncome,2,"en_US")) NettIncome,
			b.CustomerName
		');
		$query = $this->db->get('mj_invoice a');

		$data = $query->result_array();
		if($query->num_rows()>0){
			foreach($data as $k => $row){
				foreach($row as $key => $val){
					if($key == "InvoicePeriodMonth"){
						$month = $this->getMonth($val);
						$data[$k][$key] = $month;
					}
				}
			}
		}
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

	public function list_invoice_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'InvoiceID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("InvoiceNumber", $pSearch["keySearch"]): "";
		($pSearch["StartDate"] != '') ? $this->db->where("a.ContractDate >", date("Y-m-d", strtotime($pSearch["StartDate"]))): "";
		($pSearch["EndDate"] != '') ? $this->db->where("a.ContractDate <", date("Y-m-d", strtotime($pSearch["EndDate"]))): "";
		($pSearch["CustomerID"] != '') ? $this->db->where("a.CustomerID", $pSearch["CustomerID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_customer b", " b.CustomerID = a.CustomerID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.InvoiceNumber', false);
		$this->db->select('
			a.InvoicePeriodMonth,
			a.InvoicePeriodYear,
			b.CustomerName,
			a.ContractNumber,
			a.TaxNumber,
			a.Description,
			a.InvoiceAmount,
			CONCAT("Rp ",FORMAT(a.InvoiceAmount,2,"en_US")) InvoiceAmount,
			a.InvoiceVAT,
			CONCAT("Rp ",FORMAT(a.InvoiceVAT,2,"en_US")) InvoiceVAT,
			a.VATPercent,
			a.InvoiceTotal,
			CONCAT("Rp ",FORMAT(a.InvoiceTotal,2,"en_US")) InvoiceTotal,
			a.InvoiceGR,
			a.InvoiceReceived,
			a.VendorInvoiceNumber,
			a.VendorTaxNumber,
			a.DueDatePeriod,
			a.DueDate,
			a.Paid,
			a.PPH23Option,
			a.PPH23Value,
			CONCAT("Rp ",FORMAT(a.PPH23Value,2,"en_US")) PPH23Value,
			a.GrossIncome,
			CONCAT("Rp ",FORMAT(a.GrossIncome,2,"en_US")) GrossIncome,
			a.NettIncome,
			CONCAT("Rp ",FORMAT(a.NettIncome,2,"en_US")) NettIncome
		');
		$query = $this->db->get('mj_invoice a');

		$data = $query->result_array();

        return $data;
	}

    public function insert_invoice($post)
    {
        unset($post["OpsiDisplay"]);
        unset($post["people_name"]);
		$InvoiceID = getUUID();
		$post["InvoiceID"] = $InvoiceID;
		
		
		$insert = $this->db->insert("mj_invoice", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["InvoiceID"] = $InvoiceID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_invoice($post)
    {
		$InvoiceID = $post["InvoiceID"];
        unset($post["OpsiDisplay"]);
        unset($post["InvoiceID"]);
		unset($post["people_name"]);
		
		$this->db->where("InvoiceID", $InvoiceID);
		$insert = $this->db->update("mj_invoice", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["InvoiceID"] = $InvoiceID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	function form_invoice_historical($InvoiceID, $ContractNumber){
		$sql = "SELECT
			InvoicePeriodMonth,
			InvoicePeriodYear,
			InvoiceGR,
			InvoiceReceived
		FROM
			mj_invoice 
		WHERE
			InvoiceID = ?
		LIMIT 1";
		$query = $this->db->query($sql, array($InvoiceID))->row_array();

		$sql = "SELECT
			a.ContractNumber
			, a.Description
			, a.InvoiceAmount
			, b.ContractAmount
		FROM
			mj_invoice a
		JOIN
			mj_order_book b on b.OrderBookID = a.ContractNumber
		WHERE
			a.ContractNumber = ?
		AND
			a.InvoiceID != ?
		AND
			(a.InvoiceGR <= ? OR a.InvoiceReceived <= ?)
		AND
			a.StatusCode = 'active'
		ORDER BY a.InvoiceGR, a.CreatedDate ASC";
		
		$query = $this->db->query($sql, array($ContractNumber, $InvoiceID, $query["InvoiceGR"], $query["InvoiceReceived"]));

		// echo "<pre>";print_r($this->db->last_query());die;


        $return["success"]  = true;
        $return["data"]     = $query->result_array();

        return $return;

	}

	public function form_invoice($InvoiceID){

		$this->db->where("a.InvoiceID", $InvoiceID);
		$this->db->join("mj_order_book b", " (b.ContractNumber = a.ContractNumber OR b.OrderBookID = a.ContractNumber)", "left");
		$this->db->join("mj_project_new d", " d.OrderBookID = b.OrderBookID", "left");
		$this->db->join("mj_people c", " c.people_id = b.PeopleID", "left");
		$this->db->join("mj_customer e", " e.CustomerID = a.CustomerID", "left");
		$this->db->select('a.InvoiceID,
			a.InvoiceNumber,
			a.InvoicePeriodMonth,
			a.InvoicePeriodYear,
			a.CustomerID,
			e.CustomerName,
			e.CustomerAddress,
			a.ContractNumber,
			b.ContractNumber PoNumber,
			d.ProjectName,
			c.people_name,
			b.ContractAmount,
			b.Description PODescription,
			a.TaxNumber,
			a.Description,
			a.InvoiceAmount,
			a.InvoiceVAT,
			a.VATPercent,
			a.InvoiceTotal,
			a.InvoiceGR,
			a.InvoiceReceived,
			a.VendorInvoiceNumber,
			a.VendorTaxNumber, 
			a.DueDatePeriod, 
			a.DueDate, 
			a.Paid, 
			a.PPH23Option, 
			a.PPH23Value, 
			a.GrossIncome, 
			a.NettIncome, 
		');
		$query = $this->db->get('mj_invoice a')->row_array();
		// echo "<pre>";print_r($this->db->last_query());die;

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Finance.Invoice.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CheckInvNo($field, $id, $InvoiceID){
		($InvoiceID != "") ? $this->db->where("InvoiceID <> ", $InvoiceID) : "";
		$this->db->where($field, $id);
		$this->db->select('InvoiceNumber
		');
		$query = $this->db->get('mj_invoice');

		$return["exist"] = 0;
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

	public function CheckExistInvoiceNumber($InvoiceNumber){
		$sql 	= "SELECT InvoiceNumber FROM mj_invoice WHERE InvoiceNumber = ?";
		$query	= $this->db->query($sql, array($InvoiceNumber));

		if($query->num_rows()>0){
			return true;
		}else{
			return false;
		}
	}

	public function getPONumber($PONumber){
		$sql 	= "SELECT OrderBookID, CustomerID FROM mj_order_book WHERE ContractNumber = ?";
		$query	= $this->db->query($sql, array($PONumber));

		if($query->num_rows()>0){
			$row = $query->row_array();
			$data["CustomerID"] 	= $row["CustomerID"];
			$data["OrderBookID"] 	= $row["OrderBookID"];
			return $data;
		}else{
			return false;
		}
	}	

	public function list_import_failed($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'a.InvoiceNumber';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				a.InvoiceNumber
				, a.InvoicePeriodMonth
				, a.InvoicePeriodYear
				, a.CustomerID
				, a.ContractNumber
				, a.TaxNumber
				, a.Description
				, a.InvoiceAmount
				, a.VATPercent
				, a.InvoiceVAT
				, a.InvoiceTotal
				, a.InvoiceGR
				, a.InvoiceReceived
				, a.VendorInvoiceNumber
				, a.VendorTaxNumber
				, a.DueDatePeriod
				, a.DueDate
				, a.Paid
				, a.PPH23Option
				, a.PPH23Value
				, a.GrossIncome
				, a.NettIncome
				, a.ErrorMessages
			FROM
				`mj_invoice_tmp` `a`
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
}
