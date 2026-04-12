import '../carousel/carousel.css';
import alfaRomeo from '../../assets/carBrands/alfa-romeo.jpg';
import astonMartin from '../../assets/carBrands/aston-martin.jpg';
import audi from '../../assets/carBrands/audi.jpg';
import bentley from '../../assets/carBrands/bentley.jpg';
import bmw from '../../assets/carBrands/bmw.jfif';
import bugatti from '../../assets/carBrands/bugatti.jpg';
import byd from '../../assets/carBrands/byd.jpg';
import cadillac from '../../assets/carBrands/cadillac.jpg';
import chevrolet from '../../assets/carBrands/chevrolet.jpg';
import chrysler from '../../assets/carBrands/chrysler.jpg';
import citroen from '../../assets/carBrands/citroen.jpg';
import corvete from '../../assets/carBrands/corvete.jpg';
import dacia from '../../assets/carBrands/dacia.jpg';
import daimler from '../../assets/carBrands/daimler.jpg';
import dodge from '../../assets/carBrands/dodge.jpg';
import ferrari from '../../assets/carBrands/ferrari.jpg';
import fiat from '../../assets/carBrands/fiat.jfif';
import ford from '../../assets/carBrands/ford.jpg';
import genesis from '../../assets/carBrands/genesis.jpg';
import gmc from '../../assets/carBrands/gmc.jpg';
import honda from '../../assets/carBrands/honda.jpg';
import hummer from '../../assets/carBrands/hummer.jpg';
import hyundaai from '../../assets/carBrands/hyundai.jpg';
import infiniti from '../../assets/carBrands/infiniti.jpg';
import iveco from '../../assets/carBrands/iveco.jpg';
import jaguar from '../../assets/carBrands/jaguar.jpg';
import jeep from '../../assets/carBrands/jeep.jpg';
import kia from '../../assets/carBrands/kia.jpg';
import koenigsegg from '../../assets/carBrands/koenigsegg.jfif';
import lada from '../../assets/carBrands/lada.jpg';
import lamborghini from '../../assets/carBrands/lamborghini.jpg';
import lancia from '../../assets/carBrands/lancia.jpg';
import landRover from '../../assets/carBrands/land-rover.jpg';
import lexus from '../../assets/carBrands/lexus.jpg';
import lincoln from '../../assets/carBrands/lincoln.jpg';
import maserati from '../../assets/carBrands/maserati.jpg';
import maybach from '../../assets/carBrands/maybach.jpg';
import mazda from '../../assets/carBrands/mazda.jpg';
import mclaren from '../../assets/carBrands/mclaren.jpg';
import mercedesBenz from '../../assets/carBrands/mercedes-benz.jpg';
import mg from '../../assets/carBrands/mg.jpg';
import miniCooper from '../../assets/carBrands/mini-cooper.jpg';
import mitsubishi from '../../assets/carBrands/mitsubishi.jpg';
import nissan from '../../assets/carBrands/nissan.jpg';
import opel from '../../assets/carBrands/opel.jpg';
import pagani from '../../assets/carBrands/pagani.jfif';
import peugot from '../../assets/carBrands/peugot.jpg';
import polestar from '../../assets/carBrands/polestar.jpg';
import porsche from '../../assets/carBrands/porsche.jpg';
import proton from '../../assets/carBrands/proton.jpg';
import renault from '../../assets/carBrands/renault.jpg';
import rollsRoyce from '../../assets/carBrands/rolls-royce.jpg';
import saab from '../../assets/carBrands/saab.jpg';
import seat from '../../assets/carBrands/seat.jpg';
import skoda from '../../assets/carBrands/skoda.jpg';
import smart from '../../assets/carBrands/smart.jpg';
import subaru from '../../assets/carBrands/subaru.jpg';
import suzuki from '../../assets/carBrands/suzuki.jpg';
import tesla from '../../assets/carBrands/tesla.jpg';
import toyota from '../../assets/carBrands/toyota.jpg';
import volkswagen from '../../assets/carBrands/volkswagen.jpg';
import volvoo from '../../assets/carBrands/volvo.jpg';
import { useRef, useEffect } from 'react';

export default function Carousel() {
  const TrackRef = useRef(null);
  useEffect(() => {
    const track = TrackRef.current;
    if (!track) return;

    track.innerHTML += track.innerHTML;
  }, []);

  return (
    <>
      <div id="carousel">
        <div className="carousel-track" ref={TrackRef}>
          <div className="carousel-tag">
            <img src={alfaRomeo} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={astonMartin} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={audi} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={bentley} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={bmw} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={bugatti} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={byd} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={cadillac} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={chevrolet} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={chrysler} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={citroen} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={corvete} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={dacia} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={daimler} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={dodge} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={ferrari} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={fiat} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={ford} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={genesis} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={gmc} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={honda} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={hummer} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={hyundaai} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={infiniti} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={iveco} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={jaguar} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={jeep} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={kia} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={koenigsegg} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={lada} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={lamborghini} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={lancia} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={landRover} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={lexus} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={lincoln} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={maserati} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={maybach} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={mazda} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={mclaren} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={mercedesBenz} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={mg} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={miniCooper} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={mitsubishi} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={nissan} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={opel} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={pagani} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={peugot} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={polestar} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={porsche} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={proton} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={renault} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={rollsRoyce} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={saab} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={seat} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={skoda} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={smart} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={subaru} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={suzuki} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={tesla} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={toyota} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={volkswagen} alt="Marka e makines" />
          </div>
          <div className="carousel-tag">
            <img src={volvoo} alt="Marka e makines" />
          </div>
        </div>
      </div>
    </>
  );
}
