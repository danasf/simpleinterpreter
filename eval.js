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

	// constants and pre-defined variables
	var variables = { pi: 3.1415, meaning_of_life: 42};

	var parseItem = function(node) {
		if(node.type === "number") {
			return node.value;
		}
		else if (operators[node.type]) {
			if (node.left) { return operators[node.type](parseItem(node.left),parseItem(node.right)); }
		}

		else if (node.type === "identifier") {

		}

		else if (node.type === "assign") {
			variables[node.name] = parseItem(node.value);
		}

		else if (node.type ==="call") {
			var args = node.args.map(function(val,i) {
				parseItem(this);
			});
			return functions[node.name].apply(null,args);
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