# SmartCrick Pro - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All match endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Match Endpoints

### 1. Create Match
**POST** `/api/matches`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "groundName": "Eden Gardens",
  "location": "Kolkata",
  "totalOvers": 5,
  "teamA": {
    "name": "Mumbai Indians",
    "players": [
      "Rohit Sharma", "Ishan Kishan", "Suryakumar Yadav",
      "Tilak Varma", "Hardik Pandya", "Tim David",
      "Krunal Pandya", "Jasprit Bumrah", "Piyush Chawla",
      "Jofra Archer", "Trent Boult"
    ]
  },
  "teamB": {
    "name": "Chennai Super Kings",
    "players": [
      "MS Dhoni", "Ruturaj Gaikwad", "Devon Conway",
      "Ajinkya Rahane", "Shivam Dube", "Ravindra Jadeja",
      "Moeen Ali", "Deepak Chahar", "Tushar Deshpande",
      "Matheesha Pathirana", "Maheesh Theekshana"
    ]
  },
  "battingTeam": "Mumbai Indians"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Match created successfully",
  "data": {
    "_id": "match_id_here",
    "groundName": "Eden Gardens",
    "location": "Kolkata",
    "matchDate": "2025-11-16T12:00:00.000Z",
    "totalOvers": 5,
    "teamA": { "name": "Mumbai Indians", "players": [...] },
    "teamB": { "name": "Chennai Super Kings", "players": [...] },
    "battingTeam": "Mumbai Indians",
    "bowlingTeam": "Chennai Super Kings",
    "status": "setup",
    ...
  }
}
```

---

### 2. Start Match (Select Players)
**POST** `/api/matches/:id/start`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "striker": "Rohit Sharma",
  "nonStriker": "Ishan Kishan",
  "bowler": "Deepak Chahar"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Match started successfully",
  "data": {
    "_id": "match_id",
    "striker": {
      "name": "Rohit Sharma",
      "runs": 0,
      "balls": 0,
      "fours": 0,
      "sixes": 0
    },
    "nonStriker": {
      "name": "Ishan Kishan",
      "runs": 0,
      "balls": 0,
      "fours": 0,
      "sixes": 0
    },
    "currentBowler": {
      "name": "Deepak Chahar",
      "overs": 0,
      "balls": 0,
      "runs": 0,
      "wickets": 0,
      "maidens": 0
    },
    "status": "innings1",
    ...
  }
}
```

---

### 3. Update Score (Ball by Ball)
**POST** `/api/matches/:id/score`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body Examples:**

**Normal Ball (4 runs):**
```json
{
  "runs": 4,
  "isWide": false,
  "isNoBall": false,
  "isWicket": false
}
```

**Wide Ball:**
```json
{
  "runs": 0,
  "isWide": true,
  "isNoBall": false,
  "isWicket": false
}
```

**Wicket:**
```json
{
  "runs": 0,
  "isWide": false,
  "isNoBall": false,
  "isWicket": true,
  "newBatsman": "Suryakumar Yadav"
}
```

**Change Bowler (after over):**
```json
{
  "runs": 0,
  "isWide": false,
  "isNoBall": false,
  "isWicket": false,
  "newBowler": "Matheesha Pathirana"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Score updated successfully",
  "data": {
    "_id": "match_id",
    "currentInnings": 1,
    "innings1": {
      "battingTeam": "Mumbai Indians",
      "runs": 45,
      "wickets": 2,
      "overs": 4,
      "balls": 24
    },
    "striker": { ... },
    "nonStriker": { ... },
    "currentBowler": { ... },
    "ballByBall": [ ... ],
    "status": "innings1",
    ...
  }
}
```

---

### 4. Get Match by ID
**GET** `/api/matches/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "match_id",
    "groundName": "Eden Gardens",
    "location": "Kolkata",
    "matchDate": "2025-11-16T12:00:00.000Z",
    "totalOvers": 5,
    "teamA": { ... },
    "teamB": { ... },
    "currentInnings": 1,
    "innings1": { ... },
    "innings2": { ... },
    "striker": { ... },
    "nonStriker": { ... },
    "currentBowler": { ... },
    "status": "innings1",
    "ballByBall": [ ... ],
    ...
  }
}
```

---

### 5. Get All Matches
**GET** `/api/matches`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "match_id_1",
      "groundName": "Eden Gardens",
      "teamA": { "name": "Mumbai Indians" },
      "teamB": { "name": "Chennai Super Kings" },
      "status": "completed",
      "winner": "Mumbai Indians",
      "result": "Mumbai Indians won by 5 runs",
      "matchDate": "2025-11-16T12:00:00.000Z",
      ...
    },
    ...
  ]
}
```

---

### 6. Get Player Stats
**GET** `/api/matches/:id/players`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "player_id",
      "name": "Rohit Sharma",
      "matchId": "match_id",
      "teamName": "Mumbai Indians",
      "runs": 45,
      "ballsFaced": 28,
      "fours": 5,
      "sixes": 2,
      "strikeRate": 160.71,
      "isOut": true,
      "createdAt": "2025-11-16T12:30:00.000Z"
    },
    ...
  ]
}
```

---

## Match Flow

### Complete Match Flow:

1. **Create Match** → POST `/api/matches`
   - Provide ground details, teams with 11 players each
   - Select batting team
   - Returns match ID

2. **Start Match** → POST `/api/matches/:id/start`
   - Select striker, non-striker from batting team
   - Select bowler from bowling team
   - Match status changes to "innings1"

3. **Update Score** → POST `/api/matches/:id/score` (multiple times)
   - Send runs for each ball
   - Handle wides, no balls, wickets
   - System automatically:
     - Rotates strike on odd runs
     - Changes strike at end of over
     - Prompts for new bowler after each over
     - Prompts for new batsman after wicket
     - Swaps teams after first innings
     - Declares winner after match complete

4. **Get Match** → GET `/api/matches/:id`
   - Fetch current match state anytime

5. **Get Player Stats** → GET `/api/matches/:id/players`
   - Get all player statistics for the match

---

## Match Status Values

- `setup` - Match created, waiting to start
- `innings1` - First innings in progress
- `innings2` - Second innings in progress
- `completed` - Match finished

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Match not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details..."
}
```

---

## Testing with cURL

### Create Match:
```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groundName": "Eden Gardens",
    "location": "Kolkata",
    "totalOvers": 5,
    "teamA": {
      "name": "Team A",
      "players": ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11"]
    },
    "teamB": {
      "name": "Team B",
      "players": ["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11"]
    },
    "battingTeam": "Team A"
  }'
```

### Start Match:
```bash
curl -X POST http://localhost:5000/api/matches/MATCH_ID/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "striker": "P1",
    "nonStriker": "P2",
    "bowler": "P1"
  }'
```

### Update Score:
```bash
curl -X POST http://localhost:5000/api/matches/MATCH_ID/score \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "runs": 4,
    "isWide": false,
    "isNoBall": false,
    "isWicket": false
  }'
```

---

**Complete backend integration ready!** 🚀
