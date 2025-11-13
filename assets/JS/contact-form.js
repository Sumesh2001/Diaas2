// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const loading = document.getElementById('loading');
            const errorMessage = document.getElementById('error-message');
            const sentMessage = document.getElementById('sent-message');
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Hide all messages
            loading.classList.remove('hidden');
            errorMessage.classList.add('hidden');
            sentMessage.classList.add('hidden');
            submitButton.disabled = true;
            
            // Send form data
            fetch('assets/Mailer/sendMail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                loading.classList.add('hidden');
                
                if (data.success) {
                    sentMessage.classList.remove('hidden');
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        sentMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    errorMessage.textContent = data.message;
                    errorMessage.classList.remove('hidden');
                }
            })
            .catch(error => {
                loading.classList.add('hidden');
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.classList.remove('hidden');
                console.error('Error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
            });
        });
    }
});
