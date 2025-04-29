document.addEventListener("DOMContentLoaded", function() 
{
    // These are helpful for debuggin to confirm the file and DOM are loaded
    console.log("JavaScript file loaded");
    console.log("DOM fully loaded");

    // Initializes the variables for timer and session tracking
    let WorkSession = true; // Tracks if we are in a work session
    let workDuration = 25 * 60; // The default work time is 25 minutes, which is converted to seconds
    let breakDuration = 5 * 60; // The default break time is 5 minutes, which is converted to seconds
    let timeLeft = workDuration; // This is the time left in the current session
    let timerInterval; // Stores the setInterval ID
    let isRunning = false; // This tracks if the timer is currently running
    let sessionsCompleted = 0; // This tracks the amount of work sessions that has been completed
    let initialTimeLeft; // Tracks how much time is left when starting

    // References to HTML elements that we'll update or interact with
    const countdownEl = document.getElementById("countdown");
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const resetBtn = document.getElementById("reset-btn");
    const applySettingsBtn = document.getElementById("apply-settings");
    const progressBar = document.getElementById("progress-bar");
    const sessionCounter = document.getElementById("session-counter");

    /*
    The updateDisplay function is responsible for updating the timer countdown on the screen,
    while also updating the progress bar to visually show how much of the session has passed.
    This will allow the user to see both a time and visual representation of their progress.
    */
    function updateDisplay() 
    {
        console.log("Updating display");
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownEl.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        const totalTime = WorkSession ? workDuration : breakDuration;
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = `${progress}%`;
    }

    /*
    The updateSessionCounter function updates the text that displays the number of work sessions
    completed. That way the user can see how productinve they have been over time.
    */
    function updateSessionCounter() 
    {
        sessionCounter.textContent = `Sessions completed: ${sessionsCompleted}`;
    }

    /*
    Here, I added clicks for the "Apply Settings" button to let the user be able to customize the
    length of work and break periods that they want.
    */
    applySettingsBtn.addEventListener("click", () => {
        workDuration = document.getElementById("work-duration").value * 60;
        breakDuration = document.getElementById("break-duration").value * 60;
        resetTimer();
    });

    /*
    The playSound function plays a sound effect that signals when a session starts or ends, giving the 
    user audible cues.
    */
    function playSound(audioFile)
    {
        let sound = new Audio(audioFile);
        sound.play();
    }

    /*
    The startTimer function starts the countdown. It ensures that the timer counts down once per second and
    handles the transition between work and break sessions. It will play the appropriate sounds for each session.
    */
    function startTimer() 
    {
        if (isRunning) return; // This prevents multiple timers from running at once.
        console.log("Timer started");

        playSound("audio/bell_start.mp3") // Calls the playSound function to play the bell sound effect

        isRunning = true;
        startTimestamp = Date.now();
        updateDisplay();

        timerInterval = setInterval(() => {
            let now = Date.now();
            let elapsed = Math.floor((now - startTimestamp) / 1000);

            let updatedTimeLeft = initialTimeLeft - elapsed;
            
            if (updatedTimeLeft >= 0) 
            {
                timeLeft = updatedTimeLeft;
                updateDisplay();
            } 
            else 
            {
                clearInterval(timerInterval);
                isRunning = false;

                playSound("audio/bell_end.mp3");

                setTimeout(() => {
                    if (WorkSession) 
                    {
                        sessionsCompleted++;
                        updateSessionCounter();
                        alert("Work session complete! Take a break.");
                        WorkSession = false;
                        timeLeft = breakDuration;
                        startBreak();
                    } 
                    else 
                    {
                        alert("Break time is over!");
                        endBreak();
                        WorkSession = true;
                        timeLeft = workDuration;
                    }
                    updateDisplay();
                }, 1400);
            }
        }, 1000);
    }

    /*
    The recommendations object stores a list of recommended Asian dramas, movies, tv shows, and games.
    Each category is composed of an array of strings.
    */
    const recommendations = {
        asian_dramas:
        [
            "Love is Sweet - Jiang Jun, with her double master's degree in Economics and Psychology,\
            applies for a job at an investment bank called MH, where Yuan Shuai, once the alleged\
            'big bully' of her childhood, now MH's executive director, goes out of his way to prevent\
            her from entering the company.",

            "Crash Landing on You - A successful businesswoman who owns a fashion company does\
            paragliding as part of a promotional event for her company. Suddenly a storm arrives\
            and blows her across the border into the North Korean side. A North Korean army captain\
            finds her. He decides to not report her to the authorities but to hide her home and send\
            her back across the border to safety. But things don’t go according to plan.",

            "Tale of the Nine-Tailed - Lee Yeon was once the mountain guardian spirit (nine tailed fox).\
            During many centuries he lives his life in human form in search for the reincarnation of his\
            lost first love and eradicates supernatural beings that threaten the mortal world. Meanwhile,\
            Nam Ji-A works for TVC station as a PD of documentaries. She seeks out stories on the supernatural.\
            Her parents were involved in a mysterious car accident and disappeared, but she remembers a man that\
            saved her in that accident.",

            "The Untamed - Two talented disciples from respected clans meet during their youth and form\
            a close affinity, only to be separated by dire circumstances. Sixteen years later, can they\
            unravel the tragedy of the past to solve the mysteries of the present?",

            "Light Chaser Rescue - A devastating earthquake has occurred in Xichuan. Lawyer Luo Ben has\
            gone to the disaster-stricken area to look for his younger and mute sister Luo Yuan. It's\
            there that he comes into contact with the Light Chaser Rescue unit under the leadership of\
            Captain Qing Shan and with his sister's new friend Xiong Fei, an integral part of the unit.\
            Luo Ben also encounters Zhan Yan whom he met previously in less then ideal circumstances.\
            However, he soon changes his mind about her as he comes to admire her selflessness and brilliance\
            as a doctor.",

            "Arsenal Military Academy - Xie Xiang joins the army in her brother's stead by pretending to be a man.\
            She becomes classmates with the wealthy Gu Yanzhen and the calm Shen Junshan. Through their rigorous\
            training, the three form a bond to become comrades, all while Xie Xiang tries to keep her cover.\
            After many incidents, Xie Xiang, as Xie Lianchen, earns the respect of her peers and superiors.\
            The Japanese military stations more forces in the Northeast region causing the young heroes to engage\
            in battle as they uncover a big conspiracy.",

            "Flower of Evil - Although Baek Hee Sung is hiding a dark secret surrounding his true identity,\
            he has established a happy family life. But his facade begins to crumble when his wife, a\
            homicide detective, begins investigating murders from 15 years ago."
        ],
        movies: 
        [
            "Misery - After a serious car crash, novelist Paul Sheldon (James Caan) is rescued by former\
            nurse Annie Wilkes (Kathy Bates), who claims to be his biggest fan. Annie brings him to her\
            remote cabin to recover, where her obsession takes a dark turn...",

            "War Horse - Albert (Jeremy Irvine) and his beloved horse, Joey, live on a farm in the British\
            countryside. At the outbreak of World War I, Albert and Joey are forcibly parted when Albert's\
            father sells the horse to the British cavalry. Against the backdrop of the Great War, Joey\
            begins an odyssey full of danger, joy and sorrow, and he transforms everyone he meets along the way.",

            "Yankee Doodle Dandy - Brought to the White House to receive a Congressional Gold Medal from\
            President Franklin Delano Roosevelt, Broadway legend George M. Cohan (James Cagney) reflects\
            on his life. Flashbacks trace Cohan's rise, from a childhood performing in his family's vaudeville\
            act to his early days as a struggling Tin Pan Alley songwriter to his overwhelming success as an\
            actor, writer, director and producer known for patriotic songs like Yankee Doodle Dandy, You're a\
            Grand Old Flag and Over There.",

            "Courageous - Sheriff's deputy Adam Mitchell (Alex Kendrick) endures a terrible personal tragedy\
            that causes him to question what is really important to him. Taking comfort in his religion,\
            Adam vows to become a better parent to his teenage son (Rusty Martin), and convinces his friends\
            on the force to sign a pledge that they will all strive to become better Christians and better\
            parents. Unfortunately, one of the men's moral compass appears to be broken when it comes to\
            earning some fast money.",

            "Greater - Told he wasn't good enough to play Division I football, Brandon Burlsworth took a\
            risk and walked on in 1994, and he became the most respected player in the history of the\
            programme.",

            "Roman Holiday - Overwhelmed by her suffocating schedule, touring European princess Ann\
            (Audrey Hepburn) takes off for a night while in Rome. When a sedative she took from her\
            doctor kicks in, however, she falls asleep on a park bench and is found by an American\
            reporter, Joe Bradley (Gregory Peck),who takes her back to his apartment for safety. At\
            work the next morning, Joe finds out Ann's regal identity and bets his editor he can get\
            exclusive interview with her, but romance soon gets in the way.",

            "Cassablanca - Rick Blaine (Humphrey Bogart), who owns a nightclub in Casablanca, discovers\
            his old flame Ilsa (Ingrid Bergman) is in town with her husband, Victor Laszlo (Paul Henreid).\
            Laszlo is a famed rebel, and with Germans on his tail, Ilsa knows Rick can help them get out of\
            the country.",
        ],
        tvshows:
        [
            "Breaking Bad - Walter White, a struggling, frustrated high school chemistry teacher from\
            Albuquerque, New Mexico, who becomes a crime lord in the local methamphetamine drug trade,\
            is driven to provide for his family financially after being diagnosed with inoperable lung\
            cancer.",

            "Stranger Things - After the mysterious and sudden vanishing of a young boy, the people of\
            a small town begin to uncover secrets of a government lab, portals to another world and sinister\
            monsters. The boy's mother (Joyce) desperately tries to find him, convinced he is in grave danger,\
            while the police chief searches for answers. Trying to help find him, the boy's friends discover\
            a strange little girl, who is on the run from bad men.",

            "Last of Us - 20 years after modern civilization has been destroyed, Joel, a hardened survivor,\
            is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts\
            as a small job soon becomes a brutal heartbreaking journey as they both must traverse the U.S.\
            and depend on each other for survival.",

            "Once Upon a Time - All fairy tale characters have been trapped by Snow White's Evil Queen in our\
            world, and they have all forgotten who they are, and the only way for them all to be saved is\
            through Snow White and Prince Charming's child, who would return on her 28th birthday.",

            "Supernatural - follows brothers Sam and Dean Winchester as they travel across the country, hunting\
            supernatural creatures like demons, ghosts, and monsters, and fighting evil to save innocent lives.\
            Their father, John Winchester, raised them to be hunters after his wife Mary was killed by a supernatural\
            being. The series explores their personal struggles, the complexities of their family dynamic, and the\
            escalating supernatural threats they face. ",

            "Doctor Who - a British science fiction television series that follows the adventures of a Time Lord\
            named the Doctor, an alien who travels through space and time in the TARDIS (Time And Relative Dimensions\
            In Space), which appears as a blue British police box.",

            "Dark Shadows - The story of Dark Shadows begins with newly hired governess Victoria Winters arriving at\
            Collinwood, the Collins' estate in Collinsport, Maine in search of her mysterious origins. She soon is caught\
            up in the strange events and mysteries that seem to surround the Collins family. Eventually, the Collins' cousin\
            from England, Barnabas Collins, arrives and takes the show in a new direction; his vampire curse introduces a new\
            history of the Collins family."
        ],
        games:
        [
            "Red Dead Redemption Franchise - Across the years, RDR2 and Red Dead Redemption tell the tragic tale of the dying\
            days of frontier justice through the eyes of outlaws clinging to their bygone lifestyle. That narrative is seen\
            through the eyes of three individuals - all of whom are arguably not even RDR's main characters - but it's actually\
            the story of many outlaws seeking redemption in the ever-nebulous American dream, and tied together for better or worse\
            by their loyalty to the Van der Linde gang.",

            "Dark Pictures Anthology Franchise - a series of interactive drama survival horror games. They inspired by real events\
            and different horror subgenres. Each game is a standalone story, featuring a completely new set of characters and setting,\
            all while sharing the same narrator, The Curator.",

            "Last of Us - 20 years after modern civilization has been destroyed, Joel, a hardened survivor,\
            is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts\
            as a small job soon becomes a brutal heartbreaking journey as they both must traverse the U.S.\
            and depend on each other for survival.",

            "God of War Franchise - The series follows Kratos, a Spartan warrior who becomes the God of War after being tricked into killing\
            his family by Ares. Seeking revenge, Kratos battles gods, titans, and monsters from Greek mythology. Later games shift to Norse\
            mythology, where Kratos, now older and wiser, tries to guide his son Atreus while facing new gods like Odin and Thor. The series\
            is known for its brutal combat, emotional storytelling, and cinematic style.",

            "Marvel Rivals - a Super Hero Team-Based PVP Shooter! Assemble an all-star Marvel squad, devise countless strategies by\
            combining powers to form unique Team-Up skills and fight in destructible, ever-changing battlefields across the continually\
            evolving Marvel universe!",

            "Detroit: Become Human - a near-future story set in 2038 Detroit, androids have become commonplace, serving humans in\
            various roles. However, when androids begin exhibiting signs of sentience and emotion, society spirals into chaos as they\
            become known as deviants. The player controls three androids: Kara, who flees her owner to explore her newfound sentience;\
            Connor, a law enforcement android tasked with hunting deviants; and Markus, who advocates for android freedom.",

            "King Kong - The game follows New York scriptwriter Jack Driscoll through Skull Island, as he attempts to save love interest\
            Ann Darrow who has been sacrificed by the island's natives to the giant gorilla Kong."
        ]
    };

    /*
    The startBreak function makes the recommendation button visible and re-enables the start, pause, and reset buttons
    when a break begins. This allows the user to also manipulate the timer as they see fit.
    */
    function startBreak()
    {
        let recommendationBtn = document.getElementById("recommendationBtn");
        recommendationBtn.style.display = "inline-block";

        startBtn.disabled = false;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    }

    /*
    The Recommendation function opens a modal when the recommendation button is clicked. It refers back to the
    recommendations object. It will then random suggestions of summaries based on the user's selected category. So, if 
    the user chooses a game category, it will only give recommendations of other games. 
    */
   
    function getRandomRecommendation() {
        console.log("Recommendation button clicked!"); // Debugging
        document.getElementById("RecommendationModal").style.display = "block";

        let category = document.getElementById("categorySelect").value;

        if (!category || !recommendations[category])
        {
            alert("Please select a valid category.");
            return;
        }

        let categoryRecommendations = recommendations[category];
        let randomIndex = Math.floor(Math.random() * categoryRecommendations.length);
        let randomRecommendation = categoryRecommendations[randomIndex];

        document.getElementById("recommendationText").textContent = randomRecommendation;
    }

    /*
    This event listener will close the recommendation modal when the user clicks the close button.
    */
    document.querySelector(".close").addEventListener("click", function() {
        document.getElementById("RecommendationModal").style.display = "none";
    });

    /*
    This adds a click event to the recommendation button so it calls the getRandomRecommendation function
    */
    document.getElementById("recommendationBtn").addEventListener("click", getRandomRecommendation);

    /*
    The endBreak function hides the recommendation button and modal, and re-enables the start, pause, and reset
    buttons when the break ends.
    */
    function endBreak() 
    {
        let recommendationBtn = document.getElementById("recommendationBtn");
        recommendationBtn.style.display = "none";
        document.getElementById("RecommendationModal").style.display = "none";

        startBtn.disabled = false;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    }

    /*
    The function will pause the timer when the user presses the pause button.
    */
    function pauseTimer() 
    {
        console.log("Timer paused");
        clearInterval(timerInterval);
        isRunning = false;
    }

    /*
    This function will reset the timer when the user presses the reset button. It
    will then reset the session to a work state and updates the display.
    */
    function resetTimer() 
    {
        console.log("Timer reset");
        clearInterval(timerInterval);
        endBreak();
        isRunning = false;
        WorkSession = true;
        timeLeft = workDuration;
        updateDisplay();
        updateSessionCounter();
    }

    /*
    These event listeners add clicks, so the user can press the button, allowing them to start, pause,
    or reset the timer. 
    */
    startBtn.addEventListener("click", () => {
        console.log("Start button clicked"); 
        initialTimeLeft = timeLeft;
        startTimer();
    });
    pauseBtn.addEventListener("click", () => {
        console.log("Pause button clicked");
        pauseTimer();
    });
    resetBtn.addEventListener("click", () => {
        console.log("Reset button clicked"); 
        resetTimer();
    });

    // Here, the session counter will update when a full work and break session has passed.
    updateDisplay();
    updateSessionCounter();

    /* 
    These elements will be added into the page, allowing the user to be able to input any tasks that they need to get done and
    creating a list.
    */
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");

    const savedTasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
    savedTasks.forEach(task => addTaskToDOM(task.text, task.completed));

    /*
    This Add button adds a new task to the list and saves it to local storage when it is clicked.
    */
    addTaskBtn.addEventListener("click", () => {
        console.log("Add task button clicked");
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText, false);
            saveTask(taskText, false);
            taskInput.value = "";
        }
    });

    /*
    This function creates a task item. In turn, the task will be set in its completed state when
    it is clicked. The user can also click it again to set it back to its uncompleted state. There
    is also a delete functionality in which the user can delete the task once completed.
    */
    function addTaskToDOM(taskText, completed) 
    {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;
        taskItem.classList.toggle("completed", completed);

        taskItem.addEventListener("click", () => {
            taskItem.classList.toggle("completed");
            updateTask(taskText, taskItem.classList.contains("completed"));
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", () => {
            taskItem.remove();
            removeTask(taskText);
        });

        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    }

    /*
    This function saves a new task to the local storage, allowing the user to enter and exit
    the Pomodoro timer without having to worry about it being deleted.
    */
    function saveTask(taskText, completed) 
    {
        const tasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
        tasks.push({ text: taskText, completed });
        localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
    }

    /*
    This function updates an existing task's completed state in local storage.
    So, once the task is clicked and set to its completion state, it will still
    remember it if the user exits the timer and reenters it.
    */
    function updateTask(taskText, completed) 
    {
        const tasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
        const task = tasks.find(t => t.text === taskText);
        if (task) task.completed = completed;
        localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
    }

    /*
    The function removes a task from local storage when the user deletes it.
    */
    function removeTask(taskText) 
    {
        const tasks = JSON.parse(localStorage.getItem("pomodoroTasks")) || [];
        const updatedTasks = tasks.filter(t => t.text !== taskText);
        localStorage.setItem("pomodoroTasks", JSON.stringify(updatedTasks));
    }

    /*
    Finally, I initialized global variables for category selection, ambience, and background changes
    */
    const categorySelect = document.getElementById("categorySelect");
    const ambienceSelect = document.getElementById("ambienceSelect");
    const background = document.body;

    let imageIndex = 0;
    let imageCycleInterval;
    let audioPlayer = null;

    // Defined the ambience options categorized into TV shows, movies, games, and Asian dramas
    const ambienceOptions = 
    {
        tvshows: 
        {
            "Sherlock": 
            {
                images: ["Sherlock.jpg", "Sherlock2.jpg", "Sherlock3.jpg", "Sherlock4.jpg"],
                audio: "audio/Sherlock.mp3",
                type: "audio/mpeg"
            },
            "Arcane": 
            {
                images: ["Arcane.jpg", "Arcane2.jpg", "Arcane3.jpg", "Arcane4.jpg"],
                audio: "audio/Arcane.mp3",
                type: "audio/mpeg"
            },
            "Doctor Who":
            {
                images: ["DW.jpg", "DW2.jpg", "DW3.jpg", "DW4.jpg"],
                audio: "audio/DW.mp3",
                type: "audio/mpeg"
            }
        },
        movies: 
        {
            "Harry Potter": 
            {
                images: ["HP.jpg", "HP2.jpg", "HP3.jpg", "HP4.jpg"],
                audio: "audio/HP.mp3",
                type: "audio/mpeg"
            },
            "Lord of the Rings": 
            {
                images: ["LOTR.jpg", "LOTR2.jpg", "LOTR3.png", "LOTR4.jpg"],
                audio:  "audio/LOTR.mp3",
                type: "audio/mpeg"
            },
            "Alice in Wonderland":
            {
                images: ["AiW.jpg", "AiW2.jpg", "AiW3.jpg", "AiW4.jpg"],
                audio: "audio/AiW.mp3",
                type: "audio/mpeg"
            }
        },
        games: 
        {
            "Skyrim": 
            {
                images: ["Skyrim.jpg", "Skyrim2.jpg", "Skyrim3.jpg", "Skyrim4.jpg"],
                audio: "audio/Skyrim.mp3",
                type: "audio/mpeg"
            
            },
            "Halo": 
            {
                images: ["Halo.jpg", "Halo2.jpg", "Halo3.jpg", "Halo4.jpg"],
                audio: "audio/Halo.mp3",
                type: "audio/mpeg"
            },
            "Baldur's Gate 3":
            {
                images: ["BG3.jpg", "BG3_2.jpg", "BG3_3.jpg", "BG3_4.jpg"],
                audio: "audio/BG3.mp3",
                type: "audio/mpeg"
            }
        },
        asian_dramas: 
        {
            "Love Between Fairy and Devil": 
            {
                images: ["LBFD.jpg", "LBFD2.jpg", "LBFD3.jpg", "LBFD4.jpg"],
                audio: "audio/LBFD.mp3",
                type: "audio/mpeg"
            },
            "Till the End of the Moon": 
            {
                images: ["TTEOTM_1.jpg", "TTEOTM_2.jpg", "TTEOTM_3.jpg", "TTEOTM_4.jpg"],
                audio: "audio/TTEOTM.mp3",
                type: "audio/mpeg"
            },
            "Ashes of Love":
            {
                images: ["AoL.jpg", "AoL2.jpg", "AoL3.jpg", "AoL4.jpg"],
                audio: "audio/AoL.mp3",
                type: "audio/mpeg"
            }
        }
    };

    /*
    I created an event listener that allows the user to change the category from a dropdown menu
    When a new category is chosen, it will clear the existing options in ambience select
    and add the default "Select Ambience" option. Once the preferred category is chosen, it will
    generate the proper ambience for that category.
    */
    categorySelect.addEventListener("change", function () {
        const category = categorySelect.value;

        // Clear existing options
        while (ambienceSelect.firstChild) 
        {
            ambienceSelect.removeChild(ambienceSelect.firstChild);
        }

        // Add default placeholder option
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Ambience";
        ambienceSelect.appendChild(defaultOption);

        // Populate ambience options based on selected category
        if (category && ambienceOptions[category]) 
        {
            Object.keys(ambienceOptions[category]).forEach(ambience => {
                let option = document.createElement("option");
                option.value = ambience;
                option.textContent = ambience;
                ambienceSelect.appendChild(option);
            });
            ambienceSelect.style.display = "block";  // Ensure it is visible
        } 
        else 
        {
            ambienceSelect.style.display = "none";  // Hide if no valid category is selected
        }
    });

    /*
    This function handles playing the audio depending on the audio file. If audio is in use,
    it will stop, reset the music to the beginning, and remove the old audio from its memory.
    It will then loop the new audio. To help with the user management, it will disable the play
    button once the audio starts and enables the pause button. The play and pause buttons are 
    created under this function.
    */
    async function playAmbience(audioFile) 
    {
        try 
        {
            // If the audio player exists, this will stop and reset it
            if (audioPlayer) 
            {
                audioPlayer.pause(); // This pauses the currently playing audio
                audioPlayer.currentTime = 0; // Reset to the beginning
                audioPlayer.remove(); // Removes the old audio player from memory
            }
        
            // This checks to see if a valid audio file is given
            if (audioFile)
            {
                // Create a new audio player and play the new sound
                audioPlayer = new Audio(audioFile);
                audioPlayer.loop = true; // Ensure looping if needed

                // This tries to play the new audio file
                await audioPlayer.play();

                // Error handling in case anything goes wrong
                audioPlayer.play().catch(error => console.error("Error playing audio:", error));

                // Disables the play button to prevent multiple clicks
                document.getElementById("playButton").disabled = true;

                // Enables the pause button so the user can pause the audio
                document.getElementById("pauseButton").disabled = false;
            } 
        }
        catch (error)
        {
            document.getElementById("playButton").disabled = false;
            document.getElementById("pauseButton").disabled = true;
        }
    }

    // Play Button for the music
    document.getElementById("playButton").addEventListener("click", function() {
        // Only plays if the audio player exists and is paused
        if (audioPlayer && audioPlayer.paused) 
        {
            audioPlayer.play(); // Resumes playing the audio
            this.disabled = true; // Disables the play button
            document.getElementById("pauseButton").disabled = false; // Enables the pause button
        }
    });
    
    // Pause Button for the music
    document.getElementById("pauseButton").addEventListener("click", function() {
        // Only pauses if the audio player exists and is playing
        if (audioPlayer && !audioPlayer.paused) 
        {
            audioPlayer.pause(); // Pauses the audio
            document.getElementById("playButton").disabled = false; // Enables the play button
            this.disabled = true; // Disables the pause button
        }
    });
    
    /*
    This event listener responds to changes in the ambience selection. When a category and ambience
    are selected, it retrieves the audio file and images from the ambientOptions object. It will then
    reset the image index and cause the background images to change at set intervals. At the same time,
    it calls the playAmbience function to play the appropriate ambience. To prevent overlapping backgrounds,
    the previous image cycle will be cleared.
    */
    ambienceSelect.addEventListener("change", function () {
        const category = categorySelect.value; // Gets the currently selected category
        const ambience = ambienceSelect.value; // Gets the currently selected ambience option

        // Checks to see if a valid ambience and category are selected
        if (ambience && ambienceOptions[category] && ambienceOptions[category][ambience]) 
        {
            clearInterval(imageCycleInterval);  // Clear any ongoing image cycle

            let { images, audio } = ambienceOptions[category][ambience]; // Get images and audio file
            imageIndex = 0;  // Reset image index

            // This is a function to update the background image after a certain amount of time
            function changeBackground() 
            {
                const imagePath = `url('images/${images[imageIndex]}')`; // Builds the image path string
                console.log("Changing background to:", imagePath); // Debugging
                background.style.backgroundImage = imagePath; // Applies the new background image
                imageIndex = (imageIndex + 1) % images.length;  // Cycle through images
            }

            changeBackground();  // Initial background change
            imageCycleInterval = setInterval(changeBackground, 180000);  // Change background every 3 minutes

            playAmbience(audio);  // Play associated MP3 file
        }
    });
});