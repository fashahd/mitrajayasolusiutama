<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Massets extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function form_asset($AssetID)
	{
		$sql = "SELECT
			a.AssetID
			, a.AssetCode
			, a.AssetExternalID
			, a.AssetName
			, a.CategoryID
			, a.BrandID
			, a.Year
			, a.HPP
			, a.File1
			, a.File2
			, a.File3
			, a.File4
			, a.StatusCode
			, a.CreatedDate
			, a.CreatedBy
			, a.UpdatedDate
			, a.UpdatedBy
		FROM
			mj_assets a
		LEFT JOIN
			mj_assets_brand b on b.BrandID = a.BrandID
		LEFT JOIN
			mj_assets_category c on c.CategoryID = a.CategoryID
		WHERE
			a.AssetID = ?";
			
		$query = $this->db->query($sql, [$AssetID])->row_array();

		$result = array();
		if ($query) {
			foreach ($query as $row => $value) {
				$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-" . $row] = $value;
			}

			$result["File1"] = ($result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1"] != '') ? base_url().$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1"] : '';
			$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1_old"] = $result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File1"];
			$result["File2"] = ($result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2"] != '') ? base_url().$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2"] : '';
			$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2_old"] = $result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File2"];
			$result["File3"] = ($result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3"] != '') ? base_url().$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3"] : '';
			$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3_old"] = $result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File3"];
			$result["File4"] = ($result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4"] != '') ? base_url().$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4"] : '';
			$result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4_old"] = $result["MitraJaya.view.Assets.Management.MainForm-FormBasicData-File4"];
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function generateCategoryCode(string $name) : string
    {
        $words = explode(' ', $name);
        if (count($words) >= 2) {
            return mb_strtoupper(
                mb_substr($words[0], 0, 2, 'UTF-8') . 
                mb_substr(end($words), 0, 2, 'UTF-8'), 
            'UTF-8');
        }
        return $this->makeInitialsFromSingleWord($name);
    }

	protected function makeInitialsFromSingleWord(string $name) : string
    {
        preg_match_all('#([A-Z]+)#', $name, $capitals);
        if (count($capitals[1]) >= 2) {
            return mb_substr(implode('', $capitals[1]), 0, 2, 'UTF-8');
        }
        return mb_strtoupper(mb_substr($name, 0, 4, 'UTF-8'), 'UTF-8');
    }

	public function generateAssetCode($CategoryCode, $Year){
		$sql = "SELECT
			SUBSTR(a.AssetCode, -5) Current
			, LPAD(SUBSTR(a.AssetCode, -5) + 1, 5, 0) Next
		FROM
			`mj_assets` a
		WHERE
			a.AssetCode LIKE '$CategoryCode/$Year/%'
		ORDER BY SUBSTR(a.AssetCode, -5) DESC LIMIT 1";
		$query = $this->db->query($sql, []);

		if($query->num_rows() > 0){
			$data = $query->row_array();

			$AssetCode = $CategoryCode."/".$Year."/".time()."/".$data["Next"];
		}else{
			$AssetCode = $CategoryCode."/".$Year."/".time()."/"."00001";
		}
		
		return $AssetCode;
	}

	public function getCategoryID($CategoryID){
		$sql = "SELECT CategoryID, CategoryCode FROM mj_assets_category WHERE CategoryID = ? OR CategoryName = ?";
		$query = $this->db->query($sql, [$CategoryID, $CategoryID]);

		if($query->num_rows() > 0){
			$response["CategoryID"] = $query->row_array()["CategoryID"];
			$response["CategoryCode"] = $query->row_array()["CategoryCode"];
			return $response;
		}else{
			$CategoryCode = $this->generateCategoryCode($CategoryID);
			$data["CategoryName"] = $CategoryID;
			$data["CategoryCode"] = $CategoryCode;
			$data["StatusCode"] = "active";
			
			$this->db->insert("mj_assets_category", $data);


			$response["CategoryID"] = $this->db->insert_id();
			$response["CategoryCode"] = $CategoryCode;
			return $response;
		}
	}

	public function getBrandID($BrandID){
		$sql = "SELECT BrandID FROM mj_assets_brand WHERE BrandID = ? OR BrandName = ?";
		$query = $this->db->query($sql, [$BrandID, $BrandID]);

		if($query->num_rows() > 0){
			return $query->row_array()["BrandID"];
		}else{
			$data["BrandName"] = $BrandID;
			$data["StatusCode"] = "active";
			
			$this->db->insert("mj_assets_brand", $data);


			return $this->db->insert_id();
		}
	}

	public function list_assets($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{
		$sqlwhere = '';
		$sqlwhere .= ($pSearch["keySearch"] != '') ? ' AND (a.AssetCode = "'. $pSearch['keySearch'] .'" OR a.AssetExternalID = "'. $pSearch['keySearch'] .'")' : '';
		$sqlwhere .= ($pSearch["CategoryID"] != '') ? ' AND a.CategoryID = "'. $pSearch['CategoryID'] .'"' : '';
		$sqlwhere .= ($pSearch["Year"] != '') ? ' AND a.Year = "'. $pSearch['Year'] .'"' : '';
		$sqlwhere .= ($pSearch["BrandID"] != '') ? ' AND a.BrandID = "'. $pSearch['BrandID'] .'"' : '';

		$sortingField = ($sortingField == '') ? 'a.AssetID' : $sortingField;

		$sql = "SELECT
			a.AssetID
			, a.AssetCode
			, a.AssetExternalID
			, a.AssetName
			, a.CategoryID
			, c.CategoryName
			, a.BrandID
			, b.BrandName
			, a.Year
			, a.HPP
			, a.StatusCode
			, a.CreatedDate
			, a.CreatedBy
			, a.UpdatedDate
			, a.UpdatedBy
		FROM
			mj_assets a
		LEFT JOIN
			mj_assets_brand b on b.BrandID = a.BrandID
		LEFT JOIN
			mj_assets_category c on c.CategoryID = a.CategoryID
		WHERE
			a.StatusCode != 'nullified'
			$sqlwhere
		GROUP BY
			a.AssetID ORDER BY $sortingField $sortingDir LIMIT ?, ?";

		$query = $this->db->query($sql, array($start, $limit));

		$result['data'] = $query->result_array();

		return $result;
	}

	public function form_assets_history($HistoryID){
		$sql = "SELECT
			a.HistoryID
			, a.PeopleID
			, a.StartDate
			, a.AssetID
			, a.Description
			, a.File
			, a.EndDate
		FROM
			mj_assets_history a
		WHERE
			a.StatusCode != 'nullified'
			AND a.HistoryID = ?";

		$query = $this->db->query($sql, [$HistoryID])->row_array();

		$result = array();
		if ($query) {
			foreach ($query as $row => $value) {
				$result["MitraJaya.view.Assets.Management.WinFormHistory-Form-" . $row] = $value;
			}

			$result["File"] = ($result["MitraJaya.view.Assets.Management.WinFormHistory-Form-File"] != '') ? base_url().$result["MitraJaya.view.Assets.Management.WinFormHistory-Form-File"] : '';
			$result["MitraJaya.view.Assets.Management.WinFormHistory-Form-File_old"] = $result["MitraJaya.view.Assets.Management.WinFormHistory-Form-File"];
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;

		return $result;
	}

	public function list_assets_history($AssetID, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{
		$sortingField = ($sortingField == '') ? 'a.HistoryID' : $sortingField;
		$sortingDir = ($sortingDir == '') ? ' DESC' : $sortingDir;

		$sql = "SELECT
			a.HistoryID
			, mp.people_ext_id
			, mp.people_name
			, a.StartDate
			, a.EndDate
			, a.Status
		FROM
			mj_assets_history a
		LEFT JOIN
			mj_assets d on d.AssetID = a.AssetID
		LEFT JOIN
			mj_assets_brand b on b.BrandID = d.BrandID
		LEFT JOIN
			mj_assets_category c on c.CategoryID = d.CategoryID
		LEFT JOIN
			mj_people mp on mp.people_id = a.PeopleID
		WHERE
			a.StatusCode != 'nullified'
			AND a.AssetID = ?
		GROUP BY
			a.HistoryID ORDER BY $sortingField $sortingDir LIMIT ?, ?";

		$query = $this->db->query($sql, array($AssetID, $start, $limit));

		$result['data'] = $query->result_array();

		return $result;
	}

	public function list_assets_export($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{
		$sqlwhere = '';
		$sqlwhere .= ($pSearch["keySearch"] != '') ? ' AND (a.AssetCode = "'. $pSearch['keySearch'] .'" OR a.AssetExternalID = "'. $pSearch['keySearch'] .'")' : '';
		$sqlwhere .= ($pSearch["CategoryID"] != '') ? ' AND a.CategoryID = "'. $pSearch['CategoryID'] .'"' : '';
		$sqlwhere .= ($pSearch["Year"] != '') ? ' AND a.Year = "'. $pSearch['Year'] .'"' : '';
		$sqlwhere .= ($pSearch["BrandID"] != '') ? ' AND a.BrandID = "'. $pSearch['BrandID'] .'"' : '';

		$sortingField = ($sortingField == '') ? 'a.AssetID' : $sortingField;

		$sql = "SELECT
			a.AssetCode AS 'Asset Number'
			, a.AssetExternalID AS 'Serial Number'
			, c.CategoryName AS 'Type'
			, b.BrandName AS 'Brand'
			, a.AssetName AS 'Model Name'
			, a.Year AS 'Year'
			, a.HPP AS 'HPP'
		FROM
			mj_assets a
		LEFT JOIN
			mj_assets_brand b on b.BrandID = a.BrandID
		LEFT JOIN
			mj_assets_category c on c.CategoryID = a.CategoryID
		WHERE
			a.StatusCode != 'nullified'
			$sqlwhere
		GROUP BY
			a.AssetID ORDER BY $sortingField $sortingDir";
		$query = $this->db->query($sql);

		$result['data'] = $query->result_array();

		return $result;
	}

	public function list_expense($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		$Year = ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");
		$Month = ($pSearch["Month"] != '') ? $pSearch["Month"] : date("m");

		$week = getWeek($Month, $Year);
		$startdate = strtotime($Year . "-" . $Month . "-" . "01");
		$firstdate = strtotime($Year . "-" . $Month . "-" . "01");

		$listweek = getListDateWeek($week, $startdate, $firstdate);

		$arrReturn = array();
		$arrReturnNew = array();
		$keynew 	 = 0;
		$tmpweek	 = 1;
		$budget 	 = 0;
		$actual		 = 0;
		$tmpCategory = "";

		if (count($listweek) > 0) {
			foreach ($listweek as $key => $val) {
				$sql = "SELECT
						a.BudgetItem
						, a.BudgetAmount
						, a.BudgetActual
						, a.BudgetDate
						, b.BudgetCategory
						, a.BudgetCategoryID
						, a.BudgetPlanID
					FROM
						`mj_budget_plan` a
					INNER JOIN
						mj_budget_category b ON b.BudgetCategoryID = a.BudgetCategoryID
					WHERE
						a.StatusCode = 'active'
					AND
						a.BudgetDate >= ?
					AND
						a.BudgetDate <= ?
					ORDER BY b.BudgetCategory
				";

				$query = $this->db->query($sql, array($val["startdate"], $val["endate"]));

				if ($query->num_rows() > 0) {
					$arrResult = $query->result_array();
					// $arrReturn[$key]["Week"] = $key;
					foreach ($arrResult as $kt => $row) {
						if ($tmpCategory == "") {
							$tmpCategory = $row["BudgetCategory"];
						} else {
							if ($tmpCategory != $row["BudgetCategory"]  or $tmpweek != $key) {
								$week = ($tmpweek != $key) ? ($key - 1) : $key;
								$arrReturnNew[$keynew]["Week"] = $tmpweek;
								$arrReturnNew[$keynew]["Item"] = "<b>TOTAL</b>";
								$arrReturnNew[$keynew]["Budget"] = $budget;
								$arrReturnNew[$keynew]["Actual"] = $actual;
								$arrReturnNew[$keynew]["Category"] = "";
								$arrReturnNew[$keynew]["BudgetPlanID"] = "";
								$arrReturnNew[$keynew]["BudgetDate"] = "";
								$arrReturnNew[$keynew]["BudgetCategoryID"] = "";
								$arrReturnNew[$keynew]["BudgetItem"] = "";
								$arrReturnNew[$keynew]["BudgetAmount"] = "";
								$arrReturnNew[$keynew]["BudgetActual"] = "";

								$budget = 0;
								$actual = 0;
								$keynew++;

								$tmpCategory = $row["BudgetCategory"];
								$tmpweek = $key;
							}
						};

						$arrReturnNew[$keynew]["Week"] = $key;
						$arrReturnNew[$keynew]["Item"] = $row["BudgetItem"];
						$arrReturnNew[$keynew]["Budget"] = $row["BudgetAmount"];
						$arrReturnNew[$keynew]["Actual"] = $row["BudgetActual"];
						$arrReturnNew[$keynew]["Category"] = $row["BudgetCategory"];
						$arrReturnNew[$keynew]["BudgetPlanID"] = $row["BudgetPlanID"];
						$arrReturnNew[$keynew]["BudgetDate"] = $row["BudgetDate"];
						$arrReturnNew[$keynew]["BudgetCategoryID"] = $row["BudgetCategoryID"];
						$arrReturnNew[$keynew]["BudgetItem"] = $row["BudgetItem"];
						$arrReturnNew[$keynew]["BudgetAmount"] = $row["BudgetAmount"];
						$arrReturnNew[$keynew]["BudgetActual"] = $row["BudgetActual"];
						$budget += $row["BudgetAmount"];
						$actual += $row["BudgetActual"];
						$keynew++;

						if ($kt === array_key_last($arrResult)) {
							$arrReturnNew[$keynew]["Week"] = $key;
							$arrReturnNew[$keynew]["Item"] = "<b>TOTAL</b>";
							$arrReturnNew[$keynew]["Budget"] = $budget;
							$arrReturnNew[$keynew]["Actual"] = $actual;
							$arrReturnNew[$keynew]["Category"] = "";
							$arrReturnNew[$keynew]["BudgetPlanID"] = "";
							$arrReturnNew[$keynew]["BudgetDate"] = "";
							$arrReturnNew[$keynew]["BudgetCategoryID"] = "";
							$arrReturnNew[$keynew]["BudgetItem"] = "";
							$arrReturnNew[$keynew]["BudgetAmount"] = "";
							$arrReturnNew[$keynew]["BudgetActual"] = "";
						}
					}
				}

				// if (array_search($key, array_column($arrReturnNew, 'Week')) === FALSE) {
				//     $arrReturnNew[$keynew]["Week"]    = $key;
				//     $arrReturnNew[$keynew]["Item"]    = null;
				//     $arrReturnNew[$keynew]["Budget"]    = 0;
				//     $arrReturnNew[$keynew]["Actual"]    = 0;
				// 	$arrReturnNew[$keynew]["BudgetPlanID"] = "";
				// 	$arrReturnNew[$keynew]["BudgetDate"] = "";
				// 	$arrReturnNew[$keynew]["BudgetCategoryID"] = "";
				// 	$arrReturnNew[$keynew]["BudgetItem"] = "";
				// 	$arrReturnNew[$keynew]["BudgetAmount"] = "";
				// 	$arrReturnNew[$keynew]["BudgetActual"] = "";
				//     $keynew++;
				// }
			}

			// echo "<pre>";print_R($arrReturnNew);die;
			// die;

			$arrResult = array();
			$keyRes    = 0;
			if (count($arrReturnNew) > 0) {
				$budget = 0;
				$actual = 0;
				$tmpnew = 0;
				foreach ($arrReturnNew as $kn => $valret) {
					if ($valret["Item"] == "<b>TOTAL</b>") {
						$arrResult[$keyRes] = $valret;
						$budget = 0;
						$actual = 0;

						$keyRes++;
					}

					if ($valret["Item"] != "<b>TOTAL</b>" and $valret["Item"] != '') {
						$arrResult[$keyRes] = $valret;
						$budget += $valret["Budget"];
						$actual += $valret["Actual"];
						$keyRes++;
					}

					if ($valret["Item"] == null) {
						$arrResult[$keyRes]["Week"] = $valret["Week"];
						$arrResult[$keyRes]["Item"] = "<b>TOTAL</b>";
						$arrResult[$keyRes]["Budget"] = ($tmpnew > 0) ? 0 : $budget;
						$arrResult[$keyRes]["Actual"] = ($tmpnew > 0) ? 0 : $actual;
						$arrResult[$keyRes]["BudgetPlanID"] = "";
						$arrResult[$keyRes]["BudgetDate"] = "";
						$arrResult[$keyRes]["BudgetCategoryID"] = "";
						$arrResult[$keyRes]["BudgetItem"] = "";
						$arrResult[$keyRes]["BudgetAmount"] = "";
						$arrResult[$keyRes]["BudgetActual"] = "";

						$keyRes++;
						$tmpnew++;

						$arrResult[$keyRes] = $valret;
					}
				}
			}
			// echo "<pre>";print_r($arrResult);die;
		}


		// $result['sql'] = $this->db->last_query();
		$result['data'] = $arrResult;
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

	public function submit_expsense($post)
	{
		unset($post["OpsiDisplay"]);
		unset($post["BudgetPlanID"]);

		// echo "<pre>";print_r($post);die;

		$insert = $this->db->insert("mj_budget_plan", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_expsense($post)
	{
		$BudgetPlanID = $post["BudgetPlanID"];
		unset($post["OpsiDisplay"]);
		unset($post["BudgetPlanID"]);

		// echo "<pre>";print_r($post);die;

		$this->db->where("BudgetPlanID", $BudgetPlanID);
		$insert = $this->db->update("mj_budget_plan", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function submit_income($post)
	{
		unset($post["OpsiDisplay"]);
		unset($post["BudgetPlanID"]);

		// echo "<pre>";print_r($post);die;

		$insert = $this->db->insert("mj_budget_plan_income", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}

	public function update_income($post)
	{
		$BudgetPlanID = $post["BudgetPlanID"];
		unset($post["OpsiDisplay"]);
		unset($post["BudgetPlanID"]);

		// echo "<pre>";print_r($post);die;

		$this->db->where("BudgetPlanID", $BudgetPlanID);
		$insert = $this->db->update("mj_budget_plan_income", $post);

		if ($insert) {
			$response["success"] = true;
			$response["message"] = "Data Saved";
		} else {
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
	}
}
