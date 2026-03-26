import "../navbar/navbar.css"
import logo from "../../assets/logo.png"
import alb from "../../assets/alb.png"
import ita from "../../assets/italy.png"
import fra from "../../assets/france.png"
import uk from "../../assets/united-kingdom.png"
import { AiOutlineUser } from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";
import {IoMdArrowDropdown } from "react-icons/io";
import { FaLongArrowAltRight, FaTag } from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import Footer from "../footer/footer"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FaPhoneAlt , FaEnvelope , FaWhatsapp } from "react-icons/fa";
import { FaCalendarCheck, FaTags, FaHistory } from "react-icons/fa";
import { useState, useRef,useEffect } from "react"
import { FaEuroSign, FaDollarSign } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";




function Navigimi() {
  const PATHS={
search:"M11 19a8 8 0 1 1 5.3-14.1A8 8 0 0 1 11 19zm8.9 2.2-3.4-3.4",
close:"M6 6l12 12M18 6l-12 12",
arrow:"M5 12h12M13 6l6 6-6 6"
}

const shellRef=useRef(null)
const overlayRef=useRef(null)
const inputRef=useRef(null)
const iconPathRef=useRef(null)
const actionPathRef=useRef(null)

const [state,setState]=useState("idle")

function morph(path,newD){
if(!path) return
const start=path.getAttribute("d")
if(start===newD) return
path.style.opacity="0.3"
path.style.transform="rotate(-6deg)"
setTimeout(()=>{
path.setAttribute("d",newD)
path.style.opacity="1"
path.style.transform="rotate(0deg)"
},140)
}

function openSearch(){
if(state!=="idle") return
setState("expanding")
shellRef.current.classList.add("psc-shell-expanded")
overlayRef.current.classList.add("psc-overlay-active")

setTimeout(()=>{
morph(iconPathRef.current,PATHS.close)
actionPathRef.current.setAttribute("d",PATHS.close)
setState("active")
inputRef.current.focus()
},260)
}

function closeSearch(){
if(state==="idle") return
setState("closing")

shellRef.current.classList.remove("psc-shell-expanded")
overlayRef.current.classList.remove("psc-overlay-active")
inputRef.current.value=""
inputRef.current.blur()

morph(iconPathRef.current,PATHS.search)
actionPathRef.current.setAttribute("d","")

setTimeout(()=>setState("idle"),500)
}

function updateIcon(){
if(inputRef.current.value.length>0){
morph(iconPathRef.current,PATHS.arrow)
actionPathRef.current.setAttribute("d",PATHS.arrow)
setState("populated")
}else{
morph(iconPathRef.current,PATHS.close)
actionPathRef.current.setAttribute("d",PATHS.close)
setState("active")
}
}

useEffect(()=>{
function esc(e){
if(e.key==="Escape") closeSearch()
}
window.addEventListener("keydown",esc)
return ()=>window.removeEventListener("keydown",esc)
})

  
useEffect(() => {
    document.querySelectorAll(".pd-dropdown").forEach(d => {
      const icons = d.querySelectorAll(".pd-icon");
      const label = d.querySelector(".pd-label span");
      d.querySelectorAll(".pd-option").forEach(o => {
        o.addEventListener("click", () => {
          const v = o.dataset.value;
          icons.forEach(i =>
            i.classList.toggle("pd-active", i.dataset.value === v)
          );
          label.style.transform = "translateY(120%)";
          setTimeout(() => {
            label.textContent = v;
            label.style.transform = "translateY(0)";
          }, 180);
        });
      });
    });
  }, []);

  return (
    <div>
  <nav>
  <div className="navbar-top">
    <div className="brand-text">
      <h2>
        Rental &<br />Sales
      </h2>
    </div>
<div className="navbar-top-second">
    <div className="topbar-actions">
      <div className="contact-links">
        <a href="tel:+355691234567" className="contact-link">
          <FaPhoneAlt />
        </a>
        <a href="mailto:info@domain.com" className="contact-link">
          <FaEnvelope />
        </a>
        <a href="https://wa.me/355691234567" target="_blank" className="contact-link">
          <FaWhatsapp />
        </a>
      </div>
    </div>

<div className="pd-ui">
      <div className="pd-dropdown">
        <div className="pd-hover-zone">
          <div className="pd-trigger">
            <div className="pd-icon-wrap">
              <div className="pd-icon pd-active" data-value="AL"><ReactCountryFlag countryCode="AL" svg /></div>
              <div className="pd-icon" data-value="FR"><ReactCountryFlag countryCode="FR" svg /></div>
              <div className="pd-icon" data-value="IT"><ReactCountryFlag countryCode="IT" svg /></div>
              <div className="pd-icon" data-value="GB"><ReactCountryFlag countryCode="GB" svg /></div>
            </div>
            <div className="pd-label"><span>Shqip</span></div>
          </div>
          <div className="pd-menu">
            <div className="pd-option" data-value="Shqip"><div className="pd-opt-icon"><ReactCountryFlag countryCode="AL" svg /></div><div className="pd-opt-label"></div></div>
            <div className="pd-option" data-value="FR"><div className="pd-opt-icon"><ReactCountryFlag countryCode="FR" svg /></div><div className="pd-opt-label">FR</div></div>
            <div className="pd-option" data-value="IT"><div className="pd-opt-icon"><ReactCountryFlag countryCode="IT" svg /></div><div className="pd-opt-label">IT</div></div>
            <div className="pd-option" data-value="UK"><div className="pd-opt-icon"><ReactCountryFlag countryCode="GB" svg /></div><div className="pd-opt-label">UK</div></div>
          </div>
        </div>
      </div>

      <div className="pd-dropdown">
        <div className="pd-hover-zone">
          <div className="pd-trigger">
            <div className="pd-icon-wrap">
              <div className="pd-icon pd-active" data-value="Leke">(ALL)</div>
              <div className="pd-icon" data-value="Euro">(€)</div>
              <div className="pd-icon" data-value="Dollar">($)</div>
            </div>
            <div className="pd-label"><span>Leke</span></div>
          </div>
          <div className="pd-menu">
            <div className="pd-option" data-value="Leke"><div className="pd-opt-icon">(ALL)</div><div className="pd-opt-label">Leke</div></div>
            <div className="pd-option" data-value="EUR"><div className="pd-opt-icon">(€)</div><div className="pd-opt-label">Euro</div></div>
            <div className="pd-option" data-value="USD"><div className="pd-opt-icon">($)</div><div className="pd-opt-label">Dollar</div></div>
          </div>
        </div>
      </div>
    </div>


  <div className="psc-overlay" ref={overlayRef} onClick={closeSearch}></div>

<div className="psc-shell" ref={shellRef} onClick={openSearch}>

<div className="psc-group">
<span className="psc-label">Search</span>
<div className="psc-icon">
<svg viewBox="0 0 26 24">
<path ref={iconPathRef} d={PATHS.search}/>
</svg>
</div>
</div>

<input
className="psc-input"
ref={inputRef}
onInput={updateIcon}
/>

<div
className="psc-rightIcon psc-icon"
onClick={(e)=>{
e.stopPropagation()
if(state==="active"){closeSearch();return}
if(state==="populated"){
console.log(inputRef.current.value)
return
}
}}
>
<svg viewBox="0 0 24 24">
<path ref={actionPathRef}></path>
</svg>
</div>

</div>
<div className="quick-stats">
      <button className="stat-button">
        <FaCalendarCheck />
      </button>
      <button className="stat-button">
        <FaTags />
      </button>
      <button className="stat-button">
        <FaHistory />
      </button>
    </div>


    <div className="auth-section">
      <div className="user-menu">
        <button className="nav-circle-icon" onClick={() => window.location.href = "/auth"} aria-label="Sign up / Login">
          <FontAwesomeIcon icon={faUserPlus} className="user-icon" />
        </button>
</div>
 </div>

    </div>
  </div>

  <div className="navbar-main">
    <div className="menu-logo">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
    </div>

    <ul className="main-navigation">
      <li><Link to="/">Home</Link></li>

      <li className="has-dropdown">
        <Link to="/cars">Makinat</Link>
        <ul className="dropdown-menu">
          <li>Ekonomike</li>
          <li>Kompakt</li>
          <li>SUV</li>
          <li>Luksoze</li>
          <li>Elektrike</li>
          <li>Hibride</li>
        </ul>
      </li>

      <li><Link to="/reservation">Rezervo</Link></li>
      <li><Link to="/sales">Bli nje makine</Link></li>
      <li><Link to="/buy">Shit makinen tende</Link></li>
      <li><Link to="/services">Shërbime</Link></li>
      <li><Link to="/aboutUs">Rreth nesh</Link></li>
      <li><Link to="/contact">Kontakt</Link></li>
      <li><Link to="/faq">FAQ</Link></li>
    </ul>
  </div>
</nav>

    </div>
  );
}


