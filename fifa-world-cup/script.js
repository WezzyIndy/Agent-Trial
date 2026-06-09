/* =====================================================
   FIFA World Cup 2026 Bracket Challenge
   ===================================================== */

// =====================================================
// DATA
// =====================================================

const GROUPS = {
  A: { teams: [
    { flag: '🇺🇸', name: 'United States',  conf: 'CONCACAF' },
    { flag: '🇺🇾', name: 'Uruguay',         conf: 'CONMEBOL' },
    { flag: '🇵🇦', name: 'Panama',          conf: 'CONCACAF' },
    { flag: '🇧🇼', name: 'Botswana',        conf: 'CAF'      },
  ]},
  B: { teams: [
    { flag: '🇦🇷', name: 'Argentina',       conf: 'CONMEBOL' },
    { flag: '🇪🇨', name: 'Ecuador',         conf: 'CONMEBOL' },
    { flag: '🇿🇦', name: 'South Africa',    conf: 'CAF'      },
    { flag: '🇸🇻', name: 'El Salvador',     conf: 'CONCACAF' },
  ]},
  C: { teams: [
    { flag: '🇧🇷', name: 'Brazil',          conf: 'CONMEBOL' },
    { flag: '🇲🇽', name: 'Mexico',          conf: 'CONCACAF' },
    { flag: '🇨🇲', name: 'Cameroon',        conf: 'CAF'      },
    { flag: '🇰🇼', name: 'Kuwait',          conf: 'AFC'      },
  ]},
  D: { teams: [
    { flag: '🇫🇷', name: 'France',          conf: 'UEFA'     },
    { flag: '🇲🇦', name: 'Morocco',         conf: 'CAF'      },
    { flag: '🇨🇦', name: 'Canada',          conf: 'CONCACAF' },
    { flag: '🇭🇷', name: 'Croatia',         conf: 'UEFA'     },
  ]},
  E: { teams: [
    { flag: '🇩🇪', name: 'Germany',         conf: 'UEFA'     },
    { flag: '🇯🇵', name: 'Japan',           conf: 'AFC'      },
    { flag: '🇨🇱', name: 'Chile',           conf: 'CONMEBOL' },
    { flag: '🇸🇦', name: 'Saudi Arabia',    conf: 'AFC'      },
  ]},
  F: { teams: [
    { flag: '🇪🇸', name: 'Spain',           conf: 'UEFA'     },
    { flag: '🇧🇪', name: 'Belgium',         conf: 'UEFA'     },
    { flag: '🇾🇪', name: 'Yemen',           conf: 'AFC'      },
    { flag: '🇿🇲', name: 'Zambia',          conf: 'CAF'      },
  ]},
  G: { teams: [
    { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England',   conf: 'UEFA'     },
    { flag: '🇵🇹', name: 'Portugal',        conf: 'UEFA'     },
    { flag: '🇰🇷', name: 'South Korea',     conf: 'AFC'      },
    { flag: '🇲🇱', name: 'Mali',            conf: 'CAF'      },
  ]},
  H: { teams: [
    { flag: '🇮🇹', name: 'Italy',           conf: 'UEFA'     },
    { flag: '🇳🇱', name: 'Netherlands',     conf: 'UEFA'     },
    { flag: '🇵🇪', name: 'Peru',            conf: 'CONMEBOL' },
    { flag: '🇸🇳', name: 'Senegal',         conf: 'CAF'      },
  ]},
  I: { teams: [
    { flag: '🇵🇱', name: 'Poland',          conf: 'UEFA'     },
    { flag: '🇺🇦', name: 'Ukraine',         conf: 'UEFA'     },
    { flag: '🇨🇴', name: 'Colombia',        conf: 'CONMEBOL' },
    { flag: '🇮🇶', name: 'Iraq',            conf: 'AFC'      },
  ]},
  J: { teams: [
    { flag: '🇨🇮', name: "Côte d'Ivoire",   conf: 'CAF'      },
    { flag: '🇦🇹', name: 'Austria',         conf: 'UEFA'     },
    { flag: '🇻🇪', name: 'Venezuela',       conf: 'CONMEBOL' },
    { flag: '🇵🇰', name: 'Pakistan',        conf: 'AFC'      },
  ]},
  K: { teams: [
    { flag: '🇹🇷', name: 'Turkey',          conf: 'UEFA'     },
    { flag: '🇬🇭', name: 'Ghana',           conf: 'CAF'      },
    { flag: '🇺🇿', name: 'Uzbekistan',      conf: 'AFC'      },
    { flag: '🇧🇴', name: 'Bolivia',         conf: 'CONMEBOL' },
  ]},
  L: { teams: [
    { flag: '🇦🇺', name: 'Australia',       conf: 'AFC'      },
    { flag: '🇨🇿', name: 'Czech Republic',  conf: 'UEFA'     },
    { flag: '🇳🇬', name: 'Nigeria',         conf: 'CAF'      },
    { flag: '🇵🇾', name: 'Paraguay',        conf: 'CONMEBOL' },
  ]},
};

// Round of 32 seeding: [homeSource, awaySource]
// Source format: 'A.first' | 'A.second' | 'A.wild' (3rd place)
const R32_SEEDING = [
  ['A.first',  'B.second'],  // M1
  ['C.first',  'D.second'],  // M2
  ['B.first',  'A.second'],  // M3
  ['D.first',  'C.second'],  // M4
  ['E.first',  'F.second'],  // M5
  ['G.first',  'H.second'],  // M6
  ['F.first',  'E.second'],  // M7
  ['H.first',  'G.second'],  // M8
  ['I.first',  'J.second'],  // M9
  ['K.first',  'L.second'],  // M10
  ['J.first',  'I.second'],  // M11
  ['L.first',  'K.second'],  // M12
  ['A.wild',   'C.wild' ],   // M13 — wildcards (best 3rd place)
  ['B.wild',   'D.wild' ],   // M14
  ['E.wild',   'G.wild' ],   // M15
  ['F.wild',   'H.wild' ],   // M16
];

const R32_VENUES = [
  'MetLife Stadium · NJ',     'AT&T Stadium · Dallas',
  'SoFi Stadium · LA',        'Hard Rock Stadium · Miami',
  "Levi's Stadium · SF",      'MB Stadium · Atlanta',
  'Lumen Field · Seattle',    'Gillette Stadium · Boston',
  'NRG Stadium · Houston',    'BC Place · Vancouver',
  'BMO Field · Toronto',      'Azteca · Mexico City',
  'Arrowhead · Kansas City',  'Lincoln Financial · Philadelphia',
  'Estadio Akron · Guadalajara', 'Estadio BBVA · Monterrey',
];

const ROUNDS = ['r32', 'r16', 'qf', 'sf', 'final'];
const ROUND_LABELS = { r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarterfinals', sf: 'Semifinals', final: 'Grand Final' };
const ROUND_COUNTS = { r32: 16, r16: 8, qf: 4, sf: 2, final: 1 };

const VENUES_DATA = [
  { country:'us', name:'MetLife Stadium',         city:'New York / New Jersey', capacity:'82,500', note:'Final Venue' },
  { country:'us', name:'SoFi Stadium',            city:'Los Angeles, CA',        capacity:'70,240', note:'Semifinal'   },
  { country:'us', name:'AT&T Stadium',            city:'Arlington, TX',          capacity:'80,000', note:'Quarterfinal'},
  { country:'us', name:'Hard Rock Stadium',       city:'Miami, FL',              capacity:'65,326', note:'3rd Place'   },
  { country:'us', name:"Levi's Stadium",          city:'Santa Clara, CA',        capacity:'68,500', note:'Group Stage' },
  { country:'us', name:'Mercedes-Benz Stadium',   city:'Atlanta, GA',            capacity:'71,000', note:'Group Stage' },
  { country:'us', name:'Lumen Field',             city:'Seattle, WA',            capacity:'67,000', note:'Group Stage' },
  { country:'us', name:'Gillette Stadium',        city:'Foxborough, MA',         capacity:'65,878', note:'Group Stage' },
  { country:'us', name:'NRG Stadium',             city:'Houston, TX',            capacity:'72,220', note:'Group Stage' },
  { country:'us', name:'Lincoln Financial Field', city:'Philadelphia, PA',       capacity:'69,596', note:'Group Stage' },
  { country:'us', name:'Arrowhead Stadium',       city:'Kansas City, MO',        capacity:'76,416', note:'Group Stage' },
  { country:'ca', name:'BC Place',                city:'Vancouver, BC',          capacity:'54,500', note:'Group Stage' },
  { country:'ca', name:'BMO Field',               city:'Toronto, ON',            capacity:'45,736', note:'Group Stage' },
  { country:'mx', name:'Estadio Azteca',          city:'Mexico City',            capacity:'87,523', note:'Opening Match'},
  { country:'mx', name:'Estadio Akron',           city:'Guadalajara',            capacity:'49,850', note:'Group Stage' },
  { country:'mx', name:'Estadio BBVA',            city:'Monterrey',              capacity:'53,464', note:'Group Stage' },
];

// =====================================================
// STATE
// =====================================================

const STORAGE_PICKERS_KEY = 'wc2026_pickers';
const STORAGE_PICKS_PREFIX = 'wc2026_picks_';

let state = {
  name: '',
  groupPicks: {},    // { A: { first: Team|null, second: Team|null }, ... }
  bracketPicks: {},  // { r32: [Team|null x16], r16: [...x8], qf: [...x4], sf: [...x2], final: [...x1] }
  currentBracketRound: 'r32',
};

function initGroupPicks() {
  const picks = {};
  Object.keys(GROUPS).forEach(g => { picks[g] = { first: null, second: null }; });
  return picks;
}

function initBracketPicks() {
  const picks = {};
  ROUNDS.forEach(r => { picks[r] = Array(ROUND_COUNTS[r]).fill(null); });
  return picks;
}

function loadState(name) {
  const raw = localStorage.getItem(STORAGE_PICKS_PREFIX + name);
  if (raw) {
    const saved = JSON.parse(raw);
    state = { ...state, ...saved, name };
  } else {
    state.name = name;
    state.groupPicks = initGroupPicks();
    state.bracketPicks = initBracketPicks();
    state.currentBracketRound = 'r32';
  }
}

function saveState() {
  const toSave = {
    name: state.name,
    groupPicks: state.groupPicks,
    bracketPicks: state.bracketPicks,
    currentBracketRound: state.currentBracketRound,
  };
  localStorage.setItem(STORAGE_PICKS_PREFIX + state.name, JSON.stringify(toSave));

  const pickers = getPickers();
  if (!pickers.includes(state.name)) {
    pickers.push(state.name);
    localStorage.setItem(STORAGE_PICKERS_KEY, JSON.stringify(pickers));
  }
}

function getPickers() {
  const raw = localStorage.getItem(STORAGE_PICKERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function deletePicker(name) {
  localStorage.removeItem(STORAGE_PICKS_PREFIX + name);
  const pickers = getPickers().filter(p => p !== name);
  localStorage.setItem(STORAGE_PICKERS_KEY, JSON.stringify(pickers));
}

// =====================================================
// BRACKET HELPERS
// =====================================================

function getTeamForSource(src) {
  const [group, placement] = src.split('.');
  if (placement === 'first')  return state.groupPicks[group]?.first  || null;
  if (placement === 'second') return state.groupPicks[group]?.second || null;
  if (placement === 'wild')   return getWildcard(group);
  return null;
}

function getWildcard(group) {
  const picks = state.groupPicks[group] || {};
  const pickedNames = [picks.first, picks.second].filter(Boolean).map(t => t.name);
  const remaining = GROUPS[group].teams.filter(t => !pickedNames.includes(t.name));
  return remaining[0] ? { ...remaining[0], isWild: true } : null;
}

function getR32Matches() {
  return R32_SEEDING.map(([homeSrc, awaySrc], i) => ({
    home: getTeamForSource(homeSrc),
    away: getTeamForSource(awaySrc),
    venue: R32_VENUES[i],
  }));
}

function getRoundMatches(round) {
  if (round === 'r32') return getR32Matches();

  const prevRound = ROUNDS[ROUNDS.indexOf(round) - 1];
  const prevPicks = state.bracketPicks[prevRound];
  const count = ROUND_COUNTS[round];

  return Array.from({ length: count }, (_, i) => ({
    home: prevPicks[i * 2]     || null,
    away: prevPicks[i * 2 + 1] || null,
    venue: null,
  }));
}

function nextRound(round) {
  const idx = ROUNDS.indexOf(round);
  return idx < ROUNDS.length - 1 ? ROUNDS[idx + 1] : null;
}

function cascadeInvalidate(round, matchIdx) {
  const next = nextRound(round);
  if (!next) return;
  const nextIdx = Math.floor(matchIdx / 2);
  if (state.bracketPicks[next][nextIdx] !== null) {
    state.bracketPicks[next][nextIdx] = null;
    cascadeInvalidate(next, nextIdx);
  }
}

function hasBracketPicks() {
  return ROUNDS.some(r => state.bracketPicks[r].some(p => p !== null));
}

function clearBracketPicks() {
  state.bracketPicks = initBracketPicks();
  state.currentBracketRound = 'r32';
}

function roundComplete(round) {
  const matches = getRoundMatches(round);
  return matches.every((m, i) => {
    if (!m.home || !m.away) return false; // TBD team
    return state.bracketPicks[round][i] !== null;
  });
}

function countRoundPicks(round) {
  const matches = getRoundMatches(round);
  return matches.filter((m, i) => m.home && m.away && state.bracketPicks[round][i] !== null).length;
}

function countRoundPickable(round) {
  return getRoundMatches(round).filter(m => m.home && m.away).length;
}

// =====================================================
// SCREEN MANAGEMENT
// =====================================================

function showScreen(id) {
  document.querySelectorAll('.pick-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

// =====================================================
// WELCOME SCREEN
// =====================================================

function renderWelcome() {
  const pickers = getPickers();
  const container = document.getElementById('savedUsers');
  if (!pickers.length) { container.innerHTML = ''; return; }

  container.innerHTML = `
    <p class="saved-users-label">Continue as existing picker:</p>
    <div class="saved-users-list">
      ${pickers.map(name => `
        <button class="saved-user-btn" data-name="${name}">
          ⚽ ${name}
          <span class="user-delete" data-delete="${name}" title="Delete picks">&#10005;</span>
        </button>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.saved-user-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const del = e.target.closest('[data-delete]');
      if (del) {
        e.stopPropagation();
        if (confirm(`Delete ${del.dataset.delete}'s picks?`)) {
          deletePicker(del.dataset.delete);
          renderWelcome();
        }
        return;
      }
      const name = btn.dataset.name;
      loadState(name);
      startGame();
    });
  });
}

document.getElementById('startBtn').addEventListener('click', () => {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) { showToast('Please enter your name first.'); return; }
  loadState(name);
  startGame();
});

document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('startBtn').click();
});

