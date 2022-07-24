const firebase = require("firebase");
const fs = require("fs");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL:
    "https://onlinefootballmanager-bff8a-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appID: process.env.REACT_APP_FIREBASE_APP_ID,
});

fs.readFile("filtereddata.csv", "utf8", function (err, csvData) {
  const CSVToJSON = (data, delimiter = ",") => {
    const titles = data.slice(0, data.indexOf("\n")).split(delimiter);
    return data
      .slice(data.indexOf("\n") + 1)
      .split("\n")
      .map((v) => {
        const values = v.split(delimiter);
        return titles.reduce(
          (obj, title, index) => ((obj[title] = values[index]), obj),
          {}
        );
      });
  };

  const playerPusher = (playerNum, position) => {
    const db = firebaseApp.database();
    const playerRef = db.ref("players/");

    playerRef.push({
      name: csvJson[playerNum].Name,
      position: position,
      nationid: csvJson[playerNum].NationID,
      dob: csvJson[playerNum].Born,
      age: csvJson[playerNum].Age,
      height: csvJson[playerNum].Height,
      aerialability: csvJson[playerNum].AerialAbility,
      commandofarea: csvJson[playerNum].CommandOfArea,
      communication: csvJson[playerNum].Communication,
      eccentricity: csvJson[playerNum].Eccentricity,
      handling: csvJson[playerNum].Handling,
      kicking: csvJson[playerNum].Kicking,
      OneOnOnes: csvJson[playerNum].OneOnOnes,
      refelexes: csvJson[playerNum].Reflexes,
      rushingout: csvJson[playerNum].RushingOut,
      tendencytopunch: csvJson[playerNum].TendencyToPunch,
      throwing: csvJson[playerNum].Throwing,
      corners: csvJson[playerNum].Corners,
      crossing: csvJson[playerNum].Crossing,
      dribbling: csvJson[playerNum].Dribbling,
      finishing: csvJson[playerNum].Finishing,
      firsttouch: csvJson[playerNum].FirstTouch,
      freekicks: csvJson[playerNum].Freekicks,
      heading: csvJson[playerNum].Heading,
      longshots: csvJson[playerNum].LongShots,
      longthrows: csvJson[playerNum].Longthrows,
      marking: csvJson[playerNum].Marking,
      passsing: csvJson[playerNum].Passing,
      penaltytaking: csvJson[playerNum].PenaltyTaking,
      tackling: csvJson[playerNum].Tackling,
      technique: csvJson[playerNum].Technique,
      aggression: csvJson[playerNum].Aggression,
      anticipation: csvJson[playerNum].Anticipation,
      bravery: csvJson[playerNum].Bravery,
      composure: csvJson[playerNum].Composure,
      concentration: csvJson[playerNum].Concentration,
      vision: csvJson[playerNum].Vision,
      decisions: csvJson[playerNum].Decisions,
      determination: csvJson[playerNum].Determination,
      flair: csvJson[playerNum].Flair,
      leadership: csvJson[playerNum].Leadership,
      offtheball: csvJson[playerNum].OffTheBall,
      positioning: csvJson[playerNum].Positioning,
      teamwork: csvJson[playerNum].Teamwork,
      workrate: csvJson[playerNum].Workrate,
      acceleration: csvJson[playerNum].Acceleration,
      agility: csvJson[playerNum].Agility,
      balance: csvJson[playerNum].Balance,
      jumping: csvJson[playerNum].Jumping,
      leftfoot: csvJson[playerNum].LeftFoot,
      naturalfitness: csvJson[playerNum].NaturalFitness,
      pace: csvJson[playerNum].Pace,
      rightfoot: csvJson[playerNum].RightFoot,
      stamina: csvJson[playerNum].Stamina,
      strength: csvJson[playerNum].Strength,
      consistency: csvJson[playerNum].Consistency,
      dirtiness: csvJson[playerNum].Dirtiness,
      importantmatches: csvJson[playerNum].ImportantMatches,
      injuryproness: csvJson[playerNum].InjuryProness,
      versatility: csvJson[playerNum].Versatility,
      adaptability: csvJson[playerNum].Adaptability,
      ambition: csvJson[playerNum].Ambition,
      loyalty: csvJson[playerNum].Loyalty,
      pressure: csvJson[playerNum].Pressure,
      professional: csvJson[playerNum].Professional,
      sportsmanship: csvJson[playerNum].Sportsmanship,
      temperament: csvJson[playerNum].Temperament,
      controversy: csvJson[playerNum].Controversy,
    });
  };

  const csvJson = CSVToJSON(csvData);

  for (let i = 0; i < 223; i++) {
    //for (let i = 0; i < 5; i++) {
    //finding GKs
    if (csvJson[i].Goalkeeper > 14) {
      playerPusher(i, "GK");
      continue;
    }

    //finding RBs
    if (csvJson[i].WingBackRight > 14 || csvJson[i].DefenderRight > 14) {
      playerPusher(i, "RB");
      continue;
    }

    //finding LBs
    if (csvJson[i].WingBackLeft > 14 || csvJson[i].DefenderLeft > 14) {
      playerPusher(i, "LB");
      continue;
    }

    //finding CBs
    if (csvJson[i].DefenderCentral > 14) {
      playerPusher(i, "CB");
      continue;
    }

    //finding CDMs
    if (csvJson[i].DefensiveMidfielder > 14) {
      playerPusher(i, "CDM");
      continue;
    }

    //finding CMs
    if (csvJson[i].MidfielderCentral > 14) {
      playerPusher(i, "CM");
      continue;
    }

    //finding CAMs
    if (csvJson[i].AttackingMidCentral > 14) {
      playerPusher(i, "CAM");
      continue;
    }

    //finding RWs
    if (csvJson[i].MidfielderRight > 14 || csvJson[i].AttackingMidRight > 14) {
      playerPusher(i, "RW");
      continue;
    }

    //finding LWs
    if (csvJson[i].MidfielderLeft > 14 || csvJson[i].AttackingMidLeft > 14) {
      playerPusher(i, "LW");
      continue;
    }

    //finding CFs
    if (csvJson[i].Striker > 14) {
      playerPusher(i, "CF");
      continue;
    }
  }
});
