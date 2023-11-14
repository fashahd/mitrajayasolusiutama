
Ext.define('MitraJaya.store.General.StoreAssetBrand', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.StoreAssetBrand',
    id: 'MitraJaya.store.General.StoreAssetBrand',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_asset_brand',
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
