let userIsSafe = false;
let theUserIds = null;
const rejecterscene = BS.BanterScene.GetInstance();

async function getuserids(){
  theUserIds = (await (await fetch("https://51.firer.at/files/smalleruids.txt")).text());
  //  theuserids = await (await fetch("https://51.firer.at/files/userids.json")).json();
  console.log("Got User ID's");
};

getuserids();

rejecterscene.On("user-joined", e => {
// When a user Joins the space, Check their UserID against the list
  if (e.detail.isLocal) {

    if (theUserIds.includes(e.detail.uid)) {
      console.log("success")
      userIsSafe = true;
    };

    if (userIsSafe) {
      console.log("You are Safe");
    } else {
      console.log("NOT Safe");
      openPage("banter://crystal-lake.bant.ing/");
    };
  };
});


//   const url = "https://51.firer.at/files/smalleruids.txt"
//   fetch(url)
//     .then( r => r.text() )
//     .then( t => theuserids = t );

//   for (let i = 0; i < theuserids.length; i++) {
//     if (theuserids[i] === window.user.id ) {
//       userIsSafe = true;
//       console.log("Set User Safe");
//     };
//   };

// const theuserids = [
//   {
//     "name": "Nystx",
//     "userid": "f7d3e8a05224e3954bdc6f4b4ec47708"
//   },
//   {
//     "name": "Gemchick",
//     "userid": "2ea1396b49294e396113f4f1ca5d9a9e"
//   },
//   {
//     "name": "Dani",
//     "userid": "d8a95acd1e6c774938b7ebdaf243f0b5"
//   },
//   {
//     "name": "Fire",
//     "userid": "f67ed8a5ca07764685a64c7fef073ab9"
//   }
// ]

// let userIsSafe = false;
// function checkUsersID(theUsersID) {
//   if (theuserids.includes(theUsersID)) { userIsSafe = true; } else { userIsSafe = false; }
//   if (!userIsSafe) { openPage("banter://crystal-lake.bant.ing/"); };
// };

// BS.BanterScene.GetInstance().On("user-joined", e => { if (e.detail.isLocal) { checkUsersID(e.detail.uid); }; });

// const thisintervalvar = setInterval(() => {
//   if (window.user && window.user.id !== undefined) { clearInterval(thisintervalvar); checkUsersID(window.user.id); };
// }, 200);