// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForms = document.querySelectorAll('form#contactForm');
    console.log('Found ' + contactForms.length + ' contact forms');
    
    contactForms.forEach(contactForm => {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get form data
            const formData = new FormData(this);
            // Attach or create browser identifier cookie
            function getCookie(name) {
                const v = document.cookie.match('(?:^|;)\\s*' + name + "=([^;]*)");
                return v ? decodeURIComponent(v[1]) : null;
            }
            function setCookie(name, value, days) {
                const d = new Date();
                d.setTime(d.getTime() + (days*24*60*60*1000));
                document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;expires=' + d.toUTCString();
            }
            function generateId() {
                if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
                return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2,10);
            }
            let browserId = getCookie('diaas_cf_id');
            if (!browserId) {
                browserId = generateId();
                setCookie('diaas_cf_id', browserId, 365);
            }
            formData.append('browser_id', browserId);
            const loading = this.querySelector('#loading') || document.getElementById('loading');
            const errorMessage = this.querySelector('#error-message') || document.getElementById('error-message');
            const sentMessage = this.querySelector('#sent-message') || document.getElementById('sent-message');
            const submitButton = this.querySelector('button[type="submit"]');
            
            console.log('Loading:', loading, 'Error:', errorMessage, 'Success:', sentMessage);
            
            // Hide all messages
            if (loading) loading.classList.remove('hidden');
            if (errorMessage) errorMessage.classList.add('hidden');
            if (sentMessage) sentMessage.classList.add('hidden');
            
            // Disable button
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Sending...</span>';
            
            // Send form data (attach reCAPTCHA token if available)
            const siteKey = '6LelPkUsAAAAACM5mZHFLjltHeZXj_DIJktCWRtf';
            function doFetch() {
                fetch('assets/Mailer/sendMail.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Response:', data);
                    if (loading) loading.classList.add('hidden');
                    
                    if (data.success) {
                        if (sentMessage) sentMessage.classList.remove('hidden');
                        contactForm.reset();
                        
                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            if (sentMessage) sentMessage.classList.add('hidden');
                        }, 5000);
                    } else {
                        if (errorMessage) {
                            errorMessage.textContent = data.message || 'Failed to send message';
                            errorMessage.classList.remove('hidden');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (loading) loading.classList.add('hidden');
                    if (errorMessage) {
                        errorMessage.textContent = 'An error occurred. Please try again.';
                        errorMessage.classList.remove('hidden');
                    }
                })
                .finally(() => {
                    // Restore button
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Send Message</span><svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
                });
            }

            // If grecaptcha available (v3), execute and attach token
            if (window.grecaptcha && grecaptcha.execute) {
                grecaptcha.ready(function() {
                    grecaptcha.execute(siteKey, {action: 'contact'}).then(function(token) {
                        formData.append('g-recaptcha-response', token);
                        doFetch();
                    }).catch(function(err) {
                        console.warn('reCAPTCHA error, continuing without token', err);
                        doFetch();
                    });
                });
            } else {
                // No grecaptcha loaded, proceed (server may reject)
                doFetch();
            }
        });
    });
});
