// ChipLife teen events, part 2: college (ages 17-25) and young adults (ages 16-25)
CL.add("events", [
  {
    id: "teen_col_roommate_quirks", minAge: 17, maxAge: 25, needs: ["college"],
    text: "Your new roommate, {newFriend}, owns forty-two houseplants and has given every single one a name.",
    effects: { newFriend: true, joy: 3, kindness: 1 }
  },
  {
    id: "teen_col_finals_week", minAge: 17, maxAge: 25, needs: ["college"], weight: 1.2,
    text: "Finals week has arrived. The library is full of people who look like they have been studying since Tuesday.",
    choices: [
      { label: "Study at the library until closing",
        outcomes: [
          { weight: 2, text: "You filled three notebooks with neat notes. Your professor's grade made you smile for a week.", effects: { grades: 6, health: -2 }, favor: "smarts" },
          { weight: 1, text: "You studied so long the librarian turned off the lights. You became an expert in studying by flashlight.", effects: { grades: 2, joy: -1 } }
        ] },
      { label: "Take a snack break first",
        outcomes: [
          { text: "You shared a bag of popcorn with a friend, then finished the practice exam with a clear head.", effects: { grades: 3, health: 1 } }
        ] }
    ]
  },
  {
    id: "teen_col_study_group", minAge: 17, maxAge: 25, needs: ["college"],
    text: "A study group invites you to a late-night session. They promise pizza, a giant whiteboard, and a diagram with twelve arrows.",
    choices: [
      { label: "Join the study group",
        outcomes: [
          { weight: 2, text: "Everyone explained a different part of the chapter, and suddenly the whole thing clicked together.", effects: { grades: 5, kindness: 2 } },
          { weight: 1, text: "The group argued about pizza toppings longer than the homework. You still learned a lot.", effects: { grades: 2, joy: 2 } }
        ] },
      { label: "Study alone with a highlighter",
        outcomes: [
          { text: "You highlighted everything in bright yellow. Your notes were very organized and very quiet.", effects: { grades: 1 } }
        ] }
    ]
  },
  {
    id: "teen_col_club_fair", minAge: 17, maxAge: 25, needs: ["college"],
    text: "The campus club fair has two hundred tables. One offers free cookies, and another offers 'competitive napping.'",
    choices: [
      { label: "Sign up for the cookie club",
        outcomes: [
          { text: "The cookie club taught you to bake a perfect chocolate chip cookie, with a sprinkle of confidence.", effects: { skills: { cooking: 5 }, joy: 3 } }
        ] },
      { label: "Join the photography society",
        outcomes: [
          { weight: 2, text: "Your photo of a pigeon wearing a tiny hat won the club's monthly contest.", effects: { skills: { art: 5 }, joy: 3 } },
          { weight: 1, text: "Your camera strap got stuck on a bush. The club agreed the bush deserved a photo too.", effects: { skills: { art: 2 } } }
        ] },
      { label: "Sign up for competitive napping",
        outcomes: [
          { text: "You took bronze in the nap-off with a seven-minute nap and a very relaxed face.", effects: { health: 2, joy: 4 } }
        ] }
    ]
  },
  {
    id: "teen_col_laundry_disaster", minAge: 17, maxAge: 25, needs: ["college"],
    text: "You washed one red sock with a load of white clothes. Now everything you own has a surprising shade of pink.",
    outcomes: [
      { weight: 3, text: "Your white shirts became a tie-dye masterpiece. Honestly, very bold fashion.", effects: { style: 2, joy: 2 } },
      { weight: 2, text: "A laundry room squirrel ran off with one of your socks. The lost-sock club grew by one.", effects: { joy: -1 } },
      { weight: 1, text: "A kind stranger helped you sort everything out, and the pink hoodie became your favorite.", effects: { kindness: 2, joy: 2 } }
    ]
  },
  {
    id: "teen_col_internship_offer", minAge: 18, maxAge: 25, needs: ["college"],
    text: "A local company offers you a paid summer internship. Their office plant is taller than the receptionist.",
    choices: [
      { label: "Accept the internship",
        outcomes: [
          { weight: 2, text: "You spent the summer organizing files and practicing the phrase 'circle back' without giggling.", effects: { money: 900, smarts: 3, skills: { writing: 2 } } },
          { weight: 1, text: "Your first project was a spreadsheet of office snacks. Management nicknamed it the snack bible.", effects: { money: 600, joy: 3 } }
        ] },
      { label: "Decline politely and keep summer free",
        outcomes: [
          { text: "You spent the summer at the lake with a sandwich, a hammock, and an excellent book.", effects: { joy: 4, health: 1 } }
        ] }
    ]
  },
  {
    id: "teen_col_office_hours", minAge: 17, maxAge: 25, needs: ["college"],
    text: "Your professor's office hours are open. You have one very big question and one very small cookie.",
    choices: [
      { label: "Ask the big question",
        outcomes: [
          { text: "The professor explained it on a napkin, and suddenly the whole chapter made sense.", effects: { grades: 5, smarts: 2 }, favor: "smarts" }
        ] },
      { label: "Chat about their cat",
        outcomes: [
          { weight: 2, text: "Their cat, Professor Whiskers, sat on your notes. You learned three surprising facts about cats.", effects: { joy: 3, kindness: 2 } },
          { weight: 1, text: "You talked about cats for twenty minutes and forgot the question entirely. Worth it.", effects: { joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_col_campus_food", minAge: 17, maxAge: 25, needs: ["college"],
    text: "The dining hall is serving 'Taco Wednesday' on a Thursday. Nobody has asked any questions yet.",
    outcomes: [
      { weight: 2, text: "The tacos were excellent. You went back for seconds and learned the name of the chef.", effects: { joy: 3, health: 1 } },
      { weight: 2, text: "The salad was extremely crunchy, which you decided was a feature. Vegetables for the win.", effects: { health: 2 } },
      { weight: 1, text: "The soup of the day was a mysterious orange. You ate it anyway and asked for the recipe on a napkin.", effects: { joy: 2 } }
    ]
  },
  {
    id: "teen_col_pizza_party", minAge: 17, maxAge: 25, needs: ["college"],
    text: "Your hall hosts a pizza party. Someone brings a pineapple pizza and starts a very brave argument about it.",
    effects: { joy: 4, kindness: 1 }
  },
  {
    id: "teen_col_scholarship_letter", minAge: 17, maxAge: 25, needs: ["college"], once: true,
    text: "An envelope arrives: you won a small scholarship for an essay about pancakes. Yes, really.",
    outcomes: [
      { weight: 2, text: "The check covered a semester of textbooks, plus a fancy spatula you have named Flapjack.", effects: { money: 500, joy: 4 } },
      { weight: 1, text: "The scholarship was modest, but the certificate was now framed above your desk.", effects: { money: 150, joy: 3 } }
    ]
  },
  {
    id: "teen_col_professor_pun", minAge: 17, maxAge: 25, needs: ["college"],
    text: "Your professor tells a pun so bad the whole lecture hall groans, then demands an encore.",
    effects: { joy: 3, smarts: 1 }
  },
  {
    id: "teen_col_research_source", minAge: 17, maxAge: 25, needs: ["college"],
    text: "Your research paper needs one rare source, and the librarian says it is hiding in the basement archive.",
    choices: [
      { label: "Explore the basement archive",
        outcomes: [
          { weight: 2, text: "You found a 1960s diary about a town's giant pumpkin. It made your whole paper better.", effects: { grades: 5, smarts: 3 }, favor: "smarts" },
          { weight: 1, text: "The basement was dusty and dim. You found the source, plus a sneeze that echoed for a minute.", effects: { grades: 2, health: -1 } }
        ] },
      { label: "Ask the librarian for help",
        outcomes: [
          { text: "The librarian found the source in two minutes, then recommended three more books for fun.", effects: { grades: 4, joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_col_movie_night", minAge: 17, maxAge: 25, needs: ["college"],
    text: "Movie night in the common room! The vote is between 'The Great Pancake Parade' and a documentary about moss.",
    choices: [
      { label: "Vote for the pancake parade",
        outcomes: [
          { weight: 2, text: "The whole room cheered at the parade finale. You hummed its theme song all week.", effects: { joy: 4, kindness: 1 } },
          { weight: 1, text: "Someone fell asleep before the first float, so the group voted to watch it again tomorrow.", effects: { joy: 2 } }
        ] },
      { label: "Vote for the moss documentary",
        outcomes: [
          { text: "The moss turned out to be fascinating. You could now name four kinds of moss and one very sleepy snail.", effects: { smarts: 3, joy: 1 } }
        ] }
    ]
  },
  {
    id: "teen_col_intramural_volleyball", minAge: 17, maxAge: 25, needs: ["college"],
    text: "The intramural volleyball team needs a sub for Thursday. The net is a little droopy, but the snacks are great.",
    choices: [
      { label: "Join the team on Thursday",
        outcomes: [
          { weight: 2, text: "You served three perfect points and high-fived the whole team, including the droopy net.", effects: { skills: { sports: 4 }, joy: 4, health: 2 } },
          { weight: 1, text: "The ball went everywhere except over the net. Your team cheered for every single try.", effects: { skills: { sports: 2 }, joy: 2 } }
        ] },
      { label: "Cheer from the sidelines",
        outcomes: [
          { text: "You cheered so hard that a teammate gave you a cardboard trophy. It was surprisingly sturdy.", effects: { joy: 3 } }
        ] }
    ]
  },
  {
    id: "teen_col_forgot_student_id", minAge: 17, maxAge: 25, needs: ["college"],
    text: "You forgot your student ID at home, and the cafeteria cashier is giving you a very serious look.",
    outcomes: [
      { weight: 2, text: "A sincere smile and a long story about a toaster convinced the cashier to let you in.", effects: { joy: 1 } },
      { weight: 1, text: "You had to walk all the way back to get it. Your lunch was a little cold by the time you returned.", effects: { health: -1 } }
    ]
  },
  {
    id: "teen_learn_to_drive", minAge: 16, maxAge: 19, once: true,
    text: "Your first driving lesson is today. The instructor has a calm voice and a spare brake pedal, just in case.",
    outcomes: [
      { weight: 3, text: "You drove around the empty parking lot like a pro. The orange cones were very impressed.", effects: { joy: 4, smarts: 2 } },
      { weight: 2, text: "You checked all three mirrors so often that the instructor started counting them out loud.", effects: { joy: 2 } },
      { weight: 1, text: "Your three-point turn took five tries, but the instructor said five was a very respectable number.", effects: { joy: 1 } }
    ]
  },
  {
    id: "teen_first_paycheck", minAge: 16, maxAge: 22, needs: ["job"], once: true,
    text: "Your very first paycheck arrives! It is smaller than you hoped, but it has your name printed right on it.",
    effects: { money: 240, joy: 4 }
  },
  {
    id: "teen_first_apartment", minAge: 18, maxAge: 25, needs: ["ownPlace"],
    text: "Your first apartment is tiny, but the windows are sunny and the radiator clanks like a determined drummer.",
    choices: [
      { label: "Fill it with houseplants",
        outcomes: [
          { text: "Your apartment became a jungle with a kitchen in the middle. The plants thrived, and so did you.", effects: { joy: 4, health: 1 } }
        ] },
      { label: "Buy a cozy floor lamp",
        outcomes: [
          { weight: 2, text: "The lamp made the whole room glow. Your neighbors called it the nicest corner on the block.", effects: { money: -120, style: 3, joy: 2 } },
          { weight: 1, text: "The lamp turned out a little too tall and now almost touched the ceiling fan. You were proud of it anyway.", effects: { money: -120, joy: 1 } }
        ] }
    ]
  },
  {
    id: "teen_living_at_home", minAge: 18, maxAge: 25, needs: ["withParents"],
    text: "You are living at home again, and {mom} has your laundry folded before you can even ask.",
    choices: [
      { label: "Cook dinner for everyone",
        outcomes: [
          { text: "Your lasagna was a big hit, and {dad} asked for the recipe twice.", effects: { skills: { cooking: 4 }, kindness: 3, joy: 2 } }
        ] },
      { label: "Offer to pay a little rent",
        outcomes: [
          { weight: 2, text: "{mom} accepted the money with a big hug, then used it to buy you a surprise cake.", effects: { money: -200, kindness: 4, joy: 3 } },
          { weight: 1, text: "Your offer was accepted, and you knew exactly how much groceries cost. Wow.", effects: { money: -150, smarts: 2 } }
        ] }
    ]
  },
  {
    id: "teen_job_hunting", minAge: 18, maxAge: 25, needs: ["noJob"],
    text: "Job hunting is harder than it looks. The job board has forty listings, and one of them wants a llama wrangler.",
    choices: [
      { label: "Apply for everything",
        outcomes: [
          { weight: 2, text: "Your resume got a callback, then a second one. Your cover letter used the word 'enthusiastic' four times.", effects: { joy: 2, smarts: 1 } },
          { weight: 1, text: "You applied for the llama job out of curiosity. They replied with a very polite maybe.", effects: { joy: 3 } }
        ] },
      { label: "Take a free class to brush up",
        outcomes: [
          { text: "The free class taught you how to write a clear cover letter. Your confidence grew a notch.", effects: { smarts: 3, skills: { writing: 3 } } }
        ] }
    ]
  },
  {
    id: "teen_road_trip", minAge: 16, maxAge: 25,
    text: "{friend} suggests a road trip to see a giant ball of yarn in a field. The gas tank is half full.",
    choices: [
      { label: "Pack snacks and go",
        outcomes: [
          { weight: 2, text: "You and {friend} sang every song on the radio, twice, and bought a postcard with a moose on it.", effects: { joy: 5, bond: 5 } },
          { weight: 1, text: "A flat tire added two hours to the trip, but {friend} built a picnic on the roadside. Excellent planning.", effects: { joy: 3, bond: 3 } }
        ] },
      { label: "Plan a movie night instead",
        outcomes: [
          { text: "You and {friend} watched a movie with homemade popcorn and argued about the ending. Very cozy.", effects: { joy: 3, bond: 2 } }
        ] }
    ]
  },
  {
    id: "teen_adopt_rabbit", minAge: 16, maxAge: 25, once: true,
    text: "The animal shelter has a sleepy rabbit named Pickle who is looking for a home. The sign says 'Gentle and very fluffy.'",
    choices: [
      { label: "Adopt Pickle the rabbit",
        outcomes: [
          { text: "Pickle hopped into your arms and gave a happy little wiggle. Welcome home!", effects: { addPet: "rabbit", money: -100, joy: 6 } }
        ] },
      { label: "Visit with a carrot instead",
        outcomes: [
          { text: "Pickle politely munched the carrot. You left the shelter smiling and fluffier than before.", effects: { joy: 2, kindness: 1 } }
        ] }
    ]
  },
  {
    id: "teen_viral_video", minAge: 16, maxAge: 25,
    text: "Your video of a toaster that refuses to make toast has gone viral overnight. Your phone will not stop buzzing.",
    outcomes: [
      { weight: 3, text: "Thousands of strangers left comments about the toaster's dramatic personality.", effects: { followers: 3000, joy: 3 } },
      { weight: 2, text: "A local news account shared your video. The toaster is briefly famous around town.", effects: { followers: 1500, fame: 2 } },
      { weight: 1, text: "In the final clip the toaster finally made toast. It was the most dramatic toast in history.", effects: { followers: 5000, fame: 3, joy: 2 } }
    ]
  },
  {
    id: "teen_volunteer_garden", minAge: 16, maxAge: 25,
    text: "The community garden needs helpers to plant three hundred tulip bulbs before the first frost.",
    choices: [
      { label: "Spend the whole day planting",
        outcomes: [
          { weight: 2, text: "By sunset your hands were muddy and every bulb was in the ground. Spring was going to be spectacular.", effects: { kindness: 5, health: 2, joy: 2 } },
          { weight: 1, text: "A few bulbs went in upside down, but the tulips seemed fine with it.", effects: { kindness: 3, joy: 2 } }
        ] },
      { label: "Donate a few spare tools",
        outcomes: [
          { text: "Your spare trowel and gardening gloves found a happy new home with the garden crew.", effects: { kindness: 2 } }
        ] }
    ]
  },
  {
    id: "teen_budget_crisis", minAge: 18, maxAge: 25, needs: ["poor"],
    text: "Your phone bill, your grocery list, and a very large pizza all arrive on the same day. Your wallet sighs.",
    choices: [
      { label: "Make a strict budget spreadsheet",
        outcomes: [
          { weight: 2, text: "Your spreadsheet had colors, formulas, and a tiny cheering star. Your money finally made sense.", effects: { money: -40, smarts: 3 } },
          { weight: 1, text: "A formula error cost you an entire afternoon. The numbers were still a little wobbly.", effects: { money: -20, joy: -2 } }
        ] },
      { label: "Sell old books online",
        outcomes: [
          { text: "Three old books sold quickly, and one buyer left a kind note about the cover.", effects: { money: 120, kindness: 1 } }
        ] }
    ]
  }
]);
