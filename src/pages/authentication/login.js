import { useState, useRef, useEffect } from "react";
import API from "../../backendConnection/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../backendConnection/context";
import "../authentication/auth.css";
import { Link } from "react-router-dom";
    
const FP_STYLES = `
.fp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 40, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.fp-overlay.visible {
  opacity: 1;
  pointer-events: all;
}
.fp-wrap {
  position: relative;
  width: 120px;
  height: 120px;
}
.fp-circle {
  background-color: #077ff2;
  border-radius: 50%;
  height: 120px;
  width: 120px;
  position: absolute;
  top: 0; left: 0;
  transform: scale(0);
  animation: fpPulse 1000ms ease-out infinite;
}
.fp-circle.secon { animation-delay: 500ms; }
@keyframes fpPulse {
  0%   { opacity: 1; transform: scale(0.1); }
  100% { opacity: 0; transform: scale(1);   }
}
.fp-spinner {
  position: absolute;
  inset: 0;
  border: 4px solid #bbbbbb;
  border-left-color: #1ECD97;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.25s;
  animation: fpSpin 1s linear infinite;
}
.fp-spinner.show { opacity: 1; }
@keyframes fpSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.fp-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fp-svg {
  opacity: 0;
  position: absolute;
  stroke: #777;
  transition: opacity 300ms;
}
.fp-svg.fp-active-svg { stroke: #ffffff; }
.fp-out { opacity: 1; }
.fp-odd  { stroke-dasharray: 0px 50px;  stroke-dashoffset: 1px;   transition: stroke-dasharray 1ms; }
.fp-even { stroke-dasharray: 50px 50px; stroke-dashoffset: -41px; transition: stroke-dashoffset 1ms; }

.fp-wrap.active .fp-svg {
  opacity: 1;
  transition: opacity 200ms 100ms;
}
.fp-wrap.active .fp-base .fp-odd {
  stroke-dasharray: 50px 50px;
  transition: stroke-dasharray 700ms 5ms;
}
.fp-wrap.active .fp-base .fp-even {
  stroke-dashoffset: 0px;
  transition: stroke-dashoffset 250ms;
}
.fp-wrap.active .fp-active-svg .fp-odd {
  stroke-dasharray: 50px 50px;
  transition: stroke-dasharray 1800ms 400ms;
}
.fp-wrap.active .fp-active-svg .fp-even {
  stroke-dashoffset: 0px;
  transition: stroke-dashoffset 1400ms 20ms;
}
.fp-wrap.active .fp-out {
  opacity: 0;
  transition: opacity 300ms 1600ms;
}
.fp-tick-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fp-circ {
  opacity: 0;
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  transition: all 0.7s ease;
}
.fp-tick-path {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  transition: stroke-dashoffset 0.7s 0.35s ease-out;
}
.fp-tick-wrap.drawn .fp-circ {
  opacity: 1;
  stroke-dashoffset: 0;
}
.fp-tick-wrap.drawn .fp-tick-path {
  stroke-dashoffset: 0;
}
`;

