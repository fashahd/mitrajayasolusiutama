/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Mon Feb 03 2020
 *  File : fardem.js
 *******************************************/
function runSearch() {
	
    $('#wrapper').addClass('cover');
	document.getElementById("loader").style.display = "block";
    let fyear 	= $("#fyear").val();
    let quartal = $("#quartal").val();
    let quartalname = (quartal == 'q1') ? 'Quartal 1' : (quartal == 'q2') ? 'Quartal 2' :(quartal == 'q3') ? 'Quartal 3' : (quartal == 'q4') ? 'Quartal 4' : '';

	Ext.Ajax.request({
        url: m_api+'/v1/dboard/general/display_chart',
        method: 'GET',
        params: {
            fyear: fyear,
            quartal: quartal
        },
        success: function(rp, o) {
			let r = Ext.decode(rp.responseText);
			document.getElementById("loader").style.display = "none";


			// === Chart Omset === (Begin)//
			let ArrLabel = [];
			let ArrOmset = [];

			$.each(r.data.omset, function(index, val) {
                ArrLabel.push(val.Month);

				ArrOmset.push(val.Amount);
            });
			let month = ArrLabel;
		
			let chartOmset = [{
				name: 'Omset',
				data: ArrOmset
			}]

			//build chart
			line(chartOmset,'chart_income_invoice_quartal', 'Total Omset '+quartalname+' Tahun '+fyear+'','PT.Mitrajaya Solusi Utama', null, month, 'total', 2, true);
			// === Chart Omset === (End)//

			let ArrLabelCustomer = [];
			let ArrOmsetCustomer = [];
			$.each(r.data.omsetClient.CustomerList, function(index, val) {
                ArrLabelCustomer.push(val[0]);
            });

			$.each(r.data.omsetClient.MonthList, function(index, val) {
                ArrOmsetCustomer.push({'name':[val.name], 'data': val.data});
            });

			column(ArrOmsetCustomer, 'chart_income_invoice_quartal_by_client', 'Omset Quartal '+quartalname+' Tahun '+fyear+' Based on Customer', 'PT.Mitrajaya Solusi Utama', null, ArrLabelCustomer, false,2,true);
		}
	});
	

	$('#ContentDash').css('display', '');
	$('#wrapper').removeClass('cover');

	//Buat sesuaikan posisi chartnya lagi, ntah kenapa gk mau center
	setTimeout(function(){ 
		$('#chart_income_invoice_quartal').highcharts().reflow();
	}, 1500);
    
    // Ext.Ajax.request({
    //     url: m_api+'/dboard/fardem/display_dash',
    //     method: 'GET',
    //     params: {
    //         fcountry: fcountry,
    //         fprovince: fprovince,
    //         fdistrict: fdistrict,
    //         ffarmer: ffarmer,
    //         fpartner: fpartner
    //     },
    //     success: function(rp, o) {
    //         var r = Ext.decode(rp.responseText);
    //         //console.log(r);

    //         //chart=================================================================================================
    //         chartOmset = [{
	// 			name: 'Installation & Developers',
	// 			data: [43934, 48656, 65165, 81827, 112143, 142383,
	// 				171533, 165174, 155157, 161454, 154610]
	// 		}, {
	// 			name: 'Manufacturing',
	// 			data: [24916, 37941, 29742, 29851, 32490, 30282,
	// 				38121, 36885, 33726, 34243, 31050]
	// 		}, {
	// 			name: 'Sales & Distribution',
	// 			data: [11744, 30000, 16005, 19771, 20185, 24377,
	// 				32147, 30912, 29243, 29213, 25663]
	// 		}, {
	// 			name: 'Operations & Maintenance',
	// 			data: [null, null, null, null, null, null, null,
	// 				null, 11164, 11218, 10077]
	// 		}, {
	// 			name: 'Other',
	// 			data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
	// 				17300, 13053, 11906, 10073]
	// 		}]

    //         //build chart
    //         line(chartOmset,'chart_income_invoice_quartal', 'Total Omset','1', 'Jumlah');
            

    //         $('#ContentDash').css('display', '');
    //         $('#wrapper').removeClass('cover');

    //         //Buat sesuaikan posisi chartnya lagi, ntah kenapa gk mau center
    //         setTimeout(function(){ 
    //             $('#chart_income_invoice_quartal').highcharts().reflow();
    //         }, 1500);
    //     },
    //     failure: function(rp, o) {
    //         $('#ContentDash').css('display', '');
    //         $('#wrapper').removeClass('cover');

    //         try {
    //             var r = Ext.decode(rp.responseText);
    //             Ext.MessageBox.show({
    //                 title: 'Error',
    //                 msg: r.message,
    //                 buttons: Ext.MessageBox.OK,
    //                 animateTarget: 'mb9',
    //                 icon: 'ext-mb-error'
    //             });
    //         }
    //         catch(err) {
    //             Ext.MessageBox.show({
    //                 title: 'Error',
    //                 msg: 'Connection Error',
    //                 buttons: Ext.MessageBox.OK,
    //                 animateTarget: 'mb9',
    //                 icon: 'ext-mb-error'
    //             });
    //         }
    //     }
    // });

}

