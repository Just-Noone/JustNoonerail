document.addEventListener("DOMContentLoaded", () => {
    const routeForm = document.getElementById('routeForm');
    const fromInput = document.getElementById('ticketsfrom');
    const toInput = document.getElementById('ticketsto');
    const snackbarContainer = document.getElementById('snackbar-container');

    routeForm.addEventListener('submit', handleSubmit);

    function handleSubmit(e) {
        e.preventDefault();
        const fromValue = fromInput.value.trim();
        const toValue = toInput.value.trim();

        if (!fromValue || !toValue) {
            showSnackbar('Both fields are required.', 'var(--orange)');
            return;
        }

        if (fromValue === toValue) {
            showSnackbar('The departure and destination stations cannot be the same.', 'var(--orange)');
            return;
        }

        // Simulate a server request
        fetch('/server-endpoint', {
            method: 'POST',
            body: JSON.stringify({ from: fromValue, to: toValue }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Form submitted successfully:', data);
        })
        .catch(error => {
            showSnackbar('Cannot reach server', '#fe5858');
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function showSnackbar(message, color) {
        if (snackbarContainer.children.length >= 6) {
            snackbarContainer.removeChild(snackbarContainer.lastChild);
        }

        const snackbar = document.createElement('div');
        snackbar.className = 'snackbar show';
        snackbar.textContent = message;
        snackbar.style.backgroundColor = color;
        snackbarContainer.appendChild(snackbar);

        snackbar.onclick = () => {
            hideSnackbar(snackbar);
        }

        setTimeout(() => {
            hideSnackbar(snackbar);
        }, 5000);
    }

    function hideSnackbar(snackbar) {
        snackbar.className = 'snackbar hide';
        setTimeout(() => {
            if (snackbar.parentNode) {
                snackbar.parentNode.removeChild(snackbar);
            }
        }, 500);
    }
});