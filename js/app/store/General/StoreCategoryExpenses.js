
Ext.define('MitraJaya.store.General.StoreCategoryExpenses', {
    extend: 'Ext.data.Store',
    storeId: 'MitraJaya.store.General.StoreCategoryExpenses',
    id: 'MitraJaya.store.General.StoreCategoryExpenses',
    fields: ['id', 'label'],
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_category_expenses',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
        }
    }
});
