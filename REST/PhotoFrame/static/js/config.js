function loadConfig() {
  $.ajax({
    type: 'GET',
    url: '/getConfig',
    dataType: 'json',
    success: (data) => {
      $('#input-duration').val(data.config.duration);
      $('#input-interval').val(data.config.interval);
      $('#input-update').val(data.config.update);
      $('#input-cycles').val(data.config.cycles);
      console.log('Loaded config.');
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
        duration: $('#input-duration').val(),
        interval: $('#input-interval').val(),
        update: $('#input-update').val(),
        cycles: $('#input-cycles').val()
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
