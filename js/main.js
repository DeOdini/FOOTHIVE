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
    setNotifyStatus('The Google Forms response loaded, Do not use a personal email for this trial.', 'notice');
  });
}

const mobileMenu = document.querySelector('.site-header__mobile-menu');

if (mobileMenu) {
  const mobileMenuSummary = mobileMenu.querySelector('summary');
  const closeMobileMenu = (restoreFocus = false) => {
    if (!mobileMenu.open) return;
    if (restoreFocus) mobileMenuSummary?.focus({ preventScroll: true });
    mobileMenu.open = false;
  };

  mobileMenu.querySelectorAll('.primary-nav--mobile a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      window.setTimeout(() => mobileMenuSummary?.focus({ preventScroll: true }), 0);
    });
  });

  document.addEventListener('pointerdown', (event) => {
    if (mobileMenu.open && !mobileMenu.contains(event.target)) closeMobileMenu();
  });

  window.addEventListener('scroll', () => closeMobileMenu(), { passive: true });

  mobileMenu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobileMenu.open) return;
    event.preventDefault();
    closeMobileMenu(true);
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
  dialog.addEventListener('keydown', (event) => {
    if (
      event.key !== 'Tab' ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.defaultPrevented
    ) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll(
        'a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe, object, embed, [contenteditable]:not([contenteditable="false"]), [tabindex]'
      )
    ).filter((element) => {
      const style = window.getComputedStyle(element);

      return (
        element.tabIndex >= 0 &&
        !element.matches(':disabled') &&
        !element.closest('[hidden], [inert]') &&
        style.visibility !== 'hidden' &&
        style.visibility !== 'collapse' &&
        element.getClientRects().length > 0
      );
    });

    if (focusableElements.length === 0) {
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

// FH-V02-ANDROID-OPERATOR-TOUCH-FIX-01: remove only short-tap selections
// that the browser creates inside passive text blocks. Never cancel touch.
(() => {
  const longPressThreshold = 500;
  const textBlockSelector = [
    'main.site-main p',
    'main.site-main h1',
    'main.site-main h2',
    'main.site-main h3',
    'main.site-main h4',
    'main.site-main h5',
    'main.site-main h6',
    'main.site-main li',
    'main.site-main blockquote',
    'main.site-main figcaption',
    '.site-footer p',
    'dialog.info-dialog p',
    'dialog.info-dialog li',
    'dialog.info-dialog h2',
    'dialog.info-dialog h3'
  ].join(', ');
  const interactiveSelector = [
    'a[href]',
    'area[href]',
    'button',
    'input',
    'select',
    'textarea',
    'label',
    'summary',
    'iframe',
    'audio[controls]',
    'video[controls]',
    '[role="button"]',
    '[role="link"]',
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  const roots = Array.from(
    document.querySelectorAll('main.site-main, footer.site-footer, dialog.info-dialog')
  );

  if (!roots.length) return;

  let activeGesture = null;
  let multiTouchActive = false;
  let generation = 0;

  const cancelActiveGesture = () => {
    if (activeGesture?.pressTimer) {
      window.clearTimeout(activeGesture.pressTimer);
    }
    activeGesture = null;
    generation += 1;
  };

  const passiveTextBlockFrom = (eventTarget) => {
    if (!(eventTarget instanceof Element)) return null;

    const block = eventTarget.closest(textBlockSelector);
    if (!block || !roots.some((root) => root.contains(block))) return null;
    if (eventTarget.closest(interactiveSelector) || block.closest(interactiveSelector)) return null;
    if (block.closest('[aria-hidden="true"], [inert]')) return null;

    const style = window.getComputedStyle(block);
    if (style.userSelect === 'none' || style.webkitUserSelect === 'none') return null;

    return block;
  };

  const selectionIsContainedIn = (selection, block) => {
    if (!selection || selection.rangeCount !== 1 || selection.isCollapsed) return false;

    const range = selection.getRangeAt(0);
    if (!block.contains(range.startContainer) || !block.contains(range.endContainer)) return false;

    for (const control of block.querySelectorAll(interactiveSelector)) {
      if (range.intersectsNode(control)) return false;
    }

    return true;
  };

  document.addEventListener('touchstart', (event) => {
    cancelActiveGesture();

    if (event.touches.length !== 1 || multiTouchActive) {
      multiTouchActive = event.touches.length > 1 || multiTouchActive;
      return;
    }

    const block = passiveTextBlockFrom(event.target);
    const touch = event.changedTouches[0];
    const selection = window.getSelection();

    // Keep an existing selection, including a collapsed caret, untouched.
    if (!block || !touch || selection?.rangeCount) return;

    const gesture = {
      block,
      touchId: touch.identifier,
      startedAt: performance.now(),
      moved: false,
      longPress: false,
      token: ++generation,
      pressTimer: null
    };

    gesture.pressTimer = window.setTimeout(() => {
      if (activeGesture === gesture) gesture.longPress = true;
    }, longPressThreshold);

    activeGesture = gesture;
  }, { capture: true, passive: true });

  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 1) {
      multiTouchActive = true;
      cancelActiveGesture();
      return;
    }

    if (!activeGesture) return;
    const matchingTouch = Array.from(event.changedTouches).some(
      (touch) => touch.identifier === activeGesture.touchId
    );
    if (!matchingTouch) return;

    activeGesture.moved = true;
    window.clearTimeout(activeGesture.pressTimer);
  }, { capture: true, passive: true });

  document.addEventListener('touchend', (event) => {
    if (multiTouchActive) {
      if (event.touches.length === 0) multiTouchActive = false;
      return;
    }

    const gesture = activeGesture;
    if (!gesture) return;

    const endedTouch = Array.from(event.changedTouches).some(
      (touch) => touch.identifier === gesture.touchId
    );
    if (!endedTouch) return;

    window.clearTimeout(gesture.pressTimer);
    activeGesture = null;
    const duration = performance.now() - gesture.startedAt;
    if (gesture.moved || gesture.longPress || duration >= longPressThreshold) return;

    const cleanupToken = ++generation;
    window.setTimeout(() => {
      if (cleanupToken !== generation) return;

      const selection = window.getSelection();
      if (selectionIsContainedIn(selection, gesture.block)) {
        selection.removeAllRanges();
      }
    }, 100);
  }, { capture: true, passive: true });

  document.addEventListener('touchcancel', (event) => {
    if (activeGesture) {
      const cancelledTouch = Array.from(event.changedTouches).some(
        (touch) => touch.identifier === activeGesture.touchId
      );
      if (cancelledTouch) cancelActiveGesture();
    }

    if (event.touches.length > 0) multiTouchActive = true;
    else multiTouchActive = false;
  }, { capture: true, passive: true });

  document.addEventListener('keydown', cancelActiveGesture, true);
  document.addEventListener('focusin', cancelActiveGesture, true);
  document.addEventListener('copy', cancelActiveGesture, true);
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') cancelActiveGesture();
  }, true);
  document.addEventListener('click', (event) => {
    if (event.detail === 0) cancelActiveGesture();
  }, true);
})();
