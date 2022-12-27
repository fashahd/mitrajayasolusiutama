
Ext.define('MitraJaya.store.General.ToolkitList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.ToolkitList',
    id: 'MitraJaya.store.General.ToolkitList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_toolkit',
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
