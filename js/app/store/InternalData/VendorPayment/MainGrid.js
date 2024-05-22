/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.InternalData.VendorPayment.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.InternalData.VendorPayment.MainGrid',
    storeId: 'MitraJaya.store.InternalData.VendorPayment.MainGrid',
    fields: ['PaymentID','DocumentNo','ProjectName','VendorName','InvoiceComplete','DueDate','Contract', 'Amount','Outstanding','Description','PaidStatus'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/internaldata/vendorpayment/list',
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
            var vendor_payment_src = JSON.parse(localStorage.getItem('vendor_payment_src'));
            
            if(vendor_payment_src != null){
                store.proxy.extraParams.keySearch = vendor_payment_src.keySearch;
                store.proxy.extraParams.VendorID = vendor_payment_src.VendorID;
                store.proxy.extraParams.ProjectID = vendor_payment_src.ProjectID;
            }else{
                store.proxy.extraParams.keySearch = '';
                store.proxy.extraParams.VendorID = '';
                store.proxy.extraParams.ProjectID = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: 'Please Wait',
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let order_book_src = JSON.parse(localStorage.getItem('order_book_src'));
                // if(order_book_src != null){
                //     if(order_book_src.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+'Data filter by'+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+order_book_src.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
