// ChipLife teen events, part 1: high school (ages 13-18)
CL.add("events", [
  {
    id: "teen_hs_big_exam", minAge: 14, maxAge: 18, needs: ["school"], weight: 1.2,
    text: "The big final exam is tomorrow, and your notes are scattered like socks in a laundry basket. What now?",
    choices: [
      { label: "Cram all night with snacks",
        outcomes: [
          { weight: 2, text: "You crammed until dawn. The highlighter ink on your fingers became a permanent fashion statement.", effects: { grades: 6, health: -2 }, favor: "smarts" },
          { weight: 1, text: "You fell asleep at 2 a.m. with your face on page 212. The textbook was very comfortable.", effects: { grades: -4, health: -1 } }
        ] },
      { label: "Get a good night's sleep",
        outcomes: [
          { text: "You woke up refreshed, remembered most of the answers, and felt surprisingly calm.", effects: { grades: 4, joy: 3 } }
        ] },
      { label: "Ask {teacher} for tips",
        outcomes: [
          { text: "{teacher} shared a secret tip about the test. You aced the questions you were most worried about.", effects: { grades: 5, kindness: 1 } }
        ] }
    ]
  },
  {
    id: "teen_hs_pop_quiz", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Your teacher announces a pop quiz. Everyone groans in unison, and somebody's pencil rolls off the desk.",
    outcomes: [
      { weight: 3, text: "You remembered every answer. Your pencil stayed on the desk the entire time.", effects: { grades: 4 } },
      { weight: 2, text: "Two questions were about a chapter you skipped. You guessed boldly and earned half credit.", effects: { grades: 1 } },
      { weight: 1, text: "You drew a very detailed dragon in the margin instead of answering. Honest mistake.", effects: { grades: -3, joy: 2 } }
    ]
  },
  {
    id: "teen_hs_science_fair", minAge: 13, maxAge: 17, needs: ["school"],
    text: "The science fair is next week, and your volcano project is looking a little flat.",
    choices: [
      { label: "Add extra baking soda",
        outcomes: [
          { weight: 2, text: "It erupted so enthusiastically that the judges took three big steps back. Blue ribbon!", effects: { smarts: 3, joy: 4 } },
          { weight: 1, text: "Too much baking soda made it sputter and sigh. The judges were very polite about it.", effects: { joy: -2 } }
        ] },
      { label: "Read the instructions twice",
        outcomes: [
          { text: "The instructions were boring, but your experiment came out clean, tidy, and clever.", effects: { smarts: 4, grades: 3 }, favor: "smarts" }
        ] }
    ]
  },
  {
    id: "teen_hs_science_olympiad", minAge: 14, maxAge: 18, needs: ["school"],
    text: "The science olympiad team needs one more member. Your hand is already halfway up in the air.",
    choices: [
      { label: "Sign up for the team",
        outcomes: [
          { weight: 3, text: "You spent weekends racing through brain teasers. Your smarts grew with every answer.", effects: { smarts: 5, joy: 2 }, favor: "smarts" },
          { weight: 1, text: "Your team took home a bronze medal and a box of celebratory crackers.", effects: { smarts: 3, joy: 4 } }
        ] },
      { label: "Keep your weekends for napping",
        outcomes: [
          { text: "You spent Saturday under a cozy blanket with a book. Very restful, if not very scientific.", effects: { health: 2, joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_robotics_competition", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The robotics club needs one more builder for the big competition. Their robot is named Sir Wobbles.",
    choices: [
      { label: "Join the build team",
        outcomes: [
          { weight: 2, text: "Sir Wobbles rolled in a perfect circle. The judges clapped and the crowd went wild.", effects: { smarts: 4, joy: 4 }, favor: "smarts" },
          { weight: 1, text: "Sir Wobbles fell apart halfway through the course. The team stuck it back together with tape.", effects: { smarts: 2, joy: 2 } }
        ] },
      { label: "Cheer from the bleachers",
        outcomes: [
          { text: "You cheered so loudly that a teammate gave you a robot-shaped high five.", effects: { joy: 3, kindness: 1 } }
        ] }
    ]
  },
  {
    id: "teen_hs_sports_tryouts", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Basketball tryouts are on Monday. The coach's whistle is loud enough to wake up the whole gym.",
    choices: [
      { label: "Show up in your best sneakers",
        outcomes: [
          { weight: 2, text: "You made the team! Your new jersey smelled like victory and a little bit like gym socks.", effects: { skills: { sports: 6 }, joy: 4, health: 2 } },
          { weight: 1, text: "You didn't make the team, but the coach asked you to run the water bottle squad.", effects: { skills: { sports: 2 }, kindness: 2 } }
        ] },
      { label: "Spend the weekend reading",
        outcomes: [
          { text: "You read a mystery novel in a hammock and solved it before the final chapter.", effects: { joy: 3, smarts: 1 } }
        ] }
    ]
  },
  {
    id: "teen_hs_school_play", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The school play is looking for a talking pumpkin. Somebody has to deliver the lines with a straight face.",
    choices: [
      { label: "Audition for the pumpkin",
        outcomes: [
          { weight: 2, text: "You delivered the pumpkin's speech with such drama that the whole gym gasped.", effects: { skills: { acting: 6 }, joy: 4 }, favor: "acting" },
          { weight: 1, text: "You forgot a line, so the pumpkin improvised a chicken noise. The audience cheered for it.", effects: { skills: { acting: 3 }, joy: 3 } }
        ] },
      { label: "Paint the sets instead",
        outcomes: [
          { text: "You painted a castle so big it needed its own weather report. The crew cheered.", effects: { skills: { art: 4 }, kindness: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_band_tryouts", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The school band needs a trumpet player. The last person who tried out sneezed into the tuba.",
    choices: [
      { label: "Try out for trumpet",
        outcomes: [
          { weight: 2, text: "Your first note was a little squeaky, but by Friday you were the band's loudest star.", effects: { skills: { music: 6 }, joy: 3 } },
          { weight: 1, text: "The trumpet honked like a goose. Honest effort, though, and the goose was impressed.", effects: { skills: { music: 2 }, joy: 1 } }
        ] },
      { label: "Play the triangle instead",
        outcomes: [
          { text: "You hit the triangle at exactly the right moment, and the conductor gave you a proud nod.", effects: { skills: { music: 3 }, joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_yearbook_photo", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Yearbook photo day! Your hair has big plans of its own, and the photographer is counting to three.",
    choices: [
      { label: "Try a goofy pose",
        outcomes: [
          { weight: 2, text: "The photographer laughed so hard the photo became the yearbook's favorite.", effects: { joy: 4, style: 2 } },
          { weight: 1, text: "Your goofy pose came out a little too goofy. Your friends will never let it go.", effects: { joy: 2, fame: 1 } }
        ] },
      { label: "Smile politely",
        outcomes: [
          { text: "You looked calm, cool, and mildly surprised by the camera. A true classic.", effects: { style: 3 } }
        ] }
    ]
  },
  {
    id: "teen_hs_school_newspaper", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The school newspaper needs someone to write about the cafeteria's famous bean soup. Interested?",
    choices: [
      { label: "Write the article",
        outcomes: [
          { weight: 3, text: "Your article about the bean soup was so good the whole school asked for a second copy.", effects: { skills: { writing: 5 }, joy: 3 }, favor: "writing" },
          { weight: 1, text: "The editor said your headline needed more pizzazz. You took the feedback in stride.", effects: { skills: { writing: 2 } } }
        ] },
      { label: "Let someone else write it",
        outcomes: [
          { text: "Someone else wrote the article. It was fine. The bean soup remained a delicious mystery.", effects: { joy: -1 } }
        ] }
    ]
  },
  {
    id: "teen_hs_group_project", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Your group project partner, {classmate}, has vanished along with the poster board. The presentation is at nine.",
    choices: [
      { label: "Go looking for them",
        outcomes: [
          { text: "You found {classmate} in the library, hugging the poster board like a teddy bear.", effects: { grades: 4, kindness: 2 } }
        ] },
      { label: "Make the whole poster solo",
        outcomes: [
          { weight: 2, text: "You made a poster so bright that people could read it from the parking lot.", effects: { grades: 3, skills: { art: 3 } } },
          { weight: 1, text: "Your poster was wonderfully bold. {classmate} said it was 'a lot,' but in a nice way.", effects: { grades: 1, joy: 1 } }
        ] }
    ]
  },
  {
    id: "teen_hs_substitute_teacher", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Today's substitute is {teacher}, who asks everyone to call them Captain. The lesson plan has gone missing.",
    outcomes: [
      { weight: 3, text: "The class spent the period building paper airplanes. You learned more about wind than you expected.", effects: { smarts: 2, joy: 3 } },
      { weight: 2, text: "{teacher} lost the attendance sheet, then found it stuck to the ceiling fan. Nobody was marked absent.", effects: { joy: 2 } },
      { weight: 1, text: "You were given a surprise quiz about the substitute's favorite sandwich. It was oddly fun.", effects: { smarts: 1, joy: 1 } }
    ]
  },
  {
    id: "teen_hs_cafeteria_mystery", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The cafeteria is serving today's mystery meat. Nobody knows what it is, and nobody is asking.",
    outcomes: [
      { weight: 2, text: "You bravely took one bite. Your taste buds filed a very polite complaint.", effects: { joy: -1 } },
      { weight: 2, text: "You ordered a cheese sandwich and quietly felt like a genius for the rest of the day.", effects: { health: 1, joy: 2 } },
      { weight: 1, text: "The mystery meat was surprisingly tasty. You asked the lunch lady for the recipe.", effects: { joy: 3, health: 1 } }
    ]
  },
  {
    id: "teen_hs_class_representative", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Your classmates want you to run for class representative. The election starts in ten minutes.",
    choices: [
      { label: "Give a speech",
        outcomes: [
          { weight: 2, text: "Your speech about longer recess won by a landslide. Your classmates chanted your name.", effects: { joy: 5, kindness: 3, style: 2 } },
          { weight: 1, text: "You forgot your speech and gave a pep talk about pencils instead. Somehow, it worked.", effects: { joy: 2, kindness: 2 } }
        ] },
      { label: "Nominate a friend instead",
        outcomes: [
          { text: "Your nominee won, and their first promise was a weekly pizza Friday.", effects: { kindness: 3, joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_phone_confiscated", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Your phone buzzed in the middle of history class. Your teacher held out one hand and waited.",
    outcomes: [
      { weight: 2, text: "Your phone spent the rest of the week in the teacher's desk drawer, next to a stapler and a sock.", effects: { joy: -3 } },
      { weight: 2, text: "Your teacher handed it back at the end of class with a sticky note: 'Nice ringtone.'", effects: { joy: -1 } },
      { weight: 1, text: "Your teacher just laughed, handed it back, and gave you a warning with a wink.", effects: { joy: 1 } }
    ]
  },
  {
    id: "teen_hs_field_trip_bus", minAge: 13, maxAge: 17, needs: ["school"],
    text: "The field trip bus breaks down on the way to the science museum. The driver pulls out a box of snacks.",
    outcomes: [
      { weight: 3, text: "You spent the wait singing songs and playing I Spy. The museum got your group an hour late, but nobody minded.", effects: { joy: 4 } },
      { weight: 1, text: "The snacks were questionable, but the group bonded over a cracker-tower contest.", effects: { joy: 2, kindness: 1 } }
    ]
  },
  {
    id: "teen_hs_career_day", minAge: 13, maxAge: 17, needs: ["school"],
    text: "Career Day! The guest speaker is a chef who can juggle three eggs without cracking a single one.",
    choices: [
      { label: "Ask the chef for a recipe",
        outcomes: [
          { weight: 2, text: "The chef showed you how to make a pancake shaped like a star. Breakfast will never be the same.", effects: { skills: { cooking: 5 }, joy: 3 } },
          { weight: 1, text: "The recipe was 'a pinch of this and a dash of that.' You were still figuring it out.", effects: { skills: { cooking: 2 } } }
        ] },
      { label: "Ask about the favorite tool",
        outcomes: [
          { text: "The chef's favorite tool was a whisk named Gerald. Now you wanted one too.", effects: { joy: 3, smarts: 1 } }
        ] }
    ]
  },
  {
    id: "teen_hs_new_classmate", minAge: 13, maxAge: 18, needs: ["school"],
    text: "A new kid named {newFriend} sits next to you and offers to share half of a cinnamon muffin.",
    effects: { newFriend: true, joy: 3, kindness: 2 }
  },
  {
    id: "teen_hs_classmate_homework", minAge: 13, maxAge: 18, needs: ["school"],
    text: "{classmate} is stuck on the math homework and whispers that the bell is about to ring. Help?",
    choices: [
      { label: "Show them how it works",
        outcomes: [
          { weight: 2, text: "You explained the problem with pizza slices. {classmate} finally got it and grinned.", effects: { kindness: 4, smarts: 2 } },
          { weight: 1, text: "You explained it so fast that {classmate} asked for a replay. You happily obliged.", effects: { kindness: 2 } }
        ] },
      { label: "Tell them to ask the teacher",
        outcomes: [
          { text: "{classmate} sighed, went to ask the teacher, and you stayed focused on your own paper.", effects: { grades: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_essay_deadline", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Your history essay is due Friday, and so far you have written a title. A very good title, though.",
    choices: [
      { label: "Start writing tonight",
        outcomes: [
          { weight: 2, text: "You wrote three pages and found crumbs in your keyboard. Your teacher adored the ending.", effects: { grades: 5, skills: { writing: 3 } }, favor: "writing" },
          { weight: 1, text: "The essay came out a little long and very sleepy. It still earned a solid grade.", effects: { grades: 2 } }
        ] },
      { label: "Wait until Thursday to panic",
        outcomes: [
          { text: "You panicked on Thursday and typed at lightning speed. The result was surprisingly good.", effects: { grades: 1, joy: -2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_spelling_bee", minAge: 13, maxAge: 16, needs: ["school"],
    text: "The school spelling bee is on Friday, and the final word is 'mischievous'. Your heart is racing.",
    choices: [
      { label: "Study the word list every day",
        outcomes: [
          { weight: 2, text: "You spelled 'mischievous' perfectly, and the whole gym clapped for you.", effects: { smarts: 4, joy: 4 }, favor: "smarts" },
          { weight: 1, text: "You made it to the final round and lost on 'rhythm.' Still a fantastic week.", effects: { smarts: 2, joy: 2 } }
        ] },
      { label: "Wing it with confidence",
        outcomes: [
          { text: "You spelled 'boat' as 'bote' and bowed anyway. The crowd cheered for your style.", effects: { style: 2, joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_bake_sale", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The school bake sale needs a dessert for the big fundraiser. You have one very old recipe for lemon squares.",
    choices: [
      { label: "Bake a tray of lemon squares",
        outcomes: [
          { weight: 2, text: "Your lemon squares sold out before the first period was over. Excellent work.", effects: { money: 30, skills: { cooking: 4 }, joy: 3 } },
          { weight: 1, text: "The squares were a little lopsided, but the bake sale still raised a few bucks.", effects: { money: 10, kindness: 2 } }
        ] },
      { label: "Buy one square and enjoy it",
        outcomes: [
          { text: "You bought a lemon square. It was sunny, sweet, and worth every single penny.", effects: { money: -5, joy: 2 } }
        ] }
    ]
  },
  {
    id: "teen_hs_book_fair", minAge: 13, maxAge: 16, needs: ["school"],
    text: "The school book fair is open, and there's a bookmark shaped like a sleepy shark calling your name.",
    choices: [
      { label: "Spend your allowance on a thick book",
        outcomes: [
          { weight: 2, text: "The thick book about deep-sea octopuses was so good you finished it in one weekend.", effects: { money: -15, smarts: 3, skills: { writing: 2 } } },
          { weight: 1, text: "The book was so long it needed its own bookmark. You were on page 37 and proud of it.", effects: { money: -15, joy: 2 } }
        ] },
      { label: "Browse and buy a cool bookmark",
        outcomes: [
          { text: "You bought a bookmark shaped like a sleepy shark. A very important purchase.", effects: { money: -5, joy: 3 } }
        ] }
    ]
  },
  {
    id: "teen_hs_pep_rally", minAge: 13, maxAge: 18, needs: ["school"],
    text: "The pep rally ends with a giant tower of paper cups. It wobbles, sways, and somehow stays standing.",
    effects: { joy: 4, kindness: 1 }
  },
  {
    id: "teen_hs_locker_jam", minAge: 13, maxAge: 18, needs: ["school"],
    text: "Your locker door jams with a dramatic CLANG. A passing custodian arrives with a spoon and a grin.",
    outcomes: [
      { weight: 3, text: "Three taps with the spoon later, your locker swung open like a treasure chest.", effects: { joy: 2 } },
      { weight: 2, text: "The locker opened halfway. You decided to live with it, and so did the locker.", effects: { joy: -1 } },
      { weight: 1, text: "The spoon bent. The custodian called it a character-building experience and wandered off.", effects: { joy: 1 } }
    ]
  }
]);
