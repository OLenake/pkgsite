/*!
 * @license
 * Copyright 2021 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
const PlayExampleClassName = {
  PLAY_HREF: '.js-exampleHref',
  PLAY_CONTAINER: '.js-exampleContainer',
  EXAMPLE_INPUT: '.Documentation-exampleCode',
  EXAMPLE_OUTPUT: '.Documentation-exampleOutput',
  EXAMPLE_ERROR: '.Documentation-exampleError',
  PLAY_BUTTON: '.Documentation-examplePlayButton',
};
export class PlaygroundExampleController {
  constructor(exampleEl) {
    this.exampleEl = exampleEl;
    let hasError = false;
    if (!exampleEl) {
      console.warn('Must provide playground example element');
      hasError = true;
    }
    this.exampleEl = exampleEl;
    const anchorEl = exampleEl.querySelector('a');
    if (!anchorEl) {
      console.warn('anchor tag is not detected');
      hasError = true;
    }
    this.anchorEl = anchorEl;
    const errorEl = exampleEl.querySelector(PlayExampleClassName.EXAMPLE_ERROR);
    if (!errorEl) {
      hasError = true;
    }
    this.errorEl = errorEl;
    const playButtonEl = exampleEl.querySelector(PlayExampleClassName.PLAY_BUTTON);
    if (!playButtonEl) {
      hasError = true;
    }
    this.playButtonEl = playButtonEl;
    const inputEl = exampleEl.querySelector(PlayExampleClassName.EXAMPLE_INPUT);
    if (!inputEl) {
      console.warn('Input element is not detected');
      hasError = true;
    }
    this.inputEl = inputEl;
    this.outputEl = exampleEl.querySelector(PlayExampleClassName.EXAMPLE_OUTPUT);
    if (hasError) {
      return;
    }
    this.playButtonEl?.addEventListener('click', () => this.handlePlayButtonClick());
  }
  getAnchorHash() {
    return this.anchorEl?.hash;
  }
  expand() {
    this.exampleEl.open = true;
  }
  setOutputText(output) {
    if (this.outputEl) {
      this.outputEl.textContent = output;
    }
  }
  setErrorText(err) {
    if (this.errorEl) {
      this.errorEl.textContent = err;
    }
    this.setOutputText('An error has occurred…');
  }
  handlePlayButtonClick() {
    const PLAYGROUND_BASE_URL = '//play.golang.org/p/';
    this.setOutputText('Waiting for remote server…');
    fetch('/play/', {
      method: 'POST',
      body: this.inputEl?.textContent,
    })
      .then(res => res.text())
      .then(shareId => {
        window.open(PLAYGROUND_BASE_URL + shareId);
      })
      .catch(err => {
        this.setErrorText(err);
      });
  }
}
const exampleHashRegex = location.hash.match(/^#(example-.*)$/);
if (exampleHashRegex) {
  const exampleHashEl = document.getElementById(exampleHashRegex[1]);
  if (exampleHashEl) {
    exampleHashEl.open = true;
  }
}
const exampleHrefs = [...document.querySelectorAll(PlayExampleClassName.PLAY_HREF)];
const findExampleHash = playContainer =>
  exampleHrefs.find(ex => {
    return ex.hash === playContainer.getAnchorHash();
  });
for (const el of document.querySelectorAll(PlayExampleClassName.PLAY_CONTAINER)) {
  const playContainer = new PlaygroundExampleController(el);
  const exampleHref = findExampleHash(playContainer);
  if (exampleHref) {
    exampleHref.addEventListener('click', () => {
      playContainer.expand();
    });
  } else {
    console.warn('example href not found');
  }
}
//# sourceMappingURL=playground.js.map
