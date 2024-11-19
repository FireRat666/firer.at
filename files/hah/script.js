const hahCurrentScript = Array.from(document.getElementsByTagName('script')).slice(-1)[0];
class HahGameSystem {
  constructor(){
    this.init();
  }
  async init() {
    this.currentScript = hahCurrentScript;
    this.urlParams = new URLSearchParams(window.location.search);
    this.parseParams();
    if(window.isBanter) {
      await window.AframeInjection.waitFor(window, 'user');
      await window.AframeInjection.waitFor(window, 'banterLoaded');
    }
    this.scene = document.querySelector("a-scene");
    if(!this.scene){
      return;
    }
    if(!window.user) {
      this.generateGuestUser();
    }
    this.parent = this.getTableHTML();
    await this.wait(1);
    await this.setupTable();
    await this.setupWebsocket();
    await this.wait(1);
    this.parent.setAttribute("scale", "1 1 1");
    await this.wait(1);
  }
  wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
  parseParams() {
    this.setOrDefault("position", "0 0 0");
    this.setOrDefault("rotation", "0 0 0");
    this.setOrDefault("uid", null);
    this.setOrDefault("instance", "demo-game");
    this.setOrDefault("debug", "false");
    this.setOrDefault("one-for-each-instance", "false");
    if(this.params["one-for-each-instance"] === "true" && window.user && window.user.instance) {
      this.params.instance += window.user.instance;
    }
  }
  setOrDefault(attr, defaultValue) {
    const value = this.currentScript.getAttribute(attr);
    this.params = this.params || {};
    this.params[attr] = value || (this.urlParams.has(attr) ? this.urlParams.get(attr) : defaultValue);
  }
  setupWebsocket(){
    return new Promise(resolve => {
      this.ws = new WebSocket('wss://hahumanity.glitch.me/');
      this.ws.onopen = async (event) => {
        const instance = this.params.instance;
        const user = window.user;
        this.send("init", {instance, user});
        console.log("Connected to game server.")
        resolve();
      };
      this.ws.onmessage = (event) => {
        if(typeof event.data === 'string'){
          this.parseMessage(event.data);
        }
      }
      this.ws.onclose =  (event) => {
        console.log("Connection to game server closed, reconnecting...")
        setTimeout(() => {
          this.setupWebsocket();
        }, 1000);
      };
    });
  }
  setupTable() {
    this.startCard = this.parent.querySelector("._startCard");
    this.submitWinner = this.parent.querySelector("._submitWinner");
    this.gameCard = this.parent.querySelector("._gameCard");
    this.gameBox = this.parent.querySelector("._hahBox");
    this.leaveGame = this.parent.querySelector("._leaveGame");
    this.areYouSure = this.parent.querySelector("._areYouSure");
    this.confirmButton = this.parent.querySelector("._confirm");
    this.cancelButton = this.parent.querySelector("._cancel");
    this.startPreviewCard = this.parent.querySelector("._startPreviewCard");
    this.mainCTAJoinText = this.parent.querySelector("._clickToJoin");
    this.mainCTAJoinButton = this.parent.querySelector("._clickToJoinButton");
    this.resetGameEle = this.parent.querySelector(".resetGame");
    this.resetGameEle.addEventListener('click', () => {
      this.send("reset-game");
      this.resetGame();
    });
    this.mainCTAJoinButton.addEventListener('click', this.debounce(() => {
      if(this.canStart){
        this.send('start-game');
        console.log("Starting game...");
      }else {
        this.send('join-game');
        console.log("Joining game...");
      }
    }));
    this.leaveGame.addEventListener('click', this.debounce(() => {
      this.confirm(() => {
        this.send('leave-game');
      })
    })); 
    if(window.isBanter) {
      Array.from(this.parent.querySelector("[look-at]")).forEach(ele => {
        ele.removeAttribute("look-at");
      });
    }
  }
  confirm(callback) {
    this.areYouSure.setAttribute("scale", "1 1 1");
    let confirm;
    confirm = () => {
      callback();
      this.areYouSure.setAttribute("scale", "0 0 0");
      this.confirmButton.removeEventListener("click", confirm);
    };
    this.confirmButton.addEventListener("click", confirm);
    let cancel;
    cancel = () => {
      this.areYouSure.setAttribute("scale", "0 0 0");
      this.cancelButton.removeEventListener("click", cancel);
    };
    this.cancelButton.addEventListener("click", cancel);
  }
  shouldShowSubmit() {
    return (this.firstCardSelection && this.isOneResponse) || (this.isTwoResponse && this.firstCardSelection && this.secondCardSelection);
  }
  shouldShowReset() {
    return this.firstCardSelection;
  }
  selectIndividualCard(cardele, submit, reset, playerSection, cardSelection0, cardSelection1) {
    if(this.hasSubmit || (this.firstCardSelection && this.secondCardSelection && this.isTwoResponse) || (this.firstCardSelection && this.isOneResponse)) {
      return;
    }
    cardele.setAttribute("scale", "0 0 0");
    if(this.firstCardSelection) {
      this.secondCardSelection = cardele;
      this.setText(cardSelection1.querySelector("a-text"), cardele.card.text);
      this.show(cardSelection1);
    }else{
      this.show(cardSelection0);
      this.firstCardSelection = cardele;
      this.setText(cardSelection0.querySelector("a-text"), cardele.card.text);
      this.show(reset.parentElement);
    }
    if(playerSection.submitCallback) {
      submit.removeEventListener("click", playerSection.submitCallback);
    }
    playerSection.submitCallback = this.debounce(() => this.chooseCards(submit, reset, playerSection, cardSelection0, cardSelection1));
    submit.addEventListener("click", playerSection.submitCallback);
    if(this.shouldShowSubmit()) {
      this.show(submit.parentElement);
    }
  }
  chooseCards(submit, reset, playerSection, cardSelection0, cardSelection1) {
    if((this.firstCardSelection && this.isOneResponse) || (this.isTwoResponse && this.firstCardSelection && this.secondCardSelection)) {
      this.send("choose-cards", [this.firstCardSelection.card, this.secondCardSelection ? this.secondCardSelection.card : null]);
      this.resetChoice(submit, reset, playerSection, cardSelection0, cardSelection1);
      this.hasSubmit = true;
    }
  }
  resetChoice(submit, reset, playerSection, cardSelection0, cardSelection1) {
    for(let _i = 0;_i < 12; _i ++) {
        const cardEle = playerSection.querySelector('._card' + _i);
        if(cardEle === this.firstCardSelection || cardEle === this.secondCardSelection) {
          cardEle.setAttribute("scale", "0.1 0.15 0.1");
        }
    }
    this.secondCardSelection = null;
    this.firstCardSelection = null;
    this.setText(cardSelection0.querySelector("a-text"), "-");
    this.setText(cardSelection1.querySelector("a-text"), "-");
    this.hide(submit.parentElement);
    this.hide(reset.parentElement);
    this.hide(cardSelection0);
    this.hide(cardSelection1);
  }
  showTrophies(player, trophiesEl) {
    if(player.trophies > trophiesEl.children.length) {
      const new_ones = player.trophies - trophiesEl.children.length;
      for(let i = 0; i < new_ones; i++) {
        const new_trophy = document.createElement("a-entity");
        new_trophy.setAttribute('gltf-model', this.models.trophy);
        new_trophy.setAttribute('scale', '0.01 0.01 0.01');
        trophiesEl.appendChild(new_trophy);
      }
      Array.from(trophiesEl.children).forEach((d,i) => {
        d.setAttribute("position", ((i * 0.05) - (player.trophies * 0.05 / 2) + 0.015) + " 0 0");
      }); 
    }
  }
  updatePlayerSlices(players, game) {
    for(let i = 0;i < 10; i ++) {
      const playerId = players.filter(d => game.players[d].position === i);
      const playerSection = this.parent.querySelector("._playerPosition" + i);
      const reset = playerSection.querySelector("._resetCardSelection");
      const submit = playerSection.querySelector("._submitCardSelection");
      const cardSelection = playerSection.querySelector("._cardSelection");
      const cardSelection0 = cardSelection.querySelector("._cardSelection0");
      const cardSelection1 = cardSelection.querySelector("._cardSelection1");
      this.hide(submit.parentElement);
      this.hide(reset.parentElement);
      if(!playerId.length) {
        this.hide(playerSection);
        this.setText(playerSection.querySelector('._nameTag'), "");
        continue;
      }
      const id = playerId[0];
      const player = game.players[id];
      this.showTrophies(player, playerSection.querySelector('.trophies'));
      this.show(playerSection);
      this.setText(playerSection.querySelector('._nameTag'), player.name);
      const nameTagTimer = playerSection.querySelector('._nameTagTimer');
      
      if(!player.connected && !nameTagTimer.timer) {
        nameTagTimer.timer = setInterval(() =>{
          this.setText(playerSection.querySelector('._nameTagTimer'), "Disconnected, kicking in " + (45 - Math.round((new Date().getTime() - player.disconnectTime) / 1000)) + "s");
        }, 1000);
      }else if(player.connected && nameTagTimer.timer){
        clearInterval(nameTagTimer.timer);
        nameTagTimer.timer = null;
        this.setText(nameTagTimer, "");
      }else{
        this.setText(nameTagTimer, "");
      }
      
      if(game.isStarted && game.czar !== id && !game.winner) {
        this.show(playerSection.querySelector("._cardRoot"));
      }else{
        this.hide(playerSection.querySelector("._cardRoot"));
      }
      if(game.isStarted){
        if(id === window.user.id && id !== game.czar) {
          if(!playerSection.resetCallback) {
            playerSection.resetCallback = this.debounce(() => this.resetChoice(submit, reset, playerSection, cardSelection0, cardSelection1));
            reset.addEventListener("click", playerSection.resetCallback);
          }
          if(player.selected[0]) {
            this.firstCardSelection = player.selected[0];
            this.setText(cardSelection0.querySelector("a-text"), player.selected[0].text);
          }
          if(player.selected[1] && this.isTwoResponse) {
            this.secondCardSelection = player.selected[1];
            this.setText(cardSelection1.querySelector("a-text"), player.selected[1].text);
          }
          player.cards.forEach((d, _i) => {
            const cardEle = playerSection.querySelector('._card' + _i);
            cardEle.card = d;
            if(cardEle.clickCallback) {
              cardEle.removeEventListener("click", cardEle.clickCallback);
            }
            if(player.selected.map(d=>d.text).includes(d.text)) {
              this.setText(cardEle.querySelector("a-text"), "-");
              cardEle.setAttribute("scale", "0 0 0");
            }else{
              cardEle.setAttribute("scale", "0.1 0.15 0.1");
              this.setText(cardEle.querySelector("a-text"), d.text);
              cardEle.clickCallback = this.debounce(() => this.selectIndividualCard(cardEle, submit, reset, playerSection, cardSelection0, cardSelection1));
              cardEle.addEventListener("click", cardEle.clickCallback);
            }
          });
          if(this.shouldShowSubmit() && !player.selected.length) {
            this.show(submit.parentElement);
          }
          if(this.shouldShowReset() && !player.selected.length) {
            this.show(reset.parentElement);
          }
        }
      }
      this.currentBlackCard = playerSection.querySelector("._cardCzar");
      this.currentBlackCard.setAttribute("scale", game.isStarted && game.czar === id && !game.winner ? "0.1 0.15 0.1" : "0 0 0");
      if(id === game.czar) {
        this.hide(submit.parentElement);
        this.hide(reset.parentElement);
        this.show(playerSection.querySelector('._playerSliceActive'));
        this.hide(playerSection.querySelector('._playerSlice'));
        if(game.czar === window.user.id) {
          this.setText(this.currentBlackCard.querySelector("a-text"), game.currentBlackCard.text);
          if(this.currentBlackCard.showCallback) {
            this.currentBlackCard.removeEventListener("click", this.currentBlackCard.showCallback);
          }
          this.currentBlackCard.showCallback = this.debounce(() => {
            this.show(this.gameCard);
            this.send("show-black");
          });
          this.currentBlackCard.addEventListener("click", this.currentBlackCard.showCallback);
        }
      }else{
        this.hide(playerSection.querySelector('._playerSliceActive'));
        this.show(playerSection.querySelector('._playerSlice'));
      }
    }
  }
  debounce(click) {
    return () => {
      // OK i changed to throttling instead of debounce, havent updated the name yet.
      const now = new Date().getTime();
      if(this.lastClickTime && now - this.lastClickTime < 200) {
        return () => {};
      }
      this.lastClickTime = now;
      click();
    }
  }
  resetGame() {
    const cardCzar0 = this.gameCard.querySelector("._cardCzar0");
    const cardCzar1 = this.gameCard.querySelector("._cardCzar1");
    const cardCzar2 = this.gameCard.querySelector("._cardCzar2");
    this.hide(cardCzar1.parentElement);
    this.hide(cardCzar2.parentElement);
    this.setText(cardCzar1, "-");
    this.setText(cardCzar2, "-");
    this.setText(cardCzar0, "-");
    cardCzar0.previousSibling.previousSibling.setAttribute("position", "0 0 0");
    cardCzar0.setAttribute("position", "0.33 0.45 -0.02");
    this.firstCardSelection = null;
    this.secondCardSelection = null;
    for(let i = 0;i < 10; i ++) {
      const playerSection = this.parent.querySelector("._playerPosition" + i);
      const cardSelection = playerSection.querySelector("._cardSelection");
      const cardSelection0 = cardSelection.querySelector("._cardSelection0");
      const cardSelection1 = cardSelection.querySelector("._cardSelection1");
      const reset = playerSection.querySelector("._resetCardSelection");
      const submit = playerSection.querySelector("._submitCardSelection");
      this.setText(cardSelection0.querySelector("a-text"), "-");
      this.setText(cardSelection1.querySelector("a-text"), "-");
      this.hide(cardSelection0);
      this.hide(cardSelection1);
      this.hide(submit.parentElement);
      this.hide(reset.parentElement);
      for(let _i = 0;_i < 12; _i ++) {
        const cardEle = playerSection.querySelector('._card' + _i);
        cardEle.card = null;
        this.setText(cardEle.querySelector("a-text"), "-");
        if(cardEle.clickCallback) {
          cardEle.removeEventListener("click", cardEle.clickCallback);
          cardEle.clickCallback = null;
        }
      };
    }
  }
  centerTableState(game) {
    let value = "Click To Join";
    if(this.userIsPlaying) {
      if(game.playerCount > 2) {
        if(game.winner) {
          this.show(this.startCard);
          value = game.winner.name + " wins!";
          this.hide(this.gameCard);
        }else if(game.isStarted) {
          this.hide(this.mainCTAJoinButton);
          this.canStart = false;
          this.gameBox.setAttribute("rotation", "0 0 0");
          value = "";
          this.hide(this.startCard);
        }else{
          value = "Click To Deal";
          this.canStart = true;
          this.show(this.mainCTAJoinButton);
          
        }
      }else{
        value = (3 - game.playerCount) + " More!";
        this.hide(this.mainCTAJoinButton);
      }
    }else if(this.userIsWaiting) {
      this.hide(this.mainCTAJoinButton);
      this.hide(this.startCard);
      value = "Waiting for next round...";
    }else{
      this.show(this.mainCTAJoinButton);
      if(game.isStarted) {
        this.hide(this.startPreviewCard);
      }
      value = "Click To Join";
    }
    if(game.playerCount > 9) {
      this.hide(this.mainCTAJoinButton);
      value = "Game Full";
    }
    this.setText(this.mainCTAJoinText, value);
  }
  czarPreviewAndSelect(players, game) {
    this.currentPlayer  = game.currentPreviewResponse || 0;
    const gamePlayersWithoutCzar = players.filter(d => d !== game.czar).map(d => game.players[d]);
    let someResponsesMissing = false;
    gamePlayersWithoutCzar.forEach(d => {
      if(d.selected < 2 && this.isTwoResponse) {
        someResponsesMissing = true;
      } else if(d.selected < 1 && this.isOneResponse){
        someResponsesMissing = true;
      }
    });
    const _prevPlayerResponse = this.gameCard.querySelector("._prevPlayerResponse");
    const _nextPlayerResponse = this.gameCard.querySelector("._nextPlayerResponse");
    if(game.showBlack && !game.winner){ //  && (game.players[window.user.id] || game.waitingRoom.map(d => d.id).indexOf(window.user.id) > -1)
      this.show(_nextPlayerResponse.parentElement);
      this.show(_prevPlayerResponse.parentElement);
      this.show(this.gameCard);
      const _cardCzar0 = this.gameCard.querySelector("._cardCzar0");
      const _cardCzar1 = this.gameCard.querySelector("._cardCzar1");
      const _cardCzar2 = this.gameCard.querySelector("._cardCzar2");
      this.setText(_cardCzar0, game.currentBlackCard.text);
      const setGameCard = () => {
        if(!someResponsesMissing) {
          if(this.isOneResponse) {
            this.setText(_cardCzar1, gamePlayersWithoutCzar[this.currentPlayer].selected[0].text ); // + "\n\n" + gamePlayersWithoutCzar[this.currentPlayer].name + "( " + (this.currentPlayer + 1) + " )"
          }else{
            this.setText(_cardCzar1, gamePlayersWithoutCzar[this.currentPlayer].selected[0].text ); // + "\n\n" + gamePlayersWithoutCzar[this.currentPlayer].name + "( " + (this.currentPlayer + 1) + " )"
            this.setText(_cardCzar2, gamePlayersWithoutCzar[this.currentPlayer].selected[1].text);
          }
        }
      } 
      if(someResponsesMissing) {
        this.hide(_cardCzar2.parentElement);
        this.hide(_cardCzar1.parentElement);
        _cardCzar0.previousSibling.previousSibling.setAttribute("position", "0 0 0");
        _cardCzar0.setAttribute("position", "-0.33 0.45 0.02");
        this.hide(this.submitWinner.parentElement);
        this.hide(_nextPlayerResponse.parentElement);
        this.hide(_prevPlayerResponse.parentElement);
      }else if(this.isOneResponse) {
        this.hide(_cardCzar2.parentElement);
        this.show(_cardCzar1.parentElement);
        _cardCzar1.parentElement.setAttribute("position", "0.4 0 0");
        _cardCzar0.previousSibling.previousSibling.setAttribute("position", "-0.4 0 0");
        _cardCzar0.setAttribute("position", "-0.73 0.45 0.02");
        this.show(this.submitWinner.parentElement);
        this.show(_nextPlayerResponse.parentElement);
        this.show(_prevPlayerResponse.parentElement);
        setGameCard();
      }else{
        this.show(_cardCzar2.parentElement);
        this.show(_cardCzar1.parentElement);
        _cardCzar1.parentElement.setAttribute("position", "0 0 0");
        _cardCzar0.previousSibling.previousSibling.setAttribute("position", "-0.82 0 0");
        _cardCzar0.setAttribute("position", "-1.13 0.45 0.02");
        this.show(this.submitWinner.parentElement);
        this.show(_nextPlayerResponse.parentElement);
        this.show(_prevPlayerResponse.parentElement);
        setGameCard();
      }
      if(window.user.id === game.czar) {
        if(this.gameCard.nextPlayerResponseCallback) {
          _nextPlayerResponse.removeEventListener("click", this.gameCard.nextPlayerResponseCallback)
        }
        this.gameCard.nextPlayerResponseCallback = this.debounce(() => {
          this.currentPlayer++;
          if(this.currentPlayer > gamePlayersWithoutCzar.length - 1) {
            this.currentPlayer = gamePlayersWithoutCzar.length - 1
          }
          setGameCard();
          this.showHideNextPrev(_nextPlayerResponse, _prevPlayerResponse, gamePlayersWithoutCzar.length - 1);
          console.log("preview-response next: ", this.currentPlayer, gamePlayersWithoutCzar.length, gamePlayersWithoutCzar[this.currentPlayer]);
          this.send("preview-response", this.currentPlayer);
        });
        _nextPlayerResponse.addEventListener("click", this.gameCard.nextPlayerResponseCallback);
        if(this.gameCard.prevPlayerResponseCallback) {
          _prevPlayerResponse.removeEventListener("click", this.gameCard.prevPlayerResponseCallback)
        }
        this.gameCard.prevPlayerResponseCallback = this.debounce(() => {
          this.currentPlayer--;
          if(this.currentPlayer < 0) {
            this.currentPlayer = 0;
          }
          this.showHideNextPrev(_nextPlayerResponse, _prevPlayerResponse, gamePlayersWithoutCzar.length - 1);
          setGameCard();
          console.log("preview-response prev: ", this.currentPlayer, gamePlayersWithoutCzar.length,  gamePlayersWithoutCzar[this.currentPlayer]);
          this.send("preview-response", this.currentPlayer);
        });
        _prevPlayerResponse.addEventListener("click", this.gameCard.prevPlayerResponseCallback);
        this.showHideNextPrev(_nextPlayerResponse, _prevPlayerResponse, gamePlayersWithoutCzar.length - 1);
        if(this.submitWinner.clickCallback) {
          this.submitWinner.removeEventListener("click", this.submitWinner.clickCallback)
        }
        this.submitWinner.clickCallback = this.debounce(() => {
          console.log("picking winner: ", this.currentPlayer, gamePlayersWithoutCzar[this.currentPlayer]);
          this.send("choose-winner", gamePlayersWithoutCzar[this.currentPlayer]._id);
        });
        this.submitWinner.addEventListener("click", this.submitWinner.clickCallback);
      }else{
        this.hide(this.submitWinner.parentElement);
        this.hide(_nextPlayerResponse.parentElement);
        this.hide(_prevPlayerResponse.parentElement);
      }
    }else{
        this.hide(this.gameCard);
    }
  }
  showHideNextPrev(next, prev, total) {
    if(this.currentPlayer <= 0) {
      prev.parentElement.setAttribute("scale", "0 0 0")
    }else{
      prev.parentElement.setAttribute("scale", "0.6 0.6 0.6")
    }
    
    if(this.currentPlayer >= total) {
      next.parentElement.setAttribute("scale", "0 0 0")
    }else{
      next.parentElement.setAttribute("scale", "0.6 0.6 0.6")
    }
    
  }
  hide(ele) {
    if(this.mainCTAJoinButton === ele) {
      ele.setAttribute('scale', '0 0 0');
    }
    ele.setAttribute('visible', false);
  }
  show(ele) {
    if(this.mainCTAJoinButton === ele) {
      ele.setAttribute('scale', '0.7 0.7 0.7');
    }
    ele.setAttribute('visible', true);
  }
  cleanUpTrophies(newGame) {
    const currentPlayers = Object.keys(this.game);
    const removedPlayers = currentPlayers.filter(p => !Object.keys(newGame).includes(p));
    removedPlayers.forEach(p => {
      const playerId = this.game.players[p].position;
      const playerSection = this.parent.querySelector("._playerPosition" + playerId);
      if(playerSection) {
        const reset = playerSection.querySelector("._resetCardSelection");
        const submit = playerSection.querySelector("._submitCardSelection");
        this.hide(submit.parentElement);
        this.hide(reset.parentElement);
        Array.from(playerSection.querySelector('.trophies').children).forEach(trophie => {
          trophie.parentElement.removeChild(trophie);
        })
      }
    });
  }
  syncGame(game) {
    if(this.game) {
      this.cleanUpTrophies(game);
    }
    
    this.game = game;
    this.canStart = false;
    this.hasSubmit = false;
    
    if(this.params.debug === "true") {
      console.log("sync", game);
    }
    
    if(!game.winner && this.hadWinner) {
      this.resetGame();
      this.hadWinner = false;
    }
    this.hadWinner = !!game.winner;
    
    const players = Object.keys(game.players);
    this.userIsPlaying = players.indexOf(window.user.id) > -1;
    if(this.userIsPlaying) {
      this.leaveGame.setAttribute("scale", "1 1 1");
    }else{
      this.leaveGame.setAttribute("scale", "0 0 0");
    }
    this.userIsWaiting = game.waitingRoom.map(d => d.id).indexOf(window.user.id) > -1;
    
    this.isOneResponse = game.isStarted && game.currentBlackCard && (!game.currentBlackCard.numResponses || game.currentBlackCard.numResponses === 1);
    this.isTwoResponse = game.isStarted && game.currentBlackCard && game.currentBlackCard.numResponses && game.currentBlackCard.numResponses === 2;
    
    this.show(this.startCard);
    this.show(this.startPreviewCard);
    this.hide(this.gameCard);
    this.gameBox.setAttribute("rotation", "-180 0 0");
    
    this.centerTableState(game);
    this.updatePlayerSlices(players, game);
    this.czarPreviewAndSelect(players, game);
  }
  setText(ele, value) {
    if(window.isBanter) {
      setTimeout(()=>{
        window.setText(ele.object3D.id, value);
      }, 500);
    }else{
      ele.setAttribute("value", value);
    }
  }
  parseMessage(msg) {
    const json = JSON.parse(event.data);
    switch(json.path) {
      case 'sync-game':
        this.syncGame(json.data);
        break;
      case 'error':
        alert(json.data);
        break;
      case 'play-sound':
        this.playSound(json.data);
        break;
    }
  }
  playSound(name){
     var audio = new Audio('https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/' + name);
     audio.volume = 0.3;
     audio.play(); 
  }
  send(path, data){
    this.ws.send(JSON.stringify({path, data}));
  }   
  generateGuestUser() {
    const id = this.params.uid || this.getUniquId();
    window.user = {id, name: "Guest " + id};
    localStorage.setItem('user', JSON.stringify(window.user));
  } 
  getUniquId() {
    return (Math.random() + 1).toString(36).substring(7);
  }
  getTableHTML() {
    this.models = {
      playerSlice:"https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/ha_h__player_slice.glb?v=1697147063553",
      playerSliceActive: "https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/ha_h__player_slice%20(1).glb?v=1697185026517",
      namePlate: "https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/ha_h__name_plate.glb?v=1697147028084",
      trophy: "https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/ha_h__trophy.glb?v=1697147541216"
    }
    
    const czarSelectHtml = `
    <a-entity class="_cardSelection">
      <a-plane visible="false" class="_cardSelection0" position="0.25 1.6 -1.3" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 180 0">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>  
      <a-plane visible="false" class="_cardSelection1"  position="0.05 1.6 -1.3" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 180 0" >
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>  
    </a-entity>`;
    
    const czarCardHtml = `
        <a-plane class="_cardCzar" sq-collider sq-interactable data-raycastable position="0 1.46 -1.4" scale="0.1 0.15 0.1" color="#000000" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 180 0" visiable="false">
          <a-text baseline="top" value="-" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>`;
    const resetHtml = `
        <a-entity scale="0.6 0.6 0.6" position="0.4 1.5 -1.3">
          <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 0 0" class="_resetCardSelection" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
          <a-plane position="0 0 0" scale="0.2 0.2 0.2" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/cross.png?v=1698147339368" rotation="0 180 0"></a-plane> 
        </a-entity>
        <a-entity scale="0.6 0.6 0.6" position="-0.4 1.5 -1.3">
          <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 0 0" class="_submitCardSelection" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
          <a-plane position="0 0 0" scale="0.2 0.2 0.2" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/check.png?v=1698147339741" rotation="0 180 0"></a-plane> 
        </a-entity>
        
       <!-- <a-plane class="_resetCardSelection" data-raycastable sq-boxcollider="size: 1 1 0.05" sq-interactable position="0.4 1.5 -1.3" scale="0.1 0.1 0.1" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/cross.png?v=1698147339368" rotation="0 180 0" visible="false"></a-plane> -->  
       <!--  <a-plane class="_submitCardSelection" data-raycastable sq-boxcollider="size: 1 1 0.05" sq-interactable position="-0.4 1.5 -1.3" scale="0.1 0.1 0.1" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/check.png?v=1698147339741" rotation="0 180 0" visible="false"></a-plane> -->`;
    const cardsHtml = `
      <a-entity class="_cardRoot" position="0 1.4 -1.3" rotation="-30 180 0" visible="false">
        <a-plane data-raycastable sq-collider sq-interactable class="_card0" position="0.265 -0.04 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 -10">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>
        <a-plane data-raycastable sq-collider sq-interactable class="_card1" position="0.16 -0.015 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 -6">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>
        <a-plane data-raycastable sq-collider sq-interactable class="_card2" position="0.055 0 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 -3">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>
        <a-plane data-raycastable sq-collider sq-interactable class="_card3" position="-0.055 0 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 3">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>
        <a-plane data-raycastable sq-collider sq-interactable class="_card4" position="-0.16 -0.015 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 6">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>
        <a-plane data-raycastable sq-collider sq-interactable class="_card5" position="-0.265 -0.04 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 10">
          <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
        </a-plane>
        <a-entity position="0 -0.155 0">
          <a-plane data-raycastable sq-collider sq-interactable class="_card6" position="0.265 -0.04 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 -10">
            <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
          </a-plane>
          <a-plane data-raycastable sq-collider sq-interactable class="_card7" position="0.16 -0.015 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 -6">
            <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
          </a-plane>
          <a-plane data-raycastable sq-collider sq-interactable class="_card8" position="0.055 0 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 -3">
            <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
          </a-plane>
          <a-plane data-raycastable sq-collider sq-interactable class="_card9" position="-0.055 0 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 3">
            <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
          </a-plane>
          <a-plane data-raycastable sq-collider sq-interactable class="_card10" position="-0.16 -0.015 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 6">
            <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
          </a-plane>
          <a-plane data-raycastable sq-collider sq-interactable class="_card11" position="-0.265 -0.04 0" scale="0.1 0.15 0.1" color="#afafaf" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" rotation="0 0 10">
            <a-text baseline="top" value="-" color="#000" scale="0.4 0.3 0.4" position="-0.4 0.4 0.01"></a-text>
          </a-plane>
        </a-entity>
      </a-entity>`;
    const playerSection = Array.from({length: 10}, (v, i) => i).map(i => `<a-entity class="_playerPosition${i}" rotation="0 ${36*i} 0">
          ${cardsHtml}
          ${czarCardHtml}
          ${czarSelectHtml}
          ${resetHtml}
          <a-entity class="_playerSliceActive" gltf-model="${this.models.playerSliceActive}"  scale="0.01 0.01 0.01"></a-entity>
          <a-entity class="_playerSlice" gltf-model="${this.models.playerSlice}"  scale="0.01 0.01 0.01"></a-entity>
          <a-text class="_nameTagTimer" position="0 1.07 -1.37" align="center" rotation="-30 0 0" value="Nametag" scale="0.08 0.08 0.08"></a-text>
          <a-entity class="_namePlate" gltf-model="${this.models.namePlate}" position="0 1 -1.4" scale="0.01 0.01 0.01"></a-entity>
          <!-- <a-box position="0 1.08 -1.45" scale="0.2 0.01 0.01" color="green"></a-box> -->
          <a-text class="_nameTag" position="0 1.07 -1.43" align="center" rotation="-30 180 0" value="Nametag" scale="0.08 0.08 0.08"></a-text>
          <a-entity class="trophies" position="0 1.02 -1.3">
          </a-entity>
        </a-entity>`).join("");
    const html = `
      <a-box scale="0.1 0.1 0.1" color="red" class="resetGame" data-raycastable sq-collider sq-interactable position="0 0.05 0"></a-box>
      <a-entity sq-nonconvexcollider="recursive: true" sq-interactable="recursive: true" gltf-model="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/ha_h__table_main.glb?v=1697146939160" scale="0.01 0.01 0.01"></a-entity>
        ${playerSection}
        <a-entity position="0 1.3 0.1" sq-billboard look-at="[camera]" scale="0 0 0" class="_areYouSure">
          <a-plane scale="0.5 0.3 1" color="#000" rotation="0 0 0"></a-plane>
          <a-text baseline="center" align="center" value="Are you sure?" scale="0.25 0.25 1" position="0 0.07 0.01"></a-text>
          <a-entity position="-0.1 -0.05 0.1" scale="0.6 0.6 0.6">
            <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 180 0" class="_cancel" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
            <a-plane position="0 0 0" scale="0.2 0.2 0.2" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/cross.png?v=1698147339368" rotation="0 0 0"></a-plane> 
          </a-entity>
          <a-entity position="0.1 -0.05 0.1" scale="0.6 0.6 0.6">
            <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 180 0" class="_confirm" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
            <a-plane position="0 0 0" scale="0.2 0.2 0.2" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/check.png?v=1698147339741" rotation="0 0 0"></a-plane> 
          </a-entity>
        </a-entity>
        
        <a-entity position="0 2 0" class="_gameCard"  visible="false">
          <a-entity sq-billboard look-at="[camera]">
            <a-entity gltf-model="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/card%20(1).glb?v=1697148981618" scale="12.8 12.8 12.8" position="0 0 0" rotation="-90 0 0"></a-entity>
            <a-text class="_cardCzar0" baseline="top" value="-" scale="0.3 0.3 0.3" rotation="0 0 0" position="0.31 0 0.021"></a-text>
            <a-plane position="0 0 0" scale="0.75 1.125 0.75" color="#afafaf" rotation="0 0 0" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" visible="false">
              <a-text class="_cardCzar1" color="#000" baseline="top" value="-" scale="0.375 0.25 0.375" position="-0.4 0.4 0.01"></a-text>
            </a-plane>
            <a-plane position="0.8 0 0" scale="0.75 1.125 0.75" color="#afafaf" rotation="0 0 0" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/hero-texture.png?v=1697208148076" side="double" visible="false">
              <a-text class="_cardCzar2" color="#000" baseline="top" value="-" scale="0.375 0.25 0.375" position="-0.4 0.4 0.01"></a-text>
            </a-plane>
          </a-entity>
          
          <a-entity sq-billboard look-at="[camera]" position="0 -0.7 0">          
            <a-entity visible="false" position="-0.1 0 0" scale="0.6 0.6 0.6">
              <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 180 0" class="_prevPlayerResponse" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
              <a-text value=">" align="center" rotation="0 180 0"></a-text>
            </a-entity>
            <a-entity position="0.1 0 0" visible="false" scale="0.6 0.6 0.6">
              <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 180 0" class="_nextPlayerResponse" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
              <a-text value="<" align="center" rotation="0 180 0"></a-text>
            </a-entity>
            <a-entity position="0.3 0 0" visible="false" scale="0.6 0.6 0.6">
              <a-entity data-raycastable sq-boxcollider="size: 0.3 0.2 0.05" sq-interactable rotation="0 180 0" class="_submitWinner" gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonS.glb?v=1689782700343"></a-entity>
              <a-plane position="0 0 0" scale="0.2 0.2 0.2" transparent="true" src="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/check.png?v=1698147339741" rotation="0 0 0"></a-plane> 
            </a-entity>
          </a-entity>
        </a-entity>

        <a-text value="" sq-billboard look-at="[camera]" class="_clickToJoin" align="center" scale="0.3 0.3 0.3" rotation="0 180 0" position="0 1.3 0"></a-text>

        <a-entity position="0 2 0" class="_startCard">
          <a-entity sq-billboard look-at="[camera]" position="0 -0.7 0" >
            <a-entity class="_clickToJoinButton" visible="false" data-raycastable sq-boxcollider="size: 0.6 0.2 0.05" sq-interactable gltf-model="https://cdn.glitch.global/cf03534b-1293-4351-8903-ba15ffa931d3/ButtonL.glb?v=1689782699922" scale="0.7 0.7 0.7" rotation="0 180 0"></a-entity>
          </a-entity>
          <a-entity sq-billboard look-at="[camera]" class="_startPreviewCard">
            <a-entity gltf-model="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/card%20(1).glb?v=1697148981618" scale="10 10 10" position="0 0 0" rotation="-90 0 0"></a-entity>
            <a-text value="Holograms\nAgainst\nHumanity" scale="0.45 0.45 0.45" rotation="0 180 0" position="0.25 0.2 -0.02"></a-text>
            <a-text value="Cards Against Humanity LLC\nLicensed under CC BY-NC-SA\ncardsagainsthumanity.com\nAdapted for AltspaceVR by:\nDerogatory, falkrons, schmidtec\nPorted to Banter by Shane" scale="0.15 0.15 0.15" rotation="0 180 0" position="0.25 -0.26 -0.02"></a-text>
            <a-entity rotation="0 180 0">
              <a-text value="Holograms\nAgainst\nHumanity" scale="0.45 0.45 0.45" rotation="0 180 0" position="0.25 0.2 -0.02"></a-text>
              <a-text value="Cards Against Humanity LLC\nLicensed under CC BY-NC-SA\ncardsagainsthumanity.com\nAdapted for AltspaceVR by:\nDerogatory, falkrons, schmidtec\nPorted to Banter by Shane" scale="0.15 0.15 0.15" rotation="0 180 0" position="0.25 -0.26 -0.02"></a-text>
            </a-entity>
          </a-entity>
        </a-entity>
        <a-entity position="0 1.08 0" scale="0 0 0" class="_leaveGame">
          <a-text baseline="center" color="red" align="center" value="Click to exit" scale="0.25 0.25 1" rotation="-90 0 0" position="0 0.06 0"></a-text>
          <a-box data-raycastable sq-boxcollider sq-interactable position="0 -0.01 0" scale="0.48 0.11 0.17"></a-box>
        </a-entity>
        <a-entity class="_hahBox" gltf-model="https://cdn.glitch.global/68a8fda1-eaf5-4ffe-8fbf-50f0798374a4/box.glb?v=1697182424365" position="0 1.08 0" rotation="-180 0 0" scale="2 2 2" ></a-entity>
        <a-ring rotation="-90 0 0" radius-inner="0.12" radius-outer="0.17" position="0 1 0" color="#118e98" animation="property: position; from: 0 1 0; to: 0 0.86 0; loop: true; dir: alternate; easing: linear; dur: 3000"></a-ring>
        <a-ring rotation="-90 0 0" radius-inner="0.18" radius-outer="0.23" position="0 1 0" color="#118e98" animation="property: position; from: 0 0.98 0; to: 0 0.88 0; loop: true; dir: alternate; easing: linear; dur: 3000;"></a-ring>
        <a-ring rotation="-90 0 0" radius-inner="0.24" radius-outer="0.29" position="0 1 0" color="#118e98" animation="property: position; from: 0 0.96 0; to: 0 0.90 0; loop: true; dir: alternate; easing: linear; dur: 3000;"></a-ring>
        
        `;
    
      const parent = document.createElement("a-entity");
      parent.setAttribute("position", this.params.position);
      parent.setAttribute("rotation", this.params.rotation);
      parent.setAttribute("scale", "0 0 0");
      parent.insertAdjacentHTML('beforeEnd', html);
      document.querySelector('a-scene').appendChild(parent);
    return parent;
  }
}
if(window.isBanter) {
  window.loadDoneCallback = () => window.banterLoaded = true;
}
window.gameSystem = new HahGameSystem();
