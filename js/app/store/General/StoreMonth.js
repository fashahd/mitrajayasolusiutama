
Ext.define('MitraJaya.store.General.StoreMonth', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.StoreMonth',
    id: 'MitraJaya.store.General.StoreMonth',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_month',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
        }
    }
});
