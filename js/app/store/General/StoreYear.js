
Ext.define('MitraJaya.store.General.StoreYear', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.StoreYear',
    id: 'MitraJaya.store.General.StoreYear',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_year',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            store.proxy.extraParams.yearRange = this.storeVar.yearRange;
        }
    }
});
