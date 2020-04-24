
var Dom = {
	id: function(id){
		return document.getElementById(id);
	},
	className: function(className){
		return [].slice.call(document.getElementsByClassName(className));
	},
	name: function(name){
		return [].slice.call(document.getElementsByName(name));
	},
	htmlCollectionToArray: function(collection){
	  return [].slice.call(collection);
	}
}

HTMLCollection.prototype.toArray = function(){
    return [].slice.call(this)
}


function hta(hash){
    var a = [];
    for(key in hash) a.push(hash[key]);
    return a;
}

function ResponsiveTableRowsCounter(){
	this.responsiveTable;
	this.tHeadBoxes;
	this.index;
	this.reapplyable = false;
	var couterBox;
	
	this.render = function(){
		var count = this.responsiveTable.getRowsOut().length;
		counterBox.innerText = "Foram retornadas " + count + " linhas";
	}
	
	this.init = function(){
		counterBox = Dom.id(this.responsiveTable.getTableId() + "_counter");
	}
	
}

function ResponsiveTableColumnsHider(){
	this.responsiveTable;
	this.tHeadBoxes;
	this.index;
	this.reapplyable = false;
	var columnsToHide = [];
	var columnsBox;
	var notClosable = [];
	var checkboxes = [];
	
	this.transferFunction = function(rows){
		var rowsOut = JSON.parse(JSON.stringify(rows));
		rowsOut.forEach(row => {
			columnsToHide.forEach(columnNameToHide => delete row[columnNameToHide]);
		});
		return rowsOut;
	}
	
	this.render = function(){
		this.tHeadBoxes.forEach((box, index) => {
			var columnName = this.responsiveTable.getColumns()[index];
			if(columnsToHide.indexOf(columnName) != -1) box.parentNode.parentNode.style.display = "none";
			else box.parentNode.parentNode.style.display = "";
		});
	}
	
	this.renderTHeadBoxes = function(){
		var self = this;
		this.tHeadBoxes.forEach((box, index) => {
			if(box.parentNode.parentNode.classList.contains("notClosable")){
				notClosable.push(this.responsiveTable.getColumns()[index]);
				return;
			}
			var a = document.createElement("a");
			a.innerHTML = "<span style='mask-image: url(/images/close.png); -webkit-mask-image: url(/images/close.png)'>";
			a.className = "cellButton closeButton";
			a.columnName = this.responsiveTable.getColumns()[index];
			a.index = index;
			a.addEventListener("click", function(){
				columnsToHide.push(this.columnName);
				checkboxes[this.columnName].checked = false;
				self.responsiveTable.updateModule(self);
			});
			box.appendChild(a);
		});
		
	}
	
	this.renderColumnsBox = function(){
		var self = this;
		columnsBox = Dom.id(this.responsiveTable.getTableId()+"_addcolumns");
		var columns = this.responsiveTable.getColumns();
		columns.forEach(columnName => {
			if(notClosable.indexOf(columnName) != -1) return;
			var checkboxlabel = document.createElement("label");
			checkboxlabel.style.display = "block";
			var checkboxtext = document.createElement("span");
			checkboxtext.innerText = columnName;
			var checkboxinput = document.createElement("input");
			checkboxinput.type = "checkbox";
			checkboxinput.className = "hiderCheckbox";
			checkboxinput.checked = (columnsToHide.indexOf(columnName) == -1);
			checkboxinput.columnName = columnName;
			checkboxinput.addEventListener("change", function(){
				if(this.checked) {
					var index = columnsToHide.indexOf(this.columnName);
					if(index > -1) columnsToHide.splice(index, 1);
				}
				else {
					columnsToHide.push(this.columnName);
				}
				self.responsiveTable.updateModule(self);
			});
			checkboxlabel.appendChild(checkboxinput);
			checkboxlabel.appendChild(checkboxtext);
			checkboxes[columnName] = checkboxinput;
			columnsBox.appendChild(checkboxlabel);
		});
	}
	
	var updateCheckBoxesBasedOnColumnsToHide = function(){
		columnsBox.getElementsByClassName("hiderCheckbox").toArray().forEach(checkbox => {
			checkbox.checked = (columnsToHide.indexOf(checkbox.columnName) == -1);
		});
	}
	
	var setColumnsToHide = function(self){
		self.tHeadBoxes.forEach((box, index) => {
			var td = box.parentNode.parentNode;
			if(td.classList.contains("hiddenColumn")){
				var columnName = this.responsiveTable.getColumns()[index];
				columnsToHide.push(columnName);
			}
		});
	}
	
	this.saveContext = function(){
		var sessionStorageItem = this.responsiveTable.getTableId() + "_ColumnsHider";
		sessionStorage[sessionStorageItem] = "";
		sessionStorage[sessionStorageItem] = JSON.stringify(columnsToHide);
	}
	
	this.restoreContext = function(){
		var storage = sessionStorage[this.responsiveTable.getTableId() + "_ColumnsHider"];
		if(storage){
			columnsToHide = JSON.parse(storage);
		}
		else setColumnsToHide(this);
	}
	
	this.restoreDefaultContext = function(){
		columnsToHide = [];
		setColumnsToHide(this);
		updateCheckBoxesBasedOnColumnsToHide();
	}
	
	this.init = function(){
		this.renderColumnsBox();
	}
	
}

