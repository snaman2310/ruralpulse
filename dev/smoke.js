/* Integration smoke test — drives the real UI in a headless browser. */
(function () {
  const results = [];
  let failed = 0;

  function ok(name, cond, detail) {
    results.push((cond ? 'PASS  ' : 'FAIL  ') + name + (detail ? '  [' + detail + ']' : ''));
    if (!cond) failed++;
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const active = () => ($('.screen.is-active') || {}).id;
  const txt = s => ($(s) ? $(s).textContent.trim() : '');

  async function waitFor(fn, ms) {
    const t0 = Date.now();
    let i = 0;
    while (i++ < 400) {
      try { if (fn()) return true; } catch (e) { }
      await sleep(25);
      if (Date.now() - t0 > (ms || 8000)) break;
    }
    return false;
  }

  function click(el) {
    if (!el) throw new Error('click() called with a missing element');
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }
  function setVal(el, v) {
    if (!el) throw new Error('setVal() called with a missing element');
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function makePhotoFile(seed) {
    const c = document.createElement('canvas');
    c.width = 900; c.height = 700;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 700);
    g.addColorStop(0, '#9fc9e8'); g.addColorStop(1, '#e7d9b8');
    x.fillStyle = g; x.fillRect(0, 0, 900, 700);
    x.fillStyle = '#5a6b52'; x.fillRect(0, 470, 900, 230);
    x.fillStyle = '#c8b49a'; x.fillRect(250, 250 + (seed % 3) * 7, 400, 250);
    x.fillStyle = '#ffffff';
    for (let i = 0; i < 60; i++) x.fillRect(270 + (i % 8) * 45, 280 + Math.floor(i / 8) * 40, 26, 22);
    return new Promise(res => c.toBlob(b => res(new File([b], 'photo' + seed + '.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.9));
  }
  async function attachPhoto(inputId, seed) {
    const file = await makePhotoFile(seed);
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = $(inputId);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(() => !$('#capNext').disabled, 8000);
    return file;
  }

  window.addEventListener('error', e => {
    const pre = document.createElement('pre');
    pre.id = 'results';
    pre.textContent = results.join('\n') + '\n\nERROR: ' + (e.error && e.error.stack ? e.error.stack : e.message);
    document.body.appendChild(pre);
  });

  window.addEventListener('load', async function () {
   try {
    await sleep(500);

    /* 1. boot + modern home */
    ok('boots into home', active() === 'scr-home', active());
    ok('hero shows live credited amount', txt('#homeCredited') === '₹180', txt('#homeCredited'));
    ok('mapping health gauge is computed', Number(txt('#gaugeValue')) > 0, txt('#gaugeValue'));
    ok('gauge metrics rendered', $$('#gaugeMetrics .metrics__row').length === 4);
    ok('quick actions rendered', $$('#homeQuick .qact').length === 5);
    ok('ticker has live items', $$('#tickerTrack .ticker__item').length > 4);
    ok('attention card rendered', /waiting/i.test(txt('#homeAlert')), txt('#homeAlert').replace(/\s+/g, ' ').slice(0, 60));
    ok('photos are generated raster images', /^data:image\/jpeg/.test($$('#homeRecent img')[0].getAttribute('src') || ''),
      ($$('#homeRecent img')[0].getAttribute('src') || '').slice(0, 22));

    /* 2. offline queue */
    const off = $('#offlineSwitch');
    off.checked = true;
    off.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(150);
    ok('offline chip turns on', /Offline/.test(txt('#netChip')), txt('#netChip'));

    /* 3. submit a photo while offline */
    click($('#fabBtn'));
    await sleep(200);
    ok('capture screen opens', active() === 'scr-capture', active());
    await attachPhoto('#galleryInput', 1);
    ok('photo processed with real metrics', !$('#capMetaCard').hidden);
    ok('measured size is real', /MB .*KB/.test(txt('#capSizeBadge')), txt('#capSizeBadge'));
    ok('quality checks computed', txt('#capAuditList').length > 40, txt('#capAuditBadge'));
    ok('GPS honestly reported as missing', /not found|No GPS/.test(txt('#capMetaList')), txt('#capMetaList').replace(/\s+/g, ' ').slice(0, 110));

    click($('#capNext')); await sleep(200);
    ok('location step opens', active() === 'scr-location', active());
    ok('missing GPS is stated', /No coordinates/.test(txt('#locTelemetry')), txt('#locSourceBadge'));
    click($('#locNext')); await sleep(200);
    ok('category step opens', active() === 'scr-categories', active());
    ok('category tiles rendered', $$('#catTiles .tile').length === 12, String($$('#catTiles .tile').length));
    click($('#catTiles .tile')); await sleep(120);
    ok('category selection enables continue', !$('#catNext').disabled);
    click($('#catNext')); await sleep(200);
    ok('describe step opens', active() === 'scr-describe', active());
    setVal($('#assetName'), 'Community borewell');
    setVal($('#descInput'), 'Borewell near the panchayat office with a working handpump for ward four residents.');
    await sleep(120);
    ok('description length validated', /characters/.test(txt('#descCount')), txt('#descCount'));
    click($('#descNext')); await sleep(200);
    ok('review step opens', active() === 'scr-review', active());
    ok('offline is reflected on review', /Offline/.test(txt('#revNetBadge')), txt('#revNetBadge'));
    click($('#submitBtn')); await sleep(400);
    ok('submission queued offline', active() === 'scr-done', active());
    ok('done screen says saved on phone', /Saved on this phone/i.test(txt('#doneTitle')), txt('#doneTitle'));
    const newId = txt('#doneId');

    /* 4. reviewer must NOT see a queued photo */
    click($('#avatarBtn')); await sleep(150);
    click($('#openReviewerBtn')); await sleep(200);
    setVal($('#staffCodeInput'), '2468');
    click($('#mdlPinFoot .btn:last-child')); await sleep(250);
    ok('review desk opens', active() === 'scr-reviewer', active());
    ok('queued photo is hidden from reviewer', !$('#rvList').textContent.includes(newId.replace('#', '')), 'id ' + newId);

    /* 5. back online -> auto sync */
    off.checked = false;
    off.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(400);
    ok('chip back online', /Online|queued/.test(txt('#netChip')), txt('#netChip'));
    click($('#fabBtn')); await sleep(150);
    click($('[data-goto="scr-history"]')); await sleep(200);
    ok('history shows waiting filter count', /Waiting to send \(/.test(txt('#histFilters')), txt('#histFilters').replace(/\s+/g, ' '));
    ok('history record count is derived', txt('#histTotal') === '25 records', txt('#histTotal'));
    click($('#setSyncBtn')); await sleep(300);

    /* 6. reviewer approves it */
    click($('#avatarBtn')); await sleep(150);
    click($('#openReviewerBtn')); await sleep(200);
    setVal($('#staffCodeInput'), '2468');
    click($('#mdlPinFoot .btn:last-child')); await sleep(300);
    const rowBtn = $$('#rvList [data-inspect]').find(b => b.textContent.includes(newId.replace('#', '')));
    ok('synced photo now in reviewer queue', !!rowBtn, 'queue size ' + $$('#rvList [data-inspect]').length);
    if (rowBtn) {
      click(rowBtn); await sleep(300);
      ok('inspect modal opens', $('#mdl-inspect').classList.contains('is-open'));
      ok('inspect shows real per-item checks', $('#mdlInspectBody').textContent.includes('GPS') || $('#mdlInspectBody').textContent.includes('coordinates'));
      const btns = $$('#mdlInspectFoot .btn');
      click(btns[btns.length - 1]); await sleep(250);
      ok('approve asks for confirmation note', $('#mdl-note').classList.contains('is-open'));
      click($('#mdlNoteFoot .btn:last-child')); await sleep(300);
      ok('decision logged', $('#rvLog').textContent.length > 20, txt('#rvLog').replace(/\s+/g, ' ').slice(0, 70));
    }

    /* 7. earnings reflect the approval */
    click($('#rvExitBtn')); await sleep(150);
    click($('[data-goto="scr-earnings"]')); await sleep(250);
    ok('credited amount increased to 190', txt('#earnCredited') === '₹190', txt('#earnCredited'));
    ok('in-review amount updated', txt('#earnPending').length > 0, txt('#earnPending'));
    ok('ledger uses a segmented control', $$('#ledgerTabs .seg__btn').length === 4);

    /* 8. duplicate detection */
    click($('#fabBtn')); await sleep(200);
    await attachPhoto('#galleryInput', 1);
    ok('duplicate of the earlier photo detected', /duplicate|Duplicate/i.test(txt('#capAuditList')), txt('#capAuditBadge'));

    /* 9. rejection reason is visible to the contributor */
    click($('[data-goto="scr-history"]')); await sleep(250);
    const rejBtn = $$('#histList [data-sub]').find(b => b.textContent.includes('Rejected'));
    ok('rejected record listed', !!rejBtn);
    if (rejBtn) {
      click(rejBtn); await sleep(250);
      ok('rejection reason shown to contributor', /Reason:/i.test(txt('#mdlItemBody')), txt('#mdlItemBody').replace(/\s+/g, ' ').slice(0, 110));
      ok('fix and resubmit offered', /Fix and resubmit/i.test(txt('#mdlItemFoot')));
    }

    /* 10. UPI change requires the PIN */
    click($('[data-goto="scr-earnings"]')); await sleep(200);
    click($('#upiChangeBtn')); await sleep(200);
    setVal($('#newUpi'), 'ramesh.patil@okaxis');
    setVal($('#upiPin'), '0000');
    click($('#mdlUpiFoot .btn:last-child')); await sleep(200);
    ok('wrong PIN is refused', $('#mdl-upi').classList.contains('is-open'));
    setVal($('#upiPin'), '1234');
    click($('#mdlUpiFoot .btn:last-child')); await sleep(250);
    ok('UPI updated and flagged for re-verification', /Re-verification/i.test(txt('#upiBadge')), txt('#upiBadge'));

    /* 11. accessibility basics */
    const unlabelled = $$('input:not([type=hidden]):not([hidden]),select,textarea')
      .filter(el => !(el.getAttribute('aria-label') || el.labels.length || el.getAttribute('aria-labelledby')))
      .map(el => (el.id || el.name || el.tagName) + '[' + el.type + ']');
    ok('all visible inputs are labelled', unlabelled.length === 0, unlabelled.join(', '));
    ok('all buttons have accessible names', $$('button').every(b => (b.textContent || '').trim() || b.getAttribute('aria-label') || b.getAttribute('title')));
    ok('zoom is not blocked', !/user-scalable\s*=\s*no/.test(document.querySelector('meta[name=viewport]').content));
    ok('one live region for status messages', $$('[aria-live]').length >= 1);
    ok('icons are inline svg, not a webfont', $$('span.material-symbols-outlined').length === 0);
    const ids = $$('[id]').map(e => e.id);
    const dupes = ids.filter((v, i2) => ids.indexOf(v) !== i2);
    ok('no duplicate element ids', dupes.length === 0, dupes.join(','));
    ok('staff code field is unique and reachable', !!$('#staffCodeInput') && $('#staffCodeInput').labels.length === 1);

    /* 12. phone preview shell */
    ok('desktop phone frame present', !!$('.phone__frame'));
    ok('device status bar present', !!$('.phone__status'));
    ok('floating action button present', !!$('.fab'));
    ok('bottom nav has 4 tabs', $$('.bottomnav .navbtn').length === 4);

    const pre = document.createElement('pre');
    pre.id = 'results';
    pre.textContent = results.join('\n') + '\n\nTOTAL ' + results.length + ' | FAILED ' + failed;
    document.body.appendChild(pre);
   } catch (err) {
    const pre = document.createElement('pre');
    pre.id = 'results';
    pre.textContent = results.join('\n') + '\n\nTHROWN: ' + (err && err.stack ? err.stack : err);
    document.body.appendChild(pre);
   }
  });
})();
