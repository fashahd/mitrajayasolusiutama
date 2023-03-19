
Ext.define('MitraJaya.store.General.GolList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.GolList',
    id: 'MitraJaya.store.General.GolList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_golongan',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
