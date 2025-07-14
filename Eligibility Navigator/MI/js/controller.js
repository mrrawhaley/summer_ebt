// LANGUAGE SETUP

// get selected language; set to English ("en") by default
const languageSelector = document.getElementById("language-selector");

// load language after 
window.addEventListener("DOMContentLoaded", () => {
    const defaultLang = "en";    // or detect from browser
    selected_language = languageSelector.value;
    languageSelector.value = defaultLang;
    loadLanguage(defaultLang);
});

languageSelector.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    selected_language = languageSelector.value;
    loadLanguage(selectedLang);
});

function loadLanguage(language) {
    // console.log(language);
    document.querySelectorAll("[data-i18n]").forEach(element => {
        var element_name = element.getAttribute("data-i18n");
        var element_code = element_name.slice(0, 3);
        var element_content_type = element_name.slice(4);
        switch (true) {
            case (element.parentNode.id == "introduction"):
                var intro_element = element.getAttribute("data-i18n");
                element.innerHTML = intro[selected_language][intro_element];
                break;
            case element_content_type == "question_text":
                element.innerHTML = questions[element_code].question_text[selected_language];
                break;
            case element_content_type.startsWith("answer"):
                var answer_index = element_content_type.slice(7);
                // console.log(answer_index);
                // console.log(questions[element_code].answers[language][answer_index]);
                element.innerHTML = questions[element_code].answers[selected_language][answer_index];
                break;
            case element_name == "determination":
                if (eligibility_determined == true) {
                    element.innerHTML = outcomes[determination][selected_language]
                };
                break;
            case element.className == "navigation_button":
                let button = element.getAttribute("data-i18n");
                element.value = button_text[button][selected_language];
                break;
            case element.id == "SCH_t":
                element.placeholder = placeholder_text[selected_language];
            default:
                break;
        };
    });
};

// FADE FUNCIONALITY - NOT IN USE
function question_fader(current_question_code, next_question_code) {
    let question_to_fade_out = current_question_code + "_div";
    let question_to_fade_in = next_question_code + "_div";
    console.log(question_to_fade_out);
    question_to_fade_out.classList.add("fade-out");
    setTimeout(() => {
        question_to_fade_out.classList.remove("fade-out");
        question_to_fade_in.classList.add("fade-in")
    }, 500);
};

