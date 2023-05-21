import React, { useEffect } from 'react';

const BioDigitalComponent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developer.biodigital.com/builds/api/2/human-api.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <iframe
        id="myWidget"
        src="https://human.biodigital.com/widget?id=production/maleAdult/male_system_anatomy_skeletal_09&ui-info=false&ui-menu=false"
        width="100%"
        height="100%"
      ></iframe>
      <div id="messages">
        <a id="head" href="#">Fly to Head</a>
        <a id="foot" href="#">Fly to Foot</a>
        <a id="left" href="#">Rotate Left</a>
        <a id="right" href="#">Rotate Right</a>
      </div>
    </div>
  );
};

export default BioDigitalComponent;
