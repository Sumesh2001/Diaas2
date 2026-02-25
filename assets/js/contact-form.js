// Contact Form Handling (reCAPTCHA v2 + Clean UX + Proper Button + Opacity Fix)

document.addEventListener("DOMContentLoaded", function () {

  const contactForms = document.querySelectorAll("form#contactForm");

  contactForms.forEach((form) => {

    const submitButton = form.querySelector('button[type="submit"]');
    const loading = form.querySelector("#loading");
    const errorMessage = form.querySelector("#error-message");
    const sentMessage = form.querySelector("#sent-message");

    // Initial state
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // ✅ Enable when captcha solved
    window.recaptchaSolved = function () {
        console.log("reCAPTCHA solved, enabling submit button.");
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-50", "cursor-not-allowed");
      
    };

    // ✅ Disable when captcha expires
    window.recaptchaExpired = function () {
      submitButton.disabled = true;
      submitButton.classList.add("opacity-50", "cursor-not-allowed");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      if (errorMessage) errorMessage.classList.add("hidden");
      if (sentMessage) sentMessage.classList.add("hidden");

      const recaptchaResponse = formData.get("g-recaptcha-response");

      if (!recaptchaResponse) {
        if (errorMessage) {
          errorMessage.textContent = "Please complete the reCAPTCHA verification.";
          errorMessage.classList.remove("hidden");
        }
        return;
      }

      if (loading) loading.classList.remove("hidden");

      submitButton.disabled = true;
      submitButton.classList.add("opacity-50", "cursor-not-allowed");
      submitButton.innerHTML = "Sending...";

      fetch("assets/Mailer/sendMail.php", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {

        if (loading) loading.classList.add("hidden");

        if (data.success) {

          if (sentMessage) {
            sentMessage.textContent = data.message || "Message sent successfully!";
            sentMessage.classList.remove("hidden");
          }

          form.reset();

          if (window.grecaptcha) {
            grecaptcha.reset();
          }

          // Keep disabled until captcha solved again
          submitButton.disabled = true;
          submitButton.classList.add("opacity-50", "cursor-not-allowed");

          setTimeout(() => {
            if (sentMessage) sentMessage.classList.add("hidden");
          }, 5000);

        } else {

          if (errorMessage) {
            errorMessage.textContent = data.message || "Something went wrong.";
            errorMessage.classList.remove("hidden");
          }

          if (window.grecaptcha) {
            grecaptcha.reset();
          }

          submitButton.disabled = true;
          submitButton.classList.add("opacity-50", "cursor-not-allowed");
        }

      })
      .catch(error => {

        console.error("Error:", error);

        if (loading) loading.classList.add("hidden");

        if (errorMessage) {
          errorMessage.textContent = "Server error. Please try again later.";
          errorMessage.classList.remove("hidden");
        }

        if (window.grecaptcha) {
          grecaptcha.reset();
        }

        submitButton.disabled = true;
        submitButton.classList.add("opacity-50", "cursor-not-allowed");
      })
      .finally(() => {
        submitButton.innerHTML = "Send Message";
      });

    });

  });

});