# Quiz It Right

A recycling minigame with two modes:

- **Quiz It Right**: sort items into the right bin. Quiz mode (10 items, against the clock) or Unlimited mode (endless items, 3 lives, streak multipliers).
- **Sort It Right**: fix the mixed-up bins across 5 stages without running out of lives.

## How to play

Open `index.html` in a browser. No build step or server needed.

## Project structure

```
index.html        HTML for every screen
css/base.css      colours, fonts, background, buttons, mode select, modals, admin
css/quiz.css      Quiz It Right game stage, bins, results, leaderboards
css/sort.css      Sort It Right board, stage map, stars
js/data.js        bins and items (edit this to add new items)
js/storage.js     saving leaderboards and Sort It Right progress
js/ui.js          shared helpers: screens, animations, drawings, confetti
js/quiz.js        Quiz and Unlimited modes
js/sort.js        Sort It Right
js/admin.js       admin panel
js/main.js        button wiring
```

The scripts are plain `<script>` tags that share variables, so **their order in `index.html` matters**: each file uses things defined in the files above it.

## Notes

- Leaderboards and progress are saved in the browser's `localStorage`, so they are per device.
- The admin password is in `js/admin.js` and visible to anyone who reads the code, so it is only a light lock.
