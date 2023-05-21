import React, { useEffect } from 'react';

const BioDigitalComponent = ({ tour = "appendicitis_v02" }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developer.biodigital.com/builds/api/2/human-api.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const apiKey = "eb52c806e7d5ac9bcdd93662ab6d708639fc415e";
  const widgetUrl = `https://human.biodigital.com/widget/?m=${tour}&dk=${apiKey}`;
  // TODO: handle the following case: https://human.biodigital.com/widget?id=production/maleAdult/${tour}&ui-info=false&ui-menu=false;

  return (
    <div>
      <iframe
        id={`visualize_${tour}`}
        src={widgetUrl}
        title="BioDigital Human"
        width="100%"
        height="400px"
      ></iframe>
    </div>
  );
};

export default BioDigitalComponent;