function startGame() {
  const groupsDone = Object.values(state.groupPicks).every(p => p.first && p.second);
  if (groupsDone && hasBracketPicks()) {
    showScreen('screen-bracket');
    renderBracketRound(state.currentBracketRound);
    document.getElementById('bracketRoundTabs').querySelectorAll('.bracket-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.round === state.currentBracketRound);
    });
  } else if (groupsDone) {
    showScreen('screen-bracket');
    renderBracketRound('r32');
  } else {
    showScreen('screen-groups');
    renderGroupsPickGrid();
    updateGroupProgress();
  }
}

document.getElementById('backToWelcomeBtn').addEventListener('click', () => {
  showScreen('screen-welcome');
  renderWelcome();
});

// =====================================================
// GROUP PICKS
// =====================================================

function renderGroupsPickGrid() {
  const grid = document.getElementById('groupsPickGrid');
  grid.innerHTML = Object.keys(GROUPS).map(letter => renderGroupCard(letter)).join('');

  grid.querySelectorAll('.gpc-team').forEach(el => {
    el.addEventListener('click', () => {
      clickTeamPick(el.dataset.group, parseInt(el.dataset.idx));
    });
  });
}

function renderGroupCard(letter) {
  const picks = state.groupPicks[letter] || { first: null, second: null };
  const teams = GROUPS[letter].teams;
  const complete = picks.first && picks.second;

  const teamsHtml = teams.map((t, i) => {
    const isFirst  = picks.first?.name  === t.name;
    const isSecond = picks.second?.name === t.name;
    const rankClass = isFirst ? 'rank-1' : isSecond ? 'rank-2' : '';
    const rankIcon  = isFirst ? '🥇' : isSecond ? '🥈' : '<span style="color:var(--border)">○</span>';

    return `
      <div class="gpc-team ${rankClass}" data-group="${letter}" data-idx="${i}" title="Click to pick">
        <span class="gpc-team-rank">${rankIcon}</span>
        <span class="gpc-team-flag">${t.flag}</span>
        <span class="gpc-team-name">${t.name}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="group-pick-card ${complete ? 'complete' : ''}">
      <div class="group-pick-card-header">
        <span class="gpc-letter">Group ${letter}</span>
        <span class="gpc-status">${complete ? '✓ Complete' : picks.first ? '1 more pick' : '2 picks needed'}</span>
      </div>
      <div class="gpc-teams">${teamsHtml}</div>
    </div>
  `;
}

function clickTeamPick(group, teamIdx) {
  const picks = state.groupPicks[group];
  const team  = GROUPS[group].teams[teamIdx];

  if (picks.first?.name === team.name) {
    picks.first  = picks.second;
    picks.second = null;
  } else if (picks.second?.name === team.name) {
    picks.second = null;
  } else if (!picks.first) {
    picks.first = team;
  } else if (!picks.second) {
    picks.second = team;
  } else {
    picks.second = team;
  }

  if (hasBracketPicks()) {
    clearBracketPicks();
    showToast('Group picks changed — bracket reset.');
  }

  saveState();
  renderGroupsPickGrid();
  updateGroupProgress();
}

function updateGroupProgress() {
  const total    = Object.keys(GROUPS).length;
  const complete = Object.values(state.groupPicks).filter(p => p.first && p.second).length;
  const pct      = (complete / total) * 100;

  document.getElementById('groupProgressBar').style.width = pct + '%';
  document.getElementById('groupProgressLabel').textContent = `${complete} / ${total} groups complete`;
  document.getElementById('toBracketBtn').disabled = complete < total;
}

document.getElementById('toBracketBtn').addEventListener('click', () => {
  showScreen('screen-bracket');
  renderBracketRound('r32');
  updateBracketTabStates();
  document.querySelector('.bracket-tab[data-round="r32"]').classList.add('active');
});

// =====================================================
// BRACKET
// =====================================================

function renderBracketRound(round) {
  state.currentBracketRound = round;
  const matches = getRoundMatches(round);
  const picks   = state.bracketPicks[round];
  const isFinal = round === 'final';

  const grid = document.getElementById('bracketMatchGrid');
  grid.className = `bracket-match-grid${isFinal ? ' grid-final' : ''}`;

  grid.innerHTML = matches.map((m, i) => {
    const winner = picks[i];
    const homeWon = winner?.name === m.home?.name;
    const awayWon = winner?.name === m.away?.name;
    const isTBD = !m.home || !m.away;
    const matchComplete = !!winner;

    return `
      <div class="bracket-match ${matchComplete ? 'complete' : ''} ${isFinal ? 'is-final' : ''}">
        <div class="match-label">
          <span>${isFinal ? '🏆 Grand Final' : `Match ${i + 1}`}</span>
          ${m.venue ? `<span>${m.venue}</span>` : ''}
        </div>
        ${renderMatchTeamRow(m.home, homeWon, awayWon, isTBD, round, i, 'home')}
        <div class="match-vs-divider">VS</div>
        ${renderMatchTeamRow(m.away, awayWon, homeWon, isTBD, round, i, 'away')}
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.match-team-row:not(.tbd):not(.loser)').forEach(row => {
    row.addEventListener('click', () => {
      const round_ = row.dataset.round;
      const idx    = parseInt(row.dataset.idx);
      const side   = row.dataset.side;
      const m      = getRoundMatches(round_)[idx];
      const team   = side === 'home' ? m.home : m.away;
      pickBracketWinner(round_, idx, team);
    });
  });

  updateBracketProgress(round);
  updateBracketTabStates();
  updateChampionBanner();
}

function renderMatchTeamRow(team, isWinner, isLoser, isTBD, round, matchIdx, side) {
  if (!team) {
    return `<div class="match-team-row tbd">
      <span class="match-team-flag">🏳️</span>
      <span class="match-team-name">TBD</span>
    </div>`;
  }
  const cls = isTBD ? 'tbd' : isWinner ? 'winner' : isLoser ? 'loser' : '';
  const badge = isWinner ? '<span class="match-winner-badge">✓</span>' : '';

  return `
    <div class="match-team-row ${cls}"
         data-round="${round}" data-idx="${matchIdx}" data-side="${side}">
      <span class="match-team-flag">${team.flag}</span>
      <span class="match-team-name">${team.name}${team.isWild ? ' <small style="color:var(--gray);font-weight:400;font-size:10px">3rd</small>' : ''}</span>
      ${badge}
    </div>
  `;
}

function pickBracketWinner(round, matchIdx, team) {
  const current = state.bracketPicks[round][matchIdx];

  if (current?.name === team.name) {
    state.bracketPicks[round][matchIdx] = null;
    cascadeInvalidate(round, matchIdx);
  } else {
    if (current !== null) cascadeInvalidate(round, matchIdx);
    state.bracketPicks[round][matchIdx] = team;

    // Auto-place winner in next round
    const next = nextRound(round);
    if (next) {
      const nextIdx = Math.floor(matchIdx / 2);
      // Only auto-fill if the slot currently holds the OLD team or is empty
      state.bracketPicks[next][nextIdx] = null;
      cascadeInvalidate(next, nextIdx);
    }
  }

  saveState();
  renderBracketRound(round);
}

function updateBracketProgress(round) {
  const done     = countRoundPicks(round);
  const total    = countRoundPickable(round);
  const pct      = total > 0 ? (done / total) * 100 : 0;
  const fill     = document.getElementById('bracketProgressBar');
  const label    = document.getElementById('bracketProgressLabel');
  fill.style.setProperty('--pct', pct + '%');
  label.textContent = `${done} / ${total} matches picked`;
}

function updateBracketTabStates() {
  document.querySelectorAll('.bracket-tab').forEach(tab => {
    const r = tab.dataset.round;
    tab.classList.remove('active', 'complete');
    if (r === state.currentBracketRound) tab.classList.add('active');
    if (roundComplete(r)) tab.classList.add('complete');
    if (r === 'final') tab.classList.add('final-tab');
  });
}

function updateChampionBanner() {
  const champion = state.bracketPicks['final'][0];
  const banner   = document.getElementById('championBanner');
  if (champion) {
    banner.classList.remove('hidden');
    banner.innerHTML = `
      <div class="champion-trophy">🏆</div>
      <p class="champion-label">Your 2026 World Cup Champion</p>
      <div class="champion-flag">${champion.flag}</div>
      <div class="champion-name">${champion.name}</div>
    `;
  } else {
    banner.classList.add('hidden');
  }
}

// Bracket round tabs
document.getElementById('bracketRoundTabs').addEventListener('click', e => {
  const tab = e.target.closest('.bracket-tab');
  if (!tab) return;
  const round = tab.dataset.round;
  document.querySelectorAll('.bracket-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderBracketRound(round);
});

document.getElementById('backToGroupsBtn').addEventListener('click', () => {
  showScreen('screen-groups');
  renderGroupsPickGrid();
  updateGroupProgress();
});

document.getElementById('viewSummaryBtn').addEventListener('click', () => {
  renderSummary();
  showScreen('screen-summary');
});

// =====================================================
// SUMMARY
// =====================================================

function renderSummary() {
  const champion = state.bracketPicks['final'][0];

  const summaryHero = `
    <div class="summary-hero">
      <div class="summary-hero-trophy">🏆</div>
      <p class="summary-hero-label">2026 Bracket Challenge Picks</p>
      <h2 class="summary-hero-name">${state.name}</h2>
      ${champion
        ? `<p class="summary-hero-champion">${champion.flag} ${champion.name} to win it all!</p>`
        : `<p class="summary-hero-champion" style="color:var(--gray);font-size:14px">Bracket incomplete — return to finish your picks</p>`}
    </div>
  `;

  const groupsHtml = `
    <h3 class="summary-section-title">Group Stage Picks</h3>
    <div class="summary-groups-grid">
      ${Object.keys(GROUPS).map(letter => {
        const p = state.groupPicks[letter];
        return `
          <div class="summary-group-card">
            <div class="summary-group-letter">Group ${letter}</div>
            ${p?.first  ? `<div class="summary-pick-row"><span class="summary-rank">🥇</span><span class="summary-pick-flag">${p.first.flag}</span><span class="summary-pick-name">${p.first.name}</span></div>` : `<div class="summary-no-pick">1st — not picked</div>`}
            ${p?.second ? `<div class="summary-pick-row"><span class="summary-rank">🥈</span><span class="summary-pick-flag">${p.second.flag}</span><span class="summary-pick-name">${p.second.name}</span></div>` : `<div class="summary-no-pick">2nd — not picked</div>`}
          </div>
        `;
      }).join('')}
    </div>
  `;

  const bracketHtml = ROUNDS.filter(r => r !== 'r32').map(round => {
    const matches  = getRoundMatches(round);
    const picks    = state.bracketPicks[round];
    const anyPick  = picks.some(p => p);
    if (!anyPick) return '';

    return `
      <h3 class="summary-section-title">${ROUND_LABELS[round]}</h3>
      <div class="summary-bracket-grid">
        ${matches.map((m, i) => {
          const winner = picks[i];
          const loser  = winner ? (winner.name === m.home?.name ? m.away : m.home) : null;
          if (!winner) return '';
          return `
            <div class="summary-match-row">
              <div class="summary-match-round">${ROUND_LABELS[round]} · Match ${i + 1}</div>
              <div class="summary-match-winner">${winner.flag} ${winner.name} <span style="color:var(--green);margin-left:4px">✓</span></div>
              ${loser ? `<div class="summary-match-loser">${loser.flag} ${loser.name}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  document.getElementById('summaryContent').innerHTML = summaryHero + groupsHtml + bracketHtml;
}

document.getElementById('editPicksBtn').addEventListener('click', () => {
  showScreen('screen-bracket');
  renderBracketRound(state.currentBracketRound);
});

document.getElementById('newPickerBtn').addEventListener('click', () => {
  state = { name: '', groupPicks: {}, bracketPicks: {}, currentBracketRound: 'r32' };
  document.getElementById('nameInput').value = '';
  renderWelcome();
  showScreen('screen-welcome');
});

// =====================================================
// COUNTDOWN
// =====================================================

const KICKOFF = new Date('2026-06-11T18:00:00');

function updateCountdown() {
  const diff = KICKOFF - new Date();
  if (diff <= 0) {
    document.getElementById('countdown').classList.add('ended');
    ['days','hours','mins','secs'].forEach(id => {
      document.getElementById('cd-' + id).textContent = '00';
    });
    return;
  }
  document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// =====================================================
// NAV
// =====================================================

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

document.getElementById('hamburger').addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// =====================================================
// TOAST
// =====================================================

let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

// =====================================================
// GROUPS INFO VIEWER (read-only, below the fold)
// =====================================================

function renderGroupViewer(letter) {
  const data    = GROUPS[letter];
  const display = document.getElementById('groupDisplay');
  display.innerHTML = `
    <div class="group-header">
      <h3>Group ${letter}</h3>
      <span>4 Teams · Top 2 Advance</span>
    </div>
    <table class="group-table">
      <thead><tr>
        <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>PTS</th>
      </tr></thead>
      <tbody>
        ${data.teams.map(t => `
          <tr>
            <td><div class="team-cell">
              <span class="team-flag">${t.flag}</span>
              <div><div class="team-name">${t.name}</div><div class="team-conf">${t.conf}</div></div>
            </div></td>
            <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  display.style.animation = 'none';
  display.offsetHeight;
  display.style.animation = '';
}

document.getElementById('groupTabs').addEventListener('click', e => {
  const btn = e.target.closest('.group-tab');
  if (!btn) return;
  document.querySelectorAll('.group-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGroupViewer(btn.dataset.group);
});
renderGroupViewer('A');

// =====================================================
// VENUES
// =====================================================

(function renderVenues() {
  const countryNames = { us: '🇺🇸 United States', ca: '🇨🇦 Canada', mx: '🇲🇽 Mexico' };
  document.getElementById('venuesGrid').innerHTML = VENUES_DATA.map(v => `
    <div class="venue-card" data-country="${v.country}">
      <div class="venue-visual"><span>🏟️</span></div>
      <div class="venue-info">
        <p class="venue-country">${countryNames[v.country]}</p>
        <h3 class="venue-name">${v.name}</h3>
        <p class="venue-city">${v.city}</p>
        <span class="venue-capacity">🪑 ${v.capacity} · ${v.note}</span>
      </div>
    </div>
  `).join('');
})();

// =====================================================
// SCROLL REVEAL
// =====================================================

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card, .host-card, .venue-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// =====================================================
// INIT
// =====================================================

renderWelcome();