function ResponsiveTableFilter(){
	this.responsiveTable;
	this.tHeadBoxes;
	this.index;
	this.reapplyable = false;
	var valuesToHide = {};
	var filteredData;
	
	this.transferFunction = function(rows){
		filteredData = rows.filter(row => {
			for(key in row){
				if(valuesToHide[key]){
					if(this.responsiveTable.getColumnClassList(key).contains("multipleValues")){
						if(row[key].split(getSeparator(key)).reduce((bool, subvalue) => {return bool || !valuesToHide[key][getRealValue(key, subvalue)]}, false) == false) return false; 
					}
					else if(this.responsiveTable.getColumnClassList(key).contains("filterDate")){
						var date = new Date(row[key]);
						var initialDate = new Date(valuesToHide[key]["initial"]);
						var finalDate = new Date(valuesToHide[key]["final"]);
						if(valuesToHide[key]["initial"]){
							if(date.toString() == "Invalid Date" || date <= initialDate) return false;
						}
						if(valuesToHide[key]["final"]){
							if(date.toString() == "Invalid Date" || date >= finalDate) return false;
						}
					}
					else if(valuesToHide[key][row[key]]) return false;
				}
			}
			return true;
		});
		return filteredData;
	}
	
	this.render = function(){
		this.tHeadBoxes.forEach((box, index) => {
			if(box.parentNode.parentNode.classList.contains("notFiltrable")) return;
			else if(box.parentNode.parentNode.classList.contains("filterDate")){
				var inputDates = box.getElementsByTagName("input").toArray();
				if(inputDates.reduce((shouldColorize, input) => {return shouldColorize || input.value != ""}, false)){
					box.getElementsByClassName("filterButton")[0].children[0].style.backgroundColor = "#07f";
				}
				else box.getElementsByClassName("filterButton")[0].children[0].style.backgroundColor = "";
			}
			else {
				var columnName = this.responsiveTable.getColumns()[index];
				var distinctValues = getDistinctValues(columnName);
				var checkboxes = box.getElementsByTagName("input").toArray();
				checkboxes.forEach(x => {
					if(distinctValues.indexOf(x.value) == -1 && !x.keepVisible) x.parentNode.style.display = "none";
					else {
						x.parentNode.style.display = "";
					}
				});
				if(checkboxes.reduce((shouldColorize, checkbox) => {return shouldColorize || checkbox.keepVisible}, false)){
					box.getElementsByClassName("filterButton")[0].children[0].style.backgroundColor = "#07f";
				}
				else box.getElementsByClassName("filterButton")[0].children[0].style.backgroundColor = "";
			}
		});
	}
	
	var getRealValue = function(columnName, value){
		if(this.responsiveTable.getColumnClassList(columnName).contains("embeddedValue")){
			var parsedValue = new DOMParser().parseFromString(value, "text/html");
			var embeddedClass = parsedValue.getElementsByClassName("embeddedValue");
			if(embeddedClass.length >= 1) return embeddedClass[0].innerText;
		}
		return value;
	}
	
	var getSeparator = function(columnName){
		return this.responsiveTable.getColumn(columnName).getAttribute("separator") || ", ";
	}
	
	var getDistinctValues = function(columnName){
		var data;
		if(filteredData) data = filteredData;
		else data = this.responsiveTable.getRawData();
		
		if(this.responsiveTable.getColumnClassList(columnName).contains("multipleValues")) 
			return data.map(x => x[columnName].split(getSeparator(columnName))).reduce((array, value) => {value.forEach(x => array.push(getRealValue(columnName, x))); return array;}, []).filter(function(value, index, self){ return self.indexOf(value) === index});
		else 
			return data.map(x => x[columnName]).filter(function(value, index, self){ return self.indexOf(value) === index});
	}
	
	this.renderTHeadBoxes = function(){
		var self = this;
		this.tHeadBoxes.forEach((box, index) => {
			if(box.parentNode.parentNode.classList.contains("notFiltrable")) return;
			
			var columnName = this.responsiveTable.getColumns()[index];
			var distinctValues = getDistinctValues(columnName);
				
			
			var a = document.createElement("a");
			var filterBox = document.createElement("div");
			
			filterBox.className = "filterBox";
			a.innerHTML = "<span style='mask-image: url(/images/filter.png); -webkit-mask-image: url(/images/filter.png); margin-right: 2px;'>";
			a.className = "cellButton filterButton";
			a.box = filterBox;
			a.visible = false;
			
			a.addEventListener("click", function(){
				self.tHeadBoxes.forEach(x => {
					var filterBox = x.getElementsByClassName("filterBox")[0];
					if(filterBox) filterBox.style.display = "none"
				});
				if(this.visible){
					this.box.style.display = "none";
				}
				else {
					this.box.style.display = "block";
				}
				this.visible = !this.visible;
			});
			
			// Create date options
			if(box.parentNode.parentNode.classList.contains("filterDate")){
				var initialDate = document.createElement("input");
				var initialDateLabel = document.createElement("span");
				var finalDate = document.createElement("input");
				var finalDateLabel = document.createElement("span");
				var reset = document.createElement("button");
				
				reset.innerHTML = "Padrão";
				reset.style.display = "block";
				reset.columnName = columnName;
				reset.initialDate = initialDate;
				reset.finalDate = finalDate;
				reset.onclick = function(){
					this.initialDate.value = "";
					this.finalDate.value = "";
					delete valuesToHide[this.columnName]["initial"];
					delete valuesToHide[this.columnName]["final"];
					self.responsiveTable.updateModule(self);
				}
				
				initialDate.type = "date";
				initialDate.className = "filterDateInput";
				initialDate.columnName = columnName;
				if(valuesToHide[columnName]["initial"])
					initialDate.value = valuesToHide[columnName]["initial"].slice(0,10);
				initialDate.onchange = function(){
					valuesToHide[this.columnName]["initial"] = new Date(this.value);
					self.responsiveTable.updateModule(self);
				}
				initialDateLabel.innerText = "Início: ";
				
				finalDate.type = "date";
				finalDate.className = "filterDateInput";
				finalDate.columnName = columnName;
				if(valuesToHide[columnName]["final"])
					finalDate.value = valuesToHide[columnName]["final"].slice(0,10);
				finalDate.onchange = function(){
					valuesToHide[this.columnName]["final"] = new Date(this.value);
					self.responsiveTable.updateModule(self);
				}
				finalDateLabel.innerText = "Fim: ";
				
				filterBox.appendChild(reset);
				filterBox.appendChild(initialDateLabel);
				filterBox.appendChild(initialDate);
				filterBox.appendChild(finalDateLabel);
				filterBox.appendChild(finalDate);
			}
			
			// Create default options
			else {
				
				// Create uncheck all button
				var button = document.createElement("button");
				button.innerHTML = "<img src='/images/uncheck.png' width=20px>";
				button.addEventListener("click", function(){
					var checkboxes = this.parentNode.getElementsByClassName("filterCheckbox").toArray();
					checkboxes.forEach(checkbox => {
						if(checkbox.parentNode.style.display == "") checkbox.keepVisible = true;
						checkbox.checked = false;
						valuesToHide[checkbox.columnName][checkbox.value] = true;
					});
					self.responsiveTable.updateModule(self);
				});
				filterBox.appendChild(button);
				
				// Create check all button
				var button = document.createElement("button");
				button.innerHTML = "<img src='/images/check.png' width=20px>";
				button.addEventListener("click", function(){
					var checkboxes = this.parentNode.getElementsByClassName("filterCheckbox").toArray();
					checkboxes.forEach(checkbox => {
						checkbox.keepVisible = false;
						checkbox.checked = true;
						delete valuesToHide[checkbox.columnName][checkbox.value];
					});
					self.responsiveTable.updateModule(self);
				});
				filterBox.appendChild(button);
				
				distinctValues.sort().forEach(value => {
					filterBox.appendChild(this.createCheckBox(value, columnName));
				});
			
			}
			
			box.appendChild(a);
			box.appendChild(filterBox);
		});
		
		
	}
	
	this.setvaluesToHide = function(){
		var columns = this.responsiveTable.getColumns();
		columns.forEach(columnName => {
//			var valuesToHideElement = {};
//			var distinctValues = getDistinctValues(columnName);
//			distinctValues.forEach(value => {
//				valuesToHideElement[value] = true;
//			});
			valuesToHide[columnName] = {};
		});
	}
	
	this.createCheckBox = function(value, columnName){
		var self = this;
		var checkboxlabel = document.createElement("label");
		var checkboxtext = document.createElement("span");
		checkboxtext.innerHTML = (value) ? value : "Vazio";
		var checkboxinput = document.createElement("input");
		checkboxinput.type = "checkbox";
		checkboxinput.checked = !valuesToHide[columnName][value];
		checkboxinput.className = "filterCheckbox";
		checkboxinput.value = value;
		checkboxinput.columnName = columnName;
		checkboxinput.keepVisible = valuesToHide[columnName][value];
		checkboxinput.onchange = function(){
			this.keepVisible = !this.checked;
			if(this.checked) delete valuesToHide[this.columnName][this.value];
			else valuesToHide[this.columnName][this.value] = true;
			self.responsiveTable.updateModule(self);
		}
		checkboxlabel.appendChild(checkboxinput);
		checkboxlabel.appendChild(checkboxtext);
		return checkboxlabel;
	}
	
	this.saveContext = function(){
		var sessionStorageItem = this.responsiveTable.getTableId() + "_Filter";
		sessionStorage[sessionStorageItem] = JSON.stringify(valuesToHide);
	}
	
	this.restoreContext = function(){
		var storage = sessionStorage[this.responsiveTable.getTableId() + "_Filter"];
		if(storage) {
			valuesToHide = JSON.parse(storage);
		}
		else this.setvaluesToHide();
	}
	
	this.restoreDefaultContext = function(){
		filteredData = undefined;
		this.tHeadBoxes.forEach((box, index) => {
			box.getElementsByClassName("filterCheckbox").toArray().forEach(checkbox => {
				checkbox.checked = true;
				checkbox.keepVisible = false;
			});
			box.getElementsByClassName("filterDateInput").toArray().forEach(input => {
				input.value = "";
			});
		});
		this.setvaluesToHide();
	}
}

