<?php

class MJ_Controller extends CI_Controller
{
	public function __construct($modId = '')
    {
		// session_start();
        parent::__construct();
        $this->autentication($modId);
        $this->setPageAccessLog();
        if (isset($_REQUEST['ajax'])) {
            $_SESSION['ajax'] = '1';
        }

		$this->params = $this->GetParam();

		
        //Sanitize parameters
        $this->SanitizeParam();
	}

    public function setPageAccessLog()
    {
        if ($_SESSION['userid'] != '') {
            $this->load->helper('security');
            $this->load->helper('url');
            // start transaction
            $this->db->trans_start(false);
            $result = $this->insertPageAccessLog($_SESSION['userid'], ip_address(), current_full_url());
            // end transactinon
            if ($result == true) {
                $this->db->trans_commit();
            } else {
                $this->db->trans_rollback();
            }
        }
    }	

    private function insertPageAccessLog($user_id, $ip_address, $page)
    {
        $PageAccessLogFolder = 'api/application/logs/';
        $namaFile = 'sys_log_page_access-' . strtotime(date('Y-m-d'));
        $result = array(
                        'UserID' => $user_id,
                        'SessionIP' => $ip_address,
                        'Page' => $page,
                        'DateUpdated' => date('Y-m-d H:i:s')
                    );
        // pengecekan tanggal file, klo ada append klo belum ada create file baru
        if(file_exists(FCPATH.$PageAccessLogFolder.$namaFile. '.log')){
            // append
            $fp = fopen($PageAccessLogFolder . $namaFile . '.log', 'a');
            fwrite($fp, json_encode($result).PHP_EOL);
            fclose($fp);
        }else{
            $fp = file_put_contents($PageAccessLogFolder . $namaFile . '.log', json_encode($result).PHP_EOL);
        }
        return true;
    }

	public function autentication($modId)
	{
		$func = $this->uri->segment(3);
		if ($func == '') {
			$func = 'index';
		}
		
		$mod    = $this->uri->segment(2);
		$module = ($mod != '' ? $this->uri->segment(1) . '/' . $mod : $this->router->default_controller);
		$param  = $this->uri->segment(4);
		$sql    = "SELECT GroupMenuSegmen as id FROM sys_group_menu_act WHERE GroupMenuGroupId=? and GroupMenuSegmen=?";
		if ($modId == '0') {
			return;
		}

		$this->mmod = $module . '/' . $func . ($param != '' ? '/' . $param : '');
		$cek        = $this->system->GetSql($sql, array($_SESSION['groupid'], $this->mmod));
		// echo '<pre>'; print_r($this->db->last_query()); echo '</pre>';

		if (($modId == '1' and $_SESSION['username'] != '') or $cek[0]['id'] != '') {
			//$this->setAccessLog(); di panggil ketika authentication login
			return;
		} elseif ($_SESSION['username'] == '') {
			//clear session
			$_SESSION = array();

			if ($this->input->is_ajax_request()) {
				show_error('Session Timeout', 401);
			}
			redirect('auth/login#' . $this->uri->uri_string(), 'location');
		} else {
			//clear session
			$_SESSION = array();

			show_error('No Access', 200);
			// exit('no access');
		}
	}

