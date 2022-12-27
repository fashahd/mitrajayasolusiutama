/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Finance.BudgetPlan.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.BudgetPlan.MainGrid',
    storeId: 'MitraJaya.store.Finance.BudgetPlan.MainGrid',
    fields: ['Item','Week','Budget','Actual','Outstanding','BudgetPlanID','BudgetDate'],
    groupField: 'Week',
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/budgetplan/list_income',
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
