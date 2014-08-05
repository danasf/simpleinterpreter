/*  
	Simple JS Lexer
*/

var lexer = function(input) {

	console.log("Full string:",input);

	var tokens = [];
	var i=0;
	var c;


	var isOperator = function (c) { 
		return c.match(/[+\-*\/\^%=(),]/);
	};

	// is this thing a number, easy, look for numbers or period
	var isNumber = function(c) {
		return c.match(/[0-9.]/);
	};

	// does match spach
	var isWhiteSpace = function (c) { 
		return c.match(/\s/);
	};

	// is it not any of above or undef
	var isIdentifier = function(c) { 
		return !null && !undefined && !isOperator(c) && !isNumber(c) && !isWhiteSpace(c);
	};

	// add to tokens
	var addToken = function(type,value) {
		tokens.push({ type: type, value: value });
	};

	// while less than len
	while(i < input.length) {
		// read char
		c = input.charAt(i);
		// if white space advance
		if(isWhiteSpace(c)) { i++; }

		// if an operator, add that and advance
		else if (isOperator(c)) {
			console.log("operator",c);
			addToken("operator",c);
			i++;
		}
		// if a number
		else if(isNumber(c)) { 

			var num=c;
			// while it's a number advance
			while(isNumber(input.charAt(++i))) {
				// add to num
				num += input.charAt(i);
			}
			console.log("number",num);
			addToken("number",num);

		} 
		// if it's an identifier
		else if(isIdentifier(c)) { 
			var ident=c;

			// while it's an identifier and less than the input length
			while(isIdentifier(input.charAt(++i)) && i < input.length) {
				ident += input.charAt(i);
			}
			console.log("identifier",ident);
			addToken("identifier",ident);
		}
		else { console.log("unknown token"); }
	}
	addToken("!END","!END");
	return tokens;
};

var revPolParse = function (tokens) {

	var step=0;

	console.log("=========== Parsing ===========");

	var nums = tokens.filter(function(x,i) { 
		if(x.type == 'number') { return x.value; }
	});

	var ops = tokens.filter(function(x) { 
		if(x.type =='operator') { return x.value; }
	});

	console.log(nums,ops);

	var what = nums.reduce(function(prev,curr,index, arr) { 
		prev+ops[index]+curr;
	},0);

	var evalOp = { 
		"+": function (a,b) {
			return a+b;
		},
		"-": function (a,b) {
			return a-b;
		},
		"*": function (a,b) {
			return a*b;
		},
		"/": function (a,b) {
			return a/b;
		}
	};

	var evaluate = function () {
		for(var q=0; q < ops.length; ops++) {
			var tmp = evalOp[ops[q]];
			nums[q];
		}
	};

	console.log(what);

};

var test = lexer("300 200 + is a something. Here is another something (3+2)");
console.log("Tokens:",test);

console.log("Tokens:",lexer("300.0 + 200 + 100 is a number"));

console.log("Reverse Polish Notation, hehe:",lexer("100 200 300 + +"));

console.log(revPolParse(lexer("100 200 300 + +")));
