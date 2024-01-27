function Validator(options) {
  var selectorRules = {};
  function validate(inputElement, rule, check) {
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );

    var errorMessage;
    var rules = selectorRules[rule.selector];

    for(var i = 0; i < rule.length; ++i) {
      errorMessage = rule[i](inputElement.value);
      if(errorMessage) break;
    }
    if (check === true) {
      if (errorMessage) {
        errorElement.innerText = errorMessage;
        inputElement.parentElement.classList.add("invalid");
      } else {
        errorElement.innerText = "";
        inputElement.parentElement.classList.remove("invalid");
      }
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  }

  var formElement = document.querySelector(options.form);

  if (formElement) {
    options.rules.forEach(function (rule) {

      if(Array.isArray(selectorRules[rule.selector])) {
          selectorRules[rule.selector].push(rule.test);
      }
      else {
          selectorRules[rule.selector] = [rule.test];
      }
      // Lưu lại các rules cho mỗi input
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        // Xử lý trường hợp blur khởi input
        inputElement.onblur = function () {
          validate(inputElement, rule, true);
        };

        // Xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput = function () {
          validate(inputElement, rule, false);
        };
      }
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || "Vui lòng nhập email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
