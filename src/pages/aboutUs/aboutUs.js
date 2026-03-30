import "./aboutUs.css";
import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { useEffect, useRef } from "react";

const VALUES = [
  {
    num: "01",
    title: "Çmime Reale",
    desc: "Çmimi që sheh është çmimi që paguan. Pa shtesa të fshehura, pa tarifa të fundit minutës.",
    color: "#38bdf8",
  },
  {
    num: "02",
    title: "Flotë e Kontrolluar",
    desc: "Çdo makinë kalon inspektim teknik të rregullt. Siguria juaj nuk është opsion.",
    color: "#a78bfa",
  },
  {
    num: "03",
    title: "Proces i Thjeshtë",
    desc: "Rezervim në 3 minuta, dokumentacion minimal, konfirmim i çastit. Pa burokraci.",
    color: "#34d399",
  },
  {
    num: "04",
    title: "Mbështetje Njerëzore",
    desc: "Asistencë 24/7 me njerëz të vërtetë — jo bot, jo linja zile. Dikush gjithmonë përgjigjet.",
    color: "#fb923c",
  },
];

const STEPS = [
  { n: "01", title: "Zgjedh", desc: "Filtro sipas kategorisë, datës dhe buxhetit. Shiko çmimin final menjëherë." },
  { n: "02", title: "Konfirmo", desc: "Rezervo online brenda 3 minutave. Konfirmim automatik me email." },
  { n: "03", title: "Merr", desc: "Dorëzim në adresën tënde ose marrje nga pika jonë. Orari yt, rregullat tona." },
  { n: "04", title: "Udhëto", desc: "Makina e pastër, tanku i plotë, asistencë aktive. Fokusohu vetëm rrugës." },
];

const NUMBERS = [
  { value: "500+", label: "Makina aktive" },
  { value: "12k+", label: "Klientë" },
  { value: "8+",   label: "Vite në treg" },
  { value: "24/7", label: "Asistencë" },
];