const FP_PATHS = (
  <>
    <path className="fp-odd"  d="m 25.117139,57.142857 c 0,0 -1.968558,-7.660465 -0.643619,-13.149003 1.324939,-5.488538 4.659682,-8.994751 4.659682,-8.994751" />
    <path className="fp-odd"  d="m 31.925369,31.477584 c 0,0 2.153609,-2.934998 9.074971,-5.105078 6.921362,-2.17008 11.799844,-0.618718 11.799844,-0.618718" />
    <path className="fp-odd"  d="m 57.131213,26.814448 c 0,0 5.127709,1.731228 9.899495,7.513009 4.771786,5.781781 4.772971,12.109204 4.772971,12.109204" />
    <path className="fp-odd"  d="m 72.334009,50.76769 0.09597,2.298098 -0.09597,2.386485" />
    <path className="fp-even" d="m 27.849282,62.75 c 0,0 1.286086,-1.279223 1.25,-4.25 -0.03609,-2.970777 -1.606117,-7.675266 -0.625,-12.75 0.981117,-5.074734 4.5,-9.5 4.5,-9.5" />
    <path className="fp-even" d="m 36.224282,33.625 c 0,0 8.821171,-7.174484 19.3125,-2.8125 10.491329,4.361984 11.870558,14.952665 11.870558,14.952665" />
    <path className="fp-even" d="m 68.349282,49.75 c 0,0 0.500124,3.82939 0.5625,5.8125 0.06238,1.98311 -0.1875,5.9375 -0.1875,5.9375" />
    <path className="fp-odd"  d="m 31.099282,65.625 c 0,0 1.764703,-4.224042 2,-7.375 0.235297,-3.150958 -1.943873,-9.276886 0.426777,-15.441942 2.370649,-6.165056 8.073223,-7.933058 8.073223,-7.933058" />
    <path className="fp-odd"  d="m 45.849282,33.625 c 0,0 12.805566,-1.968622 17,9.9375 4.194434,11.906122 1.125,24.0625 1.125,24.0625" />
    <path className="fp-even" d="m 59.099282,70.25 c 0,0 0.870577,-2.956221 1.1875,-4.5625 0.316923,-1.606279 0.5625,-5.0625 0.5625,-5.0625" />
    <path className="fp-even" d="m 60.901059,56.286612 c 0,0 0.903689,-9.415996 -3.801777,-14.849112 -3.03125,-3.5 -7.329245,-4.723939 -11.867187,-3.8125 -5.523438,1.109375 -7.570313,5.75 -7.570313,5.75" />
    <path className="fp-even" d="m 34.072577,68.846248 c 0,0 2.274231,-4.165782 2.839205,-9.033748 0.443558,-3.821814 -0.49394,-5.649939 -0.714206,-8.05386 -0.220265,-2.403922 0.21421,-4.63364 0.21421,-4.63364" />
    <path className="fp-odd"  d="m 37.774165,70.831845 c 0,0 2.692139,-6.147592 3.223034,-11.251208 0.530895,-5.103616 -2.18372,-7.95562 -0.153491,-13.647655 2.030229,-5.692035 8.108442,-4.538898 8.108442,-4.538898" />
    <path className="fp-odd"  d="m 54.391174,71.715729 c 0,0 2.359472,-5.427681 2.519068,-16.175068 0.159595,-10.747388 -4.375223,-12.993087 -4.375223,-12.993087" />
    <path className="fp-even" d="m 49.474282,73.625 c 0,0 3.730297,-8.451831 3.577665,-16.493718 -0.152632,-8.041887 -0.364805,-11.869326 -4.765165,-11.756282 -4.400364,0.113044 -3.875,4.875 -3.875,4.875" />
    <path className="fp-even" d="m 41.132922,72.334447 c 0,0 2.49775,-5.267079 3.181981,-8.883029 0.68423,-3.61595 0.353553,-9.413359 0.353553,-9.413359" />
    <path className="fp-odd"  d="m 45.161782,73.75 c 0,0 1.534894,-3.679847 2.40625,-6.53125 0.871356,-2.851403 1.28125,-7.15625 1.28125,-7.15625" />
    <path className="fp-odd"  d="m 48.801947,56.125 c 0,0 0.234502,-1.809418 0.109835,-3.375 -0.124667,-1.565582 -0.5625,-3.1875 -0.5625,-3.1875" />
  </>
);
const FingerprintOverlay = ({ active }) => {
  const wrapRef    = useRef(null);
  const spinnerRef = useRef(null);
  const tickRef    = useRef(null);

  // Inject CSS once
  useEffect(() => {
    if (document.getElementById("fp-styles")) return;
    const tag = document.createElement("style");
    tag.id = "fp-styles";
    tag.textContent = FP_STYLES;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    if (!active) return;

    const wrap    = wrapRef.current;
    const spinner = spinnerRef.current;
    const tick    = tickRef.current;

    spinner.classList.add("show");

    setTimeout(() => {
      wrap.classList.add("active");
      spinner.classList.remove("show");
    }, 300);

    setTimeout(() => {
      tick.classList.add("drawn");
    }, 1800);
  }, [active]);

  return (
    <div className={`fp-overlay${active ? " visible" : ""}`}>
      <div className="fp-wrap" ref={wrapRef}>
        <div className="fp-circle" />
        <div className="fp-circle secon" />
        <div className="fp-spinner" ref={spinnerRef} />

        <div className="fp-inner">
          <svg className="fp-svg fp-base" xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="3 3 100 100">
            <g className="fp-out" fill="none" strokeWidth="2" strokeLinecap="round">
              {FP_PATHS}
            </g>
          </svg>
          <svg className="fp-svg fp-active-svg" xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="3 3 100 100">
            <g className="fp-out" fill="none" strokeWidth="2" strokeLinecap="round">
              {FP_PATHS}
            </g>
          </svg>
        </div>

        <div className="fp-tick-wrap" ref={tickRef}>
          <svg viewBox="0 0 37 37" width="90" height="90">
            <path
              className="fp-circ"
              style={{ fill: "none", stroke: "#1ECD97", strokeWidth: 1, strokeLinejoin: "round", strokeMiterlimit: 10 }}
              d="M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
            />
            <polyline
              className="fp-tick-path"
              style={{ fill: "none", stroke: "#1ECD97", strokeWidth: 2, strokeLinejoin: "round", strokeMiterlimit: 10 }}
              points="11.6,20 15.9,24.2 26.4,13.8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [form, setForm]                 = useState({ email: "", password: "" });
  const { login }                       = useAuth();
  const navigate                        = useNavigate();
  const [fingerActive, setFingerActive] = useState(false);
  const [showPass,  setShowPass]        = useState(false);
  const [showE1,    setShowE1]          = useState(false);
  const [showE2,    setShowE2]          = useState(false);
  const [shakeUser, setShakeUser]       = useState(false);
  const [shakePass, setShakePass]       = useState(false);
  const [btnText,   setBtnText]         = useState("Kyçu");
  const [cardStyle, setCardStyle]       = useState({});
  const btnRef = useRef(null);

  function handleMouseMove(e) {
    const r = btnRef.current.getBoundingClientRect();
    btnRef.current.style.setProperty("--x", e.clientX - r.left + "px");
    btnRef.current.style.setProperty("--y", e.clientY - r.top + "px");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();

    let ok = true;
    if (!form.email.trim())    { setShowE1(true);  setShakeUser(true); ok = false; } else setShowE1(false);
    if (!form.password.trim()) { setShowE2(true);  setShakePass(true); ok = false; } else setShowE2(false);
    setTimeout(() => { setShakeUser(false); setShakePass(false); }, 400);
    if (!ok) return;

    try {
      setBtnText("...");
      const res = await API.post("/auth/login", form);

      login({ token: res.data.token, user: res.data.user });

      setFingerActive(true);
      setTimeout(() => {
        if (res.data.user?.role === "admin") navigate("/dashboard");
        else navigate("/");
      }, 2200);

    } catch (err) {
      setBtnText("Kyçu");
      alert(err.response?.data?.message || "Email ose fjalëkalim i gabuar");
    }
  }

  function goToSignup(e) {
    e.preventDefault();
    setCardStyle({ transition: ".35s", opacity: "0", transform: "translateY(15px)" });
    setTimeout(() => { window.location = "/signup"; }, 350);
  }

  return (
    <div className="loginForm">
      <FingerprintOverlay active={fingerActive} />

      <div className="card fade-slide" id="card" style={cardStyle}>
        <h1>Kyçu</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              name="email" type="email" placeholder=" "
              autoComplete="off" value={form.email}
              onChange={handleChange}
              className={shakeUser ? "shake" : ""} required
            />
            <label>Email</label>
            <div className="error" style={{ display: showE1 ? "block" : "none" }}>Plotëso email</div>
          </div>

          <div className="field">
            <input
              name="password" type={showPass ? "text" : "password"}
              placeholder=" " value={form.password}
              onChange={handleChange}
              className={shakePass ? "shake" : ""} required
            />
            <span className="toggle" onClick={() => setShowPass(!showPass)}>👁</span>
            <label>Password</label>
            <div className="error" style={{ display: showE2 ? "block" : "none" }}>Plotëso password</div>
          </div>

          <button id="btn" ref={btnRef} onMouseMove={handleMouseMove} type="submit">
            {btnText}
          </button>
        </form>

        <div className="links">
          <Link to="/">Keni harruar fjalëkalimin?</Link>
          <Link to="/signup" id="toSignup" onClick={goToSignup}>Regjistrohu</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;