function ResponsiveTableSorter(_columnToSort, order){
	this.responsiveTable;
	this.tHeadBoxes;
	this.index;
	this.reapplyable = false;
	
	var columnToSort;
	if(_columnToSort) columnToSort = _columnToSort;
	
	this.revert = false;
	if(order) this.revert = true;
	
	var sortButtons = [];
	
	this.setColumnToSort = function(columnName){
		this.columnToSort = columnName;
	}
	
	this.transferFunction = function(rows){
		var ret =	rows.sort((a,b) => {
			var aStr = hta(a).join();
			var bStr = hta(b).join();
			return (a[columnToSort]+aStr).localeCompare(b[columnToSort]+bStr, false, {numeric: true});
		});
		if(this.revert) return ret.reverse();
		return ret;
	}
	
	this.renderTHeadBoxes = function(){
		var self = this;
		this.tHeadBoxes.forEach((box, index) => {
			if(box.parentNode.parentNode.classList.contains("notSortable")) return;
			var a = document.createElement("a");
			a.innerHTML = "<span style='mask-image: url(/images/sort.png); -webkit-mask-image: url(/images/sort.png)'>";
			a.className = "cellButton sortButton";
			a.columnName = this.responsiveTable.getColumns()[index];
			if(a.columnName == columnToSort) a.children[0].style.backgroundColor = "#07f";
			a.addEventListener("click", function(){
				if(this.columnName == columnToSort){
					self.revert = !self.revert;
				}
				else self.revert = false;
				sortButtons.forEach(x => x.children[0].style.backgroundColor = "");
				this.children[0].style.backgroundColor = "#07f";
				columnToSort = this.columnName;
				self.responsiveTable.updateModule(self);
			});
			box.appendChild(a);
			sortButtons.push(a);
		});
	}
	
	this.saveContext = function(){
		var sessionStorageItem = this.responsiveTable.getTableId() + "_Sorter";
		sessionStorage[sessionStorageItem] = JSON.stringify({columnName: columnToSort, revert: this.revert});
	}
	
	this.restoreContext = function(){
		var storage = sessionStorage[this.responsiveTable.getTableId() + "_Sorter"];
		if(storage) {
			var parsed = JSON.parse(storage);
			columnToSort = parsed.columnName;
			this.revert = parsed.revert;
		}
		else columnToSort = this.responsiveTable.getColumns()[0];
	}
}