export default function AboutUs() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".anim").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navigimi />
      <div className="ab-page" ref={ref}>

        {/* ── HERO ─────────────────────────────────── */}
        <section className="ab-hero">
          <div className="ab-hero__noise" />

          <div className="ab-hero__left anim">
            <span className="ab-label">Rreth nesh</span>
            <h1 className="ab-hero__h1">
              Lëvizje<br />
              <span className="ab-hero__stroke">pa kompromis</span>
            </h1>
            <p className="ab-hero__p">
              Ndërtuam këtë platformë për të eliminuar konfuzionin, kostot e fshehura
              dhe burokacinë nga qiraja e makinave. Çdo vendim teknik, çdo politikë
              çmimi, çdo detaj i procesit — ka qenë i menduar me synim: ta bëjmë
              sa më të thjeshtë për ju.
            </p>
            <div className="ab-hero__btns">
              <button className="ab-btn ab-btn--fill">Shiko Flotën</button>
              <button className="ab-btn ab-btn--outline">Rezervo Tani</button>
            </div>
          </div>

          <div className="ab-hero__right anim">
            <div className="ab-badge ab-badge--tl">Transparencë totale</div>
            <div className="ab-badge ab-badge--tr">Flotë moderne</div>
            <div className="ab-badge ab-badge--bl">Zero surpriza</div>
            <div className="ab-badge ab-badge--br">Asistencë 24/7</div>
            <div className="ab-hero__circle">
              <span>8+</span>
              <small>vite eksperiencë</small>
            </div>
          </div>
        </section>

        {/* ── NUMBERS ──────────────────────────────── */}
        <section className="ab-numbers">
          {NUMBERS.map((n, i) => (
            <div className="ab-number anim" key={i} style={{ animationDelay: `${i * 100}ms` }}>
              <span className="ab-number__val">{n.value}</span>
              <span className="ab-number__lbl">{n.label}</span>
            </div>
          ))}
        </section>

        {/* ── STORY ────────────────────────────────── */}
        <section className="ab-story">
          <div className="ab-story__tag anim">Historia jonë</div>
          <div className="ab-story__body">
            <h2 className="ab-story__h2 anim">
              Nga një ide e thjeshtë<br />deri tek platforma
            </h2>
            <div className="ab-story__text anim">
              <p>
                Gjithçka filloi kur vumë re se tregu i qirasë së makinave ishte i mbushur
                me çmime të paqarta, procese të ngadalta dhe shërbim të dobët pas-shitjes.
                Vendosëm të ndërtojmë diçka ndryshe — një sistem ku klienti ka kontroll të plotë.
              </p>
              <p>
                Sot kemi mbi 500 makina, mijëra klientë të kënaqur dhe një ekip që beson
                se çdo udhëtim meriton të fillojë mirë.
              </p>
            </div>
          </div>
        </section>

        {/* ── VALUES ───────────────────────────────── */}
        <section className="ab-values">
          <div className="ab-section-head anim">
            <span className="ab-label">Parimet tona</span>
            <h2>Çfarë na bën ndryshe</h2>
          </div>
          <div className="ab-values__grid">
            {VALUES.map((v, i) => (
              <div
                className="ab-vcard anim"
                key={i}
                style={{ "--c": v.color, animationDelay: `${i * 100}ms` }}
              >
                <span className="ab-vcard__num">{v.num}</span>
                <div className="ab-vcard__bar" />
                <h3 className="ab-vcard__title">{v.title}</h3>
                <p className="ab-vcard__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── QIRA & BLERJE-SHITJE ─────────────────── */}
        <section className="ab-dual">
          <div className="ab-dual__card ab-dual__card--rental anim">
            <span className="ab-dual__tag">Qira</span>
            <h3 className="ab-dual__h3">Makina me qira,<br />kushte të qarta</h3>
            <p className="ab-dual__p">
              Ditore, javore ose mujore — flotë moderne me çmime transparente,
              dorëzim në derë dhe asistencë 24/7 gjatë gjithë periudhës.
            </p>
            <ul className="ab-dual__list">
              <li>Rezervim online në 3 minuta</li>
              <li>Dorëzim në aeroport ose adresë</li>
              <li>Sigurim i përfshirë, zero surpriza</li>
            </ul>
            <button className="ab-btn ab-btn--fill">Shiko Flotën →</button>
          </div>

          <div className="ab-dual__divider" />

          <div className="ab-dual__card ab-dual__card--sale anim">
            <span className="ab-dual__tag ab-dual__tag--pink">Blerje & Shitje</span>
            <h3 className="ab-dual__h3">Blen ose shet<br />pa ndërmjetës</h3>
            <p className="ab-dual__p">
              Dëshiron të shesësh makinën? Ne vlerësojmë falas dhe blejmë brenda 24 orësh.
              Dëshiron të blesh? Çdo makinë e inspektuar dhe me çmim real.
            </p>
            <ul className="ab-dual__list">
              <li>Vlerësim falas, ofertë brenda 24h</li>
              <li>Pa komisione, pa ndërmjetës</li>
              <li>Dokumentacion dhe pagesë e sigurt</li>
            </ul>
            <button className="ab-btn ab-btn--outline ab-btn--pink">Shes Makinën →</button>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────── */}
        <section className="ab-how">
          <div className="ab-section-head anim">
            <span className="ab-label">Procesi</span>
            <h2>Si funksionon</h2>
          </div>
          <div className="ab-how__track">
            <div className="ab-how__line" />
            {STEPS.map((s, i) => (
              <div className="ab-step anim" key={i} style={{ animationDelay: `${i * 120}ms` }}>
                <div className="ab-step__dot" />
                <span className="ab-step__n">{s.n}</span>
                <h4 className="ab-step__title">{s.title}</h4>
                <p className="ab-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <section className="ab-cta anim">
          <div className="ab-cta__glow" />
          <h2 className="ab-cta__h2">Gati për të filluar?</h2>
          <p className="ab-cta__p">Shiko flotën dhe rezervo makinën e duhur për ju sot.</p>
          <button className="ab-btn ab-btn--fill ab-btn--lg">Fillo Rezervimin →</button>
        </section>

      </div>
      <Footer />
    </>
  );
}