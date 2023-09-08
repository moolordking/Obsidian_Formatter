
let date_show = "";
let current_name = "";
init();
function init() {
	if (localStorage.getItem("OUT_")) {
		document.getElementById("OUT").innerHTML = localStorage.getItem("OUT_");
		toggle_date(false);
	}
	if (localStorage.getItem("FAMILY_")) {
		font_change(localStorage.getItem("FAMILY_"));
	}
	if (localStorage.getItem("SIZE_")) {
		let item = {value: localStorage.getItem("SIZE_")};
		font_size(item);
		document.getElementById("FONT_SIZE").value = item.value;
	}
	if (localStorage.getItem("NAME_")) {
		set_name(localStorage.getItem("NAME_"));
		document.getElementById("NAME").value = current_name;
	}
}

function load_file() {
	let fileToLoad = document.getElementById("uploaded_file").files[0];

	let fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		let text = fileLoadedEvent.target.result;
		let name = fileToLoad.name.split(".")[0];
		file_init(text,name);
	};

	fileReader.readAsText(fileToLoad, "UTF-8");
}

function file_init(text,name) {
	let break_el = "<div class='page_break' style='width: 100%;'></div>"
	document.title = name;
	let list_of_lines = [name];
	list_of_lines = list_of_lines.concat(text.split("\n"));
	let output_list = []
	let code_line = false;
	for (let line=0; line<list_of_lines.length; line++) {
		let content = list_of_lines[line]
		content = content.replaceAll("![[", "<b class='REF1'>").replaceAll("]]", "</b>&#8203;");
		content = content.replaceAll("[[", "<b class='REF2'>").replaceAll("]]", "</b>&#8203;");
		content = content.replaceAll("[", "<b class='REF3'>").replaceAll("]", "</b>&#8203;");
		console.log(content);
		if (line == 0) {
			if (true) {
				let dateObj = new Date();
				let month = dateObj.getUTCMonth() + 1;
				if (month.toString().length < 2) {
					month = "0" + month;
				}
				let day = dateObj.getUTCDate();
				if (day.toString().length < 2) {
					day = "0" + day;
				}
				let year = dateObj.getUTCFullYear();
				current_date = day + "/" + month + "/" + year;
				output_list.push("<h2><span id='NAME_TEXT'>"+current_name+"</span><span id='DATE' class='HIDE'>"+current_date+"</span></h2><br>");
			}
			output_list.push("<h1 id='TITLE'>"+content+"</h1>");
			continue;
		}
		if (content.includes("```") && !code_line) {
			output_list.push("<div contenteditable class='CODE'>");
			code_line = true;
			continue;
		} else if (code_line && !content.includes("```")) {
			if (content.includes("# ")) {
				content = content.replace("# ", "<i class='COMMENT'># ") + "</i>";
			}
			output_list.push(content.replaceAll("	", "&nbsp;&nbsp;&nbsp;") + break_el);
			continue;
		} else if (code_line && content.includes("```")) {
			output_list.push("</div>");
			continue;
		}
		if (content.includes("---")) {
			content = "<hr>";
		}
		if (content.includes("###### ")) {
			content = content.replace("###### ", "<h6>") + "</h6>";
		} else if (content.includes("##### ")) {
			content = content.replace("##### ",  "<h5>") + "</h5>";
		} else if (content.includes("#### ")) {
			content = content.replace("#### ",   "<h4>") + "</h4>";
		} else if (content.includes("### ")) {
			content = content.replace("### ",    "<h3>") + "</h3>";
		} else if (content.includes("## ")) {
			content = content.replace("## ",     "<h2>") + "</h2>";
		} else if (content.includes("# ")) {
			content = content.replace("# ",      "<h1>") + "</h1>";
		}
		if (content.includes("*")) {
			let star_count = [0,0,0];
			let new_content = "";
			for (let letter=0; letter<content.length-2; letter++) {
				if (content.charAt(letter) == "*" && content.charAt(letter+1) == "*" && content.charAt(letter+2) == "*") {
					if (star_count[2] == 1) {
						new_content += "</i></b>";
						star_count[2] = 0;
					} else {
						new_content += "<i><b>";
						star_count[2] = 1;
					}
					letter += 2;
				} else if (content.charAt(letter) == "*" && content.charAt(letter+1) == "*") {
					if (star_count[1] == 1) {
						new_content += "</b>";
						star_count[1] = 0;
					} else {
						new_content += "<b>";
						star_count[1] = 1;
					}
					letter += 1;
				} else if (content.charAt(letter) == "*") {
					if (star_count[0] == 1) {
						new_content += "</i>";
						star_count[0] = 0;
					} else {
						new_content += "<i>";
						star_count[0] = 1;
					}
				} else {
					new_content += content[letter];
				}
			}
			content = new_content;
		}
		if (content.includes("> ")) {
			content = content.replace("> ", "<blockquote>") + "</blockquote>";
			if (line+1<list_of_lines.length && list_of_lines[line+1].includes("> ")) {
				output_list.push(content);
				continue;
			}
		}
		let extra = "";
		output_list.push(content + "<div id='break"+line+"'><button class='BREAK' onclick='add_break(this)'>ADD BREAK</button></div>"+break_el);
	}
	document.getElementById("OUT").innerHTML = output_list.join("");
	localStorage.setItem("OUT_", output_list.join(""));
	toggle_date(false);
}

function add_break(e) {
	let parent = e.parentElement;
	parent.style.height = "30px";
	e.remove();
	parent.innerHTML = "<button class='BREAK R' onclick='remove_break(this)'>REMOVE BREAK</button>";
	localStorage.setItem("OUT_", document.getElementById("OUT").innerHTML);
}

function remove_break(e) {
	let parent = e.parentElement;
	parent.style.height = "0px";
	e.remove();
	parent.innerHTML = "<button class='BREAK' onclick='add_break(this)'>ADD BREAK</button>";
	localStorage.setItem("OUT_", document.getElementById("OUT").innerHTML);
}

function toggle_date(swap=true) {
	if (swap) {
		date_show = !date_show;
		localStorage.setItem("DATE_", date_show);
		localStorage.setItem("OUT_", document.getElementById("OUT").innerHTML);
	}
	if (!date_show) {
		document.getElementById("DATE").classList.add("HIDE");
	} else {
		document.getElementById("DATE").classList.remove("HIDE");
	}
}

function set_name(name) {
	current_name = name;
	document.getElementById("NAME_TEXT").innerHTML = name;
	localStorage.setItem("NAME_", name)
}

function font_change(font) {
	document.getElementById("OUT").style.fontFamily = font;
	document.getElementById("FONTS").innerHTML = "Font: " + font;
	localStorage.setItem("FAMILY_", font);
}

function font_size(e) {
	document.getElementById("OUT").style.fontSize = e.value + "px";
	document.getElementById("FONT_SIZE_DISPLAY").innerHTML = e.value;
	localStorage.setItem("SIZE_", e.value);
}

function print_page() {
	document.getElementById("MENU").style.display = "none";
	document.getElementById("OUT").classList.remove("EDITING");
	let breaks = document.getElementsByClassName("BREAK");
	Array.prototype.forEach.call(breaks, function(b, index) {
	    breaks.item(index).style.display = "none";
	});
	print();
	document.getElementById("MENU").style.display = "block";
	document.getElementById("OUT").classList.add("EDITING");
	Array.prototype.forEach.call(breaks, function(b, index) {
	    breaks.item(index).style.display = "block";
	});
}
