import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import './App.css'
import './components/NumberGenerator.css'
import NumberGenerator from './components/NumberGenerator'

type TicketCell = number | null
type TicketGrid = TicketCell[][]

const COLUMN_RANGES: Array<[number, number]> = [
  [1, 9],
  [10, 19],
  [20, 29],
  [30, 39],
  [40, 49],
  [50, 59],
  [60, 69],
  [70, 79],
  [80, 90]
]

const ROW_COUNT = 3
const COLUMN_COUNT = 9
const NUMBERS_PER_TICKET = 15

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function getCombinations(items: number[], size: number): number[][] {
  const combinations: number[][] = []
  const current: number[] = []

  const backtrack = (start: number) => {
    if (current.length === size) {
      combinations.push([...current])
      return
    }
    for (let i = start; i < items.length; i++) {
      current.push(items[i])
      backtrack(i + 1)
      current.pop()
    }
  }

  backtrack(0)
  return combinations
}

function buildColumnCounts(): number[] {
  const counts = Array.from({ length: COLUMN_COUNT }, () => 1)
  let remaining = NUMBERS_PER_TICKET - COLUMN_COUNT

  while (remaining > 0) {
    const eligible = counts
      .map((count, index) => ({ count, index }))
      .filter(item => item.count < ROW_COUNT)
      .map(item => item.index)

    if (!eligible.length) {
      throw new Error('Unable to distribute ticket numbers across columns.')
    }

    const randomColumn = eligible[randomInt(0, eligible.length - 1)]
    counts[randomColumn] += 1
    remaining -= 1
  }

  return counts
}

function assignRowsForColumns(columnCounts: number[]): number[][] {
  const rowRemaining = [5, 5, 5]
  const columnRows: number[][] = Array.from({ length: COLUMN_COUNT }, () => [])

  const solve = (columnIndex: number): boolean => {
    if (columnIndex === COLUMN_COUNT) {
      return rowRemaining.every(count => count === 0)
    }

    const rowsAvailable = [0, 1, 2].filter(row => rowRemaining[row] > 0)
    const needed = columnCounts[columnIndex]
    const combinations = shuffle(getCombinations(rowsAvailable, needed))
    const remainingColumns = COLUMN_COUNT - (columnIndex + 1)

    for (const rows of combinations) {
      rows.forEach(row => {
        rowRemaining[row] -= 1
      })

      const canStillSolve = rowRemaining.every(
        value => value >= 0 && value <= remainingColumns
      )

      if (canStillSolve) {
        columnRows[columnIndex] = rows
        if (solve(columnIndex + 1)) {
          return true
        }
      }

      rows.forEach(row => {
        rowRemaining[row] += 1
      })
    }

    return false
  }

  if (!solve(0)) {
    throw new Error('Failed to build a valid row layout for this ticket.')
  }

  return columnRows
}

function pickColumnNumbers(columnIndex: number, count: number): number[] {
  const [min, max] = COLUMN_RANGES[columnIndex]
  const available: number[] = []

  for (let value = min; value <= max; value++) {
    available.push(value)
  }

  const selected = shuffle(available).slice(0, count).sort((a, b) => a - b)
  if (selected.length !== count) {
    throw new Error('Not enough numbers available for ticket column.')
  }
  return selected
}

function generateSingleTicket(): TicketGrid {
  const grid: TicketGrid = Array.from({ length: ROW_COUNT }, () =>
    Array.from({ length: COLUMN_COUNT }, () => null)
  )

  const columnCounts = buildColumnCounts()
  const rowsByColumn = assignRowsForColumns(columnCounts)

  for (let column = 0; column < COLUMN_COUNT; column++) {
    const rows = [...rowsByColumn[column]].sort((a, b) => a - b)
    const numbers = pickColumnNumbers(column, rows.length)

    rows.forEach((row, index) => {
      grid[row][column] = numbers[index]
    })
  }

  return grid
}

