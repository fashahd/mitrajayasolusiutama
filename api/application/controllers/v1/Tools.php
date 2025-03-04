<?php

defined('BASEPATH') or exit('No direct script access allowed');

//ini_set('display_errors',false);
//error_reporting(0);

//write excel
require_once 'application/third_party/Spout/Autoloader/autoload.php';
use Box\Spout\Common\Entity\Style\Border;
use Box\Spout\Common\Entity\Style\Color;
use Box\Spout\Writer\Common\Creator\Style\BorderBuilder;
use Box\Spout\Writer\Common\Creator\Style\StyleBuilder;
use Box\Spout\Writer\Common\Creator\WriterEntityFactory;

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Tools extends REST_Controller
{
	public function information_grid_get()
    {
        echo $_SESSION['informationGrid'];exit;
    }

    public function information_grid_post()
    {
        echo $_SESSION['informationGrid'];exit;
    }
	
    public function lang_c_POST()
    {
        $data['msg'] = lang($this->post('msg'));
        $data['title'] = lang($this->post('title'));
        $this->_output = array('success' => true, 'data' => $data);

        $this->response($this->_output, 200);
    }
}
