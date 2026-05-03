import { type FormEvent, useEffect, useRef, useState } from 'react'
import poster from './assets/gordie-poster.png'

const rideStats = [
  { label: 'Start', value: 'Detroit, MI', detail: 'Hart Plaza, riverfront roll-out' },
  { label: 'Finish', value: 'Windsor, ON', detail: 'Caesar celebration zone' },
]

const expectations = [
  'Fully supported ride',
  'Route support & goofy shenanigans',
  'Mechanical support',
  'Post-ride party & Caesars',
  'Great people. Great cause. Great times.',
]

const goofyRules = [
  'Helmet hair encouraged',
  'Bridge vibes mandatory',
  'Legends ride at party pace',
  'Caesar mustaches optional',
]

function DetroitSkyline({ className = '' }: { className?: string }) {
  return (
    <div className={`detroit-skyline ${className}`.trim()} aria-hidden="true">
      <svg
        className="detroit-skyline-svg"
        preserveAspectRatio="xMidYMax meet"
        role="presentation"
        viewBox="0 0 1200 330"
      >
        <path className="skyline-glow" d="M0 230C180 188 317 209 488 176C691 137 861 154 1200 101V330H0Z" />
        <path className="skyline-river" d="M0 288H1200V330H0Z" />

        <g className="skyline-silhouette">
          <path d="M0 246H82V288H0Z" />
          <path d="M78 224H136V288H78Z" />
          <path d="M131 202H184V288H131Z" />

          <path className="one-detroit" d="M190 288V125L222 89L254 125V288Z" />
          <path className="one-detroit-spire" d="M222 89V38" />
          <path d="M266 182H318V288H266Z" />

          <path className="penobscot" d="M330 288V138H351V106H384V76H416V106H447V138H468V288Z" />
          <path className="penobscot-spire" d="M399 76V31" />
          <circle className="penobscot-beacon" cx="399" cy="28" r="7" />

          <path d="M480 166H550V288H480Z" />
          <path className="guardian" d="M557 288V150L595 126L633 150V288Z" />
          <path d="M640 196H690V288H640Z" />
          <path d="M688 176H738V288H688Z" />

          <g className="skyline-ren-cen">
            <rect x="746" y="116" width="58" height="172" rx="28" />
            <rect x="798" y="91" width="62" height="197" rx="31" />
            <rect className="ren-cen-center" x="853" y="47" width="76" height="241" rx="38" />
            <rect x="922" y="91" width="62" height="197" rx="31" />
            <rect x="978" y="116" width="58" height="172" rx="28" />
            <path className="ren-cen-spire" d="M891 47V8" />
            <circle className="ren-cen-beacon" cx="891" cy="8" r="8" />
            <text className="ren-cen-label" x="891" y="308" textAnchor="middle">
              REN CEN
            </text>
          </g>

          <path d="M1042 184H1092V288H1042Z" />
          <path d="M1088 211H1144V288H1088Z" />
          <path d="M1140 236H1200V288H1140Z" />
        </g>

        <g className="skyline-windows">
          <path d="M207 139H237M207 164H237M207 189H237M207 214H237M207 239H237" />
          <path d="M351 153H447M351 178H447M351 203H447M351 228H447M351 253H447" />
          <path d="M775 135V278M829 112V278M891 72V278M953 112V278M1007 135V278" />
          <path d="M861 83H921M861 114H921M861 145H921M861 176H921M861 207H921M861 238H921" />
          <path d="M574 162H616M574 188H616M574 214H616M574 240H616" />
        </g>
      </svg>
    </div>
  )
}

