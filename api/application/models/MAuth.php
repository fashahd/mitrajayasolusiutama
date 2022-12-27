<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	class MAuth extends CI_Model {
		public function getUsername($username) {
			$sql = "select username from mj_user where username = '".$username."'";
			$query = $this->db->query($sql);
			if ($query->num_rows() > 0) {
				$rows	= $query->row();
				$username  	= $rows->username;
				return $username;
			} else {
				return false;
			}
		}

        public function getPassword($username) {
			$sql = "select password from mj_user where username = '".$username."'";
			$query = $this->db->query($sql);
			if ($query->num_rows() > 0) {
				$rows	= $query->row();
				$password  	= $rows->password;
				return $password;
			} else {
				return false;
			}
		}

        public function getUserData($username) {
			$sql = "SELECT
				a.user_id
				, a.username
				, a.`name`
				, b.UserGroupGroupId GroupID
				, a.user_status
			FROM
				mj_user a
			JOIN
				sys_user_group b on b.UserGroupUserId = a.user_id AND b.UserGroupIsDefault = '1'
			WHERE
				a.username = ?";
			$query = $this->db->query($sql, array($username));
			if ($query->num_rows() > 0) {
				return $query->result();
			} else {
				return false;
			}
		}

		public function CleanupTempFiles()
		{
			$this->load->helper('file');
	
			$ArrFiles = array(
				'files/tmp/',
				'files/offline_metadata/',
				'files/offline_metadata_devel/',
				'files/export_excel_temp/'
			);
			for ($i = 0; $i < count($ArrFiles); $i++) {
				$DirPath = $ArrFiles[$i];
				$this->rrmdir($DirPath, $DirPath);
			}
	
			$return['success'] = true;
			$return['message'] = 'Process Finished';
			return $return;
		}

		public function GenTokenApiCall($userid, $url_save)
		{
			//generate token
			$token = md5(substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(20 / strlen($x)))), 1, 20));
	
			/* insert nya di buat upload ke S3 */
			$tokenFolder = 'application/logs/';
			$namaFile = 'sys_user_api_token-' . strtotime(date('Y-m-d'));
			$result = array(
							'UserId' => $userid,
							'UserToken' => $token,
							'UrlApi' => $url_save,
							'DateUpdated' => date('Y-m-d H:i:s')
						);
			// pengecekan tanggal file, klo ada append klo belum ada create file baru
			if(file_exists(FCPATH.$tokenFolder.$namaFile. '.log')){
				// append
				$fp = fopen($tokenFolder . $namaFile . '.log', 'a');
				fwrite($fp, json_encode($result).PHP_EOL);
				fclose($fp);
			}else{
				$fp = file_put_contents($tokenFolder . $namaFile . '.log', json_encode($result).PHP_EOL);
			}
			return $token;
			
			/*
			$sql = "INSERT INTO sys_user_api_token (UserId,UserToken,UrlApi,DateUpdated)
				VALUES (?,?,?,NOW())
				ON DUPLICATE KEY UPDATE
					UserToken = ?,
					DateUpdated = NOW()
				";
			$p = array(
				$userid, $token, $url_save,
				$token
			);
			$query = $this->db->query($sql, $p);
	
			if ($query == true) {
				return $token;
			} else {
				return false;
			}
			*/
		}
	}
?>
