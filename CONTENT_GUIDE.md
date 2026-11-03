# ChipLife — Content Writer's Guide

ChipLife is an original, **family-friendly** text life simulator. You live a whole
life one year at a time: grow up, go to school, get jobs, adopt pets and kids,
buy houses, take vacations… and, if you dare, pull off silly cartoon-caper
crimes like bank heists (which can land you in jail). Our mascot is **Chip the
chipmunk** 🐿️.

The game engine is already written. **Your job is to write content data files**
that the engine reads. Everything you write is plain data in JavaScript files.

---------------------------------------------------------------------------------

## 1. Family-friendly rules (MOST IMPORTANT — read twice)

Every line must be fine for an 8-year-old to read with their grandma.

NEVER write about:
- Romance of any kind: dating, crushes, kissing, boyfriends/girlfriends, weddings,
  marriage, husbands/wives, flirting, valentines, "love interests". Do not use
  the word **love** at all (use *adore*, *really like*, *enjoy*, *treasure*).
- Swear words or rude words, even mild ones: damn, hell, crap, sucks, stupid,
  idiot, dumb, jerk, loser, shut up, butt, fart, poop, ugly, fat …
- Alcohol, drinking, bars, smoking, vaping, drugs, casinos, gambling or betting.
- Weapons (guns, knives, swords…), fighting, punching, hurting anyone, blood,
  injuries described in detail, kidnapping, threats, anything scary or gory.