$(document).on('change', '#fcountry', function(e) {
    if(e.target.value == 'all_country') {
        $('#fprovince').find('option').remove().end().append('<option value="all_province">'+'All'+' '+m_label_prov+'</option>');
        $('#fdistrict').find('option').remove().end().append('<option value="all_district">'+'All'+' '+m_label_dis+'</option>');
    } else {
        Ext.Ajax.request({
            url: m_api+'/common/combo_filter_province',
            method: 'GET',
            params: {
                CountryID: e.target.value
            },
            success: function(rp, o) {
                var r = Ext.decode(rp.responseText);
                //console.log(r);
    
                $('#fprovince').find('option').remove().end().append('<option value="all_province">'+'All'+' '+m_label_prov+'</option>');
                $.each(r, function(index, val) {
                    $('#fprovince').append('<option value="'+val.id+'">'+val.label+'</option>');
                });
            },
            failure: function(rp, o) {
                $('#fprovince').find('option').remove().end().append('<option value="all_province">'+'All'+' '+m_label_prov+'</option>');
                $('#fdistrict').find('option').remove().end().append('<option value="all_district">'+'All'+' '+m_label_dis+'</option>');
            }
        });
    }
});

$(document).on('change', '#fprovince', function(e) {
    if(e.target.value == 'all_province') {
        $('#fdistrict').find('option').remove().end().append('<option value="all_district">'+'All'+' '+m_label_dis+'</option>');
    } else {
        Ext.Ajax.request({
            url: m_api+'/common/combo_filter_district',
            method: 'GET',
            params: {
                ProvinceID: e.target.value
            },
            success: function(rp, o) {
                var r = Ext.decode(rp.responseText);
                //console.log(r);
    
                $('#fdistrict').find('option').remove().end().append('<option value="all_district">'+'All'+' '+m_label_dis+'</option>');
                $.each(r, function(index, val) {
                    $('#fdistrict').append('<option value="'+val.id+'">'+val.label+'</option>');
                });
            },
            failure: function(rp, o) {
                $('#fdistrict').find('option').remove().end().append('<option value="all_district">'+'All'+' '+m_label_dis+'</option>');
            }
        });
    }
});

$(function () {
    //Load combo year
    Ext.Ajax.request({
        url: m_api+'/v1/general/combo/combo_year',
        method: 'GET',
        params: {
            endyear: 'now'
        },
        success: function(rp, o) {
            var r = Ext.decode(rp.responseText);
            //console.log(r);

            $('#fyear').find('option').remove().end();
            $.each(r, function(index, val) {
                $('#fyear').append('<option value="'+val.id+'">'+val.label+'</option>');
            });

            //Langsung jalankan search pertama kali
            runSearch();
        },
        failure: function(rp, o) {
            $('#fyear').find('option').remove().end();
        }
    });

});
