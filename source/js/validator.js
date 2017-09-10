var Validator = (function() {
	var __private = {
		validClass: "valid",
		isFormValid: false,

		set(obj) {
			if(obj.hasOwnProperty("form")) this.form = obj.form;
			if(obj.hasOwnProperty("errorClass")) this.errorClass = obj.errorClass;
			if(obj.hasOwnProperty("successClass")) this.successClass = obj.successClass;
			if(obj.hasOwnProperty("result")) this.result = obj.result;


			this.fields = this.formChildren();
			for(let i = 0; i < this.fields.length; i++) {
				let field = this.fields[i];

				if(field.tagName == "INPUT") {
					if(field.type == "number" || field.type == "tel") Validator.number(field);

					if(field.type == "tel") Validator.tel(field);

					if(field.type == "email") {
						field.addEventListener("input", function() {
							Validator.email(this);
						});
					}
				}
			}


			if(this.form.querySelector("input[type=submit]")) {
				this.submit = this.form.querySelector("input[type=submit]");
			} else {
				this.submit = this.form.getElementsByTagName("button")[0];
			}
			this.submit.addEventListener("click", function(event) {
				event = event || window.event;
				event.preventDefault();

				var fields = Validator.fields();
				__private.isFormValid = true;

				Validator.required(fields);

				for (let i = 0; i < fields.length; i++) {
					let field = fields[i];

					if ( (field.tagName == "SELECT") || (field.tagName == "TEXTAREA") || (field.tagName == "INPUT" && field.type == "text") ) {
						Validator.noConditions(field);
					}
				}

				for(let i = 0; i < fields.length; i++) {
					if(!fields[i].classList.contains(__private.validClass)) __private.isFormValid = false;
				}

				Validator.formSubmit(__private.isFormValid);
			});
		},

		formChildren() {
			var arr = [];

			var inputs = this.form.getElementsByTagName("input");
			var selects = this.form.getElementsByTagName("select");
			var textareas = this.form.getElementsByTagName("textarea");

			for(let i = 0; i < inputs.length; i++) {
				if(inputs[i].type !== "submit") arr.push(inputs[i]);
			}

			for(let i = 0; i < selects.length; i++) {
				arr.push(selects[i]);
			}

			for(let i = 0; i < textareas.length; i++) {
				arr.push(textareas[i]);
			}

			return arr;
		},

		required(fields) {
			for(let i = 0; i < fields.length; i++) {
				if(fields[i].required && (!fields[i].value)) fields[i].classList.add(this.errorClass);

				if(fields[i].required && (fields[i].value)) {
					if(fields[i].type !== "email") {
						fields[i].classList.remove(this.errorClass);
					} else {
						if(Validator.email(fields[i])) fields[i].classList.remove(this.errorClass);
					}
				}
			}
		},

		email(inp) {
			var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

			let valid = regEmail.test(inp.value);

			if(valid) {
				inp.classList.remove(this.errorClass);
				inp.classList.add(this.validClass);
				return true;
			} else {
				inp.classList.add(this.errorClass);
				inp.classList.remove(this.validClass);
				return false;
			}
		},

		number(inp) {
			inp.addEventListener("keydown", function(event) {
				event = event || window.event;

				var code = event.keyCode;
				//console.log(code);

				if( (code < 48 || code > 57) && (code < 96 || code > 111) && (code !== 37) && (code !== 39) && (code !== 8) && (code !== 46) && (code !== 188) && (code !== 188) && (code !== 32) && (code !== 189) && (code !== 187) && (code !== 13) ) {
					event.preventDefault();
				}
			});
		},

		tel(inp, numberLength = 1) {
			inp.addEventListener("input", function() {
				if(this.value.length >= numberLength) this.classList.add(__private.validClass);
			});
		},

		noConditions(el) {
			if(!el.required) el.classList.add(this.validClass);
			else {
				if(el.value) el.classList.add(this.validClass);
				else el.classList.remove(this.validClass);
			}
		},

		formSubmit(bool) {
			//console.log(this.form);
			if(bool) this.form.submit();
		}
	};

	return {
		init(obj) {
			__private.set(obj);
		},

		required(fields) {
			__private.required(fields);
		},

		email(input) {
			__private.email(input);
		},

		number(input) {
			__private.number(input);
		},

		tel(input) {
			__private.tel(input);
		},

		noConditions(elem) {
			__private.noConditions(elem);
		},

		formSubmit(bool) {
			__private.formSubmit(bool);
		},

		fields() {
			return __private.fields;
		}
	};
})();


(function() {
	document.addEventListener("DOMContentLoaded", function() {

		var form = document.getElementById("form");

		Validator.init({
			form: form,
			errorClass: "error",
			successClass: "success",
			result: document.getElementById("result")
		});

	});
})();