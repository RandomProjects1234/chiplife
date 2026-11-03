// js/content/events_kids_1.js
// Kids (ages 0-12): baby & toddler moments, plus some everyday childhood events.
CL.add("events", [
  // ---- Baby & toddler moments (ages 0-4)
  { id: "kid_first_word", minAge: 1, maxAge: 2, once: true,
    text: "You said your very first word: \"acorn\"! Everyone in the room cheered as if you had won a prize.",
    effects: { joy: 5, smarts: 2 } },

  { id: "kid_first_steps", minAge: 1, maxAge: 2, once: true,
    text: "You took your first wobbly steps across the living room rug, all the way from the couch to the coffee table!",
    effects: { joy: 6, health: 2 } },

  { id: "kid_first_tooth", minAge: 0, maxAge: 1, once: true,
    text: "A tiny white tooth poked through your gums! Now you can chew on absolutely everything.",
    effects: { joy: 4, health: 2 } },

  { id: "kid_bath_splashes", minAge: 0, maxAge: 3,
    text: "Bath time! You discovered that thumping the water makes the biggest splash the bathroom has ever seen.",
    choices: [
      { label: "Splash with both hands", outcomes: [
        { weight: 3, text: "Water flew everywhere, even up onto the ceiling. The bath mat has never been so wet.", effects: { joy: 5 } },
        { weight: 1, text: "A rubber duck got launched onto the bath mat. It landed with a loud squeak.", effects: { joy: 3 } } ] },
      { label: "Blow bubbles instead", outcomes: [
        { text: "You blew a whole mountain of bubbles and wore one on your nose like a fancy hat.", effects: { joy: 3, smarts: 1 } } ] }
    ] },

  { id: "kid_peekaboo", minAge: 0, maxAge: 2,
    text: "{mom} hid behind a big pillow, then popped out with a loud PEEKABOO! What do you do?",
    choices: [
      { label: "Shout PEEKABOO right back", outcomes: [
        { text: "You shouted PEEKABOO! {mom} gasped so dramatically that you giggled for ten whole minutes.", effects: { joy: 5, bond: 3 } } ] },
      { label: "Hide your face and wait", outcomes: [
        { weight: 2, text: "You hid your face in your blanket, then peeked out to say hello.", effects: { joy: 3 } },
        { weight: 1, text: "You hid so well that {mom} had to search for you for a whole minute.", effects: { joy: 4, bond: 2 } } ] }
    ] },

  { id: "kid_first_birthday_cake", minAge: 1, maxAge: 1, once: true,
    text: "It is your very first birthday! A tiny cake with one candle sits in front of you. What do you do?",
    choices: [
      { label: "Dig in with both hands", outcomes: [
        { text: "You made the messiest cake face in history. Frosting ended up in your ears and in your hair.", effects: { joy: 7 } } ] },
      { label: "Take one careful nibble", outcomes: [
        { text: "The frosting tasted amazing. Then you pushed the plate away and asked for a big hug.", effects: { joy: 4, health: 1 } } ] }
    ] },

  { id: "kid_thunderstorm_cuddle", minAge: 1, maxAge: 4,
    text: "A loud thunderstorm rumbled outside, so {dad} scooped you up into a big warm blanket on the couch.",
    choices: [
      { label: "Snuggle in and count raindrops", outcomes: [
        { text: "You counted raindrops on the window until you drifted off with a happy yawn.", effects: { joy: 5, bond: 4 } } ] },
      { label: "Peek out at the lightning", outcomes: [
        { weight: 2, text: "A bright flash lit up the room. You gasped, then clapped, because the thunder sounded like a drum solo!", effects: { joy: 4, bond: 2 } },
        { weight: 1, text: "The thunder boomed so loudly that you hid under the blanket and made {dad} laugh.", effects: { joy: 3, bond: 3 } } ] }
    ] },

  { id: "kid_grandparent_visit", minAge: 1, maxAge: 4,
    text: "{grandparent} came over with a bag of soft cookies and a silly hat that was far too big for you.",
    effects: { joy: 4, bond: 5 } },

  { id: "kid_sibling_giggles", minAge: 1, maxAge: 4,
    text: "Your {siblingRole} {sibling} balanced a spoon on their nose and wiggled their ears. You giggled until you hiccupped.",
    effects: { joy: 5, bond: 4 } },

  { id: "kid_pet_nudge", minAge: 1, maxAge: 4,
    text: "{pet} the {petType} came over to say hello and looked very pleased with the morning.",
    outcomes: [
      { weight: 2, text: "{pet} the {petType} gave you a big welcome, right up close to your face.", effects: { joy: 4, bond: 3 } },
      { weight: 1, text: "{pet} the {petType} did a happy little swirl just to show off.", effects: { joy: 3, bond: 2 } } ] },

  { id: "kid_stroller_pigeon", minAge: 0, maxAge: 2,
    text: "You were out for a stroller ride around {city} when something caught your eye.",
    outcomes: [
      { weight: 2, text: "A fluffy pigeon strutted past, and you shrieked with joy. Hello, birdie!", effects: { joy: 5 } },
      { weight: 1, text: "A friendly neighbor waved at you, and you waved back with your whole arm.", effects: { joy: 3, kindness: 1 } } ] },

  { id: "kid_crayon_wall", minAge: 2, maxAge: 4,
    text: "You found a purple crayon and drew a giant spiral on the wall. Your masterpiece is very big. What now?",
    choices: [
      { label: "Show your masterpiece proudly", outcomes: [
        { text: "{mom} took a photo and declared your wall spiral the grand opening of a brand new art gallery.", effects: { joy: 4, skills: { art: 2 } } } ] },
      { label: "Quietly hide the crayon", outcomes: [
        { text: "The purple crayon vanished under the couch. The grown-ups searched everywhere except under the couch.", effects: { joy: 2 } } ] }
    ] },

  { id: "kid_dance_party", minAge: 2, maxAge: 4,
    text: "{dad} turned on some silly music, and the kitchen suddenly became the best dance floor in {city}.",
    effects: { joy: 5, health: 1 } },

  { id: "kid_puddle_stomp", minAge: 2, maxAge: 4,
    text: "After the rain, a huge puddle sparkled right in front of you on the sidewalk.",
    choices: [
      { label: "Stomp right through it", outcomes: [
        { weight: 3, text: "SPLASH! Your boots were soaked and your giggles were loud enough for the whole street.", effects: { joy: 6 } },
        { weight: 1, text: "You stomped so hard that one boot came off. Surprise: you also got a sock full of puddle.", effects: { joy: 3 } } ] },
      { label: "Tiptoe around the edge", outcomes: [
        { text: "You tiptoed around the puddle like a tiny explorer and stayed perfectly dry.", effects: { smarts: 1, joy: 2 } } ] }
    ] },

  { id: "kid_haircut_day", minAge: 2, maxAge: 4,
    text: "Today is haircut day! The barber's chair squeaks, and the big mirror is waiting for you.",
    choices: [
      { label: "Sit still like a statue", outcomes: [
        { text: "You sat perfectly still, got a shiny sticker, and your new haircut looked very dapper!", effects: { style: 4, joy: 3 } } ] },
      { label: "Wiggle like a noodle", outcomes: [
        { weight: 2, text: "You wiggled the whole time, so the barber gave you a silly little curl on top. Not bad!", effects: { style: 2, joy: 4 } },
        { weight: 1, text: "The barber laughed so hard the haircut took twice as long. You earned a lollipop for patience!", effects: { joy: 4 } } ] }
    ] },

  { id: "kid_bedtime_story", minAge: 2, maxAge: 4,
    text: "{mom} is reading your favorite picture book for the fourth time tonight. What do you say?",
    choices: [
      { label: "Ask for it one more time", outcomes: [
        { text: "You giggled at every page, then fell asleep on the very last one with a big grin.", effects: { joy: 4, smarts: 2, bond: 3 } } ] },
      { label: "Turn the pages yourself", outcomes: [
        { weight: 2, text: "You pretended to read every word. You were very convincing, and {mom} was very proud.", effects: { smarts: 3, joy: 3 } },
        { weight: 1, text: "You flipped the pages so fast that the whole story ended in about four seconds.", effects: { joy: 2, smarts: 1 } } ] }
    ] },

  { id: "kid_mud_pie", minAge: 2, maxAge: 4,
    text: "You made a gorgeous mud pie with three twigs for decorations, then proudly served it to {dad}.",
    effects: { joy: 4, bond: 3 } },

  { id: "kid_runaway_balloon", minAge: 2, maxAge: 4,
    text: "A red balloon slipped out of your hand and floated up toward the tall tree in the yard.",
    choices: [
      { label: "Run after it as fast as you can", outcomes: [
        { weight: 2, text: "You caught the string just in time! The balloon bounced happily as you carried it back.", effects: { joy: 5, health: 1 } },
        { weight: 1, text: "It floated too high to catch. You waved bye-bye, and it probably made a new friend in the clouds.", effects: { joy: 2 } } ] },
      { label: "Wave bye-bye to it", outcomes: [
        { text: "You waved, and the balloon seemed to wave back with a happy little wobble.", effects: { joy: 3, kindness: 1 } } ] }
    ] },

  // ---- Everyday childhood (ages 4-12)
  { id: "kid_snow_day", minAge: 4, maxAge: 12,
    text: "Snow has blanketed the whole street, and everything looks like a frosted cake. What do you do first?",
    choices: [
      { label: "Build a snowman with a carrot nose", outcomes: [
        { weight: 3, text: "Your snowman turned out tall and proud, and the whole street stopped to admire the snowman's scarf.", effects: { joy: 5, skills: { art: 2 } } },
        { weight: 1, text: "The carrot nose rolled away, so you gave your snowman a stick nose. It looked very wise.", effects: { joy: 4 } } ] },
      { label: "Go sledding down the big hill", outcomes: [
        { weight: 2, text: "You zoomed down the hill so fast your hat flew off. Every run was a brand new adventure!", effects: { joy: 6, health: 2 } },
        { weight: 1, text: "You ended up in a giant snowbank and came out looking like a snowy cookie.", effects: { joy: 4 } } ] }
    ] },

  { id: "kid_finding_frog", minAge: 4, maxAge: 12,
    text: "While walking by the creek in {city}, you spotted a small green frog sitting on a lily pad.",
    choices: [
      { label: "Sneak up and say hello", outcomes: [
        { text: "The frog blinked at you, then hopped away with a tiny ribbit. What a polite visitor!", effects: { joy: 4, smarts: 1 } } ] },
      { label: "Catch it and build a frog home", outcomes: [
        { weight: 2, text: "You built a cozy house of mud and leaves for the frog, then released it back to the creek.", effects: { kindness: 3, smarts: 2 } },
        { weight: 1, text: "The frog hopped out of your hands and landed on someone's hat. What a slippery adventure!", effects: { joy: 3 } } ] }
    ] },

  { id: "kid_baking_grandparent", minAge: 4, maxAge: 12,
    text: "{grandparent} needed a helper for a big batch of cookies, and you got the important job of measuring.",
    outcomes: [
      { weight: 3, text: "The cookies came out golden and gooey. You measured every cup of flour like a real chef.", effects: { joy: 5, bond: 3, skills: { cooking: 3 } } },
      { weight: 1, text: "You grabbed the salt instead of the sugar. The cookies were a surprise, and everyone laughed.", effects: { joy: 3, bond: 2, skills: { cooking: 1 } } } ] },

  { id: "kid_stray_kitten", minAge: 4, maxAge: 12,
    text: "A tiny orange kitten is meowing under the porch. It looks hungry and very curious.",
    choices: [
      { label: "Bring it a bowl of milk", outcomes: [
        { weight: 2, text: "The kitten purred like a little motor and followed you home. Everyone agreed it could stay!", effects: { joy: 6, addPet: "cat" } },
        { weight: 1, text: "The kitten sniffed the milk, then wandered off to find a sunny nap spot somewhere else.", effects: { joy: 2 } } ] },
      { label: "Tell a grown-up about it", outcomes: [
        { text: "A grown-up helped find the kitten's family. Everyone was relieved, and the kitten got a fancy new collar.", effects: { kindness: 3, joy: 3 } } ] }
    ] },

  { id: "kid_catching_cold", minAge: 4, maxAge: 12,
    text: "You woke up with a runny nose, a scratchy throat, and a sneeze that could rattle the windows.",
    effects: { illness: "cold", joy: -2 } },

  { id: "kid_goldfish_fair", minAge: 4, maxAge: 12,
    text: "At the summer street fair, a friendly fish seller was offering goldfish in tiny round bowls.",
    choices: [
      { label: "Take a goldfish home", outcomes: [
        { text: "The goldfish swam in happy loops around its new bowl. You picked the most dramatic name you could think of.", effects: { joy: 5, addPet: "fish" } } ] },
      { label: "Admire the fish and walk on", outcomes: [
        { text: "You waved goodbye to the goldfish and bought a lemon slush instead. Refreshing!", effects: { joy: 2 } } ] }
    ] },

  { id: "kid_drawing_talent", minAge: 4, maxAge: 12,
    text: "You drew a dragon eating spaghetti, and it turned out so good that everyone who saw it wanted a copy.",
    effects: { joy: 4, skills: { art: 5 } } }
]);
