import Footer from '../../components/footer/footer';
import Navigimi from '../../components/navbar/navbar';
import './services.css';
import { useEffect, useRef } from 'react';

const categories = [
  {
    id: 'qira',
    label: 'Qira',
    icon: '🚗',
    color: '#38bdf8',
    services: [
      {
        title: 'Qira Afatshkurtër',
        desc: 'Makina ditore dhe javore për lëvizje urbane, udhëtime turistike dhe nevoja të papritura. Rezervim i menjëhershëm, marrje në 30 minuta.',
        badge: 'Popullore',
      },
      {
        title: 'Qira Afatgjatë',
        desc: 'Kontrata mujore dhe vjetore për individë dhe biznese. Çmime preferenciale, mirëmbajtje e përfshirë dhe zëvendësim makine pa kosto.',
      },
      {
        title: 'Qira me Shofer',
        desc: 'Shërbim premium për evente, takime biznesi dhe transport VIP. Shoferë profesionistë, diskrecion i garantuar.',
        badge: 'Premium',
      },
      {
        title: 'Flotë e Segmentuar',
        desc: 'Ekonomike për qytet, SUV për terren, luksoze për impresion. Zgjidhni kategorinë që i përshtatet udhëtimit tuaj.',
      },
    ],
  },
  {
    id: 'logjistike',
    label: 'Logjistikë',
    icon: '📍',
    color: '#a78bfa',
    services: [
      {
        title: 'Dorëzim në Derë',
        desc: 'Sjellim makinën direkt tek ju — aeroport, hotel, zyrë ose adresë private. Pa humbje kohe, pa linja pritjeje.',
        badge: 'I ri',
      },
      {
        title: 'Marrje Fleksibël',
        desc: 'Ktheni makinën në çdo pikë të rrjetit tonë. Orë të zgjeruara marrje, 7 ditë në javë.',
      },
      {
        title: 'Rezervim Online 24/7',
        desc: 'Platforma jonë ju lejon të zgjidhni datën, orën, vendndodhjen dhe kategorinë e makinës — me konfirmim të çastit.',
      },
      {
        title: 'Turizëm & Ture',
        desc: 'Paketa speciale për turistë: makina me GPS, harta offline dhe rekomandime lokale të personalizuara.',
      },
    ],
  },
  {
    id: 'mbrojtje',
    label: 'Mbrojtje',
    icon: '🛡',
    color: '#34d399',
    services: [
      {
        title: 'Siguracione të Plota',
        desc: 'Sigurimi bazë është i përfshirë në çdo rezervim. Opsione shtesë: zero franshizë, mbrojtje e gomave, xhami dhe pasagjerëve.',
      },
      {
        title: 'Asistencë 24/7',
        desc: 'Ekip në dispozicion çdo orë për avari, aksidente ose pyetje gjatë periudhës së qirasë. Zëvendësim brenda 2 orësh.',
        badge: 'Gjithmonë aktiv',
      },
      {
        title: 'Pa Depozitë / Depozitë e Ulët',
        desc: 'Kushte financiare fleksibël pa bllokime kapitali. Alternativë për klientë pa kartë krediti.',
      },
      {
        title: 'Anulim Falas',
        desc: 'Ndryshoni ose anuloni rezervimin tuaj pa penalitete deri 24 orë para marrjes. Rimbursim i plotë i garantuar.',
      },
    ],
  },
  {
    id: 'biznese',
    label: 'Biznese',
    icon: '💼',
    color: '#fb923c',
    services: [
      {
        title: 'Kontrata Korporative',
        desc: 'Çmime të personalizuara për biznese me nevoja të rregullta. Faturim mujor, menaxher llogarie i dedikuar.',
        badge: 'B2B',
      },
      {
        title: 'Pagesa të Sigurta',
        desc: 'Cash, kartë debiti/krediti, transfertë bankare dhe faturë elektronike. Procese të certifikuara dhe të sigurta.',
      },
      {
        title: 'Çmime Transparente',
        desc: 'Çmimi që shihni është çmimi që paguani. Pa kosto të fshehura, pa tarifa shtesë të papritura.',
      },
      {
        title: 'Mbështetje Shumëgjuhëshe',
        desc: 'Stafi ynë flet shqip, anglisht dhe italisht. Dokumentacion i thjeshtuar për turistë dhe klientë të huaj.',
      },
    ],
  },
  {
    id: 'blerje-shitje',
    label: 'Blerje & Shitje',
    icon: '🤝',
    color: '#f472b6',
    services: [
      {
        title: 'Blerje Makine',
        desc: 'Shfletoni flotën tonë të makinave për shitje. Çdo makinë vjen me histori shërbimi, inspektim teknik dhe çmim transparent.',
        badge: 'Disponibël tani',
      },
      {
        title: 'Shes Makinën Time',
        desc: 'Plotësoni formularin, ne vlerësojmë makinën tuaj falas dhe ju bëjmë ofertë brenda 24 orësh. Pa ndërmjetës, pa komisione.',
        badge: 'Falas',
      },
      {
        title: 'Vlerësim i Drejtpërdrejtë',
        desc: 'Ekipi ynë teknik inspekton makinën tuaj dhe ju jep një çmim real bazuar në tregun aktual. Pa surpriza, pa zbritje arbitrare.',
      },
      {
        title: 'Transfer i Sigurt',
        desc: 'Dokumentacion i plotë ligjor, pagesë e menjëhershme dhe transferim pronësie i garantuar. E shpejtë, e sigurt, e dokumentuar.',
      },
    ],
  },
];

