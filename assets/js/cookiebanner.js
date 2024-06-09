document.addEventListener('DOMContentLoaded', function () {
  var cookieNotification = document.getElementById('cookie-notification');
  var acceptButton = document.getElementById('accept-cookies');

  // Check if the cookie has been set
  if (!getCookie('cookies_accepted')) {
      // Show the cookie notification with fade-in animation
      cookieNotification.classList.add('show');
  }

  // When the accept button is clicked
  acceptButton.addEventListener('click', function () {
      // Set a cookie to remember the user's choice
      setCookie('cookies_accepted', 'true', 365);
      // Hide the cookie notification
      cookieNotification.classList.remove('show');
  });

  function setCookie(name, value, days) {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
  }
});
