/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : Farmers.js
 *******************************************/
 Ext.define('MitraJaya.controller.Warehouse.PenerimaanBarang', {
    extend: 'Ext.app.Controller',
    init: function() {
        this.renderView();
    },
    renderView: function() {
    	var MainLayout = [];

        if(Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid') == undefined){
            MainLayout = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid');
        }else{
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid').destroy();
            MainLayout = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid');
        }
    }
});
