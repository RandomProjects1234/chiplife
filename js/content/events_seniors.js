// js/content/events_seniors.js
CL.add("events", [
  { id: "senior_retirement_party", minAge: 60, maxAge: 75, once: true, needs: ["retired"],
    text: "Your former coworkers threw a surprise retirement party. The banner says \"Congratulations, Cool Retiree!\" What now?",
    choices: [
      { label: "Give a funny speech",
        outcomes: [
          { weight: 3, text: "Your speech had the whole room laughing so hard that the cake got a little soggy.", effects: { joy: 6, fame: 1 } },
          { weight: 1, text: "You forgot your notes and told the stapler story again. Everyone cheered anyway.", effects: { joy: 3 } }
        ] },
      { label: "Dance the polka with the crowd",
        outcomes: [
          { text: "You spun around the room with the whole office until the music finally stopped.", effects: { joy: 5, health: 2 } }
        ] },
      { label: "Take a cozy nap on the lounge couch",
        outcomes: [
          { text: "You napped on the lumpy couch and woke up to a standing ovation. Very dramatic.", effects: { joy: 3, health: 1 } }
        ] }
    ] },

  { id: "senior_tomato_triumph", minAge: 60, maxAge: 105,
    text: "Tomato season has arrived, and your backyard garden is buzzing with bees and excitement.",
    outcomes: [
      { weight: 3, text: "Your tomato plants grew so tall they needed their own zip code. The neighbors are impressed.", effects: { joy: 4, health: 1 } },
      { weight: 1, text: "A very bold squirrel ate every single tomato. You offered it a medal, and it refused.", effects: { joy: 1 } }
    ] },

  { id: "senior_bird_watching", minAge: 60, maxAge: 105,
    text: "You hang a bird feeder by the window and pull up a folding chair. Something with bright feathers just landed.",
    outcomes: [
      { weight: 3, text: "You spotted a bright red cardinal and wrote it in your very official bird diary.", effects: { joy: 4, smarts: 2 } },
      { weight: 2, text: "A pigeon ate the entire seed cake and looked very proud of itself.", effects: { joy: 2 } },
      { weight: 1, text: "A rare bird visited the feeder. Local bird clubs are now asking to see your photos.", effects: { joy: 4, fame: 1, smarts: 2 } }
    ] },

  { id: "senior_video_call_lesson", minAge: 60, maxAge: 105,
    text: "The family wants to switch to video calls. The icons on your tablet look like tiny hieroglyphs.",
    choices: [
      { label: "Ask {neighbor} for help",
        outcomes: [
          { weight: 3, text: "{neighbor} patiently showed you the big green call symbol. Now the whole family can see your hat.", effects: { smarts: 3, kindness: 2 } },
          { weight: 1, text: "You accidentally called the pizza place. They sang happy birthday to you anyway.", effects: { joy: 3 } }
        ] },
      { label: "Read the manual page by page",
        outcomes: [
          { text: "The manual had 212 pages. By page four you were a video call expert.", effects: { smarts: 4 } }
        ] },
      { label: "Phone them the old-fashioned way",
        outcomes: [
          { text: "You called on the regular phone instead. Everyone agreed the chat was just as delightful.", effects: { joy: 3, kindness: 1 } }
        ] }
    ] },

  { id: "senior_recipe_teaching", minAge: 60, maxAge: 105,
    text: "Your {childRole} {child} asks for your famous apple pie recipe. It is finally time to pass on the secret.",
    choices: [
      { label: "Teach {child} the family pie",
        outcomes: [
          { weight: 3, text: "The pie came out a little lopsided, but {child} declared it the best pie in the world.", effects: { joy: 5, kindness: 2, bond: 5, skills: { cooking: 3 } } },
          { weight: 1, text: "You forgot the sugar, but {child} said it was the most interesting pie ever baked.", effects: { joy: 2, bond: 3 } }
        ] },
      { label: "Keep the recipe a secret",
        outcomes: [
          { text: "You winked and said the recipe stays a secret for another ten years. Very mysterious.", effects: { joy: 2 } }
        ] }
    ] },

  { id: "senior_friend_visit", minAge: 60, maxAge: 105,
    text: "{friend} is visiting for the afternoon, carrying a suitcase full of jigsaw puzzles.",
    choices: [
      { label: "Host a tea party",
        outcomes: [
          { text: "You served tea and cookies, and the two of you chatted until the kettle went cold.", effects: { joy: 4, bond: 4 } }
        ] },
      { label: "Challenge {friend} to a race",
        outcomes: [
          { weight: 2, text: "{friend} finished the puzzle first, but you had the biggest grin of the day.", effects: { smarts: 3, bond: 2 } },
          { weight: 1, text: "You both finished at the exact same moment. Then you started again to be sure.", effects: { smarts: 2, bond: 3 } }
        ] },
      { label: "Take a long walk together",
        outcomes: [
          { text: "Your legs were a little tired, but the conversation was excellent.", effects: { health: 2, bond: 3 } }
        ] }
    ] },

  { id: "senior_mall_walkers", minAge: 60, maxAge: 105,
    text: "The mall walking club meets every morning by the fountain, before the stores open. Shoes at the ready!",
    choices: [
      { label: "Join the mall walking club",
        outcomes: [
          { weight: 3, text: "You walked lap after lap past the pretzel stand. By lap ten you had a new friend: {newFriend}.", effects: { health: 3, newFriend: true } },
          { weight: 1, text: "You got so excited about the pretzels that you walked an extra lap. Your shoes disagree.", effects: { health: 2, joy: 2 } }
        ] },
      { label: "Watch the walkers from a bench",
        outcomes: [
          { text: "You judged every hat in the building and gave each one a score out of ten.", effects: { joy: 2, style: 1 } }
        ] }
    ] },

  { id: "senior_memoir_writing", minAge: 60, maxAge: 105,
    text: "Your family keeps asking for the stories from your younger years. Maybe it is finally time for a memoir?",
    choices: [
      { label: "Start writing a memoir",
        outcomes: [
          { weight: 3, text: "You wrote three chapters about your first bicycle. The bicycle would like some credit too.", effects: { skills: { writing: 5 }, joy: 3 } },
          { weight: 1, text: "Chapter one is about the day you accidentally started a parade. It is forty pages long.", effects: { skills: { writing: 3 }, joy: 2 } }
        ] },
      { label: "Let {neighbor} type your stories",
        outcomes: [
          { text: "{neighbor} typed up your stories while you talked, and the result was a surprisingly good book.", effects: { skills: { writing: 2 }, kindness: 3 } }
        ] }
    ] },

  { id: "senior_cruise_offer", minAge: 60, maxAge: 105,
    text: "A brochure for a three-day boat cruise arrives. The pool on the front page is shaped like a giant banana.",
    choices: [
      { label: "Book the cruise",
        outcomes: [
          { weight: 3, text: "You spent the week dancing, eating shrimp, and winning the deck shuffleboard match.", effects: { money: -1500, joy: 8 } },
          { weight: 1, text: "You won a tiny plastic duck in the ship's trivia contest. It is now your official mascot.", effects: { money: -1500, joy: 4 } }
        ] },
      { label: "Stay home and garden instead",
        outcomes: [
          { text: "Your roses agreed that cruises are overrated. They were absolutely right.", effects: { joy: 3, health: 1 } }
        ] },
      { label: "Put the money in a savings jar",
        outcomes: [
          { text: "A month later you found a forgotten twenty-dollar bill in your winter coat.", effects: { money: 20, joy: 1 } }
        ] }
    ] },

  { id: "senior_chess_club", minAge: 60, maxAge: 105,
    text: "The senior center's chess club is hosting a tournament. The grand prize is a trophy shaped like a knight.",
    choices: [
      { label: "Enter the tournament",
        outcomes: [
          { weight: 3, text: "You checkmated the club champion in a surprise upset. The knight trophy is yours!", effects: { smarts: 5, joy: 4, fame: 1 } },
          { weight: 1, text: "You lost to a sharp-eyed teenager from the library, but you shook hands like a true pro.", effects: { smarts: 2, kindness: 2 } }
        ] },
      { label: "Watch and take notes",
        outcomes: [
          { text: "You wrote down every clever move. Your next game is going to be much sneakier.", effects: { smarts: 2 } }
        ] }
    ] },

  { id: "senior_library_volunteer", minAge: 60, maxAge: 105,
    text: "The public library needs a volunteer to read picture books at story time every Tuesday morning.",
    choices: [
      { label: "Volunteer for story time",
        outcomes: [
          { weight: 3, text: "You read stories in silly voices, and the kids begged you to come back next week.", effects: { kindness: 5, joy: 4 } },
          { weight: 1, text: "A puppet got stuck on your sleeve, so it became the star of the show.", effects: { kindness: 2, joy: 2 } }
        ] },
      { label: "Stay home with a crossword",
        outcomes: [
          { text: "You finished the Sunday crossword in pen. Nobody can argue with that.", effects: { smarts: 3, joy: 1 } }
        ] }
    ] },

  { id: "senior_back_pain", minAge: 60, maxAge: 105,
    text: "You bent down to pick up a dropped spoon, and your back went creak! Very dramatic for a spoon.",
    choices: [
      { label: "Rest with a heating pad",
        outcomes: [
          { text: "You rested on the couch with a warm pad, and your back agreed to behave by dinner.", effects: { health: 1, joy: 1 } }
        ] },
      { label: "Carry all the grocery bags",
        outcomes: [
          { weight: 2, text: "You carried every bag in one trip with excellent posture. Your back simply shrugged.", effects: { health: 2 } },
          { weight: 1, text: "Every bag came in one trip. Now your back needs some gentle care for a few weeks.", effects: { illness: "back_pain", joy: -2 } }
        ] }
    ] },

  { id: "senior_arthritis", minAge: 60, maxAge: 110,
    text: "Your fingers feel stiff this morning, so opening the jam jar takes extra twisting. What do you do?",
    choices: [
      { label: "Visit the doctor for advice",
        outcomes: [
          { text: "The doctor gave you gentle hand exercises and a jar opener shaped like a frog.", effects: { health: 3 } }
        ] },
      { label: "Ask {neighbor} to help",
        outcomes: [
          { text: "{neighbor} opened the jar with one twist. You baked a muffin to say thank you.", effects: { kindness: 2, joy: 2 } }
        ] },
      { label: "Keep twisting on your own",
        outcomes: [
          { weight: 2, text: "The lid popped off all by itself. Your fingers are very proud of you.", effects: { joy: 2 } },
          { weight: 1, text: "You twisted for so long that your hand got sore. Time to see the doctor soon.", effects: { illness: "arthritis", joy: -1 } }
        ] }
    ] },

  { id: "senior_cataracts", minAge: 60, maxAge: 110,
    text: "Everything looks a bit foggy lately, as if someone breathed on the whole world. The eye doctor says it could be cataracts.",
    choices: [
      { label: "Book an eye doctor visit",
        outcomes: [
          { text: "The eye doctor was cheerful and made a clear plan. Your future looks brighter already.", effects: { health: 3, joy: 2 } }
        ] },
      { label: "Get a fancy pair of glasses",
        outcomes: [
          { text: "Your new glasses reveal that the cat across the street has been wearing a tiny hat all along.", effects: { style: 2, joy: 3 } }
        ] },
      { label: "Squint and hope for the best",
        outcomes: [
          { weight: 2, text: "Squinting turned the newspaper into a fun guessing game. You won anyway.", effects: { smarts: 2 } },
          { weight: 1, text: "Squinting made everything blurrier. Please go see the doctor soon.", effects: { illness: "cataracts" } }
        ] }
    ] },

  { id: "senior_scam_call", minAge: 60, maxAge: 110,
    text: "A cheerful stranger calls to say you have won a prize. First, they need a small payment to claim it. What now?",
    choices: [
      { label: "Hang up and call the bank",
        outcomes: [
          { text: "You called the real bank, and they said the prize was fake. Brilliant detective work!", effects: { smarts: 5, joy: 2 } }
        ] },
      { label: "Ask them to repeat it slowly",
        outcomes: [
          { text: "They repeated the prize story so many times that they ended up hanging up on themselves.", effects: { joy: 2, smarts: 1 } }
        ] },
      { label: "Pay the small fee",
        outcomes: [
          { text: "The prize never arrived, and your $150 vanished faster than a magic trick. Lesson learned!", effects: { money: -150, smarts: -2 } }
        ] }
    ] },

  { id: "senior_surprise_hobby", minAge: 60, maxAge: 105,
    text: "A flyer at the community center catches your eye: Free Classes This Month! You decide to try something new.",
    outcomes: [
      { weight: 2, text: "You took a pottery class and made a vase shaped like a very confident duck.", effects: { skills: { art: 6 }, joy: 4 } },
      { weight: 2, text: "You joined a ballroom dance class and discovered some surprisingly smooth moves.", effects: { health: 3, joy: 3, skills: { sports: 2 } } },
      { weight: 1, text: "You tried competitive yo-yo. Your yo-yo now has a fan club of two.", effects: { joy: 3, skills: { sports: 2 } } },
      { weight: 1, text: "You tried beekeeping and became friends with a very polite bee.", effects: { joy: 4, kindness: 2 } }
    ] },

  { id: "senior_neighbor_wisdom", minAge: 60, maxAge: 110,
    text: "{neighbor} is nervous about trying something new and asks what you would do.",
    choices: [
      { label: "Give a helpful tip",
        outcomes: [
          { text: "You told {neighbor} to try one new thing each week. They wrote it on a sticky note.", effects: { kindness: 4, joy: 2 } }
        ] },
      { label: "Tell a silly story",
        outcomes: [
          { text: "You told the one about the goat in the library. {neighbor} laughed so hard they had to sit down.", effects: { joy: 4, kindness: 1 } }
        ] },
      { label: "Offer to come along",
        outcomes: [
          { weight: 2, text: "You went to the first class together. {neighbor} said it was the best morning in months.", effects: { kindness: 5, joy: 3 } },
          { weight: 1, text: "You dozed off during the class. {neighbor} says you snored in perfect rhythm.", effects: { joy: 2 } }
        ] }
    ] },

  { id: "senior_adopt_pet", minAge: 60, maxAge: 110,
    text: "The shelter has a calm old turtle named Pepper who wants a quiet home with a sunny window.",
    choices: [
      { label: "Adopt the sleepy old turtle",
        outcomes: [
          { text: "You brought Pepper home, and the turtle promptly fell asleep on your slipper.", effects: { addPet: "turtle", joy: 4 } }
        ] },
      { label: "Adopt a bouncy puppy instead",
        outcomes: [
          { text: "The puppy is a whirlwind. Now you take three walks a day, and the neighbors know your name.", effects: { addPet: "dog", health: 3, joy: 3 } }
        ] },
      { label: "Promise to visit next week",
        outcomes: [
          { text: "Pepper waved one very slow foot as you left. You promised to come back and say hello.", effects: { joy: 1 } }
        ] }
    ] },

  { id: "senior_garden_gnome_contest", minAge: 60, maxAge: 105,
    text: "The neighborhood garden gnome contest is open for entries, and your gnome is wearing a tiny sun hat.",
    outcomes: [
      { weight: 3, text: "Your gnome won Best Dressed Gnome. It now has a small blue ribbon around its neck.", effects: { joy: 5, fame: 1 } },
      { weight: 2, text: "A raccoon moved your gnome to a sunnier spot. The judges gave it an honorable mention.", effects: { joy: 3 } },
      { weight: 1, text: "The judges could not decide, so they gave everyone a cookie. Your gnome got two.", effects: { joy: 2, kindness: 1 } }
    ] },

  { id: "senior_pen_pal", minAge: 60, maxAge: 105,
    text: "You answered an ad for a pen pal. Two weeks later, a letter arrives with a drawing of a llama on it.",
    outcomes: [
      { weight: 3, text: "Your new pen pal, {newFriend}, writes every Sunday, and the letters are full of jokes.", effects: { newFriend: true, joy: 4, smarts: 1 } },
      { weight: 1, text: "The pen pal wrote back with a recipe for banana bread. It sounds delicious and a little strange.", effects: { joy: 2 } }
    ] },

  { id: "senior_card_game_night", minAge: 60, maxAge: 105,
    text: "Game night at the community center is in full swing, and someone has brought a giant bag of popcorn.",
    outcomes: [
      { weight: 2, text: "You played cards until the lights dimmed. Your team took home the friendly trophy.", effects: { joy: 4, smarts: 2 } },
      { weight: 2, text: "Everyone argued about the rules, and then everyone had a wonderful time anyway.", effects: { joy: 3, kindness: 1 } },
      { weight: 1, text: "You shuffled so fast that the cards flew everywhere. The popcorn was the real winner.", effects: { joy: 2 } }
    ] },

  { id: "senior_pickleball_day", minAge: 60, maxAge: 105,
    text: "The park just opened a new pickleball court, and a friendly group of players has invited you to join.",
    outcomes: [
      { weight: 3, text: "You played three games and shouted \"Ace!\" at the wrong player. Everyone laughed.", effects: { health: 3, joy: 3 } },
      { weight: 1, text: "You stretched a little too far and needed a long nap afterward. Worth it for those rallies!", effects: { health: 1, joy: 2 } }
    ] },

  { id: "senior_knitting_circle", minAge: 60, maxAge: 105,
    text: "The knitting circle at the library is taking new members. Someone is already making a sweater for a very large goose.",
    choices: [
      { label: "Join the knitting circle",
        outcomes: [
          { weight: 3, text: "You finished your first scarf. It is only slightly crooked, and the circle gave it a standing clap.", effects: { skills: { art: 4 }, joy: 4 } },
          { weight: 1, text: "You knitted two sleeves for the same sweater. The circle is now considering a new hobby for you.", effects: { skills: { art: 2 }, joy: 2 } }
        ] },
      { label: "Knit a hat for a friend",
        outcomes: [
          { text: "The hat came out a little lumpy, but your friend wore it proudly to every single party.", effects: { kindness: 4, joy: 2 } }
        ] }
    ] },

  { id: "senior_stargazing", minAge: 60, maxAge: 105,
    text: "The sky is clear tonight, so you drag a blanket out to the backyard for some stargazing.",
    outcomes: [
      { weight: 3, text: "You spotted a planet that looked like a big orange marble. You wrote it down with pride.", effects: { smarts: 3, joy: 3 } },
      { weight: 2, text: "You counted seventeen falling stars and made a wish for more pie.", effects: { joy: 4 } },
      { weight: 1, text: "A friendly owl joined you and hooted something that sounded a lot like \"very nice.\"", effects: { joy: 2, kindness: 1 } }
    ] },

  { id: "senior_photo_album", minAge: 60, maxAge: 110,
    text: "Your {childRole} {child} finds the old photo album in the attic. Every single page has a story on it.",
    choices: [
      { label: "Tell the stories behind them",
        outcomes: [
          { text: "You told {child} about every photo, from the wobbly bicycle to the very big hat.", effects: { joy: 4, bond: 5 } }
        ] },
      { label: "Let {child} pick a favorite",
        outcomes: [
          { text: "{child} picked a photo of you dancing at a sock hop, and now it lives on the fridge.", effects: { joy: 3, bond: 3 } }
        ] },
      { label: "Put the album back for later",
        outcomes: [
          { text: "The album went back on the shelf, and you had a sweet dream about the good old days.", effects: { joy: 1 } }
        ] }
    ] },

  { id: "senior_yoga_class", minAge: 60, maxAge: 105,
    text: "The morning yoga class in the park is about to start. The instructor promises that absolutely anyone can do it.",
    outcomes: [
      { weight: 3, text: "You balanced in tree pose like a heron, and the instructor gave you a big thumbs up.", effects: { health: 3, joy: 2 } },
      { weight: 2, text: "Your downward dog looked more like a sleepy dog. It still counts, says the instructor.", effects: { health: 2, joy: 2 } },
      { weight: 1, text: "You fell asleep during the final rest pose. The instructor said that was the whole point.", effects: { health: 2, joy: 1 } }
    ] },

  { id: "senior_crossword_contest", minAge: 60, maxAge: 110,
    text: "The local newspaper is hosting a crossword contest. The winner gets a trophy and a whole year of free muffins.",
    choices: [
      { label: "Enter the crossword contest",
        outcomes: [
          { weight: 3, text: "You solved the puzzle in record time, and the judges agreed it was the cleverest one yet.", effects: { smarts: 5, joy: 3, fame: 1 } },
          { weight: 1, text: "You got stuck on the last clue and asked a child for help. The child was very helpful.", effects: { smarts: 2, kindness: 2 } }
        ] },
      { label: "Help the other contestants",
        outcomes: [
          { text: "You shared your favorite pen and whispered a few hints. Everyone smiled at you.", effects: { kindness: 4, joy: 2 } }
        ] }
    ] },

  { id: "senior_bake_off", minAge: 60, maxAge: 110,
    text: "The community bake-off is this Saturday. The theme is pies, and there is a blue ribbon at stake.",
    choices: [
      { label: "Enter your apple pie",
        outcomes: [
          { weight: 2, text: "Your apple pie won the blue ribbon. The judges said it tasted like a warm hug.", effects: { skills: { cooking: 6 }, joy: 5, fame: 1 } },
          { weight: 2, text: "Your pie came in third, and two judges asked for the recipe. Some people are jealous.", effects: { skills: { cooking: 3 }, joy: 2 } }
        ] },
      { label: "Bring a batch of cookies",
        outcomes: [
          { text: "You baked cookies for the whole crowd. They vanished in about four minutes.", effects: { kindness: 4, joy: 3 } }
        ] }
    ] },

  { id: "senior_lost_glasses", minAge: 60, maxAge: 110,
    text: "You search the whole house for your glasses. They were on top of your head the entire time.",
    effects: { joy: 2 } },

  { id: "senior_piano_lesson", minAge: 60, maxAge: 105,
    text: "Your {childRole} {child} asks you to show them the old piano in the living room.",
    choices: [
      { label: "Teach {child} a simple song",
        outcomes: [
          { weight: 3, text: "You taught {child} a simple tune, and they played it proudly for the whole family.", effects: { skills: { music: 5 }, joy: 4, bond: 4 } },
          { weight: 1, text: "{child} played the song with only three wrong notes. You were very impressed.", effects: { skills: { music: 2 }, joy: 2, bond: 2 } }
        ] },
      { label: "Let them plink on the keys",
        outcomes: [
          { text: "{child} plinked every key and called it a symphony. You agreed completely.", effects: { joy: 4, kindness: 2 } }
        ] }
    ] },

  { id: "senior_town_parade", minAge: 60, maxAge: 105,
    text: "The town parade is rolling down Main Street, and you have been asked to wave from the front float.",
    outcomes: [
      { weight: 3, text: "The crowd waved back at you all the way down the street. Your arm was tired, but your heart was full.", effects: { joy: 5, fame: 1 } },
      { weight: 1, text: "A pigeon landed on your hat mid-wave. The crowd cheered for the pigeon, too.", effects: { joy: 3 } }
    ] },

  { id: "senior_hearing_aids", minAge: 60, maxAge: 110,
    text: "Your new hearing aids pick up every single bird in the yard. Their chatter is wonderful.",
    effects: { joy: 3 } },

  { id: "senior_museum_day", minAge: 60, maxAge: 105,
    text: "The art museum has a free day for seniors, so you plan to spend the whole afternoon wandering the halls.",
    outcomes: [
      { weight: 2, text: "You stared at a painting of a cheese for twenty minutes. It was the most delicious painting you have ever seen.", effects: { smarts: 2, joy: 3, skills: { art: 2 } } },
      { weight: 2, text: "You sketched a sculpture on the back of the museum map. The guard gave you a friendly wink.", effects: { skills: { art: 3 }, joy: 2 } },
      { weight: 1, text: "You fell asleep on a cushy bench. The museum staff say it is now part of a new art installation.", effects: { joy: 2 } }
    ] },

  { id: "senior_thrift_treasure", minAge: 60, maxAge: 105,
    text: "The thrift shop has a box marked \"Mystery Stuff.\" You rummage through it with great hope.",
    outcomes: [
      { weight: 2, text: "You found a vintage record player in perfect shape and sold it to a music fan for $60.", effects: { money: 60, joy: 3 } },
      { weight: 2, text: "You found a sweater with a llama on it. It is now your favorite thing in the whole world.", effects: { style: 2, joy: 3 } },
      { weight: 1, text: "You found a box of forty shiny beads. Honestly, that is treasure too.", effects: { joy: 2, smarts: 1 } }
    ] },

  { id: "senior_brunch_with_friend", minAge: 60, maxAge: 105,
    text: "{friend} invites you to a Sunday brunch with fluffy pancakes. Your calendar is wide open.",
    choices: [
      { label: "Say yes and bring homemade jam",
        outcomes: [
          { weight: 3, text: "You brought homemade jam, and {friend} declared it the finest jam in the county.", effects: { joy: 4, bond: 4, skills: { cooking: 2 } } },
          { weight: 1, text: "You brought the jam, but the pancakes were already gone. Still a wonderful morning.", effects: { joy: 2, bond: 2 } }
        ] },
      { label: "Suggest a walk afterward",
        outcomes: [
          { text: "After brunch you strolled around the park, watching the ducks and chatting happily.", effects: { health: 2, bond: 3 } }
        ] },
      { label: "Say you are busy this time",
        outcomes: [
          { text: "You spent the afternoon in your favorite chair with a good book. Peaceful and pleasant.", effects: { joy: 1, smarts: 1 } }
        ] }
    ] }
]);
