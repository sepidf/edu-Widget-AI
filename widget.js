function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-GB';

  recognition.onresult = function(event) {
    const userSpeech = event.results[0][0].transcript;
    document.getElementById("ai-response").innerText = "You said: " + userSpeech;

    fetch("https://your-vercel-url.vercel.app/api/gpt-explain", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ question: userSpeech })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("ai-response").innerText = data.text;

      return fetch("https://your-vercel-url.vercel.app/api/speak", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: data.text })
      });
    })
    .then(res => res.json())
    .then(data => {
      const audio = document.getElementById("ai-audio");
      audio.src = data.audioUrl;
      audio.style.display = "block";
      audio.play();
    });
  };

  recognition.start();
}