// QUESTION DISPLAY
// display_question: displays question and answer options
function display_question(code, language) {
    // create code_language variable - concatenated string to retrieve question text from question map
    var language = languageSelector.value;
    // var code_language = code + "_" + language;
    // console.log(code_language);

    // hide previous question
    let question_count = document.getElementById("question_navigator").childElementCount;
    switch(question_count) {
        case 0:
            break;
        default:
            let last_question = document.getElementById("question_navigator").lastElementChild;
            let last_question_code = last_question.id.slice(0, 3);
            console.log(Array.from(response_map.keys()));
            if (Array.from(response_map.keys()).includes(last_question_code)) {
                console.log(Array.from(response_map.keys()).includes(last_question_code));
                // last_question.classList.remove("fade-in");
                // last_question.classList.add("fade-out");
                last_question.style.display = "none";
            } else {
                last_question.scrollIntoView({behavior: "smooth", block: "start"});
            };
            // document.getElementById("question_navigator").lastElementChild.style.display = "none";
            break;
    };

    // see if question is already displayed --> if yes, go to it; if not, display question
    let displayed_question_divs = Array.from(document.getElementsByTagName("div"));
    let displayed_question_div_ids = [];
    displayed_question_divs.forEach((question) => {
        displayed_question_div_ids.push(question.id);
    });
    console.log(displayed_question_div_ids);

    if (displayed_question_div_ids.includes(code + "_div")) {
        document.getElementById(code + "_div").scrollIntoView({behavior: "smooth", block: "start"});
    } else {
        // change next button behaviors
        document.getElementById("next_button").addEventListener("click", determine_eligibility);
        let last_navigator_element = document.getElementById("question_navigator").lastElementChild;
        // if (last_navigator_element.id != "introduction") {
        //     setTimeout(() => {
        //         last_navigator_element.classList.add("fade-out");
        //     }, 500);
        // };
        
        // create HTML elements
        let question_container = Object.assign(document.createElement("div"), {
            id: code + "_div",
            // className: "response_collector"
            className: "response_collector"
        });
        // let question_container = document.createElement("div");
        // question_container.id = code + "_div";
        // question_container.className = "response_collector";

        let question_paragraph = Object.assign(document.createElement("p"), {
            id: code + "_p",
            className: "question_text"
        });
        // let question_paragraph = document.createElement("p");
        // question_paragraph.id = code + "_p";
        // question_paragraph.className = "question_text";
        question_paragraph.setAttribute("data-i18n", code + "_question_text");
        
        let question_display = questions[code].question_text[language];

        question_paragraph.innerHTML = question_display;

        let answer_block = document.createElement("p");

        let user_response;

        // organize elements
        question_container.appendChild(question_paragraph);
        question_container.appendChild(answer_block);

        let answers_display = questions[code].answers[language];
        let input_values = questions[code].answer_values;

        switch(code) {
            case "INS":
                let INS_input = Object.assign(document.createElement("input"), {
                    type: "text",
                    id: "INS_t",
                    name: "INS",
                    size: "2",
                    placeholder: "#",
                    autocomplete: "off"
                });
                INS_input.addEventListener("change", function(event) {
                    response_map.set("INS", INS_input.value)
                    // let string_to_replace = "{ income eligibility threshold lookup for household size }";
                let user_income_guidelines = [];
                income_guidelines.forEach((guideline) => {
                    if (guideline["year"] == SEBT_year && guideline["household_size"] == response_map.get("INS")) {
                        user_income_guidelines.push(guideline);
                        // console.log(guideline);
                    };
                });
                // create user_income_guidelines_string object - string containing the pattern "$[amount] per [frequency]" for the six income frequencies
                // let user_income_guidelines_string_array = [];
                const usd = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });
                languages.forEach((lang) => {
                    let user_income_guidelines_string_array = [];
                    user_income_guidelines.forEach((guideline) => {
                        let dollar_amount = usd.format(guideline["amount"]);
                        let frequency = guideline["income_frequency"];
                        // console.log(user_income_guidelines_string_array);
                        let frequency_translation = income_frequencies[frequency][lang];
                        user_income_guidelines_string_array.push(" " + dollar_amount + " " + frequency_translation);
                    });
                    console.log("Current: " + user_income_guidelines_string_by_lang["current"][lang]);
                    user_income_guidelines_string_by_lang["new"][lang] = user_income_guidelines_string_array.toString();
                    console.log("New: " + user_income_guidelines_string_by_lang["new"][lang]);
                    questions["INC"].question_text[lang] = questions["INC"].question_text[lang].replace(user_income_guidelines_string_by_lang["current"][lang], user_income_guidelines_string_by_lang["new"][lang]);
                    console.log(questions["INC"].question_text[lang]);
                    user_income_guidelines_string_by_lang["current"][lang] = user_income_guidelines_string_by_lang["new"][lang];
                    console.log("Current (updated): " + user_income_guidelines_string_by_lang["current"][lang]);
                    // let frequency_translation = income_frequencies[frequency][lang];
                    // user_income_guidelines_string_array.push(" " + dollar_amount + " " + frequency_translation);
                });

                
                
                
                // let user_income_guidelines_string;
                // function create_user_income_guidelines_string() {
                //     let user_income_guidelines_string_array = [];
                //     const usd = new Intl.NumberFormat('en-US', {
                //         style: 'currency',
                //         currency: 'USD'
                //     });
                //     user_income_guidelines.forEach((guideline) => {
                //         let dollar_amount = usd.format(guideline["amount"]);
                //         let frequency = guideline["income_frequency"];
                //         languages.forEach((lang) => {
                //             let frequency_translation = income_frequencies[frequency][lang];
                //             user_income_guidelines_string_array.push(" " + dollar_amount + " " + frequency_translation);    
                //         });
                //         // let frequency_translation = income_frequencies[frequency][selected_language];
                //         // user_income_guidelines_string_array.push(" " + dollar_amount + " " + frequency_translation);
                //     });
                //     user_income_guidelines_string = user_income_guidelines_string_array.toString();
                // };
                // create_user_income_guidelines_string();
                // languages.forEach((lang) => {
                //     let new_INC_question = questions["INC"].question_text[lang].replace(user_income_guidelines_string_by_lang.get(lang), user_income_guidelines_string);
                //     // replace original string with current string -- if user selects a new household size, then this replaces the previously selected level
                //     user_income_guidelines_string_by_lang.set(lang, user_income_guidelines_string)
                //     // income_guidelines_string_to_replace = user_income_guidelines_string;
                //     questions["INC"].question_text[lang] = new_INC_question;
                //     console.log(questions["INC"].question_text[lang]);
                // });



                // let new_INC_question = questions["INC"].question_text[lang].replace(income_guidelines_string_to_replace, user_income_guidelines_string);
                // income_guidelines_string_to_replace = user_income_guidelines_string;
                // questions["INC"].question_text[language] = new_INC_question;
                });
                question_container.append(INS_input);
                // setTimeout(() => {
                //     question_container.classList.add("fade-in");
                // }, 500);
                // create string_to_replace object - string from Google Sheets navigator builder to replace with income guidelines by household size from question INS
                // START HERE
                // const string_to_replace = "{ income eligibility threshold lookup for household size }";
                // let user_income_guidelines = [];
                // income_guidelines.forEach((guideline) => {
                //     if (guideline["year"] == SEBT_year && guideline["household_size"] == response_map.get("INS")) {
                //         user_income_guidelines.push(guideline);
                //     };
                // });
                // // create user_income_guidelines_string object - string containing the pattern "$[amount] per [frequency]" for the six income frequencies
                // let user_income_guidelines_string;
                // function create_user_income_guidelines_string() {
                //     let user_income_guidelines_string_array = [];
                //     const usd = new Intl.NumberFormat('en-US', {
                //     style: 'currency',
                //     currency: 'USD'
                //     });
                //     user_income_guidelines.forEach((guideline) => {
                //         let dollar_amount = usd.format(guideline["amount"]);
                //         let frequency = guideline["income_frequency"];
                //         user_income_guidelines_string_array.push(" " + dollar_amount + " " + frequency);
                //     });
                //     user_income_guidelines_string = user_income_guidelines_string_array.toString();
                // };
                // create_user_income_guidelines_string();
                // let new_INC_question = question_map.get("INC").question.replace(string_to_replace, user_income_guidelines_string);
                // question_map.get("INC").question = new_INC_question;
                
                break;
            // case "INC":
            //     break;
            case "SCH":
                // create divs for school dropdown
                let school_input_container = Object.assign(document.createElement("div"), {
                    id: "school_input_div"
                });

                let school_input_warning = Object.assign(document.createElement("div"), {
                    id: "school_input_warning_div"
                });

                let school_input_dropdown = Object.assign(document.createElement("div"), {
                    id: "school_input_dropdown_div"
                });
            
                // create school_input object - text input to collect school name
                // let school_input_paragraph = Object.assign(document.createElement("p"), {
                //     id: ""
                // });
                let school_input = Object.assign(document.createElement("input"), {
                    type: "text",
                    id: "SCH_t",
                    class: "school_input_container",
                    name: "SCH",
                    placeholder: placeholder_text[selected_language],
                    autocomplete: "off"
                });
                school_input.setAttribute("data-i18n", "school_placeholder_text")

                // create schools_list object - get names of schools to use later as index for matching
                let schools_list = [];
                schools.forEach((school) => {
                    schools_list.push(school["school"]);
                });
                // // keep unique values only
                // schools_list = Array.from(new Set(schools_list));

                // display school input
                let school_input_fragment = document.createDocumentFragment();
                school_input_fragment.append(school_input, school_input_warning, school_input_dropdown);
                // school_input_container.appendChild(school_input_fragment);
                question_container.append(school_input_fragment, document.createElement("br"));

                // add event listener to show dropdown for school selection
                school_input.addEventListener("input", function () {
                    let query = school_input.value.toLowerCase();
                    school_input_dropdown.innerHTML = null;

                    if (query) {
                        let matches = schools_list.filter(value => 
                            value.toLowerCase().includes(query)
                        );

                        if (matches.length > 0) {
                            school_input_dropdown.style.display = "block";
                            matches.forEach(match => {
                                const item = document.createElement("div");
                                item.textContent = match;
                                item.addEventListener("click", function () {
                                    school_input.value = match; // Set input value
                                    school_input_dropdown.style.display = "none"; // Hide dropdown
                                    school_input_warning.style.display = "none";
                                    // get school value from schools and set value of SCH response
                                    let school_index = schools_list.indexOf(item.textContent);
                                    let school_program_value = schools[school_index].value;
                                    response_map.set(code, school_program_value);
                                    console.log(Array.from(response_map));
                                });
                                school_input_dropdown.appendChild(item);
                            });
                        } else {
                            school_input_dropdown.style.display = "none";
                        }
                    } else {
                        school_input_dropdown.style.display = "none";
                    }
                });

                // Hide dropdown when clicking outside
                document.addEventListener("click", function (event) {
                    // if (!event.target.closest(".school_input_container")) {
                    if (!event.target.closest("#school_input_dropdown_div")) {
                        school_input_dropdown.style.display = "none";
                    }
                });

                // help message if school_input text does not match a school
                school_input.addEventListener("blur", function () {
                    switch (true) {
                        case (!schools_list.includes(school_input.value)):
                            school_input_warning.innerHTML = "Please select a school from the list.";
                            school_input_warning.style.display = "block";
                            break;
                        case school_input.value == "":
                        default:
                            school_input_warning.innerHTML = null;
                            school_input_warning.style.display = "none";
                            break;
                        }
                    }
                );
                // add non-school response options
                // // add non-school response options; "slice(2)" removes NSLP and CEP options/values
                for (let i = 0; i < answers_display.length; i++) {
                    let temp_input = Object.assign(document.createElement("input"), {
                        type: "radio",
                        id: code + "_" + i.toString(),
                        name: code,
                        value: input_values[i]
                    });
                    temp_input.addEventListener("click", function(event) {
                        let answer_group_name = event.target.name;
                        user_response = [];
                        selected_responses = document.querySelectorAll('input[name=' + code + ']:checked');
                        selected_responses.forEach(response => {
                            user_response.push(response.value);
                        });
                        response_map.set(answer_group_name, user_response);
                    });
                    question_container.append(temp_input);
                    temp_label = Object.assign(document.createElement("label"), {
                        innerHTML: questions[code].answers[language][i]
                    });
                    temp_label.setAttribute("for", code + "_" + i.toString());
                    temp_label.setAttribute("data-i18n", code + "_answer_" + i);
                    question_container.append(temp_label, document.createElement("br"));
                };
                // let modified_SCH_answers = Array.from(questions["SCH"].answers[language]).slice(2);
                // let modified_SCH_answer_values = Array.from(questions["SCH"].answer_values).slice(2);
                // let modified_SCH_answer_map = new Map();
                // for (let i = 0; i < modified_SCH_answers.length; i++) {
                //     let temp_input = Object.assign(document.createElement("input"), {
                //         type: "radio",
                //         id: code + "_" + i.toString(),
                //         name: code,
                //         value: modified_SCH_answer_values[i]
                //     });
                //     temp_input.addEventListener("click", function(event) {
                //         let answer_group_name = event.target.name;
                //         user_response = [];
                //         selected_responses = document.querySelectorAll('input[name=' + code + ']:checked');
                //         selected_responses.forEach(response => {
                //             user_response.push(response.value);
                //         });
                //         response_map.set(answer_group_name, user_response);
                //     });
                //     question_container.append(temp_input);
                //     temp_label = Object.assign(document.createElement("label"), {
                //         innerHTML: modified_SCH_answers[i],
                //     });
                //     temp_label.setAttribute("for", code + "_" + i.toString());
                //     question_container.append(temp_label, document.createElement("br"));
                // };
                break;
            default:
                for (let i = 0; i < answers_display.length; i++) {
                    let temp_input = document.createElement("input");
                    temp_input.type = questions[code].answer_type;
                    temp_input.id = code + "_" + i.toString();
                    temp_input.name = code;
                    temp_input.value = input_values[i];
                    // console.log(temp_input.value);
                    // add event listener - if value = 0 then inputs in input group with value > 0 are unchecked (i.e., "I don't know" or "does not apply"-like answers uncheck other answers)
                    temp_input.addEventListener("click", function(event) {
                        let answer_group_name = event.target.name;
                        // console.log(answer_group_name);
                        user_response = [];
                        selected_responses = document.querySelectorAll('input[name=' + code + ']:checked');
                        console.log(Array.from(selected_responses));
                        switch(code) {
                            case "SCP":
                            case "SCS":
                                // send selected item objects to temp list --> for each item object, send index to array --> use array to get program names and populate in mSCP
                                languages.forEach((lang) => {
                                    let m_list_temp = [];
                                    let m_list = [];
                                    let m_string = "";
                                    let current_outcome_text = outcomes["m" + code][lang];
                                    m_list_temp = Array.from(selected_responses);
                                    m_list_temp.forEach((program) => {
                                        // m_list.push(Number(program.id.slice(program.id.indexOf("_") + 1)));
                                        let program_index = Number(program.id.slice(program.id.indexOf("_") + 1));
                                        m_list.push(questions[code].answers[lang][program_index]);
                                        // m_list.push(questions[code].answers[language][program_index]);
                                    });
                                    m_string = m_list.join(", ");
                                    let m_programs_text_to_replace = "";
                                    if (code == "SCP") {
                                        m_programs_text_to_replace = "{ programs selected from question }";
                                    } else if (code == "SCS") {
                                        m_programs_text_to_replace = "{ statuses selected from question }";
                                    };
                                    outcomes["m" + code][lang] = current_outcome_text.replace(m_programs_text_to_replace, m_string);
                                });
                                console.log(outcome_map.get("m" + code));
                                selected_responses.forEach(response => {
                                user_response.push(response.value);
                                });
                                break;
                            default:
                                selected_responses.forEach(response => {
                                    user_response.push(response.value);
                                });
                                break;
                        };
                        // });

                        // OK TO REMOVE COMMENTED CODE BELOW
                        // not sure why it isn't picking up radio button values; code above works fine, maybe "querySelectorAll" is returning only an array?
                        // switch(question_map.get(code_language).answer_type) {
                        //     case "radio":
                        //         selected_response = document.querySelectorAll('input[name=' + code + ']:checked');
                        //         user_response = selected_response.value;
                        //         break;
                        //     case "checkbox":
                        //         // user_response = null;
                        //         user_response = [];
                        //         selected_responses = document.querySelectorAll('input[name=' + code + ']:checked');
                        //         selected_responses.forEach(response => {
                        //             user_response.push(response.value);
                        //         }
                        //         );
                        //         break;
                        //     default:
                        //         break;
                        // }; 
                        // let answer_index = codes.indexOf(answer_group_name);
                        // let answer_value = answer_values[answer_index][user_response];
                        
                        response_map.set(answer_group_name, user_response);
                        response_recode(code);
                        // console.log(response_map);
                    });
                    question_container.append(temp_input);
                    let temp_label = Object.assign(document.createElement("label"), {
                        innerHTML: questions[code].answers[language][i]
                    });
                    temp_label.setAttribute("for", code + "_" + i.toString());
                    temp_label.setAttribute("data-i18n", code + "_answer_" + i);
                    question_container.append(temp_label, document.createElement("br"));
                };
            };

            // display elements
            document.getElementById("question_navigator").append(question_container);
            // console.log(document.getElementById("question_navigator").lastElementChild.id.slice(0, 3));

            // document.getElementById("question_navigator").lastElementChild.scrollIntoView({behavior: "smooth", block: "end"});

            // update position for next question
            navigator_insertion = code + "_div";
        };
    };

    // delete current question to re-answer previous question
    function previous_question() {
        let language = languageSelector.value;
        let last_question = document.getElementById("question_navigator").lastElementChild;
        let last_question_code = last_question.id.slice(0 ,3);
        console.log(last_question_code);
        let next_button_element = document.getElementById("next_button");
        if (eligibility_determined == true) {
            response_map.delete(last_question_code);
            console.log(Array.from(response_map));
            document.getElementById("question_navigator").lastElementChild.style.display = "block";
            document.getElementById("question_navigator").lastElementChild.scrollIntoView({behavior: "smooth", block: "start"});
            document.getElementById("eligibility_determination").innerHTML = "";
            next_button_element.removeEventListener("click", reset_navigator);
            document.getElementById("next_button").value = button_text["next"][language];
            document.getElementById("next_button").addEventListener("click", determine_eligibility);
            eligibility_determined = false;
            determination = "";
        } else {
            if (last_question_code == "SCP") {
                document.querySelectorAll('input[name="SCP"]:checked').forEach((input) => {
                    input.checked = false;
                });
                response_map.delete("SCP");
                // document.querySelectorAll('input[name=' + code + ']:checked');
            } else {
            response_map.delete(last_question_code);
            last_question.remove();
            };
        };
        document.getElementById("question_navigator").lastElementChild.style.display = "block";
        document.getElementById("question_navigator").lastElementChild.scrollIntoView({behavior: "smooth", block: "start"});
    
    // let current_question_code = navigator_insertion.slice(0, 3);
    // let answered_questions = Array.from(response_map.keys());
    // let previous_question_code = answered_questions[answered_questions.length - 1];
    // response_map.delete(previous_question_code);
    // document.getElementById(previous_question_code + "_div").remove();
    // console.log(answered_questions);
};

