// js/content/events_kids_2.js
// Kids at school (ages 5-12): classroom, playground and school-life moments.
CL.add("events", [
  { id: "kid_spelling_bee", minAge: 6, maxAge: 12, needs: ["school"],
    text: "The class spelling bee starts this morning at {school}. The last word on the list is a tricky one: rhythm.",
    choices: [
      { label: "Study the word list every night", outcomes: [
        { weight: 3, favor: "smarts", text: "You spelled every word right and took home a shiny ribbon. Your teacher gave you a gold star.", effects: { grades: 4, joy: 4 } },
        { weight: 1, text: "You missed one word by a single letter, but you still felt proud of how far you had come.", effects: { grades: 2, joy: 2 } } ] },
      { label: "Wing it with a big smile", outcomes: [
        { text: "You spelled every word with a confident wiggle. A few were wrong, but the crowd cheered anyway.", effects: { grades: -2, joy: 3 } } ] }
    ] },

  { id: "kid_science_fair", minAge: 7, maxAge: 12, needs: ["school"],
    text: "Your science fair volcano is ready. The baking soda is in place, and the judges are walking your way.",
    choices: [
      { label: "Add extra vinegar for a big fizz", outcomes: [
        { weight: 3, favor: "smarts", text: "Your volcano fizzed over the sides in a glorious foam. The judges wrote impressive! on their clipboards.", effects: { grades: 5, joy: 4 } },
        { weight: 1, text: "Too much vinegar! The foam poured across the table, and the paper towels got very busy.", effects: { grades: 1, joy: 2 } } ] },
      { label: "Stick carefully to the recipe", outcomes: [
        { text: "Your volcano bubbled up just right. The judges nodded and asked how you measured so carefully.", effects: { grades: 3, smarts: 2 } } ] }
    ] },

  { id: "kid_field_trip", minAge: 5, maxAge: 12, needs: ["school"],
    text: "Your class field trip is to the farm just outside {city}. The bus is full of excited chatter!",
    choices: [
      { label: "Ask the farmer lots of questions", outcomes: [
        { weight: 2, favor: "smarts", text: "You asked about cows, carrots, and tractors. The farmer said you were the most curious visitor all year.", effects: { grades: 3, smarts: 2 } },
        { weight: 1, text: "You asked so many questions that the farmer ran out of answers and had to laugh.", effects: { grades: 2, joy: 2 } } ] },
      { label: "Stay close to the baby goats", outcomes: [
        { text: "A baby goat took a liking to your shoelace and followed you around the barn all afternoon.", effects: { joy: 5, kindness: 2 } } ] }
    ] },

  { id: "kid_show_and_tell", minAge: 5, maxAge: 9, needs: ["school"],
    text: "It is show-and-tell day! You brought in your collection of shiny rocks, and everyone is watching.",
    choices: [
      { label: "Tell a fun fact about each rock", outcomes: [
        { weight: 3, favor: "smarts", text: "You explained that some rocks sparkle because of tiny crystals. The whole class asked for a rock next.", effects: { grades: 3, smarts: 2, joy: 3 } },
        { weight: 1, text: "You told the story of your favorite rock so well that {classmate} wanted to start collecting too.", effects: { joy: 3, grades: 1 } } ] },
      { label: "Make everyone guess your favorite rock", outcomes: [
        { text: "Nobody guessed the rock, but everyone enjoyed the mystery. Your classmates clapped for your storytelling.", effects: { joy: 4, skills: { acting: 1 } } } ] }
    ] },

  { id: "kid_class_pet_weekend", minAge: 5, maxAge: 10, needs: ["school"],
    text: "The class hamster is coming home with you for the weekend. You are in charge of its wheel and its cozy bedding.",
    choices: [
      { label: "Build a fancy hamster maze", outcomes: [
        { weight: 2, text: "The hamster zoomed through your cardboard maze, then napped inside the tunnel. A huge success!", effects: { joy: 4, kindness: 3 } },
        { weight: 1, text: "The maze collapsed, but the hamster thought the pile of boxes was a brand new playground.", effects: { joy: 3 } } ] },
      { label: "Let the hamster rest and snooze", outcomes: [
        { text: "You sat quietly beside the snoozing hamster and wrote a short story about its adventures. Calm and cozy!", effects: { smarts: 2, joy: 2, skills: { writing: 2 } } } ] }
    ] },

  { id: "kid_report_card", minAge: 6, maxAge: 12, needs: ["school"],
    text: "Report cards came home today in a sealed envelope. Your heart flutters a little as you pick it up.",
    choices: [
      { label: "Open the envelope right away", outcomes: [
        { weight: 3, text: "Mostly A's, with one proud B-plus! {mom} clapped so loudly that the neighbors heard.", effects: { grades: 6, joy: 5 } },
        { weight: 1, text: "A few marks were lower than you hoped. {dad} gave you a big hug and a plan to practice.", effects: { grades: -2, joy: 2 } } ] },
      { label: "Ask a grown-up to open it", outcomes: [
        { text: "You opened it together, cheered over the good marks, and made a plan for the rest.", effects: { grades: 3, joy: 3, kindness: 1 } } ] }
    ] },

  { id: "kid_lunch_trade", minAge: 6, maxAge: 12, needs: ["school"],
    text: "At lunch, {classmate} offers to trade a chocolate chip cookie for your apple slices. What do you do?",
    choices: [
      { label: "Accept the cookie trade", outcomes: [
        { weight: 2, text: "The cookie was warm and wonderful, and your apple slices made {classmate} smile.", effects: { joy: 4, kindness: 2 } },
        { weight: 1, text: "The cookie was a little crumbly, but you shared a laugh about it all the way to recess.", effects: { joy: 2 } } ] },
      { label: "Keep your apples and share a grin", outcomes: [
        { text: "You politely kept your apples and gave {classmate} a big grin. It turned out they liked apples too!", effects: { kindness: 3 } } ] }
    ] },

  { id: "kid_recess_freeze_tag", minAge: 6, maxAge: 12, needs: ["school"],
    text: "At recess, the bigger kids are playing freeze tag on the blacktop. There is room for one more player!",
    choices: [
      { label: "Join the freeze tag game", outcomes: [
        { weight: 2, favor: "sports", text: "You dashed so fast that nobody could tag you. Everyone named you captain for the day!", effects: { health: 3, joy: 5, skills: { sports: 3 } } },
        { weight: 1, text: "You froze in a wiggly pose, and everyone laughed. Freeze tag can be tricky!", effects: { joy: 3 } } ] },
      { label: "Start a jump rope contest", outcomes: [
        { text: "Your jump rope contest drew a crowd of cheerful helpers. You counted jumps all recess long.", effects: { health: 2, joy: 3, skills: { sports: 1 } } } ] }
    ] },

  { id: "kid_school_play", minAge: 8, maxAge: 12, once: true, needs: ["school"],
    text: "The school play auditions are today! The director asks you to read one line in your very best voice.",
    choices: [
      { label: "Read with big dramatic gestures", outcomes: [
        { weight: 3, favor: "acting", text: "The whole class clapped, and the director said you have a natural spark for the stage.", effects: { joy: 5, skills: { acting: 4 } } },
        { weight: 1, text: "You forgot your line, so you made up a silly one instead. The room roared with laughter!", effects: { joy: 3, skills: { acting: 1 } } } ] },
      { label: "Read quietly and calmly", outcomes: [
        { text: "Your calm voice made the line sound thoughtful. The director wrote a note on their clipboard.", effects: { smarts: 2, joy: 2 } } ] }
    ] },

  { id: "kid_new_classmate", minAge: 5, maxAge: 12, needs: ["school"],
    text: "A new kid named {classmate} sits down next to you at lunch and looks a little nervous.",
    choices: [
      { label: "Offer to share your crayons", outcomes: [
        { weight: 2, text: "{classmate} smiled and drew a rainbow for you. You both agreed it was the best picture of the week.", effects: { kindness: 4, joy: 3 } },
        { weight: 1, text: "{classmate} used up all the green crayons, but you did not mind one bit.", effects: { kindness: 2, joy: 2 } } ] },
      { label: "Wave hello from across the table", outcomes: [
        { text: "{classmate} waved back shyly. Maybe tomorrow will be the start of something fun.", effects: { kindness: 1, joy: 1 } } ] }
    ] },

  { id: "kid_help_teacher", minAge: 6, maxAge: 12, needs: ["school"],
    text: "{teacher} needs one helper to carry a tall stack of library books back to the classroom.",
    choices: [
      { label: "Raise your hand and volunteer", outcomes: [
        { weight: 3, text: "You carried the books very carefully and earned a big thank-you and a sticker.", effects: { kindness: 4, joy: 3 } },
        { weight: 1, text: "The stack wobbled and a few books slid, but you caught every one. Quick reflexes!", effects: { kindness: 2, joy: 2 } } ] },
      { label: "Let someone else be the helper", outcomes: [
        { text: "Someone else raised their hand first. You felt a little sneaky, but nobody seemed to notice.", effects: { kindness: -2 } } ] }
    ] },

  { id: "kid_forgotten_homework", minAge: 6, maxAge: 12, needs: ["school"],
    text: "Uh oh! You forgot your math homework on the kitchen table at home. The bell is about to ring.",
    choices: [
      { label: "Tell {teacher} the honest truth", outcomes: [
        { weight: 2, text: "{teacher} smiled kindly and let you finish it at recess. Being honest earned you a bonus smile.", effects: { grades: 2, kindness: 2 } },
        { weight: 1, text: "{teacher} gave you a gentle reminder to pack your bag the night before. You promised to try harder.", effects: { grades: -1, kindness: 1 } } ] },
      { label: "Rush to finish it during recess", outcomes: [
        { weight: 2, favor: "smarts", text: "You finished just in time, although a few numbers wiggled. Good work anyway!", effects: { grades: 2, smarts: 1 } },
        { weight: 1, text: "The bell rang before you finished. Your grade took a small wobble.", effects: { grades: -3 } } ] }
    ] },

  { id: "kid_group_project", minAge: 8, maxAge: 12, needs: ["school"],
    text: "Your group project is a giant poster all about the solar system. {classmate} says they really want to paint Saturn.",
    choices: [
      { label: "Take charge and make a plan", outcomes: [
        { weight: 2, favor: "smarts", text: "You drew up a schedule, and the poster came together like a rocket. Everyone thanked you.", effects: { grades: 5, smarts: 2 } },
        { weight: 1, text: "The plan got a little messy, but the group laughed, fixed it, and finished on time.", effects: { grades: 2, kindness: 1 } } ] },
      { label: "Paint the planets in bright colors", outcomes: [
        { text: "Your planets were so colorful that the whole hallway stopped to admire them.", effects: { grades: 3, skills: { art: 2 } } } ] }
    ] },

  { id: "kid_sports_day", minAge: 6, maxAge: 12, needs: ["school"],
    text: "Sports day is finally here! The big event is the relay race, and your team is lined up at the starting line.",
    choices: [
      { label: "Sprint with all your might", outcomes: [
        { weight: 2, favor: "sports", text: "You crossed the finish line first! Your whole team cheered and handed you a ribbon.", effects: { health: 3, joy: 5, skills: { sports: 3 } } },
        { weight: 1, text: "You tripped over your own shoelaces but popped right back up. The crowd cheered for you anyway.", effects: { joy: 3, health: 1 } } ] },
      { label: "Cheer loudly for your teammates", outcomes: [
        { text: "Your team felt super supported, and everyone agreed your cheering was the loudest on the field.", effects: { kindness: 4, joy: 3 } } ] }
    ] },

  { id: "kid_art_contest", minAge: 6, maxAge: 12, needs: ["school"],
    text: "The school art contest has the theme Under the Sea. Your paint brushes are ready, and so is your imagination.",
    choices: [
      { label: "Paint a giant octopus", outcomes: [
        { weight: 3, favor: "art", text: "Your octopus earned a blue ribbon! Everyone said the tentacles looked so real.", effects: { grades: 3, skills: { art: 4 }, joy: 3 } },
        { weight: 1, text: "Paint dripped onto your shoes, but the octopus still looked fabulous.", effects: { joy: 2, skills: { art: 1 } } } ] },
      { label: "Make a sea turtle collage", outcomes: [
        { text: "You glued shells and sparkly paper into a turtle that looked ready to swim away.", effects: { skills: { art: 2 }, joy: 2 } } ] }
    ] },

  { id: "kid_library_challenge", minAge: 6, maxAge: 12, needs: ["school"],
    text: "The school library has a reading challenge: read ten books this month to earn a special bookmark.",
    choices: [
      { label: "Read a little every night", outcomes: [
        { weight: 3, favor: "smarts", text: "You read ten books and proudly chose a bookmark shaped like a fox. Your vocabulary grew.", effects: { grades: 4, smarts: 3, skills: { writing: 1 } } },
        { weight: 1, text: "You finished nine books, which is still a huge win. The librarian gave you a high five.", effects: { grades: 2, joy: 2 } } ] },
      { label: "Skip the challenge and play outside", outcomes: [
        { text: "You had a great time outside, but the bookmark stayed in the library. Sunshine is good too!", effects: { health: 3, joy: 3 } } ] }
    ] },

  { id: "kid_lost_lunchbox", minAge: 5, maxAge: 12, needs: ["school"],
    text: "Your lunchbox is missing! You search the cubbies, the hallway, and even under the jackets.",
    choices: [
      { label: "Ask {classmate} to help search", outcomes: [
        { weight: 2, text: "With two sets of eyes, you found it under a pile of coats. You shared a snack as a thank-you.", effects: { kindness: 3, joy: 3 } },
        { weight: 1, text: "It turned out {classmate} had been carrying it all along by mistake. Mystery solved!", effects: { joy: 2 } } ] },
      { label: "Search quietly on your own", outcomes: [
        { text: "You found the lunchbox tucked behind a bookshelf. The sandwich was squished, but still tasty.", effects: { smarts: 2, joy: 1 } } ] }
    ] },

  { id: "kid_pop_quiz", minAge: 7, maxAge: 12, needs: ["school"],
    text: "{teacher} announces a surprise pop quiz all about the planets. Your pencil is ready, but your brain feels foggy.",
    choices: [
      { label: "Take a deep breath and do your best", outcomes: [
        { weight: 3, favor: "smarts", text: "You remembered most of the planets, even the tricky one with rings. Great job!", effects: { grades: 4, smarts: 2 } },
        { weight: 1, text: "You knew most answers but guessed on the last one. The guess was surprisingly close!", effects: { grades: 1 } } ] },
      { label: "Whisper a question to a friend", outcomes: [
        { text: "{teacher} spotted the whispering and gave you a gentle reminder to focus on your own paper.", effects: { grades: -3 } } ] }
    ] },

  { id: "kid_school_bus_mixup", minAge: 5, maxAge: 12, needs: ["school"],
    text: "You sat in the wrong seat on the school bus and realized you had ridden two stops past home.",
    outcomes: [
      { weight: 2, text: "The driver helped you call home, and a friendly neighbor met you at the bus stop.", effects: { joy: 1 } },
      { weight: 1, text: "You sang silly songs with the other riders until the right stop finally arrived. What a fun ride!", effects: { joy: 4 } } ] },

  { id: "kid_chalk_mural", minAge: 5, maxAge: 12, needs: ["school"],
    text: "Your class is painting a chalk mural on the school playground. The teacher says every idea is welcome.",
    choices: [
      { label: "Sketch a giant friendly dragon", outcomes: [
        { weight: 2, favor: "art", text: "Your dragon had a big, goofy smile, and the younger kids asked to sit on its tail.", effects: { skills: { art: 3 }, joy: 3 } },
        { weight: 1, text: "A rainy drizzle washed some of it away, so everyone helped redraw the best parts.", effects: { kindness: 2, skills: { art: 1 } } } ] },
      { label: "Help paint the rainbow path", outcomes: [
        { text: "The rainbow path was bright and bold. You high-fived three friends for the perfect stripes.", effects: { joy: 3, kindness: 2 } } ] }
    ] },

  { id: "kid_school_garden", minAge: 6, maxAge: 12, needs: ["school"],
    text: "Your class gets its very own garden bed behind the school. Time to plant some seeds!",
    choices: [
      { label: "Plant sunflower seeds in neat rows", outcomes: [
        { weight: 2, favor: "smarts", text: "Three weeks later, the sunflowers stood taller than the fence. Your whole class cheered.", effects: { grades: 3, smarts: 2, joy: 3 } },
        { weight: 1, text: "A squirrel dug up one row, so you replanted it and left a snack for the squirrel.", effects: { smarts: 1, kindness: 2 } } ] },
      { label: "Scatter seeds everywhere for fun", outcomes: [
        { text: "The garden grew into a wild, mystery jungle. Nobody could name half the plants, but they were fun to watch.", effects: { joy: 3, smarts: 1 } } ] }
    ] },

  { id: "kid_talent_show", minAge: 7, maxAge: 12, needs: ["school"],
    text: "The school talent show is next week. You could sing, tell a joke, or juggle three socks.",
    choices: [
      { label: "Sing a silly song", outcomes: [
        { weight: 2, favor: "music", text: "The audience sang the chorus with you. You took a bow as the room filled with cheers.", effects: { joy: 5, skills: { music: 4 } } },
        { weight: 1, text: "You forgot the second verse, so you made up a new one. It was an instant hit!", effects: { joy: 3, skills: { music: 2 } } } ] },
      { label: "Tell a short joke", outcomes: [
        { text: "Your joke got a huge laugh, even from the principal. You felt like a comedian for the day.", effects: { joy: 4, skills: { acting: 2 } } } ] }
    ] },

  { id: "kid_picture_day", minAge: 5, maxAge: 12, needs: ["school"],
    text: "It is picture day! You are wearing your favorite shirt and a very hopeful smile.",
    outcomes: [
      { weight: 2, text: "The photographer caught you mid-giggle. Everyone said it was your best picture yet.", effects: { joy: 3, style: 3 } },
      { weight: 1, text: "One stubborn hair stood straight up for the photo. You grinned anyway, and it still looked great.", effects: { style: 1, joy: 2 } } ] },

  { id: "kid_class_newspaper", minAge: 8, maxAge: 12, needs: ["school"],
    text: "Your class is printing a newspaper, and the editor needs a writer for the big front-page story.",
    choices: [
      { label: "Write about the school hamster", outcomes: [
        { weight: 2, favor: "writing", text: "Your story made the front page! {teacher} read it aloud, and the whole class clapped.", effects: { skills: { writing: 4 }, grades: 3, joy: 3 } },
        { weight: 1, text: "Your story was short but sweet, and the editor said it needed one more paragraph.", effects: { skills: { writing: 1 }, grades: 1 } } ] },
      { label: "Interview the school librarian", outcomes: [
        { text: "The librarian shared favorite stories and tips for picking books. You took notes all afternoon.", effects: { skills: { writing: 2 }, kindness: 2 } } ] }
    ] },

  { id: "kid_math_puzzle_club", minAge: 8, maxAge: 12, needs: ["school"],
    text: "The school math puzzle club is looking for new members. The first challenge is a tricky riddle with numbers.",
    choices: [
      { label: "Join the puzzle club", outcomes: [
        { weight: 2, favor: "smarts", text: "You cracked the riddle in record time, and the club gave you a shiny badge.", effects: { grades: 4, smarts: 3 } },
        { weight: 1, text: "You got stuck halfway, but a teammate helped. Teamwork solved it!", effects: { grades: 2, kindness: 1 } } ] },
      { label: "Skip the club and draw cartoons", outcomes: [
        { text: "You filled a whole notebook with cartoon critters. Your sketches were wonderfully silly.", effects: { joy: 3, skills: { art: 2 } } } ] }
    ] }
]);
