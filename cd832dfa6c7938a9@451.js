// https://observablehq.com/@pierreleripoll/share-on-twitter-button@451
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Share on Twitter Button`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Inspired by [@mbostock/tweet](https://observablehq.com/@mbostock/tweet).

This notebook provides a tiny convenience function for sharing a tweet containing a specified URL or notebook's URL default using plain HTML. To use it in your notebook, first import it:

\`\`\`js
import {shareTweet} from "@pierreleripoll/share-on-twitter-button"
\`\`\`

Then define a cell that calls *shareTweet*, passing in the URL to share (notebook's url default), with or without options.

Next I would like to add a media/upload option using [this API](https://developer.twitter.com/en/docs/media/upload-media/overview).
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Default :`
)});
  main.variable(observer()).define(["shareTweet"], function(shareTweet){return(
shareTweet()
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Example with specific URL + options :`
)});
  main.variable(observer()).define(["shareTweet"], function(shareTweet){return(
shareTweet(document.baseURI, {
  buttonText: "Share this notebook on Twitter !",
  text: "Great @ObservableHQ notebook : create a share-on-twitter button 😉",
  hashtags: "observable,demo",
  via: "pierreripoll"
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Link`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`If you prefer you can also create a link instead of a button with 
\`\`\`js
import {shareTweetLink} from "@pierreleripoll/share-on-twitter-button"
\`\`\``
)});
  main.variable(observer("link")).define("link", ["shareTweetLink"], function(shareTweetLink){return(
shareTweetLink(document.baseURI, {
  text: "OMG ! This @ObservableHQ notebook changed my life 🤩",
  hashtags: "link,isthisreallife",
  via: "pierreripoll"
})
)});
  main.variable(observer()).define(["md","link","shareTweet"], function(md,link,shareTweet){return(
md`You can then add it inside Markdown : [for example here](${link}), cool right ? It's simpler than a full ${shareTweet()} and incorporate better in a paragraph. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Code`
)});
  main.variable(observer("style")).define("style", ["html"], function(html){return(
html`<style type="text/css">
.btn a {
    outline: 0;
    text-decoration: none;
}

.btn:active, .btn:focus, .btn:hover {
    background-color: #0c7abf;
    text-decoration : none;
}
.btn:active {
    box-shadow: inset 0 3px 5px rgba(0,0,0,.1);
}

.btn .label {
color : #fff;

    margin-left: 3px;
    white-space: nowrap;
}


.btn {
  margin:3px;
    position: relative;
    height: 20px;
    box-sizing: border-box;
    padding: 1px 8px 1px 6px;
    background-color: #1b95e0;
    color: #fff;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
}

i {
color: #fff
}

.btn i {
    position: relative;
    top: 2px;
    display: inline-block;
    width: 14px;
    height: 14px;
    background: transparent 0 0 no-repeat;
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2072%2072%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h72v72H0z%22%2F%3E%3Cpath%20class%3D%22icon%22%20fill%3D%22%23fff%22%20d%3D%22M68.812%2015.14c-2.348%201.04-4.87%201.744-7.52%202.06%202.704-1.62%204.78-4.186%205.757-7.243-2.53%201.5-5.33%202.592-8.314%203.176C56.35%2010.59%2052.948%209%2049.182%209c-7.23%200-13.092%205.86-13.092%2013.093%200%201.026.118%202.02.338%202.98C25.543%2024.527%2015.9%2019.318%209.44%2011.396c-1.125%201.936-1.77%204.184-1.77%206.58%200%204.543%202.312%208.552%205.824%2010.9-2.146-.07-4.165-.658-5.93-1.64-.002.056-.002.11-.002.163%200%206.345%204.513%2011.638%2010.504%2012.84-1.1.298-2.256.457-3.45.457-.845%200-1.666-.078-2.464-.23%201.667%205.2%206.5%208.985%2012.23%209.09-4.482%203.51-10.13%205.605-16.26%205.605-1.055%200-2.096-.06-3.122-.184%205.794%203.717%2012.676%205.882%2020.067%205.882%2024.083%200%2037.25-19.95%2037.25-37.25%200-.565-.013-1.133-.038-1.693%202.558-1.847%204.778-4.15%206.532-6.774z%22%2F%3E%3C%2Fsvg%3E);
}

</style>`
)});
  main.variable(observer("svg_string")).define("svg_string", function(){return(
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path fill="none" d="M0 0h72v72H0z"/><path class="icon" fill="#fff" d="M68.812 15.14c-2.348 1.04-4.87 1.744-7.52 2.06 2.704-1.62 4.78-4.186 5.757-7.243-2.53 1.5-5.33 2.592-8.314 3.176C56.35 10.59 52.948 9 49.182 9c-7.23 0-13.092 5.86-13.092 13.093 0 1.026.118 2.02.338 2.98C25.543 24.527 15.9 19.318 9.44 11.396c-1.125 1.936-1.77 4.184-1.77 6.58 0 4.543 2.312 8.552 5.824 10.9-2.146-.07-4.165-.658-5.93-1.64-.002.056-.002.11-.002.163 0 6.345 4.513 11.638 10.504 12.84-1.1.298-2.256.457-3.45.457-.845 0-1.666-.078-2.464-.23 1.667 5.2 6.5 8.985 12.23 9.09-4.482 3.51-10.13 5.605-16.26 5.605-1.055 0-2.096-.06-3.122-.184 5.794 3.717 12.676 5.882 20.067 5.882 24.083 0 37.25-19.95 37.25-37.25 0-.565-.013-1.133-.038-1.693 2.558-1.847 4.778-4.15 6.532-6.774z"/></svg>`
)});
  main.variable(observer("shareTweet")).define("shareTweet", ["html","style","shareTweetLink"], function(html,style,shareTweetLink){return(
function shareTweet(url = document.baseURI, options = {}) {
  return html`
    ${style}
    <a class="btn" ${
      options.blockNewTab ? "" : 'target = "_blank"'
    } href=${shareTweetLink(url, options)}>
      <i ></i>
      <span class="label">
        ${options.buttonText || "Tweet"}
      </span>
    </a>
  `;
}
)});
  main.variable(observer("shareTweetLink")).define("shareTweetLink", ["url_options","button_options"], function(url_options,button_options){return(
function shareTweetLink(url = document.baseURI, options = {}) {
  let link = new URL("https://twitter.com/intent/tweet");
  let params = link.searchParams;

  params.set("original_referer", document.baseURI);
  params.set('url', url);
  for (let o in options) {
    if (url_options.includes(o)) params.set(o, options[o]);
    else if (!button_options.includes(o))
      throw new Error(
        `${o} is not a valid option for the share tweet button !`
      );
  }

  return link.href;
}
)});
  main.variable(observer("url_options")).define("url_options", function(){return(
['text', 'hashtags', 'via', 'related']
)});
  main.variable(observer("button_options")).define("button_options", function(){return(
['buttonText', 'blockNewTab']
)});
  return main;
}
