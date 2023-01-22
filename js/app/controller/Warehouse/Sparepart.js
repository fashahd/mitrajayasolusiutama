/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : Farmers.js
 *******************************************/
 Ext.define('MitraJaya.controller.Warehouse.Sparepart', {
    extend: 'Ext.app.Controller',
    init: function() {
        this.renderView();
    },
    renderView: function() {
    	var MainLayout = [];

        if(Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.GridMain') == undefined){
            MainLayout = Ext.create('MitraJaya.view.Warehouse.Sparepart.GridMain');
        }else{
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.GridMain').destroy();
            MainLayout = Ext.create('MitraJaya.view.Warehouse.Sparepart.GridMain');
        }
    }
});
