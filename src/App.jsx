import React, { useState } from 'react';
import templates from './templates.json';
import { ChatInput } from './components/ChatInput';
import { MessageList } from './components/MessageList';
import { MediatorDialog } from './components/MediatorDialog';
import { TraitConfigTable } from './components/TraitConfigTable';
import { IncidentDialog } from './components/IncidentDialog';
import { ConversationSetting } from './components/ConversationSetting';
import {
  callOpenAI,
  createAssistant,
  createThread,
  sendMessageToAssistant,
} from './services/openai';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import {
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
} from '@mui/material';
import { grey } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: grey[900],
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [mediatorDialogOpen, setMediatorDialogOpen] = useState(false);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [dialogResponse, setDialogResponse] = useState('');
  const [incidentDialogText, setIncidentDialogText] = useState('');
  const [conversationSetting, setConversationSetting] = useState('');
  const [conversationScenario, setConversationScenario] = useState('');
  const [agentTurn, setAgentTurn] = useState('A');
  const [agentAId, setAgentAId] = useState('');
  const [agentBId, setAgentBId] = useState('');
  const [threadAId, setThreadAId] = useState('');
  const [threadBId, setThreadBId] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('engine1');
  const [agentTraits, setAgentTraits] = useState({
    agentA: { personName: '', traits: [] },
    agentB: { personName: '', traits: [] },
  });
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startChat = async () => {
    setIsLoading(true);
    const formattedAgentTraits = transformAgentData();
    const agentATraits =
      Array.isArray(formattedAgentTraits.agentA.traits) &&
      formattedAgentTraits.agentA.traits.length > 1
        ? JSON.stringify(formattedAgentTraits.agentA.traits)
        : templates.agentADefaultTraits;
    const agentBTraits =
      Array.isArray(formattedAgentTraits.agentB.traits) &&
      formattedAgentTraits.agentB.traits.length > 1
        ? JSON.stringify(formattedAgentTraits.agentB.traits)
        : templates.agentBDefaultTraits;
    if (selectedEngine === 'engine1') {
      const systemMessage = {
        role: 'system',
        content: formatString(templates.engine1SystemMessage, {
          personAName: formattedAgentTraits.agentA.personName,
          personBName: formattedAgentTraits.agentB.personName,
          agentATraits: agentATraits,
          agentBTraits: agentBTraits,
          conversationSetting: conversationSetting,
          conversationScenario: conversationScenario,
        }),
      };

      const initPrompt = {
        role: 'user',
        content: 'Start the conversation with Agent A.',
      };

      const reply = await callOpenAI([systemMessage, initPrompt]);
      setMessages([systemMessage, { role: 'assistant', content: `${reply}` }]);
      setChatStarted(true);
      setAgentTurn('B');
      setIsLoading(false);
    } else if (selectedEngine === 'engine2') {
      createAssistant(formattedAgentTraits.agentA.personName)
        .then((assistant) => {
          const agntAId = assistant.assistant_id;
          setAgentAId(agntAId);
          return createAssistant(formattedAgentTraits.agentB.personName).then(
            (assistant) => {
              const agntBId = assistant.assistant_id;
              setAgentBId(agntBId);
              return createThread().then((thrd) => {
                const tAId = thrd.thread_id;
                setThreadAId(tAId);
                return createThread().then((thrd) => {
                  const tBId = thrd.thread_id;
                  setThreadBId(tBId);
                  return sendMessageToAssistant(
                    agntAId,
                    tAId,
                    formatString(templates.engine2AgentAInstructions, {
                      personAName: formattedAgentTraits.agentA.personName,
                      personBName: formattedAgentTraits.agentB.personName,
                      agentTraits: agentATraits,
                      conversationSetting: conversationSetting,
                      conversationScenario: conversationScenario,
                      addedConflict: incidentDialogText,
                    }),
                    `Please continue the conversation as ${formattedAgentTraits.agentA.personName}.`,
                  );
                });
              });
            },
          );
        })
        .then((reply) => {
          setMessages([{ role: 'assistant', content: reply.response }]);
          setChatStarted(true);
          setAgentTurn('B');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const runAgentTurn = async () => {
    setIsLoading(true);
    const nextAgent = agentTurn === 'A' ? 'B' : 'A';
    if (selectedEngine === 'engine1') {
      const prompt = {
        role: 'user',
        content: `Next message should be from Agent ${agentTurn}. Add the human name of the agent so it is known who is talking. Continue the conversation staying true to the traits.`,
      };
      const updatedMessages = [...messages, prompt];
      const reply = await callOpenAI(updatedMessages);
      setMessages([...messages, { role: 'assistant', content: `${reply}` }]);
      setIsLoading(false);
    } else if (selectedEngine === 'engine2') {
      const formattedAgentTraits = transformAgentData();
      const currAgentObj =
        agentTurn === 'A'
          ? formattedAgentTraits.agentA
          : formattedAgentTraits.agentB;
      const agentId = agentTurn === 'A' ? agentAId : agentBId;
      const threadId = agentTurn === 'A' ? threadAId : threadBId;
      const agentDefaultTraitString =
        agentTurn === 'A'
          ? templates.agentADefaultTraits
          : templates.agentBDefaultTraits;
      const agentTraitString =
        Array.isArray(currAgentObj.traits) && currAgentObj.traits.length > 1
          ? JSON.stringify(currAgentObj.traits)
          : agentDefaultTraitString;
      sendMessageToAssistant(
        agentId,
        threadId,
        formatString(templates.engine2AgentAInstructions, {
          personAName: currAgentObj.personName,
          personBName:
            agentTurn === 'A'
              ? formattedAgentTraits.agentB.personName
              : formattedAgentTraits.agentA.personName,
          agentTraits: agentTraitString,
          conversationSetting: conversationSetting,
          conversationScenario: conversationScenario,
          addedConflict: incidentDialogText,
        }),
        `${messages.slice(-1)[0].content}`,
      ).then((reply) => {
        setMessages([
          ...messages,
          { role: 'assistant', content: reply.response },
        ]);
        setIsLoading(false);
      });
    }
    setAgentTurn(nextAgent);
  };

  const getNextAgentName = () => {
    return agentTurn === 'B'
      ? agentTraits.agentB.personName
      : agentTraits.agentA.personName;
  };
  const handleUserInput = async (userInput) => {
    setIsLoading(true);
    const formattedAgentTraits = transformAgentData();
    const currAgentObj =
      agentTurn === 'A'
        ? formattedAgentTraits.agentA
        : formattedAgentTraits.agentB;
    if (selectedEngine === 'engine1') {
      const userMsg = {
        role: 'user',
        content: `${currAgentObj.personName}: ${userInput}`,
      };
      const updated = [...messages, userMsg];
      setMessages(updated);

      const nextAgent = agentTurn === 'A' ? 'B' : 'A';
      const prompt = {
        role: 'user',
        content: `Now respond as Agent ${nextAgent}, continuing the tone and character.`,
      };
      const reply = await callOpenAI([...updated, prompt]);
      setMessages([...updated, { role: 'assistant', content: `${reply}` }]);
      setIsLoading(false);
    } else if (selectedEngine === 'engine2') {
      const userMsg = {
        role: 'user',
        content: `${currAgentObj.personName}: ${userInput}`,
      };
      const updated = [...messages, userMsg];
      setMessages(updated);
      const agentId = agentTurn === 'A' ? agentAId : agentBId;
      const threadId = agentTurn === 'A' ? threadAId : threadBId;
      const agentDefaultTraitString =
        agentTurn === 'A'
          ? templates.agentADefaultTraits
          : templates.agentBDefaultTraits;
      const agentTraitString =
        Array.isArray(currAgentObj.traits) && currAgentObj.traits.length > 1
          ? JSON.stringify(currAgentObj.traits)
          : agentDefaultTraitString;
      sendMessageToAssistant(
        agentId,
        threadId,
        formatString(templates.engine2AgentAInstructions, {
          personAName: currAgentObj.personName,
          personBName:
            agentTurn === 'A'
              ? formattedAgentTraits.agentB.personName
              : formattedAgentTraits.agentA.personName,
          agentTraits: agentTraitString,
          conversationSetting: conversationSetting,
          conversationScenario: conversationScenario,
          addedConflict: incidentDialogText,
        }),
        `${userInput}`,
      ).then((reply) => {
        setMessages([
          ...messages,
          { role: 'assistant', content: reply.response },
        ]);
        setIsLoading(false);
      });
    }
  };

  const handleMediatorRequest = async () => {
    setIsLoading(true);
    const formattedAgentTraits = transformAgentData();
    const currAgentObj =
      agentTurn === 'A'
        ? formattedAgentTraits.agentA
        : formattedAgentTraits.agentB;
    try {
      const systemResMessage = {
        role: 'system',
        content: formatString(templates.mediatorInstructions, {
          conversationSetting: conversationSetting,
          conversationScenario: conversationScenario,
          fullConversation: messages.map((msg) => `${msg.content}`).join('\n'),
          personAName: formattedAgentTraits.agentA.personName,
          personBName: formattedAgentTraits.agentA.personName,
        }),
      };

      const initResPrompt = {
        role: 'user',
        content: formatString(templates.mediatorPrompt, {
          personName: currAgentObj.personName,
        }),
      };

      const reply = await callOpenAI([systemResMessage, initResPrompt]);
      setDialogResponse(reply);
    } catch (error) {
      setDialogResponse('Error: ' + error.message);
    }
    setIsLoading(false);
  };

  const handleIncidentDialogText = (text) => {
    text = text.trim();
    if (text.length != 0) {
      const fullText = `While the conversation is going on, another conflicting scenario has occurred.
      Here is the new scenario: ${text}.`;
      setIncidentDialogText(fullText);
    } else {
      setIncidentDialogText('');
    }
  };

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  const addConflict = async () => {
    if (selectedEngine === 'engine1') {
      const systemConMessage = {
        role: 'system',
        content: incidentDialogText,
      };

      setMessages([...messages, systemConMessage]);
    }
    setIncidentDialogOpen(false);
  };

  function formatString(template, values) {
    return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || '');
  }

  function transformAgentData() {
    const output = {};

    for (const agent in agentTraits) {
      const data = agentTraits[agent];

      if (typeof data === 'string' || !data) {
        output[agent] = data;
      } else {
        const transformedTraits = {};

        for (const trait of data.traits) {
          transformedTraits[trait.traitName] = trait.value;
        }

        output[agent] = {
          personName: data.personName,
          traits: [transformedTraits],
        };
      }
    }
    return output;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-12'>
        <h1 className='text-3xl font-bold text-center mb-6'>
          {' '}
          &nbsp;AI Conflict Resolution Chat
        </h1>
        &nbsp;&nbsp;
        <FormLabel id='demo-radio-buttons-group-label'>
          Conflict resolution engine
        </FormLabel>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          &nbsp;&nbsp;
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            value={selectedEngine}
            disabled={chatStarted}
            onChange={handleEngineChange}
            name='radio-buttons-group'
          >
            <FormControlLabel
              value='engine1'
              disabled={chatStarted}
              control={<Radio />}
              label='Engine 1'
            />
            <FormControlLabel
              value='engine2'
              disabled={chatStarted}
              control={<Radio />}
              label='Engine 2'
            />
          </RadioGroup>
        </Box>
        <div className='w-full max-w-3xl'>
          {
            <div>
              &nbsp;&nbsp;
              <ConversationSetting
                conversationSetting={conversationSetting}
                setConversationSetting={setConversationSetting}
                conversationScenario={conversationScenario}
                setConversationScenario={setConversationScenario}
                isLocked={chatStarted}
              />
            </div>
          }
          {
            <div>
              <TraitConfigTable
                agentTraits={agentTraits}
                setAgentTraits={setAgentTraits}
                isLocked={chatStarted}
              />
              &nbsp;&nbsp;
              {!chatStarted && (
                <Button
                  variant='contained'
                  onClick={startChat}
                  disabled={
                    !agentTraits.agentA.personName ||
                    !agentTraits.agentB.personName ||
                    !conversationSetting ||
                    !conversationScenario ||
                    isLoading
                  }
                  className='mt-6 px-6 py-3 bg-green-700 text-white rounded-lg'
                >
                  Start Chat
                </Button>
              )}
              {chatStarted && (
                <Box sx={{ display: 'flex', m: 2, p: 2, alignItems: 'center' }}>
                  <MediatorDialog
                    isDisabled={messages.length <= 6}
                    setMediatorDialogOpen={setMediatorDialogOpen}
                    mediatorDialogOpen={mediatorDialogOpen}
                    dialogResponse={dialogResponse}
                    handleMediatorRequest={handleMediatorRequest}
                    isLoading={isLoading}
                  />
                  <IncidentDialog
                    isDisabled={messages.length <= 6}
                    setIncidentDialogOpen={setIncidentDialogOpen}
                    incidentDialogOpen={incidentDialogOpen}
                    incidentDialogText={incidentDialogText}
                    handleIncidentDialogText={handleIncidentDialogText}
                    addConflict={addConflict}
                    isLoading={isLoading}
                  />
                </Box>
              )}
            </div>
          }
          {chatStarted && (
            <>
              <div className='h-[500px] overflow-y-auto mb-4'>
                <MessageList messages={messages} />
              </div>
              &nbsp;&nbsp;
              {chatStarted && (
                <ChatInput
                  onSend={handleUserInput}
                  onContinue={runAgentTurn}
                  agentName={getNextAgentName()}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
