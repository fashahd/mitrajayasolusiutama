<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mpayroll extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	public function form_payroll($Month, $Year, $people_id)
	{
		$sql = "SELECT
			c.salary salary
			, '$Month' month
			, '$Year' year
			, '$people_id' people_id
			, c.insentif_thr
			, c.insentif_transportasi
			, c.insentif_komunikasi
			, c.insentif_lembur
			, c.insentif_bonus
			, c.deduction_bpjs_tk
			, c.deduction_bpjs_kesehatan
			, c.deduction_kasbon
			, c.deduction_pph_21_insentif
			, c.deduction_pph_21
		FROM
			`mj_people` a
		LEFT JOIN
			mj_contract b on b.people_id = a.people_id AND b.employee_status = 1
		LEFT JOIN
			mj_payroll c on c.people_id = a.people_id AND c.`month` = ? AND c.`year` = ?
		WHERE
			a.people_id = ?";
			
		$query = $this->db->query($sql, [$Month, $Year, $people_id])->row_array();

		$result = array();
		if ($query) {
			foreach ($query as $row => $value) {
				$result["MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-" . $row] = $value;
			}
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function form_prefill_payroll($Month, $Year, $people_id)
	{
		$sql = "SELECT
			IF(c.salary IS NULL, b.contract_wage, c.salary) salary
			, '$Month' month
			, '$Year' year
			, '$people_id' people_id
			, c.insentif_thr
			, c.insentif_transportasi
			, c.insentif_komunikasi
			, c.insentif_lembur
			, c.insentif_bonus
			, c.deduction_bpjs_tk
			, c.deduction_bpjs_kesehatan
			, c.deduction_kasbon
			, c.deduction_pph_21_insentif
			, c.deduction_pph_21
		FROM
			`mj_people` a
		LEFT JOIN
			mj_contract b on b.people_id = a.people_id AND b.employee_status = '1'
		LEFT JOIN
			(
				SELECT
					people_id
					, month
					, year
					, salary
					, insentif_thr
					, insentif_transportasi
					, insentif_komunikasi
					, insentif_lembur
					, insentif_bonus
					, deduction_bpjs_tk
					, deduction_bpjs_kesehatan
					, deduction_kasbon
					, deduction_pph_21_insentif
					, deduction_pph_21 
				FROM 
					mj_payroll 
				WHERE 
					people_id = '$people_id' ORDER BY month DESC, year DESC
			) c on c.people_id = a.people_id
		WHERE
			a.people_id = ?";
			
		$query = $this->db->query($sql, [$people_id])->row_array();

		$result = array();
		if ($query) {
			foreach ($query as $row => $value) {
				$result["MitraJaya.view.Admin.Payroll.WinFormPayroll-FormBasicData-" . $row] = $value;
			}
		}

		$return["success"]  = true;
		$return["data"]     = $result;

		return $return;
	}

	public function getInvoiceVAT($Year, $month)
	{

		$sql = "SELECT SUM(InvoiceVAT) InvoiceVAT FROM mj_invoice WHERE StatusCode = 'active' AND InvoicePeriodMonth = ? AND InvoicePeriodYear = ?";
		$query = $this->db->query($sql, array($month, $Year))->row_array();

		return $query["InvoiceVAT"];
	}

	public function getInvoiceVATPPNDN($Year, $month)
	{

		$sql = "SELECT SUM(PPHValue) PPHValue FROM `mj_vendorpayment` WHERE PeriodMonth = ? AND PeriodYear = ?";
		$query = $this->db->query($sql, array($month, $Year))->row_array();

		return $query["PPHValue"];
	}

	public function getPaidTax($Year, $month)
	{
		$sql = "SELECT PaidAmount, ReportStatus FROM mj_pajak WHERE Month = ? AND Year = ?";
		$query = $this->db->query($sql, array($month, $Year))->row_array();

		if ($query) {
			$data["PaidAmount"] 	= $query["PaidAmount"];
			$data["ReportStatus"] 	= $query["ReportStatus"];
		} else {
			$data["PaidAmount"] 	= 0;
			$data["ReportStatus"] 	= 0;
		}
		return $data;
	}

	public function list_employee($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir)
	{

		$Year = ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");
		$Month = ($pSearch["Month"] != '') ? $pSearch["Month"] : date("m");

		$sortingField = ($sortingField == '') ? 'a.people_name' : $sortingField;

		if ($sortingDir == 'ASC') {
			$sortingInfo = 'ascending';
		}
		if ($sortingDir == 'DESC') {
			$sortingInfo = 'descending';
		}

		$sql = "SELECT
			a.people_id
			, a.people_ext_id
			, a.people_name
			, c.salary
			, (c.insentif_thr + c.insentif_transportasi + c.insentif_komunikasi + c.insentif_lembur + c.insentif_bonus) incentive
			, (c.deduction_bpjs_tk+c.deduction_bpjs_kesehatan+c.deduction_kasbon+c.deduction_pph_21_insentif+c.deduction_pph_21) deduction
			, (c.salary + (c.insentif_thr + c.insentif_transportasi + c.insentif_komunikasi + c.insentif_lembur + c.insentif_bonus)) - (c.deduction_bpjs_tk+c.deduction_bpjs_kesehatan+c.deduction_kasbon+c.deduction_pph_21_insentif+c.deduction_pph_21) net_salary
		FROM
			mj_people a
		INNER JOIN
			mj_contract b on b.people_id = a.people_id AND b.employee_status = '1'
		LEFT JOIN
			mj_payroll c on c.people_id = a.people_id AND c.`month` = ? AND c.`year` = ?
		WHERE
			a.`status` = 'active'
		GROUP BY
			a.people_id ORDER BY $sortingField $sortingDir";
		$query = $this->db->query($sql, array($Month, $Year));

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