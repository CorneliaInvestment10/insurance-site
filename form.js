
  let cur = 0;
  const fd = {};

  function pick(btn, key, val) {
    // Only clear selection within THIS question's choices div
    var choicesDiv = btn.parentNode;
    var siblings = choicesDiv.querySelectorAll('.cbtn:not(.multi)');
    siblings.forEach(function(b) {
      b.classList.remove('sel');
      b.style.removeProperty('background');
      b.style.removeProperty('border-color');
      b.style.removeProperty('color');
    });
    // Mark this button as selected
    btn.classList.add('sel');
    btn.style.background = '#9e8047';
    btn.style.borderColor = '#9e8047';
    btn.style.color = '#ffffff';
    fd[key] = val;
    fd[key] = val;
    if (key === 'owner_insured') {
      var el = document.getElementById('insuredExtra');
      if (el) el.style.display = val === 'No - different individuals' ? 'block' : 'none';
    }
    if (key === 'citizenship') {
      var el2 = document.getElementById('visaDetails');
      if (el2) el2.style.display = val === 'Foreign National - Visa Holder' ? 'block' : 'none';
    }
  }

  function multi(btn, key) {
    btn.classList.toggle('sel');
    fd[key] = btn.classList.contains('sel') ? 'Yes' : 'No';
  }

  function toggleOtherField(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }

  function toggleRider(btn, key) {
    btn.classList.toggle('selected');
    fd[key] = btn.classList.contains('selected') ? 'Yes' : 'No';
  }

  let medList = [];

  function addMedication() {
    const input = document.getElementById('med_input');
    const name = input.value.trim();
    if (!name) return;
    if (medList.includes(name)) { input.value = ''; return; }
    medList.push(name);
    renderMedList();
    input.value = '';
    input.focus();
    // If they were in "no medications" mode, switch off
    const noneBtn = document.getElementById('med_none_btn');
    noneBtn.classList.remove('active');
  }

  function removeMedication(name) {
    medList = medList.filter(m => m !== name);
    renderMedList();
  }

  function renderMedList() {
    const container = document.getElementById('med_list');
    container.innerHTML = '';
    medList.forEach(name => {
      const pill = document.createElement('div');
      pill.className = 'med-pill';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'med-pill-name';
      nameSpan.textContent = name;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'med-pill-remove';
      removeBtn.innerHTML = '&times;';
      removeBtn.onclick = () => removeMedication(name);
      pill.appendChild(nameSpan);
      pill.appendChild(removeBtn);
      container.appendChild(pill);
    });
    fd['medications'] = medList.length ? medList.join(', ') : 'None';
  }

  function toggleNoMeds() {
    const noneBtn = document.getElementById('med_none_btn');
    const isActive = noneBtn.classList.contains('active');
    if (!isActive) {
      medList = [];
      renderMedList();
      noneBtn.classList.add('active');
      fd['medications'] = 'None';
    } else {
      noneBtn.classList.remove('active');
    }
  }

  function pickPolicy(type) {
    ['term','whole'].forEach(function(t) {
      document.getElementById('pob-'+t).classList.remove('sel');
      document.getElementById('pr-'+t).style.background = 'transparent';
      document.getElementById('pr-'+t).style.borderColor = 'var(--warm3)';
    });
    document.getElementById('pob-'+type).classList.add('sel');
    document.getElementById('pr-'+type).style.background = 'var(--ink)';
    document.getElementById('pr-'+type).style.borderColor = 'var(--ink)';
    fd['policy_type'] = type;
  }

  function updateProg(step) {
    for (let i = 0; i < 8; i++) {
      const ps = document.getElementById('ps'+i);
      if (!ps) continue;
      ps.classList.remove('active','done');
      if (i < step) ps.classList.add('done');
      else if (i === step) ps.classList.add('active');
      if (i < 7) {
        const pl = document.getElementById('pl'+i);
        if (pl) pl.classList.toggle('done', i < step);
      }
    }
  }

  function go(step) {
    document.getElementById('fs'+step).classList.remove('active');
    cur = step + 1;
    document.getElementById('fs'+cur).classList.add('active');
    updateProg(cur);
    window.scrollTo({ top: document.querySelector('.quote-wrap').offsetTop - 90, behavior: 'smooth' });
  }

  function back(step) {
    document.getElementById('fs'+step).classList.remove('active');
    cur = step - 1;
    document.getElementById('fs'+cur).classList.add('active');
    updateProg(cur);
    window.scrollTo({ top: document.querySelector('.quote-wrap').offsetTop - 90, behavior: 'smooth' });
  }

  function submitForm() {
    const requiredDisclosures = ['disc_fcra','disc_mib','disc_privacy','disc_hipaa','disc_receipt'];
    const missing = requiredDisclosures.some(id => !document.getElementById(id).checked);
    if (missing) {
      alert('Please review and confirm each required disclosure above before submitting.'); return;
    }
    if (!document.getElementById('consent').checked) {
      alert('Please confirm your consent before submitting.'); return;
    }
    const fields = ['fname','lname','dob','height','weight','addr','city','state','zip','phone','email','conditions','visa_type','country'];
    fields.forEach(id => { const el = document.getElementById(id); if (el) fd[id] = el.value; });
    const ins = document.getElementById('insured_name'); if (ins) fd['insured_name'] = ins.value;
    requiredDisclosures.forEach(id => { fd[id] = 'Acknowledged'; });
    console.log('Intake submission:', JSON.stringify(fd, null, 2));
    document.querySelectorAll('.fstep').forEach(function(s){ s.classList.remove('active'); });
    document.getElementById('progRow').style.display = 'none';
    document.getElementById('successBlock').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitReferral() {
    const first = document.getElementById('ref_first').value.trim();
    const last = document.getElementById('ref_last').value.trim();
    const phone = document.getElementById('ref_phone').value.trim();
    const age = document.getElementById('ref_age').value.trim();
    const time = document.getElementById('ref_time').value;
    if (!first || !last || !phone) {
      alert('Please provide the client first name, last name, and phone number.'); return;
    }
    const referralData = {
      ref_first: first, ref_last: last, ref_phone: phone,
      ref_email: document.getElementById('ref_email').value.trim(),
      ref_age: age, ref_best_time: time
    };
    console.log('Referral submitted:', JSON.stringify(referralData, null, 2));
    document.getElementById('ref_success').style.display = 'block';
    ['ref_first','ref_last','ref_phone','ref_email','ref_age'].forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('ref_time').value = '';
  }