// school_selector: create input box for school name
// function school_selector() {    
// };

// streamlined cert conditions: X SCP = 1 & ACE = 1 | X SCS = 1 & ACE = 1 | X SCH = 1 & FRP = 1 | X SCP = 1 & SCH = 1 | X SCS = 1 & SCH = 1 | X SCS = 1 & SCH = 2 | X SCM = 1 & INC = 1 & ACE = 1 | X SCM = 1 & INC = 1 & SCH = 1
// application conditions: X SCH = 1 & INC = 1 | X SCM = 1 & INC = 0 | SCM = 1 & INC = 1 & ACE = -1 & SCH = 0

// response_recode: recode responses from arrays to single values
function response_recode(code) {
    let user_response = response_map.get(code);
    switch (code) {
        case "SCP":
            switch (true) {
                case user_response.includes("1"):
                    response_map.set(code, 1);
                    break;
                case (user_response.includes("2") && user_response.length === 1):
                    response_map.set(code, 2);
                    break;
                default:
                    response_map.set(code, 0);
                    break;
            };
            break;
        case "SCS":
            if (user_response.includes("1")) {
                response_map.set(code, 1);
            } else {
                response_map.set(code, 0);
            };
            break;
        default:
            response_map.set(code, Number(user_response[0]));
            break;
    };
    console.log(response_map);
};

