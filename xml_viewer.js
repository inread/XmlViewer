Array.prototype.filter = function(cond) {
	var i, list = [];
	for(i = 0; i < this.length; i++) {
		if(cond(this[i])) {
			list.push(this[i]);
		}
	}
	return list;
};
if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(needle) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === needle) {
				return i;
			}
		}
		return -1;
	};
}

var xmlViewer = {
	load: function(xml, destination) {
		while(destination.hasChildNodes) {
			destination.removeChild(destination.firstChild());
		}
		var xdoc = xmlViewer.getXmlObject(xml);
		xmlViewer.processElement(xdoc.firstChild, document.getElementById(destination));
	},
	processElement: function(element, destination) {
		var wrapper = xmlViewer.createElement("div", { className: "element-wrapper" });
		var title = xmlViewer.createElement("div", { className: "element" });	
		var titleText = xmlViewer.createElement("span");
		if(element.nodeName === "#text") {
			var content = element.textContent.trim();
			if(content == "")
				return;
			titleText.className = "element-text";
			titleText.innerText = "'" + content + "'";
		} else {
			var toggle = xmlViewer.createElement("span", { className: "element-toggle-expanded" } );
			toggle.addEventListener("click", xmlViewer.toggleChildrenHidden, false);
			title.appendChild(toggle);
			titleText.className = "element-name";
			titleText.innerText = element.nodeName;
		}
		title.appendChild(titleText);
		if(element.attributes && element.attributes.length > 0) {
			var attributes = xmlViewer.createElement("div", { className: "attributes-wrapper" });
			for(var i = 0; i < element.attributes.length; i++) {
				var attr = xmlViewer.createElement("div", { className: "attribute-wrapper" });
				var name = xmlViewer.createElement("span", { className: "attribute-name", innerText: element.attributes[i].nodeName });
				var value = xmlViewer.createElement("span", { className: "attribute-value", innerText: element.attributes[i].value });
				attr.appendChild(name);
				attr.appendChild(value);
				attributes.appendChild(attr);
			}
			title.appendChild(attributes);
		}
		wrapper.appendChild(title);
		destination.appendChild(wrapper);
		for(var i = 0; i < element.childNodes.length; i++) {
			xmlViewer.processElement(element.childNodes[i], wrapper);
		}
	},
	toggleChildrenHidden: function(ev) {
		if(xmlViewer.hasClass(ev.target, "element-toggle-expanded")) {
			xmlViewer.removeClass(ev.target, "element-toggle-expanded");
			xmlViewer.addClass(ev.target, "element-toggle-collapsed");
		} else {
			xmlViewer.addClass(ev.target, "element-toggle-expanded");
			xmlViewer.removeClass(ev.target, "element-toggle-collapsed");
		}
		var toggleTargets = ev.target.parentNode.parentNode.getElementsByClassName("element-wrapper");
		for(var i = 0; i < toggleTargets.length; i++) {
			xmlViewer.toggleHidden(toggleTargets[i]);
		}
		var toggleTargets = ev.target.parentNode.parentNode.getElementsByClassName("attribute-wrapper");
		for(var i = 0; i < toggleTargets.length; i++) {
			xmlViewer.toggleHidden(toggleTargets[i]);
		}
	},
	getXmlObject: function(xml) {
		if(window.DOMParser) {
			return new DOMParser().parseFromString(xml, "text/xml");
		} else {
			var xdoc = new ActiveXObject("Microsoft.XMLDOM");
			xdoc.async = false;
			xdoc.loadXML(xml);
			return xdoc;
		}
	},
	toggleHidden: function(target) {
		if(xmlViewer.hasClass(target, "element-hidden"))
			xmlViewer.removeClass(target, "element-hidden")
		else
			xmlViewer.addClass(target, "element-hidden");
	},
	removeClass: function(element, className) {
		var classes = element.className.split(" ");
		var indexOf = classes.indexOf(className);
		if(indexOf == -1)
			return;
		classes.splice(indexOf, 1);
		element.className = classes.filter(function(item) { return !!item; }).join(" ");
	},
	addClass: function(element, className) {
		var classes = element.className.split(" ");
		if(classes.indexOf(className) > -1)
			return;
		classes.push(className);
		element.className = classes.filter(function(item) { return !!item; }).join(" ");
	},
	hasClass: function(element, className) {
		var classes = element.className.split(" ");
		return classes.indexOf(className) > -1;
	},
	createElement: function(type, props) {
		var element = document.createElement(type);
		if(!props)
			return element;
		for(var attr in props) {
			element[attr] = props[attr];
		}
		return element;
	}
}
