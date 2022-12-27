var uang = function (Obj) {
	var num, decimal_place = 0;
	var point = '.', pointRegex = /./g;
	var thousand = ',', thousandRegex = /\,/g;
	var multiplier = Math.pow(10, decimal_place);
	
   if (Obj.tagName.toLowerCase() != 'input' || !Obj.form || Obj.gvExcelLikeFormat) return;
   else Obj.oldValue = 'undefined';
   
   var pushOldFunction = function(Obj, func)
   {
      for (var j = 1; j > 0; j++) if (Obj[func+j] == undefined) break;
      Obj[func+j] = Obj[func];
      return func+j;
   }
   
   var formatNumber = function (num, mode)
   {
      if (mode > 0)
      {
         num = num.toString().replace(thousandRegex, '');
         if (mode == 2) return num; // just delete thousand mark
         num = num.toString().replace(pointRegex, '.');
         if (mode == 1) return isNaN(parseFloat(num)) ? 0: parseFloat(num); // go back to english format
      }
      
      num = parseFloat(num);
      if (isNaN(num)) num = 0;
      if (num.toString().indexOf('e') != -1) return 'Out of range';
      num = (Math.round(num * multiplier)) / multiplier;
      
      var str = num.toString().split('.');
      var reminder = str[1] ? str[1].substr(0, decimal_place) : '';
      while (reminder.length < decimal_place) reminder += '0';
      var quotient = str[0];
      
      var x = quotient.length % 3;
      var newQuotient = quotient.substr(0, x);
      
      for (var i = x; i < quotient.length; i += 3)
         newQuotient += thousand + quotient.substr(i, 3);
      if (newQuotient.charAt(0) == thousand) newQuotient = newQuotient.substr(1);
      
		if (decimal_place == 0) return newQuotient;
      return newQuotient + point + reminder;
   }
   
   if (typeof Obj.onkeypress == 'function') var onKeyPressOld = pushOldFunction(Obj, 'onkeypress');
   else var onKeyPressOld = false;
   Obj.onkeypress = function()
   {
      if (this.oldValue == 'undefined') this.oldValue = this.value;
      if (onKeyPressOld) return this[onKeyPressOld]();
   }
   
   if (typeof Obj.onkeyup == 'function') var onKeyUpOld = pushOldFunction(Obj, 'onkeyup');
   else var onKeyUpOld = false;
   Obj.onkeyup = function(e)
   {
      if (e.which && e.which < 48 && e.which != 8 && e.which != 46) if (onKeyUpOld) return this[onKeyUpOld](); else return;
		if (e.ctrlKey || e.altKey) if (onKeyUpOld) return this[onKeyUpOld](); else return;
		if (this.value == '') if (onKeyUpOld) return this[onKeyUpOld](); else return;
		
      var oldSelectionStart, isFromBack;
      if (this.setSelectionRange)
      {
			var tmp = (decimal_place == 0)?0:decimal_place+1;
         oldSelectionStart = this.value.length - this.selectionStart;
         if (oldSelectionStart < tmp) oldSelectionStart = this.selectionStart;
         else isFromBack = true;
      }
      
      var oldValue = this.oldValue;
      this.oldValue = 'undefined';
      
      num = formatNumber(this.value, 1);
      if (num != parseFloat(num))
         this.value = oldValue;
      else if (oldSelectionStart != undefined)
         this.value = formatNumber(num);
      
      if (oldSelectionStart != undefined && isFromBack) oldSelectionStart = this.value.length - oldSelectionStart;
      if (this.setSelectionRange) this.setSelectionRange(oldSelectionStart, oldSelectionStart);
      
      if (onKeyUpOld) return this[onKeyUpOld]();
   }
   
   if (!Obj.form.gvElement)
   {
      var onsubmit = Obj.form.onsubmit;
      Obj.form.onsubmit = null;
      
      Obj.form.gvElement = new Array;
      Obj.form.addEventListener('submit', function (e){for (var i in this.gvElement) if (this.gvElement[i]) this.gvElement[i].value = this.gvElement[i].gvGetValue();}, true);
      if (onsubmit) Obj.form.onsubmit = onsubmit;
   }
   
   if (Obj.name) Obj.form.gvElement[Obj.form.gvElement.length] = Obj;
   
   Obj.value = formatNumber(Obj.value);
   Obj.style.textAlign = 'right';
   Obj.gvGetValue = function () {return formatNumber(this.value, 1);}
   Obj.gvSetValue = function (num) {this.value = formatNumber(num); return this.value;}
   Obj.gvExcelLikeFormat = formatNumber;
}

function nnumber_format(num, mode) {
   var num, decimal_place = 0;
   var point = '.', pointRegex = /./g;
   var thousand = ',', thousandRegex = /\,/g;
   var multiplier = Math.pow(10, decimal_place);
   
   if (mode > 0)
   {
      num = num.toString().replace(thousandRegex, '');
      if (mode == 2) return num; // just delete thousand mark
      num = num.toString().replace(pointRegex, '.');
      if (mode == 1) return isNaN(parseFloat(num)) ? 0: parseFloat(num); // go back to english format
   }
   
   num = parseFloat(num);
   if (isNaN(num)) num = 0;
   if (num.toString().indexOf('e') != -1) return 'Out of range';
   num = (Math.round(num * multiplier)) / multiplier;
   
   var str = num.toString().split('.');
   var reminder = str[1] ? str[1].substr(0, decimal_place) : '';
   while (reminder.length < decimal_place) reminder += '0';
   var quotient = str[0];
   
   var x = quotient.length % 3;
   var newQuotient = quotient.substr(0, x);
   
   for (var i = x; i < quotient.length; i += 3)
      newQuotient += thousand + quotient.substr(i, 3);
   if (newQuotient.charAt(0) == thousand) newQuotient = newQuotient.substr(1);
   
	if (decimal_place == 0) return newQuotient;
   return newQuotient + point + reminder;
}

var uangc = function (Obj) {
   var pushOldFunction = function(Obj, func)
   {
      for (var j = 1; j > 0; j++) if (Obj[func+j] == undefined) break;
      Obj[func+j] = Obj[func];
      return func+j;
   }
   
   if (typeof Obj.onkeypress == 'function') var onKeyPressOld = pushOldFunction(Obj, 'onkeypress');
   else var onKeyPressOld = false;
   Obj.onkeypress = function()
   {
      if (this.oldValue == 'undefined') this.oldValue = this.value;
      if (onKeyPressOld) return this[onKeyPressOld]();
   }
   
   if (typeof Obj.onkeyup == 'function') var onKeyUpOld = pushOldFunction(Obj, 'onkeyup');
   else var onKeyUpOld = false;
   Obj.onkeyup = function(e)
   {
      num = nnumber_format(Ext.getCmp(this.name).getValue(), 1);
      oldValue = Ext.getCmp(this.name).getValue();
      if (num != parseFloat(num))
         this.value = oldValue;
      else this.value = nnumber_format(oldValue);
   }
}
