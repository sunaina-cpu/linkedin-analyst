// app/api/download/route.js
// Returns a self-contained HTML file of the brief — no external deps at runtime.

const DUMMY_DATA = {
  client: 'Sunaina (Social Sparkx)',
  clientShort: 'Sunaina',
  post: `lots of dm's asking from my last couple of posts on what its like to work in the same industry as my wife Hannah, especially startup life

1. it's amazing, we are both sickos about work and love it. we love working. we talk about work all the time. we sit next to each other in the living room and explore projects on weekends - often

2. without hannah understanding dtcmvp and the idea, it wouldve never happened. she supported me when i was getting this off the ground. i could never have taken the solopreneur leap without her, financially/emotionally/several reasons.

3. we are homebodies and we're both fake outgoing. so getting to travel to events with your wife makes them 100x better. she's also better with clients than i am.

both being in the same industry, both startups, 1 + 1 = 3`,
  generatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  sections: [
    {
      num: '01',
      title: 'Hook mechanics',
      rawTitle: '1. HOOK MECHANICS',
      content: [
        {
          label: 'Hook type',
          text: 'Curiosity and social proof trigger. He opens by citing DM volume, which signals that people are already invested and asking. The reader feels like they are getting access to a private answer being shared publicly for the first time.',
        },
        {
          label: 'Emotional trigger',
          text: 'Intimacy and permission. "Lots of DMs asking" gives the reader social cover to be curious about something they would normally consider too personal to ask about.',
        },
        {
          label: 'Open loop',
          text: 'The framing sets up an implicit question: is it actually a good idea to work alongside your partner? The reader scrolls to find out if the answer is yes or complicated.',
        },
        {
          label: 'Why it works',
          text: 'It opens with a list but immediately breaks the corporate list format by being confessional and specific. "We are both sickos about work" in point 1 is disarming. You do not expect that word from a founder post. It resets expectations fast.',
        },
        {
          label: 'What would kill it',
          text: 'Any attempt to make this polished. The grammar is intentionally loose, the capitalisation is minimal, the vulnerability is unguarded. Tightening it would kill the authenticity signal that makes it land.',
        },
      ],
    },
    {
      num: '02',
      title: 'Narrative arc',
      rawTitle: '2. NARRATIVE ARC',
      content: [
        {
          label: 'Arc type',
          text: 'Confession arc with a belief reversal at the centre.',
        },
        {
          label: 'Story beats',
          text: 'Opens with warmth and specificity (we work together, we love it), moves into debt acknowledgment (she made this possible, not me alone), then pivots to the real payload: the writer used to believe partnership was a career drag. The final lines reframe that belief entirely.',
        },
        {
          label: 'Tension point',
          text: '"I spent most of adult life assuming I would go a lot faster and farther in my career solo." That sentence is the hinge. It names the assumption most driven founders quietly hold and admits it was wrong.',
        },
        {
          label: 'Resolution',
          text: 'Not a neat bow. The formula "1 + 1 = 3" lands as earned math, not a cliche, because 400 words of specific evidence precede it.',
        },
      ],
    },
    {
      num: '03',
      title: 'Pacing and rhythm',
      rawTitle: '3. PACING AND RHYTHM',
      content: [
        {
          label: 'Rhythm type',
          text: 'Conversational decompression. The numbered list at the top moves fast, each point short and punchy. Then the post opens up into longer prose paragraphs for the emotional pivot. The reader is pulled through two speeds deliberately.',
        },
        {
          label: 'Line break logic',
          text: 'The numbered section uses compression to signal efficiency. The unpacked paragraphs below signal: this part matters more, slow down.',
        },
        {
          label: 'Sentence pattern',
          text: 'Subject-verb-object, no subordinate clauses, no hedging. "She is also better with clients than I am" is 9 words. "I honestly could not have been more wrong about it" is a confession without softening. Every sentence commits.',
        },
      ],
    },
    {
      num: '04',
      title: 'Psychological journey',
      rawTitle: '4. PSYCHOLOGICAL JOURNEY',
      content: [
        {
          label: 'Emotional payoff',
          text: 'The reader arrives at the end feeling seen if they are a driven person who privately worries that ambition and partnership are in conflict. The post names that fear directly and then dismantles it with lived evidence, not advice.',
        },
        {
          label: 'Identity trigger',
          text: 'This speaks to the "I work differently from everyone else" founder identity. It validates that identity while adding a plot twist: the loner founder myth has a ceiling. The post does not moralize. It just reports what happened and lets the reader do the math.',
        },
      ],
    },
    {
      num: '05',
      title: 'Steal vs adapt',
      rawTitle: '5. STEAL VS ADAPT',
      steal: 'The belief reversal structure. State what you used to think, then show exactly when and why you found out you were wrong. No softening, no transition phrases.',
      adapt: 'The numbered list opener works well for Sunaina\'s voice but needs more punch per line. The cultural specificity of her audience means the community ending should name who she\'s talking to directly, not keep it broad.',
      noCopy: 'The low-energy grammar and minimal punctuation style. That reads as authentic for a male solo founder voice. For Sunaina\'s brand it would read as unfinished. Her boldness needs to feel intentional, not accidental.',
      summary: 'Steal the confession arc and the belief reversal — place the old assumption front and center before revealing what changed. Punch up the numbered points so each one has a sharp, specific image rather than a soft opener. Close by turning it outward to her community, naming the type of person she\'s speaking to directly.',
    },
  ],
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderSection(section) {
  const isSteal = section.rawTitle === '5. STEAL VS ADAPT'

  if (isSteal) {
    return `
      <div class="section-card">
        <div class="section-head" onclick="toggle(this)">
          <span class="sec-num">${escHtml(section.num)}</span>
          <span class="sec-title">${escHtml(section.title)}</span>
          <span class="chevron">&#9662;</span>
        </div>
        <div class="section-body steal-body">
          <div class="steal-grid">
            <div class="steal-card">
              <span class="slabel">Steal directly</span>
              <p>${escHtml(section.steal)}</p>
            </div>
            <div class="steal-card">
              <span class="slabel">What to adapt</span>
              <p>${escHtml(section.adapt)}</p>
            </div>
          </div>
          <div class="steal-card no-copy">
            <span class="slabel danger-label">Do not copy</span>
            <p>${escHtml(section.noCopy)}</p>
          </div>
          <div class="writer-box">
            <span class="slabel writer-label">3-sentence writer summary</span>
            <p class="writer-text">${escHtml(section.summary)}</p>
          </div>
        </div>
      </div>`
  }

  const paras = section.content.map(item => `
    <span class="inline-label">${escHtml(item.label)}</span>
    <p class="body-para">${escHtml(item.text)}</p>
  `).join('')

  return `
    <div class="section-card">
      <div class="section-head" onclick="toggle(this)">
        <span class="sec-num">${escHtml(section.num)}</span>
        <span class="sec-title">${escHtml(section.title)}</span>
        <span class="chevron">&#9662;</span>
      </div>
      <div class="section-body">${paras}</div>
    </div>`
}

function buildHtml(data) {
  const sectionsHtml = data.sections.map(renderSection).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Brief — ${escHtml(data.clientShort)} / GroundAI</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#f5f2ed;--black:#0d0d0d;--white:#fff;
    --accent:#e8420a;--accent2:#ff6b3d;
    --muted:#8a857e;--border:rgba(13,13,13,.13);
    --surface:#fff;--surface2:#efeae3;
    --mono:'DM Mono',monospace;
    --display:'Syne',sans-serif;
    --body:'Newsreader',Georgia,serif;
  }
  html,body{background:var(--bg);color:var(--black);font-family:var(--body);font-size:16px;line-height:1.7;min-height:100vh}
  .shell{display:grid;grid-template-columns:240px 1fr;min-height:100vh}

  /* Sidebar */
  .sidebar{background:var(--black);padding:32px 22px;display:flex;flex-direction:column;gap:28px;position:sticky;top:0;height:100vh;overflow-y:auto}
  .logo{font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent2)}
  .sidebar-title{font-family:var(--display);font-size:20px;font-weight:800;line-height:1.15;color:#fff;letter-spacing:-.02em}
  .sidebar-title em{font-style:normal;color:var(--accent2)}
  .sidebar-sub{font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.38);line-height:1.55;margin-top:8px}
  .clients-label{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent2);margin-bottom:10px}
  .clients{display:flex;flex-direction:column;gap:6px}
  .cbtn{width:100%;text-align:left;padding:10px 12px;border-radius:4px;border:1px solid rgba(255,255,255,.1);background:transparent;cursor:pointer;transition:all .14s}
  .cbtn:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.25)}
  .cbtn.active{background:var(--accent);border-color:var(--accent)}
  .cname{display:block;font-family:var(--display);font-size:13px;font-weight:700;color:#fff;letter-spacing:-.01em}
  .cvoice{display:block;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.38);line-height:1.4;margin-top:2px}
  .cbtn.active .cvoice{color:rgba(255,255,255,.75)}
  .sidebar-foot{margin-top:auto;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.15);padding-top:16px;border-top:1px solid rgba(255,255,255,.06);line-height:1.6}

  /* Main */
  .main{padding:44px 52px;background:var(--bg)}
  .main-head{margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid var(--border)}
  .main-head h2{font-family:var(--display);font-size:26px;font-weight:800;letter-spacing:-.02em;margin-bottom:4px}
  .main-head p{font-family:var(--mono);font-size:12px;color:var(--muted)}

  /* Original post */
  .post-block{background:var(--black);border-radius:6px;padding:28px 32px;margin-bottom:36px;position:relative;overflow:hidden}
  .post-block::before{content:'"';font-family:var(--display);font-size:100px;font-weight:800;color:var(--accent);position:absolute;top:-10px;right:20px;line-height:1;opacity:.5;pointer-events:none}
  .post-label{font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent2);display:block;margin-bottom:14px}
  .post-text{font-size:14px;line-height:1.7;color:rgba(245,242,237,.82);white-space:pre-wrap;position:relative;z-index:1}

  /* Results header */
  .results-head{display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border)}
  .results-head h3{font-family:var(--display);font-size:17px;font-weight:700;letter-spacing:-.01em}
  .results-badge{font-family:var(--mono);font-size:10px;padding:3px 10px;background:var(--accent);color:#fff;border-radius:2px;letter-spacing:.06em;text-transform:uppercase}

  /* Section cards */
  .section-card{background:var(--surface);border:1px solid var(--border);border-radius:6px;margin-bottom:10px;overflow:hidden}
  .section-head{display:flex;align-items:center;gap:16px;padding:14px 20px;cursor:pointer;background:var(--surface);border-bottom:1px solid var(--border);user-select:none;transition:background .1s}
  .section-head:hover{background:var(--surface2)}
  .sec-num{font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--accent);min-width:20px}
  .sec-title{font-family:var(--display);font-size:14px;font-weight:700;flex:1;letter-spacing:-.01em}
  .chevron{font-size:11px;color:var(--muted);transition:transform .2s}
  .section-card.collapsed .chevron{transform:rotate(-90deg)}
  .section-card.collapsed .section-body{display:none}
  .section-body{padding:18px 20px 20px 56px}
  .steal-body{padding:18px 20px 20px 20px}
  .inline-label{font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:4px;margin-top:16px}
  .inline-label:first-child{margin-top:0}
  .body-para{font-size:14.5px;line-height:1.75;color:#2a2825;margin-bottom:0}

  /* Steal cards */
  .steal-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
  .steal-card{background:var(--surface2);border-radius:4px;padding:14px 16px;margin-bottom:0}
  .steal-card p{font-size:13px;line-height:1.65}
  .no-copy{background:#fdf0ec;border-left:3px solid var(--accent);margin-bottom:10px}
  .slabel{font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px}
  .danger-label{color:var(--accent)}
  .writer-box{background:var(--black);border-radius:4px;padding:20px 22px}
  .writer-label{color:var(--accent2)}
  .writer-text{font-size:14px;line-height:1.7;color:rgba(255,255,255,.82)}

  /* Footer */
  .doc-footer{margin-top:56px;padding-top:20px;border-top:1.5px solid var(--black);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
  .doc-footer .brand{font-family:var(--display);font-size:13px;font-weight:700}
  .doc-footer .date{font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:.04em}

  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  .section-card{animation:fadeUp .3s ease both}

  @media(max-width:640px){
    .shell{grid-template-columns:1fr}
    .sidebar{position:static;height:auto}
    .main{padding:28px 20px}
    .steal-grid{grid-template-columns:1fr}
  }
  @media print{
    .sidebar{display:none}
    .shell{grid-template-columns:1fr}
  }
</style>
</head>
<body>
<div class="shell">

  <aside class="sidebar">
    <div class="logo">GroundAI</div>
    <div>
      <div class="sidebar-title">Post <em>Analyst</em></div>
      <div class="sidebar-sub">5-section ghostwriter brief, tailored per client.</div>
    </div>
    <div>
      <div class="clients-label">Clients</div>
      <div class="clients">
        <button class="cbtn ${data.clientShort === 'Jaden' ? 'active' : ''}">
          <span class="cname">Jaden</span>
          <span class="cvoice">Direct · Visionary · Manifesto</span>
        </button>
        <button class="cbtn ${data.clientShort === 'Huang Li' ? 'active' : ''}">
          <span class="cname">Huang Li</span>
          <span class="cvoice">Reflective · Warm · Prose-first</span>
        </button>
        <button class="cbtn ${data.clientShort === 'Leo' ? 'active' : ''}">
          <span class="cname">Leo</span>
          <span class="cvoice">Product · Dramatic · Customer stories</span>
        </button>
        <button class="cbtn ${data.clientShort === 'Sunaina' ? 'active' : ''}">
          <span class="cname">Sunaina</span>
          <span class="cvoice">Bold · Punchy · Community</span>
        </button>
      </div>
    </div>
    <div class="sidebar-foot">GroundAI · Content Engine v2.3</div>
  </aside>

  <main class="main">
    <div class="main-head">
      <h2>Ghostwriter brief</h2>
      <p>${escHtml(data.client)} &nbsp;·&nbsp; ${escHtml(data.generatedAt)}</p>
    </div>

    <div class="post-block">
      <span class="post-label">Post analysed</span>
      <div class="post-text">${escHtml(data.post)}</div>
    </div>

    <div class="results-head">
      <h3>5-section brief</h3>
      <span class="results-badge">${escHtml(data.clientShort)}</span>
    </div>

    ${sectionsHtml}

    <div class="doc-footer">
      <span class="brand">GroundAI / Social Sparkx</span>
      <span class="date">Generated ${escHtml(data.generatedAt)}</span>
    </div>
  </main>
</div>

<script>
  function toggle(head) {
    head.parentElement.classList.toggle('collapsed')
  }
</script>
</body>
</html>`
}

export async function GET() {
  const html = buildHtml(DUMMY_DATA)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'attachment; filename="groundai-brief-sunaina.html"',
      'Cache-Control': 'no-cache',
    },
  })
}
