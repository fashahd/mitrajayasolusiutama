/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.store.Finance.Claim.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.Claim.MainGrid',
    storeId: 'MitraJaya.store.Finance.Claim.MainGrid',
    fields: ['ClaimID','ProjectID','ClaimDate','DocNumber','Location','ProjectName','PeopleName','TotalAmount'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/claim/list',
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
            var claim_ls = JSON.parse(localStorage.getItem('claim_ls'));
            
            if(claim_ls != null){
                store.proxy.extraParams.ProjectID = claim_ls.ProjectID;
                store.proxy.extraParams.DocNumber = claim_ls.DocNumber;
            }else{
                store.proxy.extraParams.ProjectID = '';
                store.proxy.extraParams.DocNumber = '';
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
