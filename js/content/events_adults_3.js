// js/content/events_adults_3.js  (adult life events, batch 3 of 3)
CL.add("events", [
  // ----- Work (needs a job) -----
  { id: "adult_work_anniversary", minAge: 26, maxAge: 64, needs: ["job"],
    text: "It's your five-year anniversary as {job} at {company}, and the team has baked a cake that leans slightly to one side.",
    outcomes: [
      { weight: 2, text: "Everyone sang a wobbly song, and the cake tasted even better than it looked.", effects: { joy: 5, performance: 2 } },
      { weight: 1, text: "{boss} gave a short speech about your steady work and handed you a very nice pen.", effects: { performance: 4, joy: 3 } }
    ] },

  { id: "adult_tough_customer", minAge: 26, maxAge: 64, needs: ["job"],
    text: "A grumpy customer at {company} wants everything fixed right now, and they are tapping the counter impatiently.",
    choices: [
      { label: "Stay calm and listen closely",
        outcomes: [
          { weight: 2, text: "You listened carefully, offered a fix, and the customer left with a surprisingly big smile.", effects: { performance: 5, kindness: 4 } },
          { weight: 1, text: "The customer was still not thrilled, but they admitted you tried your very best.", effects: { performance: 2, kindness: 2 } }
        ] },
      { label: "Hand them off to {coworker}",
        outcomes: [
          { text: "{coworker} took over with a cheerful voice, and the customer calmed down after a free sample.", effects: { performance: -1, joy: 1 } }
        ] }
    ] },

  { id: "adult_system_update", minAge: 26, maxAge: 64, needs: ["job"],
    text: "Overnight, the work system got a big update, and every menu has moved to a brand-new spot.",
    choices: [
      { label: "Make a sticky-note cheat list",
        outcomes: [
          { weight: 2, text: "Your sticky-note list guided the whole team, and the menus finally felt familiar again.", effects: { smarts: 4, performance: 3 } },
          { weight: 1, text: "The list fell off the monitor twice, but you finally got it stuck to the right spot.", effects: { smarts: 2, joy: 1 } }
        ] },
      { label: "Ask {coworker} for a guided tour",
        outcomes: [
          { text: "{coworker} gave you a friendly tour, pointing at every new menu with great enthusiasm.", effects: { kindness: 3, performance: 2 } }
        ] }
    ] },

  { id: "adult_office_move", minAge: 26, maxAge: 64, needs: ["job"],
    text: "Your team is moving to a brand-new floor, and the boxes have multiplied overnight like very determined bunnies.",
    outcomes: [
      { weight: 2, text: "You labeled every box with a silly drawing, and the moving crew laughed the whole way up the stairs.", effects: { joy: 4, performance: 1 } },
      { weight: 1, text: "The new desk has a view of the park, and you spent your first hour just looking out the window.", effects: { joy: 5 } },
      { weight: 1, text: "Somewhere in the move, your favorite mug went missing, then reappeared in the copy room.", effects: { joy: 2 } }
    ] },

  { id: "adult_quarterly_numbers", minAge: 26, maxAge: 64, needs: ["job"],
    text: "The quarterly numbers are a bit of a mess, and {boss} asks you to walk the team through the charts.",
    choices: [
      { label: "Walk through the charts one by one",
        outcomes: [
          { weight: 2, text: "You explained each chart clearly, and {boss} said the whole room finally understood the story.", effects: { performance: 5, smarts: 2 } },
          { weight: 1, text: "A few charts were confusing, but you made a fix list, and the team cheered you on.", effects: { performance: 2, kindness: 1 } }
        ] },
      { label: "Admit the mistake and promise a fix",
        outcomes: [
          { text: "You owned the mistake, promised a fix by Friday, and {boss} nodded with respect.", effects: { performance: 2, kindness: 2 } }
        ] }
    ] },

  { id: "adult_lunch_and_learn", minAge: 26, maxAge: 64, needs: ["job"],
    text: "{coworker} invites you to a lunch-and-learn about growing vegetables on a rooftop, with free sandwiches included.",
    outcomes: [
      { weight: 2, text: "You learned how to grow a tomato in a bucket and earned a very good sandwich for your trouble.", effects: { smarts: 3, joy: 2 } },
      { weight: 1, text: "The talk ran long, but the sandwiches were excellent, and {coworker} gave you a tiny herb plant.", effects: { joy: 3, kindness: 2 } }
    ] },

  { id: "adult_remote_meeting_mixup", minAge: 26, maxAge: 64, needs: ["job"],
    text: "During a video meeting you forget to turn off your camera, and everyone sees you singing along to the radio.",
    outcomes: [
      { weight: 2, text: "{boss} laughed, gave a thumbs up, and asked the team to bring their best singing voices next time.", effects: { performance: 2, joy: 4 } },
      { weight: 1, text: "Everyone clapped at the end, and a coworker sent you a sparkly emoji in the chat.", effects: { performance: 1, joy: 3 } }
    ] },

  { id: "adult_company_trivia", minAge: 26, maxAge: 64, needs: ["job"],
    text: "Your team is entering a trivia night at the local diner, and {coworker} insists you are the brains of the operation.",
    outcomes: [
      { weight: 2, text: "You knew the answer to the final question, and the whole team cheered when the scores were read.", effects: { performance: 4, joy: 3 } },
      { weight: 1, text: "A question about sandwiches stumped everyone, and the team laughed until the snacks ran out.", effects: { joy: 4 } },
      { weight: 1, text: "Your team placed second and won a tiny trophy for the most creative team name.", effects: { performance: 3, joy: 2 } }
    ] },

  // ----- Home and car -----
  { id: "adult_water_heater", minAge: 26, maxAge: 64, needs: ["house"],
    text: "The water heater gives a sad gurgle and then leaves you with a very cold shower.",
    choices: [
      { label: "Call a plumber for help",
        outcomes: [
          { text: "The plumber replaced the heater before dinner, and your showers returned to their warm, happy temperature.", effects: { money: -450, joy: 2 } }
        ] },
      { label: "Heat water in pots and sing loudly",
        outcomes: [
          { weight: 2, text: "You heated pots on the stove, sang with gusto, and felt wonderfully silly.", effects: { joy: 4 } },
          { weight: 1, text: "The pot-warmed bath was only lukewarm, but the neighbors next door sang along to the chorus.", effects: { joy: 2 } }
        ] }
    ] },

  { id: "adult_car_battery", minAge: 26, maxAge: 64, needs: ["car"],
    text: "Your car refuses to start in the grocery store parking lot, and {friend} is only a phone call away.",
    choices: [
      { label: "Call {friend} for a jump start",
        outcomes: [
          { text: "{friend} arrived with jumper cables and a thermos of cocoa, and your car roared back to life.", effects: { bond: 4, joy: 3 } }
        ] },
      { label: "Ask a friendly tow truck driver",
        outcomes: [
          { text: "The tow truck driver gave your battery a boost, then sent you on your way with a friendly wave.", effects: { money: -90 } }
        ] }
    ] },

  { id: "adult_garage_cleanout", minAge: 26, maxAge: 64, needs: ["house"],
    text: "Cleaning out the garage uncovers a box of old board games, a rubber duck, and a map from a trip you forgot you took.",
    outcomes: [
      { weight: 2, text: "You spent a sunny afternoon playing the games on the driveway, and the rubber duck got its very own shelf.", effects: { joy: 4 } },
      { weight: 1, text: "The old map reminded you of a wonderful trip, and you sat down to plan another adventure.", effects: { joy: 3, smarts: 1 } }
    ] },

  // ----- Kids and pets -----
  { id: "adult_child_talent_show", minAge: 26, maxAge: 64,
    text: "{childRole} {child} signed up for the school talent show and asked you to save a front-row seat.",
    choices: [
      { label: "Cheer loudly with a homemade sign",
        outcomes: [
          { text: "Your sign said Go Star, and {child} waved at it during the whole performance.", effects: { bond: 5, joy: 3 } }
        ] },
      { label: "Help {child} practice a magic trick",
        outcomes: [
          { text: "The magic trick worked on the third try, and {child} took a very dramatic bow.", effects: { bond: 4, smarts: 2 } }
        ] }
    ] },

  { id: "adult_wiggly_tooth", minAge: 26, maxAge: 64,
    text: "{child} has a very wiggly tooth and keeps testing it on every single apple at dinner.",
    outcomes: [
      { weight: 2, text: "The tooth finally popped out at breakfast, and {child} beamed with a big gap-toothed grin.", effects: { joy: 4, bond: 4 } },
      { weight: 1, text: "The tooth refused to budge, so you both agreed to try again with a very crunchy carrot.", effects: { joy: 2, bond: 2 } }
    ] },

  { id: "adult_pet_costume_parade", minAge: 26, maxAge: 64,
    text: "The town costume parade is this weekend, and the sign-up sheet has a very enthusiastic spot for {pet} the {petType}.",
    choices: [
      { label: "Give them a pancake costume",
        outcomes: [
          { weight: 2, text: "{pet} wore a fluffy pancake costume and won over the crowd, and the photo ran in the town newsletter.", effects: { joy: 5, bond: 4 } },
          { weight: 1, text: "The costume slipped halfway down the street, but {pet} strutted on, and the crowd cheered anyway.", effects: { joy: 3, bond: 2 } }
        ] },
      { label: "Enter them with a cute bow tie",
        outcomes: [
          { text: "{pet} strutted down the parade route in a cute bow tie with a very dignified expression.", effects: { joy: 4, bond: 3 } }
        ] }
    ] },

  { id: "adult_sleepover", minAge: 26, maxAge: 64,
    text: "{child} wants to host a sleepover with five friends, a movie, and a very strong opinion about popcorn.",
    choices: [
      { label: "Say yes and order a big pizza",
        outcomes: [
          { text: "The sleepover was loud, giggly, and delicious, and {child} announced it the best night of the year.", effects: { bond: 5, joy: 4, money: -40 } }
        ] },
      { label: "Set a sensible bedtime for everyone",
        outcomes: [
          { weight: 2, text: "Lights were out by ten, and the sleepy giggles faded into a quiet house.", effects: { bond: 1, smarts: 1 } },
          { weight: 1, text: "The bedtime rule lasted exactly eleven minutes before a very cheerful pillow parade broke out.", effects: { bond: -1, joy: 3 } }
        ] }
    ] },

  // ----- Money -----
  { id: "adult_mystery_charge", minAge: 26, maxAge: 64,
    text: "A mystery charge of $240 shows up on your bill for a service you don't remember ordering.",
    choices: [
      { label: "Call them and ask for a second look",
        outcomes: [
          { weight: 2, text: "They admitted it was a mix-up and refunded {amount} right away.", effects: { money: 240, smarts: 1 } },
          { weight: 1, text: "They sent a long apology and a coupon, but the charge stayed on the bill.", effects: { joy: 1 } }
        ] },
      { label: "Pay it and move on",
        outcomes: [
          { text: "You paid the charge, sighed deeply, and vowed to read the fine print next time.", effects: { money: -240, joy: -2 } }
        ] }
    ] },

  { id: "adult_yard_sale_windfall", minAge: 26, maxAge: 64,
    text: "Your old bicycle goes on sale at the yard sale, and a very excited collector arrives with a wallet full of cash.",
    outcomes: [
      { weight: 2, text: "The collector paid {amount} for your old bicycle, and you celebrated with a fancy ice cream cone.", effects: { money: 180, joy: 3 } },
      { weight: 1, text: "The collector offered a homemade pie instead of cash, and you happily took it home.", effects: { joy: 4, kindness: 1 } },
      { weight: 1, text: "Your bicycle sold for a little less than you hoped, and it rode off with a kid who grinned from ear to ear.", effects: { money: 60, kindness: 2 } }
    ] },

  { id: "adult_cash_back", minAge: 26, maxAge: 64,
    text: "Your neighborhood grocery store sends a surprise thank-you check for shopping local all year long.",
    outcomes: [
      { weight: 2, text: "The thank-you check was for {amount}, and you spent it on fresh flowers for the kitchen table.", effects: { money: 65, joy: 2 } },
      { weight: 1, text: "The thank-you check was for {amount}, and you tucked it into a jar labeled Fun Money.", effects: { money: 120, joy: 1 } }
    ] },

  // ----- Health and hobbies -----
  { id: "adult_dance_class", minAge: 26, maxAge: 64,
    text: "The community center is starting a dance class called the Penguin Stomp, and {friend} says you simply have to come.",
    choices: [
      { label: "Sign up and dance with {friend}",
        outcomes: [
          { weight: 2, text: "You learned the Penguin Stomp, waddled through every routine, and {friend} laughed so hard they had to sit down.", effects: { health: 4, joy: 4, bond: 4 } },
          { weight: 1, text: "You stomped with great enthusiasm and only stepped on a few toes, all of them politely forgiven.", effects: { health: 3, joy: 2 } }
        ] },
      { label: "Stay home with a good book",
        outcomes: [
          { text: "You enjoyed a quiet evening with a book and a blanket, and you did not waddle a single step.", effects: { joy: 2 } }
        ] }
    ] },

  { id: "adult_pottery_class", minAge: 26, maxAge: 64,
    text: "The pottery class at the community center has one spot left, and the clay is squishy and cool under your fingers.",
    outcomes: [
      { weight: 2, text: "You shaped a wobbly bowl that holds exactly one cup of cocoa, and you were very proud of it.", effects: { skills: { art: 5 }, joy: 4 } },
      { weight: 1, text: "Your first mug collapsed into a lumpy blob, but the teacher said it was a very promising blob.", effects: { skills: { art: 2 }, joy: 2 } }
    ] },

  { id: "adult_community_theater", minAge: 26, maxAge: 64,
    text: "The town theater is casting a cow in its barnyard musical, and nobody else has volunteered for the part.",
    choices: [
      { label: "Take the role and moo with pride",
        outcomes: [
          { weight: 2, text: "You mooed with great confidence, and the audience laughed and clapped at every single line.", effects: { skills: { acting: 6 }, joy: 4 } },
          { weight: 1, text: "Your moo came out more like a squeak, but the cow costume was the hit of the show.", effects: { skills: { acting: 3 }, joy: 2 } }
        ] },
      { label: "Build the set instead",
        outcomes: [
          { text: "You painted a barn so bright that the actors kept complimenting the scenery.", effects: { skills: { art: 3 }, kindness: 2 } }
        ] }
    ] },

  // ----- Family and community -----
  { id: "adult_grandparent_video", minAge: 26, maxAge: 64,
    text: "{grandparent} sends a video message with a song they made up about your cooking, and they ask you to sing back.",
    choices: [
      { label: "Sing back with a silly verse",
        outcomes: [
          { text: "You sang a silly verse about pancakes, and {grandparent} laughed so hard the video shook.", effects: { bond: 5, joy: 4 } }
        ] },
      { label: "Send a funny photo in return",
        outcomes: [
          { text: "Your funny photo made {grandparent} giggle, and they asked for a second one right away.", effects: { bond: 3, joy: 3 } }
        ] }
    ] },

  { id: "adult_sibling_game_night", minAge: 26, maxAge: 64,
    text: "Your {siblingRole} {sibling} arrives for a visit with a suitcase full of board games and a very bold plan.",
    choices: [
      { label: "Stay up late playing games",
        outcomes: [
          { weight: 2, text: "You played until midnight, and {sibling} won by a single point and bragged about it all week.", effects: { bond: 5, joy: 4 } },
          { weight: 1, text: "Someone peeked at their cards, and everyone demanded a re-deal, with a lot of giggling.", effects: { bond: 3, joy: 3 } }
        ] },
      { label: "Wake up early for pastries",
        outcomes: [
          { text: "You walked to the bakery at sunrise, and {sibling} declared the croissants a national treasure.", effects: { bond: 4, joy: 2 } }
        ] }
    ] },

  { id: "adult_surprise_party", minAge: 26, maxAge: 64,
    text: "A surprise party for {friend} is being planned, and you have been put in charge of the secret cake.",
    choices: [
      { label: "Bake the cake with a secret recipe",
        outcomes: [
          { weight: 2, text: "The cake was tall, sweet, and gloriously lopsided, and {friend} gasped when the lights came on.", effects: { bond: 5, joy: 4, skills: { cooking: 3 } } },
          { weight: 1, text: "The cake leaked a little frosting, but {friend} said it was the best surprise ever.", effects: { bond: 3, joy: 2 } }
        ] },
      { label: "Keep the secret and hide the presents",
        outcomes: [
          { text: "You hid the presents in the car trunk, and {friend} never guessed a thing.", effects: { bond: 3, smarts: 2 } }
        ] }
    ] },

  { id: "adult_neighborhood_cookout", minAge: 26, maxAge: 64,
    text: "The neighborhood cookout is sizzling, and {neighbor} is guarding the grill like a very proud chef.",
    outcomes: [
      { weight: 2, text: "You won the cupcake decorating contest with a frosting dragon, and everyone cheered.", effects: { joy: 5, kindness: 2 } },
      { weight: 1, text: "A sudden rain shower chased everyone inside, but the card game afterward was the best part.", effects: { joy: 4 } },
      { weight: 1, text: "{neighbor} shared a secret barbecue sauce recipe and promised to keep it under wraps.", effects: { kindness: 3, joy: 2 } }
    ] }
]);
