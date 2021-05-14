# Local Stream Tools

For chat - use a client credentials flow to get an access token for `localstreamtoolsbot` and connect it to

- Chat commands, chatbot
  - General Purpose Chat Commands
    - Queues
    - Polls
    - Text output
  - Chat commands that interact with OBS
- Channel Events
  - Cheers
  - Subs
  - Hosts
  - Raids
- Donation events off of Twitch (Paypal, other providers?)

- Electron Application
- Run a local webserver
- Interact with OBS via OBS Websockets

* [] Build out twitch api/auth namespace
* [] Set up electron-store facade

12/1/2020

- Test the Twitch auth code
- Start building the Twitch API facades

12/15/2020

- Test the `second-instance` event vs using the `registerBufferProtocol` handler

Handling websocket connections:

My inclination is to move all heavy lifting to the main process, so both twitch chat and obs websocket are handled by `main` and `renderer` just uses IPC to subscribe to events via MessageChannels

## 05/13/2021

### To Do Today

- [] Re-confirm auth and chat is working
- [] Build a basic text output chat command
  - [] Need to be able to store/edit commands
- []
