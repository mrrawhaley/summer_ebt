function display_question(code) {
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
                last_question.style.display = "none";
            // } else {
            //     last_question.scrollIntoView({behavior: "smooth", block: "start"});
            };
            // document.getElementById("question_navigator").lastElementChild.style.display = "none";
            break;
    };

    // console.log(document.getElementById("question_navigator").childElementCount);
    // if (document.getElementById("question_navigator").childElementCount > 0) {
    //     let last_question = document.getElementById("question_navigator").lastElementChild;
    //     let last_question_code = last_question.id.slice(0 ,3);
    //     console.log(last_question_code);
    //     if (last_question_code != "SCP") {
    //         last_question.style.display = "none";
    //     };
    // };
    
    
    // see if question is already displayed --> if yes, go to it; if not, display question
    let displayed_question_divs = Array.from(document.getElementsByTagName("div"));
    let displayed_question_div_ids = [];
    displayed_question_divs.forEach((question) => {
        displayed_question_div_ids.push(question.id);
    });
    // console.log(displayed_question_div_ids);

    if (displayed_question_div_ids.includes(code + "_div")) {
        document.getElementById(code + "_div").scrollIntoView({behavior: "smooth", block: "start"});
    } else {
        // change next button behaviors
        document.getElementById("next_button").addEventListener("click", determine_eligibility);
        
        // create HTML elements
        let question_container = document.createElement("div");
        question_container.id = code + "_div";
        question_container.className = "response_collector";

        let question_paragraph = document.createElement("p");
        question_paragraph.id = code + "_p";
        question_paragraph.className = "question_text";
        
        let question_display = question_map.get(code).question;

        question_paragraph.innerHTML = question_display;

        let answer_block = document.createElement("p");

        let user_response;

        // organize elements
        question_container.appendChild(question_paragraph);
        question_container.appendChild(answer_block);

        let answers_display = question_map.get(code).answers;
        let input_values = question_map.get(code).answer_values;

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
                        console.log(guideline);
                    };
                });
                // create user_income_guidelines_string object - string containing the pattern "$[amount] per [frequency]" for the six income frequencies
                let user_income_guidelines_string;
                function create_user_income_guidelines_string() {
                    let user_income_guidelines_string_array = [];
                    const usd = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                    });
                    user_income_guidelines.forEach((guideline) => {
                        let dollar_amount = usd.format(guideline["amount"]);
                        let frequency = guideline["income_frequency"];
                        user_income_guidelines_string_array.push(" " + dollar_amount + " " + frequency);
                    });
                    user_income_guidelines_string = user_income_guidelines_string_array.toString();
                };
                create_user_income_guidelines_string();
                let new_INC_question = question_map.get("INC").question.replace(income_guidelines_string_to_replace, user_income_guidelines_string);
                income_guidelines_string_to_replace = user_income_guidelines_string;
                question_map.get("INC").question = new_INC_question;
                });
                question_container.append(INS_input);
                break;
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
                let school_input = Object.assign(document.createElement("input"), {
                    type: "text",
                    id: "SCH_t",
                    class: "school_input_container",
                    name: "SCH",
                    placeholder: "Click here and type the school name",
                    autocomplete: "off"
                });

                // create schools_list object - get names of schools to use later as index for matching
                let schools_list = [];
                schools.forEach((school) => {
                    schools_list.push(school["school"]);
                });

                // display school input
                let school_input_fragment = document.createDocumentFragment();
                school_input_fragment.append(school_input, school_input_warning, school_input_dropdown);
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
                // add non-school response options; "slice(2)" removes NSLP and CEP options/values
                let modified_SCH_answers = Array.from(question_map.get("SCH").answers).slice(2);
                let modified_SCH_answer_values = Array.from(question_map.get("SCH").answer_values).slice(2);
                let modified_SCH_answer_map = new Map();
                for (let i = 0; i < modified_SCH_answers.length; i++) {
                    let temp_input = Object.assign(document.createElement("input"), {
                        type: "radio",
                        id: code + "_" + i.toString(),
                        name: code,
                        value: modified_SCH_answer_values[i]
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
                        for: code + "_" + i.toString(),
                        innerHTML: modified_SCH_answers[i],
                    });
                    question_container.append(temp_label, document.createElement("br"));
                };
                break;
            default:
                for (let i = 0; i < answers_display.length; i++) {
                    let temp_input = document.createElement("input");
                    temp_input.type = question_map.get(code).answer_type;
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
                        // console.log(Array.from(selected_responses));
                        switch(code) {
                            case "SCP":
                            case "SCS":
                                // send selected item objects to temp list --> for each item object, send index to array --> use array to get program names and populate in mSCP
                                let m_list_temp = [];
                                let m_list = [];
                                let m_string = "";
                                let current_outcome_text = outcome_messages[outcome_codes.indexOf("m" + code)];
                                m_list_temp = Array.from(selected_responses);
                                m_list_temp.forEach((program) => {
                                    // m_list.push(Number(program.id.slice(program.id.indexOf("_") + 1)));
                                    let program_index = Number(program.id.slice(program.id.indexOf("_") + 1));
                                    m_list.push(question_map.get(code).answers[program_index]);
                                });
                                m_string = m_list.join(", ");
                                let m_programs_text_to_replace = "";
                                if (code == "SCP") {
                                    m_programs_text_to_replace = "{ programs selected from question }";
                                } else if (code == "SCS") {
                                    m_programs_text_to_replace = "{ statuses selected from question }";
                                };
                                outcome_map.get("m" + code).outcome_text = current_outcome_text.replace(m_programs_text_to_replace, m_string);
                                // console.log(outcome_map.get("m" + code));
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
                        response_map.set(answer_group_name, user_response);
                        response_recode(code);
                    });
                    question_container.append(temp_input);
                    let temp_label = Object.assign(document.createElement("label"), {
                        for: code + "_" + i.toString(),
                        innerHTML: question_map.get(code).answers[i]
                    });
                    question_container.append(temp_label, document.createElement("br"));
                };
            };

            // display elements
            document.getElementById("question_navigator").append(question_container);
            document.getElementById("question_navigator").lastElementChild.scrollIntoView({behavior: "smooth", block: "end"});

            // update position for next question
            navigator_insertion = code + "_div";
        };
    };

    // delete current question to re-answer previous question
    function previous_question() {
        let last_question = document.getElementById("question_navigator").lastElementChild;
        let last_question_code = last_question.id.slice(0 ,3);
        // console.log(last_question_code);
        let next_button_element = document.getElementById("next_button");
        if (eligibility_determined == true) {
            response_map.delete(last_question_code);
            // console.log(Array.from(response_map));
            document.getElementById("question_navigator").lastElementChild.style.display = "block";
            document.getElementById("question_navigator").lastElementChild.scrollIntoView({behavior: "smooth", block: "start"});
            document.getElementById("eligibility_determination").innerHTML = "";
            next_button_element.removeEventListener("click", reset_navigator);
            document.getElementById("next_button").value = "next question";
            document.getElementById("next_button").addEventListener("click", determine_eligibility);
            eligibility_determined = false;
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
    };

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
    // console.log(response_map);
};

