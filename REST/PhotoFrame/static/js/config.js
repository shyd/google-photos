function loadConfig() {
  $.ajax({
    type: 'GET',
    url: '/getConfig',
    dataType: 'json',
    success: (data) => {
      $('#input-interval').val(data.config.interval);
      $('#input-update').val(data.config.update);
      $('#input-cycles').val(data.config.cycles);
      $('#checkbox-mqtt').prop('checked', data.config.mqtt.enabled == "true").change();
      $('#input-mqtt-host').val(data.config.mqtt.host);
      $('#input-mqtt-port').val(data.config.mqtt.port);
      $('#input-mqtt-topic').val(data.config.mqtt.topic);
      $('#input-mqtt-username').val(data.config.mqtt.username);
      $('#input-mqtt-password').val(data.config.mqtt.password);
      console.log('Loaded config:', data.config);
    },
    error: (data) => {
      hideLoadingDialog();
      handleError('Could not load queue', data)
    }
  })
};

function saveConfig() {
  showLoadingDialog();
  $.ajax({
    type: 'POST',
    url: '/saveConfig',
    dataType: 'json',
    data: {
      config: {
        interval: $('#input-interval').val(),
        update: $('#input-update').val(),
        cycles: $('#input-cycles').val(),
        mqtt: {
          enabled: $('#checkbox-mqtt').prop('checked'),
          host: $('#input-mqtt-host').val(),
          port: $('#input-mqtt-port').val(),
          topic: $('#input-mqtt-topic').val(),
          username: $('#input-mqtt-username').val(),
          password: $('#input-mqtt-password').val()
        }
      }
    },
    success: (data) => {
      console.log('Config saved.');
      window.location = '/config';
      hideLoadingDialog();
    },
    error: (data) => {
      handleError('Couldn\'t save config', data);
    }
  });
}

$(document).ready(() => {
  // Load the queue of photos selected by the user for the photo
  loadConfig();


  $('#button-save').on('click', (e) => {
    e.preventDefault();
    console.log('clicked');
    saveConfig();
  });

  // Clicking log out opens the log out screen.
  $('#logout').on('click', (e) => {
    window.location = '/logout';
  });
});
