<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mbudgetplan extends CI_Model {
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

	public function list_income($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

		$Year = ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");
		$Month = ($pSearch["Month"] != '') ? $pSearch["Month"] : date("m");

        $week = getWeek($Month, $Year);
        $startdate = strtotime($Year."-".$Month."-"."01");
        $firstdate = strtotime($Year."-".$Month."-"."01");

        $listweek = getListDateWeek($week, $startdate, $firstdate);

        $arrReturn = array();
        $arrReturnNew = array();
        $keynew = 0;


        if(count($listweek) > 0){
            foreach($listweek as $key => $val){
				$sql = "SELECT
						a.BudgetPlanID
						, a.BudgetDate
						, a.BudgetItem CustomerName
						, IFNULL(SUM(a.BudgetAmount), 0) Amount
						, IFNULL(SUM(a.BudgetActual), 0) PaidAmount
					FROM
						`mj_budget_plan_income` a
					WHERE
						a.StatusCode = 'active'
					AND
						a.BudgetDate >= ?
					AND
						a.BudgetDate <= ?
				";

                $queryincome = $this->db->query($sql, array($val["startdate"], $val["endate"]));

				if($queryincome->num_rows()>0){
                    // $arrReturn[$key]["Week"] = $key;
                    foreach($queryincome->result_array() as $kta => $rowa){
						$arrReturnNew[$keynew]["BudgetPlanID"] = $rowa["BudgetPlanID"];
						$arrReturnNew[$keynew]["BudgetDate"] = $rowa["BudgetDate"];
						$arrReturnNew[$keynew]["Week"] = "Week - ".$key;
                        $arrReturnNew[$keynew]["Item"] = $rowa["CustomerName"];
                        $arrReturnNew[$keynew]["Budget"] = $rowa["Amount"];
                        $arrReturnNew[$keynew]["Actual"] = $rowa["PaidAmount"];
                        $keynew++;
					}
				}

                $sql = "SELECT
					'' BudgetPlanID
					, '' BudgetDate 
                    , b.CustomerName
                    , IFNULL(SUM(a.GrossIncome), 0) Amount
                    , SUM(IF(a.Paid IS NOT NULL, a.GrossIncome, 0)) PaidAmount
                FROM
                    mj_invoice a
                JOIN
                    mj_customer b on b.CustomerID = a.CustomerID
                WHERE
                    a.StatusCode = 'active'
                AND
                    (a.InvoiceReceived >= ?  AND a.InvoiceReceived <= ?)
                GROUP BY
                    a.CustomerID";

                $query = $this->db->query($sql, array($val["startdate"], $val["endate"]));

				// echo "<pre>";print_r($this->db->last_query());die;

                if($query->num_rows()>0){
                    // $arrReturn[$key]["Week"] = $key;
                    foreach($query->result_array() as $kt => $row){
                        $arrReturnNew[$keynew]["BudgetPlanID"] = $row["BudgetPlanID"];
                        $arrReturnNew[$keynew]["BudgetDate"] = $row["BudgetDate"];
                        $arrReturnNew[$keynew]["Week"] = "Week - ".$key;
                        $arrReturnNew[$keynew]["Item"] = "Claim Invoice ".$row["CustomerName"];
                        $arrReturnNew[$keynew]["Budget"] = $row["Amount"];
                        $arrReturnNew[$keynew]["Actual"] = $row["PaidAmount"];
                        $keynew++;

                        // $arrReturnNew[]["Week"] = $key;
                        // $arrReturnNew[]["Item"] = $row["CustomerName"];
                        // $arrReturnNew[]["Budget"] = $row["Amount"];
                        // $arrReturnNew[]["Actual"] = $row["PaidAmount"];
                    }
                }

                if (array_search("Week - ".$key, array_column($arrReturnNew, 'Week')) === FALSE) {
					$arrReturnNew[$keynew]["BudgetPlanID"] = "";
					$arrReturnNew[$keynew]["BudgetDate"] = "";
                    $arrReturnNew[$keynew]["Week"]    = "Week - ".$key;
                    $arrReturnNew[$keynew]["Item"]    = null;
                    $arrReturnNew[$keynew]["Budget"]    = 0;
                    $arrReturnNew[$keynew]["Actual"]    = 0;
                    $keynew++;
                }
            }
        }

        // echo "<pre>";print_r($arrReturnNew);die;
 

        // $result['sql'] = $this->db->last_query();
        $result['data'] = $arrReturnNew;
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

        // $query = $this->db->query('SELECT FOUND_ROWS() AS total');
        // $result['total'] = $query->row()->total;

        if ($sortingDir == 'ASC') {
            $sortingInfo = 'ascending';
        }
        if ($sortingDir == 'DESC') {
            $sortingInfo = 'descending';
        }

        return $result;
	}

	public function list_expense($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

		$Year = ($pSearch["Year"] != '') ? $pSearch["Year"] : date("Y");
		$Month = ($pSearch["Month"] != '') ? $pSearch["Month"] : date("m");

        $week = getWeek($Month, $Year);
        $startdate = strtotime($Year."-".$Month."-"."01");
        $firstdate = strtotime($Year."-".$Month."-"."01");

        $listweek = getListDateWeek($week, $startdate, $firstdate);

        $arrReturn = array();
        $arrReturnNew = array();
        $keynew 	 = 0;
		$tmpweek	 = 1;
		$budget 	 = 0;
		$actual		 = 0;
		$tmpCategory = "";

        if(count($listweek) > 0){
            foreach($listweek as $key => $val){
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

                if($query->num_rows()>0){
					$arrResult = $query->result_array();
                    // $arrReturn[$key]["Week"] = $key;
                    foreach($arrResult as $kt => $row){						
						if($tmpCategory == ""){
							$tmpCategory = $row["BudgetCategory"];
						}else{
							if($tmpCategory != $row["BudgetCategory"]  OR $tmpweek != $key){
								$week = ($tmpweek != $key) ? ($key-1) : $key;
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
			if(count($arrReturnNew) > 0){
				$budget = 0;
				$actual = 0;
				$tmpnew = 0;
				foreach($arrReturnNew as $kn => $valret){
					if($valret["Item"] == "<b>TOTAL</b>"){
						$arrResult[$keyRes] = $valret;
						$budget = 0;
						$actual = 0;

						$keyRes++;
					}
					
					if($valret["Item"] != "<b>TOTAL</b>" AND $valret["Item"] != ''){
						$arrResult[$keyRes] = $valret;
						$budget += $valret["Budget"];
						$actual += $valret["Actual"];
						$keyRes++;
					}

					if($valret["Item"] == null){
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

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
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

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
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

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
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

		if($insert){
			$response["success"] = true;
			$response["message"] = "Data Saved";
		}else{
			$response["success"] = false;
			$response["message"] = "Failed to saved data";
		}

		return $response;
    }
}
