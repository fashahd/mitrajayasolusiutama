Ext.define('MitraJaya.store.General.ProvinceList', {
    extend: 'Ext.data.Store',
    storeId: 'store.General.ProvinceList',
    id: 'store.General.ProvinceList',
    fields: ['id', 'label'],
    remoteSort: true,
    autoLoad: false,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_province',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
