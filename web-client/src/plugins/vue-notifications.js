import Vue from 'vue'
import VueNotifications from 'vue-notifications' // https://se-panfilov.github.io/vue-notifications/
import miniToastr from 'mini-toastr'// https://github.com/se-panfilov/mini-toastr

miniToastr.init();

function toast ({title, message, type, timeout, cb}) {
  if (type === 'error' && !timeout) timeout = 5000;
  return miniToastr[type](message, title, timeout, cb)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
};

Vue.use(VueNotifications, options);
