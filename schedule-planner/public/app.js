// public/app.js
// Schedule Planner client-side logic

// ----- Configuration -----
const API_BASE = '/api/events';

// ----- State -----
let allEvents = [];
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0-indexed
let editingEventId = null;

// ----- Utility Functions -----
function formatDate(date) {
  const yr = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const da = String(date.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

function parseDate(str) {
  const [y, m, d] = str.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function getCategoryColor(cat) {
  const colors = {
    Work: '#3B82F6',
    Personal: '#22C55E',
    Health: '#14B8A6',
    Research: '#8B5CF6',
    Other: '#9CA3AF',
  };
  return colors[cat] || '#9CA3AF';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

// ----- API -----
async function loadEvents() {
  try {
    const resp = await fetch(API_BASE);
    if (!resp.ok) throw new Error('Failed to fetch events');
    allEvents = await resp.json();
    renderCalendar();
    renderSidebar();
  } catch (e) {
    console.error(e);
    showToast('Error loading events');
  }
}

async function saveEvent() {
  const title = document.getElementById('f-title').value.trim();
  const date = document.getElementById('f-date').value;
  const start = document.getElementById('f-start').value;
  const end = document.getElementById('f-end').value;
  const category = document.getElementById('f-category').value;
  const desc = document.getElementById('f-desc').value;

  if (!title) {
    alert('Title is required');
    return;
  }

  const payload = { title, date, start, end, category, description: desc };

  try {
    const method = editingEventId ? 'PUT' : 'POST';
    const url = editingEventId ? `${API_BASE}/${editingEventId}` : API_BASE;
    const resp = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error('Save failed');
    closeModal();
    await loadEvents();
    showToast('Event saved');
  } catch (e) {
    console.error(e);
    showToast('Error saving event');
  }
}

async function deleteEvent() {
  if (!editingEventId) return;
  if (!confirm('Delete this event?')) return;
  try {
    const resp = await fetch(`${API_BASE}/${editingEventId}`, { method: 'DELETE' });
    if (!resp.ok) throw new Error('Delete failed');
    closeModal();
    await loadEvents();
    showToast('Event deleted');
  } catch (e) {
    console.error(e);
    showToast('Error deleting event');
  }
}

// ----- UI Rendering -----
function renderCalendar() {
  const main = document.querySelector('main');
  main.innerHTML = '';

  // Header with month navigation
  const headerDiv = document.createElement('div');
  headerDiv.className = 'calendar-header';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '←';
  prevBtn.onclick = () => { changeMonth(-1); };
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '→';
  nextBtn.onclick = () => { changeMonth(1); };

  const monthLabel = document.createElement('div');
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  monthLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  headerDiv.appendChild(prevBtn);
  headerDiv.appendChild(monthLabel);
  headerDiv.appendChild(nextBtn);
  main.appendChild(headerDiv);

  // Weekday header
  const weekdayHeader = document.createElement('div');
  weekdayHeader.className = 'calendar-grid weekday-header';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'day-cell weekday';
    cell.textContent = d;
    weekdayHeader.appendChild(cell);
  });
  main.appendChild(weekdayHeader);

  // Days grid (6 rows)
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  const firstOfMonth = new Date(currentYear, currentMonth, 1);
  const startDay = firstOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Fill preceding empty cells
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell other-month';
    grid.appendChild(empty);
  }

  // Fill current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    const dateStr = new Date(currentYear, currentMonth, d);
    const iso = formatDate(dateStr);

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = d;
    cell.appendChild(dayNumber);

    // today highlight
    if (iso === formatDate(today)) {
      dayNumber.classList.add('today');
    }

    // events dot(s)
    const eventsForDay = allEvents.filter(e => e.date === iso);
    if (eventsForDay.length) {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      dot.style.backgroundColor = getCategoryColor(eventsForDay[0].category || 'Other');
      cell.appendChild(dot);
    }

    // click handler
    cell.onclick = () => { openAddModal(iso); };
    grid.appendChild(cell);
  }

  // Fill trailing empty cells to complete 6 rows (42 cells total)
  const totalCells = startDay + daysInMonth;
  const trailing = 42 - totalCells;
  for (let i = 0; i < trailing; i++) {
    const empty = document.createElement('div');
    empty.className = 'day-cell other-month';
    grid.appendChild(empty);
  }

  main.appendChild(grid);
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendar();
}

