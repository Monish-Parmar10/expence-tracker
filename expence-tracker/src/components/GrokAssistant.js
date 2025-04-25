import { useState } from 'react';

function GrokAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askGrok = async () => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY_HERE'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: question }]
      })
    });

    const data = await response.json();
    setAnswer(data.choices[0].message.content);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Ask Grok Something Smart!</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g., How can I manage my expenses better?"
      />
      <button onClick={askGrok}>Ask Grok</button>

      {answer && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Grok says:</h4>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default GrokAssistant;