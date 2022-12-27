
Ext.define('MitraJaya.store.General.VendorList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.VendorList',
    id: 'MitraJaya.store.General.VendorList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_vendor',
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
