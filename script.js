const reportBugBtn = document.getElementById('reportBugBtn');
const bugModal = document.getElementById('bugModal');
const closeModalBtn = document.getElementById('closeModalBtn');

reportBugBtn.addEventListener('click', () => {
  bugModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  bugModal.classList.remove('active');
});

bugModal.addEventListener('click', (event) => {
  if (event.target === bugModal) {
    bugModal.classList.remove('active');
  }
});


const bugForm = document.getElementById('bugForm');
const bugList = document.getElementById('bugList');
const filterStatus = document.getElementById('filterStatus');

const totalBugs = document.getElementById('totalBugs');
const openBugs = document.getElementById('openBugs');
const closedBugs = document.getElementById('closedBugs');

let bugs = JSON.parse(localStorage.getItem('bugs')) || [];

bugForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const bug = {
    id: Date.now(),
    bugNumber: getNextBugNumber(),
    title: document.getElementById('bugTitle').value,




    description: document.getElementById('bugDescription').value,
    steps: document.getElementById('steps').value,
    expected: document.getElementById('expectedResult').value,
    actual: document.getElementById('actualResult').value,
    severity: document.getElementById('severity').value,
    priority: document.getElementById('priority').value,
    status: document.getElementById('status').value
  };

  bugs.push(bug);

  saveBugs();
  renderBugs();
  updateStats();

  bugForm.reset();
  bugModal.classList.remove('active');
});


function getNextBugNumber() {
  const lastNumber = Number(localStorage.getItem('lastBugNumber')) || 0;
  const nextNumber = lastNumber + 1;

  localStorage.setItem('lastBugNumber', nextNumber);

  return nextNumber;
}


function renderBugs() {
  bugList.innerHTML = '';

  const selectedStatus = filterStatus.value;

const filteredBugs = bugs.filter(bug => {
  if (selectedStatus === 'All') {
    return true;
  }

  return bug.status === selectedStatus;
});

  if (bugs.length === 0) {
    bugList.innerHTML = `
      <p class="empty-message">No bugs reported yet.</p>
    `;
    return;
  }

  filteredBugs.forEach((bug, index) => {
    const bugCard = document.createElement('div');

    bugCard.classList.add('bug-card');

    bugCard.innerHTML = `
  <div class="bug-card-header">
    <div>
      <span class="bug-id">
        BUG-${String(bug.bugNumber || index + 1).padStart(3, '0')}
      </span>

      <h3>${bug.title}</h3>
    </div>

    <span class="status">${bug.status}</span>
  </div>

  <p class="bug-description">
    ${bug.description}
  </p>

  <div class="bug-info">
    <span>
  Severity:
  <strong class="severity severity-${bug.severity.toLowerCase()}">
    ${bug.severity}
  </strong>
</span>
    <span>Priority: <strong>${bug.priority}</strong></span>
  </div>

  <button class="details-btn">View Details</button>

  <div class="bug-details">
    <div>
      <h4>Steps to Reproduce</h4>
      <p>${bug.steps}</p>
    </div>

    <div>
      <h4>Expected Result</h4>
      <p>${bug.expected}</p>
    </div>

    <div>
      <h4>Actual Result</h4>
      <p>${bug.actual}</p>
    </div>
  </div>

  <div class="bug-actions">

  <select class="status-select">
    <option value="Open" ${bug.status === 'Open' ? 'selected' : ''}>
      Open
    </option>

    <option value="In Progress" ${bug.status === 'In Progress' ? 'selected' : ''}>
      In Progress
    </option>

    <option value="Closed" ${bug.status === 'Closed' ? 'selected' : ''}>
      Closed
    </option>
  </select>

  <button class="delete-btn">
    Delete
  </button>

</div>
`;

const detailsBtn = bugCard.querySelector('.details-btn');
const bugDetails = bugCard.querySelector('.bug-details');

detailsBtn.addEventListener('click', () => {
  bugDetails.classList.toggle('active');

  detailsBtn.textContent =
    bugDetails.classList.contains('active')
      ? 'Hide Details'
      : 'View Details';
});

const statusSelect = bugCard.querySelector('.status-select');
const deleteBtn = bugCard.querySelector('.delete-btn');

statusSelect.addEventListener('change', () => {
  bug.status = statusSelect.value;

  saveBugs();
  renderBugs();
  updateStats();
});

deleteBtn.addEventListener('click', () => {
  const confirmed = confirm(
    `Are you sure you want to delete BUG-${String(
      bug.bugNumber || index + 1
    ).padStart(3, '0')}?`
  );

  if (!confirmed) {
    return;
  }

  bugs = bugs.filter(item => item.id !== bug.id);

  saveBugs();
  renderBugs();
  updateStats();
});

    bugList.appendChild(bugCard);
  });
}

filterStatus.addEventListener('change', () => {
  renderBugs();
});




function updateStats() {
  totalBugs.textContent = bugs.length;

  openBugs.textContent = bugs.filter(
    bug => bug.status !== 'Closed'
  ).length;

  closedBugs.textContent = bugs.filter(
    bug => bug.status === 'Closed'
  ).length;
}



function saveBugs() {
  localStorage.setItem('bugs', JSON.stringify(bugs));
}

renderBugs();
updateStats();