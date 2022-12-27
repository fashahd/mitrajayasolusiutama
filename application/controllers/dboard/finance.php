<?php
/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Mon Feb 03 2020
 *  File : fardem.php
 *******************************************/
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Finance extends MJ_Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index() {
        $data['js'] = 'dboard/finance';
        $api = $this->config->item('api');

        $data['action'] = array(
            'api_base_url' => $this->config->item('api_base_url'),
            'base_url' => base_url(),
            'partner_id' => (int) $_SESSION['PartnerID'],
            'FilterPartnerID' => $_SESSION['FilterPartnerID'],
            'PartnerAsParent' => $_SESSION['PartnerAsParent']
        );
        
        $this->LoadView($data,'dboard/finance');
    }
}
