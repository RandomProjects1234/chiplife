// ChipLife teen events, part 3: young adults (ages 14-25) and light mischief (ages 13-25)
CL.add("events", [
  {
    id: "teen_wallet_found", minAge: 16, maxAge: 25,
    text: "You find a wallet on the bus. It has a photo of a grandma holding a cake and a note that says 'Call me!'",
    choices: [
      { label: "Return the wallet to its owner",
        outcomes: [
          { weight: 2, text: "The owner was so happy they gave you a $50 reward and a very large thank-you cookie.", effects: { money: 50, kindness: 5, joy: 3 } },
          { weight: 1, text: "Finding the owner took some detective work, but you delivered the wallet by bike. Hooray!", effects: { kindness: 4, joy: 2 } }
        ] },
      { label: "Hand it to the lost-and-found desk",
        outcomes: [
          { text: "The clerk promised to track down the owner. You walked away feeling helpful and a little proud.", effects: { kindness: 2 } }
        ] }
    ]
  },
  {
    id: "teen_sibling_volcano", minAge: 14, maxAge: 25,
    text: "Your {siblingRole} {sibling} needs help building a volcano for a project due tomorrow. It is 9 p.m. on a school night.",
    choices: [
      { label: "Help build the volcano",
        outcomes: [
          { weight: 2, text: "The volcano erupted all over the kitchen table, and {sibling} declared you the best sibling ever.", effects: { bond: 6, joy: 3 } },
          { weight: 1, text: "The volcano leaked everywhere, but you mopped it up together, laughing the whole time.", effects: { bond: 4, kindness: 2 } }
        ] },
      { label: "Say you'll help tomorrow",
        outcomes: [
          { text: "{sibling} sighed and finished the project alone. You felt guilty all evening, and the volcano looked lonely.", effects: { bond: -4 } }
        ] }
    ]
  },
  {
    id: "teen_grandparent_call", minAge: 16, maxAge: 25,
    text: "Your {grandparent} calls to ask whether you still like pancakes, and whether you are eating enough vegetables.",
    choices: [
      { label: "Chat for an hour",
        outcomes: [
          { weight: 2, text: "You told {grandparent} all about your week. They laughed at every single story and asked for more.", effects: { bond: 6, joy: 3 } },
          { weight: 1, text: "The call went on so long your phone warned you about its battery twice. Totally worth it.", effects: { bond: 4 } }
        ] },
      { label: "Say you'll call back later",
        outcomes: [
          { text: "The reminder note fell behind the fridge, and the call never happened. Oops.", effects: { bond: -2 } }
        ] }
    ]
  },
  {
    id: "teen_neighbor_lawn", minAge: 14, maxAge: 20,
    text: "{neighbor} asks if you would mow their lawn this weekend. The grass is now taller than the mailbox.",
    choices: [
      { label: "Mow the whole yard",
        outcomes: [
          { weight: 2, text: "{neighbor} paid you $60 and handed you a lemonade so cold it made your ears ring.", effects: { money: 60, kindness: 2 } },
          { weight: 1, text: "The mower coughed, sputtered, and then decided to behave. You earned $35 and a wave.", effects: { money: 35, health: 1 } }
        ] },
      { label: "Offer to trim the hedges",
        outcomes: [
          { text: "The hedges looked sharp and tidy, and {neighbor} paid you $25 with a thank-you note.", effects: { money: 25, kindness: 1 } }
        ] }
    ]
  },
  {
    id: "teen_car_breakdown", minAge: 18, maxAge: 25, needs: ["car"],
    text: "Your car starts making a noise like a sleepy goose. A little yellow light on the dashboard is glowing worriedly.",
    choices: [
      { label: "Take it to the mechanic",
        outcomes: [
          { weight: 2, text: "The mechanic tightened one bolt and charged a fair price. The goose has retired.", effects: { money: -180 } },
          { weight: 1, text: "The mechanic found a bigger problem. The bill was bigger too, and so was your sigh.", effects: { money: -450, joy: -2 } }
        ] },
      { label: "Watch a how-to video and fix it",
        outcomes: [
          { weight: 2, text: "The how-to video was clear, and the goose went quiet after one tiny adjustment.", effects: { smarts: 3, joy: 2 } },
          { weight: 1, text: "Your fix worked for one day. Then the goose returned for a surprise visit.", effects: { money: -60, joy: -1 } }
        ] }
    ]
  },
  {
    id: "teen_tax_forms", minAge: 18, maxAge: 25, needs: ["job"],
    text: "Tax season arrives with forms that read like riddles. You spread your paycheck stubs across the table and begin.",
    outcomes: [
      { weight: 3, text: "The math worked out, and a tax refund of $320 was on its way. Quiet, happy cheering broke out.", effects: { money: 320, joy: 3 } },
      { weight: 2, text: "You filed everything on time and felt like a very responsible grownup for one whole afternoon.", effects: { smarts: 3 } },
      { weight: 1, text: "You forgot one tiny form, which then needed its own form. You survived the paperwork anyway.", effects: { money: -40, joy: -2 } }
    ]
  },
  {
    id: "teen_library_story_time", minAge: 16, maxAge: 25,
    text: "The public library needs volunteers to read picture books to toddlers on Saturday. Your story voice is ready.",
    choices: [
      { label: "Sign up for story time",
        outcomes: [
          { weight: 2, text: "The toddlers giggled at every silly voice, and one of them gave you a sticky high five.", effects: { kindness: 4, joy: 3, skills: { acting: 2 } } },
          { weight: 1, text: "The toddlers wanted the same book six times. You read it with a different silly voice every time.", effects: { kindness: 3, joy: 2 } }
        ] },
      { label: "Donate picture books instead",
        outcomes: [
          { text: "Your box of picture books made the children's section look shiny and new again.", effects: { kindness: 2 } }
        ] }
    ]
  },
  {
    id: "teen_ask_for_raise", minAge: 16, maxAge: 25, needs: ["job"],
    text: "Your boss {boss} says your work this month was excellent. This could be the perfect moment to ask about pay.",
    choices: [
      { label: "Ask politely for a raise",
        outcomes: [
          { weight: 2, text: "{boss} smiled and said your hard work will be remembered. Your next paycheck grew a little.", effects: { performance: 4, money: 150 } },
          { weight: 1, text: "{boss} said the budget was tight this quarter, but promised to check again soon.", effects: { performance: 2 } }
        ] },
      { label: "Ask for extra shifts instead",
        outcomes: [
          { text: "{boss} gave you two extra shifts and a tour of the new bread oven. Tired, but happy.", effects: { money: 200, health: -1 } }
        ] }
    ]
  },
  {
    id: "teen_coworker_cake", minAge: 16, maxAge: 25, needs: ["job"],
    text: "{coworker} is celebrating a birthday and insists you take the biggest slice of cake. It has three layers.",
    effects: { joy: 4, kindness: 1 }
  },
  {
    id: "teen_neighbor_cat_sitting", minAge: 16, maxAge: 25,
    text: "{neighbor} needs someone to look after their cat for a week. The cat has strong opinions about the sofa.",
    outcomes: [
      { weight: 2, text: "The cat napped on your lap every night. {neighbor} paid you $80 and a very purry thank-you.", effects: { money: 80, kindness: 3, joy: 3 } },
      { weight: 1, text: "The cat knocked a glass off the table, then looked very proud of itself. You still earned $80.", effects: { money: 80, joy: 1 } }
    ]
  },
  {
    id: "teen_community_theater", minAge: 16, maxAge: 25,
    text: "The community theater needs a narrator with a booming voice. Auditions are today, and the snacks are free.",
    choices: [
      { label: "Audition for the narrator",
        outcomes: [
          { weight: 2, text: "Your narration was so dramatic that the director asked you to read the entire program aloud.", effects: { skills: { acting: 6 }, joy: 4 }, favor: "acting" },
          { weight: 1, text: "You nailed the voice but read the cast list twice. The director still gave you a role.", effects: { skills: { acting: 3 }, joy: 2 } }
        ] },
      { label: "Build the props instead",
        outcomes: [
          { text: "You built a cardboard castle with a working drawbridge. The cast took photos in front of it all week.", effects: { skills: { art: 4 }, kindness: 2 } }
        ] }
    ]
  },
  {
    id: "teen_garage_sale", minAge: 16, maxAge: 25,
    text: "Your garage is full of old board games and a bicycle with only one wheel. You decide to hold a garage sale.",
    outcomes: [
      { weight: 2, text: "Your neighbors bought everything except the one-wheeled bicycle. You earned $140 for the rest.", effects: { money: 140, joy: 3 } },
      { weight: 1, text: "It rained for most of the sale, but the lemonade stand next door brought in a crowd. You earned $60.", effects: { money: 60, kindness: 1 } }
    ]
  },
  {
    id: "teen_apartment_leak", minAge: 18, maxAge: 25, needs: ["ownPlace"],
    text: "A small drip under your apartment sink has started a puddle club. The puddle has a membership of one.",
    choices: [
      { label: "Call the building manager",
        outcomes: [
          { text: "The manager arrived within the hour with a toolbox and a joke about plumbers.", effects: { joy: 1, kindness: 1 } }
        ] },
      { label: "Tighten the pipe yourself",
        outcomes: [
          { weight: 2, text: "A tiny turn of the wrench later, the drip stopped. You became a plumbing expert, in your own mind.", effects: { smarts: 3, joy: 2 } },
          { weight: 1, text: "The wrench slipped and the puddle grew into a small lake. A plumber visit followed.", effects: { money: -60, joy: -1 } }
        ] }
    ]
  },
  {
    id: "teen_concert_sneak", minAge: 16, maxAge: 25,
    text: "Your friends dare you to sneak into a concert through the loading dock. The security guard is reading a magazine.",
    choices: [
      { label: "Accept the dare",
        outcomes: [
          { weight: 2, text: "You slipped past during the sound check and grabbed a free sticker. Somewhere, a security list now had your name.", effects: { joy: 4, notoriety: 2 } },
          { weight: 1, text: "An usher spotted you in the first song and walked you back out, very politely but very firmly.", effects: { fine: 150, notoriety: 4, record: "Sneaking into a concert" } }
        ] },
      { label: "Buy a ticket like everyone else",
        outcomes: [
          { text: "You bought a ticket, sat in the back, and sang along. The concert was even better than the dare.", effects: { money: -60, joy: 5 } }
        ] }
    ]
  },
  {
    id: "teen_chalk_art_steps", minAge: 13, maxAge: 25,
    text: "The town hall steps are very plain and very gray. You have a box of sidewalk chalk and a bold idea.",
    choices: [
      { label: "Draw a giant chalk dragon",
        outcomes: [
          { weight: 2, text: "The dragon was so magnificent that people took photos all afternoon. Its tail climbed all the way up the stairs.", effects: { fame: 2, joy: 4, notoriety: 3 } },
          { weight: 1, text: "An officer arrived and asked you to help wash the steps. The dragon's tail was the last part to go.", effects: { fine: 40, notoriety: 4, record: "Chalk art on the town hall steps" } }
        ] },
      { label: "Draw one tiny flower instead",
        outcomes: [
          { text: "A small chalk flower appeared on the steps. It stayed a secret treasure for exactly one day.", effects: { joy: 1, notoriety: 1 } }
        ] }
    ]
  },
  {
    id: "teen_mascot_costume", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The school mascot costume hangs in the gym closet. It is enormous, very fuzzy, and smells faintly of popcorn.",
    choices: [
      { label: "Wear it for a surprise cheer",
        outcomes: [
          { weight: 2, text: "You cheered in the hallway in the giant costume. Everyone laughed, and the principal raised one eyebrow.", effects: { joy: 4, notoriety: 3 } },
          { weight: 1, text: "The costume's head fell off in front of the office. The principal asked for a very serious talk.", effects: { fine: 25, notoriety: 5, record: "Borrowed the school mascot costume" } }
        ] },
      { label: "Hang it back in the closet",
        outcomes: [
          { text: "You hung the costume back up. It gave you a fuzzy little wave on your way out.", effects: { kindness: 1 } }
        ] }
    ]
  },
  {
    id: "teen_skip_class", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The sun is shining through the window, and your math class is stuck on fractions again. The park is calling your name.",
    choices: [
      { label: "Sneak out to the park",
        outcomes: [
          { weight: 2, text: "You spent an hour on the swings. Your attendance sheet now had a suspicious blank line.", effects: { joy: 4, grades: -3 } },
          { weight: 1, text: "A teacher spotted you at the gate and walked you back with a very long hallway lecture.", effects: { grades: -4, joy: -2 } }
        ] },
      { label: "Stay and raise your hand",
        outcomes: [
          { text: "You asked three questions about fractions. Your teacher said it was a great day for brave questions.", effects: { grades: 3, smarts: 2 } }
        ] }
    ]
  },
  {
    id: "teen_rubber_duck_fountain", minAge: 13, maxAge: 25,
    text: "The town fountain looks a little bored. A giant inflatable rubber duck is sitting in the trunk of your friend's car.",
    choices: [
      { label: "Float the duck in the fountain",
        outcomes: [
          { weight: 2, text: "The duck floated in the fountain all afternoon. Tourists posed beside it, and everybody smiled.", effects: { fame: 2, joy: 4, notoriety: 2 } },
          { weight: 1, text: "A park official spotted the duck and gently escorted it out. A small fine and a new record followed.", effects: { fine: 75, notoriety: 4, record: "Floating a duck in the town fountain" } }
        ] },
      { label: "Leave the duck in the trunk",
        outcomes: [
          { text: "The duck stayed in the trunk, waiting patiently for a better idea.", effects: { joy: 1 } }
        ] }
    ]
  },
  {
    id: "teen_golf_cart_joyride", minAge: 16, maxAge: 25,
    text: "A golf cart is parked outside the mini-golf course, and its keys are dangling from the steering wheel.",
    choices: [
      { label: "Take the golf cart for a spin",
        outcomes: [
          { weight: 2, text: "You zipped around the parking lot and back again. The cart beeped happily the whole time.", effects: { joy: 4, notoriety: 3 } },
          { weight: 1, text: "A worker on a bicycle caught you at the first turn. You walked the cart back with a very serious face.", effects: { fine: 200, notoriety: 6, record: "Golf cart joyride" } }
        ] },
      { label: "Play a round of mini-golf",
        outcomes: [
          { text: "You played nine holes, and the windmill hole gave you a grand total of forty-two strokes.", effects: { joy: 4, skills: { sports: 2 } } }
        ] }
    ]
  },
  {
    id: "teen_fake_mustache_post_office", minAge: 13, maxAge: 25,
    text: "You wore your party mustache to the post office, just to test your disguise. Very scientific.",
    outcomes: [
      { weight: 1, text: "The clerk didn't notice a thing, and you mailed a postcard of a moose with great confidence.", effects: { joy: 3 } },
      { weight: 2, text: "The clerk spotted the mustache in two seconds and asked if it was a fancy holiday. It was not.", effects: { notoriety: 3, joy: 1 } }
    ]
  },
  {
    id: "teen_shopping_cart_race", minAge: 13, maxAge: 25,
    text: "You and a friend find a hill behind the grocery store with a very fast shopping cart. What could go wrong?",
    outcomes: [
      { weight: 3, text: "The cart rolled down the hill at top speed, and you both shrieked with delight all the way down.", effects: { joy: 4 } },
      { weight: 2, text: "A store worker jogged over and walked the cart back. You got a lecture and a free apple.", effects: { notoriety: 3, joy: 1 } },
      { weight: 1, text: "The cart rolled into a cardboard box stack and stopped with a dramatic squeak. You paid for the boxes.", effects: { fine: 60, notoriety: 4, record: "Shopping cart race" } }
    ]
  },
  {
    id: "teen_tunnel_bank_plan", minAge: 18, maxAge: 25,
    text: "Your big plan is a cartoon tunnel into the bank's basement, with a fake mustache and very plastic shovels.",
    choices: [
      { label: "Start digging the tunnel",
        outcomes: [
          { weight: 2, text: "The tunnel turned into a giant sandbox, and the whole plan was scrapped. Dusty, but not caught.", effects: { notoriety: 5, joy: -2 } },
          { weight: 1, text: "The tunnel led straight into the bank's broom closet. Security caught you, and the judge was not amused.", effects: { fine: 500, notoriety: 10, jail: 1, record: "Silly tunnel plan at the bank" } }
        ] },
      { label: "Cancel the plan and make pancakes",
        outcomes: [
          { text: "You made a tall stack of pancakes and decided that banks are best left alone.", effects: { joy: 3 } }
        ] }
    ]
  },
  {
    id: "teen_pretend_crossing_guard", minAge: 13, maxAge: 25,
    text: "You put on a bright yellow vest and start directing traffic at the park crosswalk. Nobody asked you to.",
    outcomes: [
      { weight: 2, text: "Drivers waved and smiled as you held up a tiny sign. The crosswalk had never looked so organized.", effects: { joy: 3, notoriety: 2 } },
      { weight: 1, text: "A real crossing guard arrived, asked for the vest back, and gave you a fine for the paperwork.", effects: { fine: 100, notoriety: 5, record: "Pretend crossing guard" } }
    ]
  },
  {
    id: "teen_museum_hide_seek", minAge: 13, maxAge: 25,
    text: "The science museum closes at five, and you have a sudden urge to play hide-and-seek among the dinosaur bones.",
    outcomes: [
      { weight: 2, text: "You hid so well that the guard had to search for you. You were awarded a 'Hi, Bones!' sticker.", effects: { joy: 4, notoriety: 3 } },
      { weight: 1, text: "The night guard found you behind the triceratops and walked you out. A fine and a long lecture followed.", effects: { fine: 120, notoriety: 4, record: "Hide-and-seek after closing" } }
    ]
  },
  {
    id: "teen_hs_fake_sign", minAge: 13, maxAge: 18, needs: ["school"],
    text: "You have an idea: a hand-painted sign reading 'FREE PIZZA FRIDAY' taped to the front doors of the school.",
    choices: [
      { label: "Tape the sign up",
        outcomes: [
          { weight: 2, text: "Half the school showed up at the front doors, hoping for pizza. The principal sighed and announced the prank at assembly.", effects: { joy: 3, fame: 1 } },
          { weight: 1, text: "The principal peeled the sign off before lunch and called home. You had a very long talk about kindness.", effects: { grades: -2, kindness: -1 } }
        ] },
      { label: "Make a pizza facts poster",
        outcomes: [
          { text: "Your library poster about pizza facts was so popular it stayed up for two whole weeks.", effects: { skills: { art: 3 }, joy: 2 } }
        ] }
    ]
  }
]);
