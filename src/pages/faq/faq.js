import React, { useEffect } from "react";
import "../faq/faq.css";
import Navigimi from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

export default function FAQ() {

useEffect(()=>{

const cards=document.querySelectorAll(".faq-card");

cards.forEach(card=>{

card.addEventListener("click",()=>{

cards.forEach(c=>{

if(c!==card && c.classList.contains("active")){

c.classList.add("closing");

setTimeout(()=>{
c.classList.remove("active");
c.classList.remove("closing");
},120);

}

});

card.classList.toggle("active");

});

});

cards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

card.style.setProperty("--x",x+"px");
card.style.setProperty("--y",y+"px");

});

});

},[]);

return (
  <>
<Navigimi />
<div className="faq">
<section className="faq-section">

<div className="background">
<div className="orb orb1"></div>
<div className="orb orb2"></div>
<div className="orb orb3"></div>
</div>

<h2 className="faq-title">Pyetje të Shpeshta</h2>

<div className="faq-container">

<div className="faq-card">
<div className="faq-question">
<span>A mund të marr makinën me qira për vetëm 1 ditë?</span>
<div className="icon">+</div>
</div>

<div className="faq-answer">
Po. Ju mund të rezervoni një makinë edhe për vetëm një ditë.
</div>
</div>

<div className="faq-card">
<div className="faq-question">
<span>A përfshihet sigurimi?</span>
<div className="icon">+</div>
</div>

<div className="faq-answer">
Të gjitha makinat përfshijnë sigurim bazë.
</div>
</div>

<div className="faq-card">
<div className="faq-question">
<span>A mund ta dorëzoj makinën në një qytet tjetër?</span>
<div className="icon">+</div>
</div>

<div className="faq-answer">
Po, ne ofrojmë opsionin e dorëzimit në qytete të ndryshme.
</div>
</div>

</div>

</section>
</div>
<Footer />
</>
);

}