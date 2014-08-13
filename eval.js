/*
	Simple Eval
*/

var evaluate = function(tree) {
	
	var output = "";

	var operations = {
		"+" : function(a,b) {
			return a + b;
		},
		"-" : function(a,b) {
			if(typeof(b) == undefined) { return -a; }
			return a - b;
		},
		"*" : function(a,b) {
			return a * b;
		},
		"/" : function(a,b) {
			return a / b;
		},
		"%": function(a,b) {
			return a % b;
		},
		"^" : function(a,b) {
			return Math.pow(a,b);
		}
	};

	// pre-defined functions
	var funcs = {
		sin: Math,sin,
		cos: Math.cos,
		round: Math.round
	};

	// variables
	var variables = { };

	var parseItem = function(node) {
		if(node.type === "number") {
			return node.value;
		}
		else if (node.type === "identifier") {

		}

		else if (node.type === "assign") {

		}

		else if (node.type ==="call") {

		}

		else if (node.type === "function") {

		}
	};

	tree.forEach(function(val,i) { 
		var res = parseItem(val);
		if(typeof(res) != undefined) { 
			output += res + "\n";
		 }
	});

};