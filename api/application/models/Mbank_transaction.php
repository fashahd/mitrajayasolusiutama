<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mbank_transaction extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_bank_transaction($pSearch){

		$month 	= ($pSearch["Month"] != '') ? $pSearch["Month"] : date("m");
		$year 	= ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");


		$this->db->where("MONTH(a.DateTransaction)", $month);
		$this->db->where("YEAR(a.DateTransaction)", $year);
		$this->db->where("a.StatusCode", "active");
		$this->db->order_by('a.DateTransaction', 'ASC');
		$this->db->order_by('a.BankTransactionID', 'ASC');
		$this->db->join("ref_bank_project b", " b.RefBankID = a.ProjectID", "left");
		$this->db->join("mj_component c", " c.ComponentID = a.CostElement", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.BankTransactionID', false);
		$this->db->select('
			c.Code CostElement
			, a.DateTransaction
			, a.CheckingAccount
			, a.NoVoucher
			, a.ProjectID
			, a.CostElement CostElementID
			, a.TransactionType
			, a.TransactionAmountCredit TransactionAmountCreditVal
			, a.TransactionAmountCredit
			, a.TransactionAmountDebit TransactionAmountDebitVal
			, a.TransactionAmountDebit
			, b.RefBankName Project
			, a.Description
		');
		$query = $this->db->get('mj_bank_transaction a');

		$data = $query->result_array();

		if($query->num_rows()>0){

			$balance = 0;

			foreach($data as $key => $row){
				if($data[$key]["TransactionType"] == "debit"){
					$balance += $data[$key]["TransactionAmountDebit"];
				}

				
				if($data[$key]["TransactionType"] == "credit"){
					$balance -= $data[$key]["TransactionAmountCredit"];
				}

				$data[$key]["TransactionAmountCredit"] = ($data[$key]["TransactionAmountCredit"] != "") ? "Rp ".number_format($row["TransactionAmountCredit"]) : "";
				$data[$key]["TransactionAmountDebit"] = ($data[$key]["TransactionAmountDebit"] != "") ? "Rp ".number_format($row["TransactionAmountDebit"]) : "";
				$data[$key]["Balance"] = "Rp ".number_format($balance);
			}
		}
        // $result['sql'] = $this->db->last_query();
        $result['data'] = $data;
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

        $query = $this->db->query('SELECT FOUND_ROWS() AS total');
        $result['total'] = $query->row()->total;

        $_SESSION['informationGrid'] = '
            <div class="Sfr_BoxInfoDataGrid_Title"><strong>' . number_format($query->row()->total, 0, ".", ",") . '</strong> ' . 'Data' . '</div>';

        return $result;
	}

	public function list_bank_transaction_excel($pSearch){

		$month 	= ($pSearch["Month"] != '') ? $pSearch["Month"] : date("m");
		$year 	= ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");


		$this->db->where("MONTH(a.DateTransaction)", $month);
		$this->db->where("YEAR(a.DateTransaction)", $year);
		$this->db->where("a.StatusCode", "active");
		$this->db->order_by('a.DateTransaction', 'ASC');
		$this->db->order_by('a.BankTransactionID', 'ASC');
		$this->db->join("ref_bank_project b", " b.RefBankID = a.ProjectID", "left");
		$this->db->join("mj_component c", " c.ComponentID = a.CostElement", "left");
		$this->db->select('
			c.Code AS "Cost Element"
			, a.DateTransaction AS "Date"
			, a.CheckingAccount AS "Checking Account"
			, a.NoVoucher AS "No Voucher"
			, a.TransactionType
			, a.TransactionAmountCredit AS "Credit"
			, a.TransactionAmountDebit AS "Debit"
			, b.RefBankName Project
			, a.Description
		');
		$query = $this->db->get('mj_bank_transaction a');

		$data = $query->result_array();

		if($query->num_rows()>0){

			$balance = 0;

			foreach($data as $key => $row){
				if($data[$key]["TransactionType"] == "debit"){
					$balance += $data[$key]["Debit"];
				}

				
				if($data[$key]["TransactionType"] == "credit"){
					$balance -= $data[$key]["Credit"];
				}

				$data[$key]["Credit"] = ($data[$key]["Credit"] != "") ? "Rp ".number_format($row["Credit"]) : "";
				$data[$key]["Debit"] = ($data[$key]["Debit"] != "") ? "Rp ".number_format($row["Debit"]) : "";
				$data[$key]["Balance"] = "Rp ".number_format($balance);
			}
		}
        // $result['sql'] = $this->db->last_query();
        $result['data'] = $data;
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

        $query = $this->db->query('SELECT FOUND_ROWS() AS total');
        $result['total'] = $query->row()->total;

        $_SESSION['informationGrid'] = '
            <div class="Sfr_BoxInfoDataGrid_Title"><strong>' . number_format($query->row()->total, 0, ".", ",") . '</strong> ' . 'Data' . '</div>';

        return $result;
	}

    public function insert_bank_transaction($post)
    {
		$BankTransactionID = getUUID();
		$post["BankTransactionID"] = $BankTransactionID;

		if($post["TransactionType"] == "debit"){
			$post["TransactionAmountDebit"] = $post["TransactionAmount"];
		}else{
			$post["TransactionAmountCredit"] = $post["TransactionAmount"];
		}

		unset($post["TransactionAmount"]);
		
		
		$insert = $this->db->insert("mj_bank_transaction", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["BankTransactionID"] = $BankTransactionID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_bank_transaction($post)
    {
		$BankTransactionID = $post["BankTransactionID"];

		if($post["TransactionType"] == "debit"){
			$post["TransactionAmountDebit"] = $post["TransactionAmount"];
		}else{
			$post["TransactionAmountCredit"] = $post["TransactionAmount"];
		}

		unset($post["BankTransactionID"]);
		unset($post["TransactionAmount"]);
		
		$this->db->where("BankTransactionID", $BankTransactionID);
		$update = $this->db->update("mj_bank_transaction", $post);

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["BankTransactionID"] = $BankTransactionID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	function CheckExistCostelement($Constelement){
		$sql 	= "SELECT ComponentID FROM mj_component WHERE Code = ?";
		$query	= $this->db->query($sql, array($Constelement))->row_array();

		return $query["ComponentID"];
	}

	function CheckExistProjectID($Project){
		$sql 	= "SELECT RefBankID FROM ref_bank_project WHERE RefBankName = ?";
		$query	= $this->db->query($sql, array($Project))->row_array();

		return $query["RefBankID"];
	}

	public function list_import_failed($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'a.DateTransaction';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				a.BankTransactionID,
				a.DateTransaction,
				a.CheckingAccount,
				a.NoVoucher,
				a.CostElement,
				a.TransactionType,
				a.TransactionAmountDebit,
				a.TransactionAmountCredit,
				a.ProjectID,
				a.Description,
				a.ErrorMessages
			FROM
				`mj_bank_transaction_tmp` `a`
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
