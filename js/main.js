const notifyForm = document.querySelector('.notify-form');

if (notifyForm) {
	const notifyEmail = notifyForm.querySelector('input[type="email"]');
	const notifyButton = notifyForm.querySelector('button[type="submit"]');
	const notifyStatus = notifyForm.querySelector('[data-notify-status]');
	const notifyTarget = notifyForm.querySelector('.notify-form__target');
	let submissionStarted = false;

	const setNotifyStatus = (message, state) => {
		notifyStatus.textContent = message;
		notifyStatus.dataset.state = state;
	};

	notifyForm.addEventListener('submit', (event) => {
		if (!notifyForm.checkValidity()) {
			event.preventDefault();
			setNotifyStatus('Enter a valid email address to continue.', 'error');
			notifyEmail.focus();
			return;
		}

		submissionStarted = true;
		notifyButton.disabled = true;
		setNotifyStatus('Sending your request...', 'pending');
	});

	notifyTarget.addEventListener('load', () => {
		if (!submissionStarted) {
			return;
		}

		submissionStarted = false;
		notifyForm.reset();
		notifyButton.disabled = false;
		setNotifyStatus("You're on the list.", 'success');
	});
}

// T13 - lightweight trial information dialogs
const infoDialogTriggers = document.querySelectorAll('[data-dialog-open]');

infoDialogTriggers.forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.dialogOpen);

  if (!dialog || typeof dialog.showModal !== 'function') {
    return;
  }

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
  });
});

document.querySelectorAll('[data-dialog-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});

document.querySelectorAll('dialog.info-dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});