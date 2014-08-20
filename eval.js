/*
	Simple Eval
*/

var evaluate = function(tree) {
	
	var output = "";

	// simple mathmatical operations
	var operations = {
		"+" : function(a,b) {
			return parseInt(a,10) + parseInt(b,10);
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
	var funcs = { 	};

	// arguments passed
	var args = {};

	// constants and pre-defined variables
	var variables = { pi: 3.1415, meaning_of_life: 42};

	var evalNode = function(node) {
		console.log("Evaluating",node.type);
		// literal number
		if(node.type === "number") {
			return node.value;
		}

		// operators
		else if (operations[node.type]) {
			if (node.left) { return operations[node.type](evalNode(node.left),evalNode(node.right)); }
			else { 	return operators[node.type](parseNode(node.right)); }
		}

		// identifier
		else if (node.type === "identifier") {
			console.log(node);
			var val = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
			if (typeof val == undefined) { throw node.value + " is undefined"; }
			return val;
		}

		// an assign
		else if (node.type === "assign") {
			variables[node.name] = evalNode(node.value);
		}

		// are you a call
		else if (node.type ==="call") {
			node.args = node.args.map(function(val,i) {
				evalNode(this);
			});
			return funcs[node.name].apply(null,node.args);
		}
		// are you a function
		else if (node.type === "function") {
			funcs[node.name] = function() {
				node.args.forEach(function(val,i) {
					args[val.value] = arguments[i];
				});
				// clear args
				args = {};
				// return 
				return evalNode(node.value);
			};

		}
	};
	// for everything in the tree, evaluate!
	tree.forEach(function(val,i) { 
		var res = evalNode(val);
		if(typeof(res) !== "undefined") { 
			output += res + "\n";
		 }
	});
	return output;
};