function determine_eligibility() {
    let language = languageSelector.value;
    // let determination = "";
    let SCP = response_map.get("SCP");
    let SCS = response_map.get("SCS");
    let ACE = response_map.get("ACE");
    let SCH = response_map.get("SCH");
    let FRP = response_map.get("FRP");
    let INS = response_map.get("INS");
    let INC = response_map.get("INC");
    switch (true) {
        case (SCP == 1 && ACE == 1):
        case (SCP == 1 && ACE == 0 && SCH == 2):
        case (SCP == 2 && ACE == 1 && SCS == 0 && INC == 1):
            determination = "mSCP";
            break;
        case (SCP == 0 && SCS == 1 && ACE == 1):
        case (SCP == 2 && ACE == 1 && SCS == 1):
        case (SCP == 0 && SCS == 1 && ACE == 0 && SCH == 2):
            determination = "mSCS";
            break;
        case (SCP == 0 && SCS == 0 && SCH == 1 && FRP == 1):
        case (SCP == 1 && ACE == 0 && SCH == 1 && FRP == 1):
        case (SCP == 2 && ACE == 0 && SCH == 1 && FRP == 1):
        case (SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1 && FRP == 1):
        case (SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1 && FRP == 1):
            determination = "mFRP";
            break;
        case (SCP == 0 && SCS == 0 && SCH == 2 && INC == 1):
        case (SCP == 0 && SCS == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 1):
        case (SCP == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 1):
        case (SCP == 2 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 1):
        case (SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 1):
        case (SCP == 2 && ACE == 0 && SCH == 2 && INC == 1):
        case (SCP == 2 && SCS == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 1):
            determination = "mELI";
            break;
        case (INC == 2):
            determination = "mUNK";
            break;
        case (SCP == 0 && SCS == 0 && SCH == 0):
        case (SCP == 1 && ACE == 0 && SCH == 0):
        case (SCP == 2 && ACE == 0 && SCH == 0):
        case (SCP == 0 && SCS == 0 && SCH == 2 && INC == 0):
        case (SCP == 0 && SCS == 1 && ACE == 0 && SCH == 0):
        case (SCP == 2 && ACE == 0 && SCH == 2 && INC == 0):
        case (SCP == 0 && SCS == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 0):
        case (SCP == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 0):
        case (SCP == 2 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 0):
        case (SCP == 2 && ACE == 1 && SCS == 0 && INC == 0 && SCH == 0):
        case (SCP == 2 && ACE == 1 && SCS == 0 && INC == 0 && SCH == 2):
        case (SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2) && INC == 0):
        case (SCP == 2 && ACE == 1 && SCS == 0 && INC == 0 && SCH == 1 && (FRP == 0 || FRP == 2)):
            determination = "mNOT";
            break;
        default:
            break;
    };
    let next_button_element = document.getElementById("next_button");
    if (outcome_codes.includes(determination)) {
        eligibility_determination_element = document.getElementById("eligibility_determination");
        eligibility_determination_element.className = "eligibility";
        eligibility_determination_element.innerHTML = outcomes[determination][language];
        eligibility_determination_element.scrollIntoView({behavior: "smooth", block: "end"});
        eligibility_determined = true;
        next_button_element.value = button_text["reset"][language];
        next_button_element.removeEventListener("click", determine_eligibility);
        next_button_element.addEventListener("click", reset_navigator);
        // set_next_button();
    } else {
        question_order();
    };
};

