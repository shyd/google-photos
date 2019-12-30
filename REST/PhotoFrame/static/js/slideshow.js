
function instantInterval(handler, timeout) {
  handler();
  setInterval(handler, timeout);
}

function onLoadImage = (url, callback) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      !!callback && callback(); //may not be async!
      resolve();
    };
    img.src = url;
  } 
}

function loadSlideshow(interval) {
  let pos = 0;
  instantInterval(function () {
    $.ajax({
      type: 'GET',
      url: '/getNextMedia',
      dataType: 'json',
      success: (data) => {
        console.log('trigger preload');
        const url = '/getNextMedia/' + data.filename;
        const url_blurred = '/getNextMedia/' + data.filenameBlurred;
        const promises = [];
        promises.push(onLoadImage(url_blurred));
        promises.push(onLoadImage(url, () => {
          let desc = {};
            if (data.meta.description) {
              // get json from description
              try {
                desc = $.parseJSON(data.meta.description.substr(0, data.meta.description.lastIndexOf("}") + 1));
              } catch (e) {
              }
            }
            desc.photoFrame = desc.photoFrame || {};
            const alignVert = desc.photoFrame.vertical || "center";
            const alignHor = desc.photoFrame.horizontal || "center";
            const size = desc.photoFrame.size || "cover";
            console.log('Image alignment x, y:', alignHor, alignVert);
            //TODO: slideshow-image/backdrop1 vs slideshow-image/backdrop2
            $('#slideshow-image').css('backgroundImage', 'url(' + url + ')').css('background-position-x', alignHor).css('background-position-y', alignVert).css('background-size', size);
            $('#slideshow-backdrop').css('backgroundImage', 'url(' + url_blurred + ')').css('background-position-x', alignHor).css('background-position-y', alignVert);
            console.log('Set current image');
        };
        Promise.all(promises).then(() => {
          //both images loaded...
          //TODO: divs 1b-n vs divs 2b-n handling
        });
      },
      error: (data) => {
        console.error('Could not load next media', data)
      }
    });
  }, interval*1000);
}

// Makes a backend request to display the queue of photos currently loaded into
// the photo frame. The backend returns a list of media items that the user has
// selected. They are rendered in showPreview(..).
function initSlideshow() {
  showLoadingDialog();
  $.ajax({
    type: 'GET',
    url: '/getConfig',
    dataType: 'json',
    success: (data) => {
      // Queue has been loaded. Display the media items as a grid on screen.
      hideLoadingDialog();
      $('#slideshow-image').css('-webkit-transition', 'background-image '+data.config.duration+'ms ease-in-out');
      $('#slideshow-image').css('transition', 'background-image '+data.config.duration+'ms ease-in-out');
      $('#slideshow-backdrop').css('-webkit-transition', 'background-image '+data.config.duration+'ms ease-in-out');
      $('#slideshow-backdrop').css('transition', 'background-image '+data.config.duration+'ms ease-in-out');
      loadSlideshow(data.config.interval);
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
  initSlideshow();

  // Clicking the 'view fullscreen' button opens the gallery from the first
  // image.
  $('#startSlideshow').on('click', (e) => $('#slideshow-container').removeClass('d-none'));
  $('#slideshow-container').on('click', (e) => $('#slideshow-container').addClass('d-none'));

  // Clicking log out opens the log out screen.
  $('#logout').on('click', (e) => {
    window.location = '/logout';
  });
});
