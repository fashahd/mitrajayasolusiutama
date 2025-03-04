/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGridImportFailed.js
 *******************************************/
 Ext.define('MitraJaya.store.Finance.Invoice.MainGridImportFailed', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.Invoice.MainGridImportFailed',
    storeId: 'MitraJaya.store.Finance.Invoice.MainGridImportFailed',
    fields: [
		'InvoiceNumber',
		'InvoicePeriodMonth',
		'InvoicePeriodYear',
		'CustomerID',
		'ContractNumber',
		'TaxNumber',
		'Description',
		'InvoiceAmount',
		'VATPercent',
		'InvoiceVAT',
		'InvoiceTotal',
		'InvoiceGR',
		'InvoiceReceived',
		'VendorInvoiceNumber',
		'VendorTaxNumber',
		'DueDatePeriod',
		'DueDate',
		'Paid',
		'PPH23Option',
		'PPH23Value',
		'GrossIncome',
		'NettIncome',
		'ErrorMessages',
	],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/invoice/list_import_failed',
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
            var order_book_src = JSON.parse(localStorage.getItem('order_book_src'));
            
            if(order_book_src != null){
                store.proxy.extraParams.keySearch = order_book_src.keySearch;
                store.proxy.extraParams.StartDate = order_book_src.StartDate;
                store.proxy.extraParams.EndDate = order_book_src.EndDate;
                store.proxy.extraParams.CustomerID = order_book_src.CustomerID;
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
