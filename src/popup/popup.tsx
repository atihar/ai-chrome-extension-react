import React, { useEffect, useState } from 'react';

function Popup() {
  const [pageText, setPageText] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to call the AI API to generate content based on the extracted text
  const generateContent = async (text) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate content based on the following text: ${text}`,
          max_tokens: 100,
          model: 'text-davinci-003'
        })
      });
      const data = await response.json();
      setGeneratedContent(data.choices[0].text);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to listen for messages from the content script
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'PAGE_TEXT') {
        setPageText(message.text);
        generateContent(message.text);
      }
    });
  }, []);

  return (
    <div style={{ width: '400px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>AI Content Generator</h1>
      
      <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>Extracted Text</h2>
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '20px', maxHeight: '150px', overflowY: 'auto' }}>
        {pageText || 'No text extracted from the page.'}
      </div>

      <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>Generated Content</h2>
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
        {loading ? 'Generating content...' : generatedContent || 'No content generated yet.'}
      </div>
    </div>
  );
}

export default Popup;