<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mneraca extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function getLastMonth($month, $year){

		$listmonth = array();
		for($i = 0; $i<$month;$i++){
			$val = $i+1;
			$value = ($val < 10) ? "0".$val  : $val ;
			array_push($listmonth, "'".$value."'");
		}

		array_pop($listmonth);

		$listmonth = implode(",",$listmonth);
		$listmonth = ($listmonth == "")? 0 : $listmonth;

		$sql = "SELECT
            IFNULL(SUM(Proyek), 0) Proyek
            , IFNULL(SUM(Transport), 0) Transport
            , IFNULL(SUM(Antigen), 0) Antigen
            , IFNULL(SUM(ATK), 0) ATK
            , IFNULL(SUM(Entertaint), 0) Entertaint
            , IFNULL(SUM(Materai), 0) Materai
            , IFNULL(SUM(ADM), 0) ADM
            , IFNULL(SUM(ART), 0) ART
            , IFNULL(SUM(ART2), 0) ART2
            , IFNULL(SUM(PengirimanBarang), 0) PengirimanBarang
            , IFNULL(SUM(Iuran), 0) Iuran
			, IFNULL(SUM(Pengobatan), 0) Pengobatan
            , IFNULL(SUM(BPJS), 0) BPJS
            , IFNULL(SUM(ListrikInet), 0) ListrikInet
            , IFNULL(SUM(Insentive), 0) Insentive
            , IFNULL(SUM(Salary), 0) Salary
            , IFNULL(SUM(BiayaPenyusutan), 0) BiayaPenyusutan
            , IFNULL(SUM(BiayaAdminBank), 0) BiayaAdminBank
            , IFNULL(SUM(Pendapatan), 0) Pendapatan
            , IFNULL(SUM(TotalBiayaOperasional), 0) TotalBiayaOperasional
            , IFNULL(SUM(TotalPendapatanLain), 0) TotalPendapatanLain
            , IFNULL(SUM(LabaRugi), 0) LabaRugi
        FROM
            `mj_laba_rugi`
        WHERE
            `Month` IN ($listmonth)
        AND
            `Year` = ?
        ";

        $query = $this->db->query($sql, array($year));

		// echo "<pre>";print_r($this->db->last_query());die;

        $result = array();
        if($query->num_rows()>0){
            foreach($query->row_array() as $row => $value){
                $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-".$row."CalculateTemp"] = $value;
                $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-".$row."Calculate"] = $value;
            }
        }else{			
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculate"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculate"] = 0;
			
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculateTemp"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculateTemp"] = 0;
        }

		return $result;
	}

    public function getDataLabaRugiForm($month, $year){
        
        $month  = ($month == "") ? date("m") : $month;
        $year   = ($year == "") ? date("Y") : $year;
		$lastmonth = $this->getLastMonth($month, $year);
	
        $sql = "SELECT
            Month
            , Year
            , IFNULL(Proyek, 0) Proyek
            , IFNULL(Transport, 0) Transport
            , IFNULL(Antigen, 0) Antigen
            , IFNULL(ATK, 0) ATK
            , IFNULL(Entertaint, 0) Entertaint
            , IFNULL(Materai, 0) Materai
            , IFNULL(ADM, 0) ADM
            , IFNULL(ART, 0) ART
            , IFNULL(ART2, 0) ART2
            , IFNULL(PengirimanBarang, 0) PengirimanBarang
            , IFNULL(Iuran, 0) Iuran
			, IFNULL(Pengobatan, 0) Pengobatan
            , IFNULL(BPJS, 0) BPJS
            , IFNULL(ListrikInet, 0) ListrikInet
            , IFNULL(Insentive, 0) Insentive
            , IFNULL(Salary, 0) Salary
            , IFNULL(BiayaPenyusutan, 0) BiayaPenyusutan
            , IFNULL(BiayaAdminBank, 0) BiayaAdminBank
            , IFNULL(Pendapatan, 0) Pendapatan
            , IFNULL(TotalBiayaOperasional, 0) TotalBiayaOperasional
            , IFNULL(TotalPendapatanLain, 0) TotalPendapatanLain
            , IFNULL(LabaRugi, 0) LabaRugi
        FROM
            `mj_laba_rugi`
        WHERE
            `Month` = ?
        AND
            `Year` = ?
        LIMIT 1";

        $query = $this->db->query($sql, array($month, $year));

        $result = array();
        if($query->num_rows()>0){
            foreach($query->row_array() as $row => $value){
                $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-".$row] = $value;
            }
        }else{
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Month"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Year"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Proyek"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Transport"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Antigen"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATK"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Entertaint"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Materai"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pengobatan"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADM"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarang"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Iuran"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJS"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInet"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Insentive"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Salary"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutan"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBank"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pendapatan"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasional"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLain"] = 0;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugi"] = 0;
        }

        $return["success"] = true;
        $return["data"] = array_merge($result,$lastmonth);

        return $return;
    }

    public function getDataForm($month, $year){
        $month  = ($month == "") ? date("m") : $month;
        $year   = ($year == "") ? date("Y") : $year;

        $sql = "SELECT
            Month
            ,Year
            ,Kas
            ,KasKecil
            ,Bank1
            ,Bank2
            ,PiutangKaryawan
            ,Persediaan
            ,PiutangDagang
            ,PajakDimuka
            ,TotalAktivaLancar
            ,PerlengkapanKantor
            ,Akumulasi
            ,TotalAktivTetap
            ,Total
            ,HutangDireksi
            ,HutangPajak
            ,LabaRugiBertahan
            ,LabaRugiBerjalan
            ,Modal
            ,TotalPasiva
        FROM
            `mj_neraca`
        WHERE
            `Month` = ?
        AND
            `Year` = ?
        LIMIT 1";

        $query = $this->db->query($sql, array($month, $year));

        $result = array();
        if($query->num_rows()>0){
            foreach($query->row_array() as $row => $value){
                $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-".$row] = $value;
            }
        }else{
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Month"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Year"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Kas"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-KasKecil"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank1"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank2"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangKaryawan"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Persediaan"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangDagang"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PajakDimuka"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivaLancar"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PerlengkapanKantor"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Akumulasi"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivTetap"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Total"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangDireksi"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangPajak"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBertahan"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Modal"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBerjalan"] = null;
            $result["MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalPasiva"] = null;
        }

        $return["success"] = true;
        $return["data"] = $result;

        return $return;
    }

    public function submit($post)
    {
        $sql    = "SELECT * FROM mj_neraca WHERE month = ? AND year = ? LIMIT 1";
        $query  = $this->db->query($sql, array($post["month"], $post["year"]));

        if($query->num_rows()>0){
            $month = $post["month"];
            $year = $post["year"];

            unset($post["month"]);
            unset($post["year"]);

            $this->db->where("month", $month);
            $this->db->where("year", $year);
            $update = $this->db->update("mj_neraca", $post);
        }else{
            $update = $this->db->insert("mj_neraca", $post);
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
