import { html } from "./scripts/lighterhtml.js";
import settings from "../settings.json";

export const renderHeader = html.node`<div>
  <div class='avatar-container'>
    <img src='${settings.avatarImage}' class='avatar' alt='${settings.name}' />
  </div>
  <h1>${settings.name}</h1>
    <div class="tagline">
    <b>Pioneer of late shows in virtual reality.<br/><br/>Sunday Nights @ 7pm PST / 10pm EST<br/>Join us LIVE in VR at BanterLateShow.com<br/>Exclusively on <a href="https://bantervr.com" style="color:#ff4cad;">Banter VR</a></b>
  </div>
</div>`;
