
Ext.define('MitraJaya.store.General.CashbonList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.CashbonList',
    id: 'MitraJaya.store.General.CashbonList',
    fields: ['id', 'label'],
    autoLoad: false,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_cashbon',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