function openAddModal(dateString) {
  editingEventId = null;
  document.getElementById('modal-title').textContent = 'Add Event';
  document.getElementById('f-title').value = '';
  document.getElementById('f-date').value = dateString;
  document.getElementById('f-start').value = '';
  document.getElementById('f-end').value = '';
  document.getElementById('f-category').value = 'Other';
  document.getElementById('f-desc').value = '';
  document.getElementById('btn-delete').style.display = 'none';
  document.getElementById('modal-overlay').style.display = 'flex';
}

function openEditModal(event) {
  editingEventId = event.id;
  document.getElementById('modal-title').textContent = 'Edit Event';
  document.getElementById('f-title').value = event.title;
  document.getElementById('f-date').value = event.date;
  document.getElementById('f-start').value = event.start || '';
  document.getElementById('f-end').value = event.end || '';
  document.getElementById('f-category').value = event.category || 'Other';
  document.getElementById('f-desc').value = event.description || '';
  document.getElementById('btn-delete').style.display = 'inline-block';
  document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

// ----- Sidebar -----
async function renderSidebar() {
  const aside = document.querySelector('aside');
  aside.innerHTML = '';

  const header = document.createElement('h2');
  header.textContent = 'Upcoming Events';
  aside.appendChild(header);

  // Filter upcoming events (today onward) and sort
  const upcoming = allEvents
    .filter(e => new Date(e.date) >= new Date(formatDate(today)))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.start || '').localeCompare(b.start || ''));

  if (upcoming.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No upcoming events. Click a day to add one.';
    aside.appendChild(emptyMsg);
  } else {
    const list = document.createElement('div');
    list.className = 'event-list';
    let currentLabel = '';
    upcoming.forEach(ev => {
      const evDate = new Date(ev.date);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const label = evDate.toLocaleDateString(undefined, options);
      if (label !== currentLabel) {
        currentLabel = label;
        const labelDiv = document.createElement('div');
        labelDiv.className = 'date-label';
        labelDiv.textContent = label;
        list.appendChild(labelDiv);
      }
      const card = document.createElement('div');
      card.className = 'event-card';
      card.style.borderLeftColor = getCategoryColor(ev.category);
      const title = document.createElement('div');
      title.textContent = ev.title;
      const time = document.createElement('div');
      time.textContent = ev.start && ev.end ? `${ev.start} - ${ev.end}` : '';
      const badge = document.createElement('span');
      badge.className = 'category-badge';
      badge.textContent = ev.category;
      badge.style.backgroundColor = getCategoryColor(ev.category);
      card.appendChild(title);
      if (time.textContent) card.appendChild(time);
      card.appendChild(badge);
      card.onclick = () => openEditModal(ev);
      list.appendChild(card);
    });
    aside.appendChild(list);
  }

  // Summary stats
  const summary = document.createElement('div');
  summary.className = 'summary-stats';

  // total this week & month
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const weekCount = allEvents.filter(e => {
    const d = new Date(e.date);
    return d >= startOfWeek && d <= endOfWeek;
  }).length;
  const monthCount = allEvents.filter(e => {
    const d = new Date(e.date);
    return d >= startOfMonth && d <= endOfMonth;
  }).length;

  const busiestDayMap = {};
  allEvents.forEach(e => {
    busiestDayMap[e.date] = (busiestDayMap[e.date] || 0) + 1;
  });
  let busiestDay = '-';
  let maxCount = 0;
  for (const [dateStr, cnt] of Object.entries(busiestDayMap)) {
    if (cnt > maxCount) { maxCount = cnt; busiestDay = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long' }); }
  }

  const categoryCount = {};
  allEvents.forEach(e => {
    const cat = e.category || 'Other';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  let topCategory = '-';
  let topCount = 0;
  for (const [cat, cnt] of Object.entries(categoryCount)) {
    if (cnt > topCount) { topCount = cnt; topCategory = cat; }
  }

  summary.innerHTML = `
    <div>Total this week: ${weekCount}</div>
    <div>Total this month: ${monthCount}</div>
    <div>Busiest day: ${busiestDay}</div>
    <div>Top category: ${topCategory}</div>
  `;
  aside.appendChild(summary);
}

// ----- Init -----
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
});
