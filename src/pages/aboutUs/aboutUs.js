    import "./aboutUs.css";
    import Navigimi from "../../components/navbar/navbar";
    import Footer from "../../components/footer/footer";
    import { useEffect, useRef } from "react";

    const values = [
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

    const steps = [
    { n: "01", title: "Zgjedh", desc: "Filtro sipas kategorisë, datës dhe buxhetit. Shiko çmimin final menjëherë." },
    { n: "02", title: "Konfirmo", desc: "Rezervo online brenda 3 minutave. Konfirmim automatik me email." },
    { n: "03", title: "Merr", desc: "Dorëzim në adresën tënde ose marrje nga pika jonë. Orari yt, rregullat tona." },
    { n: "04", title: "Udhëto", desc: "Makina e pastër, tanku i plotë, asistencë aktive. Fokusohu vetëm rrugës." },
    ];

    const numbers = [
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

    return(
        <>
        <Navigimi />
        <div id="abPage" ref={ref}>

            <section className="abHero">
            <div className="abHeroNoise" />

            <div className="abHeroLeft anim">
                <span className="abLabel">Rreth nesh</span>
                <h1>
                Lëvizje<br />
                <span className="abHeroStroke">pa kompromis</span>
                </h1>
                <p className="abHeroP">
                Ndërtuam këtë platformë për të eliminuar konfuzionin, kostot e fshehura
                dhe burokacinë nga qiraja e makinave. Çdo vendim teknik, çdo politikë
                çmimi, çdo detaj i procesit — ka qenë i menduar me synim: ta bëjmë
                sa më të thjeshtë për ju.
                </p>
                <div className="abHeroBtns">
                <button className="abBtn abBtnFill">Shiko Flotën</button>
                <button className="abBtn abBtnOutline">Rezervo Tani</button>
                </div>
            </div>

            <div className="abHeroRight anim">
                <div className="abBadge abBadge--tl">Transparencë totale</div>
                <div className="abBadge abBadge--tr">Flotë moderne</div>
                <div className="abBadge abBadge--bl">Zero surpriza</div>
                <div className="abBadge abBadge--br">Asistencë 24/7</div>
                <div className="abHeroCircle">
                <span>8+</span>
                <small>vite eksperiencë</small>
                </div>
            </div>
            </section>

            <section className="abNumbers">
            {numbers.map((n, i) => (
                <div className="abNumber anim" key={i} style={{ animationDelay: `${i * 100}ms` }}>
                <span className="abNumberValue">{n.value}</span>
                <span className="abNumberLabel">{n.label}</span>
                </div>
            ))}
            </section>

            <section className="abStory">
            <div className="abStoryTag anim">Historia jonë</div>
            <div className="abStoryBody">
                <h2 className="abStoryH2 anim">
                Nga një ide e thjeshtë<br />deri tek platforma
                </h2>
                <div className="abStoryText anim">
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

            <section className="abValues">
            <div className="abSectionHead anim">
                <span className="abLabel">Parimet tona</span>
                <h2>Çfarë na bën ndryshe</h2>
            </div>
            <div className="abValuesGrid">
                {values.map((v, i) => (
                <div
                    className="abVcard anim"
                    key={i}
                    style={{ "--c": v.color, animationDelay: `${i * 100}ms` }}
                >
                    <span className="abVcardNum">{v.num}</span>
                    <div className="abVcardBar" />
                    <h3 className="abVcardTitle">{v.title}</h3>
                    <p className="abVcardDesc">{v.desc}</p>
                </div>
                ))}
            </div>
            </section>

            <section className="abDual">
            <div className="abDualCard abDualCardRental anim">
                <span className="abDualTag">Qira</span>
                <h3 className="abDualH3">Makina me qira,<br />kushte të qarta</h3>
                <p className="abDualP">
                Ditore, javore ose mujore — flotë moderne me çmime transparente,
                dorëzim në derë dhe asistencë 24/7 gjatë gjithë periudhës.
                </p>
                <ul className="abDualList">
                <li>Rezervim online në 3 minuta</li>
                <li>Dorëzim në aeroport ose adresë</li>
                <li>Sigurim i përfshirë, zero surpriza</li>
                </ul>
                <button className="abBtn abBtnFill">Shiko Flotën →</button>
            </div>

            <div className="abDualDivider" />

            <div className="abDualCard abDualCardSale anim">
                <span className="abDualTag abDualTagPink">Blerje & Shitje</span>
                <h3 className="abDualH3">Blen ose shet<br />pa ndërmjetës</h3>
                <p className="abDualP">
                Dëshiron të shesësh makinën? Ne vlerësojmë falas dhe blejmë brenda 24 orësh.
                Dëshiron të blesh? Çdo makinë e inspektuar dhe me çmim real.
                </p>
                <ul className="abDualList">
                <li>Vlerësim falas, ofertë brenda 24h</li>
                <li>Pa komisione, pa ndërmjetës</li>
                <li>Dokumentacion dhe pagesë e sigurt</li>
                </ul>
                <button className="abBtn abBtnOutline abBtnPink">Shes Makinën →</button>
            </div>
            </section>

            <section className="abHow">
            <div className="abSectionHead anim">
                <span className="abLabel">Procesi</span>
                <h2>Si funksionon</h2>
            </div>
            <div className="abHowTrack">
                <div className="abHowLine" />
                {steps.map((s, i) => (
                <div className="abStep anim" key={i} style={{ animationDelay: `${i * 120}ms` }}>
                    <div className="abStepDot" />
                    <span className="abStepN">{s.n}</span>
                    <h4 className="abStepTitle">{s.title}</h4>
                    <p className="abStepDesc">{s.desc}</p>
                </div>
                ))}
            </div>
            </section>

            <section className="abCta anim">
            <div className="abCtaGlow" />
            <h2 className="abCtaH2">Gati për të filluar?</h2>
            <p className="abCtaP">Shiko flotën dhe rezervo makinën e duhur për ju sot.</p>
            <button className="abBtn abBtnFill abBtnLg">Fillo Rezervimin →</button>
            </section>

        </div>
        
        <Footer />
        </>
    );
    }