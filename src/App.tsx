import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import './App.css'
import './components/NumberGenerator.css'
import NumberGenerator from './components/NumberGenerator'

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
      </Routes>
      <ScrollToTop />
    </>
  )
}

export default App
