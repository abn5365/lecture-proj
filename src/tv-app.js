// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import '@lrnwebcomponents/video-player';

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.jsonfile = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.source = 'https://www.youtube.com/watch?v=LrS7dqokTLE';
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
     
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .video-container {
        display: grid;
        grid-template-columns: 1fr 300px;
        grid-template-rows: 1fr;
        gap: 32px;
      }
      
      .video-screen {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
      
      .lecture-slides {
        grid-column: 2 / 3;
        grid-row: 1 / 2; /* Update this line */
      }
      
      .video-info {
        background-color: red;
        width: 100%;
        height: 100%;
        grid-column: 1 / 2;
        grid-row: 2 / 3; /* Update this line */
      }

      .float-parent {
        width: 100%;
      }

      .float-child {
        width: 50%;
        float: left;
      }

      .previous-button {
        background-color: red; 
        margin-right: 50%; 
        height: 100px;
      }

      .next-button {
        background-color: red; 
        margin-left: 50%; 
        height: 100px;  
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
    <div class="video-container">
    <div class="lecture-slides">
      <h2>${this.name}</h2>
      ${
        this.listings.map(
          (item) => html`
            <tv-channel
              id="${item.id}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }
    </div>
    <div class="video-screen">
      <video-player source="${this.source}"></video-player>
    </div>
    <div class="video-info"></div>
    <div class="float-parent">
      <div class="float-child">
        <div class="previous-button">prev button</div>
      </div>
      <div class="float-child">
        <div class="next-button">next button</div>
      </div>
    </div>
  </div>
  
      ${this.activeItem.name}
      ${this.activeItem.description}
        <!-- video -->
        <div>
        <video-player source="${this.source}"></video-player>
       
        <!-- discord / chat - optional -->
      </div>
      <!-- dialog -->
      <sl-dialog label="Dialog" class="dialog">
      ${this.activeItem.title}
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
    };
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
        console.log(this.listings);
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
