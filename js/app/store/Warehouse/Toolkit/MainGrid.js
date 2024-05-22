/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Warehouse.Toolkit.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Warehouse.Toolkit.MainGrid',
    storeId: 'MitraJaya.store.Warehouse.Toolkit.MainGrid',
    fields: ['ToolkitID','ToolkitCode','ToolkitName','ToolkitQty'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/warehouse/toolkit/list',
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
            store.proxy.extraParams.ToolkitID = this.storeVar.ToolkitID;

            var toolkit_src = JSON.parse(localStorage.getItem('toolkit_src'));
            
            if(toolkit_src != null){
                store.proxy.extraParams.ToolkitCode = toolkit_src.ToolkitCode;
                store.proxy.extraParams.ToolkitName = toolkit_src.ToolkitName;
            }else{
                store.proxy.extraParams.ToolkitCode = '';
                store.proxy.extraParams.ToolkitName = '';
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