function TambolaTicketsPage() {
  const [ticketCountInput, setTicketCountInput] = useState('6')
  const [tickets, setTickets] = useState<TicketGrid[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateTickets = () => {
    const parsedCount = Number(ticketCountInput)
    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 100) {
      setErrorMessage('Enter a valid number of tickets between 1 and 100.')
      return
    }

    setErrorMessage('')
    setIsGenerating(true)

    window.setTimeout(() => {
      try {
        const nextTickets = Array.from({ length: parsedCount }, () => generateSingleTicket())
        setTickets(nextTickets)
      } catch {
        setErrorMessage('Could not generate tickets right now. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }, 200)
  }

  const printTickets = () => {
    if (!tickets.length) {
      setErrorMessage('Generate at least one ticket before printing/downloading.')
      return
    }
    window.print()
  }

  return (
    <div className="app">
      <header className="header" id="top">
        <h1 className="title">Tambola Tickets Generator</h1>
      </header>

      <section className="tool-section tickets-tool-page" id="ticket-tool">
        <div className="tickets-tool-shell">
          <div className="tickets-controls">
            <h2>Free Tambola Tickets Tool</h2>
            <p>
              Generate valid 3-row x 9-column housie tickets (15 numbers per ticket), print instantly,
              or save as PDF from your browser print dialog.
            </p>

            <div className="input-group">
              <label htmlFor="ticket-count-input" className="tickets-label">
                Number of Tickets
              </label>
              <input
                id="ticket-count-input"
                type="number"
                min={1}
                max={100}
                value={ticketCountInput}
                onChange={event => setTicketCountInput(event.target.value)}
                className="game-input"
                aria-label="Number of tickets to generate"
              />
            </div>

            <div className="tickets-actions">
              <button type="button" className="button" onClick={generateTickets} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Tickets'}
              </button>
              <button type="button" className="button button-accent" onClick={printTickets} disabled={isGenerating}>
                Print / Download PDF
              </button>
              <a href="/#tool" className="button button-secondary-link">
                Go to Number Generator
              </a>
            </div>

            {errorMessage ? <p className="tickets-error">{errorMessage}</p> : null}
          </div>

          <div className="tickets-preview">
            {!tickets.length && !isGenerating ? (
              <p className="tickets-placeholder">Generate tickets to preview, print, or download.</p>
            ) : null}

            <div className="tickets-grid">
              {tickets.map((ticket, ticketIndex) => (
                <article className="ticket-card" key={`ticket-${ticketIndex + 1}`}>
                  <h3>Ticket {ticketIndex + 1}</h3>
                  <table className="ticket-table">
                    <tbody>
                      {ticket.map((row, rowIndex) => (
                        <tr key={`row-${ticketIndex + 1}-${rowIndex + 1}`}>
                          {row.map((cell, colIndex) => (
                            <td key={`cell-${ticketIndex + 1}-${rowIndex + 1}-${colIndex + 1}`}>
                              {cell ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section tickets-seo-content" id="content">
        <div className="content-wrapper">
          <h2>Tambola Tickets: Origins, Design, and Play in the Housie Game</h2>
          <p>
            Okay, imagine the scene-chaotic living room, aunties with tambola tickets fanned out like poker pros, kids
            underfoot, and bam, &quot;Lines!&quot; echoes as some number drops. Tambola tickets? They&apos;re the soul of the
            housie game, that bingo-on-steroids we Indians can&apos;t quit. Diwali at my place in Jaipur? These cards turn
            grumpy relatives into hype beasts. Hunting free tambola tickets or printable tambola tickets for your next
            do? Stick around. I&apos;ll spill the beans on where they came from, what makes &apos;em tick, and yeah, how to
            cheat the odds without getting caught. Luck&apos;s fun, but who wants to lose every round?
          </p>
          <p>
            Why does it hook you? Pure adrenaline. 27 spots, numbers 1-90. Snag printable ones, yell calls, drama
            explodes. Old pics say it kicked off in colonial days. Details incoming.
          </p>

          <h3>Historical Evolution of Tambola Tickets</h3>
          <p>
            1920s. Brits dock in Mumbai, bored sailors peddle bingo. Locals grab it, tweak into tambola tickets by
            &apos;30s-bolder, cheaper than stiff UK cards. Flipped through Rajasthan fair posters once (uncle&apos;s attic
            goldmine); newsprint beasts yelling &quot;everyone wins!&quot;
          </p>
          <p>
            After &apos;47, boom-community halls packed for charity. Genius fusion or lazy fun? Take your pick. &apos;80s hit,
            machines churn printable tambola tickets, bye-bye wonky hands. Free tambola tickets online now?
            Game-changer. Anyone plays. Why still alive? Screams &quot;family glue,&quot; that&apos;s why. My neighbor&apos;s 80th?
            Packed house.
          </p>

          <h3>Anatomy of Standard Tambola Tickets</h3>
          <p>
            Grab one. 3x9 grid. 27 boxes. Left column 1-9. Next 10-19. Right? 81-90. Five nums per column, four
            empty. Sparse = suspense.
          </p>
          <p>
            Crisp print: black-white, fat fonts. Grandma-proof. I slap colors on for brats&apos; birthdays-stays fun. Some
            study says it hooks better. Duh.
          </p>

          <h3>Key Numbers and Patterns</h3>
          <p>
            &quot;90&quot;? House party over. &quot;1&quot; teases. Lines first, then crazy: letters, edges. Pros scan tambola tickets
            upfront for clusters. Works? Sorta. Stats nod yes. But gamble smart.
          </p>

          <h3>Variations and Modern Adaptations, Including Free Tambola Tickets</h3>
          <p>
            Plain Jane bore you? Wedding tambola tickets-doves, rings. Office? Boss roasts. Free tambola tickets?
            Sites dump &apos;em free; I hoard like Diwali sweets.
          </p>
          <p>
            COVID? Apps for virtual housie game. Zoom cheers, okay-ish. Paper wins. Speed it, reverse-chaos gold.
            <a href="https://example.com/party-games-event-planning-guide" target="_blank" rel="noreferrer">
              Event planning tips
            </a>{' '}
            save your ass.
          </p>

          <h3>Creating Printable Tambola Tickets at Home</h3>
          <p>
            Skip stores. Excel hack: =RANDBETWEEN(1,9) column 1, etc. Random magic. Print. Snip. Party.
          </p>

          <h3>Tools for Custom Housie Game Sheets</h3>
          <p>
            Canva rules printable tambola tickets-drag crap, theme, PDF. Code monkeys? Python + QR scanner. 300 DPI.
            Laminate for{' '}
            <a href="https://example.com/family-entertainment-games" target="_blank" rel="noreferrer">
              family game nights
            </a>{' '}
            reruns. Scrap test first, or ink hell.
          </p>
          <p>Oh, forgot: free templates everywhere. Tinker away.</p>

          <h3>Rules and Strategies for Winning with Tambola Tickets</h3>
          <p>
            Caller digs 1-90 bag. &quot;Kelly&apos;s Eye-one!&quot; &quot;Legs eleven!&quot; Dab quick. Full card? &quot;House!&quot; Peek? Booted.
          </p>
          <p>
            Edge it: mid-heavy tambola tickets (30-60). Callers crawl low-high. Log misses-late surges. Sims say
            nudge. Luck queen tho.{' '}
            <a href="https://example.com/diy-party-ideas-supplies" target="_blank" rel="noreferrer">
              DIY party supplies
            </a>{' '}
            kit it out.
          </p>
          <p>Uncle once palmed a number. Scandal. Don&apos;t.</p>

          <h3>Common Patterns and Caller Phrases</h3>
          <p>
            Line-any. Then corners, full columns. &quot;Two fat ladies-88!&quot; Childhood earworms. Housie game magic.
          </p>

          <h3>Cultural Significance and Global Spread</h3>
          <p>
            Jaipur Holi mela? Tambola tickets everywhere-kids vs nanis. Win? Dance-off. Lose? Blame bag. NRIs in
            London? &quot;Housie&quot; with vindaloo pots.
          </p>
          <p>
            Skill or bet? Courts shrug. Bonds us in{' '}
            <a href="https://example.com/indian-festivals-party-games" target="_blank" rel="noreferrer">
              traditional Indian festivals
            </a>
            . Pure gold.
          </p>
          <p>Weddings? Early icebreaker. Sangeet staple.</p>

          <h3>Resources for Free and Printable Tambola Tickets</h3>
          <p>
            Pinterest, TambolaKing-free tambola tickets PDFs flood. Check random fair; rigged suck. Shops bulk themes
            cheap.
          </p>
          <p>
            <a href="https://example.com/online-game-tools-bingo-tambola" target="_blank" rel="noreferrer">
              bingo-style number generator
            </a>
            ? Infinite. Backyard flop to epic bash. Go make memories.
          </p>

          <div className="tool-cross-link">
            <p>Ready to run your game?</p>
            <Link to="/" className="button button-accent">
              Open Tambola Number Generator
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-desktop">
          <a href="#tool" className="nav-link">Play Now</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#use-cases" className="nav-link">Use Cases</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </div>
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <a href="#tool" className="mobile-nav-link" onClick={closeMenu}>Play Now</a>
          <a href="#features" className="mobile-nav-link" onClick={closeMenu}>Features</a>
          <a href="#use-cases" className="mobile-nav-link" onClick={closeMenu}>Use Cases</a>
          <a href="#faq" className="mobile-nav-link" onClick={closeMenu}>FAQ</a>
        </div>
      </nav>

      {/* H1 Heading - Only One */}
      <header className="header" id="top">
        <h1 className="title">Tambola Number Generator 1-90</h1>
      </header>

      {/* Tool Section - Top */}
      <section className="tool-section" id="tool">
        <div className="tool-container">
          <NumberGenerator embedded={true} />
        </div>
      </section>

      {/* Content Section - 800-1000 words */}
      <section className="content-section" id="content">
        <div className="content-wrapper">
          <h2>Tambola Number Generator – Why Everyone's Playing It Online</h2>
          
          <p>
            If you've ever sat around a dining table covered in housie tickets while someone excitedly shouts numbers, you already know the magic of tambola. It's been a part of almost every Indian celebration — birthdays, housing society get-togethers, school fairs, family parties… you name it.
          </p>

          <p>
            The only thing that's changed over the years? The way we call the numbers. Where we once had little number tokens in a box, we now have what's called an <strong>online tambola number generator</strong> — a simple tool that calls numbers from <strong>1 to 90</strong> automatically. Same fun, no confusion.
          </p>

          <p>
            Whether you're planning a quick office game over Zoom, a school activity for kids, or just a chilled-out session with cousins on a Sunday night, this little tool can handle it all.
          </p>

          <hr />

          <h3>What Does a Tambola Number Generator Actually Do?</h3>

          <p>
            It does one thing — and does it perfectly. Every time you click or tap, it gives you a brand‑new number between 1 and 90. Once a number appears, it won't repeat. The screen usually shows all 90 numbers, so players can see which ones have been called already.
          </p>

          <p>
            Think of it as a smarter, more reliable version of the tambola bowl we used to shake for hours. There's no risk of forgetting which numbers were drawn. No cousin arguing that "You skipped 42." Everyone sees the same call at the same time.
          </p>

          <hr />

          <h3>Why People Prefer the Online Version</h3>

          <p>
            Let's be honest. Running tambola the old way was fun, but also messy. Someone had to call numbers, someone else had to note down claims, and it always ended with at least one argument about a missing chit.
            Now, all of that is automated.
          </p>

          <p>
            Here's why people love using an <strong>online tambola number generator 1–90</strong> today:
          </p>

          <ul>
            <li><strong>No setup stress:</strong> No chart, no pens, no loose paper.</li>
            <li><strong>Perfect for virtual presence:</strong> Works nicely on phones and laptops during calls.</li>
            <li><strong>Always fair:</strong> Every number is random — no bias, no repeats.</li>
            <li><strong>Easy for all ages:</strong> Grandparents, parents, and kids can play together.</li>
            <li><strong>Reusable:</strong> After one round, hit reset, and you're ready for another.</li>
          </ul>

          <p>
            A lot of schools, housing societies, and even offices started using this during lockdowns. But interestingly, even after everything reopened, people didn't stop. The ease just stuck.
          </p>

          <hr />

          <h3>For Teachers, Parents, and Event Hosts</h3>

          <p>
            If you've ever hosted tambola, you know it gets chaotic when you have more than 20 players. That's where the <strong>online tambola generator</strong> makes you look like a pro host. You just share your screen, click "Next," and that's it — your virtual calling board is ready.
          </p>

          <p>
            Teachers use it to teach numbers, patterns, or even probability. Kids stay hooked because it feels like play. Parents say it's a great way to engage kids after school without forcing them into worksheets.
          </p>

          <p>
            Event organizers? They absolutely love it. Vendor stalls can take longer to set up than an entire tambola game online.
          </p>

          <hr />

          <h3>Housie Ticket Generator – The Perfect Pair</h3>

          <p>
            A tambola game isn't complete without tickets. And that's where the <strong>housie ticket generator</strong> comes in handy. It creates digital tickets automatically — usually 3 rows with 15 numbers spread out, just like printed ones.
          </p>

          <p>
            You can share them over WhatsApp, or let guests print them if they prefer the old-school feel. Each ticket is unique, and there's no manual designing or printing headache. It's the ideal partner to the number generator. One handles the draw, the other handles the tickets. Simple teamwork!
          </p>

          <hr />

          <h3>Making the Game Feel Real</h3>

          <p>
            Some people assume that playing online takes away the liveliness of the game. In reality, it's all about <em>how you host it.</em>
            Add these small touches and it feels just as authentic:
          </p>

          <ul>
            <li>Play a light background track or a drum sound for each number call.</li>
            <li>Take pauses between draws so players have time to mark tickets.</li>
            <li>Add a few jokes — every tambola caller has to be a little dramatic, right?</li>
            <li>Keep small prizes for fun categories like "First Five," "Middle Row," or "Last Number."</li>
          </ul>

          <p>
            I've personally hosted tambola nights with relatives across five cities using just a free generator and a Zoom link. The amount of laughter that happens when everyone yells "Oh, I just missed it!" — it's the most comforting chaos.
          </p>

          <hr />

          <h3>Why Fair Play Matters</h3>

          <p>
            One big worry in traditional tambola was callers repeating a number or skipping one. Online tools remove that worry entirely. The generator uses randomization logic — that's just a fancy way of saying every number has the same chance of being picked. Once called, it's locked out for that round.
          </p>

          <p>
            Everyone sees the same number, so there's no confusion, and the whole thing feels transparent. That fair play is why schools, companies, and communities are sticking with it.
          </p>

          <hr />

          <h3>More Than a Game—It's a Connection</h3>

          <p>
            Over the last few years, tambola quietly turned into a way for people to stay connected. Families who live in different states often play a game or two on weekends. Teachers use it to break long online lessons. Even office HR teams run short tambola sessions during team meets to lighten the mood.
          </p>

          <p>
            It may be digital now, but the feeling hasn't changed one bit. It's still that same mix of anticipation, laughter, and small victories that make tambola so addictive.
          </p>

          <hr />

          <h3>Blending Old-School & New-School</h3>

          <p>
            Some people like the hybrid approach — they print out old-style tickets but use the <strong>online tambola number generator</strong> for calling. That way, you get the best of both worlds — a pinch of nostalgia, mixed with a dash of tech comfort.
          </p>

          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Traditional Tambola</th>
                <th>Online Tambola</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Setup</td>
                <td>Requires board, chits</td>
                <td>Just click "Start"</td>
              </tr>
              <tr>
                <td>Fairness</td>
                <td>Depends on caller</td>
                <td>Completely random</td>
              </tr>
              <tr>
                <td>Replay</td>
                <td>Manual reset</td>
                <td>One-click replay</td>
              </tr>
              <tr>
                <td>Players</td>
                <td>Limited by room size</td>
                <td>Unlimited online</td>
              </tr>
              <tr>
                <td>Energy</td>
                <td>Loud laughter</td>
                <td>Loud laughter + emojis!</td>
              </tr>
            </tbody>
          </table>

          <p>
            No matter the version, tambola still does what it always did best — bring people together for an hour or two of easy fun.
          </p>

          <hr />

          <h3>A Handy Tool for Learning Too</h3>

          <p>
            Teachers have found creative ways to use tambola to teach counting, vocabulary, or quick maths. Imagine a game where numbers are replaced by shapes, countries, or even new words. It keeps the students guessing while learning, which is much more effective than a textbook drill.
          </p>

          <p>
            This is also why a <strong>tambola number generator online</strong> has slowly become part of several school lesson plans and workshops — simple, interactive, and inclusive.
          </p>

          <hr />

          <h3>Building Your Own</h3>

          <p>
            If you like coding, building a number generator from scratch can be a fun pet project. You can make one using JavaScript in under an hour. React or Firebase can add extra features like real-time number sync across players.
          </p>

          <p>
            It's one of those projects that's easy to build yet brings joy to everyone who uses it. A lot of indie developers make their own tambola tools and gift them to families or schools.
          </p>

          <hr />

          <h3>Where Tambola Is Heading</h3>

          <p>
            Tambola's not going anywhere. The format might evolve — maybe soon we'll see smart assistants like Alexa acting as our caller or custom versions for festivals. But the heart of it will remain the same: shared excitement and connection.
          </p>

          <p>
            It's simple entertainment, powered by community spirit — and that's probably why tambola has survived across generations and cities.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-wrapper">
          <h2 className="section-title">Key Features of Our Tambola Platform</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎲</div>
              <h3>Instant Ticket Generation</h3>
              <p>Generate valid tambola tickets instantly with our algorithm that ensures proper number distribution and fair gameplay.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <h3>Multiplayer Rooms</h3>
              <p>Create or join game rooms to play with friends and family in real-time, no matter where they are located.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Mobile Responsive</h3>
              <p>Play tambola on any device—desktop, tablet, or mobile phone. Our responsive design ensures optimal experience everywhere.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Smooth</h3>
              <p>Lightning-fast ticket generation and seamless gameplay with no lag or interruptions for the best gaming experience.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>Auto Pattern Detection</h3>
              <p>Automatic detection of winning patterns including Early Five, Top Row, Middle Row, Bottom Row, and Full House.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your games and data are secure. Private room codes ensure only invited players can join your sessions.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful Interface</h3>
              <p>Enjoy a visually stunning interface with smooth animations and an intuitive design that enhances your gaming experience.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🆓</div>
              <h3>Completely Free</h3>
              <p>No registration required, no hidden fees. Start playing tambola immediately without any barriers or restrictions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section" id="use-cases">
        <div className="section-wrapper">
          <h2 className="section-title">Perfect For Every Occasion</h2>
          <div className="use-cases-grid">
            <div className="use-case-card">
              <h3>Family Gatherings</h3>
              <p>Bring generations together with tambola games during family reunions, holidays, and special celebrations. Perfect for creating lasting memories and friendly competition.</p>
            </div>
            <div className="use-case-card">
              <h3>Corporate Events</h3>
              <p>Break the ice at team building events, office parties, and corporate celebrations. Tambola encourages interaction and creates a fun, relaxed atmosphere.</p>
            </div>
            <div className="use-case-card">
              <h3>Virtual Parties</h3>
              <p>Connect with friends and family online through virtual tambola sessions. Perfect for long-distance relationships and maintaining social connections.</p>
            </div>
            <div className="use-case-card">
              <h3>Educational Settings</h3>
              <p>Teachers and educators use tambola to make learning numbers fun and engaging for students while developing cognitive skills.</p>
            </div>
            <div className="use-case-card">
              <h3>Community Events</h3>
              <p>Organize community tambola games for festivals, fundraisers, and neighborhood gatherings. Easy to set up and manage for large groups.</p>
            </div>
            <div className="use-case-card">
              <h3>Senior Centers</h3>
              <p>Provide cognitive stimulation and social interaction for seniors. Tambola helps maintain mental agility while fostering community connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="section-wrapper">
          <h2 className="section-title">FAQ: Your Tambola Questions Answered</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3 className="faq-question">What exactly is an online tambola number generator?</h3>
              <p className="faq-answer">It's a simple web tool that calls out tambola numbers (1 to 90) for you. Instead of shaking a bowl of chits or calling manually, you just click and a random number pops up on screen. Works great on phone or laptop—no boards or papers needed.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How does it work?</h3>
              <p className="faq-answer">You start the game, hit "Next," and it picks a number from 1–90 that hasn't come up before. It keeps track of everything automatically so there's no confusion about what was already called. Super straightforward.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is it really fair?</h3>
              <p className="faq-answer">Yes, 100%. The computer uses random selection, so every number has the same shot. No repeats, no favoritism—everyone can see the calls live and trust the process.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can teachers use it in class?</h3>
              <p className="faq-answer">Definitely! Many teachers do. It's perfect for teaching numbers, probability, or even quick math drills. Kids stay engaged because it feels like a game, not a lesson.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What's a housie ticket generator?</h3>
              <p className="faq-answer">That's the tool that makes your tambola tickets. It creates unique tickets automatically—right layout, right number spread. Pair it with the number generator, and you have a full digital tambola setup ready to go.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is it free?</h3>
              <p className="faq-answer">Most of them are completely free. Just open in your browser—no downloads, no signups. Some have fancy paid features like custom sounds, but the basic generator works fine.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I play with friends online?</h3>
              <p className="faq-answer">Absolutely. Share your screen on Zoom, Meet, or Teams while you run the <strong>online tambola number generator</strong>. Friends mark their tickets (digital or printed) as numbers appear. Works like magic.</p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Why switch from manual tambola?</h3>
              <p className="faq-answer">Less hassle, no arguments, works anywhere. You save time on setup and cleanup, and it's perfect for people in different cities. Great for family events, office fun, or school activities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Tambola Game. Play the classic number game online for free.</p>
          <div className="footer-links">
            <a href="#top" className="footer-link">Back to Top</a>
            <a href="#tool" className="footer-link">Play Now</a>
            <a href="#features" className="footer-link">Features</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tambola-tickets-generator" element={<TambolaTicketsPage />} />
      </Routes>
      <ScrollToTop />
    </>
  )
}

export default App
