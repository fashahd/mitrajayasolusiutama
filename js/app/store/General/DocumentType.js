
Ext.define('MitraJaya.store.General.DocumentType', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.DocumentType',
    id: 'MitraJaya.store.General.DocumentType',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_doc_type',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
