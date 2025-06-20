export const callOpenAI = async (messages) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await response.json();
  return data.reply;
};

export const createAssistant = async (assistantName) => {
  console.log('Creating assistant with name:', assistantName);
  const response = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: assistantName }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const createThread = async () => {
  const response = await fetch('/api/thread', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
};

export const sendMessageToAssistant = async (
  assistantId,
  threadId,
  instructions,
  message,
) => {
  const response = await fetch('/api/assistantresponse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assistantId, threadId, instructions, message }),
  });
  const data = await response.json();
  return data;
};
