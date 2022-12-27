
Ext.define('MitraJaya.store.General.PartCodeList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.PartCodeList',
    id: 'MitraJaya.store.General.PartCodeList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_part_code',
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
