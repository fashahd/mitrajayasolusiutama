<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

// use namespace
use Restserver\Libraries\REST_Controller;

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Group extends REST_Controller {
	function __construct()
    {
        // Construct the parent class
        parent::__construct();

		$this->load->model("mgroup");
	}

	function lists_get(){

		$pSearch["keySearch"] = filter_var($this->get("key"), FILTER_SANITIZE_STRING);
		
		//sort
        $sorting = json_decode($this->get('sort'));
        if (isset($sorting[0]->property)) {
            $sortingField = $sorting[0]->property;
        } else {
            $sortingField = null;
        }

        if (isset($sorting[0]->direction)) {
            $sortingDir = $sorting[0]->direction;
        } else {
            $sortingDir = null;
        }

        $start = (int) $this->get('start');
        $limit = (int) $this->get('limit');

        // echo '<pre>'; print_r($pSearch); exit;
        $data = $this->mgroup->list_group($pSearch, $start, $limit, 'limit', $sortingField, $sortingDir);
        $this->response($data, 200);
	}

	function list_get(){

		if (!$this->get('id')) {
            $this->response(null, 400);
        }

        $group = $this->mgroup->readGroup($this->get('id'));
        if ($group) {
            $this->response($group, 200);
        } else {
            $this->response(array('error' => 'Group could not be found'), 404);
        }
	}
	

    function groupaksilist_get() {
        $aksi = $this->mgroup->readGroupaksiList();
        if ($aksi)
            $this->response($aksi, 200);
        else
            $this->response(array('error' => 'Unit could not be found'), 404);
    }

    function groupaksi_get() {
        $aksi = $this->mgroup->readGroupaksi($this->get('id'));
        if ($aksi)
            $this->response($aksi, 200);
        else
            $this->response(array('error' => 'Unit could not be found'), 404);
    }

	function list_put(){
		if (!$this->put('GroupId'))
            $this->response(NULL, 400);
        $group = $this->mgroup->updateGroup(
                $this->put('GroupId'), $this->put('GroupName'), $this->put('GroupDescription'), $this->put('GroupUnitId'), $this->put('itemselector'), $this->put('itemselectorReport'), $this->put('GroupMenuId'),  $this->put('GroupFilterBy'), $_SESSION['user_id'], $this->put('GroupPartnerID'), $this->put('GroupMenuBusinessUnit')
        );
        if ($group)
            $this->response($group, 200);
        else
            $this->response(array('error' => 'Group could not be found'), 404);
	}

    function list_post() {
        if (!$this->post('GroupName'))
            $this->response(NULL, 400);
        $group = $this->mgroup->createGroup(
                $this->post('GroupName'), $this->post('GroupDescription'), $this->post('GroupUnitId'), $this->post('itemselector'),$this->post('itemselectorReport'), $this->post('GroupMenuId'), $this->post('GroupFilterBy'), $_SESSION['user_id'], $this->post('GroupPartnerID'), $this->post('GroupMenuBusinessUnit')
        );
        if ($group)
            $this->response($group, 200);
        else
            $this->response(array('error' => 'Group could not be found'), 404);
    }
}
