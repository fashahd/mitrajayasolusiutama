<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Common extends REST_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	

    public function __construct()
    {
        parent::__construct();
        $this->load->model('mpage');
    }

    public function revoke_post()
    {
        $uid = pack("H*", $this->post('uid'));
        $username = $uid;
        $pwd = $this->post('passwd');

		$getPassword = $this->MAuth->getPassword($username);

        if (md5($pwd) != $getPassword) {
            $this->response(array('msg' => 'Failed to revoke, please re-login!'), 400);
        } else {
			$getUserData = $this->MAuth->getUserData($username);
			if ($getUserData !== false) {
				foreach ($getUserData as $row) {
					$dataRes = array(
						"user_id" => $row->user_id,
						"username" => $row->username,
						"name"	=> $row->name,
						"user_status" => $row->user_status,
						"group_id"	=> $row->GroupID
					);
				}

				$_SESSION["user_id"] 	= $dataRes["user_id"];
				$_SESSION["name"] 		= $dataRes["name"];
				$_SESSION["username"] 	= $dataRes["username"];
				$_SESSION["groupid"] 	= $dataRes["group_id"];
				
				return $this->set_response([
					"status" => 200,
					"message" => "success",
					"data" => $dataRes
				], REST_Controller::HTTP_OK);
			}
            $this->response(array('msg' => 'Revoke success'), 200);
        }
    }
}
