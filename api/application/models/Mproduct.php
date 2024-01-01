<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mproduct extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function CheckPartCode($PartCategoryCode, $StartRangePartCode, $EndRangePartCode, $PartCategoryID){
		$return["exist"] = false;
		$sqlwhere = ($PartCategoryID != '') ? " AND PartCategoryID != '$PartCategoryID'" : "";
		$sql = "SELECT
			* 
		FROM
			mj_part_category 
		WHERE
			PartCategoryCode = ?
			$sqlwhere
			AND ? BETWEEN StartRangePartCode AND EndRangePartCode AND StatusCode = 'active'";
		$query = $this->db->query($sql, array($PartCategoryCode, (int)$StartRangePartCode));

		if($query->num_rows()>0){
			$return["exist"] 	= true;
			$return["message"] 	= "Start Range Already Set To Another Location";
		}

		$sql = "SELECT
			* 
		FROM
			mj_part_category 
		WHERE
			PartCategoryCode = ?
			$sqlwhere
			ANd ? BETWEEN StartRangePartCode AND EndRangePartCode AND StatusCode = 'active'";
		$query = $this->db->query($sql, array($PartCategoryCode, (int)$EndRangePartCode));

		if($query->num_rows()>0){
			$return["exist"] 	= true;
			$return["message"] 	= "End Range Already Set To Another Location";
		}

		// echo "<pre>";print_r($this->db->last_query());die;

		return $return;
	}

	public function list_product($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'ProductID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["keySearch"] != '') ? $this->db->like("a.ProductCode", $pSearch["keySearch"]): "";
		($pSearch["ProductBrand"] != '') ? $this->db->where("a.ProductBrand", $pSearch["ProductBrand"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.ProductID");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
        $this->db->join("mj_brand b", " b.BrandID = a.ProductBrand", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.ProductID', false);
		$this->db->select('
			a.ProductCode,
			a.ProductName,
			b.BrandName as ProductBrand,
		');
		$query = $this->db->get('mj_product a');

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
    
    public function insert_part($post)
    {
        unset($post["OpsiDisplay"]);
		$PartCategoryID = getUUID();
		$post["PartCategoryID"] = $PartCategoryID;
		
		$insert = $this->db->insert("mj_part_category", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["PartCategoryID"] = $PartCategoryID;
			$response["ProductID"] = $post['ProductID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function list_part($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'a.ProductID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["ProductID"] != '') ? $this->db->where("a.ProductID", $pSearch["ProductID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
        $this->db->join("mj_product b", " b.ProductID = a.ProductID", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS PartCategoryID', false);
		$this->db->select('
            a.ProductID,
            CONCAT(ProductCode, "-",LPAD(StartRangePartCode, 4,0),"-",LPAD(EndRangePartCode, 4, 0)) PartCategoryCode,
            ActualLocation
		');
		$query = $this->db->get('mj_part_category a');

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

        if ($sortingField == "") $sortingField = 'LoanID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["LoanID"] != '') ? $this->db->where("LoanID", $pSearch["LoanID"]): "";

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

	public function list_loan_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'LoanID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["VendorID"] != '') ? $this->db->where("a.VendorName", $pSearch["VendorID"]): "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.LoanID");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_project_new b", " b.ProjectID = a.ProjectID", "left");
		$this->db->join("mj_loan_payment c", " c.LoanID = a.LoanID and c.StatusCode = 'active'", "left");
		$this->db->join("mj_vendor d", " d.VendorID = a.VendorName and d.StatusCode = 'active'", "left");
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

    public function insert_product($post)
    {
        unset($post["OpsiDisplay"]);
		$ProductID = getUUID();
		$post["ProductID"] = $ProductID;
		
		$insert = $this->db->insert("mj_product", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["ProductID"] = $ProductID;
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
		$LoanPaymentID = getUUID();
		$post["LoanPaymentID"] = $LoanPaymentID;
		
		$insert = $this->db->insert("mj_loan_payment", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["LoanPaymentID"] = $LoanPaymentID;
			$response["LoanID"] = $post['LoanID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    // public function update_part($post)
    // {
	// 	$ProductID = $post["ProductID"];
    //     unset($post["OpsiDisplay"]);
		
	// 	$this->db->where("LoanID", $LoanID);
	// 	$insert = $this->db->update("mj_loan", $post);

	// 	if($insert){
	// 		$response["success"] = true;
	// 		$response["message"] = "Data Saved";
	// 		$response["LoanID"] = $LoanID;
	// 	}else{
	// 		$response["success"] = false;
	// 		$response["message"] = "Failed to saved data";
	// 	}

	// 	return $response;
    // }

    public function update_part($post)
    {
		$PartCategoryID = $post["PartCategoryID"];
        unset($post["OpsiDisplay"]);
        unset($post["PartCategoryID"]);

        $param['PartCategoryCode'] = $post['PartCategoryCode'];
        $param['StartRangePartCode'] = $post['StartRangePartCode'];
        $param['EndRangePartCode'] = $post['EndRangePartCode'];
        $param['ActualLocation'] = $post['ActualLocation'];
		
		$this->db->where("PartCategoryID", $PartCategoryID);
		$insert = $this->db->update("mj_part_category", $param);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["PartCategoryID"] = $PartCategoryID;
			$response["ProductID"] = $post['ProductID'];
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_product($ProductID){

        $this->db->where("StatusCode", "active");
        $this->db->where("ProductID", $ProductID);
		$this->db->select('SQL_CALC_FOUND_ROWS ProductID', false);
		$this->db->select('ProductID,
			ProductCode,
			ProductName,
			ProductBrand,
            FilePath,
            FilePath2
		');
		$query = $this->db->get('mj_product')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-".$row] = $value;
        }

        $result["FilePath"] = $query["FilePath"];
        $result["FilePath2"] = $query["FilePath2"];

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

    public function form_part($PartCategoryID){
		$this->db->where("a.PartCategoryID", $PartCategoryID);
        $this->db->join("mj_product b", " b.ProductID = a.ProductID", "left");
		$this->db->select('PartCategoryID,
			a.ProductID,
			b.ProductCode PartCategoryCode,
			StartRangePartCode,
			EndRangePartCode,
			ActualLocation
		');
		$query = $this->db->get('mj_part_category a')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Warehouse.Product.WinFormPart-Form-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CheckDocNo($field, $id, $LoanPaymentID){
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
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

}
