<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Page extends REST_Controller {

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

    public function info_get()
    {
        $module     = $this->input->get('module');
        $data       = $this->mpage->getInfo($module);
        $this->set_response($data, 200);
    }

	public function information_grid_get()
    {
        echo $_SESSION['informationGrid'];exit;
    }

    public function information_grid_post()
    {
        echo $_SESSION['informationGrid'];exit;
    }
}
