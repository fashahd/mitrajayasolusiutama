<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Maktiva extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }    

	public function getDataList($psearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){
        $month = ($psearch["month"] == "") ? date("m") : $psearch["month"];
        $year = ($psearch["year"] == "") ? date("Y") : $psearch["year"];

		$sql = "SELECT SQL_CALC_FOUND_ROWS
			AktivaID
            , Month
            , Year
            , Description
            , Unit
            , Gol
            , Rate
            , InputValue
            , Total
            , FinalAccumulated
            , FinalBookValue
            , CostDecreasing
            , FinalAccumulatedCost
            , FinalBookValueCost
		FROM
			`mj_aktiva`
		WHERE
            last_day(date(concat_ws('-', ?, ?, 1))) >= last_day(date(concat_ws('-', `Year`, Month, 1)))
		ORDER BY Month ASC";

		$query = $this->db->query($sql, array($year, $month));

		$data = array();

        if($query->num_rows()>0){
            foreach($query->result_array() as $row => $key){
                foreach($key as $keynew => $val){
                    if($keynew == "AktivaID" || $keynew == "Month" || $keynew == "Year"|| $keynew == "Description"|| $keynew == "Gol"){
                        $data[$row][$keynew] = $val;
                    }else{                        
                        $data[$row][$keynew] = (int) $val;
                    }
                }
            }
        }
        // $result['sql'] = $this->db->last_query();y
        $result['data'] = $data;
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

        $query = $this->db->query('SELECT FOUND_ROWS() AS total');
        $result['total'] = $query->row()->total;

		return $result;
	}

    public function getDataByID($AktivaID){

        $sql = "SELECT
            AktivaID
            , Month
            , Year
            , Description
            , Unit
            , Gol
            , Rate
            , InputValue
            , Total
            , FinalAccumulated
            , FinalBookValue
            , CostDecreasing
            , FinalAccumulatedCost
            , FinalBookValueCost
        FROM
            `mj_aktiva`
        WHERE
            AktivaID = ?
        LIMIT 1";

        $query = $this->db->query($sql, array($AktivaID));

        $result = array();
        foreach($query->row_array() as $row => $value){
            $result["MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-".$row] = $value;
        }

        $return["success"] = true;
        $return["data"] = $result;

        return $return;
    }

    public function submit($post)
    {
        unset($post["OpsiDisplay"]);

        if($post["AktivaID"] == ""){
            unset($post["AktivaID"]);
            $post["CreatedBy"] = $_SESSION["user_id"];
            $update = $this->db->insert("mj_aktiva", $post);
        }else{
            $AktivaID = $post["AktivaID"];
            unset($post["AktivaID"]);
            $post["UpdatedBy"] = $_SESSION["user_id"];
            $post["UpdatedDate"] = date("Y-m-d H:i:s");

            $this->db->where("AktivaID", $AktivaID);
            $update = $this->db->update("mj_aktiva", $post);
        }

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }

    public function submit_laba_rugi($post)
    {
        $sql    = "SELECT * FROM mj_laba_rugi WHERE month = ? AND year = ? LIMIT 1";
        $query  = $this->db->query($sql, array($post["month"], $post["year"]));

        if($query->num_rows()>0){
            $month = $post["month"];
            $year = $post["year"];

            unset($post["month"]);
            unset($post["year"]);

            $this->db->where("month", $month);
            $this->db->where("year", $year);
            $update = $this->db->update("mj_laba_rugi", $post);
        }else{
            $update = $this->db->insert("mj_laba_rugi", $post);
        }

		if($update){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }
}
