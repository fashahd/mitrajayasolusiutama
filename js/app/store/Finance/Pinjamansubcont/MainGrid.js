/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.store.Finance.PinjamanSubCont.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.PinjamanSubCont.MainGrid',
    storeId: 'MitraJaya.store.Finance.PinjamanSubCont.MainGrid',
    fields: ['LoanID','VendorNameDisplay','ProjectName','LoanAmount','LoanDate','TotalPayment','LoanRemaining','LoanType'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/loan/list',
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
            var subcontloan_src = JSON.parse(localStorage.getItem('subcontloan_src'));
            
            if(subcontloan_src != null){
                store.proxy.extraParams.VendorID = subcontloan_src.VendorID;
                store.proxy.extraParams.ProjectID = subcontloan_src.ProjectID;
                store.proxy.extraParams.EmployeeID = subcontloan_src.EmployeeID;
                store.proxy.extraParams.LoanType = subcontloan_src.LoanType;
            }else{
                store.proxy.extraParams.VendorID = '';
                store.proxy.extraParams.ProjectID = '';
                store.proxy.extraParams.EmployeeID = '';
                store.proxy.extraParams.LoanType = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let order_book_src = JSON.parse(localStorage.getItem('order_book_src'));
                // if(order_book_src != null){
                //     if(order_book_src.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+lang('Data filter by')+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+order_book_src.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
