# React Netflix Player

> **Note:** This project was originally developed by [Lucas Dias](https://www.linkedin.com/in/lucas-junior/). I am updating and maintaining this repository according to my needs, while keeping the core vision and credits intact.

## A React Player inspired by Netflix UI

ℹ A video player with the features available in the current Netflix Web Player.

<p align="center">
    <img alt="Shield" src="https://img.shields.io/bundlephobia/min/react-netflix-player?style=flat-square"/>
    <img alt="Shield" src="https://img.shields.io/github/repo-size/lucasmg37/react-netflix-player?style=flat-square"/>
    <img alt="Shield" src="https://img.shields.io/npm/dw/react-netflix-player?style=flat-square"/>
    <img alt="Shield" src="https://img.shields.io/github/issues/lucasmg37/react-netflix-player?style=flat-square"/>
    <img alt="Shield" src="https://img.shields.io/npm/l/react-netflix-player?style=flat-square"/>
    <img alt="Shield" src="https://img.shields.io/github/stars/lucasmg37/react-netflix-player?style=flat-square"/>
    <img alt="Shield" src="https://img.shields.io/github/last-commit/lucasmg37/react-netflix-player?style=flat-square"/>    
</p>

![Demo](https://user-images.githubusercontent.com/25160385/80926822-dbfe8c00-8d6f-11ea-8e39-c24ffc6cfb1b.gif)

<p align=center>
 <a href="#-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-how-to-use">How to Use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-hls-streams">HLS Streams</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-language">Language</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-props">Props</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-events">Events</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-playlist-and-quality">Playlist & Quality</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-controls">Controls</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
 <a href="#-contribute">Contribute</a>
</p>

### 📦 Features

1. Video playback with loading and buffering;
2. Playlist with current video marker and auto-sequence;
3. Skip to next item action;
4. Video end event handling;
5. Play/Pause, Forward/Backward, and FullScreen controls;
6. Multiple playback sources support;
7. Media information display;
8. Playback Rate controls (speed adjustment);
9. Auto-hide controls after inactivity;
10. Customizable colors and fonts;
11. Error handling;
12. Available in English and Portuguese.

### 🧱 Technologies

* [React](https://reactjs.org/)
* [Styled Components](https://styled-components.com/)
* [Babel](https://babeljs.io/)
* [Webpack](https://webpack.js.org/)

Code Quality:

* [ESlint](https://eslint.org/)
* [Prettier](https://prettier.io/)

### ⚙ How to Use

Install with:

```bash
npm i @maheshsharan/react-netflix-player
# or
yarn add maheshsharan/react-netflix-player
```

Import into your component:

```tsx
import ReactNetflixPlayer, { LanguagesPlayer } from 'react-netflix-player';

export default function Demo() {
  return (
    <div style={{ width: 800, height: 450 }}>
      <ReactNetflixPlayer
        src="/video.mp4"
        title="My Video"
        subTitle="Description"
        autoPlay={false}
        playerLanguage={LanguagesPlayer.en}
      />
    </div>
  );
}
```

### 📡 HLS Streams

- The player auto-detects `.m3u8` URLs and uses `hls.js` when supported.
- Quality and subtitle menus are populated from HLS levels and tracks.

```tsx
<ReactNetflixPlayer
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  autoPlay
  title="Sample HLS"
  playerLanguage={LanguagesPlayer.en}
  onHLSError={(err) => console.log('HLS error', err)}
/>
```

### 🌐 Language

- Set UI language via `playerLanguage`:
  - `LanguagesPlayer.pt` or `LanguagesPlayer.en`

### 📃 Props

#### `src: string`

Required. The video URL or source.

Changing this resets the player state.

#### `title: string`

Displayed as video title when paused for a long time.

#### `subTitle: string`

Additional text displayed below `title`.

#### `titleMedia: string`

Displayed in the control bar (e.g., playlist title).

#### `extraInfoMedia: string`

Additional text shown next to `titleMedia`.

#### `playerLanguage: 'pt' | 'en'`

Sets the player language (default: `pt`).

#### `overlayEnabled: boolean`

Enables/disables standby overlay when paused.

#### `autoControllCloseEnabled: boolean`

Auto-hide controls after inactivity (default: true).

#### `fullPlayer: boolean`

Occupies full parent container (not browser fullscreen).

#### `backButton: boolean`

Shows/hides back button.

#### `autoPlay: boolean`

Starts playback automatically (may be blocked by browsers).

#### `startPosition: number`

Initial playback position in seconds.

#### `playbackRateEnable: boolean`

Enables playback speed control (default: true).

#### `playbackRateOptions: string[]`

Array of available playback speeds.

#### `playbackRateStart: number`

Initial playback speed (default: 1).

#### `dataNext: { title: string, description: string }`

Next video information.

#### `reprodutionList: { id: number | string, name: string, playing: boolean, percent?: number }[]`

Playlist items. `name` is preferred (legacy `nome` is still supported).

#### `qualities: { id: string | number, prefix?: string, nome?: string, name?: string, playing: boolean }[]`

Legacy quality options (non-HLS). Use with `onChangeQuality`.

#### Event Handlers

* `onCanPlay()` – when video is ready to play
* `onTimeUpdate(e)` – called on time updates
* `onEnded()` – video ended
* `onErrorVideo()` – error in playback
* `onHLSError(error)` – HLS-specific error callback
* `onNextClick()` – next video clicked
* `onClickItemListReproduction(id, playing)` – playlist item clicked
* `onCrossClick()` – player closed

### 💅 Styling

* `primaryColor` – primary color (default: `#03dffc`)
* `secundaryColor` – secondary color (default: `#ffffff`)
* `fontFamily` – custom font family

### 🧨 Events

* **Error:** Shows error message with alternate sources.
* **Controls:** Auto-hide after 5s of inactivity.
* **StandBy:** Active when paused with no activity.
* **Loading:** Active while buffering.

### 🧾 Playlist and Quality

- Playlist: pass `reprodutionList` to render the side menu. The current item should have `playing: true`.
- Quality:
  - HLS: levels are detected automatically and shown in the settings menu.
  - Legacy (non-HLS): pass `qualities` and handle `onChangeQuality(id)`.

### 🕹 Controls

* **Double Click:** Fullscreen toggle
* **Space:** Play/Pause toggle

### 👩‍💻 Contribute

Clone the repo:

```bash
git clone https://github.com/MaheshSharan/react-netflix-player
cd react-netflix-player
npm install
```

Build:

```bash
npm run build
```

The final build will be in `dist/`.

### ✨ Contributing Steps

1. Fork the project.
2. Create a new branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m "feature: My new feature"`
4. Push: `git push origin my-feature`

### ✌️ Contributors

| [<img src="https://avatars3.githubusercontent.com/u/38473739?s=115" width="115"><br><small>@Prophetaa</small>](https://github.com/Prophetaa) | [<img src="https://avatars0.githubusercontent.com/u/32423942?s=115" width="115"><br><sub>@lfoliveir4</sub>](https://github.com/lfoliveir4) | [<img src="https://avatars0.githubusercontent.com/u/49363242?s=115" width="115"><br><sub>@romilodev</sub>](https://github.com/romilodev) | [<img src="https://avatars0.githubusercontent.com/u/1103336?s=115" width="115"><br><sub>@ridhwaans</sub>](https://github.com/ridhwaans) |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |

### 📝 License

This project is licensed under the MIT License.

Originally created with ❤ and ☕ by Lucas Dias. 👋 [Contact here](https://www.linkedin.com/in/lucas-junior/).
