import logo from './logo.svg';
import './App.css';
import { AnalyticsBrowser } from '@segment/analytics-next'
import * as sessionReplay from "@amplitude/session-replay-browser";
import React, { useEffect, useState } from 'react';

function App() {

  var amplitudeSessionId = Date.now(); // Replace with actual session ID logic
  console.log(amplitudeSessionId);

  const AMPLITUDE_API_KEY = "c50a2971ed2cf7bf1072f1aabbfb5a96";

  const SegmentAnalytics = AnalyticsBrowser.load({
    writeKey: "uUC2dDHmdMbfcd4LMjSa7fhMySFEA600",
  });
  console.log(SegmentAnalytics.instance?.user().anonymousId() + "HELLO");

  const [anonymousId, setAnonymousId] = useState('');
  console.log(anonymousId)
  useEffect(() => {
    const loadAnalytics = async () => {
      const [response] = await AnalyticsBrowser.load({ writeKey: 'uUC2dDHmdMbfcd4LMjSa7fhMySFEA600' });

      // Identify user to ensure the anonymous ID is set
      response.identify();

      // Retrieve the anonymous ID
      const id = response.user().anonymousId();
      setAnonymousId(id);

      console.log('Anonymous ID:', id);
    };
    loadAnalytics();
  }, []);


  sessionReplay.init(AMPLITUDE_API_KEY, {
    deviceId: anonymousId,
    sessionId: amplitudeSessionId,
    sampleRate: 1
   })

  SegmentAnalytics.identify("TestUser1", {}, {
    "integrations": {
      "Amplitude": {
        "session_id": amplitudeSessionId
      }
    }
  })

  const sessionReplayProperties = sessionReplay.getSessionReplayProperties();
  console.log(sessionReplayProperties)

  useEffect(() => {
    const handleButtonClick1 = () => {
      const sessionReplayProperties = sessionReplay.getSessionReplayProperties();
      console.log(sessionReplayProperties)
      console.log('Button 1 clicked');

      SegmentAnalytics.track("ButtonClicked", {
        "buttonName": "Button One",
        ...sessionReplayProperties
      }, {
        "integrations": {
          "Amplitude": {
            "session_id": amplitudeSessionId
          }
        }
      })
    };

    const handleButtonClick2 = () => {
      const sessionReplayProperties = sessionReplay.getSessionReplayProperties();
      console.log(sessionReplayProperties)
      console.log('Button 2 clicked');

      SegmentAnalytics.track("ButtonClicked", {
        "buttonName": "Button Two",
        ...sessionReplayProperties
      }, {
        "integrations": {
          "Amplitude": {
            "session_id": amplitudeSessionId
          }
        }
      })
    };

    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    button1.addEventListener('click', handleButtonClick1);
    button2.addEventListener('click', handleButtonClick2);

    // Cleanup function to remove event listeners
    return () => {
      button1.removeEventListener('click', handleButtonClick1);
      button2.removeEventListener('click', handleButtonClick2);
    };
  }, []);

  return (
    <div>
      <h1>Simple React App with Two Buttons</h1>
      <button id="button1">Button 1</button>
      <button id="button2">Button 2</button>
    </div>
  );
};

export default App;
