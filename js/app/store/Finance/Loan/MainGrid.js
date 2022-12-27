/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Finance.Loan.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.Loan.MainGrid',
    storeId: 'MitraJaya.store.Finance.Loan.MainGrid',
    fields: ['EmployeeLoanID','Name','LoanTransferDate','LoanAmount','LoanDate','TotalPayment','LoanRemaining','LoanDescription','DocNumber'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/employeeloan/list',
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
            var employee_loan_src = JSON.parse(localStorage.getItem('employee_loan_src'));
            
            if(employee_loan_src != null){
                store.proxy.extraParams.keySearch = employee_loan_src.keySearch;
                store.proxy.extraParams.StartDate = employee_loan_src.StartDate;
                store.proxy.extraParams.EndDate = employee_loan_src.EndDate;
                store.proxy.extraParams.CustomerID = employee_loan_src.CustomerID;
            }else{
                store.proxy.extraParams.keySearch = '';
                store.proxy.extraParams.StartDate = '';
                store.proxy.extraParams.EndDate = '';
                store.proxy.extraParams.CustomerID = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let employee_loan_src = JSON.parse(localStorage.getItem('employee_loan_src'));
                // if(employee_loan_src != null){
                //     if(employee_loan_src.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+lang('Data filter by')+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+employee_loan_src.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
