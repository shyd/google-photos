
function instantInterval(handler, timeout) {
  handler();
  setInterval(handler, timeout);
}

function loadSlideshow(source, mediaItems) {
  $('#slideshow-container').empty();

  // Display the length and the source of the items if set.
  if (source && mediaItems) {
    $('#images-count').text(mediaItems.length);
    $('#images-source').text(JSON.stringify(source));
    $('#preview-description').show();
  } else {
    $('#images-count').text(0);
    $('#images-source').text('No photo search selected');
    $('#preview-description').hide();
  }

  // Show an error message and disable the slideshow button if no items are
  // loaded.
  if (!mediaItems || !mediaItems.length) {
    $('#images_empty').show();
  } else {
    $('#images_empty').hide();
  }

  let pos = 0;
  instantInterval(function () {
    const image = mediaItems[pos++%mediaItems.length];
    //const fullUrl = `${image.baseUrl}=w${image.mediaMetadata.width}-h${image.mediaMetadata.height}`;
    const fullUrl = `${image.baseUrl}=w1920`;
    console.log('trigger preload');
    const img = new Image();
    img.src = fullUrl;
    img.onload = function () {
      $('#slideshow-container').css('backgroundImage', 'url('+fullUrl+')');
      console.log('Set current image');
    };
  }, 10000);
}

// Makes a backend request to display the queue of photos currently loaded into
// the photo frame. The backend returns a list of media items that the user has
// selected. They are rendered in showPreview(..).
function loadQueue() {
  showLoadingDialog();
  $.ajax({
    type: 'GET',
    url: '/getQueue',
    dataType: 'json',
    success: (data) => {
      // Queue has been loaded. Display the media items as a grid on screen.
      hideLoadingDialog();
      //showPreview(data.parameters, data.photos);
      loadSlideshow(data.parameters, data.photos);
      hideLoadingDialog();
      console.log('Loaded queue.');
    },
    error: (data) => {
      hideLoadingDialog();
      handleError('Could not load queue', data)
    }
  });
}

$(document).ready(() => {
  // Load the queue of photos selected by the user for the photo
  loadQueue();

  // Clicking the 'view fullscreen' button opens the gallery from the first
  // image.
  $('#startSlideshow').on('click', (e) => $('#slideshow-container').removeClass('d-none'));
  $('#slideshow-container').on('click', (e) => $('#slideshow-container').addClass('d-none'));

  // Clicking log out opens the log out screen.
  $('#logout').on('click', (e) => {
    window.location = '/logout';
  });
});