function ResponsiveTableFiltroDemanda(){
	var valuesToHide = [];
	var elements = {
		responsive_filtro_demanda_vazio: -1,
		responsive_filtro_demanda_reprimida: 0,
		responsive_filtro_demanda_observacao: 1,
		responsive_filtro_demanda_efetivo: 2,
		responsive_filtro_demanda_nefetivo: 3,
		responsive_filtro_demanda_egresso: 4
	}
	
	var getSeparator = function(columnName){
		return this.responsiveTable.getColumn(columnName).getAttribute("separator") || ", ";
	}
	
	var getElementByValue = function(value){
		return Object.keys(elements).find(key => elements[key] == value);
	}
	
	var getRealValue = function(value){
		var parsedValue = new DOMParser().parseFromString(value, "text/html");
		var valorDemanda = parsedValue.getElementsByClassName("valorDemanda");
		if(valorDemanda.length >= 1) return parseInt(valorDemanda[0].innerText);
		return parseInt(value);
	}
	
	var shouldHide = function(demanda){
		return valuesToHide.indexOf(demanda) != -1;
	}
	
	var updateCheckBoxState = function(demanda, value){
		var checkboxclass = getElementByValue(demanda);
		if(checkboxclass){
			Dom.className(checkboxclass)[0].checked = value;
		}
	}
	
	this.set = function(demanda, value){
		if(value == false && valuesToHide.indexOf(demanda) == -1){
			valuesToHide.push(demanda);
		}
		else if (value == true && valuesToHide.indexOf(demanda) > -1)
			valuesToHide.splice(valuesToHide.indexOf(demanda),1);
		
		updateCheckBoxState(demanda, value);
		this.responsiveTable.updateModule(this);
	}
	
	this.setall = function(checked){
		Dom.id("responsive_filtro_demanda").getElementsByTagName("input").toArray().forEach(checkbox => {
			checkbox.checked = checked;
			checkbox.onchange();
		});
	}
	
	this.transferFunction = function(rows){
		var key = "Áreas de interesse";
		filteredData = rows.filter(row => {
			if(row[key] == "" && shouldHide(-1)) return false;
			return row[key].split(getSeparator(key)).reduce((bool, subvalue) => {
				return bool || !shouldHide(getRealValue(subvalue));
			}, false);
		});
		return filteredData;
	}
	
	this.init = function(){
		var self = this;
		for(key in elements){
			Dom.className(key)[0].value = elements[key];
			Dom.className(key)[0].onchange = function(){
				self.set(elements[this.className], this.checked);
			}
		}
	}
	
	this.saveContext = function(){
		var sessionStorageItem = this.responsiveTable.getTableId() + "_FiltroDemanda";
		sessionStorage[sessionStorageItem] = JSON.stringify(valuesToHide);
	}
	
	this.restoreContext = function(){
		var storage = sessionStorage[this.responsiveTable.getTableId() + "_FiltroDemanda"];
		if(storage){
			valuesToHide = JSON.parse(storage);
			for(key in elements){
				Dom.className(key)[0].checked = !shouldHide(elements[key]);
			}
		}
	}
}

