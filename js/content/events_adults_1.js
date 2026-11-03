// js/content/events_adults_1.js  (adult life events, batch 1 of 3)
CL.add("events", [
  // ----- Work (needs a job) -----
  { id: "adult_big_presentation", minAge: 26, maxAge: 64, needs: ["job"],
    text: "Your big presentation for {company} starts in ten minutes, and the slide clicker just stopped working.",
    choices: [
      { label: "Draw the charts on a whiteboard",
        outcomes: [
          { weight: 3, text: "Your hand-drawn chart of tiny stick figures was so charming that the whole room asked for a copy.", effects: { performance: 7, joy: 3 } },
          { weight: 1, text: "The marker ran dry halfway through, but you talked your way across the finish line.", effects: { performance: 2, smarts: 2 } }
        ] },
      { label: "Ask {coworker} to read the slides",
        outcomes: [
          { text: "{coworker} read every slide like a sports announcer, and the room gave a big round of applause.", effects: { performance: 4, kindness: 2 } }
        ] }
    ] },

  { id: "adult_office_bake_off", minAge: 26, maxAge: 64, needs: ["job"],
    text: "The office bake-off is on Friday, and {coworker} has already claimed the best spot on the snack table.",
    choices: [
      { label: "Bake your famous lemon cake",
        outcomes: [
          { weight: 2, text: "You won first place and {amount} to spend at the local bookstore!", effects: { money: 75, performance: 5, joy: 4 } },
          { weight: 1, text: "The middle sank a little, but everyone agreed the frosting was a total triumph.", effects: { joy: 2, skills: { cooking: 3 } } }
        ] },
      { label: "Bring a tray of cookies to share",
        outcomes: [
          { text: "The cookies vanished in minutes, and {coworker} declared you the friendliest baker in the building.", effects: { kindness: 4, joy: 3 } }
        ] }
    ] },

  { id: "adult_coworker_report", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{coworker} asks if you can help finish a report before the team meeting, and they look a little frazzled.",
    choices: [
      { label: "Roll up your sleeves and help",
        outcomes: [
          { text: "Together you finished the report with ten minutes to spare, and {coworker} bought you a celebratory muffin.", effects: { performance: 3, kindness: 5 } }
        ] },
      { label: "Offer to help after the meeting",
        outcomes: [
          { text: "You promised to help after the meeting, and the report still got finished before lunch.", effects: { performance: 1 } }
        ] }
    ] },

  { id: "adult_boss_project", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{boss} stops by your desk with a big, tricky project and a very confident smile.",
    choices: [
      { label: "Say yes and dig in",
        outcomes: [
          { weight: 3, text: "You cracked the tricky part by lunch, and a bonus of {amount} showed up in your next paycheck.", effects: { performance: 8, money: 250 } },
          { weight: 1, text: "The project ate every evening you had, and {boss} agreed it was a very long week.", effects: { performance: 3, health: -2 } }
        ] },
      { label: "Ask {coworker} to team up",
        outcomes: [
          { text: "You and {coworker} tackled the project together, and it turned into a surprisingly fun partnership.", effects: { performance: 4, kindness: 3 } }
        ] }
    ] },

  { id: "adult_printer_saga", minAge: 26, maxAge: 64, needs: ["job"],
    text: "The office printer jammed for the fourteenth time this week, and everyone is staring at you.",
    choices: [
      { label: "Open every little door and look inside",
        outcomes: [
          { weight: 2, text: "You found the stuck page with a triumphant flourish, and the printer hummed happily ever after.", effects: { smarts: 4, performance: 3 } },
          { weight: 1, text: "You found two paperclips, a snack wrapper, and one very confused sticky note.", effects: { smarts: 2, joy: 2 } }
        ] },
      { label: "Call the office tech helper",
        outcomes: [
          { text: "The helper arrived with a toolbox, fixed the printer in five minutes flat, and winked at you.", effects: { performance: 2, kindness: 1 } }
        ] },
      { label: "Declare it a modern art sculpture",
        outcomes: [
          { text: "Somehow the jammed printer became the office's favorite sculpture, and it got its own nameplate.", effects: { joy: 4, style: 2 } }
        ] }
    ] },

  { id: "adult_working_late", minAge: 26, maxAge: 64, needs: ["job"],
    text: "A deadline is coming up, so you're working late again. The vending machine is starting to feel like an old friend.",
    outcomes: [
      { weight: 3, text: "You stayed late, finished the big spreadsheet, and rewarded yourself with a very fancy sandwich.", effects: { performance: 5, health: -2 } },
      { weight: 2, text: "You finished the job fresh the next morning, and the extra sleep made you feel brand new.", effects: { performance: 2, joy: 3, health: 1 } },
      { weight: 1, text: "The late night ended with a happy boss and a tiny pen-shaped trophy waiting on your desk.", effects: { performance: 6, joy: 2 } }
    ] },

  { id: "adult_business_trip", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{company} is sending you on a three-day business trip to a conference in a faraway city.",
    choices: [
      { label: "Attend every session and take notes",
        outcomes: [
          { weight: 2, text: "You filled a notebook with fresh ideas and flew home with a pocketful of new contacts.", effects: { performance: 6, smarts: 2 } },
          { weight: 1, text: "You worked so hard you forgot to eat lunch, but the notes were excellent.", effects: { performance: 4, health: -2 } }
        ] },
      { label: "Explore the city after hours",
        outcomes: [
          { text: "You wandered through a park, tried a new kind of dumpling, and mailed {mom} a postcard.", effects: { joy: 6, performance: -2 } }
        ] }
    ] },

  { id: "adult_new_hire_training", minAge: 26, maxAge: 64, needs: ["job"],
    text: "A brand-new hire named {coworker} is nervous on the first day and asks you about every little detail.",
    choices: [
      { label: "Make a friendly cheat sheet",
        outcomes: [
          { weight: 3, text: "{coworker} called your cheat sheet the best welcome gift of the week and taped it to the wall.", effects: { kindness: 4, performance: 4 } },
          { weight: 1, text: "The cheat sheet grew so long it needed its own cheat sheet, but {coworker} smiled anyway.", effects: { kindness: 2, performance: 2 } }
        ] },
      { label: "Let them figure things out alone",
        outcomes: [
          { text: "{coworker} wandered the hallways with a map and somehow found the supply closet by lunchtime.", effects: { performance: 1, joy: 2 } }
        ] }
    ] },

  { id: "adult_awards_night", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{company} is holding its awards night, and your name is on the shortlist for Team Star.",
    outcomes: [
      { weight: 1, text: "You were named Team Star, and the prize envelope held {amount} plus a shiny trophy.", effects: { money: 500, performance: 8 } },
      { weight: 2, text: "You were a finalist, and the trophy went to a cheerful coworker who gave a wonderful speech.", effects: { performance: 3, joy: 2 } },
      { weight: 2, text: "The awards night served three kinds of cake, and you tried every single one.", effects: { joy: 5 } }
    ] },

  // ----- Home and car -----
  { id: "adult_leaky_roof", minAge: 26, maxAge: 64, needs: ["house"],
    text: "Drip, drip, drip. Your hallway ceiling has started raining, and the bucket is already full.",
    choices: [
      { label: "Call a roofing team",
        outcomes: [
          { text: "The roofers spent a sunny Saturday fixing everything, and your house has never been so dry.", effects: { money: -1500, joy: 3 } }
        ] },
      { label: "Patch it with tape and a bucket",
        outcomes: [
          { weight: 2, text: "The patch held through the whole rainy week, and you became a bucket-placement expert.", effects: { smarts: 2, joy: 1 } },
          { weight: 1, text: "The patch peeled off in the next storm, and the hallway needed one more bucket.", effects: { joy: -2 } }
        ] }
    ] },

  { id: "adult_flat_tire", minAge: 26, maxAge: 64, needs: ["car"],
    text: "Your car thumps to a stop on the way to work, and one tire has gone completely flat.",
    choices: [
      { label: "Change the tire yourself",
        outcomes: [
          { weight: 3, text: "A friendly video guided you through every step, and you drove off with a grease streak on your cheek.", effects: { smarts: 3, joy: 2 } },
          { weight: 1, text: "It took an hour, two wrong turns, and a very interested squirrel, but the tire is finally on.", effects: { smarts: 1, joy: 1 } }
        ] },
      { label: "Call a roadside rescue service",
        outcomes: [
          { text: "A rescue truck arrived in twenty minutes, and the tire was fixed for a modest fee.", effects: { money: -120 } }
        ] }
    ] },

  { id: "adult_raccoon_attic", minAge: 26, maxAge: 64, needs: ["house"],
    text: "Thump, scrape, rattle. A raccoon has moved into your attic and is hosting a very loud party.",
    choices: [
      { label: "Call a gentle wildlife helper",
        outcomes: [
          { text: "The helper politely escorted the raccoon outdoors and sealed the gap in the roof.", effects: { money: -300 } }
        ] },
      { label: "Leave a snack plate by the vent",
        outcomes: [
          { weight: 2, text: "The raccoon finished one last snack, waved its tail, and left the party for good.", effects: { joy: 3 } },
          { weight: 1, text: "The raccoon brought all of its friends, and the party moved into the garage.", effects: { joy: -2 } }
        ] }
    ] },

  // ----- Kids and pets -----
  { id: "adult_school_play", minAge: 26, maxAge: 64,
    text: "{childRole} {child} got the part of a very serious tree in the school play.",
    outcomes: [
      { weight: 2, text: "You clapped the loudest in the whole auditorium, and {child} gave you a leafy wave from the stage.", effects: { bond: 5, joy: 4 } },
      { weight: 1, text: "The tree tipped over during the big finale, and {child} still delivered the best line of the show.", effects: { bond: 3, joy: 2 } }
    ] },

  { id: "adult_science_volcano", minAge: 26, maxAge: 64,
    text: "{childRole} {child} needs a volcano for the science fair by tomorrow, and the baking soda is nowhere to be found.",
    choices: [
      { label: "Search the pantry together",
        outcomes: [
          { weight: 2, text: "You found the baking soda behind the cereal, and {child} bounced with excitement all evening.", effects: { bond: 5, joy: 3 } },
          { weight: 1, text: "You found pancake mix instead, and the volcano erupted in a very fluffy, very delicious way.", effects: { bond: 3, joy: 2 } }
        ] },
      { label: "Let {child} plan the fizzy design",
        outcomes: [
          { text: "{child} built a volcano that bubbled over with pride, and the judges gave it a blue ribbon.", effects: { bond: 3, smarts: 2 } }
        ] }
    ] },

  { id: "adult_pet_trick", minAge: 26, maxAge: 64,
    text: "{pet} the {petType} has learned a brand-new trick and is eager to show off for the whole household.",
    outcomes: [
      { weight: 2, text: "{pet} performed the trick perfectly, and the treat ceremony afterward was very dignified.", effects: { joy: 4, bond: 4 } },
      { weight: 1, text: "{pet} performed the trick, then performed it again for an audience of exactly one very proud you.", effects: { joy: 3, bond: 2 } }
    ] },

  { id: "adult_pet_sunny_spot", minAge: 26, maxAge: 64,
    text: "{pet} the {petType} has claimed the sunniest spot in the house and is not planning to share it.",
    choices: [
      { label: "Pull up a chair beside them",
        outcomes: [
          { text: "You sat beside {pet} in the warm sunshine for a quiet break, and it was the best part of your week.", effects: { bond: 4, joy: 3 } }
        ] },
      { label: "Let them keep the sunny spot",
        outcomes: [
          { weight: 2, text: "{pet} looked very content in the sunshine, and that made your whole afternoon brighter.", effects: { joy: 3 } },
          { weight: 1, text: "{pet} moved to a different sunny spot right after you sat down, which was hilarious.", effects: { joy: 2, kindness: 1 } }
        ] }
    ] },

  // ----- Money -----
  { id: "adult_tax_refund", minAge: 26, maxAge: 64,
    text: "A letter from the tax office arrives, and the number inside is much bigger than you expected.",
    outcomes: [
      { weight: 3, text: "Your tax refund arrived as {amount}, and you celebrated with a very fancy pancake breakfast.", effects: { money: 350, joy: 3 } },
      { weight: 1, text: "Your tax refund arrived as {amount}, and you tucked the whole thing into your savings jar.", effects: { money: 900, joy: 1 } }
    ] },

  { id: "adult_scam_call", minAge: 26, maxAge: 64,
    text: "A cheerful voice on the phone says you won a free vacation, but first you need to pay a small processing fee.",
    choices: [
      { label: "Hang up and tell a friend",
        outcomes: [
          { text: "You hung up, shared the story over dinner, and everyone agreed you were a very clever cookie.", effects: { smarts: 4, joy: 2 } }
        ] },
      { label: "Pay the processing fee",
        outcomes: [
          { text: "You paid the $200 fee, and the prize never arrived. Lesson learned, and a little bit poorer.", effects: { money: -200, joy: -2 } }
        ] }
    ] },

  { id: "adult_found_money", minAge: 26, maxAge: 64,
    text: "While cleaning out an old winter coat, you find a crumpled envelope tucked deep inside the pocket.",
    outcomes: [
      { weight: 2, text: "Inside was {amount} and a note that said Treat yourself! So you did.", effects: { money: 40, joy: 3 } },
      { weight: 1, text: "Inside was {amount} and a very old peppermint, which you ate immediately.", effects: { money: 60, joy: 2 } }
    ] },

  // ----- Health and hobbies -----
  { id: "adult_charity_5k", minAge: 26, maxAge: 64,
    text: "A charity 5K run is happening downtown this weekend, and {friend} is already signing up for the team.",
    choices: [
      { label: "Sign up and train with them",
        outcomes: [
          { weight: 2, text: "You crossed the finish line with a big grin, and {friend} proudly wore a finisher sticker all day.", effects: { health: 5, joy: 4, bond: 4 } },
          { weight: 1, text: "You walked most of the course, chatted the whole way, and still felt proud at the end.", effects: { health: 3, joy: 3 } }
        ] },
      { label: "Cheer on the runners with a sign",
        outcomes: [
          { text: "Your sign said Go Team Sunshine, and a stranger waved it back at you all afternoon.", effects: { kindness: 4, joy: 2 } }
        ] }
    ] },

  { id: "adult_yearly_checkup", minAge: 26, maxAge: 64,
    text: "Your yearly check-up is on Tuesday. The waiting room has a fish tank that you have already grown fond of.",
    outcomes: [
      { weight: 3, text: "The doctor said you're in great shape, and the fish tank was the highlight of your visit.", effects: { health: 4, joy: 2 } },
      { weight: 1, text: "The doctor suggested a few more daily walks and handed you a sticker shaped like a sun.", effects: { health: 2 } }
    ] },

  { id: "adult_flu_day", minAge: 26, maxAge: 64,
    text: "You wake up with a scratchy throat and a pounding headache on the morning of a very important day.",
    choices: [
      { label: "Rest in bed with soup and tea",
        outcomes: [
          { text: "You rested all day, sipped warm soup, and woke up feeling much more like yourself.", effects: { health: 2, joy: 2 } }
        ] },
      { label: "Power through and go anyway",
        outcomes: [
          { weight: 2, text: "You made it through the big day, but the flu had other plans for the following week.", effects: { illness: "flu", joy: -2 } },
          { weight: 1, text: "You got through the whole day with a sneeze-filled smile, and nobody noticed a thing.", effects: { joy: 2 } }
        ] }
    ] },

  // ----- Family and community -----
  { id: "adult_help_parents_move", minAge: 26, maxAge: 64,
    text: "{mom} and {dad} are moving into a cozy little apartment, and they need a whole car full of boxes carried up the stairs.",
    choices: [
      { label: "Carry boxes all weekend",
        outcomes: [
          { weight: 2, text: "You hauled boxes up three flights of stairs, and {mom} made you a giant lunch at the end.", effects: { bond: 6, joy: 2 } },
          { weight: 1, text: "Your back complained for days after all those boxes, but {dad} gave you a huge thank-you hug.", effects: { bond: 4, illness: "back_pain" } }
        ] },
      { label: "Bring pizza and snacks over",
        outcomes: [
          { text: "The pizza disappeared before the last box was unpacked, and {dad} declared it the best move ever.", effects: { bond: 5, joy: 3 } }
        ] }
    ] },

  { id: "adult_family_reunion", minAge: 26, maxAge: 64,
    text: "The family reunion is at the park this year, with a potato-sack race and {grandparent}'s famous banana bread.",
    outcomes: [
      { weight: 2, text: "You won the sack race by one enormous hop, and {grandparent} gave you a very proud high five.", effects: { bond: 5, joy: 4 } },
      { weight: 2, text: "You shared a plate of sticky cinnamon rolls with the cousins and forgot about the time entirely.", effects: { joy: 4, kindness: 2 } }
    ] },

  { id: "adult_jury_summons", minAge: 26, maxAge: 64,
    text: "A jury duty letter arrives. The case is about a garden gnome that may or may not have wandered off on its own.",
    choices: [
      { label: "Serve with a notebook",
        outcomes: [
          { weight: 2, text: "You took careful notes and asked thoughtful questions, and the gnome case ended with a fair verdict.", effects: { smarts: 4, kindness: 2 } },
          { weight: 1, text: "Everyone agreed the gnome had a very suspicious smile, which somehow made the whole case more fun.", effects: { smarts: 2, joy: 2 } }
        ] },
      { label: "Ask politely to be excused",
        outcomes: [
          { text: "The judge said the gnome could wait, and you were back in your garden in time for tea.", effects: { joy: 2 } }
        ] }
    ] }
]);
