<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Auth extends MJ_Controller
{

    public function __construct()
    {
        parent::__construct(0);
        $this->load->library('session');
        $this->load->model('system');
    }

    public function login()
    {
        if (!empty($_SESSION['userid'])) {
            redirect(base_url(), 'refresh');
        }
        $_SESSION = array();
        $data['msg'] = $this->session->flashdata('msg');
        $data['api_url'] = $this->config->item('api');
		
        $this->load->view('auth/login', $data);
    }

	public function logout()
    {
        $_SESSION = array();
        redirect('auth/login', 'location');
    }
}
