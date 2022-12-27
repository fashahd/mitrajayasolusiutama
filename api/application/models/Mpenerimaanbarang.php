<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mpenerimaanbarang extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_penerimaan_barang($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'PenerimaanBarangID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		// ($pSearch["keySearch"] != '') ? $this->db->like("a.ProductCode", $pSearch["keySearch"]): "";
		($pSearch["TanggalBarangMasuk"] != '') ? $this->db->where("a.TanggalPenerimaan", $pSearch["TanggalPenerimaan"]): "";
		($pSearch["DocumentNo"] != '') ? $this->db->where("a.DocNo", $pSearch["DocumentNo"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
        $this->db->join("mj_sparepart b", " b.SparepartID = a.PartCode", "left");
        $this->db->join("mj_people c", " c.people_id = a.PjCode", "left");
        $this->db->join("mj_master_rack d", " d.RackID = a.RakNumber", "left");
		$this->db->select('SQL_CALC_FOUND_ROWS a.PenerimaanBarangID', false);
		$this->db->select('
			a.PartCode,
			a.PartCategory,
			a.TanggalPenerimaan,
			a.PjCode,
			a.DocNo,
			a.Qty,
			a.RakNumber,
			a.RowNumber,
			a.ColumnNumber,
			b.SparepartCode,
			b.SparepartNumberCode,
			b.SparepartName,
			b.SparepartNo,
			c.people_name,
			d.RackNumber
		');
		$query = $this->db->get('mj_penerimaan_barang a');

		$data = $query->result_array();
        $result['data'] = $data;

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
    
    public function insert_penerimaan_barang($post)
    {
        unset($post["OpsiDisplay"]);
		$PenerimaanBarangID = getUUID();
		$post["PenerimaanBarangID"] = $PenerimaanBarangID;
		$post["CreatedDate"] = date("Y-m-d H:i:s");
		$post["CreatedBy"] = $_SESSION["user_id"];
		
		$insert = $this->db->insert("mj_penerimaan_barang", $post);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["PenerimaanBarangID"] = $PenerimaanBarangID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function list_loan_excel($pSearch, $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'LoanID';
        if ($sortingDir == "") $sortingDir = 'DESC';

		($pSearch["VendorID"] != '') ? $this->db->where("a.VendorName", $pSearch["VendorID"]): "";
		($pSearch["ProjectID"] != '') ? $this->db->where("a.ProjectID", $pSearch["ProjectID"]): "";

		$this->db->where("a.StatusCode", "active");
		$this->db->group_by("a.LoanID");
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->join("mj_project b", " b.ProjectID = a.ProjectID", "left");
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

    public function update_penerimaan_barang($post)
    {
		$PenerimaanBarangID = $post["PenerimaanBarangID"];
        unset($post["OpsiDisplay"]);
        unset($post["PenerimaanBarangID"]);

        $param['Type'] = $post['Type'];
        $param['ToolkitCode'] = $post['ToolkitCode'];
        $param['PartCode'] = $post['PartCode'];
        $param['PartCategory'] = $post['PartCategory'];
        $param['TanggalPenerimaan'] = $post['TanggalPenerimaan'];
        $param['PjCode'] = $post['PjCode'];
        $param['DocNo'] = $post['DocNo'];
        $param['Qty'] = $post['Qty'];
        $param['RakNumber'] = $post['RakNumber'];
        $param['RowNumber'] = $post['RowNumber'];
        $param['ColumnNumber'] = $post['ColumnNumber'];
        $param['RakNumber'] = $post['RakNumber'];
		$post["UpdatedDate"] = date("Y-m-d H:i:s");
		$post["UpdatedBy"] = $_SESSION["user_id"];
		
		$this->db->where("PenerimaanBarangID", $PenerimaanBarangID);
		$insert = $this->db->update("mj_penerimaan_barang", $param);

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
			$response["PenerimaanBarangID"] = $PenerimaanBarangID;
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

	public function form_penerimaan_barang($PenerimaanBarangID){

        $this->db->where("StatusCode", "active");
        $this->db->where("PenerimaanBarangID", $PenerimaanBarangID);
		$this->db->select('SQL_CALC_FOUND_ROWS PenerimaanBarangID', false);
		$this->db->select('PenerimaanBarangID,
			Type,
			ToolkitCode,
			PartCode,
			PartCategory,
			TanggalPenerimaan,
			PjCode,
			DocNo,
			Qty,
            RakNumber,
            RowNumber,
			ColumnNumber
		');
		$query = $this->db->get('mj_penerimaan_barang')->row_array();

		$result = array();
        foreach($query as $row => $value){
            $result["MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-".$row] = $value;
        }

        $return["success"]  = true;
        $return["data"]     = $result;

        return $return;
	}

	public function CheckDocNo($field, $id, $PenerimaanBarangID){
		($PenerimaanBarangID != "") ? $this->db->where("PenerimaanBarangID <> ", $PenerimaanBarangID) : "";
		$this->db->where($field, $id);
		$this->db->select('PenerimaanBarangID,
			Type,
			ToolkitCode,
			PartCode,
			PartCategory,
			TanggalPenerimaan,
			PjCode,
			Qty,
			RakNumber,
			RowNumber,
			ColumnNumber,
		');
		$query = $this->db->get('mj_penerimaan_barang');

		$return["exist"] = 0;
		if($query->num_rows()>0){
			$return["exist"] = 1;
		}

        return $return;
	}

}