	public function LoadView($data = null, $template = 'template/content')
    {
        // $this->lang->load('common');
        // $this->lang->load('menu');
        // $this->lang->load($this->router->fetch_class());

        $sqlm = "SELECT
			p.MenuName AS parent,
			m.MenuName AS menu
			FROM sys_menu m
			LEFT JOIN sys_menu p ON p.MenuId = m.MenuParentId
			WHERE
			m.MenuModule = ?
			AND (m.MenuParam = ? OR '' = ?) AND m.MenuShow = 'Yes'";
        $patterns        = array();
        $patterns[0]     = '/\/index/';
        $patterns[1]     = '/\/\d+/';
        $replacements    = array();
        $replacements[0] = '';
        $replacements[1] = '';
        preg_match('/\d+/', $this->mmod, $param);
        $param = empty($param[0]) ? '' : $param[0];
        $mmod  = preg_replace($patterns, $replacements, $this->mmod);
        // echo '<pre>'; print_r($this->mmod); echo '</pre>';
        // echo '<pre>'; print_r($mmod); echo '</pre>';
        // exit;
        if (strpos($mmod, 'fronted/page') !== false) {
            $param = '';
        }
        $sqlmd = $this->system->GetSql($sqlm, array($mmod, $param, $param));

        if (empty($data['titlet'])) {
            if (!empty($sqlmd)) {
                $data['titlet']       = $sqlmd[0]['menu'];
                $data['breadcrumb_1'] = !empty($sqlmd[0]['parent']) ? $sqlmd[0]['parent'] : $sqlmd[0]['menu'];
                $data['breadcrumb_2'] = $sqlmd[0]['menu'];
            } else {
                $data['titlet'] = 'Dashboard';
            }
        }
        $segmen          = $mmod . '/index';
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>';
        // echo '<pre>'; print_r($sqlmd); echo '</pre>'; 
		// exit;

        if (isset($_SESSION['ajax'])) {
            // $this->load->view('common_lang', array('lang' => $this->lang->all_lines()));
            $this->load->view($template, $data);
            unset($_SESSION['ajax']);
        } else {

            $sql['get_parent_menu'] = "SELECT m.MenuName, m.MenuId, m.MenuParentId, m.MenuModule, m.MenuIcon, m.MenuParam, mm.MenuModule AS child_module, MIN(mm.MenuParam) AS child_param, IF(mm2.MenuParentId, 1, 0) AS has_granchild
            FROM sys_group_menu_act
            LEFT JOIN sys_menu_act ON GroupMenuMenuAksiId=MenuAksiId
            LEFT JOIN sys_menu m ON MenuAksiMenuId=MenuId
            LEFT JOIN (
               SELECT
                  m.MenuParentId,
                  m.MenuModule,
                  m.MenuParam
               FROM sys_group_menu_act ga
               JOIN sys_menu_act ma ON ma.MenuAksiId = ga.GroupMenuMenuAksiId
               JOIN sys_menu m ON m.MenuId = ma.MenuAksiMenuId
               WHERE
                  m.MenuShow='Yes' AND m.MenuParam
                  AND ga.GroupMenuGroupId = ?
               ORDER BY m.MenuId
            ) mm ON mm.MenuParentId = m.MenuId
            LEFT JOIN (
               SELECT
                  m.MenuParentId
               FROM sys_group_menu_act ga
               JOIN sys_menu_act ma ON ma.MenuAksiId = ga.GroupMenuMenuAksiId
               JOIN sys_menu m ON m.MenuId = ma.MenuAksiMenuId
               JOIN sys_menu m2 ON m2.MenuParentId = m.MenuId
               WHERE m.MenuShow='Yes'
                  AND m.MenuParentId
                  AND ga.GroupMenuGroupId = ?
                  ORDER BY m.MenuId
            ) mm2 ON mm2.MenuParentId = m.MenuId
            %s
            WHERE m.MenuParentId = 0 AND GroupMenuGroupId=? AND m.MenuShow='Yes' %s
            GROUP BY MenuId
            ORDER BY m.MenuParentId,m.MenuOrder,m.MenuName";

            $sql['get_child_menu'] = "SELECT mm.MenuName, mm.MenuId, mm.MenuParentId,mm.MenuModule,mm.MenuIcon,mm.MenuParam,mm2.MenuModule AS child_module, MIN(mm2.MenuParam) AS child_param
            FROM sys_group_menu_act
            LEFT JOIN sys_menu_act ON GroupMenuMenuAksiId=MenuAksiId
            LEFT JOIN sys_menu mm ON MenuAksiMenuId=mm.MenuId
            LEFT JOIN (
               SELECT
                  m.MenuParentId,
                  m.MenuModule,
                  m.MenuParam
               FROM sys_group_menu_act ga
               JOIN sys_menu_act ma ON ma.MenuAksiId = ga.GroupMenuMenuAksiId
               JOIN sys_menu m ON m.MenuId = ma.MenuAksiMenuId
               WHERE
                  m.MenuShow='Yes' AND m.MenuParam
                  AND ga.GroupMenuGroupId = ?
               ORDER BY m.MenuId
            ) mm2 ON mm2.MenuParentId = mm.MenuId
            %s
            WHERE GroupMenuGroupId=? AND mm.MenuParentId = ? AND mm.MenuShow='Yes' %s
            GROUP BY mm.MenuId
            ORDER BY mm.MenuParentId,mm.MenuOrder,mm.MenuName";
            $menu = $this->system->GetSql(sprintf($sql['get_parent_menu'], $sql_left, $sql_where), array($_SESSION['groupid'], $_SESSION['groupid'], $_SESSION['groupid']));
            // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;
            foreach ($menu as $key => $value) {
                if (!empty($value['child_module']) and !empty($value['child_param'])) {
                    $menu[$key]['child'] = array();
                } else /*if(!empty($value['has_granchild']))*/{
                    $menu[$key]['child'] = $this->system->GetSql(sprintf($sql['get_child_menu'], $sql_left, $sql_where), array($_SESSION['groupid'], $_SESSION['groupid'], $value['MenuId']));
                    // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;
                }
            }
            $data_header['menus'] = $menu;
            // echo '<pre>'; print_r($menu); echo '</pre>'; exit;


            // list group
            $sql_group = "SELECT
				g.GroupId AS id
				, g.GroupName AS `name`
				, UserGroupIsDefault  AS is_default
				FROM
				sys_user_group ug
				JOIN sys_group g ON g.GroupId = ug.UserGroupGroupId
				WHERE
				ug.UserGroupUserId = ?
         	";
            $query                 = $this->db->query($sql_group, array($_SESSION['userid']));
            $data_header['groups'] = $query->num_rows() > 0 ? $query->result_array() : array();
            $sql_group             = "SELECT
				g.GroupId AS id
				, g.GroupName AS `name`
				FROM sys_group g
				WHERE
				g.GroupId = ?
         	";
            $query                        = $this->db->query($sql_group, array($_SESSION['groupid']));

            $data_header['current_group'] = $query->num_rows() > 0 ? $query->row_array(0) : array();
            $data_header['url_awss3'] = $this->config->item('CTCDN');
            $data_footer['url_awss3'] = $this->config->item('CTCDN');

            //Add variabel js m_
            $data['action']['label_prov'] = $_SESSION['LabelProvince'];
            $data['action']['label_dis'] = $_SESSION['LabelDistrict'];
            $data['action']['label_subd'] = $_SESSION['LabelSubDistrict'];
            $data['action']['label_vil'] = $_SESSION['LabelVillage'];

            $this->load->view('template/header', $data_header);
            $data['action']['url'] = (index_page()) ? (base_url() . index_page()) : rtrim(base_url(), '/');
            $data['action']['api'] = $this->api = $this->config->item('api');
            $data['action']['lang'] = $_SESSION['language'];
            $this->load->view($template, $data);
            $this->load->view('template/footer', $data_footer);
        }
    }

