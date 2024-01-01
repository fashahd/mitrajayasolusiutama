<?php
defined('BASEPATH') or exit('No direct script access allowed');
require APPPATH . '/libraries/JWT.php';
require APPPATH . '/libraries/Key.php';
require APPPATH . '/libraries/ExpiredException.php';
require APPPATH . '/libraries/BeforeValidException.php';
require APPPATH . '/libraries/SignatureInvalidException.php';
require APPPATH . '/libraries/JWK.php';

require APPPATH . '/libraries/REST_Controller.php';

use Restserver\Libraries\REST_Controller;
use \Firebase\JWT\JWT;
use Firebase\JWT\Key;
use \Firebase\JWT\ExpiredException;

class Auth extends REST_Controller
{

	public function listUser_get()
	{
		$getAllUser = $this->MAuth->getAllUser();

		$listUser = null;
		if ($getAllUser) {
			foreach ($getAllUser as $row => $val) {
				$listUser = $val;
			}

			if (!empty($listUser)) {
				return $this->set_response($listUser, REST_Controller::HTTP_OK);
			} else {
				return $this->set_response([
					'status' => FALSE,
					'message' => 'empty user'
				], REST_Controller::HTTP_NOT_FOUND);
			}
		} else {
			return $this->set_response([
				'status' => FALSE,
				'message' => 'empty user'
			], REST_Controller::HTTP_NOT_FOUND);
		}
	}

	public function login_post()
	{
		$data = $this->post();

		if (isset($data)) {
			$getUsername = $this->MAuth->getUsername($data["username"]);
			if ($getUsername !== "") {
				$getPassword = $this->MAuth->getPassword($data["username"]);
				if (md5($data["password"]) == $getPassword) {
					$getUserData = $this->MAuth->getUserData($data["username"]);
					if ($getUserData !== false) {
						foreach ($getUserData as $row) {
							$dataRes = array(
								"user_id" => $row->user_id,
								"username" => $row->username,
								"name"	=> $row->name,
								"user_status" => $row->user_status,
								"group_id" => $row->GroupID,
								"people_id"	=> $row->people_id,
								"partner_id" => $row->PartnerID,
								"role_id" => $row->RoleID
							);
						}

						$_SESSION["user_id"] = $dataRes["user_id"];
						$_SESSION["name"] = $dataRes["name"];
						$_SESSION["username"] = $dataRes["username"];
						$_SESSION["groupid"] = $dataRes["group_id"];
						$_SESSION["partner_id"] = $dataRes["partner_id"];
						$_SESSION["people_id"] = $dataRes["people_id"];
						$_SESSION["role_id"] = $dataRes["role_id"];

						return $this->set_response([
							"status" => 200,
							"message" => "success",
							"data" => $dataRes
						], REST_Controller::HTTP_OK);
					} else {
						return $this->set_response([
							"status" => 500,
							"message" => "Empty User Data"
						], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
					}
				} else {
					return $this->set_response([
						"status" => 500,
						"message" => "Wrong Username / Password"
					], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
				}
			} else {
				return $this->set_response([
					"status" => 500,
					"message" => "Username Not Found"
				], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
			}
		} else {
			return $this->set_response([
				"status" => 500,
				"message" => "Internal Server Error"
			], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	public function register_post()
	{
		$data = $this->post();

		if (isset($data)) {
			$saveUserData = $this->MAuth->saveUserData($data->username, md5($data->password), $data->user_status);
			if ($saveUserData == true) {
				return $this->set_response([
					"status" => 200,
					"message" => "success register user"
				], REST_Controller::HTTP_OK);
			} else {
				return $this->set_response([
					"status" => 500,
					"message" => "failed register user"
				], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
			}
		} else {
			return $this->set_response([
				"status" => 500,
				"message" => "empty json data"
			], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	public function deleteUser_post()
	{
		$data = $this->post();

		if (isset($data)) {
			$deleteUser = $this->MAuth->deleteUser($data->user_id);
			if ($deleteUser == true) {
				return $this->set_response([
					"status" => 200,
					"message" => "success delete user"
				], REST_Controller::HTTP_OK);
			} else {
				return $this->set_response([
					"status" => 500,
					"message" => "failed delete user"
				], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
			}
		} else {
			return $this->set_response([
				"status" => 500,
				"message" => "empty json data"
			], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	public function updateUser_post()
	{
		$data = $this->post();

		if (isset($data)) {
			$updateUser = $this->MAuth->updateUser($data->user_id, $data->username, md5($data->password), $data->user_status);
			if ($updateUser == true) {
				return $this->set_response([
					"status" => 200,
					"message" => "success edit user"
				], REST_Controller::HTTP_OK);
			} else {
				return $this->set_response([
					"status" => 500,
					"message" => "failed edit user"
				], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
			}
		} else {
			return $this->set_response([
				"status" => 500,
				"message" => "empty json data"
			], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	public function api_token_post()
	{
		$userid = $_SESSION['userid'];
		$url_post = $this->post('url_call');
		$temp = substr($url_post, strpos($url_post, "api"));
		$temp = str_replace('api/index.php/', '', $temp);
		$temp = str_replace('api/', '', $temp);
		$temp = str_replace('/index.php/', '', $temp);
		$arrTmp = explode('?', $temp);
		$url_save = $arrTmp[0];

		$proses = $this->MAuth->GenTokenApiCall($userid, $url_save);
		if ($proses != false) {
			$result['success'] = true;
			$result['token'] = $proses;
			$this->response($result, 200);
		} else {
			$result['success'] = false;
			$result['message'] = 'Failed to generate token';
			$this->response($result, 400);
		}
	}

	public function change_password_post()
	{

		$varPost = $_POST;
		$paramPost = array();

		foreach ($varPost as $key => $value) {
			$keyNew = str_replace("MitraJaya_view_Admin_Vendor_MainForm-FormBasicData-", '', $key);
			if ($value == "") {
				$value = null;
			}
			$paramPost[$keyNew] = $value;
		}

		$auth = $this->MAuth->CheckOldPassword($paramPost["OldPassword"]);
		if (!$auth) {
			$result['success'] = false;
			$result['message'] = 'Old Password Not Valid';
			$this->response($result, 400);
			return;
		}

		$change = $this->MAuth->UpdatePassword($paramPost["NewPassword"]);

		if ($change) {
			$result['success'] = true;
			$result['message'] = 'Password Changed';
			$this->response($result, 200);
			return;
		} else {
			$result['success'] = false;
			$result['message'] = 'Failed to Change Password';
			$this->response($result, 400);
			return;
		}
	}
}
