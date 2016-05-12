// Saves options to chrome.storage
function save_options() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  chrome.storage.sync.set({
    auth: {
      username: username,
      pw: password
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

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    auth: { username: null, pw: null}
  }, function(conf) {
    document.getElementById('username').value = conf.auth.username;
    document.getElementById('password').value = conf.auth.pw;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