export default Navigimi

// 
// .kerko input::placeholder {
//     color: rgba(255,255,255,.5);
//     opacity: 0;
// }
// .kerko button {
//     position: absolute;
//     right: 0;
//     top: 17px;
//     width: 55px;
//     height: 20px;
//     background: #123C4E;
//     border: none;
//     border-radius: 50%;
//     cursor: pointer;
//     outline: none;
// }
// .kerko button::before,
// .kerko button::after {
//     content: "";
//     position: absolute;
//     background: #fff;
//     transition: .4s;
// }
// .kerko button::before {
//     width: 16px;
//     height: 16px;
//     border: 3px solid #fff;
//     border-radius: 50%;
//     top: 14px;
//     left: 16px;
// }
// .kerko button::after {
//     width: 10px;
//     height: 3px;
//     top: 34px;
//     left: 33px;
//     transform: rotate(45deg);
// }
// .kerko:focus-within input {
//     transform: scaleX(1);
//     border-radius: 0;
//     border-radius: 20px;
//     background: #123C4E;
//     border: 1px solid rgba(255,255,255,.5);
// }
// .kerko:focus-within button::before,
// .kerko:focus-within button::after {
//     width: 24px;
//     height: 3px;
//     border: none;
//     top: 25px;
//     left: 18px;
// }
// .kerko:focus-within button::before { transform: rotate(45deg); }
// .kerko:focus-within button::after { transform: rotate(-45deg); }
// .kerko input:not(:placeholder-shown) ~ button::before {
//     width: 18px;
//     height: 3px;
//     border: none;
//     transform: translate(-20%, 0);
// }
// .kerko input:not(:placeholder-shown) ~ button::after {
//     width: 10px;
//     height: 10px;
//     background: transparent;
//     border-left: 3px solid #fff;
//     border-bottom: 3px solid #fff;
//     transform: translate(90%, -40%) rotate(220deg);
// }
// .kerko ul {
//     position: absolute;
//     top: 53px;
//     left: -4px;
//     margin: 0;
//     padding-left: 22px;
//     list-style: none;
//     display: flex;
//     opacity: 0;
//     transform: translateY(10px);
//     transition: opacity 300ms ease, transform 300ms ease;
// }
// .kerko:focus-within ul {
//     opacity: 1;
//     transform: translateY(0);
// }
// .kerko li {
//     width: 14px;
//     color: gold;
//     position: relative;
// }
// .kerko li::before,
// .kerko li::after {
//     content: attr(data-char);
//     position: absolute;
//     transition:
//         transform 500ms ease-in-out,
//         filter 500ms ease-in-out;
// }
// .kerko li::before {
//     top: -20px;
//     color: gold;
// }
// .kerko li::after {
//     top: -53px;
//     color: darkgoldenrod;
//     transform: scale(0) rotate(210deg);
//     filter: blur(20px);
// }
// .kerko input:focus ~ ul li::before,
// .kerko input:not(:placeholder-shown) ~ ul li::before {
//     transform: translateY(-35px) rotate(-210deg);
//     filter: blur(20px);
// }
// .kerko input:focus ~ ul li::after,
// .kerko input:not(:placeholder-shown) ~ ul li::after {
//     transform: scale(1) rotate(0);
//     filter: blur(0);
// }

// li:nth-child(1)::after { transition-delay: .4s; }
// li:nth-child(2)::after { transition-delay: .6s; }
// li:nth-child(3)::after { transition-delay: .8s; }
// li:nth-child(4)::after { transition-delay: 1s; }
// li:nth-child(5)::after { transition-delay: 1.2s; }

// input[type="search"]::-webkit-search-decoration,
// input[type="search"]::-webkit-search-cancel-button,
// input[type="search"]::-webkit-search-results-button,
// input[type="search"]::-webkit-search-results-decoration {
//     display: none;
// }
//  <ul>
                // <li data-char="K"></li>
                // <li data-char="E"></li>
                // <li data-char="R"></li>
                // <li data-char="K"></li>
                // <li data-char="O"></li>            
            // </ul>
