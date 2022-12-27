
Ext.define('MitraJaya.store.General.RackList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.RackList',
    id: 'MitraJaya.store.General.RackList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_rack',
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
