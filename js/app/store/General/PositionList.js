
Ext.define('MitraJaya.store.General.PositionList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.PositionList',
    id: 'MitraJaya.store.General.PositionList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_position',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
