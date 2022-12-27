<?php

class System extends CI_Model
{

    public function Model()
    {
        parent::Model();
    }

	
    public function GetSql($sql, $arrayParam)
    {
        $query  = $this->db->query($sql, $arrayParam);
        $result = $query->result_array();
        return $result;
    }

    public function CekAksi($func, $module = '')
    {
        if ($module == '') {
            $module = $this->uri->segment(1) . '/' . $this->uri->segment(2);
        }

        $sql    = "SELECT GroupMenuSegmen as id FROM sys_group_menu_act WHERE GroupMenuGroupId=? and GroupMenuSegmen like ?";
        $query  = $this->db->query($sql, array($_SESSION['groupid'], $module . '/' . $func . '%'));
        $result = $query->result_array();
        if ($result[0]['id'] == '') {
            return false;
        } else {
            return true;
        }

    }
}
