/* =====================================================
   FIFA World Cup 2026 — Script
   ===================================================== */

// ---- DATA ----

const GROUPS = {
  A: {
    teams: [
      { flag: '🇺🇸', name: 'United States',  conf: 'CONCACAF' },
      { flag: '🇺🇾', name: 'Uruguay',         conf: 'CONMEBOL' },
      { flag: '🇵🇦', name: 'Panama',          conf: 'CONCACAF' },
      { flag: '🇧🇼', name: 'Botswana',        conf: 'CAF' },
    ],
  },
  B: {
    teams: [
      { flag: '🇦🇷', name: 'Argentina',       conf: 'CONMEBOL' },
      { flag: '🇪🇨', name: 'Ecuador',         conf: 'CONMEBOL' },
      { flag: '🇿🇦', name: 'South Africa',    conf: 'CAF' },
      { flag: '🇸🇻', name: 'El Salvador',     conf: 'CONCACAF' },
    ],
  },
  C: {
    teams: [
      { flag: '🇧🇷', name: 'Brazil',          conf: 'CONMEBOL' },
      { flag: '🇲🇽', name: 'Mexico',          conf: 'CONCACAF' },
      { flag: '🇨🇲', name: 'Cameroon',        conf: 'CAF' },
      { flag: '🇰🇼', name: 'Kuwait',          conf: 'AFC' },
    ],
  },
  D: {
    teams: [
      { flag: '🇫🇷', name: 'France',          conf: 'UEFA' },
      { flag: '🇲🇦', name: 'Morocco',         conf: 'CAF' },
      { flag: '🇨🇦', name: 'Canada',          conf: 'CONCACAF' },
      { flag: '🇭🇷', name: 'Croatia',         conf: 'UEFA' },
    ],
  },
  E: {
    teams: [
      { flag: '🇩🇪', name: 'Germany',         conf: 'UEFA' },
      { flag: '🇯🇵', name: 'Japan',           conf: 'AFC' },
      { flag: '🇨🇱', name: 'Chile',           conf: 'CONMEBOL' },
      { flag: '🇸🇦', name: 'Saudi Arabia',    conf: 'AFC' },
    ],
  },
  F: {
    teams: [
      { flag: '🇪🇸', name: 'Spain',           conf: 'UEFA' },
      { flag: '🇧🇪', name: 'Belgium',         conf: 'UEFA' },
      { flag: '🇾🇪', name: 'Yemen',           conf: 'AFC' },
      { flag: '🇿🇲', name: 'Zambia',          conf: 'CAF' },
    ],
  },
  G: {
    teams: [
      { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England',  conf: 'UEFA' },
      { flag: '🇵🇹', name: 'Portugal',        conf: 'UEFA' },
      { flag: '🇰🇷', name: 'South Korea',     conf: 'AFC' },
      { flag: '🇲🇱', name: 'Mali',            conf: 'CAF' },
    ],
  },
  H: {
    teams: [
      { flag: '🇮🇹', name: 'Italy',           conf: 'UEFA' },
      { flag: '🇳🇱', name: 'Netherlands',     conf: 'UEFA' },
      { flag: '🇵🇪', name: 'Peru',            conf: 'CONMEBOL' },
      { flag: '🇸🇳', name: 'Senegal',         conf: 'CAF' },
    ],
  },
  I: {
    teams: [
      { flag: '🇵🇱', name: 'Poland',          conf: 'UEFA' },
      { flag: '🇺🇦', name: 'Ukraine',         conf: 'UEFA' },
      { flag: '🇨🇴', name: 'Colombia',        conf: 'CONMEBOL' },
      { flag: '🇮🇶', name: 'Iraq',            conf: 'AFC' },
    ],
  },
  J: {
    teams: [
      { flag: '🇵🇰', name: 'Pakistan',        conf: 'AFC' },
      { flag: '🇨🇮', name: "Côte d'Ivoire",   conf: 'CAF' },
      { flag: '🇦🇹', name: 'Austria',         conf: 'UEFA' },
      { flag: '🇻🇪', name: 'Venezuela',       conf: 'CONMEBOL' },
    ],
  },
  K: {
    teams: [
      { flag: '🇹🇷', name: 'Turkey',          conf: 'UEFA' },
      { flag: '🇬🇭', name: 'Ghana',           conf: 'CAF' },
      { flag: '🇺🇿', name: 'Uzbekistan',      conf: 'AFC' },
      { flag: '🇧🇴', name: 'Bolivia',         conf: 'CONMEBOL' },
    ],
  },
  L: {
    teams: [
      { flag: '🇦🇺', name: 'Australia',       conf: 'AFC' },
      { flag: '🇨🇿', name: 'Czech Republic',  conf: 'UEFA' },
      { flag: '🇳🇬', name: 'Nigeria',         conf: 'CAF' },
      { flag: '🇵🇾', name: 'Paraguay',        conf: 'CONMEBOL' },
    ],
  },
};

const SCHEDULE = [
  // Group Stage — Opening
  { round: 'group', label: 'Group A · Opening Match', home: { flag: '🇲🇽', name: 'Mexico' },    away: { flag: '🇧🇷', name: 'Brazil' },       date: 'Jun 11', venue: 'Estadio Azteca · Mexico City', isFinal: false },
  { round: 'group', label: 'Group A',                  home: { flag: '🇺🇸', name: 'USA' },       away: { flag: '🇺🇾', name: 'Uruguay' },      date: 'Jun 12', venue: 'MetLife Stadium · NJ',          isFinal: false },
  { round: 'group', label: 'Group B',                  home: { flag: '🇦🇷', name: 'Argentina' }, away: { flag: '🇪🇨', name: 'Ecuador' },      date: 'Jun 13', venue: 'SoFi Stadium · Los Angeles',     isFinal: false },
  { round: 'group', label: 'Group C',                  home: { flag: '🇫🇷', name: 'France' },    away: { flag: '🇲🇦', name: 'Morocco' },      date: 'Jun 14', venue: 'AT&T Stadium · Dallas',           isFinal: false },
  { round: 'group', label: 'Group D',                  home: { flag: '🇩🇪', name: 'Germany' },   away: { flag: '🇯🇵', name: 'Japan' },        date: 'Jun 15', venue: 'Levi\'s Stadium · San Francisco', isFinal: false },
  { round: 'group', label: 'Group E',                  home: { flag: '🇪🇸', name: 'Spain' },     away: { flag: '🇧🇪', name: 'Belgium' },      date: 'Jun 16', venue: 'Hard Rock Stadium · Miami',       isFinal: false },
  { round: 'group', label: 'Group F',                  home: { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England' }, away: { flag: '🇵🇹', name: 'Portugal' }, date: 'Jun 17', venue: 'Mercedes-Benz Stadium · Atlanta', isFinal: false },
  { round: 'group', label: 'Group G',                  home: { flag: '🇮🇹', name: 'Italy' },     away: { flag: '🇳🇱', name: 'Netherlands' }, date: 'Jun 18', venue: 'BC Place · Vancouver',            isFinal: false },
  { round: 'group', label: 'Group H',                  home: { flag: '🇵🇱', name: 'Poland' },    away: { flag: '🇺🇦', name: 'Ukraine' },      date: 'Jun 19', venue: 'BMO Field · Toronto',             isFinal: false },
  { round: 'group', label: 'Group I',                  home: { flag: '🇧🇷', name: 'Brazil' },    away: { flag: '🇨🇦', name: 'Canada' },       date: 'Jun 20', venue: 'Lumen Field · Seattle',           isFinal: false },
  { round: 'group', label: 'Group J',                  home: { flag: '🇨🇴', name: 'Colombia' }, away: { flag: '🇵🇪', name: 'Peru' },          date: 'Jun 21', venue: 'Gillette Stadium · Boston',       isFinal: false },
  { round: 'group', label: 'Group K',                  home: { flag: '🇦🇷', name: 'Argentina' }, away: { flag: '🇲🇽', name: 'Mexico' },       date: 'Jun 22', venue: 'NRG Stadium · Houston',           isFinal: false },
  // R32
  { round: 'r32',   label: 'Round of 32',              home: { flag: '🇺🇸', name: 'USA' },       away: { flag: '🇫🇷', name: 'France' },       date: 'Jul 1',  venue: 'MetLife Stadium · NJ',            isFinal: false },
  { round: 'r32',   label: 'Round of 32',              home: { flag: '🇧🇷', name: 'Brazil' },    away: { flag: '🇩🇪', name: 'Germany' },      date: 'Jul 2',  venue: 'AT&T Stadium · Dallas',           isFinal: false },
  { round: 'r32',   label: 'Round of 32',              home: { flag: '🇦🇷', name: 'Argentina' }, away: { flag: '🇪🇸', name: 'Spain' },        date: 'Jul 3',  venue: 'SoFi Stadium · Los Angeles',      isFinal: false },
  // R16
  { round: 'r16',   label: 'Round of 16',              home: { flag: '🇺🇸', name: 'USA' },       away: { flag: '🇧🇷', name: 'Brazil' },       date: 'Jul 8',  venue: 'MetLife Stadium · NJ',            isFinal: false },
  { round: 'r16',   label: 'Round of 16',              home: { flag: '🇦🇷', name: 'Argentina' }, away: { flag: '🇫🇷', name: 'France' },       date: 'Jul 9',  venue: 'SoFi Stadium · Los Angeles',      isFinal: false },
  { round: 'r16',   label: 'Round of 16',              home: { flag: '🇩🇪', name: 'Germany' },   away: { flag: '🇪🇸', name: 'Spain' },        date: 'Jul 10', venue: 'AT&T Stadium · Dallas',           isFinal: false },
  // QF
  { round: 'qf',    label: 'Quarterfinal',             home: { flag: '🇺🇸', name: 'USA' },       away: { flag: '🇦🇷', name: 'Argentina' },    date: 'Jul 12', venue: 'MetLife Stadium · NJ',            isFinal: false },
  { round: 'qf',    label: 'Quarterfinal',             home: { flag: '🇧🇷', name: 'Brazil' },    away: { flag: '🇩🇪', name: 'Germany' },      date: 'Jul 13', venue: 'SoFi Stadium · Los Angeles',      isFinal: false },
  // SF
  { round: 'sf',    label: 'Semifinal',                home: { flag: '🇺🇸', name: 'USA' },       away: { flag: '🇧🇷', name: 'Brazil' },       date: 'Jul 15', venue: 'MetLife Stadium · NJ',            isFinal: false },
  { round: 'sf',    label: 'Semifinal',                home: { flag: '🇦🇷', name: 'Argentina' }, away: { flag: '🇫🇷', name: 'France' },       date: 'Jul 16', venue: 'AT&T Stadium · Dallas',           isFinal: false },
  // 3rd Place
  { round: 'sf',    label: 'Third Place',              home: { flag: '🇩🇪', name: 'Germany' },   away: { flag: '🇧🇷', name: 'Brazil' },       date: 'Jul 18', venue: 'Hard Rock Stadium · Miami',       isFinal: false },
  // Final
  { round: 'final', label: '🏆 The Grand Final',       home: { flag: '🇺🇸', name: 'TBD' },       away: { flag: '🏆', name: 'TBD' },           date: 'Jul 19', venue: 'MetLife Stadium · East Rutherford', isFinal: true },
];

const VENUES = [
  // USA
  { country: 'us', flag: '🏟️', name: 'MetLife Stadium',         city: 'New York / New Jersey', capacity: '82,500', note: 'Final Venue' },
  { country: 'us', flag: '🏟️', name: 'SoFi Stadium',            city: 'Los Angeles, CA',       capacity: '70,240', note: 'Semifinal' },
  { country: 'us', flag: '🏟️', name: 'AT&T Stadium',            city: 'Arlington, TX',         capacity: '80,000', note: 'Quarterfinal' },
  { country: 'us', flag: '🏟️', name: 'Hard Rock Stadium',       city: 'Miami, FL',             capacity: '65,326', note: 'Third Place Final' },
  { country: 'us', flag: '🏟️', name: 'Levi\'s Stadium',         city: 'Santa Clara, CA',       capacity: '68,500', note: 'Group Stage' },
  { country: 'us', flag: '🏟️', name: 'Mercedes-Benz Stadium',  city: 'Atlanta, GA',            capacity: '71,000', note: 'Group Stage' },
  { country: 'us', flag: '🏟️', name: 'Lumen Field',             city: 'Seattle, WA',           capacity: '67,000', note: 'Group Stage' },
  { country: 'us', flag: '🏟️', name: 'Gillette Stadium',        city: 'Foxborough, MA',        capacity: '65,878', note: 'Group Stage' },
  { country: 'us', flag: '🏟️', name: 'NRG Stadium',             city: 'Houston, TX',           capacity: '72,220', note: 'Group Stage' },
  { country: 'us', flag: '🏟️', name: 'Lincoln Financial Field', city: 'Philadelphia, PA',      capacity: '69,596', note: 'Group Stage' },
  { country: 'us', flag: '🏟️', name: 'Arrowhead Stadium',       city: 'Kansas City, MO',       capacity: '76,416', note: 'Group Stage' },
  // Canada
  { country: 'ca', flag: '🏟️', name: 'BC Place',                city: 'Vancouver, BC',         capacity: '54,500', note: 'Group Stage' },
  { country: 'ca', flag: '🏟️', name: 'BMO Field',               city: 'Toronto, ON',           capacity: '45,736', note: 'Group Stage' },
  // Mexico
  { country: 'mx', flag: '🏟️', name: 'Estadio Azteca',          city: 'Mexico City',           capacity: '87,523', note: 'Opening Match' },
  { country: 'mx', flag: '🏟️', name: 'Estadio Akron',           city: 'Guadalajara',           capacity: '49,850', note: 'Group Stage' },
  { country: 'mx', flag: '🏟️', name: 'Estadio BBVA',            city: 'Monterrey',             capacity: '53,464', note: 'Group Stage' },
];

// ---- COUNTDOWN ----

const TARGET = new Date('2026-06-11T18:00:00');

function updateCountdown() {
  const now  = new Date();
  const diff = TARGET - now;

  if (diff <= 0) {
    // Tournament has started
    const block = document.getElementById('countdown');
    if (block) {
      block.classList.add('ended');
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      const labels = block.querySelectorAll('.countdown-label');
      if (labels.length) labels[0].textContent = '🏆 UNDERWAY';
    }
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ---- NAVBAR SCROLL ----

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- HAMBURGER ----

const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

// ---- RENDER GROUPS ----

function renderGroup(letter) {
  const data    = GROUPS[letter];
  const display = document.getElementById('groupDisplay');

  display.innerHTML = `
    <div class="group-header">
      <h3>Group ${letter}</h3>
      <span>${data.teams.length} Teams · Top 2 Advance</span>
    </div>
    <table class="group-table">
      <thead>
        <tr>
          <th>Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>PTS</th>
        </tr>
      </thead>
      <tbody>
        ${data.teams.map((t, i) => `
          <tr>
            <td>
              <div class="team-cell">
                <span class="team-flag">${t.flag}</span>
                <div>
                  <div class="team-name">${t.name}</div>
                  <div class="team-conf">${t.conf}</div>
                </div>
              </div>
            </td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Re-trigger animation
  display.style.animation = 'none';
  display.offsetHeight; // reflow
  display.style.animation = '';
}

// Tab click handler
document.getElementById('groupTabs').addEventListener('click', e => {
  const btn = e.target.closest('.group-tab');
  if (!btn) return;
  document.querySelectorAll('.group-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGroup(btn.dataset.group);
});

renderGroup('A');

// ---- RENDER SCHEDULE ----

function renderSchedule(filter) {
  const grid = document.getElementById('scheduleGrid');
  const items = filter === 'all' ? SCHEDULE : SCHEDULE.filter(m => m.round === filter);

  grid.innerHTML = items.map(m => {
    const roundClass = m.round === 'final' ? 'final' : (m.round === 'group' ? 'group-stage' : 'knockout');
    const cardClass  = m.isFinal ? 'match-card is-final' : 'match-card';
    const label      = {
      group: 'Group Stage',
      r32:   'Round of 32',
      r16:   'Round of 16',
      qf:    'Quarterfinal',
      sf:    'Semifinal',
      final: 'Grand Final',
    }[m.round];

    return `
      <div class="${cardClass}">
        <div class="match-round ${roundClass}">
          <span>${m.label}</span>
          <span>${label}</span>
        </div>
        <div class="match-body">
          <div class="match-teams">
            <div class="match-team">
              <span class="match-team-flag">${m.home.flag}</span>
              <span class="match-team-name">${m.home.name}</span>
            </div>
            <span class="match-vs">VS</span>
            <div class="match-team">
              <span class="match-team-flag">${m.away.flag}</span>
              <span class="match-team-name">${m.away.name}</span>
            </div>
          </div>
          <div class="match-meta">
            <span class="match-date">${m.date}, 2026</span>
            <span class="match-venue">${m.venue}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSchedule(btn.dataset.round);
  });
});

renderSchedule('all');

// ---- RENDER VENUES ----

function renderVenues() {
  const grid = document.getElementById('venuesGrid');

  grid.innerHTML = VENUES.map(v => {
    const countryName = { us: '🇺🇸 United States', ca: '🇨🇦 Canada', mx: '🇲🇽 Mexico' }[v.country];
    return `
      <div class="venue-card reveal" data-country="${v.country}">
        <div class="venue-visual">
          <span>${v.flag}</span>
        </div>
        <div class="venue-info">
          <p class="venue-country">${countryName}</p>
          <h3 class="venue-name">${v.name}</h3>
          <p class="venue-city">${v.city}</p>
          <span class="venue-capacity">🪑 ${v.capacity} seats · ${v.note}</span>
        </div>
      </div>
    `;
  }).join('');

  observeReveal();
}

renderVenues();

// ---- SCROLL REVEAL ----

function observeReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
}

// Observe static reveal elements
document.querySelectorAll('.info-card, .host-card, .stat').forEach(el => {
  el.classList.add('reveal');
});

observeReveal();

// ---- ACTIVE NAV LINK ON SCROLL ----

const sections = ['about', 'groups', 'schedule', 'venues', 'hosts'];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}`
          ? 'var(--white)'
          : 'rgba(255,255,255,.82)';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});
