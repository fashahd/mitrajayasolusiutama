<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

	
	if (! function_exists('penyebut'))
	{
		function penyebut($nilai) {
			$nilai = abs($nilai);
			$huruf = array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
			$temp = "";
			if ($nilai < 12) {
				$temp = " ". $huruf[$nilai];
			} else if ($nilai <20) {
				$temp = penyebut($nilai - 10). " belas";
			} else if ($nilai < 100) {
				$temp = penyebut($nilai/10)." puluh". penyebut($nilai % 10);
			} else if ($nilai < 200) {
				$temp = " seratus" . penyebut($nilai - 100);
			} else if ($nilai < 1000) {
				$temp = penyebut($nilai/100) . " ratus" . penyebut($nilai % 100);
			} else if ($nilai < 2000) {
				$temp = " seribu" . penyebut($nilai - 1000);
			} else if ($nilai < 1000000) {
				$temp = penyebut($nilai/1000) . " ribu" . penyebut($nilai % 1000);
			} else if ($nilai < 1000000000) {
				$temp = penyebut($nilai/1000000) . " juta" . penyebut($nilai % 1000000);
			} else if ($nilai < 1000000000000) {
				$temp = penyebut($nilai/1000000000) . " milyar" . penyebut(fmod($nilai,1000000000));
			} else if ($nilai < 1000000000000000) {
				$temp = penyebut($nilai/1000000000000) . " trilyun" . penyebut(fmod($nilai,1000000000000));
			}     
			return $temp;
		}
	}

	if (! function_exists('terbilang'))
	{
		function terbilang($nilai) {
			if($nilai<0) {
				$hasil = "minus ". trim(penyebut($nilai));
			} else {
				$hasil = trim(penyebut($nilai));
			}     		
			return $hasil;
		}
	}

	if (! function_exists('getWeek'))
	{
		function getWeek($month, $year) {
			$firstday = date("w", mktime(0, 0, 0, $month, 1, $year)); 
            $lastday = date("t", mktime(0, 0, 0, $month, 1, $year)); 
            $count_weeks = 1 + ceil(($lastday-7+$firstday)/7);
            return $count_weeks;
		}
	}

	if (! function_exists('getExtension'))
	{
		function getExtension($path) {
			return pathinfo($path, PATHINFO_EXTENSION);
		}
	}

    if (! function_exists('getListDateWeek'))
	{
		function getListDateWeek($week, $startdate, $firstdate) {
            $listweek = array();
            for($i = 1; $i<=$week; $i++){
                $weekday    = date("w", $startdate);
                $nextday    = 7-$weekday;
                $endday     = abs($weekday-6);
                $startarr[$i] = $startdate;
                
                
                $endarr[$i] = strtotime(date("Y-m-d",$startdate)."+$endday day");
                $startdate  = strtotime(date("Y-m-d",$endarr[$i])."+1 day");
    
                
                if ($i == $week) {
                    $listweek[$i]["startdate"]   = date("Y-m-d", $startarr[$i]);
                    $listweek[$i]["endate"]   = date("Y-m-t", $firstdate);
                }else{
                    $listweek[$i]["startdate"]   = date("Y-m-d", $startarr[$i]);
                    $listweek[$i]["endate"]   = date("Y-m-d", $endarr[$i]);
                }
            }

            return $listweek;
		}
	}


	if (! function_exists('getUUID'))
	{
		function getUUID() {
			$CI = & get_instance();
			$query = $CI->db->query("select UUID_SHORT() as ID")->row()->ID;
			return $query;
		}
	}	

	if (! function_exists('GetFileExt'))
	{
		function GetFileExt($filename) {
			$arrTemp = explode(".", $filename);
			$ext = strtolower(array_values(array_slice($arrTemp, -1))[0]);
			return $ext;
		}
	}

	if (!function_exists('move_upload')) {
        function move_upload($fileUpload,$pathAndImageName)
        {

            $fields = array_keys($fileUpload);
            $CI =& get_instance();
            $getPath = explode('/', $pathAndImageName);
            $imageName = $getPath[count($getPath)-1];
            $path = implode('/',array_slice($getPath,0,count($getPath)-1));

            $config['upload_path'] = $path;
            $config['allowed_types'] = 'gif|jpg|jpeg|png|xlsx|xls|pdf|zip|mp4';
            $config['file_name']    = $imageName;
            // $config['max_width']  = '1024';
            // $config['max_height']  = '768';

            $CI->load->library('upload', $config);
            if (!$CI->upload->do_upload($fields[0])){
                $error = array('error' => $CI->upload->display_errors());
                return $error;
            } else {
                $data = array('upload_data' => $CI->upload->data());
                return $data;
            }


        }
    }
?>
