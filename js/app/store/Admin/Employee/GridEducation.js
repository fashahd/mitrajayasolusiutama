/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : GridEducation.js
 *******************************************/
 Ext.define('MitraJaya.store.Admin.Employee.GridEducation', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Admin.Employee.GridEducation',
    storeId: 'MitraJaya.store.Admin.Employee.GridEducation',
    fields: ['education_id','education_level','start_year','end_year','gpa','school_name'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/admin/employee/education_list',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    },
    listeners: {
        load: function(store, records, success) {
            var thisObj = this;
            if(success == true){
                thisObj.loadInfoFilter();
            }
        },
        sort: function(store, records, success){
            var thisObj = this;
            if(success == true){
                thisObj.loadInfoFilter();
            }
        },
        beforeload: function(store, operation, options){
			store.proxy.extraParams.people_id = this.storeVar.people_id;
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let cof_gridfarmers_params = JSON.parse(localStorage.getItem('cof_gridfarmers_params'));
                // if(cof_gridfarmers_params != null){
                //     if(cof_gridfarmers_params.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+lang('Data filter by')+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+cof_gridfarmers_params.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
