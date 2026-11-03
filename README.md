# 🐿️ ChipLife

A family-friendly life simulator. Live a whole life one year at a time: grow up, go to school,
build a career, adopt pets and kids, buy homes, travel… or pull off goofy cartoon bank heists
(and maybe end up in jail). No romance, no bad words, nobody ever gets hurt.

## Play

**Play online: https://games.randomstuff.world/chiplife/**

Or run it locally:

```
python serve.py        # http://localhost:3508
```

Saves automatically in the browser (localStorage).

## Android APK

Download `ChipLife.apk` from the [Releases](https://github.com/RandomProjects1234/chiplife/releases) page, or build it to `dist/ChipLife.apk`. Copy it to an Android phone (Android 7.0+), open it and allow "install unknown
apps". It runs fully offline, needs no permissions, and saves on the phone.

Rebuild with **`Build ChipLife APK.bat`** (parent folder) or `node tools/build-apk.mjs`. It uses the
Android SDK at `D:\Android\Sdk` (build-tools 34 + platforms/android-34) and JDK 25 — no Gradle.
The first build creates your own signing key in `android/signing/` (not in this repo). Back it up: updates
to an installed app must be signed with the same key. Bump `VERSION_CODE` in the build script for
each new release.

## What's in it

- **290 life events** for babies, kids, teens, adults, seniors and jail, many with choices
- **School → university → grad school** (law, medicine, MBA, PhD), pop quizzes, clubs
- **55 careers** with promotions, raises, interviews, plus 15 part-time jobs
- **People**: parents, grandparents, siblings, friends, adopted kids and 10 kinds of pets
- **Activities**: gym, hobbies & 7 skills, videos/books/songs, talent shows, auditions,
  volunteering, donating, vacations, a charity raffle, driving test, moving countries
- **Mischief & heists**: pranks, shoplifting, pickpocketing, burglary, car theft and a full
  bank-heist planner (target → approach → partner → vault-dial minigame → getaway)
- **Court & jail**: pick a lawyer, serve time, study/work out/behave for parole, appeal,
  or try the searchlight **escape minigame**
- **Stuff**: shop, vehicles, homes (cash or mortgage), loans, yearly budget
- **Legacy**: Life Chips when a life ends, continue as your adopted kid, **47 Acorns**
  (achievements) that unlock perks for future lives

## How it's built

Plain HTML/CSS/JS, no build step, no dependencies.

```
js/core.js         CL namespace, content registry (CL.add), constants, helpers
js/content/*.js    all the writing and data (events, texts, jobs, quiz, catalog, countries)
js/engine/*.js     game rules — no DOM, runs in Node too
js/ui/*.js         screens, panels, modals and minigames
js/main.js         boot + window.__CL debug hook
```

The content in `js/content/` was written by a team of **Claude Haiku** writers, each following
[`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) and self-checking with the content checker.

## Tools

```
node tools/check-content.mjs              # schema + token + family-friendly word check
node tools/soak.mjs 200                   # a bot plays 200 lives headlessly; reports errors & balance
node tools/cdp.mjs tools/tests/smoke.mjs  # end-to-end UI test in headless Edge (server must be running)
node tools/build-index.mjs                # after adding a content file: refresh index.html's script list
node tools/build-apk.mjs                  # signed Android APK -> dist/ChipLife.apk
W=360 H=640 node tools/cdp.mjs tools/tests/audit.mjs   # layout audit (overflow check + screenshots)
W=360 H=640 node tools/cdp.mjs tools/tests/back.mjs    # Android back-button contract
```

Debug hook in the browser console: `__CL.age(10)` ages up 10 years, `__CL.auto('win')` auto-wins
minigames (`'lose'` / `null` too).

## License

MIT, see [LICENSE](LICENSE). The bundled Nunito font is under the SIL Open Font License.
