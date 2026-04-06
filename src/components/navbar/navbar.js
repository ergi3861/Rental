import "./navbar.css"
import logo from "../../assets/logo.png";
import ReactCountryFlag from "react-country-flag";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaCalendarCheck, FaTags, FaHistory, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function NavBar() {
    const PATHS = {
        search: "M11 19a8 8 0 1 1 5.3-14.1A8 8 0 0 1 11 19zm8.9 2.2-3.4-3.4",
        close: "M6 6l12 12M18 6l-12 12",
        arrow: "M5 12h12M13 6l6 6-6 6"
    };

    const placeholderRef = useRef(null);
    const inputRef       = useRef(null);
    const iconPathRef    = useRef(null);
    const actionPathRef  = useRef(null);

    const [state,    setState]    = useState("idle");
    const [expanded, setExpanded] = useState(false);

    function morph(path, newD) {
        if (!path || path.getAttribute("d") === newD) return;
        path.style.opacity   = "0.3";
        path.style.transform = "rotate(-6deg)";
        setTimeout(() => {
            path.setAttribute("d", newD);
            path.style.opacity   = "1";
            path.style.transform = "rotate(0deg)";
        }, 140);
    }

    function openSearch() {
        if (state !== "idle") return;
        document.body.classList.add("searchIsOpen");
        setState("expanding");
        setExpanded(true);
        setTimeout(() => {
            morph(iconPathRef.current, PATHS.close);
            if (actionPathRef.current) actionPathRef.current.setAttribute("d", PATHS.close);
            setState("active");
            if (inputRef.current) inputRef.current.focus();
        }, 60);
    }

    function closeSearch() {
        if (state === "idle") return;
        document.body.classList.remove("searchIsOpen");
        setState("closing");
        setExpanded(false);
        if (inputRef.current) { inputRef.current.value = ""; inputRef.current.blur(); }
        morph(iconPathRef.current, PATHS.search);
        if (actionPathRef.current) actionPathRef.current.setAttribute("d", "");
        setTimeout(() => setState("idle"), 500);
    }

    function updateIcon() {
        if (inputRef.current.value.length > 0) {
            morph(iconPathRef.current, PATHS.arrow);
            if (actionPathRef.current) actionPathRef.current.setAttribute("d", PATHS.arrow);
            setState("populated");
        } else {
            morph(iconPathRef.current, PATHS.close);
            if (actionPathRef.current) actionPathRef.current.setAttribute("d", PATHS.close);
            setState("active");
        }
    }

    useEffect(() => {
        function esc(e) { if (e.key === "Escape") closeSearch(); }
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    });

    useEffect(() => {
        document.querySelectorAll(".selectorDropdown").forEach(d => {
            const icons = d.querySelectorAll(".icon");
            const label = d.querySelector(".selectorLabel span");
            d.querySelectorAll(".option").forEach(o => {
                o.addEventListener("click", () => {
                    const v = o.dataset.value;
                    icons.forEach(i => i.classList.toggle("isActive", i.dataset.value === v));
                    label.style.transform = "translateY(120%)";
                    setTimeout(() => {
                        label.textContent     = v;
                        label.style.transform = "translateY(0)";
                    }, 180);
                });
            });
        });
    }, []);

    const searchPortal = createPortal(
        <>
            <div
                className={`searchOverlay${expanded ? " searchOverlayIsActive" : ""}`}
                onClick={closeSearch}
            />
            <div className={`searchShellPortal${expanded ? " searchShellPortalExpanded" : ""}`}>
                <div className="searchGroup">
                    <span className="searchLabel">Kerko</span>
                    <div className="searchIcon">
                        <svg viewBox="0 0 26 24">
                            <path ref={iconPathRef} d={PATHS.search} />
                        </svg>
                    </div>
                </div>

                <input
                    className="searchInput"
                    ref={inputRef}
                    onInput={updateIcon}
                    placeholder="Kërko..."
                />

                <div
                    className="searchActionIcon searchIcon"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (state === "active" || state === "expanding") { closeSearch(); return; }
                        if (state === "populated") {
                            const query = inputRef.current.value.trim();
                            if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
                        }
                    }}
                >
                    <svg viewBox="0 0 24 24">
                        <path ref={actionPathRef} />
                    </svg>
                </div>
            </div>
        </>,
        document.body
    );

    return (
        <>
            {searchPortal}

            <nav id="navbar">
                <div className="navBarTop">
                    <div className="textLogo">
                        <h2>Rental &<br />Sales</h2>
                    </div>

                    <div className="navBarContent">
                        <div className="contactLinks">
                            <a href="tel:+355691234567"><FaPhoneAlt /></a>
                            <a href="mailto:rental@rental.com"><FaEnvelope /></a>
                            <a href="https://wa.me/355691234567" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                        </div>

                        <div className="selectorGroup">
                            <div className="selectorDropdown">
                                <div className="selectorHover">
                                    <div className="selectorTrigger">
                                        <div className="selectorIcons">
                                            <div className="icon isActive" data-value="AL"><ReactCountryFlag countryCode="AL" svg /></div>
                                            <div className="icon" data-value="FR"><ReactCountryFlag countryCode="FR" svg /></div>
                                            <div className="icon" data-value="IT"><ReactCountryFlag countryCode="IT" svg /></div>
                                            <div className="icon" data-value="GB"><ReactCountryFlag countryCode="GB" svg /></div>
                                        </div>
                                        <div className="selectorLabel"><span>Shqip</span></div>
                                    </div>
                                    <div className="selectorMenu">
                                        <div className="option" data-value="Shqip"><div className="optionIcon"><ReactCountryFlag countryCode="AL" svg /></div><div className="optionLabel">AL</div></div>
                                        <div className="option" data-value="French"><div className="optionIcon"><ReactCountryFlag countryCode="FR" svg /></div><div className="optionLabel">FR</div></div>
                                        <div className="option" data-value="Italian"><div className="optionIcon"><ReactCountryFlag countryCode="IT" svg /></div><div className="optionLabel">IT</div></div>
                                        <div className="option" data-value="English"><div className="optionIcon"><ReactCountryFlag countryCode="GB" svg /></div><div className="optionLabel">EN</div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="selectorDropdown">
                                <div className="selectorHover">
                                    <div className="selectorTrigger">
                                        <div className="selectorIcons">
                                            <div className="icon isActive" data-value="Leke">(ALL)</div>
                                            <div className="icon" data-value="Euro">(€)</div>
                                            <div className="icon" data-value="Dollar">($)</div>
                                        </div>
                                        <div className="selectorLabel"><span>Leke</span></div>
                                    </div>
                                    <div className="selectorMenu">
                                        <div className="option" data-value="Leke"><div className="optionIcon">(ALL)</div><div className="optionLabel">Leke</div></div>
                                        <div className="option" data-value="Eur"><div className="optionIcon">(€)</div><div className="optionLabel">Euro</div></div>
                                        <div className="option" data-value="USD"><div className="optionIcon">($)</div><div className="optionLabel">Dollar</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={placeholderRef}
                            className="searchPlaceholder"
                            onClick={openSearch}
                        >
                            {state === "idle" && (
                                <div className="searchPlaceholderInner">
                                    <span className="searchLabel">Kerko</span>
                                    <div className="searchIcon">
                                        <svg viewBox="0 0 26 24">
                                            <path d={PATHS.search} />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="quickStats">
                            <button className="statBtn"><FaCalendarCheck /></button>
                            <button className="statBtn"><FaTags /></button>
                            <button className="statBtn"><FaHistory /></button>
                        </div>

                        <div className="authentication">
                            <div className="userMenu">
                                <button className="userBtn" onClick={() => window.location.href = "/auth"} aria-label="Login / Sign up">
                                    <FaUserAlt className="userIcon" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="navBarMain">
                    <div className="logo">
                        <Link to="/"><img src={logo} alt="logo" /></Link>
                    </div>
                    <ul className="menu">
                        <li><Link to="/">Home</Link></li>
                        <li className="hasDropdown">
                            <Link to="/cars">Makinat</Link>
                            <ul className="dropdownMenu">
                                <li>Ekonomike</li><li>Kompakt</li><li>SUV</li>
                                <li>Luksoze</li><li>Elektrike</li><li>Hibride</li>
                            </ul>
                        </li>
                        <li><Link to="/rental">Rezervo</Link></li>
                        <li><Link to="/sales">Bli nje makine</Link></li>
                        <li><Link to="/buy">Shit makinen tende</Link></li>
                        <li><Link to="/services">Sherbime</Link></li>
                        <li><Link to="/aboutUs">Rreth nesh</Link></li>
                        <li><Link to="/contact">Kontakto</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    );
}