const stats = [
  { value: '500+', label: 'Makina në flotë' },
  { value: '12k+', label: 'Klientë të kënaqur' },
  { value: '24/7', label: 'Asistencë aktive' },
  { value: '8+', label: 'Vite eksperiencë' },
];

function useIntersection(ref, options = {}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, ...options }
    );

    const el = ref.current;
    if (el) {
      const items = el.querySelectorAll('.reveal');
      items.forEach((item) => observer.observe(item));
    }
    return () => observer.disconnect();
  }, [ref, options]);
}

export default function Services() {
  const pageRef = useRef(null);
  useIntersection(pageRef);

  return (
    <>
      <Navigimi />
      <div id="services" ref={pageRef}>
        <section className="srvHero">
          <div className="srvHeroBg">
            <div className="orb orb1" />
            <div className="orb orb2" />
          </div>
          <div className="srvHeroContent reveal">
            <span className="srvEyebrow">Çfarë ofrojmë</span>
            <h1 className="srvHeroTitle">
              Shërbime që
              <br />
              <em>funksionojnë</em> me ju
            </h1>
            <p className="srvHeroSub">
              Nga qira e thjeshtë ditore deri tek kontrata korporative — çdo shërbim është
              projektuar për të hequr pengesat, jo për t'i shtuar.
            </p>
          </div>

          <div className="srvStats reveal">
            {stats.map((s, i) => (
              <div className="srvStat" key={i}>
                <span className="srvStatValue">{s.value}</span>
                <span className="srvStatLabel">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {categories.map((c) => (
          <section className="srvCategory" key={c.id}>
            <div className="srvCategoryHeader reveal">
              <span className="srvCategoryIcon">{c.icon}</span>
              <div>
                <span className="srvCategoryTag" style={{ color: c.color }}>
                  {c.label}
                </span>
                <div className="srvCategoryLine" style={{ background: c.color }} />
              </div>
            </div>

            <div className="srvGrid">
              {c.services.map((svc, i) => (
                <div
                  className="srvCard reveal"
                  key={i}
                  style={{ '--accent': c.color, animationDelay: `${i * 80}ms` }}
                >
                  {svc.badge && (
                    <span className="srvCardBadge" style={{ background: c.color }}>
                      {svc.badge}
                    </span>
                  )}
                  <h3 className="srvCardTitle">{svc.title}</h3>
                  <p className="srvCardDesc">{svc.desc}</p>
                  <div className="srvCardLine" />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="srvCta reveal">
          <div className="srvCtaInner">
            <h2>Gati të filloni?</h2>
            <p>Shikoni flotën tonë dhe zgjidhni makinën e duhur për ju.</p>
            <div className="srvCtaBtns">
              <button className="srvBtn srvBtnPrimary">Shiko Flotën</button>
              <button className="srvBtn srvBtnGhost">Na Kontaktoni</button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
