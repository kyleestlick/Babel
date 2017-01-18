// Saves options to chrome.storage
function save_options() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  chrome.storage.local.set({
    auth: {
      username: username,
      password: password
    }
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

function restore_options() {
  chrome.storage.local.get({
    auth: { username: null, pw: null}
  }, function(conf) {
    document.getElementById('username').value = conf.auth.username;
    document.getElementById('password').value = conf.auth.password;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