- Death or dying (the engine handles gentle goodbyes itself — you never write them).
- Body shaming, dieting/weight talk, bullying presented as fun, mean put-downs.
- Real brand names (no Disney, Lego, iPhone, PlayStation, McDonald's…), real
  celebrities, politics, religion.
- BitLife or any other game — **write 100% original text**, don't copy anything.

Crime IS allowed, but only as **goofy, non-violent cartoon capers**: fake
mustaches, sneaking, tunnels, disguises, getaway minivans, alarms going off,
slipping on banana peels. **Nobody ever gets hurt and nobody has a weapon.**
Getting caught has fair consequences (fines, community service, jail time) and
the tone stays light. Never make crime sound cool-and-consequence-free.

Tone: warm, funny, a little silly, upbeat. Short punchy sentences. Second
person ("You …"). Variety matters: don't start every line the same way.

---------------------------------------------------------------------------------

## 2. File format

Each content file is a plain browser script (NOT a module). It only calls
`CL.add(group, data)`:

```js
// js/content/events_kids_1.js
CL.add("events", [
  { id: "kid_first_word", minAge: 1, maxAge: 1, once: true,
    text: "You said your very first word: \"acorn\"!",
    effects: { joy: 5 } },
  // ...more
]);
```

- Arrays are concatenated, objects are merged, so a file may call `CL.add`
  several times and several files may add to the same group.
- **Use double quotes for all strings.** Apostrophes inside are fine
  ("You can't wait"). If you need double quotes inside text, escape them `\"`.
- Plain ASCII punctuation is preferred; emoji only where a field asks for one.
- No `import`/`export`, no functions, no variables — just `CL.add(...)` calls.
- Long content? Split it across numbered files (`events_kids_1.js`,
  `events_kids_2.js`, …). Each file must be complete and valid on its own.

**Check your work** (required). From the `chiplife` folder run:

```
node tools/check-content.mjs js/content/YOUR_FILE.js
```

It reports syntax errors, schema errors, unknown tokens and banned words. Fix
every ERROR. Read every WARNING and fix it unless it's clearly harmless. Re-run
until it says `0 errors`.

---------------------------------------------------------------------------------

## 3. Fixed vocabularies (use these exact ids)

Stats (0–100): `joy` (happiness), `health`, `smarts`, `style` (looks/confidence), `kindness`.

Other numbers: `money` (US dollars), `fame` (0–100), `notoriety` (how much the
police have their eye on you, 0–100), `followers` (social media).

Skills (0–100): `music`, `art`, `sports`, `coding`, `cooking`, `writing`, `acting`.

Pet species ids: `dog`, `cat`, `rabbit`, `hamster`, `guinea_pig`, `bird`, `fish`, `turtle`, `lizard`, `horse`.

Illness ids: `cold`, `flu`, `allergies`, `ear_infection`, `chickenpox`,
`stomach_bug`, `sprained_ankle`, `broken_arm`, `sunburn`, `asthma`, `migraine`,
`back_pain`, `high_blood_pressure`, `arthritis`, `cataracts`.

College majors: `art`, `biology`, `business`, `chemistry`, `computer_science`,
`culinary_arts`, `economics`, `education`, `engineering`, `english`,
`environmental_science`, `history`, `journalism`, `music`, `nursing`, `physics`,
`psychology`, `sports_science`, `theater`, `architecture`.

Education levels: `none`, `highschool`, `bachelor`, `law`, `medical`, `business`, `phd`.

Job tracks: `Education`, `Healthcare`, `Technology`, `Science`, `Business`,
`Finance`, `Law`, `Arts`, `Media`, `Food`, `Trades`, `Retail`, `Transport`,
`Public Service`, `Sports`, `Animals`, `Space`, `Entertainment`.

---------------------------------------------------------------------------------

## 4. Text tokens

Write `{token}` inside text and the engine swaps in the right word. Only use
tokens listed for the group you are writing. The engine automatically skips an
event if a token can't be filled (e.g. `{pet}` when the player has no pet), so
using a token is also how you say "this needs a pet".

| token | becomes | example |
|---|---|---|
| `{name}` | the player's first name | "Mila" |
| `{city}` / `{country}` | where the player lives | "Zagreb" / "Croatia" |
| `{mom}` / `{dad}` | the word Mom / Dad (works mid-sentence) | "You helped Mom bake." |
| `{grandparent}` | grandparent with title | "Grandma Rosa" |
| `{sibling}` + `{siblingRole}` | sibling's name + "brother"/"sister" | "your {siblingRole} {sibling}" → "your brother Leo" |
| `{friend}` | a friend's first name | "your friend {friend}" |
| `{child}` + `{childRole}` | player's kid + "son"/"daughter" | "your {childRole} {child}" |
| `{pet}` + `{petType}` | pet's name + species word | "{pet} the {petType}" → "Biscuit the dog" |
| `{classmate}` | a random kid's first name | |
| `{teacher}` | teacher with title | "Ms. Rivera" |
| `{neighbor}` | neighbor with title | "Mr. Okafor" |
| `{coworker}` | a coworker's first name | |
| `{boss}` | boss with title | "your boss {boss}" → "your boss Ms. Kim" |
| `{newFriend}` | name of a brand-new friend (use with effect `newFriend: true`) | |
| `{school}` | current school name | "Maple Grove Elementary" |
| `{job}` / `{company}` | player's job title / employer | "Senior Chef" / "Copper Pot Bistro" |
| `{amount}` | in event outcomes: the money in that outcome's effects, formatted | "$20" |

Don't use he/she/him/her for other characters — use their name or "they".

---------------------------------------------------------------------------------

## 5. Events (`CL.add("events", [...])`)

Random things that happen during a year. Some just happen; some ask the player
to choose.

```js
{
  id: "kid_lost_tooth",     // unique snake_case; prefix with your file's area (kid_, teen_, adult_, senior_, prison_)
  minAge: 5, maxAge: 8,     // inclusive age range when it can happen
  weight: 1,                // optional relative frequency 0.2–3 (default 1)
  once: true,               // optional: at most once per life
  needs: ["school"],        // optional conditions, see list below
  text: "Your wobbly front tooth finally fell out at lunch! What do you do with it?",
  choices: [
    { label: "Put it under your pillow",
      outcomes: [
        { weight: 3, text: "You woke up to find {amount} under your pillow!", effects: { money: 5, joy: 6 } },
        { weight: 1, text: "Nothing happened. The tooth fairy must have been busy.", effects: { joy: -2 } }
      ] },
    { label: "Keep it in a little jar",
      outcomes: [ { text: "You added it to your collection of very strange treasures.", effects: { joy: 2 } } ] }
  ]
}
```

Three shapes are allowed:
1. **Simple**: `text` + `effects` (no choices) — it just happens.
2. **Random**: `text` + `outcomes` (no choices) — one outcome is picked by weight.
3. **Choice**: `text` + `choices` (2–4 choices, each with 1–3 `outcomes`).

Outcome fields: `text` (required, past tense, ≤ 200 chars), `effects` (object,
may be `{}`), `weight` (default 1), `favor` (optional: a stat or skill name —
the outcome becomes more likely when the player is good at it, e.g. put
`favor: "smarts"` on the outcome where being clever pays off).

`text` of the event itself: ≤ 200 chars. Choice `label`: ≤ 40 chars, starts
with a verb ("Help them out", "Keep the money", "Run away squealing").

### `needs` values
`school` (in elementary/middle/high school) · `college` (in college or grad
school) · `job` (has a job) · `noJob` (adult without a job) · `prison` (in jail —
**only** events with this need happen in jail, and they never happen outside) ·
`car` · `house` (owns a home) · `rich` ($100k+) · `poor` (under $1k) · `famous` ·
`record` (has a criminal record) · `license` (driver's license) · `withParents`
(lives with parents) · `ownPlace` (lives on their own) · `retired`.

### `effects` keys
| key | meaning | sensible range |
|---|---|---|
| `joy`, `health`, `smarts`, `style`, `kindness` | stat change | −15…+15 (usually ±2…8) |
| `money` | dollars gained (+) or spent (−) | kids ±1…50, teens ±5…300, adults ±20…5000 |
| `fame` | fame change | 0…+10 |
| `notoriety` | police attention | 0…+15 |
| `followers` | social-media followers | 0…+5000 |
| `bond` | friendship change with the FIRST person token in the event text | −20…+20 |
| `skills` | object of skill gains, e.g. `{ music: 4 }` | +1…+10 each |
| `grades` | school grades (only with `needs: ["school"]` or `["college"]`) | −15…+15 |
| `performance` | job performance (only with `needs: ["job"]`) | −15…+15 |
| `newFriend` | `true` → `{newFriend}` becomes a friend | |
| `addPet` | a pet species id → player gets that pet | |
| `illness` | an illness id → player catches it | |
| `gainItem` | short item name, e.g. `"a shiny red bicycle"` | |
| `fine` | dollars paid as a fine (positive number) | 20…2000 |
| `record` | adds a short criminal-record entry, e.g. `"Sneaking into a cinema"` | |
| `jail` | years in jail (teens/adults only, rare!) | 1…3 |
| `endJob` | `true` → player loses their job (only with `needs: ["job"]`) | |

Keep effects believable and balanced: good choices aren't always rewarded,
silly choices are sometimes funny, nothing is huge.

---------------------------------------------------------------------------------

## 6. Activity text (`CL.add("activityText", {...})`)

Flavor lines shown when the player does an activity. The engine decides the
stat changes and picks a bucket; you write the lines. 1–2 sentences, ≤ 160
chars, past tense, "You …". Write **at least 6 lines per bucket** unless noted.

Buckets mean: `great` (wonderful result), `good`, `meh` (nothing special),
`bad` (a small, harmless mishap — never an injury worse than a sore muscle).

| key | buckets | tokens allowed |
|---|---|---|
| `gym` | great good meh bad | |
| `walk` | great good meh bad | `{city}` |
| `meditate` | great good meh bad | |
| `library` | great good meh bad | |
| `healthyMeal` | great good meh bad | |
| `doctorCheckup` | good (healthy checkup), cured, notCured | `{illness}` (in cured/notCured) |
| `music` | great good meh bad | `{instrument}` |
| `art` | great good meh bad | |
| `coding` | great good meh bad | |
| `cooking` | great good meh bad | |
| `sports` | great good meh bad | `{sport}` |
| `acting` | great good meh bad | |
| `writing` | great good meh bad | |
| `movies` | great good meh bad | `{movie}` |
| `amusementPark` | great good meh bad | |
| `arcade` | great good meh bad | |
| `vacation` | great good meh bad | `{place}` |
| `party` | great good meh bad | |
| `volunteer` | great good meh bad | `{cause}` |
| `donate` | great good | `{amount}`, `{charity}` |
| `raffle` | win, lose | `{amount}` (win only) |
| `makeFriend` | success, fail | `{them}` (success only) |
| `video` | viral, good, flop | `{topic}` |
| `book` | hit, good, flop | `{title}` |
| `song` | hit, good, flop | `{title}` |
| `talentShow` | win, good, flop | `{talent}` |
| `audition` | success, fail | `{role}` |

`{name}` and `{city}` work everywhere. Plus these lists (`CL.add("lists", {...})`):
- `movies`: 20 made-up family movie titles ("The Great Pancake Parade")
- `charities`: 12 made-up charity names ("Paws & Whiskers Rescue")
- `movieRoles`: 15 fun roles ("a talking tree in a fantasy film")

---------------------------------------------------------------------------------

## 7. People interaction text (`CL.add("interactionText", {...})`)

Shown when the player interacts with a family member, friend, their kid or a
pet. `{them}` = that person's or pet's name (parents appear as "Mom"/"Dad",
grandparents as "Grandma Rosa"). ≥ 5 lines per bucket. ≤ 160 chars, past tense.

| key | buckets | extra tokens |
|---|---|---|
| `spendTime` | great good meh bad | |
| `chat` | great good meh bad | `{topic}` |
| `compliment` | great good meh bad | |
| `gift` | great good meh bad | `{gift}` |
| `playGame` | great good meh bad | `{game}` |
| `joke` | great good meh bad | |
| `askMoney` | yes, no | `{amount}` (yes only) |
| `apologize` | great good bad | |
| `argue` | good (you made up), bad | |
| `prank` | great good bad | |
| `hug` | great good meh | |
| `chores` | great good meh | `{chore}` |
| `readStory` | great good meh | (reading to your own kid) |
| `teach` | great good meh | `{lesson}` (teaching your own kid) |
| `allowance` | good | `{amount}` (giving your kid pocket money) |
| `remember` | good | (remembering someone who has passed on — gentle, warm) |
| `endFriendship` | good | (parting ways kindly) |
| `petPlay` | great good meh bad | `{petType}` |
| `petWalk` | great good meh bad | `{petType}` |
| `petTreat` | great good meh | `{petType}` |
| `petVet` | good | `{petType}` |

Lists: `chatTopics` (30, e.g. "whether dinosaurs could swim"), `games` (25, e.g.
"checkers", "a giant jigsaw puzzle"), `chores` (15, e.g. "folding a mountain of
laundry"), `lessons` (15, e.g. "how to ride a bike").

---------------------------------------------------------------------------------

## 8. Mischief & heist text (`CL.add("crimeText", {...})`)

Cartoon-caper tone (see rules!). ≥ 5 lines per bucket, ≤ 180 chars, past tense.

| key | buckets | tokens |
|---|---|---|
| `prank` | success, fail, caught | `{prank}` |
| `shoplift` | success, fail, caught | `{loot}`, `{store}` |
| `pickpocket` | success, fail, caught | `{target}`, `{amount}` (success) |
| `burglary` | success, fail, caught | `{home}`, `{amount}` (success) |
| `carTheft` | success, fail, caught | `{car}` |
| `bankHeist` | success, fail, caught | `{bank}`, `{amount}` (success) |
| `heistPlan` | tunnel, disguise, hack | `{bank}` (one line describing the plan getting started) |
| `getaway` | success, caught | |
| `court` | guilty, notGuilty, fine, juvenile | `{years}` (guilty), `{amount}` (fine) |
| `prison` | arrive, release, parole, paroleDenied, appealWin, appealLose, escapeSuccess, escapeCaught, study, workout, behave, makeFriend, kitchen | `{prison}`, `{years}` (arrive), `{them}` (makeFriend) |

`fail` = it just didn't work out but nobody noticed. `caught` = a guard,
officer or shop owner caught you (the engine then handles the fine/court).
`juvenile` = a kid gets community service / a talking-to instead of jail.
Prison is a calm place where you can learn, exercise and make friends.

Lists: `pranks` (20 phrases that fit "You {prank}", e.g. "filled the
principal's office with balloons"), `stores` (20, e.g. "the corner candy
shop"), `shopLoot` (30, e.g. "a pack of glitter pens"), `pickpocketTargets` (20,
e.g. "a tourist busy taking selfies"), `stealCars` (20, e.g. "an ice cream
truck", "a shiny red convertible"), `bankNames` (15 made-up banks),
`prisonNames` (12 made-up, e.g. "Granite Hill Correctional").

---------------------------------------------------------------------------------

## 9. World data

### Countries (`CL.add("countries", [...])`)
```js
{ id: "croatia", name: "Croatia", flag: "🇭🇷",
  cities: ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Pula", "Dubrovnik", "Varazdin"],
  boy: [/* 30 common boy first names */], girl: [/* 30 */], last: [/* 30 surnames */] }
```
Names: realistic and common for that country, written in plain Latin letters
(no accents needed). Real cities.

### Names lists (`CL.add("lists", {...})`)
- `schoolNames`: object with `elementary`, `middle`, `high`, `college` — 15
  made-up names each ("Maple Grove Elementary", "Pinecrest Middle School",
  "Riverside High", "Northbrook University").
- `companies`: object keyed by every job track (see section 3) → 8 made-up
  company names each ("Copper Pot Bistro").

---------------------------------------------------------------------------------

## 10. Jobs (`CL.add("jobs", [...])` and `CL.add("partTimeJobs", [...])`)

```js
{ id: "nurse", track: "Healthcare", emoji: "🩺",
  levels: ["Nursing Assistant", "Registered Nurse", "Charge Nurse", "Nurse Manager", "Director of Nursing"],
  salary: [31000, 62000, 74000, 88000, 118000],
  edu: "bachelor", majors: ["nursing", "biology"], minSmarts: 45,
  desc: "Care for patients and keep them healthy." }
```
- `levels`: 3–6 titles, junior → senior. `salary`: same length, yearly USD, increasing.
- `edu`: education level needed. `majors` (optional): which bachelor majors qualify.
- optional `minSmarts`, `minHealth`, `minStyle` (0–90) and `skill` (e.g. `{ "sports": 60 }`).
- `desc` ≤ 80 chars.

Salary guide: no-education jobs start $18k–30k and top out ≤ $60k;
highschool starts $22k–35k, tops ≤ $85k; bachelor starts $35k–65k, tops
$90k–250k; law/medical start $60k–90k, top $200k–450k; business (MBA) can top
out around $1.5M for a CEO; phd starts ~$55k, tops ~$180k. Sports/Entertainment
stars can top out at $2M–5M but need high skills.

Part-time (teens/students):
```js
{ id: "dog_walker", title: "Dog Walker", emoji: "🐕", hourly: 12, hours: 10, minAge: 14,
  desc: "Walk the neighborhood's dogs after school." }
```
`hourly` 9–18, `hours` (per week) 6–20, `minAge` 14–16.

---------------------------------------------------------------------------------

## 11. Quiz questions (`CL.add("quiz", {...})`)

- `school`: `{ q, a: [4 answers], c: indexOfCorrect, minAge, maxAge, subject }`
  — subject one of `math`, `science`, `geography`, `language`, `history`,
  `nature`, `art`, `music`. Facts must be 100% correct and unambiguous.
- `driving`: `{ q, a: [4], c }` — general safe-driving common sense (no
  country-specific laws or numbers).
- `interview`: `{ q, a: [ { t: "answer", s: 2 }, { t: "...", s: 1 }, { t: "...", s: 0 }, { t: "...", s: -1 } ] }`
  — exactly 4 answers in random order: one best (2), one okay (1), one weak
  (0), one silly (−1, make it funny).

---------------------------------------------------------------------------------

## 12. Catalog (`CL.add("catalog", {...})`)

All prices in USD. Made-up brand names only.

- `items`: `{ id, name, emoji, price, minAge, kind, effects, unlocks?, desc }`
  — `kind` one of `toy gadget instrument sports fashion book art kitchen hobby`;
  `effects` small one-time stat boost (1–8) e.g. `{ joy: 4 }`; `unlocks`
  (optional) one of `music coding video art sports cooking writing acting`.
- `vehicles`: `{ id, name, emoji, price, kind, style }` — `kind` one of `bike
  scooter car suv van truck sports luxury`; `style` 0–10.
- `houses`: `{ id, name, emoji, price, rooms, style, desc }` — $40k to $15M.
- `pets`: `{ id (pet species id), name, emoji, fee, life: [min, max], upkeep, desc, breeds: [8 names] }` — all 10 species.
- `vacations`: `{ id, place, emoji, price, joy, desc }` — `joy` 6–15.
- `illnesses`: `{ id (illness id), name, emoji, minAge, maxAge, severity (1–3), healthHit (2–12 per year), selfHeal (0–1 yearly chance it goes away), treat (doctor cost), cure (0–1 chance a doctor cures it), text, curedText }` — all 15 ids. Gentle, non-scary text.

Lists (`CL.add("lists", {...})`): `videoTopics` (25, fit "a video about {topic}"),
`bookTitles` (30), `songTitles` (30), `petNames` (60).
