let userIsSafe = false;
let theUserIds = null;
const rejecterscene = BS.BanterScene.getInstance();

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