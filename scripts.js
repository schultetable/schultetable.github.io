$(document).ready(function() {
	
	var ELEMENTS_ALPHABET_RU = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяDFGLNQRSUVWZdfglnqrsuvwzαβδεθλπυψω";
	var ELEMENTS_ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzБГДЖЗИПФЦЧШЪЫЭЮЯбджзифцчшъыэюяαβΔδεζθλμΞξπρΣυχψω";
	var ELEMENTS_DIGITS = generateDigitsArray(100);
	
	var TABLE_TYPE_DIGITS = 1;
	var TABLE_TYPE_LETTERS = 2;
	var TABLE_TYPE_GORBOV = 3;
	
	var CELL_TYPE_BLACK = 0;
	var CELL_TYPE_RED = 1;
	
	var TABLE_STYLE_CLASSIC = 1;
	var TABLE_STYLE_RED = 2;
	var TABLE_STYLE_ROUND = 3;
	var TABLE_STYLE_COLOR = 4;
	
	var TABLE_ORDER_DIRECT = 1;
	var TABLE_ORDER_REVERSE = 2;
	var TABLE_ORDER_RANDOM = 3;
	
	var tableSize = 5;
	var tableType = TABLE_TYPE_DIGITS;
	var tableStyle = TABLE_STYLE_CLASSIC;
	var tableOrder = TABLE_ORDER_DIRECT;
	var shuffleOnClick = true;
	var showDot = false;
	var elementsArray = new Array(tableSize * tableSize);
	var currentElement = 0;
	var timeSec = 0;
	var bestTimeSec = 0;
	var timerId;
	
	var tableNode = $('#table');
	var tableHelperNode = $('#table_helper');
	var symbolToFindNode = $('#table_helper .symbol_to_find .symbol');
	var settingsNode = $('#settings');
	var resultNode = $('#result');
	var resultCurrentTimeNode = $('#result .time_container .current .time');
	var resultBestTimeNode = $('#result .time_container .record .time');
	var timerNode = $('#table_helper .timer');
	var startBtnNode = $('#settings .btn-success');
	var restartBtnNode = $('#result .table_btns .btn_restart');
	var settingBtnNode = $('#result .table_btns .btn_settings');
	var dotNode = $('#content .dot');
	
	var settingsSizeBtns = $('#settings .btn-group.table-size input');
	var settingsTypeBtns = $('#settings .btn-group.table-type input');
	var settingsStyleBtns = $('#settings .btn-group.table-style input');
	var settingsOrderBtns = $('#settings .btn-group.order input');
	var settingsShuffleBtns = $('#settings .btn-group.shuffle input');
	var settingsDotBtns = $('#settings .btn-group.table-dot input');
	
	startBtnNode.click(function() {
		startTable();
	});
	
	restartBtnNode.click(function() {
		startTable();
	});
	
	settingBtnNode.click(function() {
		showSettings();
	});
	
	settingsSizeBtns.click(function() {
		tableSize = $(this).attr('data-table-size');
	});
	
	settingsTypeBtns.click(function() {
		tableType = $(this).attr('data-table-type');
		if (tableType == TABLE_TYPE_GORBOV) {
			$('.show_for_gorbov').show();
		} else {
			$('.show_for_gorbov').hide();
		}
	});
	
	settingsStyleBtns.click(function() {
		tableStyle = $(this).attr('data-table-style');
	});
	
	settingsOrderBtns.click(function() {
		tableOrder = $(this).attr('data-order');
	});
	
	settingsShuffleBtns.click(function() {
		shuffleOnClick = $(this).attr('data-shuffle') == 1;
	});
	
	settingsDotBtns.click(function() {
		showDot = $(this).attr('data-dot') == 1;
	});
	
	function startTable() {
		settingsNode.hide();
		resultNode.hide();
		tableNode.show();
		tableHelperNode.show();
		
		if (showDot) {
			console.log("SHOW");
			dotNode.show();
		}
		
		tableNode.attr("class", "s_" + tableSize);
		
		if (tableType == TABLE_TYPE_DIGITS) {
			elementsArray = ELEMENTS_DIGITS.slice(0, tableSize * tableSize);
		} else if (tableType == TABLE_TYPE_LETTERS) {
			elementsArray = tableNode.attr('data-lang').split('').slice(0, tableSize * tableSize);
		} else if (tableType == TABLE_TYPE_GORBOV) {
			elementsArray = generateGorbovArray(tableSize * tableSize);
		}
		
		if (tableType != TABLE_TYPE_GORBOV) {
			if (tableOrder == TABLE_ORDER_RANDOM) {
				shuffle(elementsArray);
			} else if (tableOrder == TABLE_ORDER_REVERSE) {
				elementsArray.reverse();
			}
		}
		
		resetTable();
		
		timeSec = 0;
		currentElement = 0;
		if (tableType == TABLE_TYPE_GORBOV) {
			symbolToFindNode.text(elementsArray[currentElement].value);
		} else {
			symbolToFindNode.text(elementsArray[currentElement]);
		}
		timerNode.text("00:00");
		
		timerId = setInterval(timerFunction, 1000);
	}
	
	function resetTable() {
		tableNode.empty();
		var tableElements = elementsArray.slice(0, elementsArray.length);
		shuffle(tableElements);
		for (i = 0; i < tableSize; i++) {
			if (tableType == TABLE_TYPE_GORBOV) {
				tableNode.append('<div class="s_row style_' + TABLE_STYLE_RED + '" ></div>');
			} else {
				tableNode.append('<div class="s_row style_' + tableStyle + '" ></div>');
			}
			var rowNode = tableNode.find('.s_row:last-of-type');
			for (j = 0; j < tableSize; j++) {
				var cellColor = 0;
				if (tableStyle == TABLE_STYLE_COLOR) {
					cellColor = randomInteger(1, 13);
				}
				if (tableType == TABLE_TYPE_GORBOV) {
					var cell = tableElements[i * tableSize + j];
					rowNode.append('<div><span class="element red_' + cell.type + ' color_' + cellColor + '"><span>' + cell.value + '</span></span></div>');
				} else {
					rowNode.append('<div><span class="element color_' + cellColor + '"><span>' + tableElements[i * tableSize + j] + '</span></span></div>');
				}
			}
		}
		tableNode.find('.element').click(function() {
			var currentElementValue;
			var clickedElementValue;
			if (tableType == TABLE_TYPE_GORBOV) {
				currentElementValue = elementsArray[currentElement].value;
				if (elementsArray[currentElement].type == CELL_TYPE_BLACK) {
					currentElementValue += 'b';
				} else {
					currentElementValue += 'r';
				}
				clickedElementValue = $(this).find('span').text().toString();
				if ($(this).hasClass('red_0')) {
					clickedElementValue += 'b';
				} else {
					clickedElementValue += 'r';
				}
			} else {
				currentElementValue = elementsArray[currentElement].toString();
				clickedElementValue = $(this).find('span').text().toString();
			}
			if (clickedElementValue == currentElementValue) {
				currentElement++;
				if (currentElement < elementsArray.length) {
					if (tableType == TABLE_TYPE_GORBOV) {
						symbolToFindNode.text(elementsArray[currentElement].value);
						if (elementsArray[currentElement].type == CELL_TYPE_RED) {
							symbolToFindNode.addClass('red');
						} else {
							symbolToFindNode.removeClass('red');
						}
					} else {
						symbolToFindNode.text(elementsArray[currentElement]);
					}
					if (shuffleOnClick) {
						resetTable();
					}
				} else {
					finishTable();
				}
			}
		});
	}
	
	function finishTable() {
		clearInterval(timerId);
		if (timeSec < bestTimeSec || bestTimeSec == 0) {
			bestTimeSec = timeSec;
		}
		showResult();
	}
	
	function showResult() {
		resultCurrentTimeNode.text(secondsToString(timeSec));
		resultBestTimeNode.text(secondsToString(bestTimeSec));
		settingsNode.hide();
		resultNode.show();
		tableNode.hide();
		tableHelperNode.hide();
		dotNode.hide();
	}
	
	function showSettings() {
		settingsNode.show();
		resultNode.hide();
		tableNode.hide();
		tableHelperNode.hide();
		dotNode.hide();
	}
	
	function shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	
	function generateDigitsArray(size) {
		var dArray = new Array(100);
		for (i = 1; i <= 100; i++) {
			dArray[i - 1] = i;
		}
		return dArray;
	}
	
	function generateGorbovArray(size) {
		var list = new Array(size);
		var indexB = 0;
		var indexR = Math.floor(size / 2) + 1;
		for (var i = 1; i <= size; i++) {
			if (i % 2 == 0) {
				indexR--;
				let cell = {
					type: CELL_TYPE_RED,
					value: indexR.toString()
				};
				list[i - 1] = cell;
			} else {
				indexB++;
				let cell = {
					type: CELL_TYPE_BLACK,
					value: indexB.toString()
				};
				list[i - 1] = cell;
			}
		}
		return list;
	}
	
	function timerFunction() {
		timeSec++;
		var timeString = secondsToString(timeSec);
		timerNode.text(timeString);
	}
	
	function secondsToString(totalSeconds) {
		var hours   = Math.floor(totalSeconds / 3600);
		var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		seconds = Math.round(seconds * 100) / 100

		var result = "";
		if (hours != 0) {
			result += hours + ":";
		}
		result += (minutes < 10 ? "0" + minutes : minutes);
		result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
		return result;
	}
	
	function randomInteger(min, max) {
		let rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	}
});