    public function GetParam()
    {
        $this->method = $_SERVER["REQUEST_METHOD"];
        if ($this->method == 'PUT') {
            // <-- Have to jump through hoops to get PUT data
            $raw         = '';
            $httpContent = fopen('php://input', 'r');
            while ($kb = fread($httpContent, 1024)) {
                $raw .= $kb;
            }
            fclose($httpContent);
            $params = array();
            parse_str($raw, $params);

            if (isset($params['data'])) {
                $this->params = json_decode(stripslashes($params['data']));
            } else {
                $params       = json_decode(stripslashes($raw));
                $this->params = $params->data;
            }
        } else {
            // grab JSON data if there...
            $this->params = (isset($_REQUEST['data'])) ? json_decode(stripslashes($_REQUEST['data'])) : null;

            if (isset($_REQUEST['data'])) {
                $this->params = json_decode(stripslashes($_REQUEST['data']));
            } else {
                $raw         = '';
                $httpContent = fopen('php://input', 'r');
                while ($kb = fread($httpContent, 1024)) {
                    $raw .= $kb;
                }
                $params = json_decode(stripslashes($raw));
                if ($params) {
                    $this->params = $params->data;
                }
            }
        }
        return $this->params;
    }

	

    private function SanitizeParam(){
        $varParamGet = $_GET;
        foreach ($varParamGet as $key => $value) {
            //Check Valid JSON or not
            if($this->isJson($value)){
                $varParamGet[$key] = $value;
            }else{
                if(is_array($value)){
                    $varParamGet[$key] = $value;
                }else{
                    $varParamGet[$key] = filter_var($value, FILTER_SANITIZE_STRING);
                }
            }
        }
        $_GET = $varParamGet;

        $varParamPost = $_POST;
        foreach ($varParamPost as $key => $value) {
            //Check Valid JSON or not
            if($this->isJson($value)){
                $varParamPost[$key] = $value;
            }else{
                if(is_array($value)){
                    $varParamPost[$key] = $value;
                }else{
                    $varParamPost[$key] = filter_var($value, FILTER_SANITIZE_STRING);
                }
            }
        }
        $_POST = $varParamPost;
    }

    private function isJson($str) {
        //kalau array langsung true, tak usah dicek
        if(is_array($str)){
            return true;
        }
        $json = json_decode($str);
        return $json && $str != $json;
    }
}

?>
