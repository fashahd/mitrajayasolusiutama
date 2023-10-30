/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Admin.Payroll.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Admin.Payroll.MainGrid',
    storeId: 'MitraJaya.store.Admin.Payroll.MainGrid',
    fields: ['people_name','people_id','people_ext_id','salary','deduction','incentive','net_salary'],
    // groupField: 'Week',
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/admin/payroll/list_employee',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            var budget_plan_src = JSON.parse(localStorage.getItem('budget_plan_src'));
            
            if(budget_plan_src != null){
                store.proxy.extraParams.Year = budget_plan_src.Year;
                store.proxy.extraParams.Month = budget_plan_src.Month;
            }else{
                store.proxy.extraParams.Year = '';
                store.proxy.extraParams.Month = '';
            }
        }
    }
});
