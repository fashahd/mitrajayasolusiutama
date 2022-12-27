<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mvendorpayment extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_payment($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'a. PaymentID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("a.DocumentNo", $pSearch["keySearch"]): "";
		($pSearch["VendorID"] != '') ? $this->db->where("a.MitraName", $pSearch["VendorID"]): "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.PaymentID");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_order_book d", " d.OrderBookID = a.ProjectID", "left");
		$this->db->join("mj_project b", " b.OrderBookID = d.OrderBookID", "left");
		$this->db->join("mj_vendor c", " c.VendorID = a.MitraName", "left");
		// $this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.PaymentID', false);
		$this->db->select('
			a.PaymentID,
			a.DocumentNo,
			a.ProjectID,
			a.MitraName,
			a.Description,
			a.InvoiceComplete,
			a.DueDate,
			a.PeriodMonth,
			a.PeriodYear,
			a.Contract,
            CONCAT("Rp ",FORMAT(a.Contract,2,"en_US")) Contract,
            a.Amount,
            CONCAT("Rp ",FORMAT(a.Amount,2,"en_US")) Amount,
            CONCAT("Rp ",FORMAT(a.Outstanding,2,"en_US")) Outstanding,
            a.Insurance,
            CONCAT("Rp ",FORMAT(a.Insurance,2,"en_US")) Insurance,
			a.PPH23Option,
            a.Contract,
            CONCAT("Rp ",FORMAT(a.PPHValue,2,"en_US")) PPHValue,
            a.CashbonAmount,
            CONCAT("Rp ",FORMAT(a.CashbonAmount,2,"en_US")) CashbonAmount,
			a.SIOK3Name,
            a.SIOK3Amount,
            CONCAT("Rp ",FORMAT(a.SIOK3Amount,2,"en_US")) SIOK3Amount,
			CONCAT(d.ContractNumber, " - ", b.ProjectName) ProjectName,
			c.VendorName,
			a.PaidDate,
			IF(a.PaidDate != "", "Paid", "Open") PaidStatus
		');
		$query = $this->db->get('mj_vendorpayment a');

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

    public function list_payment_vendor($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'PaymentID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["PaymentID"] != '') ? $this->db->where("PaymentID", $pSearch["PaymentID"]): "";

		$this->db->where("StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->select('SQL_CALC_FOUND_ROWS VendorPaymentID', false);
		$this->db->select('
            PaymentID,
			VendorPaymentAmount,
            CONCAT("Rp ",FORMAT(VendorPaymentAmount,2,"en_US")) VendorPaymentAmount,
			VendorPaymentDate,
			DocumentNo,
			VendorPaymentDescription
		');
		$query = $this->db->get('mj_vendorpayment_pay');

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

	public function list_payment_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'PaymentID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("a.DocumentNo", $pSearch["keySearch"]): "";
		($pSearch["VendorID"] != '') ? $this->db->where("a.MitraName", $pSearch["VendorID"]): "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.PaymentID");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_order_book d", " d.OrderBookID = a.ProjectID", "left");
		$this->db->join("mj_project b", " b.OrderBookID = d.OrderBookID", "left");
		$this->db->join("mj_vendor c", " c.VendorID = a.MitraName", "left");
		$this->db->select('
			a.DocumentNo as "Doc Number",
			d.ContractNumber AS "PO Number",
			b.ProjectName AS "Project",
			c.VendorName AS "Vendor/Subcont",
			a.Description,
			a.InvoiceComplete AS "Invoice Date",
			a.DueDate,
            CONCAT("Rp ",FORMAT(a.Amount,2,"en_US")) Amount,
            CONCAT("Rp ",FORMAT(a.Insurance,2,"en_US")) Insurance,
			CONCAT(a.PPH23Option,"%") PPH,
            CONCAT("Rp ",FORMAT(a.PPHValue,2,"en_US")) AS "PPH Amount",
            a.CashbonDocumentNumber AS "Doc Number",
            CONCAT("Rp ",FORMAT(a.CashbonAmount,2,"en_US")) AS "Cashbon Amount",
			a.SIOK3Name,
            CONCAT("Rp ",FORMAT(a.SIOK3Amount,2,"en_US")) AS "SIOK3 Amount",
            CONCAT("Rp ",FORMAT(a.Outstanding,2,"en_US")) Outstanding,
            IF(a.PaidDate !="", "Paid", "Open") Status,
            CONCAT("Rp ",FORMAT(a.PaidAmount,2,"en_US")) Paid
		');
		$query = $this->db->get('mj_vendorpayment a');

		$data = $query->result_array();

        return $data;
	}

    public function insert_payment($post)
    {
        unset($post["OpsiDisplay"]);
        unset($post["Outstanding"]);
		$PaymentID = getUUID();
		$post["PaymentID"] = $PaymentID;
		$post['MitraName'] = ($post["Type"] == "vendor") ? $post["MitraNameVendor"] : $post["MitraNameSubcont"];
		
        unset($post["MitraNameVendor"]);
        unset($post["MitraNameSubcont"]);
		
		$insert = $this->db->insert("mj_vendorpayment", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["PaymentID"] = $PaymentID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function insert_payment_vendor($post)
    {
        unset($post["OpsiDisplay"]);
		$VendorPaymentID = getUUID();
		$post["VendorPaymentID"] = $VendorPaymentID;
		
		$insert = $this->db->insert("mj_vendorpayment_pay", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["VendorPaymentID"] = $VendorPaymentID;
			$response["PaymentID"] = $post['PaymentID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_payment($post)
    {
		$PaymentID = $post["PaymentID"];
        unset($post["OpsiDisplay"]);
        unset($post["PaymentID"]);
		$post['MitraName'] 			= ($post["Type"] == "vendor") ? $post["MitraNameVendor"] : $post["MitraNameSubcont"];
		
        unset($post["MitraNameVendor"]);
        unset($post["MitraNameSubcont"]);
		
		$this->db->where("PaymentID", $PaymentID);
		$insert = $this->db->update("mj_vendorpayment", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["PaymentID"] = $PaymentID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function update_payment_vendor($post)
    {
		$VendorPaymentID = $post["VendorPaymentID"];
        unset($post["OpsiDisplay"]);
        unset($post["VendorPaymentID"]);

        $param['DocumentNo'] = $post['DocumentNo'];
        $param['VendorPaymentAmount'] = $post['VendorPaymentAmount'];
        $param['VendorPaymentDate'] = $post['VendorPaymentDate'];
        $param['VendorPaymentDescription'] = $post['VendorPaymentDescription'];
		
		$this->db->where("VendorPaymentID", $VendorPaymentID);
		$insert = $this->db->update("mj_vendorpayment_pay", $param);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["VendorPaymentID"] = $VendorPaymentID;
			$response["PaymentID"] = $post['PaymentID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_payment($PaymentID){

        $this->db->where("a.StatusCode", "active");
        $this->db->where("a.PaymentID", $PaymentID);
        $this->db->join("mj_vendorpayment_pay b", " b.PaymentID = a.PaymentID and b.StatusCode = 'active'", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.PaymentID', false);
		$this->db->select('a.PaymentID,
			a.DocumentNo,
			a.ProjectID,
			a.MitraName AS MitraNameVendor,
			a.MitraName AS MitraNameSubcont,
			a.Description,
			a.Type,
			a.InvoiceComplete,
			a.DueDate,
			a.PeriodMonth,
			a.PeriodYear,
			a.Contract,
			a.Amount,
			a.Insurance,
			a.PPH23Option,
			a.PPHValue,
			a.CashbonDocumentNumber,
			a.CashbonAmount,
			a.SIOK3Name,
			a.SIOK3Amount,
            a.Outstanding,
			a.PaidDate,
			a.PaidAmount
		');
		$query = $this->db->get('mj_vendorpayment a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

    public function form_payment_vendor($VendorPaymentID){
		$this->db->where("VendorPaymentID", $VendorPaymentID);
		$this->db->select('VendorPaymentID,
			PaymentID,
			DocumentNo,
			VendorPaymentAmount,
			VendorPaymentDate,
			VendorPaymentDescription
		');
		$query = $this->db->get('mj_vendorpayment_pay')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CheckDocNo($field, $id, $VendorPaymentID){
		($VendorPaymentID != "") ? $this->db->where("VendorPaymentID <> ", $VendorPaymentID) : "";
		$this->db->where($field, $id);
		$this->db->select('VendorPaymentID,
			PaymentID,
			DocumentNo,
			VendorPaymentAmount,
			VendorPaymentDate,
			VendorPaymentDescription,
		');
		$query = $this->db->get('mj_vendorpayment_pay');

		$return["exist"] = 0;
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

	

	public function list_import_failed($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'a.InvoiceComplete';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				PaymentID,
				DocumentNo,
				b.ContractNumber ProjectID,
				Type,
				c.VendorName MitraName,
				a.Description,
				InvoiceComplete,
				DueDate,
				PeriodMonth,
				PeriodYear,
				Contract,
				CONCAT(
					'Rp ',
				FORMAT( a.Amount, 2, 'en_US' )) Amount,
				CONCAT(
					'Rp ',
				FORMAT( a.Insurance, 2, 'en_US' )) Insurance,
				CONCAT(PPH23Option, '%') PPH23Option,
				CONCAT(
					'Rp ',
				FORMAT( a.PPHValue, 2, 'en_US' )) PPHValue,
				CashbonDocumentNumber,
				CONCAT(
					'Rp ',
				FORMAT( a.CashbonAmount, 2, 'en_US' )) CashbonAmount,
				SIOK3Name,
				CONCAT(
					'Rp ',
				FORMAT( a.SIOK3Amount, 2, 'en_US' )) SIOK3Amount,
				CONCAT(
					'Rp ',
				FORMAT( a.Outstanding, 2, 'en_US' )) Outstanding,
				PaidDate,
				CONCAT(
					'Rp ',
				FORMAT( a.PaidAmount, 2, 'en_US' )) PaidAmount,
				ErrorMessages
			FROM
				`mj_vendorpayment_temp` `a`
			LEFT JOIN
				mj_order_book b on b.OrderBookID = a.ProjectID
			LEFT JOIN
				mj_vendor c on c.VendorID = a.MitraName
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

	public function checkingDocNoPayment($field, $id, $PaymentID){
		($PaymentID != "") ? $this->db->where("PaymentID <> ", $PaymentID) : "";
		$this->db->where($field, $id);
		$this->db->select('PaymentID,
			DocumentNo,
			ProjectID,
			MitraName,
			Description,
			InvoiceComplete,
			DueDate,
			PeriodMonth,
			PeriodYear,
			Contract,
			Amount,
			Insurance,
		');
		$query = $this->db->get('mj_vendorpayment');

		$return["exist"] = 0;
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

	public function getVendorID($VendorName){
		$sql 	= "SELECT VendorID, VendorType FROM mj_vendor WHERE VendorName = ? LIMIT 1";
		$query	= $this->db->query($sql, array($VendorName))->row_array();

		if($query["VendorID"] != ''){
			return $query;
		}else{
			return false;
		}
	}
}
