// js/content/events_adults_2.js  (adult life events, batch 2 of 3)
CL.add("events", [
  // ----- Work (needs a job) -----
  { id: "adult_company_picnic", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{company} is holding its summer picnic, complete with a three-legged race and a pie table that takes itself very seriously.",
    outcomes: [
      { weight: 2, text: "You and {coworker} placed second in the three-legged race and still felt like champions.", effects: { joy: 5, kindness: 2 } },
      { weight: 2, text: "You won the ball toss and a very bright plastic medal that you wore all afternoon.", effects: { joy: 5 } },
      { weight: 1, text: "You ate three hot dogs, sang a silly song, and lost the pie contest by a single crumb.", effects: { joy: 4 } }
    ] },

  { id: "adult_surprise_layoff", minAge: 26, maxAge: 64, needs: ["job"], weight: 0.2,
    text: "A company-wide announcement comes through, and your role as {job} is one of the changes. It is a hard day, but not the end of the story.",
    outcomes: [
      { weight: 3, text: "Your team surprised you with a going-away cake shaped like a stapler, and you went home with {amount}.", effects: { endJob: true, joy: -3, money: 1200 } },
      { weight: 1, text: "A kind manager wrote you a glowing reference and handed you {amount} in farewell pay.", effects: { endJob: true, joy: -4, money: 600 } }
    ] },

  { id: "adult_holiday_bonus", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{company} announces a surprise year-end bonus for every {job} who helped finish the big project.",
    outcomes: [
      { weight: 2, text: "Your bonus arrived as {amount}, and you treated yourself to a very cozy new blanket.", effects: { money: 800, joy: 2 } },
      { weight: 1, text: "Your bonus arrived as {amount}, and the whole team celebrated with a potluck lunch.", effects: { money: 1500, joy: 3 } }
    ] },

  { id: "adult_promotion_chat", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{boss} invites you for a chat over coffee about your future as {job} at {company}, and the coffee is already poured.",
    choices: [
      { label: "Share your biggest ideas",
        outcomes: [
          { weight: 2, text: "Your ideas impressed {boss}, who promised to bring them to the next big meeting.", effects: { performance: 6, smarts: 2 } },
          { weight: 1, text: "The idea was bold, and {boss} said it needed a little more polish before anyone else saw it.", effects: { performance: 3, smarts: 1 } }
        ] },
      { label: "Ask for a few days to think",
        outcomes: [
          { text: "{boss} smiled and said to take your time, so you spent the weekend building a shiny plan.", effects: { performance: 1, joy: 2 } }
        ] }
    ] },

  { id: "adult_office_plant", minAge: 26, maxAge: 64, needs: ["job"],
    text: "Someone left a huge fern on your desk with a sticky note that says Please keep me happy and watered.",
    outcomes: [
      { weight: 2, text: "The fern thrived under your care, and it earned its very own name tag and a spot by the window.", effects: { joy: 4 } },
      { weight: 1, text: "The fern drooped dramatically on Monday, then perked up after one long, grateful drink of water.", effects: { joy: 1 } }
    ] },

  { id: "adult_overtime_pizza", minAge: 26, maxAge: 64, needs: ["job"],
    text: "A big deadline has the whole team ordering pizza at nine o'clock at night, and the boxes are stacking up.",
    choices: [
      { label: "Share your slice with everyone",
        outcomes: [
          { text: "You passed the pizza around the room, and the whole team agreed it was the best night of the month.", effects: { kindness: 4, joy: 3 } }
        ] },
      { label: "Eat fast and get back to work",
        outcomes: [
          { text: "You finished your section before the last crust was gone, and your focus did not go unnoticed.", effects: { performance: 5, health: -1 } }
        ] }
    ] },

  { id: "adult_wrong_meeting", minAge: 26, maxAge: 64, needs: ["job"],
    text: "You walk into the wrong meeting room, and before you can stop yourself, you start presenting the snack schedule.",
    outcomes: [
      { weight: 2, text: "The room cheered for the snack schedule, and someone asked if you could present it again next week.", effects: { performance: 3, joy: 3 } },
      { weight: 1, text: "The real team arrived halfway through, and everyone laughed at your very bold opening line.", effects: { performance: 1, joy: 2 } }
    ] },

  { id: "adult_conference_panel", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{company} wants you on a panel at a big conference, and the room has three hundred seats waiting.",
    choices: [
      { label: "Say yes and prepare slides",
        outcomes: [
          { weight: 2, text: "Your panel was packed, and the audience asked a dozen questions afterward.", effects: { performance: 6, smarts: 3 } },
          { weight: 1, text: "Your microphone squeaked through the whole talk, but your ideas came through loud and clear.", effects: { performance: 3, joy: 1 } }
        ] },
      { label: "Suggest {coworker} for the panel",
        outcomes: [
          { text: "{coworker} took the stage with confidence, and the audience thanked you for the shout-out.", effects: { kindness: 4, performance: 2 } }
        ] }
    ] },

  // ----- Home and car -----
  { id: "adult_garden_contest", minAge: 26, maxAge: 64, needs: ["house"],
    text: "The neighborhood garden contest is this weekend, and your tomato plants are growing enormous.",
    choices: [
      { label: "Enter the giant tomato category",
        outcomes: [
          { weight: 1, text: "The judges were amazed, and your tomato won first place along with {amount} in prize money.", effects: { money: 300, joy: 4 } },
          { weight: 2, text: "Your tomatoes came in second, and the judges asked for a photo to hang in the library.", effects: { joy: 3, smarts: 1 } }
        ] },
      { label: "Give the tomatoes to {neighbor}",
        outcomes: [
          { text: "{neighbor} made a huge pot of tomato soup and sent you a jar with a handwritten thank-you note.", effects: { kindness: 4, joy: 2 } }
        ] }
    ] },

  { id: "adult_neighbor_couch", minAge: 26, maxAge: 64, needs: ["house"],
    text: "{neighbor} asks for help carrying a very heavy couch up a very long flight of stairs.",
    choices: [
      { label: "Grab the other end",
        outcomes: [
          { text: "You and {neighbor} got the couch upstairs, then shared a cold lemonade on the porch.", effects: { kindness: 5, joy: 2 } }
        ] },
      { label: "Suggest a moving helper",
        outcomes: [
          { text: "The moving helper handled the couch, and {neighbor} thanked you for the excellent idea and a slice of pie.", effects: { kindness: 1, joy: 1 } }
        ] }
    ] },

  { id: "adult_noisy_renovation", minAge: 26, maxAge: 64, needs: ["house"],
    text: "{neighbor} has started a renovation, and the drilling begins promptly at six every single morning.",
    outcomes: [
      { weight: 2, text: "You tried earplugs, a humming fan, and a cozy pillow fort. Only the fan worked well.", effects: { joy: -2, smarts: 2 } },
      { weight: 1, text: "The renovation finished, and the new kitchen looked so nice that you forgave every drill.", effects: { joy: 4 } }
    ] },

  { id: "adult_garage_sale_sewing", minAge: 26, maxAge: 64, needs: ["house"],
    text: "A garage sale down the street has a dusty old sewing machine priced at a very friendly amount.",
    choices: [
      { label: "Buy the sewing machine",
        outcomes: [
          { text: "You dusted it off, oiled it up, and sewed your very first tote bag that afternoon.", effects: { money: -60, skills: { art: 2 }, gainItem: "a vintage sewing machine" } }
        ] },
      { label: "Haggle politely for a discount",
        outcomes: [
          { text: "The seller laughed, agreed to a lower price, and threw in a pincushion for free.", effects: { smarts: 2, joy: 2, money: -40 } }
        ] }
    ] },

  // ----- Kids and pets -----
  { id: "adult_shelter_rabbit", minAge: 26, maxAge: 64,
    text: "The animal shelter needs a home for a fluffy rabbit named Mochi, who is very polite and very fond of carrots.",
    choices: [
      { label: "Bring Mochi home",
        outcomes: [
          { text: "Mochi hopped right into your life, and the whole house instantly felt a little cozier.", effects: { addPet: "rabbit", joy: 6 } }
        ] },
      { label: "Share Mochi's photo with friends",
        outcomes: [
          { text: "Your post helped Mochi find a family, and the shelter sent you a thank-you card with a bunny sticker.", effects: { kindness: 3, joy: 2 } }
        ] }
    ] },

  { id: "adult_bike_ride", minAge: 26, maxAge: 64,
    text: "{childRole} {child} wobbles down the driveway on a brand-new bike while the whole street stops to watch.",
    outcomes: [
      { weight: 2, text: "You jogged beside {child} the whole way, and that proud grin lasted all evening.", effects: { bond: 5, joy: 4 } },
      { weight: 1, text: "{child} pedaled off alone for the very first time, and you cheered until your voice went hoarse.", effects: { bond: 3, joy: 3 } }
    ] },

  { id: "adult_report_card", minAge: 26, maxAge: 64,
    text: "{child}'s report card arrived, and the teacher's comment at the bottom made you smile for a whole week.",
    choices: [
      { label: "Hang it on the fridge",
        outcomes: [
          { text: "The report card went up under a pickle-shaped magnet, and {child} glowed with pride all day.", effects: { bond: 4, joy: 3 } }
        ] },
      { label: "Plan a family ice cream outing",
        outcomes: [
          { text: "The outing was sticky, loud, and absolutely perfect, and {child} picked the biggest cone.", effects: { bond: 5, money: -25 } }
        ] }
    ] },

  { id: "adult_picnic_pet", minAge: 26, maxAge: 64,
    text: "The picnic is starting, and {pet} the {petType} has decided the best blanket in the park is now theirs.",
    outcomes: [
      { weight: 2, text: "You shared a snack with {pet}, and everyone agreed it was the sunniest picnic yet.", effects: { bond: 4, joy: 4 } },
      { weight: 1, text: "A passing stranger stopped to admire {pet}, and you spent the rest of the picnic telling stories.", effects: { bond: 3, joy: 2 } }
    ] },

  // ----- Money -----
  { id: "adult_friend_bakery", minAge: 26, maxAge: 64,
    text: "Your friend {friend} is opening a bakery and asks if you would like to help pay for the big oven.",
    choices: [
      { label: "Help pay for the oven",
        outcomes: [
          { weight: 3, text: "The bakery became the neighborhood favorite, and you were given a free cookie every Friday.", effects: { money: -1000, joy: 6, bond: 5 } },
          { weight: 1, text: "The first year was bumpy, but the cinnamon rolls kept the whole street smiling.", effects: { money: -1000, bond: 3 } }
        ] },
      { label: "Cheer them on with a big sign",
        outcomes: [
          { text: "Your sign said Rise and Bake, and {friend} hung it proudly in the bakery window.", effects: { kindness: 4, bond: 4 } }
        ] }
    ] },

  { id: "adult_found_wallet", minAge: 26, maxAge: 64,
    text: "You spot a wallet on the sidewalk with a name tag and a photo of a very happy dog on the front.",
    choices: [
      { label: "Return the wallet to its owner",
        outcomes: [
          { weight: 2, text: "The owner was so grateful that they handed you {amount} and a warm cookie.", effects: { money: 50, kindness: 4 } },
          { weight: 1, text: "The owner was so grateful that they baked you a loaf of banana bread.", effects: { kindness: 5 } }
        ] },
      { label: "Leave a note on the bulletin board",
        outcomes: [
          { text: "A neighbor spotted the note, and the owner stopped by to say thank you.", effects: { kindness: 2 } }
        ] }
    ] },

  // ----- Health and hobbies -----
  { id: "adult_guitar_at_forty", minAge: 38, maxAge: 42,
    text: "At forty, you decide the guitar in the back of the closet deserves a second chance.",
    choices: [
      { label: "Sign up for beginner lessons",
        outcomes: [
          { weight: 2, text: "Your first chords sounded a bit like a rubber duck, but by the end you could play a simple song.", effects: { skills: { music: 6 }, joy: 4 } },
          { weight: 1, text: "Your fingertips got very sore, but you learned three chords and a story worth telling.", effects: { skills: { music: 3 }, joy: 2 } }
        ] },
      { label: "Teach yourself with online videos",
        outcomes: [
          { weight: 2, text: "The videos were a little confusing, but you practiced every night and found your rhythm.", effects: { skills: { music: 4 }, smarts: 1 } },
          { weight: 1, text: "The videos were so relaxing that you dozed off halfway through, and the guitar went back to the closet.", effects: { joy: 1 } }
        ] }
    ] },

  { id: "adult_chess_tournament", minAge: 26, maxAge: 64,
    text: "The library is hosting a chess tournament on Saturday, and the first-place prize is a trophy shaped like a rook.",
    choices: [
      { label: "Enter the tournament",
        outcomes: [
          { weight: 1, text: "You won two games, lost one nail-biter, and walked home with the rook trophy under your arm.", effects: { smarts: 5, joy: 4 } },
          { weight: 2, text: "You played four matches, learned a great deal, and made a new friend named {newFriend}.", effects: { smarts: 3, joy: 3, newFriend: true } }
        ] },
      { label: "Cheer from the sidelines with a snack",
        outcomes: [
          { text: "You cheered for every player, munched a muffin, and enjoyed the calm focus in the room.", effects: { joy: 3 } }
        ] }
    ] },

  { id: "adult_cooking_contest", minAge: 26, maxAge: 64,
    text: "The town cooking contest has a theme this year: anything made with lemons, and the rules are very strict.",
    choices: [
      { label: "Enter with a lemon pie",
        outcomes: [
          { weight: 2, text: "Your lemon pie was tangy, golden, and perfectly sweet, and the judges gave you second place.", effects: { skills: { cooking: 6 }, joy: 4 } },
          { weight: 1, text: "Your pie wobbled on the way to the table, but it still tasted like a sunny afternoon.", effects: { skills: { cooking: 3 }, joy: 2 } }
        ] },
      { label: "Volunteer as a judge's helper",
        outcomes: [
          { text: "You handed out ribbons, tasted a few samples, and gave the judges a very serious nod.", effects: { joy: 4, kindness: 2 } }
        ] }
    ] },

  { id: "adult_picnic_sunburn", minAge: 26, maxAge: 64,
    text: "The beach picnic is so bright and sunny that you forget your sunscreen at home.",
    outcomes: [
      { weight: 2, text: "By dinner your shoulders were bright pink, and you spent the evening under a cool, damp towel.", effects: { illness: "sunburn", joy: -2 } },
      { weight: 1, text: "A kind stranger loaned you some sunscreen, and you spent the picnic in a happy, shady spot.", effects: { joy: 3, health: 1 } }
    ] },

  // ----- Family and community -----
  { id: "adult_town_festival", minAge: 26, maxAge: 64,
    text: "The town festival has a pie contest, a balloon parade, and an open stage for anyone brave enough to perform.",
    choices: [
      { label: "Sign up for the talent show",
        outcomes: [
          { weight: 2, text: "You sang a goofy song with a kazoo solo, and the crowd clapped along to every beat.", effects: { skills: { music: 4 }, joy: 4 } },
          { weight: 1, text: "Your coin trick went wrong, the coin rolled under the stage, but the crowd cheered anyway.", effects: { skills: { acting: 3 }, joy: 2 } }
        ] },
      { label: "Cheer from the balloon parade route",
        outcomes: [
          { text: "A balloon shaped like a giant duck floated overhead, and you waved until your arm got tired.", effects: { joy: 5 } }
        ] }
    ] },

  { id: "adult_old_classmate", minAge: 26, maxAge: 64,
    text: "At the grocery store, you bump into {classmate} from your old class, and you both recognize each other at once.",
    outcomes: [
      { weight: 2, text: "You swapped old school songs and funny stories until the frozen peas in your cart started to warm up.", effects: { joy: 5, kindness: 2 } },
      { weight: 1, text: "Your old classmate invited you to a reunion lunch next month, and you wrote it on your calendar.", effects: { joy: 4 } }
    ] },

  { id: "adult_neighborhood_cleanup", minAge: 26, maxAge: 64,
    text: "The neighborhood clean-up day needs volunteers, and the rakes are already lined up by the park gate.",
    choices: [
      { label: "Join the rake team",
        outcomes: [
          { weight: 2, text: "You raked three yards, found a very shiny marble, and met half the street before lunch.", effects: { kindness: 5, joy: 3 } },
          { weight: 1, text: "The day was hot and sticky, but the park sparkled by sunset, and you felt proud.", effects: { kindness: 3, health: 2 } }
        ] },
      { label: "Bring lemonade for the volunteers",
        outcomes: [
          { text: "Your lemonade stand became the most popular spot on the block, and everyone said thank you.", effects: { kindness: 4, joy: 2 } }
        ] }
    ] }
]);
