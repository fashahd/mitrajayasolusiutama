
Ext.define('MitraJaya.store.General.ReligionList', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.ReligionList',
    id: 'MitraJaya.store.General.ReligionList',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_religion',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
