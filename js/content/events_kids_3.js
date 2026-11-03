// js/content/events_kids_3.js
// Kids (ages 4-12): a few more school moments, plus everyday childhood adventures.
CL.add("events", [
  // ---- School life (ages 5-12)
  { id: "kid_class_election", minAge: 8, maxAge: 12, needs: ["school"],
    text: "Your class is voting for the Helper of the Week. {classmate} asks if you want to run for the job.",
    choices: [
      { label: "Give a short, friendly speech", outcomes: [
        { weight: 2, favor: "acting", text: "Your speech was short and sweet, and the whole class cheered. You won the vote by a landslide!", effects: { grades: 2, joy: 4, skills: { acting: 2 } } },
        { weight: 1, text: "You forgot a sentence, so you told a funny story instead. Everyone voted for you anyway.", effects: { joy: 3, kindness: 1 } } ] },
      { label: "Draw posters for the whole class", outcomes: [
        { text: "Your posters were colorful and clever. You came in second place, which still felt great.", effects: { joy: 3, skills: { art: 3 } } } ] }
    ] },

  { id: "kid_book_fair", minAge: 6, maxAge: 12, needs: ["school"],
    text: "The school book fair is open! A shiny adventure book is waiting for you, and you have a few dollars saved up.",
    choices: [
      { label: "Buy the adventure book", outcomes: [
        { weight: 3, text: "You bought the book and read it in one happy afternoon. The secret map on the last page made you grin.", effects: { money: -8, smarts: 3, joy: 3 } },
        { weight: 1, text: "That book had already sold out, so you grabbed a comic about a space chipmunk instead.", effects: { money: -4, joy: 4 } } ] },
      { label: "Save your dollars for later", outcomes: [
        { text: "You kept your dollars in your piggy bank and borrowed the book from the library instead. Smart saving!", effects: { smarts: 2, joy: 1 } } ] }
    ] },

  { id: "kid_choir_concert", minAge: 7, maxAge: 12, needs: ["school"],
    text: "The class choir is singing at the spring concert. Your part has one tricky high note that makes you a little nervous.",
    choices: [
      { label: "Practice the high note all week", outcomes: [
        { weight: 3, favor: "music", text: "You hit the high note like a little songbird! The audience clapped and asked for an encore.", effects: { joy: 5, skills: { music: 4 } } },
        { weight: 1, text: "Your high note squeaked, but the audience laughed warmly and clapped for the whole choir.", effects: { joy: 3, skills: { music: 1 } } } ] },
      { label: "Hum the tricky part quietly", outcomes: [
        { text: "You hummed along and let the rest of the choir shine. Everyone sounded wonderful together.", effects: { kindness: 2, skills: { music: 1 } } } ] }
    ] },

  { id: "kid_costume_day", minAge: 5, maxAge: 12, needs: ["school"],
    text: "It is costume day at {school}! You are dressed as a friendly wizard with a tall cardboard hat.",
    outcomes: [
      { weight: 2, text: "Everyone wanted to hear your magic spells, so you invented three on the spot.", effects: { joy: 4, skills: { acting: 1 } } },
      { weight: 1, text: "Your cape got stuck in the doorway, but you pulled it free with a dramatic flourish.", effects: { joy: 2 } } ] },

  { id: "kid_lost_mitten", minAge: 5, maxAge: 10, needs: ["school"],
    text: "On the walk home from school, you noticed that one of your mittens was missing. Oops!",
    outcomes: [
      { weight: 2, text: "A kind crossing guard found it hanging from a fence. Mitten reunion!", effects: { kindness: 1, joy: 2 } },
      { weight: 1, text: "You never found the mitten, so you made a new one from an old sock. It is pretty silly.", effects: { smarts: 1, joy: 2 } } ] },

  // ---- Everyday childhood (ages 4-12)
  { id: "kid_birthday_party", minAge: 5, maxAge: 12,
    text: "Your birthday party is today! Balloons are floating everywhere, and your friends are ready for the first game.",
    choices: [
      { label: "Plan a treasure hunt", outcomes: [
        { weight: 3, text: "Your guests followed clues all over the yard and found a chocolate coin in a flower pot. Everyone cheered!", effects: { joy: 6, kindness: 2 } },
        { weight: 1, text: "The map was upside down, so everyone found the treasure in the laundry basket. Still a fun mystery!", effects: { joy: 4 } } ] },
      { label: "Let everyone pick the music", outcomes: [
        { text: "Everyone danced so hard the living room rug slid across the floor. Best party ever!", effects: { joy: 5, health: 1 } } ] }
    ] },

  { id: "kid_lemonade_stand", minAge: 5, maxAge: 12,
    text: "Your lemonade stand opened at the end of the driveway, with a bright sign and a very cold pitcher.",
    outcomes: [
      { weight: 3, text: "A line of neighbors formed! The pitcher was empty by lunchtime, and you counted your coins proudly.", effects: { money: 9, joy: 4, kindness: 1 } },
      { weight: 1, text: "It was a hot day, but nobody stopped by. You shared the leftover lemonade with the squirrels.", effects: { joy: 2 } } ] },

  { id: "kid_treehouse", minAge: 6, maxAge: 12,
    text: "You and {dad} built a wobbly treehouse in the big oak tree. It has a rope ladder and a flag made of socks.",
    effects: { joy: 6, bond: 4 } },

  { id: "kid_rainy_day_fort", minAge: 4, maxAge: 10,
    text: "Rain was tapping on the windows, so you built a blanket fort in the middle of the living room.",
    outcomes: [
      { weight: 2, text: "You invited your stuffed animals inside for a picnic of pretend sandwiches. Very cozy!", effects: { joy: 5, smarts: 1 } },
      { weight: 1, text: "The fort collapsed in a soft pile of pillows. You declared it a brand new kind of fort.", effects: { joy: 3 } } ] },

  { id: "kid_lost_tooth", minAge: 5, maxAge: 8, once: true,
    text: "Your wobbly front tooth finally came out while you were munching an apple! What do you do with it?",
    choices: [
      { label: "Tuck it under your pillow", outcomes: [
        { weight: 3, text: "You woke up to find a shiny coin under your pillow, right next to a note that said Nice smile!", effects: { money: 5, joy: 5 } },
        { weight: 1, text: "Nothing happened that first night. The tooth fairy must have been extra busy.", effects: { joy: -2 } } ] },
      { label: "Keep it in a little jar", outcomes: [
        { text: "You added the tooth to your collection of very strange treasures. It sits proudly on your shelf.", effects: { joy: 2, smarts: 1 } } ] }
    ] },

  { id: "kid_learning_bike", minAge: 5, maxAge: 10, once: true,
    text: "Today is the big day you learn to ride a bike without training wheels. {dad} is holding the back of the seat.",
    choices: [
      { label: "Pedal as fast as you can", outcomes: [
        { weight: 2, favor: "sports", text: "You wobbled, you giggled, and then you were riding all by yourself! Wheeeee!", effects: { joy: 6, health: 2, skills: { sports: 2 } } },
        { weight: 1, text: "You rolled into a patch of soft grass. A quick laugh, and then you tried again.", effects: { joy: 3, health: 1 } } ] },
      { label: "Take it slow and steady", outcomes: [
        { text: "You rode one careful wobble at a time while {dad} cheered at every turn.", effects: { joy: 4, bond: 2 } } ] }
    ] },

  { id: "kid_summer_camp", minAge: 8, maxAge: 12, once: true,
    text: "Summer camp starts today! The cabins smell like pine, and the counselors are ready with a big schedule.",
    choices: [
      { label: "Sign up for the nature hike", outcomes: [
        { weight: 2, text: "You spotted a woodpecker and a family of raccoons peeking through the trees. You filled a notebook with sketches.", effects: { health: 3, joy: 4, skills: { art: 2 } } },
        { weight: 1, text: "The hike was longer than expected, so you rested with a cold juice box. You still felt proud.", effects: { health: 2, joy: 2 } } ] },
      { label: "Join the arts and crafts cabin", outcomes: [
        { text: "You made a painted pinecone and a friendship bracelet for your cabin mate. Creative and cozy!", effects: { skills: { art: 3 }, joy: 4, kindness: 2 } } ] }
    ] },

  { id: "kid_cookie_jar", minAge: 5, maxAge: 12,
    text: "The cookie jar sits on the top shelf. Today it looks a little less full than it did this morning.",
    outcomes: [
      { weight: 2, text: "You quietly sneaked out one cookie and wiped away the crumbs before anyone noticed.", effects: { joy: 4 } },
      { weight: 1, text: "Crumbs trailed right down to your chin. {mom} gave you a look, and you gave back a very guilty grin.", effects: { joy: 2, bond: 2 } } ] },

  { id: "kid_new_kid_park", minAge: 6, maxAge: 12,
    text: "At the park, a kid with a bright yellow kite is trying to fly it all alone. They look up and wave at you.",
    choices: [
      { label: "Walk over and help with the kite", outcomes: [
        { weight: 3, text: "Together you got the kite soaring high. Your new friend {newFriend} grinned from ear to ear.", effects: { joy: 5, newFriend: true } },
        { weight: 1, text: "The kite got tangled in a tree. You waved goodbye, and {newFriend} shouted, \"See you at the swings!\"", effects: { joy: 3, newFriend: true } } ] },
      { label: "Wave back and keep walking", outcomes: [
        { text: "You waved back and kept walking. Maybe next time you will say hello.", effects: { joy: 1 } } ] }
    ] },

  { id: "kid_sibling_squabble", minAge: 4, maxAge: 12,
    text: "Your {siblingRole} {sibling} and you both reached for the last slice of pizza at the same time.",
    choices: [
      { label: "Offer to split the slice", outcomes: [
        { weight: 2, text: "You split it down the middle, and you both agreed it tasted extra good that way.", effects: { kindness: 4, bond: 4 } },
        { weight: 1, text: "Your {sibling} insisted you take the bigger half, and you both laughed about it.", effects: { kindness: 2, bond: 3 } } ] },
      { label: "Argue until someone gives up", outcomes: [
        { text: "You argued for ages until {sibling} stomped off. Everyone lost, and the slice got cold.", effects: { joy: -2, bond: -4 } } ] }
    ] },

  { id: "kid_neighbor_help", minAge: 5, maxAge: 12,
    text: "{neighbor} needs help raking leaves in the front yard. Your rake is already leaning against the fence.",
    choices: [
      { label: "Rake the biggest pile", outcomes: [
        { weight: 3, text: "{neighbor} gave you five dollars, a cup of cocoa, and a big thank-you wave.", effects: { kindness: 4, money: 5 } },
        { weight: 1, text: "You raked so hard that you found three lost marbles in the leaves. Treasure!", effects: { joy: 3, kindness: 2 } } ] },
      { label: "Jump into the leaf pile", outcomes: [
        { text: "You jumped into the pile with a giant whoosh, then helped rebuild it for {neighbor}.", effects: { joy: 4, kindness: 2 } } ] }
    ] },

  { id: "kid_sleepover", minAge: 6, maxAge: 12,
    text: "{friend} invited you to a sleepover with sleeping bags and a stack of flashlight stories.",
    outcomes: [
      { weight: 2, text: "You stayed up telling silly stories until the moon was high. You both giggled into your pillows.", effects: { joy: 5, bond: 4 } },
      { weight: 1, text: "You fell asleep before the second story. In the morning, {friend} had tucked a paper crown on your head.", effects: { joy: 3, bond: 3 } } ] },

  { id: "kid_pancake_breakfast", minAge: 4, maxAge: 10,
    text: "On Saturday, the kitchen smelled like maple syrup. You flipped your very first pancake, and it landed right side up!",
    effects: { joy: 4, skills: { cooking: 2 } } },

  { id: "kid_kite_festival", minAge: 5, maxAge: 12,
    text: "The kite festival in {city} filled the sky with rainbow shapes, dragons, and one giant fish.",
    outcomes: [
      { weight: 2, text: "Your kite soared higher than almost all the others. You watched it dance above the hills.", effects: { joy: 5 } },
      { weight: 1, text: "Your kite tangled with a balloon. You laughed and untangled them together with a new buddy.", effects: { joy: 3, kindness: 2 } } ] },

  { id: "kid_costume_contest", minAge: 4, maxAge: 10,
    text: "The neighborhood costume contest is today. You are dressed as a giant sunflower with a very big smile.",
    outcomes: [
      { weight: 2, text: "The judges gave you a shiny ribbon for most cheerful costume. Your petals rustled proudly.", effects: { style: 3, joy: 4 } },
      { weight: 1, text: "Your petals kept falling off, but the crowd cheered for your brave and bouncy attempt.", effects: { joy: 2, style: 1 } } ] },

  { id: "kid_puppet_show", minAge: 4, maxAge: 10,
    text: "Your family wants a puppet show after dinner. You have a sock puppet, a paper cup, and a big imagination.",
    choices: [
      { label: "Write a funny puppet play", outcomes: [
        { weight: 3, text: "Your puppet show had a plot twist, a silly song, and an audience that clapped twice.", effects: { joy: 4, skills: { writing: 3, acting: 2 } } },
        { weight: 1, text: "The puppet forgot all its lines, so it just sang the alphabet. The grown-ups enjoyed it anyway.", effects: { joy: 3 } } ] },
      { label: "Perform with the sock puppet only", outcomes: [
        { text: "Your sock puppet was a star, and {mom} laughed so hard they had to sit down.", effects: { joy: 4, skills: { acting: 2 } } } ] }
    ] },

  { id: "kid_road_trip", minAge: 6, maxAge: 12,
    text: "The family road trip is full of singing, snack breaks, and one very confusing map. {mom} is the navigator.",
    effects: { joy: 5, bond: 3 } },

  { id: "kid_bean_sprout", minAge: 4, maxAge: 8,
    text: "You planted a bean in a wet paper towel, and by the next morning it had sprouted a tiny green leaf!",
    effects: { joy: 4, smarts: 2 } },

  { id: "kid_bug_hunt", minAge: 5, maxAge: 10,
    text: "You went bug hunting in the backyard with a magnifying glass and a jar with air holes.",
    outcomes: [
      { weight: 2, text: "You spotted a ladybug, a shiny beetle, and a very determined ant. You let them all go afterward.", effects: { smarts: 2, kindness: 2, joy: 2 } },
      { weight: 1, text: "A grumpy beetle pinched your sleeve, and you giggled before setting it free.", effects: { joy: 3 } } ] },

  { id: "kid_science_museum", minAge: 6, maxAge: 12,
    text: "The science museum in {city} has a hands-on lab where you can make bubbles as big as your head.",
    effects: { smarts: 3, joy: 4 } }
]);
