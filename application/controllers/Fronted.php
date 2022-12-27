<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Fronted extends MJ_Controller {

	public function __construct() {
		parent::__construct(1);
		// $this->lang->load('dashboard');
        // $this->lang->load('home');
		$this->api = $this->config->item('api');
		$url = (index_page())?(base_url().index_page()):rtrim(base_url(),'/');
		$this->action = array(
            'url'           => $url,
            'api'           => $this->api,
            'daer'          => $_SESSION['daerah'],
            'partner'       => $_SESSION['FlagAccess'] == 1 ? $_SESSION['PartnerID'] : '',
            'path'			=> (index_page()?index_page().'/':'').'fronted/'.$this->router->fetch_method().'/',
		);
		$this->titlet = 'Dashboard > ';
	}
	
	public function page()
	{

		$sql = "SELECT
			m.MenuModule,
			m.MenuParam
		FROM
			sys_group g
		JOIN sys_menu m ON m.MenuId = GroupMenuID
		WHERE
			GroupId = ?
		";
        $group      = $this->system->GetSql($sql, array($_SESSION['groupid']));
        $tmp        = explode('/', $group[0]['MenuModule']);
        $module     = count($tmp)==2 ? ($group[0]['MenuModule'].'/index') : $group[0]['MenuModule'];
        $param      = ($group[0]['MenuParam']?('/'.$group[0]['MenuParam']):'');
        $default_module = $module.$param;
        if ($default_module) {
			$default_module = site_url($module.$param);
        }
        $data['action'] = $this->action;
		$data['default_module'] = $default_module;
        // echo '<pre>'; print_r($data); echo '</pre>';
		$this->LoadView($data, 'default');
	}
}
