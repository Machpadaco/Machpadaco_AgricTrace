// Machpadaco AgriTrace - Frontend JS - Fertilizer Pilot
// Brand: Machpadaco Global Services | Colors: #0F172A #1491A2 #06B6D4
// All fetch calls use async/await - Fictional data only

const API = '';

// Helper to show result
function showResult(id, html, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = html;
  el.style.borderColor = isError ? '#ef4444' : '#1491A2';
  el.style.background = isError ? '#fef2f2' : '#f0fdfa';
}

// 1. Farmer Registration - Duplicate safeguard
async function registerFarmer() {
  const fid = document.getElementById('fid').value.trim();
  const fname = document.getElementById('fname').value.trim();
  const fcommunity = document.getElementById('fcommunity').value.trim();
  const fcontact = document.getElementById('fcontact').value.trim();
  const fcrop = document.getElementById('fcrop').value.trim();
  const fstatus = document.getElementById('fstatus').value;
  const freason = document.getElementById('freason').value.trim();

  if (!fid || !fname) {
    showResult('fresult', '❌ Farmer ID and Name required', true);
    return;
  }

  try {
    const res = await fetch(`${API}/api/farmers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: fid,
        name: fname,
        community: fcommunity,
        contact: fcontact,
        crop: fcrop,
        eligibilityStatus: fstatus,
        eligibilityReason: freason,
        createdBy: 'admin'
      })
    });

    const data = await res.json();

    if (!res.ok) {
      // Duplicate flagged case
      showResult('fresult', `⚠️ <strong>Duplicate flagged</strong><br/>${data.message}<br/>ID: ${data.farmerId || fid}<br/><em>Flagged for review only - does not auto-accuse fraud</em>`, true);
    } else {
      showResult('fresult', `✅ <strong>Registered</strong><br/>${data.message}<br/>ID: ${data.farmer.farmerId} - ${data.farmer.name} (${data.farmer.eligibilityStatus})`);
    }
  } catch (err) {
    showResult('fresult', `❌ Error: ${err.message}`, true);
  }
}

// 2. Allocation - Fertilizer tracking
async function addAllocation() {
  const prog = document.getElementById('prog').value.trim();
  const ftype = document.getElementById('ftype').value.trim();
  const acomm = document.getElementById('acomm').value.trim();
  const abags = document.getElementById('abags').value;
  const batch = document.getElementById('batch').value.trim();
  const dispatched = document.getElementById('dispatched').value;
  const received = document.getElementById('received').value;

  if (!acomm || !abags) {
    showResult('aresult', '❌ Community and Bags Allocated required', true);
    return;
  }

  try {
    const res = await fetch(`${API}/api/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programmeName: prog,
        fertilizerType: ftype,
        community: acomm,
        bagsAllocated: Number(abags),
        batchRef: batch,
        bagsDispatched: Number(dispatched) || 0,
        bagsReceivedAtCentre: Number(received) || 0,
        distributionCentre: acomm + ' Centre'
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed');

    showResult('aresult', `✅ <strong>Saved</strong><br/>${data.message}<br/>Community: ${data.allocation.community}<br/>Allocated: ${data.allocation.bagsAllocated} | Dispatched: ${data.allocation.bagsDispatched} | Centre Received: ${data.allocation.bagsReceivedAtCentre}<br/>Batch: ${data.allocation.batchRef}`);
  } catch (err) {
    showResult('aresult', `❌ Error: ${err.message}`, true);
  }
}

// 3. Generate OTP - Simulated (not real SMS)
async function generateOTP() {
  const display = document.getElementById('otpDisplay');
  if (display) display.textContent = 'Generating...';

  try {
    const res = await fetch(`${API}/api/receipts/generate-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (display) {
      display.textContent = `OTP: ${data.otp} - ${data.message}`;
      display.style.background = '#0F172A';
      display.style.color = '#06B6D4';
    }

    // Auto-fill into otp input for demo
    const rotp = document.getElementById('rotp');
    if (rotp) rotp.value = data.otp;

  } catch (err) {
    if (display) display.textContent = `Error: ${err.message}`;
    showResult('rresult', `❌ OTP Error: ${err.message}`, true);
  }
}

// 4. Confirm Receipt - Independent farmer confirmation
async function confirmReceipt() {
  const rfid = document.getElementById('rfid').value.trim();
  const rapproved = document.getElementById('rapproved').value;
  const rissued = document.getElementById('rissued').value;
  const rreceived = document.getElementById('rreceived').value;
  const rpoint = document.getElementById('rpoint').value.trim();
  const rotp = document.getElementById('rotp').value.trim();

  if (!rfid || !rissued || !rreceived) {
    showResult('rresult', '❌ Farmer ID, Quantity Issued and Received required', true);
    return;
  }

  try {
    const res = await fetch(`${API}/api/receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: rfid,
        approvedAllocation: Number(rapproved) || Number(rissued),
        quantityIssued: Number(rissued),
        quantityReceived: Number(rreceived),
        distributionPoint: rpoint,
        confirmationDate: new Date(),
        confirmationMethod: 'Simulated OTP',
        otpCode: rotp,
        complaint: Number(rissued) > Number(rreceived) ? `Shortage of ${Number(rissued) - Number(rreceived)} bag(s)` : ''
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed');

    const shortageMsg = data.receipt.shortage > 0
      ? `⚠️ <strong>Shortage flagged</strong> - ${data.receipt.shortage} bag(s) shortage flagged for review<br/><em>${data.accountability}</em>`
      : `✅ <strong>Confirmed</strong> - ${data.accountability}`;

    showResult('rresult', `${shortageMsg}<br/>Farmer: ${data.receipt.farmerId} | Issued: ${data.receipt.quantityIssued} | Received: ${data.receipt.quantityReceived} | Method: ${data.receipt.confirmationMethod}<br/><small>${data.pilotNote}</small>`, data.receipt.shortage > 0);
  } catch (err) {
    showResult('rresult', `❌ Error: ${err.message}`, true);
  }
}

// 5. Load Dashboard - Accountability (flags, does NOT auto-accuse)
async function loadDashboard() {
  const dashEl = document.getElementById('dashboard');
  if (dashEl) dashEl.innerHTML = 'Loading Machpadaco AgriTrace dashboard...';

  try {
    const res = await fetch(`${API}/api/dashboard`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const html = `
      <div style="margin-bottom:10px; font-weight:700; color:#0F172A;">${data.brand} - ${data.system} - ${data.module}</div>
      <div class="stat-grid">
        <div class="stat"><strong>${data.totalAllocated}</strong><span>Total Allocated</span></div>
        <div class="stat"><strong>${data.totalDispatched}</strong><span>Total Dispatched</span></div>
        <div class="stat"><strong>${data.totalReceivedCentre}</strong><span>Received at Centre</span></div>
        <div class="stat"><strong>${data.totalIssued}</strong><span>Total Issued</span></div>
        <div class="stat"><strong>${data.totalConfirmed}</strong><span>Total Confirmed</span></div>
        <div class="stat" style="background:linear-gradient(135deg,#7c2d12,#f59e0b);"><strong>${data.flaggedDifference}</strong><span>Flagged Difference</span></div>
        <div class="stat"><strong>${data.unconfirmedCount}</strong><span>Unconfirmed</span></div>
        <div class="stat"><strong>${data.disputes.length}</strong><span>Disputes</span></div>
      </div>
      <div style="background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; margin:10px 0; font-size:0.85rem;">
        <strong>Example:</strong> ${data.example}<br/>
        <strong>Future:</strong> ${data.future}<br/>
        <strong>Note:</strong> ${data.note}<br/>
        <strong>Principle:</strong> Every movement recorded, farmers confirm receipt independently, flags for review not accusation, no silent editing, separation of duties, privacy.
      </div>
      <div style="font-size:0.8rem; color:#64748b;">
        <details><summary>View Allocations (${data.allocations.length})</summary><pre style="white-space:pre-wrap; word-break:break-word; background:white; padding:8px; border-radius:6px; max-height:200px; overflow:auto;">${JSON.stringify(data.allocations, null, 2)}</pre></details>
        <details><summary>View Receipts (${data.receipts.length})</summary><pre style="white-space:pre-wrap; word-break:break-word; background:white; padding:8px; border-radius:6px; max-height:200px; overflow:auto;">${JSON.stringify(data.receipts, null, 2)}</pre></details>
        <details><summary>View Disputes (${data.disputes.length})</summary><pre style="white-space:pre-wrap; word-break:break-word; background:#fff7ed; padding:8px; border-radius:6px; max-height:200px; overflow:auto;">${JSON.stringify(data.disputes, null, 2)}</pre></details>
      </div>
    `;

    if (dashEl) dashEl.innerHTML = html;

  } catch (err) {
    if (dashEl) dashEl.innerHTML = `❌ Dashboard Error: ${err.message}`;
  }
}