// function set_next_button() {
//     console.log("setting button...")
//     let next_button_element = document.getElementById("next_button");
//     // next_button_element.removeEventListener("click", determine_eligibility);
//     // next_button_element.removeEventListener("click", reset_navigator);
//     if (eligibility_determined == true) {
//         next_button_element.value = "start over";
//         next_button_element.removeEventListener("click", determine_eligibility);
//         next_button_element.addEventListener("click", reset_navigator);
//     } else {
//         next_button_element.value = "next question";
//         next_button_element.removeEventListener("click", reset_navigator);
//         next_button_element.addEventListener("click", determine_eligibility);
//     };
// };

function reset_navigator() {
    response_map.clear();
    console.log(Array.from(response_map.keys()));
    codes.forEach((code) => {
        console.log(code + ": " + response_map.has(code))
    });
    eligibility_determined = false;
    determination = "";
    navigator_insertion = "question_navigator";
    
    let language = languageSelector.value;
    let question_container_names = [];
    let eligibility_determination_div = document.getElementById("eligibility_determination");
    eligibility_determination_div.innerHTML = "";
    codes.forEach((code) => {
        question_container_names.push(code + "_div");
    });
    // console.log(question_container_names.toString());
    
    let question_containers = Array.from(document.getElementsByTagName("div"));
    question_containers.forEach((container) => {
        if (question_container_names.includes(container.id)) {
            container.remove();
            console.log(container.id);
        };
    });

    let next_button_element = document.getElementById("next_button");
    next_button_element.value = button_text["next"][language];
    next_button_element.removeEventListener("click", reset_navigator);

    display_question("SCP");
    document.getElementById("question_navigator").lastElementChild.scrollIntoView({behavior: "instant", block: "start"});
    // set_next_button();

};

