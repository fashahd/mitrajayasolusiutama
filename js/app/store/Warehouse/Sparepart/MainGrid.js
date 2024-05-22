/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Warehouse.Sparepart.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Warehouse.Sparepart.MainGrid',
    storeId: 'MitraJaya.store.Warehouse.Sparepart.MainGrid',
    fields: ['SparepartID','SparepartCode','SparepartNumberCode','SparepartName','SparepartNo','SparepartType','SparepartCategory','SparepartQty','SparepartStatus','SparepartBasicPrice','SparepartSellingPrice','ActualLocation'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/warehouse/sparepart/list',
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
            store.proxy.extraParams.ProductID = this.storeVar.ProductID;

            var sparepart_src = JSON.parse(localStorage.getItem('sparepart_src'));
            
            if(sparepart_src != null){
                // store.proxy.extraParams.keySearch = sparepart_src.keySearch;
                // store.proxy.extraParams.keySearch2 = sparepart_src.keySearch2;
            }else{
                // store.proxy.extraParams.keySearch = '';
                // store.proxy.extraParams.keySearch2 = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: 'Please Wait',
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
            }
        });
    }
});
