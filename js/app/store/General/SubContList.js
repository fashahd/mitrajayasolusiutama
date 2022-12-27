
Ext.define('MitraJaya.store.General.SubContList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.SubContList',
    id: 'MitraJaya.store.General.SubContList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_subcont',
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
