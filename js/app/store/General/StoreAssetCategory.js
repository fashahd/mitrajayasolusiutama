
Ext.define('MitraJaya.store.General.StoreAssetCategory', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.StoreAssetCategory',
    id: 'MitraJaya.store.General.StoreAssetCategory',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_asset_category',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            // store.proxy.extraParams.CustomerID = this.storeVar.CustomerID;
        }
    }
});
