/* 
	Simple JS Parser

	Using Top Down Operator Precedence

	* Associate every operator token with a left bound power, operational function
	* If operator manipulates tokens to LEFT (+), give it a LEFT DENOTATIVE FUNCTION (LED)
	* If does NOT manipulate token to LEFT (-), give it a NULL DENOTATIVE FUNCTION (NUD). Identifiers and Numbers also get this

	http://effbot.org/zone/simple-top-down-parsing.htm
	http://eli.thegreenplace.net/2010/01/02/top-down-operator-precedence-parsing/

*/

var parse = function (tokens) {
	var parseTree = [];
	var symbol_table = {};
	var tokenStep=0;

	// binding powers of various operators
	// prefix -a, infix - is a-b

	var toPrefix = [
		{ key:"-",rbp:10 }
	];

	var toInfix = [
		{ key:"^", lbp:9, rbp:6 },
		{ key:"/", lbp:4 },
		{ key:"*", lbp:4 },
		{ key:"%", lbp:4 },
		{ key:"+",lbp:3 },
		{ key:"-",lbp:3 }
	];

	var toSymbol = 
	[
		{ key:",", nud:null},
		{ key:")", nud:null },
		{ key:"!END", nud:null },
		{ key:"(", nud: function() { return parseParen(); } },
		{ key:"number", nud: function(num) { return num; } }

	];

	// get the current token and interpret
	var getToken = function () { 
		return interpretToken(tokens[tokenStep]); 
	};

	// step forward, return next token
	var advanceToken = function() {
		tokenStep++;
		return getToken();
	};

	/* 
		http://eli.thegreenplace.net/2010/01/02/top-down-operator-precedence-parsing/

		lbp - left binding power (operator precedence)
		led - left denotative function
		nud - null denotative function, 
	*/
	var symbol = function(id, nud, lbp, led) {
		
		// symbol = look up symbol by type in table, OR new object
		var sym = symbol_table[id] || {};
		
		// lbp - binding power
		// nud - null denote
		// led - left denote
		symbol_table[id] = { 
			lbp: sym.lbp || lbp, 
			nud: sym.nud || nud,
			led: sym.led || led
		};

	};

	// reads in a token, creates a symbol
	var interpretToken = function (token) {
		var sym;
		if(token.type === undefined) { token.type = null; }
		if(token.type === "operator") {
			console.log("Now interpreting:", token.type,symbol_table[token.value]);
			sym = Object.create(symbol_table[token.value]);
		}
		else { 		
			console.log("Now interpreting:", token.type,symbol_table[token.type]);
			sym = Object.create(symbol_table[token.type]); 
		}
		sym.type = token.type;
		sym.value = token.value;
		return sym;
	};

	// TDOP algorithm
	var expression = function (rbp) {
		
		// set RBP to default of 2 if null
		//var rbp = rbp || 2;
		
		var left;
		// get a new token and advance
		var t = getToken();
		advanceToken();
		if(!t.nud) { throw "Unknown token type:" + t.type; }
		// in this new token, set nud of self to left  
		left = t.nud(t);

		// as long as right binding power < left binding power
		while(rbp < getToken().lbp) {

			// get a new token and advance
			t = getToken();
			advanceToken();
			if(!t.led) { throw "Unexpected token:" + t.type; }
			// set left 
			left = t.led(left);
		}
		return left;
	};
	
	// id, left binding, right binding, left deno
	var infix = function (id, lbp, rbp, led) {
		// right binding power = rbp if set, else lbp
		rbp = rbp || lbp;
		symbol(id, null, lbp, led || function(left) { 
			return {
				type: id,
				left: left,
				right: expression(rbp)
			};
		});
	}; 

	// id and right binding power only
	var prefix = function (id, rbp) {
		symbol(id, function() {
			return {
				type: id,
				right: expression(rbp)
			};
		});
	};

	// NUD helpers for various operators
	var parseParen = function ()  {
		var val = expression(2);
		advanceToken();
		return val;
	};

	// identifier
	var parseIdentifier = function (name) {
		if(getToken().type === "(") { 
			var args = [];
			if (tokens[tokenStep + 1].type === ")") { advanceToken(); }
			else {
				do {
					advanceToken();
					args.push(expression(2));
				} while (getToken().type === ",");
				if(getToken().type !== ")") { throw "We need a closing parenthesis, yo!"; }
			}
		advanceToken();

		// return an object
		return { 
			type: "call",
			args: args,
			name: name.value
			};
		}
		return name;
	};

	// parse equality
	var parseEquality = function(left) {
		if (left.type === "call") {
			for (var i = 0; i < left.args.length; i++ ) {
				if ( left.args[i].type !== "identifier") { throw "This argument name isn't valid"; }
			}
			return {
				type: "function",
				name: left.name,
				args: left.args,
				value: expression(2)
			};
		} else if ( left.type === "identifier") {
			return {
				type: "assign",
				name: left.value,
				value: expression(2)
			};
		}
		else { throw "Invalid value"; }
	};


	toInfix.map(function(item) { infix(item.key,item.lbp,item.rbp,item.led); });

	toPrefix.map(function(item) { prefix(item.key,item.rbp); });

	toSymbol.map(function(item) { symbol(item.key,item.nud); });


	while(getToken().type !== "!END") {
		parseTree.push(expression(0));
	}

	return parseTree;
};