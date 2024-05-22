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
        url: m_api+'/v1/dboard/finance/display_chart',
        method: 'GET',
        params: {
            fyear: fyear,
            quartal: quartal
        },
        success: function(rp, o) {
			let r = Ext.decode(rp.responseText);
			document.getElementById("loader").style.display = "none";

			let ArrLabel = [];
			let ArrOmset = [];

			$.each(r.data.LabaChart, function(index, val) {
                ArrLabel.push(val.Month);

				ArrOmset.push(val.Amount);
            });
			let month = ArrLabel;
		
			let chartOmset = [{
				name: 'Laba (Rugi)',
				data: ArrOmset
			}]

			console.log(chartOmset);

			//build chart
			line(chartOmset,'chart_laba', 'Laba (Rugi '+quartalname+' Tahun '+fyear+''),'PT.Mitrajaya Solusi Utama', null, month, 'total', 2, true);

			$("#aktiva_lancar").html(r.data.TotalAktivaLancar);
			$("#aktiva_tetap").html(r.data.TotalAktivTetap);
			$("#kewajiban").html(r.data.Kewajiban);
			$("#ekuitas").html(r.data.Ekuitas);

			//build chart
			plot([
				['Aktiva Lancar', r.data.AktivaLancar],
				['Aktiva Tetap', r.data.AktivaTetap]
			],'chart_aktiva', r.data.Aktiva,'1', 'Aktiva', 0);
		
			plot([
				['Hutang', r.data.Hutang],
				['Modal', r.data.Modal],
				['Laba', r.data.Laba]
			],'chart_pasiva', r.data.Pasiva,'1', 'Pasiva', 0);
		}
	});
	

	$('#ContentDash').css('display', '');
	$('#wrapper').removeClass('cover');

	//Buat sesuaikan posisi chartnya lagi, ntah kenapa gk mau center
	setTimeout(function(){ 
		$('#chart_aktiva').highcharts().reflow();
		$('#chart_pasiva').highcharts().reflow();
	}, 1500);

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