function ResponsiveTableCodFilter(labelToFilter_, inputCod_){
  var responsiveTable;
  var self = this;
  var inputCod = Dom.id(inputCod_);
  var labelToFilter = labelToFilter_;

  inputCod.addEventListener("keyup", function(e){
      self.responsiveTable.updateModule(self);
  })
  
  this.transferFunction = function(rows){
    filteredData = rows.filter(row => row[labelToFilter].indexOf(inputCod.value) >= 0);
    return filteredData;
  }
}

function ResponsiveTable(tableId){
	var tableDiv = Dom.id(tableId);
	var pageButtonsBox = Dom.className(tableId + "_buttons");
	var rowsPerPage = 10;
	var currentPage = 0;
	var rawData = [];
	var columns = [];
	var rowsToRender = [];
	var rowsOut = [];
	var modules = [];
	var firstUpdate = true;
	
	this.getData = function(){
		var headCells = tableDiv.tHead.rows[0].cells.toArray();
		var bodyRows = tableDiv.tBodies[0].rows.toArray();
		
		// Saves columns
		columns = headCells.map(x => x.innerHTML);
		
		// Saves each row
		rawData = bodyRows.map(row => {
			return row.cells.toArray().reduce((hash, cell, index) => {
				hash[columns[index]] = cell.innerHTML;
				return hash;
			}, {});
		});
		
	}
	
	this.generateRenderData = function(){
		rowsOut = [];
		rowsOut.push(JSON.parse(JSON.stringify(rawData))); // Deep copy
		modules.forEach(module => this.applyTransferFunction(module));
		this.generatePage();
	}
	
	this.regenerateRenderData = function(module){
		if(module.reapplyable) this.applyTransferFunction(module);
		else {
			rowsOut = rowsOut.splice(0, module.index+1);
			for(var i=module.index; i<modules.length; i++){
				this.applyTransferFunction(modules[i]);
			}
		}
		this.generatePage();
	}
	
	this.applyTransferFunction = function(module){
		if(module.transferFunction) rowsOut.push(module.transferFunction(rowsOut[rowsOut.length-1]));
		else console.warn("module didn't implement transferFunction");
	}
	
	this.generatePage = function(){
		if(currentPage+1 > this.numPages()){
			currentPage = this.numPages()-1;
			if(currentPage < 0) currentPage = 0;
		}
		
		rowsToRender = rowsOut[rowsOut.length-1].slice(currentPage*rowsPerPage, currentPage*rowsPerPage+rowsPerPage);
	}
	
	this.renderRows = function(){
		tableDiv.tBodies[0].innerHTML = "";
		if(rowsToRender.length == 0){
			tableDiv.tBodies[0].innerText = "Sem dados";
		}
		tableDiv.className = "responsible_visible";
		rowsToRender.forEach(row => {
			var tr = document.createElement("tr");
			for(columnKey in row) {
				var td = document.createElement("td");
				td.innerHTML = row[columnKey];
				tr.appendChild(td);
			}
			tableDiv.tBodies[0].appendChild(tr);
		});
	}
	
	this.firstRenderHead = function(){
		modules.forEach(module => {
			if(module.renderTHeadBoxes) module.renderTHeadBoxes();
			else console.warn("module didn't implement renderTHeadBoxes");
		});
	}
	
	this.modulesInit = function(){
		modules.forEach(module => {
			if(module.init) module.init();
		});
	}
	
	this.renderModules = function(){
		modules.forEach(module => {
			if(module.render) module.render();
		});
	}
	
	this.createTHeadBoxCellsArea = function(){
		var headCells = tableDiv.tHead.rows[0].cells.toArray();
		headCells.forEach(cell => {
			var headBoxCell = document.createElement("span");
			headBoxCell.className = "headBoxCell";
			cell.appendChild(headBoxCell);
		});
	}
	
	this.createTHeadBoxCells = function(){
		var boxes = tableDiv.tHead.rows[0].getElementsByClassName("headBoxCell").toArray();
		var moduleBoxes = [];
		boxes.forEach(box => {
			var moduleBox = document.createElement("span");
			moduleBox.className = "headBoxCellModule";
			box.appendChild(moduleBox);
			moduleBoxes.push(moduleBox);
		});
		return moduleBoxes;
	}
	
	this.renderPageButtons = function(){
			self = this;
			pageButtonsBox.forEach(b => {
				b.innerHTML = "";
				var downButton = document.createElement("span");
				downButton.innerText = "<<";
				downButton.className = "pageButton";
				b.appendChild(downButton);
				if(currentPage > 0){
					downButton.addEventListener("click", function(){self.previousPage()});
					downButton.className += " pageButton_hover";
				}
				
				for(var i=0 ; i < this.numPages(); i++){
					var but = document.createElement("span");
					but.innerText = i+1;
					but.index = i;
					but.className = "pageButton pageButton_hover";
					but.addEventListener("click", function(){self.setPage(this.index)});
					if(i == currentPage){
						but.style.background = "#00349a";
						but.style.color = "#fff";
					}
					b.appendChild(but);
				}
				
				var upButton = document.createElement("span");
				upButton.innerText = ">>";
				upButton.className = "pageButton";
				b.appendChild(upButton);
				if(currentPage+1 < this.numPages()){
					upButton.addEventListener("click", function(){self.nextPage()});
					upButton.className += " pageButton_hover";
				}
			});
		}
	
	this.getRawData = function(){return rawData;}
	this.getColumns = function(){return columns;}
	this.getModules = function(){return modules;}
	this.getTableId = function(){return tableId;}
	this.getRowsOut = function(){return rowsOut[rowsOut.length-1];}
	
	this.appendModule = function(module){
		module.responsiveTable = this;
		module.tHeadBoxes = this.createTHeadBoxCells();
		module.index = modules.length;
		modules.push(module);
	}
	
	this.numPages = function(){
		return Math.ceil(rowsOut[rowsOut.length-1].length/rowsPerPage);
	}
	
	this.setPage = function(pageNum){
		if(pageNum < this.numPages() && pageNum >= 0) {
			currentPage = pageNum;
			this.updateLight();
		}
		else console.warn("pageNum out of bounds");
	}
	
	this.nextPage = function(){
		if(currentPage+1 < this.numPages()) {
			currentPage++;
			this.updateLight();
		}
		else console.warn("No more pages");
	}
	
	this.previousPage = function(){
		if(currentPage > 0){
			currentPage--;
			this.updateLight();
		}
		else console.warn("No negative page");
	}
	
	this.init = function(){
		this.restoreContext();
		this.firstRenderHead();
		this.modulesInit();
		this.update();
	}
	
	this.update = function(){
		this.generateRenderData();
		this.updateLight();
	}
	
	this.updateModule = function(module){
		this.regenerateRenderData(module);
		this.updateLight();
	}
	
	this.updateLight = function(){
		this.generatePage();
		this.renderModules();
		this.renderRows();
		this.renderPageButtons();
		this.saveContext();
	}
	
	this.restoreContext = function(){
		modules.forEach(module => {
			if(module.restoreContext) module.restoreContext()
		});
		
		var storage = sessionStorage[tableId + "_currentPage"];
		if(storage) currentPage = JSON.parse(storage);
	}
	
	this.saveContext = function(){
		modules.forEach(module => {
			if(module.saveContext) module.saveContext()
		});
		
		sessionStorage[tableId + "_currentPage"] = JSON.stringify(currentPage);
	}
	
	this.getColumn = function(columnName){
		return tableDiv.tHead.rows[0].cells[columns.indexOf(columnName)];
	}
	
	this.getColumnClassList = function(columnName){
		return this.getColumn(columnName).classList;
	}
	
	this.print = function(){
		var w = window.open("", "PRINT", "height=400,width=600");
		var style = "<link rel='stylesheet' type='text/css' href='../resources/stylesheet/theme.css'><style>.cellButton{display:none;} label{display: none}input,button,label{display: none;}</style>";
		
		var oldRowsPerPage = rowsPerPage;
		var oldCurrentPage = currentPage;
		
		rowsPerPage = 10000;
		this.updateLight();
		
		w.document.write(style + "<div>Linhas retornadas: " + rowsToRender.length + "</div>" + "<table>" + tableDiv.innerHTML + "</table>");
		
		currentPage = oldCurrentPage;
		rowsPerPage = oldRowsPerPage;
		
		this.updateLight();
		
		w.print();
	}
	
	this.getData();
	this.createTHeadBoxCellsArea();
}