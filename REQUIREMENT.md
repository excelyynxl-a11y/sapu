## Background
This is a project chosen from list provided by Shortcut Asia. The purpose of this project is for Shortcut Asia to shortlist potential intern via a mini hackathon of developing a mini application with little feature. Candidates will need to develop the app, publish / record journey on git repository, deploy. If shortlisted, candidates will beinvited to a pitch session (26 August tentatively):
- Walk us through how you'd add or change a feature in your app
- Why did you choose this approach?
- What assumptions does your solution make?
- How did you check that it behaves correctly?
- What alternatives did you consider?
- Did you reject or rework any AI suggestions? Why?
- What risks or uncertainties are left?
- If you released this tomorrow, what would you check first?
- What did you decide not to build, because it mattered less?
- Where might a user get confused or lose trust in the flow?
- What changed once you actually used the app yourself?

## What we're looking for
We care about how you think, not just what you build. Specifically:
• A systematic approach. Evidence that you planned, worked in steps, and made deliberate decisions rather than piling things on until it ran.
• Understanding the problem. You grasp what the app is for, who uses it, and where its limits are.
• Understanding your own solution. You can explain how it works, even in broad strokes, and why it's built the way it is.
• Sound reasoning. You can talk through the choices you made, the alternatives you weighed, and the tradeoffs.
• Honest reflection. You know what's unfinished, what's uncertain, and what you'd check before real users touched it.
• Ownership. You stand behind everything you submit, including the parts an AI helped you write.

## What we're not looking for
Skip these. They won't help your score, and chasing them usually hurts it:
- Decorative polish. A beautiful UI on top of a workflow you don't understand.
- Feature volume. More features is not more impressive. It's usually less.
- Cinematic demos. A flashy video won't cover for a shaky product. Keep the demo simple and honest.
- Time-maxxing. Spending the whole window on this to look committed. We'd rather you spent 10 focused hours.

## How to approach
- Plan for roughly 8 to 12 hours of work. The build window exists so you can fit this around classes and life, not so you can pour 60 hours into something huge. We are not scoring effort. A small, complete, well-understood app beats a large, impressive one you can't explain.
- Go deep, not wide. Two solid features you fully understand are worth more than ten half-built ones. 
- Pick one meaningful problem and do it properly.
- Understand what you build. By the end, you should be able to explain what your app does, why you made the choices you made, how it works under the hood, and where it falls short. If you can't explain a part of it, that part isn't finished.

## Topic chosen: Cash-Flow Forecaster
Plug in your income and recurring bills, and see your projected balance across the month so you know when things get tight.
### CORE FEATURES
Add income and recurring expenses, and a forecast view.
### THE HARD PART
Bills land on different cycles (weekly, monthly, that one annual renewal), and the useful output is the exact day your balance dips lowest. Modelling those overlapping cycles correctly is where it lives
### DEPLOYEMENT
Sapu must be deployable.

## My idea: 
### Tech Stack
Frontend: React, Lucide-React, Rechart, Axios, Zustand

Backend: Algo / data structures / object-oriented programming in python (will be tested with test cases in python), simple auth using JWT token, FastAPI

Testing: python's unittest, pytest

Deployment: Render or Vercel

### Relevant DSA
k-way sort, sweep line algo, heap

### User flow
1. Authentication: Create account, login, logout
2. Features: key in recurring expenses amount / cycle / name (flow-out), recurring income amount / cycle / name (flow-in), non-recurring income amount / name / date, non-recurring expenses amount / date / name, toggle button for forecast_window (eg: 7 days, 14 days, 1 month, 3 month).
3. Financial security goals: user set a minimum threshold that their money should always be above.
4. Alert: forecast risk / duration / time where user will face risk of dropping below threshold
5. Charts: Rechart display of forecast_window

### How to stand-out
1. Optimise algorithm efficiency (compare algo alternative, select most efficient)
2. Test cases to ensure correctiveness
3. Usability for easy usage for non-tech users
4. Small simple app but focus more on the emphasis function required - [go to Topic Chosen: Cash-Flow Forecaster](#topic-chosen-cash-flow-forecaster)

### How to start
1. Folder - backend, frontend
2. Install dependencies - backend (bcrypt, jwt, mongoose, fastapi), frontend (react, lucide-react, axios, zustand)
3. Setup secrets: backend/.env with MONGURI
4. Code classes, methods, logics, algo, dsa
5. Test and correct (4)
6. Translate to js, create route, controller, api calls 
7. Start frontend, setup zustand + axios, integrate backend to frontend 
8. Deploy

### IF WE HAVE TIME, CAN CONSIDER
1. Authentication using GoogleOAuth  
2. App aesthetics and customisation