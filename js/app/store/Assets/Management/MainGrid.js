/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Assets.Management.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Assets.Management.MainGrid',
    storeId: 'MitraJaya.store.Assets.Management.MainGrid',
    fields: ['AssetID','AssetCode','AssetExternalID','AssetName','CategoryID','CategoryName', 'BrandID', 'BrandName','Year','HPP'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/assets/management/list',
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
            var assets_ls = JSON.parse(localStorage.getItem('assets_ls'));
            
            if(assets_ls != null){
                store.proxy.extraParams.keySearch = assets_ls.keySearch;
                store.proxy.extraParams.CategoryID = assets_ls.CategoryID;
                store.proxy.extraParams.Year = assets_ls.Year;
                store.proxy.extraParams.BrandID = assets_ls.BrandID;
            }else{
                store.proxy.extraParams.keySearch = '';
                store.proxy.extraParams.CategoryID = '';
                store.proxy.extraParams.Year = '';
                store.proxy.extraParams.BrandID = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                // document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
            }
        });
    }
});