function question_order() {
    // determine_eligibility();
    // if (eligibility_determined == false) {
    var next_question_code = "";
    let response_count = response_map.size;
    console.log(response_map.size);
    let SCP = response_map.get("SCP");
    let SCS = response_map.get("SCS");
    let ACE = response_map.get("ACE");
    let SCH = response_map.get("SCH");
    let FRP = response_map.get("FRP");
    let INS = response_map.get("INS");
    let INC = response_map.get("INC");
    switch(true) {
        // for response counts using INC, add one for INS also
        // when to ask SCP -- first question
        case response_count == 0:
            next_question_code = "SCP";
            break;
        // when to ask SCS
        case (response_count == 1 && SCP == 0):
        case (response_count == 2 && SCP == 2 && ACE == 1):
            next_question_code = "SCS"
            break;
        // when to ask ACE
        case (response_count == 2 && SCP == 0 && SCS == 1): 
        case (response_count == 1 && SCP == 1):
        case (response_count == 1 && SCP == 2):
            next_question_code = "ACE";
            break;
        // when to ask SCH
        case (response_count == 2 && SCP == 0 && SCS == 0):
        case (response_count == 3 && SCP == 0 && SCS == 1 && ACE == 0):
        case (response_count == 2 && SCP == 1 && ACE == 0):
        case (response_count == 2 && SCP == 2 && ACE == 0):
        case (response_count == 4 && SCP == 2 && ACE == 1 && SCS == 0 && INC == 0): 
            next_question_code = "SCH";
            break;
        // when to ask FRP
        case (response_count == 3 && SCP == 0 && SCS == 0 && SCH == 1):
        case (response_count == 4 && SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1):
        case (response_count == 3 && SCP == 1 && ACE == 0 && SCH == 1):
        case (response_count == 3 && SCP == 2 && ACE == 0 && SCH == 1):
        case (response_count == 5 && SCP == 2 && ACE == 1 && SCS == 0 && INC == 0 && SCH == 1):
            next_question_code = "FRP";
            break;
        // when to ask INS
        case (response_count == 3 && SCP == 2 && SCS == 0):
        case (response_count == 3 && SCP == 0 && SCS == 0 && SCH == 2):
        case (response_count == 4 && SCP == 0 && SCS == 0 && SCH == 1 && (FRP == 0 || FRP ==2)):
        case (response_count == 5 && SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP ==2)):
        case (response_count == 4 && SCP == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP ==2)):
        case (response_count == 4 && SCP == 2 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP == 2)):
        case (response_count == 6 && SCP == 2 && ACE == 1 && SCS == 0 && INC == 0 && SCH == 1 && (FRP == 0 || FRP ==2)):
        case (response_count == 3 && SCP == 2 && ACE == 0 && SCH == 2):
            next_question_code = "INS";
            break;
        // when to ask INC
        case (response_count == 5 && SCP == 0 && SCS == 0 && SCH == 1 && (FRP == 0 || FRP ==2) && !FRP == []):
        case (response_count == 6 && SCP == 0 && SCS == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP ==2) && !FRP == []):
        case (response_count == 5 && SCP == 1 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP ==2) && !FRP == []):
        case (response_count == 5 && SCP == 2 && ACE == 0 && SCH == 1 && (FRP == 0 || FRP ==2) && !FRP == []):
        case (response_count == 7 && SCP == 2 && ACE == 1 && SCS == 0 && INC == 0 && SCH == 1 && (FRP == 0 || FRP ==2) && !FRP == []):
        case INS != undefined:
            next_question_code = "INC";
            break;
        // }
        // next_question(next_question_code);
    };
    display_question(next_question_code);
};

// function to check responses against current set of questions asked and determine next question or eligibility
// SCP --> SCS if SCP = 0 --> ACE if SCM, SCP = 1, or SCS = 1 --> INC if SCM and ACE = 1 and SCS = 0 or -1 --> SCS if SCM and INC = -1 --> SCH --> FRP --> INC
function next_question(code) {
    if (eligibility_determined == false) {
        display_question(code)
    };
};

// initialize navigator
display_question("SCP");
document.getElementById("introduction").scrollIntoView({behavior: "instant", block: "start"});