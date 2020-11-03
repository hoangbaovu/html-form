document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('NAME_PARAM').value = getParameterByName('name');
  document.getElementById('SOURCE_PARAM').value = getParameterByName('nguon');

  Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
      Validator.isRequired('#name', 'Vui lòng nhập tên đầy đủ của bạn.'),
      Validator.isEmail('#email'),
      Validator.isRequired('#phone', 'Vui lòng nhập số điện thoại.'),
      Validator.minLength('#phone', 10),
      Validator.isRequired('#LYDO_DK', 'Vui lòng chọn hình thức học.'),
    ],
    onSubmit: async function (data) {
      // Call API
      await postForm(data)
        .then(res => {
          // link cần huyển tới
          const link_redirect =
          'http://hocexcelnangcao.net/cam-on-dang-ky-tai-phan-mem-add-in-a-tools-a-newsdetails-36799-186-186.html';
          window.location.href = link_redirect;
        })
        .catch(err => {
          console.log('error', err)
        });
    }
  });
});

const postForm = data => {
  const body = JSON.stringify(data);
  return fetch('http://api.baoninh.xyz:8080/datasnap/rest/TServerMethodsAPI/Ladipage', {
    // return fetch('http:localhost:8080/datasnap/rest/TServerMethodsAPI/Ladipage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      user: "ninh",
      token: "baoanh21"
    },
    body,
  });
};

const getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

(function(){
  // Get IP Address
  axios.get('http://api.ipstack.com/check?access_key=07b7e3711433acddc0d5a4cfbda88e59&fbclid=IwAR0ZfsKbGnpF7UKq2NvkIFgHKelDNBvi8TSYCs5ibjDGa2iop5Pzggc-s-M')
    .then(res => {
      // handle success
      const { ip, region_name } = res.data;
      document.getElementById('IP').value = ip;
      document.getElementById('LOCATION').value = region_name;
      //document.getElementById("DEVICE").innerHTML = 'LAPTOP';
      document.getElementById('DEVICE').value = navigator.appVersion;
    })
    .catch(function (error) {
      console.log(error);
    })
})();

// Đối tượng `Validator`
function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    var errorMessage;

    // Lấy ra các rules của selector
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule & kiểm tra
    // Nếu có lỗi thì dừng việc kiểm
    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add('invalid');
    } else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
    }

    return !errorMessage;
  }

  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // Lặp qua từng rules và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Trường hợp submit với javascript
        if (typeof options.onSubmit === 'function') {
          var enableInputs = formElement.querySelectorAll('[name]');
          var formValues = Array.from(enableInputs).reduce(function (values, input) {

            switch (input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                break;
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = '';
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case 'file':
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          }, {});
          options.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    }

    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach(function (rule) {

      // Lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        }

        // Xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput = function () {
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
      });
    });
  }

}

// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || 'Vui lòng nhập trường này.'
    }
  };
}

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || 'Trường này phải là email.';
    }
  };
}

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự.`;
    }
  };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác.';
    }
  }
}

var digits = function(box) {
  box.value = box.value.replace(/[^0-9]/g, '');
};