<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mgroup extends CI_Model {
	public function __construct()
    {
        parent::__construct();
    }

	public function list_group($pSearch, $start, $limit, $opsiLimit = 'limit', $sortingField, $sortingDir){

        if ($sortingField == "") $sortingField = 'GroupName';
        if ($sortingDir == "") $sortingDir = 'ASC';

		($pSearch["keySearch"] != '') ? $this->db->like("GroupName", $pSearch["keySearch"]) : "";

		$this->db->where("a.StatusCode", "active");
		$this->db->limit($limit, $start);
		$this->db->order_by($sortingField, $sortingDir);
		$this->db->group_by("GroupId");
		$this->db->join("sys_user_group c", " c.UserGroupGroupId = a.GroupId", "left");
		$this->db->join("mj_user d", " d.`user_id` = c.`UserGroupUserId` and d.`user_status` = '1'", "left");
		$this->db->select("SQL_CALC_FOUND_ROWS a.GroupId", false);
		$this->db->select("
			a.GroupName
			, a.GroupDescription
			, count(d.user_id) AS ActiveUser
			, IF(a.GroupActive = 'Yes', 'Active', 'Not Active') AS GroupStatus
		");
		$query = $this->db->get("sys_group a");

		$data = $query->result_array();
        // $result['sql'] = $this->db->last_query();
        $result['data'] = $data;
        // echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;

        $query = $this->db->query('SELECT FOUND_ROWS() AS total');
        $result['total'] = $query->row()->total;

        if ($sortingDir == 'ASC') {
            $sortingInfo = 'ascending';
        }
        if ($sortingDir == 'DESC') {
            $sortingInfo = 'descending';
        }

        $_SESSION['informationGrid'] = '
            <div class="Sfr_BoxInfoDataGrid_Title"><strong>' . number_format($query->row()->total, 0, ".", ",") . '</strong> ' . 'Data' . '</div>
            <ul class="Sft_UlListInfoDataGrid">
                <li class="Sft_ListInfoDataGrid">
                    <img class="Sft_ListIconInfoDataGrid" src="' . base_url() . 'assets/icons/font-awesome/svgs/solid/arrow-up-wide-short.svg" width="20" />&nbsp;&nbsp;Sorted by ' . $sortingField . ' ' . $sortingInfo . '
                </li>
            </ul>';

        return $result;
	}

	

    public function readGroup($id)
    {
        $sql = "SELECT
                   a.GroupId
                  , a.GroupName
                  , a.GroupDescription
                  , a.RoleID
                  , a.GroupMenuTemID
                  , a.GroupMenuId
                  , a.GroupFilterBy
                  , IF(a.GroupPartnerID = 0, '', a.GroupPartnerID) as GroupPartnerID
            FROM
                sys_group as a
            WHERE
                a.GroupId = ? ";
        $query = $this->db->query($sql, array($id));
        $result = $query->result_array();
        return $result[0];
    }

	

    function readGroupaksiList(){
        $sql = "
                SELECT
                    DISTINCT(e.MenuAksiId) AS `value`,
                    a.MenuId,
                    b.AksiId,
                    COUNT(z.MenuId) AS child,
                    -- if(b.AksiId=1,if(a.MenuParentId=0,a.MenuName,concat(c.MenuName,' / ',a.MenuName)),concat(c.MenuName,' / ',a.MenuName,' / ',AksiName)) as text
                    IF(a.MenuParentId = 0,
                        IF(b.AksiId = 1, a.MenuName, CONCAT(a.MenuName,' / ',AksiName)),
                        IF(c.MenuParentId = 0,
                            IF(b.AksiId = 1, CONCAT(c.MenuName,' / ',a.MenuName), CONCAT(c.MenuName,' / ',a.MenuName,' / ',AksiName)),
                            IF(b.AksiId = 1, CONCAT(d.MenuName,' / ',c.MenuName,' / ',a.MenuName), CONCAT(d.MenuName,' / ',c.MenuName,' / ',a.MenuName,' / ',AksiName))
                        )
                    ) AS `text`
                FROM sys_menu_act e
                    LEFT JOIN sys_menu a ON MenuAksiMenuId=MenuId
                    LEFT JOIN sys_act b ON MenuAksiAksiId=AksiId
                    LEFT JOIN sys_menu c ON c.MenuId = a.MenuParentId
                    LEFT JOIN sys_menu d ON d.MenuId = c.MenuParentId
                    LEFT JOIN sys_menu z ON a.MenuId = z.MenuParentId
                WHERE
                    a.MenuShow='Yes'
                GROUP BY e.MenuAksiId
                ORDER BY text

                ";
        $query = $this->db->query($sql);
        //echo '<pre>'; print_r($this->db->last_query()); echo '</pre>'; exit;
        $result = $query->result_array();
        return $result;
    }

    function readGroupaksi($id){
        $sql = "SELECT
                    e.MenuAksiId as value,
                    a.MenuId,
                    b.AksiId,
                    COUNT(z.MenuId) AS child,
                    -- if(b.AksiId=1,if(a.MenuParentId=0,a.MenuName,concat(c.MenuName,' / ',a.MenuName)),concat(c.MenuName,' / ',a.MenuName,' / ',AksiName)) as text
                    IF(a.MenuParentId = 0,
                        IF(b.AksiId = 1, a.MenuName, CONCAT(a.MenuName,' / ',AksiName)),
                        IF(c.MenuParentId = 0,
                            IF(b.AksiId = 1, CONCAT(c.MenuName,' / ',a.MenuName), CONCAT(c.MenuName,' / ',a.MenuName,' / ',AksiName)),
                            IF(b.AksiId = 1, CONCAT(d.MenuName,' / ',c.MenuName,' / ',a.MenuName), CONCAT(d.MenuName,' / ',c.MenuName,' / ',a.MenuName,' / ',AksiName))
                        )
                    ) AS `text`
                FROM sys_menu_act e
                    left join sys_menu a on MenuAksiMenuId=MenuId
                    left join sys_act b on MenuAksiAksiId=AksiId
                    left join sys_group_menu_act g on g.GroupMenuMenuAksiId=e.MenuAksiId and g.GroupMenuGroupId=?
                    left join sys_menu c on c.MenuId = a.MenuParentId
                    LEFT JOIN sys_menu d ON d.MenuId = c.MenuParentId
                    LEFT JOIN sys_menu z ON a.MenuId = z.MenuParentId
                WHERE
                    a.MenuShow='Yes' AND
                    g.GroupMenuMenuAksiId IS NOT NULL
                GROUP BY e.MenuAksiId
                ORDER BY text";

        $query = $this->db->query($sql, array($id));

        $result = $query->result_array();
		
        return $result;
    }	

    function updateGroup($id,$name,$description,$unitid,$aksi,$listReport,$menuid,$filterby,$userid,$partnerid,$GroupMenuBusinessUnit,$GroupRoleID){
        if (empty($partnerid)) {
            $partnerid = 0;
        }

        $sql = "
            UPDATE sys_group
            SET GroupName=?,GroupDescription=?,GroupUnitId=?,GroupMenuId=?,GroupFilterBy=?,GroupUpdateUserId=?,GroupUpdateTime=now(),GroupPartnerID=?,RoleID=?
            WHERE GroupId=?";
        $sql_aksi_delete = "
            DELETE FROM sys_group_menu_act WHERE GroupMenuGroupId=?";
        $sql_aksi_add = "
            INSERT IGNORE INTO sys_group_menu_act(GroupMenuMenuAksiId,GroupMenuGroupId,GroupMenuSegmen)
            SELECT MenuAksiId,?,concat(MenuModule,'/',AksiFungsi,IF(MenuParam!='',concat('/',MenuParam),''))
            FROM sys_menu_act
            LEFT JOIN sys_menu ON MenuAksiMenuId=MenuId
            LEFT JOIN sys_act ON MenuAksiAksiId=AksiId
            where MenuAksiId=?";
			
        $this->db->trans_start();
        $this->db->query($sql, array($name,$description,$unitid,$menuid,$filterby,$userid,$partnerid,$GroupRoleID,$id));
        $this->db->query($sql_aksi_delete, array($id));
        $arrAksi = explode(',', $aksi);
        for ($i=0;$i<sizeof($arrAksi);$i++) {
            $this->db->query($sql_aksi_add, array($id,$arrAksi[$i]));
        }

        $this->db->trans_complete();
        if ($this->db->trans_status()) {
            $results['success'] = true;
            $results['message'] = "record updated.";
        } else {
            $results['success'] = false;
            $results['message'] = "Failed to update record";
        }
        return $results;
    }

    function createGroup($name,$description,$unitid,$aksi,$listReport,$menuid,$filterby,$userid,$partnerid,$GroupMenuBusinessUnit, $GroupRoleID){
        if (empty($partnerid)) {
            $partnerid = 0;
        }

        $sql = "
            INSERT INTO sys_group(GroupName,GroupDescription,GroupUnitId,GroupAddUserId,GroupAddTime,GroupMenuId,GroupFilterBy,GroupPartnerID,RoleID)
            VALUES (?,?,?,?,now(),?,?,?,?)";
         $sql_aksi = "
            INSERT IGNORE INTO sys_group_menu_act(GroupMenuMenuAksiId,GroupMenuGroupId,GroupMenuSegmen)
            SELECT MenuAksiId,?,concat(MenuModule,'/',AksiFungsi,IF(MenuParam!='',concat('/',MenuParam),''))
            FROM sys_menu_act
            LEFT JOIN sys_menu ON MenuAksiMenuId=MenuId
            LEFT JOIN sys_act ON MenuAksiAksiId=AksiId
            where MenuAksiId=?";
        $this->db->trans_start();
        $this->db->query($sql, array($name,$description,$unitid,$userid,$menuid,$filterby,$partnerid,$GroupRoleID));
        $id = $this->db->insert_id();
        $arrAksi = explode(',', $aksi);
        for ($i=0;$i<sizeof($arrAksi);$i++) {
            $this->db->query($sql_aksi, array($id,$arrAksi[$i]));
        }

        $this->db->trans_complete();
        if ($this->db->trans_status()) {
            $results['success'] = true;
            $results['message'] = "record created.";
        } else {
            $results['success'] = false;
            $results['message'] = "Failed to create record";
        }
        return $results;
    }
}
