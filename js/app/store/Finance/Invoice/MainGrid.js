/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Finance.Invoice.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.Invoice.MainGrid',
    storeId: 'MitraJaya.store.Finance.Invoice.MainGrid',
    fields: ['InvoiceID','InvoiceNumber','ContractNumber','CustomerName','InvoicePeriodMonth', 'InvoicePeriodYear', 'GrossIncome','NettIncome'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/invoice/list',
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
            var invoice_src = JSON.parse(localStorage.getItem('invoice_src'));
            
            if(invoice_src != null){
                store.proxy.extraParams.keySearch = invoice_src.keySearch;
                store.proxy.extraParams.Month = invoice_src.Month;
                store.proxy.extraParams.Year = invoice_src.Year;
                store.proxy.extraParams.CustomerID = invoice_src.CustomerID;
            }else{
                store.proxy.extraParams.keySearch = '';
                store.proxy.extraParams.Month = '';
                store.proxy.extraParams.Year = '';
                store.proxy.extraParams.CustomerID = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: 'Please Wait',
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let cof_gridfarmers_params = JSON.parse(localStorage.getItem('cof_gridfarmers_params'));
                // if(cof_gridfarmers_params != null){
                //     if(cof_gridfarmers_params.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+'Data filter by'+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+cof_gridfarmers_params.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
