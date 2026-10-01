const notifyForm = document.querySelector('.notify-form');

if (notifyForm) {
  const notifyEmail = notifyForm.querySelector('input[type="email"]');
  const notifyButton = notifyForm.querySelector('button[type="submit"]');
  const notifyStatus = notifyForm.querySelector('[data-notify-status]');
  const notifyTarget = notifyForm.querySelector('.notify-form__target');
  const responseTimeoutMs = 15000;
  let submissionStarted = false;
  let responseTimeout;

  const setNotifyStatus = (message, state) => {
    notifyStatus.textContent = message;
    notifyStatus.dataset.state = state;
  };

  const finishSubmission = () => {
    submissionStarted = false;
    window.clearTimeout(responseTimeout);
    notifyButton.disabled = false;
  };

  notifyForm.addEventListener('submit', (event) => {
    if (!notifyForm.checkValidity()) {
      event.preventDefault();
      setNotifyStatus('Enter a valid email address to continue.', 'error');
      notifyEmail.focus();
      return;
    }

    if (submissionStarted) {
      event.preventDefault();
      return;
    }

    submissionStarted = true;
    notifyButton.disabled = true;
    setNotifyStatus('Sending your request to the trial form...', 'pending');

    responseTimeout = window.setTimeout(() => {
      if (!submissionStarted) {
        return;
      }

      finishSubmission();
      setNotifyStatus('No response was observed. This page cannot tell whether Google Forms recorded the request. Check before retrying to avoid duplicates.', 'error');
    }, responseTimeoutMs);
  });

  notifyTarget.addEventListener('load', () => {
    if (!submissionStarted) {
      return;
    }

    finishSubmission();
    setNotifyStatus('The Google Forms response loaded, but this page cannot verify that the request was recorded. Do not use a personal email for this trial.', 'notice');
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