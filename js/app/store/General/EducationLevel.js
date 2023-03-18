
Ext.define('MitraJaya.store.General.EducationLevel', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.EducationLevel',
    id: 'MitraJaya.store.General.EducationLevel',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_education_level',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
			
        }
    }
});
