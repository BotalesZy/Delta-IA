import "../pages/css/movile/authM.css";

export default function OrientationBlocker() {
  return (
    <div id="bloqueo-orientacion">

      <div className="contenido-bloqueo">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          className="icono-giro"
        >

          <rect
            x="10"
            y="10"
            width="300"
            height="492"
            rx="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
          />

          <rect
            x="110"
            y="22"
            width="100"
            height="12"
            rx="6"
            fill="currentColor"
          />

          <circle
            cx="160"
            cy="465"
            r="8"
            fill="currentColor"
          />

        </svg>


        <h2>Hey, You're Missing Out!</h2>

        <p>
          This page works on Vertical mode
          <br />
          Please rotate your phone to continue
        </p>

      </div>

    </div>
  );
}