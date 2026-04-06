import NavBar from "../../components/navbar/navbar";
import "./home.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import G from "../../assets/v.mp4";
import Trade from "../../assets/trade.jpg";
import Mirage from "../../assets/mitsubishi-mirage-car-d.jpg";
import Toyota from "../../assets/toyota.webp";
import Hyundai from "../../assets/hyundai.webp";
import Glc300 from "../../assets/glc300.png";
import volvo from "../../assets/volvo.jpeg";
import Tesla from "../../assets/tesla.avif";
import Carousel from "../../components/carousel/carousel";
import Footer from "../../components/footer/footer";

function InputField({label, value, setValue, type}) {
    return(
        <div className="rentalWidgetField">
            <label className="rentalWidgetLabel">{label}</label>
            <input className="rentalWidgetInput" type={type} value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
    );
}

function Dropdown({label, value, setValue, items}) {
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    const filtered = items.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
    );

    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => prev < filtered.length - 1 ? prev + 1 : 0);
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => prev > 0 ? prev - 1 : filtered.length - 1);
        }
        if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            inputRef.current.blur();
            setValue(filtered[activeIndex]);
            setQuery("");
            setActiveIndex(-1);
            setOpen(false);
        }
        if (e.key === "Escape") {
            inputRef.current.blur();
            setQuery("");
            setActiveIndex(-1);
            setOpen(false);
        }
    };

    return (
        <div className="rentalWidgetField rentalWidgetDropdown">
            <label className="rentalWidgetLabel">{label}</label>
            <div className="rentalWidgetDropdownBox">
                <input
                    className="rentalWidgetInput"
                    ref={inputRef}
                    value={open ? query : value}
                    onFocus={() => {
                        setOpen(true);
                        setQuery("");
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setOpen(false);
                            setQuery("");
                            setActiveIndex(-1);
                        }, 150);
                    }}
                    placeholder={value || "Zgjedh..."}
                    autoComplete="off"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(-1);
                    }}
                />

                <span className="rentalWidgetArrow">▼</span>

                {open && filtered.length > 0 && (
                    <div className="rentalWidgetMenu">
                        {filtered.map((item, index) => (
                            <div
                                key={item}
                                className={`rentalWidgetItem ${index === activeIndex ? "rentalWidgetItem--active" : ""}`}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    setValue(item);
                                    setQuery("");
                                    setActiveIndex(-1);
                                    setOpen(false);
                                    inputRef.current.blur();
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default function Home(){
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("inView");
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }    
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
    }, []);

    const locations = [
        "Tirana Airport",
        "Tirana Center",
        "Durres Port",
        "Vlore Downtown"
    ];

    const times = Array.from({ length: 24 }, (_, i) => 
        `${i.toString().padStart(2, "0")}:00`
    );

    const navigate = useNavigate();

    const [pickupLocation, setPickupLocation] = useState("");
    const [dropLocation, setDropLocation] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [dropTime, setDropTime] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [dropDate, setDropDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();
        
        if (pickupLocation) params.append("pickupLocation", pickupLocation);
        if (dropLocation)   params.append("dropLocation",   dropLocation);
        if (pickupDate)     params.append("pickupDate",     pickupDate);
        if (pickupTime)     params.append("pickupTime",     pickupTime);
        if (dropDate)       params.append("dropDate",       dropDate);
        if (dropTime)       params.append("dropTime",       dropTime);

        navigate(`/rental?${params.toString()}`);
    }

    const carTypes = [
      {
            id: 1,
        name: "Ekonomike",
        description: "Ideale për lëvizje urbane, konsum i ulët dhe kosto minimale.",
        priceFrom: 6,
        people: "4–5",
        luggage: "2–3",
        doors: "4–5",
        image: Mirage
      },
      {
        id: 2,
        name: "Kompakt",
        description: "Balancë mes komoditetit dhe madhësisë, e përshtatshme për udhëtime të shkurtra.",
        priceFrom: 6,
        people: "5",
        luggage: "3",
        doors: "4–5",
        image: Toyota
      },
      {
        id: 3,
        name: "SUV",
        description: "Hapësirë më e madhe, stabilitet dhe rehati për çdo terren.",
        priceFrom: 7,
        people: "5",
        luggage: "3–4",
        doors: "4–5",
        image: Hyundai
      },
      {
        id: 4,
        name: "Luksoze",
        description: "Komoditet premium dhe eksperiencë drejtimi elitare.",
        priceFrom: 18,
        people: "4–5",
        luggage: "2–3",
        doors: "4",
        image: Glc300
      },
      {
        id: 5,
        name: "Elektrike",
        description: "Zero emetime, teknologji moderne dhe drejtim i qetë.",
        priceFrom: 30,
        people: "4–5",
        luggage: "2–3",
        doors: "4–5",
        image: Tesla
      },
      {
        id: 6,
        name: "Hibride",
        description: "Efikasitet i lartë me kombinim benzinë dhe energji elektrike.",
        priceFrom: 20,
        people: "5",
        luggage: "3",
        doors: "4–5",
        image: volvo
      }
    ];

    
    return(
        <div id="home">
            <NavBar />

            <div className="videoWrapper">
            <video className="videoBackground" src={G} autoPlay loop muted playsInline />
            <video className="videoMain" src={G} autoPlay loop muted playsInline />
            </div>

            <div className="carousel">
                <Carousel />
            </div>
            <div className="rightContainer" >
                <div className="rentalWidget">
                    <div className="rentalWidgetContainer">
                        <h2>Rezervo tani</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="rentalWidgetGrid">
                                <div className="rentalWidgetSpan2">
                                    <Dropdown 
                                        label="Pick-up Location"
                                        value={pickupLocation}
                                        setValue={setPickupLocation}
                                        items={locations}
                                    />
                                </div>

                                <InputField 
                                    
                                    label="Pick-up Date"
                                    value={pickupDate}
                                    setValue={setPickupDate}
                                    type="date"
                                />

                                <Dropdown 
                                    label="Pick-up Time"
                                    value={pickupTime}
                                    setValue={setPickupTime}
                                    items={times}
                                />

                                <div className="rentalWidgetSpan2">
                                    <Dropdown 
                                        label="Drop-off Location"
                                        value={dropLocation}
                                        setValue={setDropLocation}
                                        items={locations}
                                    />
                                </div>

                                <InputField
                                  label="Drop-off Date"
                                  value={dropDate}
                                  setValue={setDropDate}
                                  type="date"
                                />

                                <Dropdown
                                  label="Drop-off Time"
                                  value={dropTime}
                                  setValue={setDropTime}
                                  items={times}
                                />
                            </div>

                            <button type="submit" className="rentalButton">Kerko makinat</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="leftContainer">
            <div className="heroHeader">Sherbim i thjeshte</div>
            <div className="heroItem">Nje rezervim</div>
            <div className="heroItem">Nje celes</div>
            <div className="heroItem">Nje rruge</div>
            </div>

            <div className="whyUs">
            <h2 className="whyTitle">A e dini perse njerezit na zgjedhin ne?</h2>
           
            <div className="whyCardsContainer">
                <div className="whyCard">
                    <div className="whyIcon">%</div>
                    <div className="whyContent">
                        <h3>Kurseni deri ne 40%</h3>
                        <p>Krahasoni cmime nga disa faqe me nje kerkim te vetem.</p>
                    </div>
                </div>
           
                <div className="whyCard">
                    <div className="whyIcon">✓</div>
                    <div className="whyContent">
                        <h3>Falas per t'u perdorur</h3>
                        <p>Nuk ka tarifa te fshehura apo pagesa shtese.</p>
                    </div>
                </div>
           
                <div className="whyCard">
                    <div className="whyIcon">≡</div>
                    <div className="whyContent">
                        <h3>Filtroni ofertat</h3>
                        <p>Zgjidhni sipas tipit te makines dhe anulimit falas.</p>
                    </div>
                </div>
           
                <div className="whyCard">
                    <div className="whyIcon">🚗</div>
                    <div className="whyContent">
                        <h3>Zgjidhni vendin e marrjes</h3>
                        <p>Marrje dhe dorezim ne aeroport, ne qytet ose ne adresen e percaktuar</p>
                    </div>
                </div>
            </div>
            </div>

            <section className="metricsSection">
            <div className="metricsContainer">
                <div className="metricCard">
                    <span className="metricValue">12+</span>
                    <span className="metricLabel">Vite Eksperience</span>
                </div>

                <div className="metricCard">
                    <span className="metricValue">180+</span>
                    <span className="metricLabel">Makina ne Flote</span>
                </div>

                <div className="metricCard">
                    <span className="metricValue">5000+</span>
                    <span className="metricLabel">Rezervime te kryera</span>
                </div>

                <div className="metricCard">
                    <span className="metricValue">4.8★</span>
                    <span className="metricLabel">Vleresim Mesatar</span>
                </div>
            </div>
            </section>

            <section>
            <div className="fleetContainer">
                <div className="fleetText">
                    <h2>Llojet e Automjeteve ne Floten Tone</h2>
                    <p>Perzgjedhje sipas kategorise, komoditetit dhe nevojave tuaja te udhetimit</p>
                </div>

                <button onClick={() => window.location.href = 'Cars'} className="showFleet">
                    Shiko te gjithe floten
                </button>
            </div>

            <div className="fleetContent">
                {carTypes.map(type => (
                    <div className="fleetCarTypes" key={type.id}>
                        <div className="carImg">
                            <img src={type.image} alt={type.name} />
                        </div>

                        <h3 className="carName">{type.name}</h3>
                        <p className="carDesc">{type.description}</p>

                        <div className="carSpecs">
                            <span>👤 {type.people}</span>
                            <span>🧳 {type.luggage}</span>
                            <span>🚪 {type.doors}</span>
                        </div>

                        <div className="carFooter">
                            <span className="carPrice">Duke filluar nga &nbsp; ${type.priceFrom} <small>/dite</small></span>
                            <button className="carButton">Shiko Modelet</button>
                        </div>
                    </div>
                ))}
            </div>
            </section>

            <section className="tradeSection">
            <div className="tradeWrapper">
                <div className="tradeContent">
                    <h2>Blerje & Shitje Automjetesh</h2>
                    <p>Makina te kontrolluara, cmime reale tregu dhe proces i thjesht pa ndermjetes.</p>
                

                    <div className="tradeActions">
                        <button onClick={() => window.location.href = 'Sales'} className="buttonSale">Shiko makinat ne shitje</button>
                        <button onClick={() => window.location.href = 'Buy'} className="buttonBuy">Vlereso dhe shit makinen tende</button>
                    </div>
                </div>

                <div className="tradeImage">
                    <img src={Trade} alt="Shit/Blerje makinash"/>
                </div>
            </div>
            </section>

            <section ref={sectionRef} className="featuresContent">
                <div className="featuresCard">
                    <h3>Kontroll mbi shpenzimin</h3>

                    <div className="row">
                        <div className="icon">₁₀%</div>
                        <div className="text">Mos paguaj më shumë sesa vlen</div>
                    </div>

                    <div className="row">
                        <div className="icon">☂</div>
                        <div className="text">Siguracion i përfshirë për çdo makinë</div>
                    </div>

                    <div className="row">
                        <div className="icon">📄</div>
                        <div className="text">Stabilitet pa surpriza financiare</div>
                    </div>
                </div>

                <div className="featuresCard">
                    <h3>Vendimi mbetet gjithmonë i joti</h3>
                
                    <div className="row">
                        <div className="icon">↩</div>
                        <div className="text">Liria për të ndryshuar mëndje pa kosto shtesë</div>
                    </div>

                    <div className="row">
                        <div className="icon">🔄</div>
                        <div className="text">Zëvëndësim sipas nevojës</div>
                    </div>

                    <div className="row">
                        <div className="icon">🚗</div>
                        <div className="text">Pick Up & Delivery brenda 45km</div>
                    </div>
                </div>

                <div className="featuresCard">
                    <h3>Proces i drejtëpërdrejtë</h3>

                    <div className="row">
                        <div className="icon">🧩</div>
                        <div className="text">Opsione për çdo kërkesë</div>
                    </div>

                    <div className="row">
                        <div className="icon">⏱</div>
                        <div className="text">Rezervim në pak minuta</div>
                    </div>
                </div>
            </section>

            <section className="howItWorksSection">
                <div className="howImage"><img src={Trade} alt="tradeImage"/></div>
                <div className="howContent">
                    <span>Si funksionon?</span>
                    <h1>Thjeshte. Paster. E jotja</h1>

                    <div className="feature">
                        <h3>Rezervo Makinen Tende</h3>
                        <p>Zgjidh nga nje game e larmishme markash dhe modelesh — SUV, sedan, hibride dhe me shume.</p>
                    </div>

                    <div className="feature">
                        <h3>Merr ose Dergohet, Ti Vendos</h3>
                        <p>Merr makinen ne aeroport ose dergohet direkt tek dera jote.</p>
                    </div>

                    <div className="feature">
                        <h3>Drejto Pa Shqetesime</h3>
                        <p>Siguracion, mirembajtje dhe ndihme rrugore te perfshira</p>
                    </div>

                    <div className="feature">
                        <h3>Pershtatet me Jeten Tende</h3>
                        <p>Shto shofer, nderro makine ose pauzo kur te duhet</p>
                    </div>

                    <div className="actions">
                        <button onClick={() => window.location.href = 'Reservation'} className="primary">Rezervo nje makine</button>
                        <button onClick={() => window.location.href = 'Contact' } className="secondary">Na kontaktoni</button>
                    </div>
                </div>
            </section>

            <section className="infoSection">
                <div className="infoCard left">
                    <div className="infoContent">
                        <h2>A keni pyetje per marrjen e makines me qera?</h2>
                        <p>
                            Ketu do te gjeni pergjigje per pyetjet me te shpeshta mbi tema te ndryshme, 
                            per te marre makinen me qera pa shqetesime dhe per te shijuar 
                            udhetimin tuaj me qetesi te plote.
                        </p>

                        <button onClick={() => window.location.href = 'Faq'} className="faqBtn">Zbulo me shume:</button>
                    </div>
                </div>

                <div className="infoCard right">
                    <div className="infoContent">
                        <h2>Deshironi te dini me shume rreth nesh?</h2>
                        <p>
                            Na ndiqni ne rrjetet tona sociale per te qendruar gjithmone
                            te perditesuar mbi ofertat, promovimet dhe lajmet me te fundit.
                        </p>

                        <div className="socials">
                            <span className="icon">f</span>
                            <span className="icon">i</span>
                            <span className="icon">in</span>
                            <span className="icon">t</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="values">
                <div className="value">
                    <h3>PERFITUESE</h3>
                    <p>
                        Kush tha qe duhet te paguash me shume per te marre me shume?
                        Ne e dime qe nje klient i kenaqur eshte deshmia me e mire.
                        Prandaj synojme t'ju ofrojme saktesisht ate qe ju nevojitet:
                        sherbim cilesor me cmimin e duhur
                    </p>
                    <span className="underline">Qiraja qe ia vlen/</span>
                </div>

                <div className="value">
                    <h3>E PERSONALIZUESHME</h3>
                    <p>
                        Cdo udhetim eshte i ndryshem dhe cdo klient ka nevoja specifike.
                        Zgjidhjet tona jane fleksibel: se bashku percaktojme
                        makinen dhe sherbimet qe ju lejojne te perfitoni maksimumin
                        nga pervoja juaj me ne.
                    </p>
                    <span className="underline">Qiraja qe te degjon</span>
                </div>

                <div className="value">
                    <h3>E BESUESHME</h3>
                    <p>
                        Mund te na besoni plotesisht. Ju udhezojme dhe keshillojme
                        ne zgjedhjen e makines dhe sherbimeve.
                        Sqarojme kushtet dhe garantojme asistence 7 dite ne jave, gjate dhe pas qirase.
                    </p>
                    <span className="underline">Qiraja qe te shoqeron.</span>
                </div>
            </section>

           <section className="contactSection">
                <div className="contactContent">
                    <h2>Kur dicka nuk eshte e qarte, mos e neglizho</h2>

                    <p>
                        Vendimet e keqija nuk vijne nga zgjedhje te gabuara
                        por nga pyetje qe nuk u bene kurre.
                        Nese ke dhe nje paqartesi te vetme,
                        ndalo dhe sqaroje tani.
                    </p>

                    <button className="contactBtn" onClick={() => window.location.href = "Contact"}>Na kontakto</button>

                    <span>Ne jemi ketu ne sherbimin tuaj vetem per ju.</span>
                </div>
           </section> 

           <Footer />
        </div>
    )
}