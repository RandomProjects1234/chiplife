// js/content/events_prison.js
CL.add("events", [
  { id: "prison_quirky_cellmate", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "Your new cellmate, Ray, knits tiny hats for every pigeon in the yard. He asks what you like to do.",
    choices: [
      { label: "Ask Ray to teach you",
        outcomes: [
          { weight: 3, text: "Ray taught you the basics of knitting. Your first scarf is lumpy and very proud of itself.", effects: { skills: { art: 4 }, joy: 3, kindness: 1 } },
          { weight: 1, text: "You dropped every stitch in the first row. Ray says every master has a dropped-stitch story.", effects: { joy: 2 } }
        ] },
      { label: "Tell Ray about your hobbies",
        outcomes: [
          { text: "You shared stories about your favorite hobbies, and Ray laughed at all the right parts.", effects: { joy: 3, kindness: 2 } }
        ] },
      { label: "Read quietly in your bunk",
        outcomes: [
          { text: "You read a mystery while Ray hummed show tunes. Peaceful, if a little bit noisy.", effects: { smarts: 2 } }
        ] }
    ] },

  { id: "prison_library_visit", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The prison library just received a shelf of atlases, cookbooks, and adventure novels. The librarian waves you over.",
    choices: [
      { label: "Borrow an atlas",
        outcomes: [
          { text: "You traced routes across every continent. Now you can name all of the world's oceans in order.", effects: { smarts: 4 } }
        ] },
      { label: "Start a reading club",
        outcomes: [
          { weight: 2, text: "Six people showed up, including {newFriend}, who insisted the mystery novel had a brilliant twist.", effects: { smarts: 2, kindness: 3, newFriend: true } },
          { weight: 1, text: "Only two people came, but they stayed until the librarian switched off the lamp. Great chat.", effects: { smarts: 2, joy: 2 } }
        ] }
    ] },

  { id: "prison_cooking_class", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The kitchen program is offering a class on baking bread from scratch. There is flour everywhere, and the instructor is cheerful.",
    choices: [
      { label: "Sign up for the bread class",
        outcomes: [
          { weight: 3, text: "Your loaf rose so high that the instructor declared it a small miracle.", effects: { skills: { cooking: 5 }, joy: 4 } },
          { weight: 1, text: "Your loaf came out as flat as a pancake, but it made excellent toast.", effects: { skills: { cooking: 2 }, joy: 2 } }
        ] },
      { label: "Volunteer to taste-test",
        outcomes: [
          { text: "You tasted every batch and gave honest reviews. The bakers beamed at you all afternoon.", effects: { joy: 3, kindness: 2 } }
        ] }
    ] },

  { id: "prison_art_program", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The art program has a box of colored pencils, a stack of blank paper, and a teacher with paint on both elbows.",
    choices: [
      { label: "Paint a big mural",
        outcomes: [
          { weight: 2, text: "Your mural of a sunny beach covers a whole wall now. People stop to smile at it every day.", effects: { skills: { art: 6 }, joy: 4, fame: 1 } },
          { weight: 1, text: "The mural turned out looking a lot like a giant banana. The banana is very happy about it.", effects: { skills: { art: 3 }, joy: 3 } }
        ] },
      { label: "Draw the teacher as a hero",
        outcomes: [
          { text: "You drew the teacher as a superhero with a very large umbrella. They hung it up proudly.", effects: { skills: { art: 3 }, kindness: 2 } }
        ] },
      { label: "Sketch birds from the window",
        outcomes: [
          { text: "You sketched birds from the window all afternoon. The pigeons posed beautifully.", effects: { skills: { art: 2 }, joy: 2 } }
        ] }
    ] },

  { id: "prison_talent_show", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The monthly talent show is coming up. Someone already signed up to yodel, which sets the standard very high.",
    choices: [
      { label: "Perform a comedy routine",
        outcomes: [
          { weight: 2, text: "Your jokes about pudding cups had the whole room roaring. You are the new crowd favorite.", effects: { joy: 6, fame: 2, skills: { acting: 3 } } },
          { weight: 1, text: "One joke landed on the wrong word, but the crowd still clapped loudly.", effects: { joy: 2, skills: { acting: 1 } } }
        ] },
      { label: "Play a tune on the harmonica",
        outcomes: [
          { text: "Your harmonica solo was short but sweet. Even the yodeler clapped along.", effects: { skills: { music: 4 }, joy: 3 } }
        ] },
      { label: "Cheer loudly for every act",
        outcomes: [
          { text: "You cheered for every single act, including the three-minute yodel. The performers were thrilled.", effects: { kindness: 4, joy: 2 } }
        ] }
    ] },

  { id: "prison_garden_program", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The garden program is growing cucumbers, pumpkins, and one tomato plant that refuses to stop climbing.",
    outcomes: [
      { weight: 3, text: "Your pumpkin grew so big it won the yard's blue ribbon. Folks now call you the Pumpkin Boss.", effects: { joy: 5, kindness: 2 } },
      { weight: 2, text: "You picked a basket of cucumbers and shared them with everyone on your block.", effects: { joy: 3, kindness: 3 } },
      { weight: 1, text: "The tomato plant wrapped itself around the fence. The gardeners named it Steve.", effects: { joy: 2 } }
    ] },

  { id: "prison_letter_mom", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A letter from {mom} arrives with a drawing of the family dog in a party hat. It says: We miss you!",
    choices: [
      { label: "Write back right away",
        outcomes: [
          { text: "You wrote three pages about your favorite memories. {mom} wrote back within a week, smiling on every line.", effects: { joy: 5, bond: 5 } }
        ] },
      { label: "Keep the letter for later",
        outcomes: [
          { text: "You tucked the letter under your pillow, and it made the whole night feel a little warmer.", effects: { joy: 3, bond: 2 } }
        ] }
    ] },

  { id: "prison_letter_friend", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A letter from {friend} has a photo of their cat wearing tiny sunglasses. Bold fashion for a cat.",
    choices: [
      { label: "Write a long reply",
        outcomes: [
          { weight: 3, text: "Your reply was four pages long and included three jokes about pigeons. {friend} laughed out loud.", effects: { joy: 4, bond: 4, smarts: 1 } },
          { weight: 1, text: "You forgot to answer one question, but {friend} sent a second letter anyway.", effects: { joy: 2, bond: 3 } }
        ] },
      { label: "Send a joke back",
        outcomes: [
          { text: "Your joke was about a sandwich that wanted to be a pizza. {friend} says it is the best one yet.", effects: { joy: 3, bond: 3 } }
        ] }
    ] },

  { id: "prison_yard_games", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "It is yard games day! The options include checkers, four-square, and a jump rope contest that is extremely serious.",
    outcomes: [
      { weight: 3, text: "You won a round of checkers and celebrated with a happy dance that nobody requested.", effects: { joy: 4, health: 2 } },
      { weight: 2, text: "You jumped rope for twenty minutes straight. The judge awarded you a golden whistle.", effects: { health: 4, joy: 3 } },
      { weight: 1, text: "You lost at four-square, but you cheered louder than anyone for the winner.", effects: { kindness: 3, joy: 1 } }
    ] },

  { id: "prison_kitchen_job", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The kitchen crew needs help with lunch. The job pays a small wage and comes with a bonus pudding cup.",
    choices: [
      { label: "Take the kitchen job",
        outcomes: [
          { weight: 2, text: "You stirred, chopped, and served lunch with a smile. The cook gave you a pat on the back and your pudding cup.", effects: { money: 80, skills: { cooking: 3 }, kindness: 1 } },
          { weight: 1, text: "A little soup splashed onto your shoes. You mopped it up, and the crew laughed kindly.", effects: { money: 40, joy: 1 } }
        ] },
      { label: "Ask for a quieter shift",
        outcomes: [
          { text: "You landed a quiet afternoon shift helping in the library. Peace, paper, and a good cup of tea.", effects: { joy: 2, smarts: 2 } }
        ] }
    ] },

  { id: "prison_study_class", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A study class is starting for the high school equivalency exam. The teacher says it is never too late to learn.",
    choices: [
      { label: "Sign up for the class",
        outcomes: [
          { weight: 3, text: "You studied every evening, and your practice test score climbed all month long.", effects: { smarts: 6, joy: 2 } },
          { weight: 1, text: "You aced the first quiz and then dozed off during the second. Still a strong start.", effects: { smarts: 3 } }
        ] },
      { label: "Study alone in the library",
        outcomes: [
          { text: "You read through the whole workbook. The librarian left a bookmark with a smiley face on it.", effects: { smarts: 3, joy: 1 } }
        ] },
      { label: "Take a short nap instead",
        outcomes: [
          { text: "You napped, dreamed about algebra, and woke up feeling surprisingly rested.", effects: { health: 2 } }
        ] }
    ] },

  { id: "prison_chess_tournament", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The chess tournament has started. The winner takes home a trophy made entirely out of spoons.",
    choices: [
      { label: "Enter the tournament",
        outcomes: [
          { weight: 2, text: "You checkmated the favorite. The spoon trophy is yours, and it is surprisingly shiny.", effects: { smarts: 5, joy: 4, fame: 1 } },
          { weight: 1, text: "You lost in round two, but your opponent showed you a brilliant move you will never forget.", effects: { smarts: 3, kindness: 1 } }
        ] },
      { label: "Coach a beginner instead",
        outcomes: [
          { text: "You taught {newFriend} how the knight moves. They grinned from ear to ear and asked for a rematch.", effects: { kindness: 4, joy: 2, newFriend: true } }
        ] }
    ] },

  { id: "prison_guard_jokes", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A guard has been telling jokes so terrible that even the pigeons outside look confused. He is waiting for your reaction.",
    choices: [
      { label: "Groan loudly",
        outcomes: [
          { weight: 2, text: "You groaned so dramatically that the whole block joined in. Everyone felt a little better.", effects: { joy: 4, kindness: 1 } },
          { weight: 1, text: "The guard took a bow, and the joke was even worse the second time.", effects: { joy: 2 } }
        ] },
      { label: "Tell a joke back",
        outcomes: [
          { text: "Your joke was terrible too, but the guard laughed so hard he needed a tissue.", effects: { joy: 4, fame: 1 } }
        ] },
      { label: "Ask for his whole joke book",
        outcomes: [
          { text: "The guard handed over a notebook of jokes. You have now read every single one. Brave.", effects: { smarts: 2, joy: 2 } }
        ] }
    ] },

  { id: "prison_missing_pudding", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "Twelve pudding cups have vanished from the storage closet. Staff are asking everyone if they have seen them.",
    choices: [
      { label: "Help search for the cups",
        outcomes: [
          { weight: 2, text: "You searched every shelf and found the cups in a laundry bin. The cook had simply miscounted.", effects: { kindness: 3, notoriety: -3 } },
          { weight: 1, text: "You found three cups behind a box of rice. The cook promised a pudding party to celebrate.", effects: { kindness: 2, notoriety: -1 } }
        ] },
      { label: "Offer to count the cups",
        outcomes: [
          { text: "You counted every shelf twice. Your numbers were tidy, and the books balanced by lunch.", effects: { smarts: 3, notoriety: -2 } }
        ] },
      { label: "Keep quiet about the pudding",
        outcomes: [
          { text: "Nobody else noticed the missing cups. You felt a little guilty all afternoon.", effects: { notoriety: 4, joy: -2 } }
        ] }
    ] },

  { id: "prison_nervous_newcomer", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A nervous new inmate sits alone at lunch, clutching a teddy bear. They look like they could use a friendly face.",
    choices: [
      { label: "Sit down and say hello",
        outcomes: [
          { weight: 3, text: "You shared your pudding cup, and {newFriend} smiled for the first time all day.", effects: { kindness: 5, joy: 3, newFriend: true } },
          { weight: 1, text: "They mumbled a quiet thank you, but at least they were not sitting alone anymore.", effects: { kindness: 3, joy: 1 } }
        ] },
      { label: "Save them a seat in the yard",
        outcomes: [
          { text: "You reserved a bench in the yard for your new neighbor. They waved hello the next morning.", effects: { kindness: 4, joy: 2 } }
        ] },
      { label: "Wait for them to settle",
        outcomes: [
          { text: "They stayed quiet for a week. Then they asked where the library was, and you walked them there.", effects: { kindness: 2, smarts: 1 } }
        ] }
    ] },

  { id: "prison_fitness_class", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The morning fitness class in the yard starts with stretching and ends with a dance party. Everyone is invited.",
    outcomes: [
      { weight: 3, text: "You stretched, marched, and spun until your legs said enough. You feel great and a little silly.", effects: { health: 4, joy: 3 } },
      { weight: 2, text: "Your dance moves had people laughing in the best possible way. You are the class favorite now.", effects: { health: 2, joy: 4, style: 1 } },
      { weight: 1, text: "The instructor counted to eight so fast that you lost track. The next round went much better.", effects: { health: 2 } }
    ] },

  { id: "prison_debate_club", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The debate club is arguing about whether a hot dog counts as a sandwich. The room is already split down the middle.",
    choices: [
      { label: "Argue that it is a sandwich",
        outcomes: [
          { weight: 2, text: "Your speech about bread and filling won over the room. Even the librarian nodded slowly.", effects: { smarts: 4, joy: 3, fame: 1 } },
          { weight: 1, text: "You got tangled in your own argument, but everyone laughed until the bell rang.", effects: { smarts: 2, joy: 2 } }
        ] },
      { label: "Argue that it is not",
        outcomes: [
          { text: "You made a sharp point about buns, and the debate ended in a friendly tie.", effects: { smarts: 3, kindness: 1 } }
        ] }
    ] },

  { id: "prison_pen_pal", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The mail program matched you with a volunteer pen pal from another city. Their first letter is full of questions.",
    outcomes: [
      { weight: 3, text: "Your pen pal, {newFriend}, writes every other week and always asks what you are reading.", effects: { newFriend: true, joy: 4, kindness: 2 } },
      { weight: 1, text: "Their first letter arrived with a pressed flower and a joke about cheese. Excellent start.", effects: { joy: 3 } }
    ] },

  { id: "prison_music_class", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The music room has an old guitar with four strings and a teacher who believes in you. Want to give it a try?",
    choices: [
      { label: "Learn three easy chords",
        outcomes: [
          { weight: 3, text: "Three chords turned into your very first song. Your fingertips were sore, but the song was catchy.", effects: { skills: { music: 5 }, joy: 3 } },
          { weight: 1, text: "You played one chord beautifully, then tangled the other two. Progress is progress.", effects: { skills: { music: 2 }, joy: 1 } }
        ] },
      { label: "Play a cheerful tune for everyone",
        outcomes: [
          { text: "Your cheerful tune had the whole room tapping their feet. Someone asked for an encore.", effects: { joy: 5, kindness: 2 } }
        ] }
    ] },

  { id: "prison_writing_workshop", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The writing workshop assignment is a short story about second chances. The teacher hands you a fresh notebook.",
    choices: [
      { label: "Write about starting over",
        outcomes: [
          { weight: 3, text: "Your story about a bakery that reopens after a storm made the teacher smile and read it twice.", effects: { skills: { writing: 5 }, joy: 4, kindness: 1 } },
          { weight: 1, text: "Your story ran three pages over the limit, but the teacher said every page was worth it.", effects: { skills: { writing: 3 }, joy: 2 } }
        ] },
      { label: "Write about a talking sandwich",
        outcomes: [
          { text: "The talking sandwich dreamed of becoming a famous chef. The class voted it their favorite story.", effects: { skills: { writing: 2 }, joy: 4 } }
        ] }
    ] },

  { id: "prison_board_game_night", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "Board game night is in the community room. The checkers set is missing a few pieces, so bottle caps are in charge.",
    outcomes: [
      { weight: 3, text: "Your team won by using a bottle cap as the king. Everyone cheered and demanded a rematch.", effects: { joy: 4, smarts: 2 } },
      { weight: 2, text: "The game ended in a tie, and everyone agreed the bottle caps were the real stars.", effects: { joy: 3, kindness: 1 } },
      { weight: 1, text: "You knocked over the board while celebrating. Nobody minded, and the caps turned up under the couch.", effects: { joy: 2 } }
    ] },

  { id: "prison_book_donation", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A volunteer group delivers a box of donated books to the prison library. The box is taller than you are.",
    outcomes: [
      { weight: 3, text: "You found a dictionary, three mysteries, and a cookbook with cartoon ducks. A perfect haul.", effects: { smarts: 3, joy: 3 } },
      { weight: 2, text: "You discovered a book about birds and started a bird-spotting journal right away.", effects: { smarts: 2, joy: 2 } },
      { weight: 1, text: "A book on knitting had a note tucked inside from a previous reader: You can do this!", effects: { skills: { art: 2 }, joy: 2 } }
    ] },

  { id: "prison_birthday_cake", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "It is your birthday, and the kitchen crew has baked a cake shaped like a very confident pigeon.",
    outcomes: [
      { weight: 3, text: "Everyone in the block sang a silly song, and you got the biggest slice of the pigeon.", effects: { joy: 6, kindness: 2 } },
      { weight: 1, text: "The cake leaned sideways, but it tasted incredible. The pigeon was forgiven.", effects: { joy: 3 } }
    ] },

  { id: "prison_reading_certificate", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The librarian is handing out certificates for the reading challenge. Your name is near the top of the list!",
    outcomes: [
      { weight: 3, text: "You read twenty books this year. Your certificate is now framed by the library door.", effects: { smarts: 5, joy: 3 } },
      { weight: 1, text: "You read nineteen books, which the librarian says is a very respectable number.", effects: { smarts: 3, joy: 2 } }
    ] },

  { id: "prison_sewing_class", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The sewing class is mending old shirts with sparkly thread. The teacher says every stitch matters.",
    outcomes: [
      { weight: 3, text: "You mended a torn sleeve so neatly that nobody could find the patch. Your stitches are tiny and proud.", effects: { skills: { art: 3 }, style: 2, joy: 2 } },
      { weight: 1, text: "Your sparkly stitches went a little wild, but the shirt now looks dazzling.", effects: { style: 3, joy: 2 } }
    ] },

  { id: "prison_mentor_offer", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "A kind volunteer offers to help you plan your next steps. Mentoring is open to anyone who wants a fresh start.",
    choices: [
      { label: "Accept the mentorship",
        outcomes: [
          { weight: 3, text: "You made a plan with clear goals and a calendar. The mentor believes in your next chapter.", effects: { smarts: 4, notoriety: -4, joy: 3 } },
          { weight: 1, text: "The first meeting ran long, but you walked away with a notebook full of ideas.", effects: { smarts: 3, notoriety: -2 } }
        ] },
      { label: "Thank them and plan alone",
        outcomes: [
          { text: "You wrote your own plan on the back of an old letter. It is short, sensible, and hopeful.", effects: { smarts: 2, joy: 2 } }
        ] }
    ] },

  { id: "prison_poetry_homework", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "Your homework is a poem about the first warm day of spring. You write about the pigeons out in the yard.",
    effects: { skills: { writing: 2 }, joy: 2 } },

  { id: "prison_test_results", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "Your practice test results arrive in an envelope. The teacher is grinning before you even open it.",
    outcomes: [
      { weight: 2, text: "You scored higher than last time, and the whole class cheered like a sports crowd.", effects: { smarts: 4, joy: 4 } },
      { weight: 1, text: "The score went up by just a little, but the teacher says small steps add up.", effects: { smarts: 2, joy: 2 } }
    ] },

  { id: "prison_origami_contest", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "The art room is hosting an origami contest. Paper cranes are the favorite, but someone is attempting a dragon.",
    choices: [
      { label: "Fold a paper crane",
        outcomes: [
          { weight: 2, text: "Your crane was perfectly symmetrical, and the judges placed it proudly on the windowsill.", effects: { skills: { art: 4 }, joy: 3 } },
          { weight: 1, text: "Your crane looked more like a duck, and the judges cheered for the duck anyway.", effects: { skills: { art: 2 }, joy: 2 } }
        ] },
      { label: "Attempt the ambitious dragon",
        outcomes: [
          { text: "The dragon had far too many wings, but the judges applauded your bravery.", effects: { skills: { art: 2 }, joy: 2, fame: 1 } }
        ] }
    ] },

  { id: "prison_quiet_hour", minAge: 18, maxAge: 100, needs: ["prison"],
    text: "Quiet hour after dinner. You open a book, listen to the rain on the window, and feel a little hopeful.",
    effects: { joy: 2, smarts: 1 } }
]);
