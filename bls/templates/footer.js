import { html } from "../scripts/lighterhtml.js";
import settings from "../settings.json";

export const renderFooter = html.node`<footer class="footer">
  <div class="tagline">
    <b>This web page is also a 3D space inside<br/>virtual reality, made for and viewable<br/>in <a href="https://bantervr.com" style="color:#ff4cad;">Banter VR</a>.</b>
    <div><br/><p>BanterLateShow.com</p></div>
  </div>
  <a
    class="btn--remix"
    target="_top"
    href="banter://banterlateshow.com"
  >
    Open in
        <img
      src="https://bantervr.com/assets/Banter_No_Background.png"
      alt="Open in Banter" style="vertical-align:top"
    />
  </a>
</footer>
`;
