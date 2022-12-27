<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Mdboard extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
	}

	function terbilangnew($x)
	{		
		if ($x < 1000)
			return number_format($x / 100,2)." ratus";
		elseif ($x < 1000000)
			return number_format($x / 1000,2) . " ribu";
		elseif ($x < 1000000000)
			return number_format($x / 1000000,2) . " juta";
		elseif ($x < 10000000000)
			return number_format($x / 1000000000,2) . " miliar ";
	}

	public function display_chart_finance($param)
	{
		$listmonth = $this->getListMonth($param["quartal"]);
		$sql = "SELECT TotalAktivaLancar, HutangPajak, HutangDireksi, Modal, LabaRugiBertahan, TotalAktivTetap FROM mj_neraca WHERE Month = ? AND Year = ?";
		$query = $this->db->query($sql, array($listmonth[2], $param["year"]));

		$data  = $query->row_array();

		$result["TotalAktivaLancar"] 	= $this->terbilangnew($data["TotalAktivaLancar"]);
		$result["TotalAktivTetap"] 		= $this->terbilangnew($data["TotalAktivTetap"]);
		$result["Kewajiban"] 			= $this->terbilangnew((int)$data["HutangPajak"]+(int)$data["HutangDireksi"]);
		$result["Ekuitas"] 				= $this->terbilangnew((int)$data["Modal"]+(int)$data["LabaRugiBertahan"]);
		$result["AktivaTetap"]			= (int) $data["TotalAktivTetap"];
		$result["AktivaLancar"]			= (int) $data["TotalAktivaLancar"];
		$result["Modal"]				= (int) $data["Modal"];
		$result["Laba"]					= (int) $data["LabaRugiBertahan"];
		$result["Hutang"]				= (int) $data["HutangPajak"] + (int) $data["HutangDireksi"];
		$result["Pasiva"] 				= $this->terbilangnew($result["Laba"]+$result["Modal"]+$result["Hutang"]);
		$result["Aktiva"] 				= $this->terbilangnew($result["AktivaLancar"]+$result["AktivaTetap"]);
		$result["LabaChart"] 			= $this->getDataLaba($param["quartal"], $param["year"]);

		$return["success"] = true;
		$return["data"] = $result;

		return $return;
	}

	public function display_chart($param)
	{
		$data["omset"] 			= $this->getDataOmset($param["quartal"], $param["year"]);
		$data["omsetClient"] 	= $this->getDataOmsetbyClient($param["quartal"], $param["year"]);

		$result["success"] 	= true;
		$result["data"]		= $data;
		return $result;
	}

	function getListMonth($quartal)
	{
		$listmont = array();
		if ($quartal == "q1" || $quartal == "q2" || $quartal == "q3" || $quartal == "q4") {
			$month1 = array("01", "02", "03");
			$listmont = array_merge($listmont, $month1);
		}

		if ($quartal == "q2" || $quartal == "q3" || $quartal == "q4") {
			$month2 = array("04", "05", "06");
			$listmont = array_merge($listmont, $month2);
		}
		if ($quartal == "q3" || $quartal == "q4") {
			$month3 = array("07", "08", "09");
			$listmont = array_merge($listmont, $month3);
		}
		if ($quartal == "q4") {
			$month4 = array("10", "11", "12");
			$listmont = array_merge($listmont, $month4);
		}

		return $listmont;
	}

	function getDataOmsetbyClient($quartal, $year)
	{
		$listMonth 	= $this->getListMonth($quartal);

		$sql = "SELECT
			a.CustomerID,
			a.CustomerName
		FROM
			mj_customer a
			JOIN mj_invoice b ON b.CustomerID = a.CustomerID 
		WHERE
			a.StatusCode = 'active'
		GROUP BY
			a.CustomerID";
		$query = $this->db->query($sql);

		$CustomerList 	= array();
		$MonthList		= array();
		$dataList		= array();
		if ($query->num_rows() > 0) {
			foreach ($query->result_array() as $kc => $row) {
				array_push($CustomerList, array($row["CustomerName"], $row["CustomerID"]));
			}

			foreach ($listMonth as $key => $month) {
				$MonthList[$key]["name"] = date("F", strtotime($year . "-" . $month . "-01"));

				$dataAmount = array();
				foreach ($CustomerList as $val) {
					$sql = 'SELECT
						SUM(a.InvoiceAmount) Amount
							, c.CustomerName
							, a.InvoicePeriodMonth
						FROM
							mj_invoice a
						JOIN
							mj_order_book b on b.OrderBookID = a.ContractNumber
						JOIN
							mj_customer c on c.CustomerID = b.CustomerID
						WHERE
							a.StatusCode = "active"
						AND
							a.InvoicePeriodMonth = ?
						AND
							a.InvoicePeriodYear = ?
						AND
							c.CustomerID = ?';
					$query = $this->db->query($sql, array($month, $year, $val[1]));
					$row = $query->row_array();
					array_push($dataAmount, (int) $row["Amount"]);
				}
				$MonthList[$key]["data"] = $dataAmount;
			}
		}

		$return["CustomerList"] = $CustomerList;
		$return["MonthList"] = $MonthList;

		return $return;
	}

	function getDataOmset($quartal, $year)
	{
		$listMonth = $this->getListMonth($quartal);

		$newkey = 0;
		$valkey = 0;
		foreach ($listMonth as $key => $month) {
			$sql = "SELECT
					SUM(a.InvoiceAmount) Amount
				FROM
					mj_invoice a
				WHERE
					a.StatusCode = 'active'
				AND
					a.InvoicePeriodMonth = ?
				AND
					a.InvoicePeriodYear = ?
				LIMIT 1";
			$query = $this->db->query($sql, array($listMonth[$key], $year))->row_array();
			$return[$newkey]["Month"] = date("F", strtotime($year . "-" . $listMonth[$key] . "-01"));
			$return[$newkey]["Amount"] = ($query["Amount"] == '') ? 0 : (int)$query["Amount"];
			$valkey += $query["Amount"];

			$newkey++;

			if ((int)$listMonth[$key] / 3 == 1) {
				$return[$newkey]["Month"] = "Total Q1";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}

			if ((int)$listMonth[$key] / 3 == 2) {
				$return[$newkey]["Month"] = "Total Q2";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}

			if ((int)$listMonth[$key] / 3 == 3) {
				$return[$newkey]["Month"] = "Total Q3";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}

			if ((int)$listMonth[$key] / 3 == 4) {
				$return[$newkey]["Month"] = "Total Q4";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}
		}

		return $return;
	}

	function getDataLaba($quartal, $year)
	{
		$listMonth = $this->getListMonth($quartal);

		$newkey = 0;
		$valkey = 0;
		foreach ($listMonth as $key => $month) {
			$sql = "SELECT
					a.Pendapatan,
					( a.Proyek +
					a.Transport +
					a.Antigen +
					a.ATK +
					a.Entertaint +
					a.Materai +
					a.ADM +
					a.ART +
					a.PengirimanBarang +
					a.Iuran +
					a.ART2 +
					a.Pengobatan +
					a.BPJS +
					a.ListrikInet +
					a.Insentive +
					a.Salary +
					a.BiayaPenyusutan ) TotalPengeluaran,
					a.BiayaAdminBank
				FROM
					`mj_laba_rugi` a 
				WHERE
					a.`Month` = ? 
					AND a.`Year` = ?
				LIMIT 1";
			$query = $this->db->query($sql, array($listMonth[$key], $year))->row_array();
			$Amount = $query["Pendapatan"] - $query["TotalPengeluaran"] - $query["BiayaAdminBank"];
			$return[$newkey]["Month"] = date("F", strtotime($year . "-" . $listMonth[$key] . "-01"));
			$return[$newkey]["Amount"] = $Amount;
			$valkey += $Amount;

			$newkey++;

			if ((int)$listMonth[$key] / 3 == 1) {
				$return[$newkey]["Month"] = "Total Q1";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}

			if ((int)$listMonth[$key] / 3 == 2) {
				$return[$newkey]["Month"] = "Total Q2";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}

			if ((int)$listMonth[$key] / 3 == 3) {
				$return[$newkey]["Month"] = "Total Q3";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}

			if ((int)$listMonth[$key] / 3 == 4) {
				$return[$newkey]["Month"] = "Total Q4";
				$return[$newkey]["Amount"] = $valkey;

				$newkey++;
				$valkey = 0;
			}
		}

		return $return;
	}
}
