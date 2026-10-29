Machpadaco AgriTrace - Digital AgriculturalInput Accountability System
Fertilizer Module Pilot | Expandable to Seeds, Pesticides, Produce Traceability |3MTT x Meta AI Capstone
Brand
Module
Expandable
Status
Stack
<img src="public/img/logo.png" alt="Machpadaco Global Services Logo"width="120" style="border-radius:50%;" />
From Fertilizer Accountability to Full Agricultural Traceability.
1. Overview
Brand:
Machpadaco Global Services (machpadaco.com)
System:
Machpadaco AgriTrace
Colors:
Deep Navy
#0F172A
, Tech Blue
#1491A2
, Cyan
#06B6D4
Purpose:
Ensure government fertilizer reaches eligible farmers, every movementrecorded, farmers confirm receipt independently via simulated OTP.
Nature:
Prototype using
fictional data only
for 3MTT x Meta AI Capstonedemonstration.
Tagline:
From Fertilizer Accountability to Full Agricultural Traceability.
2. Problem Solved
Current input distribution suffers from:
Diversion of inputs between allocation and farm gate
Duplicate beneficiaries / same farmer registered multiple times
No independent receipt confirmation by farmers
No accountability dashboard to flag discrepancies
Silent editing and no audit trail
Machpadaco AgriTrace solves this by recording every movement and requiringfarmer-side confirmation.
3. Key Features (4 Screens)
Screen 1: Fair Beneficiary Selection - Farmer Registration
Inputs:
fid
,
fname
,
fcommunity
,
fcontact
,
fcrop
,
fstatus
,
freason
Eligibility:
Pending / Approved / Rejected
with
eligibilityReason
Safeguard: Duplicate
farmerId
check ->
isDuplicate: true
flag, auditTrail
DUPLICATE_ATTEMPT
Message:
Duplicate Farmer ID flagged - Machpadaco AgriTracesafeguard
Function:
registerFarmer()
POST
/api/farmers
Screen 2: Fertilizer Movement Tracking - Allocation
Inputs:
prog
,
ftype
,
acomm
,
abags
,
batch
,
dispatched
,
received
Model:
programmeName
,
fertilizerType
,
inputType: Fertilizer
,
community
,
bagsAllocated
,
batchRef
,
bagsDispatched
,
bagsReceivedAtCentre
Tracking: Virtuals
dispatchVariance
and
centreVariance
Function:
addAllocation()
POST
/api/allocations
-> Saved
Screen 3: Independent Receipt Confirmation - Distribution
Inputs:
rfid
,
rapproved
,
rissued
,
rreceived
,
rpoint
,
rotp
OTP:
POST /api/receipts/generate-otp
-> 6-digit simulated OTP, message:
Simulated OTP for Machpadaco AgriTrace prototype - not real SMS
Function
generateOTP()
displays in
otpDisplay
Confirmation:
confirmationMethod: Simulated OTP / Assisted Paper
,
otpCode
,
confirmationDate: new Date()
Auto-calc:
shortage = quantityIssued - quantityReceived
, if >0 sets
isDisputed: true
Function:
confirmReceipt()
POST
/api/receipts
-> Shortage flagged orConfirmed
Screen 4: Accountability Dashboard
Endpoint:
GET /api/dashboard
Calculations:
totalAllocated = sum(bagsAllocated)
totalDispatched = sum(bagsDispatched)
totalReceivedCentre = sum(bagsReceivedAtCentre)
totalIssued = sum(quantityIssued)
totalConfirmed = sum(quantityReceived)
flaggedDifference = totalDispatched - totalConfirmed
unconfirmedCount = receipts without confirmationDate
disputes = receipts where isDisputed
Example Logic:
If 1000 dispatched but 760 confirmed, 240 flagged -distinguishes confirmed shortages, awaiting confirmation, genuinelosses (fictional pilot)
Principle: Flags for authorized reviewers only, does NOT auto-accuse fraud
Function:
loadDashboard()
4. Architecture
Machpadaco_AgriTrace/
├── server.js
├── package.json
├── README.md
├── .env.example
├── models/
│ ├── Farmer.js (PascalCase)
│ ├── Allocation.js
│ └── Receipt.js
├── routes/
│ ├── farmers.js (lowercase plural)
│ ├── allocations.js
│ ├── receipts.js
│ └── dashboard.js
├── public/
│ ├── index.html
│ ├── img/
│ │ └── logo.png
│ ├── css/
│ │ └── style.css
│ └── js/
│ └── app.js
Backend:
Node.js + Express + Mongoose + MongoDB Atlas
Models:
Farmer.js
,
Allocation.js
,
Receipt.js
(PascalCase standard)
Routes:
farmers.js
,
allocations.js
,
receipts.js
,
dashboard.js
(lowercase plural)
Frontend:
public/index.html
(with
img/logo.png
favicon + branded header),
public/css/style.css
(brand colors #0F172A #1491A2 #06B6D4, fullyresponsive across <480px to 1400px+),
public/js/app.js
(5 async functions)
Server:
server.js
serves static from
public/
, mounts APIs
/api/farmers
,
/api/allocations
,
/api/receipts
,
/api/dashboard
, health check at
/health
Health response:
{
"brand"
:
"Machpadaco Global Services"
,
"system"
:
"Machpadaco AgriTrace"
,
"module"
:
"Fertilizer Pilot"
,
"status"
:
"running"
,
"note"
:
"Fictional data only - 3MTT x Meta Capstone"
}
5. Safeguards
Fictional data only
- No real government data
Simulated OTP
-
function generateOTP() { return 6-digit }
- not realSMS
No auto fraud accusation
- Dashboard flags are for investigation, wording:
Flagged for review, not accusation
Audit Trail
-
auditTrail: [{ action, by, at, reason }]
in Farmer andReceipt models
No silent editing
- pre-save hooks log every change
Separation of duties
- farmer confirms receipt independently from allocator
Privacy:
contact
field stored but protected, not exposed publicly
6. Future Expansion
This same architecture expands beyond fertilizer:
Current
Future Module
Change
Fertilizer
Seeds Module
fertilizerType
->
seedType
Fertilizer
Pesticides Module
fertilizerType
->
pesticideType
Fertilizer
Produce Traceability
inputType: Produce
+ origin tracking
Same audit trail, same receipt logic, same dashboard principle. Brand MachpadacoAgriTrace is intentionally expandable.
Badge in UI:
EXPANDABLE TO SEEDS • PESTICIDES • PRODUCE
7. How to Run Locally
# 1. Clone and install
cd
Machpadaco_AgriTrace
npm
install
# 2. Env
cp
.env.example
.env
# Edit .env:
# PORT=3000
# MONGO_URI=mongodb://localhost:27017/machpadaco_agritrace
# or MongoDB Atlas URI
# 3. Run
npm
start
# or dev
npm
run
dev
# 4. Open
http://localhost:3000
# 5. Test health
http://localhost:3000/health
# 6. Test APIs
GET
http://localhost:3000/api/farmers
GET
http://localhost:3000/api/allocations
GET
http://localhost:3000/api/receipts
GET
http://localhost:3000/api/dashboard
8. Deployment
Render / Railway / Cyclic:
Build Command:
npm install
Start Command:
node server.js
Env Vars:
MONGO_URI
,
PORT
MongoDB Atlas whitelist Render IP or allow all
0.0.0.0/0
Live Demo:
https://machpadaco-agrictrace.onrender.com
e.g.,
https://machpadaco-agritrace.onrender.com
9. Tech Stack
Built with:
Llama (Meta AI at meta.ai), Node.js, Express, MongoDB, Mongoose
Frontend:
HTML5, CSS3 (responsive, brand colors), Vanilla JS (fetchasync/await)
Backend:
Express 4.18.2, Mongoose 8.0.0, CORS, dotenv
Branding:
Deep Navy #0F172A, Tech Blue #1491A2, Cyan #06B6D4
Logo:
public/img/logo.png
used as favicon, header logo
.brand-logo
(80px desktop, 50px <480px) and footer
.brand-logo-small
10. Author & Capstone
Author:
Machpadaco Global Services - machpadaco.com
System:
Machpadaco AgriTrace - Digital Agricultural Input AccountabilitySystem
Programme:
3MTT x Meta AI Capstone
Module:
Fertilizer Pilot (1000 bags pilot example: 760 confirmed vs 240 flagged)
Disclaimer:
Prototype for demonstration using fictional data only, not connectedto any government system. Simulated OTP is not real SMS. Flags are for authorizedreview, not automatic fraud accusation.
Quick Start API Test (Fictional)
// Register Farmer
POST
/
api
/
farmers
{
"farmerId"
:
"FAR-RIV-001"
,
"name"
:
"Amina Bello"
,
"community"
:
"Oyo"
,
"eligibi
// Add Allocation
POST
/
api
/
allocations
{
"community"
:
"Oyo"
,
"bagsAllocated"
:
1000
,
"bagsDispatched"
:
1000
,
"bagsReceiv
// Generate OTP
POST
/
api
/
receipts
/
generate
-
otp
->
{ otp:
"482901"
, message:
"Simulated OTP f
// Confirm Receipt
POST
/
api
/
receipts
{
"farmerId"
:
"FAR-RIV-001"
,
"quantityIssued"
:
5
,
"quantityReceived"
:
4
,
"confir
// Dashboard
GET
/
api
/
dashboard
->
{ totalDispatched:
1000
, totalConfirmed:
760
, flaggedDiff
© Machpadaco Global Services | #0F172A #1491A2 #06B6D4