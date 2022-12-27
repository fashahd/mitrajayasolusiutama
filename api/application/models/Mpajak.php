<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mpajak extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function getInvoiceVAT($Year, $month){

		$sql = "SELECT SUM(InvoiceVAT) InvoiceVAT FROM mj_invoice WHERE StatusCode = 'active' AND InvoicePeriodMonth = ? AND InvoicePeriodYear = ?";
		$query = $this->db->query($sql, array($month, $Year))->row_array();
		
		return $query["InvoiceVAT"];
	}

	public function getInvoiceVATPPNDN($Year, $month){

		$sql = "SELECT SUM(PPHValue) PPHValue FROM `mj_vendorpayment` WHERE PeriodMonth = ? AND PeriodYear = ?";
		$query = $this->db->query($sql, array($month, $Year))->row_array();
		
		return $query["PPHValue"];
	}

	public function getPaidTax($Year, $month){
		$sql = "SELECT PaidAmount, ReportStatus FROM mj_pajak WHERE Month = ? AND Year = ?";
		$query = $this->db->query($sql, array($month, $Year))->row_array();

		if($query){
			$data["PaidAmount"] 	= $query["PaidAmount"];
			$data["ReportStatus"] 	= $query["ReportStatus"];
		}else{
			$data["PaidAmount"] 	= 0;
			$data["ReportStatus"] 	= 0;
		}
		return $data;
	}

	public function list_pajak($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'InvoiceID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$Year = ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");
		
		for ($i_month = 1; $i_month <= 12; $i_month++) { 
			$key = $i_month-1;

			if($i_month < 10){
				$i_month = "0".$i_month;
			}

			$VATAmount 	= $this->getInvoiceVAT($Year, $i_month);
			$TaxData 	= $this->getPaidTax($Year, $i_month);

			$Overpaid 	= $TaxData["PaidAmount"] - $VATAmount;
			
            $arrReturn[$key]['Year'] = $Year;
            $arrReturn[$key]['VATAmount'] = ($VATAmount == '' )  ? 0 : (float) $VATAmount;
            $arrReturn[$key]['PaidAmountVal'] = ($TaxData["PaidAmount"] == '' )  ? 0 : (float) $TaxData["PaidAmount"];
            $arrReturn[$key]['OverpaidVal'] = ($Overpaid < 0 )  ? 0 : (float) $Overpaid;
            $arrReturn[$key]['Amount'] = "Rp ". number_format(($VATAmount == "") ? 0 : $VATAmount, 2);
            $arrReturn[$key]['Month'] = $i_month;
            $arrReturn[$key]['PaidAmount'] 	 = "Rp ". number_format(($TaxData["PaidAmount"] == "") ? 0 : $TaxData["PaidAmount"], 2);
            $arrReturn[$key]['OverPaid'] 	 = "Rp ". number_format(($Overpaid < 0) ? 0 : $Overpaid, 2);
            $arrReturn[$key]['ReportStatus'] = $TaxData["ReportStatus"];
            $arrReturn[$key]['Period'] = $Year." ".date('F', mktime(0,0,0,$i_month));
		}


        // $result['sql'] = $this->db->last_query();
        $result['data'] = $arrReturn;
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

	public function list_pajak_ppndn($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'InvoiceID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		$Year = ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");
		
		for ($i_month = 1; $i_month <= 12; $i_month++) { 
			$key = $i_month-1;

			if($i_month < 10){
				$i_month = "0".$i_month;
			}

			$VATAmount 	= $this->getInvoiceVATPPNDN($Year, $i_month);
			
            $arrReturn[$key]['Year'] = $Year;
            $arrReturn[$key]['VATAmount'] = ($VATAmount == '' )  ? 0 : (float) $VATAmount;
            $arrReturn[$key]['Amount'] = "Rp ". number_format(($VATAmount == "") ? 0 : $VATAmount, 2);
            $arrReturn[$key]['Month'] = $i_month;
            $arrReturn[$key]['Period'] = $Year." ".date('F', mktime(0,0,0,$i_month));
		}


        // $result['sql'] = $this->db->last_query();
        $result['data'] = $arrReturn;
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
		$this->db->select('SQL_CALC_FOUND_ROWS a.InvoiceID', false);
		$this->db->select('
			a.InvoiceNumber,
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

    public function update_pajak($post)
    {
		$sql 	= "SELECT * FROM mj_pajak WHERE Month = ? AND Year = ?";
		$query	= $this->db->query($sql, array($post["Month"], $post["Year"]));
		if($query->num_rows()>0){
			$update["PaidAmount"] 	= $post["PaidAmount"];		
			$update["ReportStatus"] = $post["ReportStatus"];		

			$this->db->where("Year", $post["Year"]);
			$this->db->where("Month", $post["Month"]);
			$insert = $this->db->update("mj_pajak", $update);
		}else{
			$update["PajakID"]	= getUUID();
			$update["PaidAmount"] 	= $post["PaidAmount"];		
			$update["Amount"] 	= $post["Amount"];		
			$update["Month"] 	= $post["Month"];		
			$update["Year"] 	= $post["Year"];
			$update["ReportStatus"] = $post["ReportStatus"];

			$insert = $this->db->insert("mj_pajak", $update);
		}

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_pajak($Month, $Year){

		$this->db->where("a.Month", $Month);
		$this->db->where("a.Year", $Year);
		$this->db->select('PajakID,
			PaidAmount,
			ReportStatus,
		');
		$query = $this->db->get('mj_pajak a')->row_array();

		$result = array();
		if($query){
			foreach($query as $row => $value){
				$result["MitraJaya.view.Finance.Pajak.WinPajak-FormBasicData-".$row] = $value;
			}
		}

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}
}
