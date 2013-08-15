function handleInput(val, name) {
	val	= val.replace(',', '.');
	if (val.indexOf(':') != -1) {
		var tmp = val.split(':');
		if (tmp.length != 2) {
			$('#resultTable').hide();
			alert('Das Format von ' + name + ' stimmt nicht.');
			return false;
		}
		val = (parseFloat(tmp[0]) * 60) + parseFloat(tmp[1]);
	}
	return parseFloat(val);
}

function secToMin(s) {
	var m = 0;
	while (s >= 60) {
		m++;
		s -= 60;
	}
	if (s >= 10) {
		return m + ':' + s;
	}
	return m + ':0' + s;
}

function round(val, decimals) {
	var tmp = Math.pow(10, decimals);
	val *= tmp;
	val = Math.round(val);
	val /= tmp;
	return val;
}

function getDataArray(arg1, arg2, split, distance) {
	var count	= arg1 / split;
	var split2	= arg2 / count;
	
	var count2 = Math.floor(count);
	
	var a_result = [];
	
	for (var i = 0; i <= count2; i++) {
		var tmp = i * split2;
		tmp = round(tmp, 2);
		if (distance) {
			a_result[i] = [(i * split), (tmp), secToMin(tmp)];
		} else {
			a_result[i] = [(tmp), (i * split), secToMin(i * split)];
		}
	}
	if ((count2 * split) < arg1) {
		if (distance) {
			a_result[count2+1] = [arg1, arg2, secToMin(arg2)];
		} else {
			a_result[count2+1] = [arg2, arg1, secToMin(arg1)];
		}
	}
	
	$('#tableHead').html(
		'<div class="pull-right ui-block-a"><div class="ui-bar ui-bar-b">Distanz</div></div>\n' +
		'<div class="pull-right ui-block-b"><div class="ui-bar ui-bar-b">Zeit 1</div></div>\n' +
		'<div class="pull-right ui-block-c"><div class="ui-bar ui-bar-b">Zeit 2</div></div>\n'
	);
	
	$.each(a_result, function(index, value) {
		$('#tableBody').append(
			'<div class="pull-right ui-block-a"><div class="ui-bar ui-bar-d">'+value[0]+' m</div></div>\n' +
			'<div class="pull-right ui-block-b"><div class="ui-bar ui-bar-d">'+value[1]+' s</div></div>\n' +
			'<div class="pull-right ui-block-c"><div class="ui-bar ui-bar-d">'+value[2]+' min</div></div>\n'
		);
	});
}

function submitForm() {
	// BEGIN set vars
	var error = false;
	// END set vars
	
	// reset table
	$('#tableHead').html('');
	$('#tableBody').html('');
	
	// BEGIN read form
	var kind		= $('input[name="kind"]:checked').val();
	var distance	= $('input[name="distance"]').val();
	var time		= $('input[name="time"]').val();
	var split		= $('input[name="split"]').val();
	// END read form
	
	if (kind == '' || distance == '' || time == '' || split == '') {
		error = true;
		$('#resultTable').hide();
		alert('Das Formular muss ausgefüllt sein, bevor es verarbeitet werden kann.');
	}
	
	if (!error) {
		$('#resultTable').show();
		
		distance	= handleInput(distance, 'Distanz');
		time		= handleInput(time, 'Zeit');
		split		= handleInput(split, 'Zwischenwert');
		
		if (kind != 'd' && kind != 't') {
			error = true;
			$('#resultTable').hide();
			alert('Fehler bei der Formularübermittlung.');
		}
		
		if (!error) {
			if (kind == 'd') {
				if (distance < split) {
					error = true;
					$('#resultTable').hide();
					alert('Gesamtdistanz darf nicht kleiner sein, wie die Zwischendistanz. ' + distance + ' ' + split);
				}
				
				if (!error) {
					/*var count	= distance / split;
					var split2	= time / count;
					
					var count2 = Math.floor(count);
					
					var a_result = [];
					
					for (var i = 0; i <= count2; i++) {
						var tmp = i * split2;
						tmp = round(tmp, 2);
						a_result[i] = [(i * split), (tmp), secToMin(tmp)];
					}
					if ((count2 * split) < distance) {
						a_result[count2+1] = [distance, time, secToMin(time)];
					}
					
					$('#tableHead').html(
						'<div class="pull-right ui-block-a"><div class="ui-bar ui-bar-b">Distanz</div></div>\n' +
						'<div class="pull-right ui-block-b"><div class="ui-bar ui-bar-b">Zeit 1</div></div>\n' +
						'<div class="pull-right ui-block-c"><div class="ui-bar ui-bar-b">Zeit 2</div></div>\n'
					);
					
					$.each(a_result, function(index, value) {
						$('#tableBody').append(
							'<div class="pull-right ui-block-a"><div class="ui-bar ui-bar-d">'+value[0]+' m</div></div>\n' +
							'<div class="pull-right ui-block-b"><div class="ui-bar ui-bar-d">'+value[1]+' s</div></div>\n' +
							'<div class="pull-right ui-block-c"><div class="ui-bar ui-bar-d">'+value[2]+' min</div></div>\n'
						);
					});*/
					getDataArray(distance, time, split, true);
				}
			} else if (kind == 't') {
				if (time < split) {
					error = true;
					$('#resultTable').hide();
					alert('Gesamtzeit darf nicht kleiner sein, wie die Zwischenzeit. ' + time + ' ' + split);
				}
				
				if (!error) {
					/*$('#tableHead').html(
						'<div class="pull-right ui-block-a"><div class="ui-bar ui-bar-b">Zeit</div></div>\n' +
						'<div class="pull-right ui-block-b"><div class="ui-bar ui-bar-b">Distanz</div></div>\n'
					);*/
					getDataArray(time, distance, split, false);
				}
			}
		}
		
	}
}

$(document).ready(function() {
	$('#resultTable').hide();
});