function determine_eligibility() {
    let determination = "";
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
        // hide last question
        document.getElementById("question_navigator").lastElementChild.style.display = "none";
        
        // fill out eligibility determination element
        eligibility_determination_element = document.getElementById("eligibility_determination");
        eligibility_determination_element.className = "eligibility";
        eligibility_determination_element.innerHTML = outcome_map.get(determination).outcome_text;
        eligibility_determination_element.scrollIntoView({behavior: "smooth", block: "start"});
        eligibility_determined = true;
        next_button_element.value = "start over";
        next_button_element.removeEventListener("click", determine_eligibility);
        next_button_element.addEventListener("click", reset_navigator);
        // set_next_button();
    } else {
        question_order();
    };
};

function reset_navigator() {
    response_map.clear();
    console.log(response_map.keys);
    eligibility_determined = false;
    navigator_insertion = "question_navigator";
    
    let question_container_names = [];
    let eligibility_determination_div = document.getElementById("eligibility_determination");
    eligibility_determination_div.innerHTML = "";
    codes.forEach((code) => {
        question_container_names.push(code + "_div");
    });
    
    let question_containers = Array.from(document.getElementsByTagName("div"));
    question_containers.forEach((container) => {
        if (question_container_names.includes(container.id)) {
            container.remove();
            console.log(container.id);
        };
    });

    let next_button_element = document.getElementById("next_button");
    next_button_element.value = "next question";
    next_button_element.removeEventListener("click", reset_navigator);

    display_question("SCP");

};

function question_order() {
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

// initialize page
display_question("SCP");
document.getElementById("introduction").scrollIntoView({behavior: "instant", block: "start"});