function App() {
  const [showIntro, setShowIntro] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [registration, setRegistration] = useState<{ email: string; name: string } | null>(null)
  const [showJumpScare, setShowJumpScare] = useState(false)
  const [jumpScareKey, setJumpScareKey] = useState(0)
  const jumpScareTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!showIntro) {
      return
    }

    const introTimer = window.setTimeout(() => setShowIntro(false), 4200)

    return () => window.clearTimeout(introTimer)
  }, [showIntro])

  useEffect(() => {
    return () => {
      if (jumpScareTimer.current !== null) {
        window.clearTimeout(jumpScareTimer.current)
      }
    }
  }, [])

  function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')

    if (
      typeof name !== 'string' ||
      name.trim().length === 0 ||
      typeof email !== 'string' ||
      email.trim().length === 0
    ) {
      throw new Error('Registration form submitted without a name or email.')
    }

    setRegistration({ email: email.trim(), name: name.trim() })
    event.currentTarget.reset()

    if (jumpScareTimer.current !== null) {
      window.clearTimeout(jumpScareTimer.current)
    }

    setJumpScareKey((key) => key + 1)
    setShowJumpScare(true)
    jumpScareTimer.current = window.setTimeout(() => setShowJumpScare(false), 1500)
  }

  return (
    <>
      {showIntro && (
        <div className="intro-screen" aria-label="Bike riding across the page" role="status">
          <DetroitSkyline className="intro-skyline" />
          <div className="intro-road" />
          <div className="intro-bike" aria-hidden="true">
            <svg viewBox="0 0 260 150" role="presentation">
              <circle className="intro-wheel" cx="62" cy="102" r="32" />
              <circle className="intro-wheel" cx="190" cy="102" r="32" />
              <path className="intro-frame" d="M62 102L103 50L133 102L91 102L117 70L156 70L190 102" />
              <path className="intro-frame" d="M103 50L153 50M148 38L166 38M91 102L79 58" />
              <g className="intro-gordie-face">
                <circle className="intro-face" cx="115" cy="23" r="18" />
                <path className="intro-helmet" d="M97 20C99 5 111 -2 127 5C136 10 137 21 133 27C123 17 111 15 97 20Z" />
                <text className="intro-nine" x="116" y="15" textAnchor="middle">
                  9
                </text>
                <path className="intro-brow" d="M104 24L111 22M121 22L128 24" />
                <circle className="intro-eye" cx="109" cy="27" r="2.2" />
                <circle className="intro-eye" cx="123" cy="27" r="2.2" />
                <path className="intro-nose" d="M117 28L114 35L120 35" />
                <path className="intro-smile" d="M106 39C113 45 124 45 131 38" />
              </g>
              <path className="intro-rider" d="M112 40L100 69L135 71L153 47" />
              <path className="intro-cape" d="M102 43C73 34 55 43 35 62C62 61 81 70 101 78Z" />
            </svg>
            <p>Pedaling to Windsor...</p>
          </div>
        </div>
      )}

      <main
        className={`main-content min-h-screen overflow-hidden bg-charcoal text-cream ${
          showIntro ? 'is-waiting' : 'is-visible'
        }`}
      >
      <section className="relative isolate px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(201,38,31,0.38),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(220,166,46,0.22),transparent_28%),linear-gradient(135deg,#171717,#050505_55%,#141414)]" />
        <div className="grain absolute inset-0 -z-10 opacity-45" />
        <DetroitSkyline />

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="brush -rotate-2 bg-black px-5 py-3 text-lg font-black uppercase tracking-wide text-white shadow-red">
                New bridge.
                <span className="block text-gold">New tradition.</span>
              </span>
              <span className="rounded-full border-2 border-gold bg-gold/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-gold">
                First annual
              </span>
            </div>

            <div>
              <p className="text-balance text-xl font-black uppercase tracking-[0.4em] text-red sm:text-2xl">
                Gordie Howe You Doing 2026
              </p>
              <h1 className="mt-3 max-w-5xl text-balance text-6xl font-black uppercase leading-[0.82] tracking-[-0.08em] text-white sm:text-8xl lg:text-[9.5rem]">
                Cycle to
                <span className="block text-red drop-shadow-[5px_5px_0_#000]">Windsor</span>
              </h1>
              <div className="mt-4 inline-flex -rotate-1 items-center gap-3 bg-gold px-5 py-2 text-2xl font-black uppercase tracking-[0.18em] text-black sm:text-4xl">
                Caesar Edition
              </div>
            </div>

            <p className="max-w-3xl text-balance border-y-4 border-red bg-red/90 px-5 py-4 text-2xl font-black italic leading-tight tracking-wide text-white shadow-red sm:text-4xl">
              Ride for fun. Ride for community. Ride like #9.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {rideStats.map((stat) => (
                <article
                  className="tilt rounded-3xl border-2 border-white/15 bg-white/8 p-5 shadow-black backdrop-blur"
                  key={stat.label}
                >
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-red">
                    {stat.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-black uppercase text-white">{stat.value}</h2>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-cream/70">
                    {stat.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-6 top-8 z-10 rotate-[-10deg] rounded-2xl bg-red px-5 py-3 text-center text-2xl font-black uppercase leading-none text-white shadow-red">
              Ride.
              <br />
              Caesar.
              <br />
              Repeat.
            </div>
            <div className="poster-pop relative rounded-[2rem] border-4 border-cream/80 bg-black p-3 shadow-2xl">
              <img
                src={poster}
                alt="Gordie Howe You Doing 2026 Cycle to Windsor Caesar Edition poster"
                className="aspect-[2/3] w-full rounded-[1.35rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-5 right-3 rotate-3 rounded-full border-4 border-black bg-gold px-6 py-4 text-center text-xl font-black uppercase text-black shadow-red">
              100 km-ish!
            </div>
          </aside>
        </div>
      </section>

      <section className="relative bg-cream px-5 py-12 text-black sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-4 bg-red" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] bg-black p-6 text-cream shadow-black">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-gold">Tribute ride</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
              A ride for everyone.
            </h2>
            <p className="mt-5 text-lg font-bold leading-relaxed text-cream/80">
              Big bridge energy, hockey-legend heart, and enough goofy community spirit to power a
              peloton across the river.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center text-sm font-black uppercase tracking-wide">
              {goofyRules.map((rule) => (
                <span className="rounded-2xl bg-white/10 px-3 py-4" key={rule}>
                  {rule}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-[2rem] border-4 border-black bg-red p-6 text-white shadow-black">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-gold">What to expect</p>
              <ul className="mt-5 space-y-4">
                {expectations.map((item) => (
                  <li className="flex gap-3 text-lg font-black uppercase leading-tight" key={item}>
                    <span className="text-gold">★</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="relative overflow-hidden rounded-[2rem] border-4 border-black bg-gold p-6 text-black shadow-black">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-red/40" />
              <p className="relative text-sm font-black uppercase tracking-[0.3em]">Get involved</p>
              <h2 className="relative mt-3 text-4xl font-black uppercase leading-none">
                Be like Gordie.
              </h2>
              <p className="relative mt-4 text-lg font-black uppercase leading-tight">
                Register, volunteer, cheer, donate, or just show up with maximum silly enthusiasm.
              </p>
              <form className="relative mt-6 space-y-3" onSubmit={handleRegistration}>
                <label className="block">
                  <span className="sr-only">Name</span>
                  <input
                    className="w-full rounded-xl border-4 border-black bg-cream px-4 py-3 text-lg font-black uppercase tracking-wide text-black placeholder:text-black/45 focus:outline-none focus:ring-4 focus:ring-red"
                    name="name"
                    placeholder="Your legendary name"
                    required
                    type="text"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Email</span>
                  <input
                    className="w-full rounded-xl border-4 border-black bg-cream px-4 py-3 text-lg font-black tracking-wide text-black placeholder:uppercase placeholder:text-black/45 focus:outline-none focus:ring-4 focus:ring-red"
                    name="email"
                    placeholder="email@ride.ca"
                    required
                    type="email"
                  />
                </label>
                <button
                  className="pedal-cta inline-flex w-full rotate-[-1deg] items-center justify-center rounded-xl bg-black px-5 py-3 text-lg font-black uppercase tracking-wide text-white transition hover:bg-red focus:outline-none focus:ring-4 focus:ring-red"
                  type="submit"
                >
                  Get me on the list
                </button>
              </form>
              {registration && (
                <p className="relative mt-4 rounded-2xl border-4 border-black bg-cream px-4 py-3 text-base font-black uppercase leading-tight text-black">
                  {registration.name}, you are unofficially-officially ready to roll. We will nudge{' '}
                  {registration.email} when registration opens.
                </p>
              )}
            </article>
          </div>
        </div>
      </section>

      <section className="bg-red py-5">
        <div className="marquee mx-auto max-w-7xl overflow-hidden whitespace-nowrap text-xl font-black uppercase italic tracking-wide text-white sm:text-2xl">
          <div className="marquee-track">
            <span>
              Strong on ice. Stronger together. Ring bells. Wear red. High-five safely. Be absurdly
              nice.
            </span>
            <span aria-hidden="true">
              Strong on ice. Stronger together. Ring bells. Wear red. High-five safely. Be absurdly
              nice.
            </span>
          </div>
        </div>
      </section>
      </main>
      {showJumpScare && (
        <div className="jump-scare" key={jumpScareKey} role="status" aria-live="polite">
          <div className="jump-rays" />
          <svg className="jump-face" viewBox="0 0 320 320" aria-hidden="true" role="presentation">
            <circle className="jump-face-shadow" cx="166" cy="166" r="128" />
            <circle className="jump-head" cx="160" cy="158" r="116" />
            <path
              className="jump-helmet"
              d="M50 150C54 58 125 17 210 46C258 62 283 103 274 154C222 109 134 96 50 150Z"
            />
            <text className="jump-nine" x="167" y="95" textAnchor="middle">
              9
            </text>
            <path className="jump-brows" d="M92 151L126 139M195 140L231 153" />
            <circle className="jump-eye" cx="112" cy="169" r="11" />
            <circle className="jump-eye" cx="211" cy="169" r="11" />
            <path className="jump-nose" d="M164 174L147 212L184 211" />
            <path className="jump-smile" d="M93 230C130 263 194 263 231 228" />
          </svg>
          <p>BOO! You made the roster!</p>
        </div>
      )}
    </>
  )
}

export default App
